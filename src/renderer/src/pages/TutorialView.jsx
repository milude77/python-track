import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Tabs, Button, message, Divider, Alert, Badge, Space, Card } from 'antd'
import { Editor } from '@monaco-editor/react'
import {
  PlayCircleOutlined,
  BulbOutlined,
  SolutionOutlined,
  TrophyOutlined,
  ImportOutlined,
  SaveOutlined
} from '@ant-design/icons'
import api from '../api/index'
import './TutorialView.scss'
import MarkdownRenderer from '../components/MarkdownRenderer'
import stringToUnicode from '../utils/unicode'
import { monaco } from '../monaco-config'

const { Title, Text } = Typography

// 工具函数：移除代码中的注释和提示
function removeCommentsAndPrompt(code) {
  return code
    .split('\n')
    .filter((line) => !line.trim().startsWith('# '))
    .join('\n')
}

// 工具函数：为代码添加行号和提示信息
function addHashToLines(text, isDemo = false) {
  if (isDemo) return ''
  return (
    text
      .split('\n')
      .map((line) => '# ' + line)
      .join('\n') + '\n# 在下方输入你的代码'
  )
}

// 工具函数：移除Python代码块的语法标记
function removePythonCodeBlockSyntax(code) {
  return code.replace(/```python[\s\S]*?```/g, (match) => {
    return match.replace(/```python|```/g, '').trim()
  })
}

