from configparser import ConfigParser
import os

def load_config():
    """加载配置文件"""
    config = ConfigParser()
    config_path = os.path.join(os.path.dirname(__file__), 'config.ini')

    if not os.path.exists(config_path):
        raise FileNotFoundError("配置文件 config.ini 未找到")

    config.read(config_path)
    return config

def get_api_key():
    """获取DeepSeek API密钥"""
    config = load_config()
    model_name = config.sections()[0] if config.sections() else "deepseek-chat"
    return config.get(model_name, 'api_key')

def get_base_url():
    """获取DeepSeek API密钥"""
    config = load_config()
    model_name = config.sections()[0] if config.sections() else "deepseek-chat"
    try:
        base_url = config.get(model_name, 'base_url')
        if not base_url or base_url == 'your_base_url':
            return "https://api.deepseek.com"
        return base_url
    except:
        return "https://api.deepseek.com"
