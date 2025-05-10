import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, message, Alert } from 'antd'
import api from '../api/index'

// eslint-disable-next-line react/prop-types
const AISetupModal = ({ visible, onComplete, errorMessage = null }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(errorMessage)
  // 数据初始化
  useEffect(() => {
    ;(async () => {
      try {
        // 从localStorage中获取已保存的设置
        const savedSettings = localStorage.getItem('aiSettings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          form.setFieldsValue(parsedSettings)
          return
        }

        // 如果没有本地保存的设置，尝试从API获取
        const response = await api.getModelKeys()
        if (response.data && response.data.model_key) {
          const { base_url, model, api_key } = response.data.model_key
          // 设置表单值
          form.setFieldsValue({
            baseUrl: base_url !== 'your_base_url' ? base_url : '',
            model: model !== 'your_model_name' ? model : '',
            apiKey: api_key !== 'your_api_key' ? api_key : ''
          })
        }
      } catch (error) {
        console.error('获取模型配置失败:', error)
        // 获取失败时不显示错误，让用户手动输入
      }
    })()
  }, [form, visible])
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)

      // 使用API保存到后端
      const { encrypted_api_key, iv,aes_key} = await encryptAPIKey(values.apiKey)
      const response = await api.setModelKey(values.baseUrl, values.model,encrypted_api_key, aes_key, iv)
      if (response.data.model_key.success) {
        message.success('AI 设置保存成功！')
        // 仍然保存到localStorage以便前端使用
        localStorage.setItem('aiSettings', JSON.stringify(values))
        form.resetFields()
        onComplete(values)
      } else {
        message.error(response.data.model_key.message || '配置失败，请重试')
      }
    } catch (error) {
      console.error('保存失败:', error)
      // 检查是否为401认证错误
      if (error.response && error.response.status === 401) {
        const errorMsg = '认证失败：API密钥无效，请重新输入有效的API密钥'
        setError(errorMsg)
        message.error(errorMsg)
      } else {
        setError('配置失败: ' + (error.message || '未知错误'))
        message.error('配置失败: ' + (error.message || '未知错误'))
      }
    } finally {
      setLoading(false)
    }
  }

  // 当接收到新的错误消息时更新状态
  useEffect(() => {
    if (errorMessage) {
      setError(errorMessage)
    }
  }, [errorMessage, form])

  return (
    <Modal
      title={error ? '重新配置 AI 设置' : '首次使用 AI 功能设置'}
      open={visible}
      onOk={handleSubmit}
      confirmLoading={loading}
      closable={false}
      maskClosable={false}
      keyboard={false}
      okText="确认"
      footer={(_, { OkBtn }) => (
        <>
          <OkBtn />
        </>
      )}
    >
      {error && (
        <Alert
          message="认证错误"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      <Form form={form} layout="vertical">
        <Form.Item
          name="baseUrl"
          label="AI 域名"
          rules={[{ required: true, message: '请输入 AI 域名' }]}
        >
          <Select
            showSearch
            placeholder="https://api.deepseek.com"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            options={[
              { value: 'https://api.deepseek.com', label: 'https://api.deepseek.com' },
              { value: 'https://api.openai.com', label: 'https://api.openai.com' },
              { value: 'https://api.chatanywhere.tech', label: 'https://api.chatanywhere.tech' }
            ]}
          />
        </Form.Item>
        <Form.Item
          name="model"
          label="AI 模型"
          rules={[{ required: true, message: '请选择 AI 模型' }]}
        >
          <Select
            showSearch
            placeholder="deepseek V3"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          >
            <Select.Option value="gpt-3.5-turbo">GPT-3.5 Turbo</Select.Option>
            <Select.Option value="gpt-4">GPT-4</Select.Option>
            <Select.Option value="deepseek-chat">deepseek V3</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="apiKey"
          label="API 密钥"
          rules={[
            { required: true, message: '请输入 API 密钥' },
            { min: 32, message: '请输入有效的 API 密钥' }
          ]}
        >
          <Input.Password placeholder="请输入您的 API 密钥" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

async function encryptAPIKey(apiKey) {
    // 输入验证
    if (typeof apiKey !== 'string' || apiKey.length === 0) {
        throw new Error('API Key必须是非空字符串');
    }
  
    try {
        // 1. 生成随机的AES密钥（256 位）
        const aesKey = await crypto.subtle.generateKey(
            { name: "AES-CBC", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        console.log('生成的AES密钥:', aesKey);
    
        // 2. 导出AES密钥
        const exportedAesKey = await crypto.subtle.exportKey("raw", aesKey);
        const aesKeyBytes = new Uint8Array(exportedAesKey);
        console.log('导出的AES密钥 (Uint8Array):', aesKeyBytes);
    
        // 3. 生成随机IV（16字节）
        const iv = crypto.getRandomValues(new Uint8Array(16));
        console.log('生成的IV (Uint8Array):', iv);
    
        // 4. 使用AES加密API Key
        const encryptedApiKey = await crypto.subtle.encrypt(
            { name: "AES-CBC", iv },
            aesKey,
            new TextEncoder().encode(apiKey)
        );
        console.log('加密后的API Key (ArrayBuffer):', encryptedApiKey);
        if (!encryptedApiKey) {
            throw new Error('AES加密API Key失败，结果为空');
        }
    
        // 5. 将所有数据转换为 base64 编码的字符串
        return {
            encrypted_api_key: arrayBufferToBase64(encryptedApiKey),
            aes_key: arrayBufferToBase64(aesKeyBytes),  // 直接发送AES密钥（确保传输是安全的）
            iv: arrayBufferToBase64(iv.buffer)  // 确保iv是ArrayBuffer类型
        };
    
    } catch (error) {
        console.error("加密过程失败:", {
            apiKeyLength: apiKey.length,
            error: error.message
        });
        throw new Error(`加密失败: ${error.message}`);
    }
}

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export default AISetupModal
