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

def get_deepseek_key():
    """获取DeepSeek API密钥"""
    config = load_config()
    return config.get('deepseek', 'api_key', fallback=os.getenv("DEEPSEEK_API_KEY"))