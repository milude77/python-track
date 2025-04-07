import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Tabs, Button, message, Divider, Alert, Badge, Space, Card } from 'antd'
import { Editor } from '@monaco-editor/react'
import {
  PlayCircleOutlined,
  BulbOutlined,
  SolutionOutlined,
  TrophyOutlined,
  SaveOutlined,
  ImportOutlined
} from '@ant-design/icons'
import api from '../api/index'
import './TutorialView.scss'
import MarkdownRenderer from '../components/MarkdownRenderer'
import stringToUnicode from '../utils/unicode'
import { monaco } from '../monaco-config'
// 导入IPC API，用于状态持久化
const { Title, Text } = Typography

function removeCommentsAndPrompt(code) {
  // 使用正则表达式匹配并移除以 # 开头的行
  return code
    .split('\n')
    .filter((line) => !line.trim().startsWith('# '))
    .join('\n')
}

function addHashToLines(text, isDemo = false) {
  // 使用 split('\n') 将文本按行分割成数组
  // 然后使用 map 为每一行开头添加 #
  // 最后用 join('\n') 将数组重新组合成多行文本
  if (isDemo) return ''
  return (
    text
      .split('\n')
      .map((line) => '# ' + line)
      .join('\n') + '\n# 在下方输入你的代码'
  )
}