const TutorialView = () => {
  // 状态管理
  const { tutorialKey } = useParams()
  const [tutorial, setTutorial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentCodeBlockIndex, setCurrentCodeBlockIndex] = useState(0)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [outputStatus, setOutputStatus] = useState('idle') // 状态：idle, running, success, error
  const [evaluation, setEvaluation] = useState(null)
  const [completedExercises, setCompletedExercises] = useState([])
  const [hintLoading, setHintLoading] = useState(false)
  const [solutionLoading, setSolutionLoading] = useState(false)

  // 主题状态管理
  const [theme, setTheme] = useState(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    return monaco.getThemeName(isDark)
  })

  // 初始化已完成练习列表
  useEffect(() => {
    const loadCompletedExercises = async () => {
      try {
        if (window.ipcApi?.getCompletedExercises) {
          const savedExercises = await window.ipcApi.getCompletedExercises()
          if (savedExercises?.length > 0) {
            setCompletedExercises(savedExercises)
          }
        }
      } catch (error) {
        console.error('加载已完成练习列表失败:', error)
      }
    }
    loadCompletedExercises().then()
  }, [])

  // 监听主题变化
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme')
          setTheme(monaco.getThemeName(newTheme === 'dark'))
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  // 初始化代码编辑器内容
  const initializeCodeEditor = async (tutorialData, sectionIndex, blockIndex) => {
    const validSectionIndex = Math.min(sectionIndex, tutorialData.sections.length - 1)
    setCurrentSectionIndex(validSectionIndex)

    // 处理代码演练模式
    if (tutorialData.title === '代码演练') {
      tutorialData.sections[validSectionIndex].code_blocks = ['']
    }

    // 验证并设置代码块
    const section = tutorialData.sections[validSectionIndex]
    if (section?.code_blocks?.length > 0) {
      const validBlockIndex = Math.min(blockIndex, section.code_blocks.length - 1)
      setCurrentCodeBlockIndex(validBlockIndex)

      // 尝试加载保存的代码
      let codeContent
      if (window.ipcApi?.getCodeEditorContent) {
        try {
          const savedCode = await window.ipcApi.getCodeEditorContent(
            tutorialData.title,
            validSectionIndex,
            validBlockIndex
          )
          codeContent =
            savedCode ||
            addHashToLines(section.code_blocks[validBlockIndex], tutorialData.title === '代码演练')
        } catch (error) {
          console.error('获取保存的代码内容失败:', error)
          codeContent = addHashToLines(
            section.code_blocks[validBlockIndex],
            tutorialData.title === '代码演练'
          )
        }
      } else {
        codeContent = addHashToLines(
          section.code_blocks[validBlockIndex],
          tutorialData.title === '代码演练'
        )
      }

      setCode(codeContent)
      window.codeBlockManager?.setCurrentBlock(codeContent)
    } else {
      setCurrentCodeBlockIndex(0)
      setCode('')
      window.codeBlockManager?.setCurrentBlock('')
    }
  }

  // 加载教程内容
  useEffect(() => {
    const loadTutorial = async () => {
      if (!tutorialKey) return

      setLoading(true)
      resetState()

      try {
        const response = await api.get(`/api/tutorial/${tutorialKey}`)
        setTutorial(response.data)

        // 初始化教程状态
        if (window.ipcApi?.getTutorialState) {
          try {
            const savedState = await window.ipcApi.getTutorialState(tutorialKey)
            if (savedState) {
              await initializeCodeEditor(
                response.data,
                savedState.currentSectionIndex || 0,
                savedState.currentCodeBlockIndex || 0
              )
            } else {
              await initializeCodeEditor(response.data, 0, 0)
            }
          } catch (error) {
            console.error('获取保存的教程状态失败:', error)
            await initializeCodeEditor(response.data, 0, 0)
          }
        } else {
          await initializeCodeEditor(response.data, 0, 0)
        }
      } catch (error) {
        console.error('获取教程内容失败:', error)
        message.error('获取教程内容失败')
      } finally {
        setLoading(false)
      }
    }

    loadTutorial().then()
  }, [tutorialKey])

  // 重置状态
  const resetState = () => {
    setOutput('')
    setOutputStatus('idle')
    setEvaluation(null)
    setHintLoading(false)
    setSolutionLoading(false)
  }

  // 运行代码
  const runCode = async () => {
    setOutputStatus('running')
    resetState()

    try {
      // 预检查AI服务状态
      const preResponse = await api.post('/api/hint', {
        code: stringToUnicode(removeCommentsAndPrompt(code)),
        expected_code: stringToUnicode(
          tutorial.sections[currentSectionIndex].code_blocks[currentCodeBlockIndex]
        ),
        actual_output: stringToUnicode(output)
      })

      checkAIServiceResponse(preResponse.data.hint)

      // 运行代码
      const response = await api.post('/api/run-code', {
        code: stringToUnicode(code),
        expected_code: stringToUnicode(
          tutorial.sections[currentSectionIndex].code_blocks[currentCodeBlockIndex]
        )
      })

      handleRunCodeResponse(response.data)
    } catch (error) {
      console.error('运行代码失败:', error)
      setOutput('运行代码失败: ' + error.message)
      setOutputStatus('error')
    }
  }

  // 处理代码运行响应
  const handleRunCodeResponse = (data) => {
    setOutput(data.output)
    setOutputStatus(data.success ? 'success' : 'error')

    if (data['ai_evaluation']) {
      setEvaluation(data['ai_evaluation'])
      if (data['ai_evaluation'].passed) {
        handleExerciseCompletion().then()
      }
    }
  }

  // 检查AI服务响应
  const checkAIServiceResponse = (response) => {
    if (response.includes('无法获取AI建议：Error code: 40')) {
      window.dispatchEvent(
        new CustomEvent('ai-auth-error', {
          detail: { error: 'AI模型或密钥失效，请重新配置！' }
        })
      )
    }
    if (response.includes('无法获取AI建议：Connection error.')) {
      window.dispatchEvent(
        new CustomEvent('ai-auth-error', {
          detail: { error: 'AI域名失效，请重新配置！' }
        })
      )
    }
  }

  // 处理练习完成
  const handleExerciseCompletion = async () => {
    const exerciseKey = `${tutorialKey}-${currentSectionIndex}-${currentCodeBlockIndex}`
    if (!completedExercises.includes(exerciseKey)) {
      const updatedExercises = [...completedExercises, exerciseKey]
      setCompletedExercises(updatedExercises)

      if (window.ipcApi?.addCompletedExercise) {
        try {
          await window.ipcApi.addCompletedExercise(exerciseKey)
          message.success('恭喜！你已完成这个练习！')
        } catch (error) {
          console.error('保存练习完成状态失败:', error)
        }
      }
    }
  }

  // 获取提示
  const getHint = async () => {
    setHintLoading(true)
    try {
      const response = await api.post('/api/hint', {
        code: stringToUnicode(removeCommentsAndPrompt(code)),
        expected_code: stringToUnicode(
          tutorial.sections[currentSectionIndex].code_blocks[currentCodeBlockIndex]
        ),
        actual_output: stringToUnicode(output)
      })
      checkAIServiceResponse(response.data.hint)
      message.info(response.data.hint)
    } catch (error) {
      console.error('获取提示失败:', error)
      message.error('获取提示失败')
    } finally {
      setHintLoading(false)
    }
  }

  // 获取解决方案
  const getSolution = async () => {
    setSolutionLoading(true)
    try {
      const response = await api.post('/api/solution', {
        code: stringToUnicode(code),
        expected_code: stringToUnicode(
          tutorial.sections[currentSectionIndex].code_blocks[currentCodeBlockIndex]
        ),
        actual_output: stringToUnicode(output)
      })
      checkAIServiceResponse(response.data['solution'])
      setCode(removePythonCodeBlockSyntax(response.data['solution']))
      message.success('已加载解决方案')
    } catch (error) {
      console.error('获取解决方案失败:', error)
      message.error('获取解决方案失败')
    } finally {
      setSolutionLoading(false)
    }
  }

  // 渲染函数组件
  const renderComponents = {
    // 渲染章节内容
    sectionContent: (section) => <MarkdownRenderer content={section.content} />,

    // 渲染代码块选择器
    codeBlockSelector: (section) => {
      if (!section.code_blocks?.length) {
        return <Alert message="本章节没有代码练习" type="info" />
      }

      return (
        tutorial.title !== '代码演练' && (
          <div className="code-block-selector">
            <Title level={4}>代码练习</Title>
            <Space wrap>
              {section.code_blocks.map((_, index) => {
                const exerciseKey = `${tutorialKey}-${currentSectionIndex}-${index}`
                const isCompleted = completedExercises.includes(exerciseKey)

                return (
                  <Button
                    key={index}
                    type={currentCodeBlockIndex === index ? 'primary' : 'default'}
                    onClick={() => handleCodeBlockChange(index)}
                    icon={isCompleted ? <TrophyOutlined /> : null}
                  >
                    练习 {index + 1}
                  </Button>
                )
              })}
            </Space>
          </div>
        )
      )
    },

    // 渲染代码编辑器
    codeEditor: (height = '400px') => (
      <Editor
        height={height}
        language="python"
        theme={theme}
        value={code}
        onChange={handleCodeChange}
        loading={<Spin size="large" />}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    ),

    // 渲染代码操作按钮
    // 渲染代码操作按钮
    codeActions: (isCodePractice = false) => (
      <div className="code-actions">
        <Button
          type="primary"
          icon={<PlayCircleOutlined />}
          onClick={runCode}
          loading={outputStatus === 'running'}
        >
          运行代码
        </Button>

        {isCodePractice ? (
          // 代码演练模式的按钮
          <>
            <Button
              icon={<ImportOutlined />}
              onClick={() => {
                if (window.ipcApi?.importCodeFromFile) {
                  window.ipcApi
                    .importCodeFromFile()
                    .then((result) => {
                      if (result.success) {
                        setCode(result.code)
                        if (window.codeBlockManager) {
                          window.codeBlockManager.setCurrentBlock(result.code)
                        }
                        message.success(`已导入文件: ${result.filePath}`).then()

                        // 保存导入的代码到持久化存储
                        if (window.ipcApi?.setCodeEditorContent && tutorialKey) {
                          window.ipcApi
                            .setCodeEditorContent(
                              tutorial.title,
                              0, // 代码演练模式下只有一个section
                              0, // 代码演练模式下只有一个代码块
                              result.code
                            )
                            .catch((error) => {
                              console.error('保存导入的代码内容失败:', error)
                            })
                        }
                      } else {
                        message.error(result.message || '导入失败').then()
                      }
                    })
                    .catch((error) => {
                      console.error('导入代码失败:', error)
                      message.error('导入代码失败').then()
                    })
                } else {
                  message.error('导入功能不可用').then()
                }
              }}
            >
              导入
            </Button>

            <Button
              icon={<SaveOutlined />}
              onClick={() => {
                if (window.ipcApi?.saveCodeToFile) {
                  window.ipcApi
                    .saveCodeToFile(code)
                    .then((result) => {
                      if (result.success) {
                        message.success(`代码已保存到: ${result.filePath}`).then()
                      } else {
                        message.error(result.message || '保存失败').then()
                      }
                    })
                    .catch((error) => {
                      console.error('保存代码失败:', error)
                      message.error('保存代码失败').then()
                    })
                } else {
                  message.error('保存功能不可用').then()
                }
              }}
            >
              另存为
            </Button>
          </>
        ) : (
          // 普通教程模式的按钮
          <>
            <Button icon={<BulbOutlined />} onClick={getHint} loading={hintLoading}>
              获取提示
            </Button>
            <Button icon={<SolutionOutlined />} onClick={getSolution} loading={solutionLoading}>
              查看解决方案
            </Button>
          </>
        )}
      </div>
    ),

    // 渲染输出结果
    output: () =>
      output && (
        <div className={`code-output ${outputStatus}`}>
          <Text className="output-tag">输出结果</Text>
          <pre>{output.trim()}</pre>
        </div>
      ),

    // 渲染评估结果
    evaluation: () =>
      evaluation && (
        <div className="evaluation-result">
          <Alert
            message={evaluation.passed ? '代码评估通过' : '代码评估未通过'}
            description={
              evaluation.passed
                ? '恭喜！你的代码实现了预期功能。'
                : '你的代码还需要调整，请参考提示进行修改。'
            }
            type={evaluation.passed ? 'success' : 'warning'}
            showIcon
          />
        </div>
      )
  }

  // 处理代码变更
  const handleCodeChange = (newCode) => {
    setCode(newCode)
    window.codeBlockManager?.setCurrentBlock(newCode)

    // 保存代码到持久化存储
    if (window.ipcApi?.setCodeEditorContent && tutorialKey) {
      window.ipcApi
        .setCodeEditorContent(tutorial.title, currentSectionIndex, currentCodeBlockIndex, newCode)
        .catch((error) => {
          console.error('保存代码内容失败:', error)
        })
    }
  }

  // 处理章节切换
  const handleSectionChange = (sectionIndex) => {
    initializeCodeEditor(tutorial, sectionIndex, 0).then()
    resetState()

    // 保存章节状态
    if (window.ipcApi?.setTutorialState && tutorialKey) {
      window.ipcApi
        .setTutorialState(tutorialKey, {
          currentSectionIndex: sectionIndex,
          currentCodeBlockIndex: 0
        })
        .catch((error) => {
          console.error('保存章节状态失败:', error)
        })
    }
  }

  // 处理代码块切换
  const handleCodeBlockChange = (blockIndex) => {
    initializeCodeEditor(tutorial, currentSectionIndex, blockIndex).then()
    resetState()

    // 保存代码块状态
    if (window.ipcApi?.setTutorialState && tutorialKey) {
      window.ipcApi
        .setTutorialState(tutorialKey, {
          currentSectionIndex,
          currentCodeBlockIndex: blockIndex
        })
        .catch((error) => {
          console.error('保存代码块状态失败:', error)
        })
    }
  }

  // 渲染加载状态
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>加载教程内容...</Text>
      </div>
    )
  }

  // 验证教程内容
  if (!tutorial) {
    return <Alert message="未找到教程内容" type="error" />
  }

  // 渲染主要内容
  const renderMainContent = () => {
    if (tutorial.title === '代码演练') {
      return (
        <div className="section-content">
          {renderComponents.sectionContent(tutorial.sections[0])}
          <Divider orientation="left" orientationMargin="0">
            <Typography.Text strong style={{ fontSize: '16px' }}>
              🚀 编写代码 &gt;&gt;&gt;
            </Typography.Text>
          </Divider>
          <div className="code-practice-area">
            <div className="code-editor-container">{renderComponents.codeEditor('auto')}</div>
            {renderComponents.codeActions(true)} {/* 传入 true 表示是代码演练模式 */}
            {renderComponents.output()}
          </div>
        </div>
      )
    }

    return (
      <Tabs
        activeKey={String(currentSectionIndex)}
        onChange={handleSectionChange}
        items={tutorial.sections.map((section, index) => ({
          key: String(index),
          label: section.title,
          children: (
            <div className="section-content">
              {renderComponents.sectionContent(section)}
              {renderComponents.codeBlockSelector(section)}
              {section.code_blocks?.length > 0 && (
                <div className="code-practice-area">
                  <div className="code-editor-container">{renderComponents.codeEditor()}</div>
                  {renderComponents.codeActions()}
                  {renderComponents.output()}
                  {renderComponents.evaluation()}
                </div>
              )}
            </div>
          )
        }))}
      />
    )
  }

  return (
    <div className="tutorial-view">
      {tutorial.title !== '代码演练' && <Title level={2}>{tutorial.title}</Title>}

      {renderMainContent()}

      {tutorial.title !== '代码演练' && (
        <>
          <Divider />
          <div className="achievements-section">
            <Title level={4}>学习进度</Title>
            <Card>
              <div className="progress-stats">
                {completedExercises.filter((exercise) => exercise.startsWith(`${tutorialKey}-`))
                  .length > 0 && (
                  <div className="stat-item">
                    <Badge
                      count={
                        completedExercises.filter((exercise) =>
                          exercise.startsWith(`${tutorialKey}-`)
                        ).length
                      }
                      overflowCount={999}
                    />
                    <Text>已完成练习</Text>
                  </div>
                )}
                <div className="stat-item">
                  <Badge
                    count={tutorial.sections.reduce(
                      (total, section) => total + (section.code_blocks?.length || 0),
                      0
                    )}
                    style={{ backgroundColor: '#52c41a' }}
                  />
                  <Text>总练习数</Text>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default TutorialView
