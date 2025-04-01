import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Typography, Spin, Tabs, Button, message, Divider, Alert, Badge, Space, Card } from 'antd'
import { Editor } from '@monaco-editor/react'
import {
  PlayCircleOutlined,
  BulbOutlined,
  SolutionOutlined,
  TrophyOutlined
} from '@ant-design/icons'
import api from '../api/index'
import './TutorialView.scss'
import MarkdownRenderer from '../components/MarkdownRenderer'
import stringToUnicode from '../utils/unicode'
const { Title, Text } = Typography

function removeCommentsAndPrompt(code) {
  // 使用正则表达式匹配并移除以 # 开头的行
  return code
    .split('\n')
    .filter((line) => !line.trim().startsWith('# '))
    .join('\n')
}

function addHashToLines(text) {
  // 使用 split('\n') 将文本按行分割成数组
  // 然后使用 map 为每一行开头添加 #
  // 最后用 join('\n') 将数组重新组合成多行文本
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
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'vs-dark' : 'light'
  })

  // 监听主题变化
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme')
          setTheme(newTheme === 'dark' ? 'vs-dark' : 'light')
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  // 获取教程内容
  useEffect(() => {
    const fetchTutorial = async () => {
      setLoading(true)
      try {
        const response = await api.get(`/api/tutorial/${tutorialKey}`)
        setTutorial(response.data)
        // 重置代码块索引
        setCurrentCodeBlockIndex(0)
        // 如果有代码块，设置初始代码
        if (response.data.sections.length > 0 && response.data.sections[0].code_blocks.length > 0) {
          setCode(addHashToLines(response.data.sections[0].code_blocks[0]))
        }

        setLoading(false)
      } catch (error) {
        console.error('获取教程内容失败:', error)
        message.error('获取教程内容失败')
        setLoading(false)
      }
    }

    if (tutorialKey) {
      fetchTutorial()
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
          tutorial.sections[currentSectionIndex].code_blocks[currentCodeBlockIndex]
        )
      })

      setOutput(response.data.output)
      setOutputStatus(response.data.success ? 'success' : 'error')

      if (response.data.ai_evaluation) {
        setEvaluation(response.data.ai_evaluation)

        // 如果代码通过评估，标记为已完成
        if (response.data.ai_evaluation.passed) {
          const exerciseKey = `${tutorialKey}-${currentSectionIndex}-${currentCodeBlockIndex}`
          if (!completedExercises.includes(exerciseKey)) {
            setCompletedExercises([...completedExercises, exerciseKey])
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
          tutorial.sections[currentSectionIndex].code_blocks[currentCodeBlockIndex]
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
          tutorial.sections[currentSectionIndex].code_blocks[currentCodeBlockIndex]
        ),
        actual_output: stringToUnicode(output)
      })

      setCode(removePythonCodeBlockSyntax(response.data.solution))
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
    setCurrentSectionIndex(sectionIndex)
    setCurrentCodeBlockIndex(0)

    if (tutorial.sections[sectionIndex].code_blocks.length > 0) {
      setCode(addHashToLines(tutorial.sections[sectionIndex].code_blocks[0]))
    } else {
      setCode('')
    }

    setOutput('')
    setOutputStatus('idle')
    setEvaluation(null)
    setHintLoading(false)
    setSolutionLoading(false)
  }

  // 切换代码块
  const handleCodeBlockChange = (blockIndex) => {
    setCurrentCodeBlockIndex(blockIndex)
    setCode(addHashToLines(tutorial.sections[currentSectionIndex].code_blocks[blockIndex]))
    setOutput('')
    setOutputStatus('idle')
    setEvaluation(null)
    setHintLoading(false)
    setSolutionLoading(false)
  }

  // 渲染章节内容
  const renderSectionContent = (section) => {
    // 移除代码块，只显示文本内容

    return <MarkdownRenderer content={section.content} />
  }

  // 渲染代码块选择器
  const renderCodeBlockSelector = (section) => {
    if (!section.code_blocks || section.code_blocks.length === 0) {
      return <Alert message="本章节没有代码练习" type="info" />
    }

    return (
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
      <Title level={2}>{tutorial.title}</Title>

      <Tabs
        defaultActiveKey="0"
        onChange={handleSectionChange}
        items={tutorial.sections.map((section, index) => ({
          key: String(index),
          label: section.title,
          children: (
            <div className="section-content">
              {renderSectionContent(section)}
              {renderCodeBlockSelector(section)}

              {section.code_blocks && section.code_blocks.length > 0 && (
                <div className="code-practice-area">
                  <div className="code-editor-container">
                    <Editor
                      height="400px"
                      language="python"
                      theme={theme}
                      value={code}
                      onChange={setCode}
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
                      <p3>输出结果</p3>
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

      <Divider />

      <div className="achievements-section">
        <Title level={4}>学习进度</Title>
        <Card>
          <div className="progress-stats">
            <div className="stat-item">
              <Badge count={completedExercises.length} overflowCount={999} />
              <Text>已完成练习</Text>
            </div>
            <div className="stat-item">
              <Badge
                count={tutorial.sections.reduce((total, section) => {
                  return total + (section.code_blocks ? section.code_blocks.length : 0)
                }, 0)}
                style={{ backgroundColor: '#52c41a' }}
              />
              <Text>总练习数</Text>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TutorialView