function removePythonCodeBlockSyntax(code) {
  // 使用正则表达式匹配并移除 Python 代码块语法
  return code.replace(/```python[\s\S]*?```/g, (match) => {
    // 移除代码块标记，只保留代码内容
    return match.replace(/```python|```/g, '').trim()
  })
}
const TutorialView = () => {
  const { tutorialKey } = useParams()
  const [tutorial, setTutorial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [currentCodeBlockIndex, setCurrentCodeBlockIndex] = useState(0)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState('')
  const [outputStatus, setOutputStatus] = useState('idle') // idle, running, success, error
  const [evaluation, setEvaluation] = useState(null)
  const [completedExercises, setCompletedExercises] = useState([])
  const [hintLoading, setHintLoading] = useState(false) // 获取提示的加载状态
  const [solutionLoading, setSolutionLoading] = useState(false) // 查看解决方案的加载状态
  const [theme, setTheme] = useState(() => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    return monaco.getThemeName(isDark)
  })

  // 加载已完成的练习列表
  useEffect(() => {
    ; (async () => {
      try {
        if (window.ipcApi && window.ipcApi.getCompletedExercises) {
          const savedExercises = await window.ipcApi.getCompletedExercises()
          if (savedExercises && savedExercises.length > 0) {
            setCompletedExercises(savedExercises)
          }
        }
      } catch (error) {
        console.error('加载已完成练习列表失败:', error)
      }
    })()
  }, [])

  // 监听主题变化
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme')
          const isDark = newTheme === 'dark'
          setTheme(monaco.getThemeName(isDark))
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  // 初始化代码编辑器内容的辅助函数
  const initializeCodeEditor = async (tutorialData, sectionIndex, blockIndex) => {
    // 确保索引在有效范围内
    const validSectionIndex = Math.min(sectionIndex, tutorialData['sections'].length - 1)

    // 设置章节索引
    setCurrentSectionIndex(validSectionIndex)
    if (tutorialData.title === '代码演练') {
      tutorialData['sections'][validSectionIndex]['code_blocks'] = ['']
    }
    // 检查该章节是否有代码块
    if (
      tutorialData['sections'][validSectionIndex] &&
      tutorialData['sections'][validSectionIndex]['code_blocks'] &&
      tutorialData['sections'][validSectionIndex]['code_blocks'].length > 0
    ) {
      // 确保代码块索引在有效范围内
      const validBlockIndex = Math.min(
        blockIndex,
        tutorialData['sections'][validSectionIndex]['code_blocks'].length - 1
      )

      // 设置代码块索引
      setCurrentCodeBlockIndex(validBlockIndex)

      // 尝试从持久化存储中获取保存的代码内容
      let codeContent
      if (window.ipcApi && window.ipcApi.getCodeEditorContent) {
        try {
          const savedCode = await window.ipcApi.getCodeEditorContent(
            tutorialData.title,
            validSectionIndex,
            validBlockIndex
          )

          // 如果有保存的代码，使用保存的代码
          if (savedCode) {
            codeContent = savedCode
          } else {
            // 否则使用默认代码
            codeContent = addHashToLines(
              tutorialData['sections'][validSectionIndex]['code_blocks'][validBlockIndex],
              tutorialData.title === '代码演练'
            )
          }
        } catch (error) {
          console.error('获取保存的代码内容失败:', error)
          // 出错时使用默认代码
          codeContent = addHashToLines(
            tutorialData['sections'][validSectionIndex]['code_blocks'][validBlockIndex],
            tutorialData.title === '代码演练'
          )
        }
      } else {
        // 如果API不可用，使用默认代码
        codeContent = addHashToLines(
          tutorialData['sections'][validSectionIndex]['code_blocks'][validBlockIndex],
          tutorialData.title === '代码演练'
        )
      }

      // 设置代码编辑器内容
      setCode(codeContent)

      // 更新CodeBlockManager，分析代码中的类和函数
      if (window.codeBlockManager) {
        window.codeBlockManager.setCurrentBlock(codeContent)
      }
    } else {
      // 如果没有代码块，重置代码块索引和代码内容
      setCurrentCodeBlockIndex(0)
      setCode('')

      // 清空CodeBlockManager
      if (window.codeBlockManager) {
        window.codeBlockManager.setCurrentBlock('')
      }
    }
  }

  // 获取教程内容
  useEffect(() => {
    if (tutorialKey) {
      // 保存当前选中的教程
      ;(async () => {
        setLoading(true)
        // 重置输出和状态，确保切换教程时清空之前的输出结果
        setOutput('')
        setOutputStatus('idle')
        setEvaluation(null)
        setHintLoading(false)
        setSolutionLoading(false)

        try {
          const response = await api.get(`/api/tutorial/${tutorialKey}`)
          setTutorial(response.data)

          // 从持久化存储中获取教程状态
          if (window.ipcApi && window.ipcApi.getTutorialState) {
            try {
              const savedState = await window.ipcApi.getTutorialState(tutorialKey)
              if (savedState) {
                // 使用保存的状态初始化代码编辑器
                initializeCodeEditor(
                  response.data,
                  savedState.currentSectionIndex || 0,
                  savedState.currentCodeBlockIndex || 0
                )
              } else {
                // 如果没有保存的状态，使用默认值
                initializeCodeEditor(response.data, 0, 0)
              }
            } catch (stateError) {
              console.error('获取保存的教程状态失败:', stateError)
              // 出错时使用默认值
              initializeCodeEditor(response.data, 0, 0)
            }
          } else {
            // 如果IPC API不可用，使用默认值
            initializeCodeEditor(response.data, 0, 0)
          }

          setLoading(false)
        } catch (error) {
          console.error('获取教程内容失败:', error)
          message.error('获取教程内容失败')
          setLoading(false)
        }
      })()
    }
  }, [tutorialKey])

  // 运行代码
  const runCode = async () => {
    setOutputStatus('running')
    setOutput('')
    setEvaluation(null)

    try {
      const response = await api.post('/api/run-code', {
        code: stringToUnicode(code),
        expected_code: stringToUnicode(
          tutorial['sections'][currentSectionIndex]['code_blocks'][currentCodeBlockIndex]
        )
      })

      setOutput(response.data.output)
      setOutputStatus(response.data.success ? 'success' : 'error')

      if (response.data['ai_evaluation']) {
        setEvaluation(response.data['ai_evaluation'])

        // 如果代码通过评估，标记为已完成
        if (response.data['ai_evaluation'].passed) {
          const exerciseKey = `${tutorialKey}-${currentSectionIndex}-${currentCodeBlockIndex}`
          if (!completedExercises.includes(exerciseKey)) {
            // 更新本地状态
            const updatedExercises = [...completedExercises, exerciseKey]
            setCompletedExercises(updatedExercises)

            // 保存到持久化存储
            if (window.ipcApi && window.ipcApi.addCompletedExercise) {
              window.ipcApi
                .addCompletedExercise(exerciseKey)
                .then(() => {
                  console.log('已保存练习完成状态')
                })
                .catch((error) => {
                  console.error('保存练习完成状态失败:', error)
                })
            }

            message.success('恭喜！你已完成这个练习！')
          }
        }
      }
    } catch (error) {
      console.error('运行代码失败:', error)
      setOutput('运行代码失败: ' + error.message)
      setOutputStatus('error')
    }
  }

  // 获取提示
  const getHint = async () => {
    setHintLoading(true)
    try {
      const response = await api.post('/api/hint', {
        code: stringToUnicode(removeCommentsAndPrompt(code)),
        expected_code: stringToUnicode(
          tutorial['sections'][currentSectionIndex]['code_blocks'][currentCodeBlockIndex]
        ),
        actual_output: stringToUnicode(output)
      })

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
          tutorial['sections'][currentSectionIndex]['code_blocks'][currentCodeBlockIndex]
        ),
        actual_output: stringToUnicode(output)
      })

      setCode(removePythonCodeBlockSyntax(response.data['solution']))
      message.success('已加载解决方案')
    } catch (error) {
      console.error('获取解决方案失败:', error)
      message.error('获取解决方案失败')
    } finally {
      setSolutionLoading(false)
    }
  }

  // 切换章节
  const handleSectionChange = (sectionIndex) => {
    // 使用辅助函数初始化代码编辑器，章节变化时代码块索引重置为0
    initializeCodeEditor(tutorial, sectionIndex, 0)

    // 重置输出和状态
    setOutput('')
    setOutputStatus('idle')
    setEvaluation(null)
    setHintLoading(false)
    setSolutionLoading(false)

    // 保存当前章节状态，包括所有索引
    if (window.ipcApi && window.ipcApi.setTutorialState && tutorialKey) {
      window.ipcApi
        .setTutorialState(tutorialKey, {
          currentSectionIndex: sectionIndex,
          currentSubSectionIndex: 0,
          currentCodeBlockIndex: 0,
          sectionCodeBlockIndex: 0,
          subSectionCodeBlockIndex: 0
        })
        .catch((error) => {
          console.error('保存章节状态失败:', error)
        })
    }
  }

  // 切换代码块
  const handleCodeBlockChange = (blockIndex) => {
    // 使用辅助函数初始化代码编辑器，保持当前章节不变
    initializeCodeEditor(tutorial, currentSectionIndex, blockIndex)

    setOutput('')
    setOutputStatus('idle')
    setEvaluation(null)
    setHintLoading(false)
    setSolutionLoading(false)

    // 保存当前代码块状态，包括所有索引
    if (window.ipcApi && window.ipcApi.setTutorialState && tutorialKey) {
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

  // 渲染章节内容
  const renderSectionContent = (section) => {
    // 移除代码块，只显示文本内容

    return <MarkdownRenderer content={section.content} />
  }

  // 渲染代码块选择器
  const renderCodeBlockSelector = (section) => {
    if (!section['code_blocks'] || section['code_blocks'].length === 0) {
      return <Alert message="本章节没有代码练习" type="info" />
    }

    return (
      tutorial['title'] !== '代码演练' && (
        <div className="code-block-selector">
          <Title level={4}>代码练习</Title>
          <Space wrap>
            {section['code_blocks'].map((_, index) => {
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
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <Text>加载教程内容...</Text>
      </div>
    )
  }

  if (!tutorial) {
    return <Alert message="未找到教程内容" type="error" />
  }

  return (
    <div className="tutorial-view">
      {tutorial['title'] !== '代码演练' && <Title level={2}>{tutorial.title}</Title>}

      {tutorial['title'] === '代码演练' ? (
        // 直接渲染第一个section的内容
        <div className="section-content">
          {renderSectionContent(tutorial['sections'][0])}
          <Divider orientation="left" orientationMargin="0">
            <Typography.Text strong style={{ fontSize: '16px' }}>
              🚀 编写代码 &gt;&gt;&gt;
            </Typography.Text>
          </Divider>
          {tutorial['sections'][0]['code_blocks'] &&
            tutorial['sections'][0]['code_blocks'].length > 0 && (
              <div className="code-practice-area">
                <div className="code-editor-container">
                  <Editor
                    height="400px"
                    language="python"
                    theme={theme}
                    value={code}
                    onChange={(newCode) => {
                      setCode(newCode)
                      if (window.codeBlockManager) {
                        window.codeBlockManager.setCurrentBlock(newCode)
                      }

                      // 保存代码内容到持久化存储
                      if (window.ipcApi && window.ipcApi.setCodeEditorContent && tutorialKey) {
                        window.ipcApi
                          .setCodeEditorContent(
                            tutorial.title,
                            0, // 代码演练模式下只有一个section
                            0, // 代码演练模式下只有一个代码块
                            newCode
                          )
                          .catch((error) => {
                            console.error('保存代码内容失败:', error)
                          })
                      }
                    }}
                    loading={<Spin size="large" />}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                </div>

                <div className="code-actions">
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={runCode}
                    loading={outputStatus === 'running'}
                  >
                    运行代码
                  </Button>

                  <Button
                    icon={<ImportOutlined />}
                    onClick={() => {
                      if (window.ipcApi && window.ipcApi.importCodeFromFile) {
                        window.ipcApi
                          .importCodeFromFile()
                          .then((result) => {
                            if (result.success) {
                              setCode(result.code)
                              if (window.codeBlockManager) {
                                window.codeBlockManager.setCurrentBlock(result.code)
                              }
                              message.success(`已导入文件: ${result.filePath}`)

                              // 保存导入的代码到持久化存储
                              if (
                                window.ipcApi &&
                                window.ipcApi.setCodeEditorContent &&
                                tutorialKey
                              ) {
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
                              message.error(result.message || '导入失败')
                            }
                          })
                          .catch((error) => {
                            console.error('导入代码失败:', error)
                            message.error('导入代码失败')
                          })
                      } else {
                        message.error('导入功能不可用')
                      }
                    }}
                  >
                    导入
                  </Button>

                  <Button
                    icon={<SaveOutlined />}
                    onClick={() => {
                      if (window.ipcApi && window.ipcApi.saveCodeToFile) {
                        window.ipcApi
                          .saveCodeToFile(code)
                          .then((result) => {
                            if (result.success) {
                              message.success(`代码已保存到: ${result.filePath}`)
                            } else {
                              message.error(result.message || '保存失败')
                            }
                          })
                          .catch((error) => {
                            console.error('保存代码失败:', error)
                            message.error('保存代码失败')
                          })
                      } else {
                        message.error('保存功能不可用')
                      }
                    }}
                  >
                    另存为
                  </Button>
                </div>

                {output && (
                  <div className={`code-output ${outputStatus}`}>
                    <Text className="output-tag">输出结果</Text>
                    <pre>{output.trim()}</pre>
                  </div>
                )}
              </div>
            )}
        </div>
      ) : (
        <Tabs
          activeKey={String(currentSectionIndex)}
          onChange={handleSectionChange}
          items={tutorial['sections'].map((section, index) => ({
            key: String(index),
            label: section.title,
            children: (
              <div className="section-content">
                {renderSectionContent(section)}
                {renderCodeBlockSelector(section)}

                {section['code_blocks'] && section['code_blocks'].length > 0 && (
                  <div className="code-practice-area">
                    <div className="code-editor-container">
                      <Editor
                        height="400px"
                        language="python"
                        theme={theme}
                        value={code}
                        onChange={(newCode) => {
                          // 更新代码状态
                          setCode(newCode)
                          // 更新CodeBlockManager，分析代码中的类和函数
                          if (window.codeBlockManager) {
                            window.codeBlockManager.setCurrentBlock(newCode)
                          }

                          // 保存代码内容到持久化存储
                          if (window.ipcApi && window.ipcApi.setCodeEditorContent && tutorialKey) {
                            window.ipcApi
                              .setCodeEditorContent(
                                tutorialKey,
                                currentSectionIndex,
                                currentCodeBlockIndex,
                                newCode
                              )
                              .catch((error) => {
                                console.error('保存代码内容失败:', error)
                              })
                          }
                        }}
                        loading={<Spin size="large" />}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          scrollBeyondLastLine: false,
                          automaticLayout: true
                        }}
                      />
                    </div>

                    <div className="code-actions">
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={runCode}
                        loading={outputStatus === 'running'}
                      >
                        运行代码
                      </Button>

                      <Button icon={<BulbOutlined />} onClick={getHint} loading={hintLoading}>
                        获取提示
                      </Button>

                      <Button
                        icon={<SolutionOutlined />}
                        onClick={getSolution}
                        loading={solutionLoading}
                      >
                        查看解决方案
                      </Button>
                    </div>

                    {output && (
                      <div className={`code-output ${outputStatus}`}>
                        <Text className="output-tag">输出结果</Text>
                        <pre>{output.trim()}</pre>
                      </div>
                    )}

                    {evaluation && (
                      <div className="evaluation-result">
                        {evaluation.passed ? (
                          <Alert
                            message="代码评估通过"
                            description="恭喜！你的代码实现了预期功能。"
                            type="success"
                            showIcon
                          />
                        ) : (
                          <Alert
                            message="代码评估未通过"
                            description="你的代码还需要调整，请参考提示进行修改。"
                            type="warning"
                            showIcon
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          }))}
        />
      )}

      {tutorial['title'] !== '代码演练' && <Divider />}

      {tutorial['title'] !== '代码演练' && (
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
                  count={tutorial['sections'].reduce((total, section) => {
                    return total + (section['code_blocks'] ? section['code_blocks'].length : 0)
                  }, 0)}
                  style={{ backgroundColor: '#52c41a' }}
                />
                <Text>总练习数</Text>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default TutorialView
