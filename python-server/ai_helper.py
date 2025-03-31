from openai import OpenAI
from config_loader import get_deepseek_key

class AITutor:
    def __init__(self):
        api_key = get_deepseek_key()
        if not api_key:
            raise ValueError("DeepSeek API密钥未配置")

        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com"
        )

    def generate_hint(self, user_code, expected_output, actual_output):
        """生成智能提示"""
        prompt = f"""根据以下信息提供简短的代码提示（1-2句话）：
        - 用户代码：{user_code}
        - 预期输出：{expected_output}
        - 实际输出：{actual_output}
        请指出问题关键，忽略用户代码中注释的部分，不要提供完整代码"""

        return self._call_api(prompt, max_tokens=100)

    def generate_solution(self, user_code, expected_output, actual_output):
        """生成完整解决方案"""
        prompt = f"""根据以下信息提供详细解决方案：
        - 用户代码：{user_code}
        - 预期输出：{expected_output}
        - 实际输出：{actual_output}
        只需要包含正确代码, 不需要解释"""

        return self._call_api(prompt, max_tokens=500)

    def evaluate_code(self, expected_code, user_code, user_output=None):
        """使用AI评估用户代码是否正确实现了预期功能"""
        prompt = f"""请评估用户代码是否正确实现了预期功能：
        - 示例代码：{expected_code}
        - 用户代码：{user_code}
        - 用户代码输出：{user_output}

        请分析两段代码的功能是否等价，不要只关注代码的相似性和返回结果的一致性，而是关注功能的一致性。
        当返回结果相同时，请检查用户代码是否实现了与示例代码相同的功能以及输出的内容是否和上下文产生联系。
        如果用户代码实现了与示例代码相同的功能，请回复：'通过'
        如果用户代码没有实现预期功能，请回复：'不通过，原因：<简要说明原因>'
        """

        result = self._call_api(prompt, max_tokens=200)
        # 检查result是否为None
        if result is None:
            return False
        return str(result).startswith('通过')

    def _call_api(self, prompt, max_tokens=300):
        """调用API核心方法"""
        try:
            response = self.client.chat.completions.create(
                model="deepseek-chat",
                messages=[
                    {"role": "system", "content": "你是一个资深的Python编程助手"},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"无法获取AI建议：{str(e)}"
