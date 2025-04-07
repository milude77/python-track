#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Python代码跟练系统

这个工具允许用户根据Markdown教程进行代码跟练，提供即时反馈和评估
使用方法：
    python code_practice.py [教程名称]
    如果不提供参数，将显示可用的教程列表
"""

import sys
import os
import re
import traceback
from pathlib import Path
from ai_helper import AITutor
# 教程映射表
TUTORIALS = {
    "演练广场": "chapter00.md",
    "基础知识": "chapter01.md",
    "Python序列": "chapter02.md",
    "选择与循环": "chapter03.md",
    "字符串与正则表达式": "chapter04.md",
    "函数的设计和使用": "chapter05.md",
    "面向对象程序设计": "chapter06.md",
    "文件操作": "chapter07.md",
    "异常处理": "chapter08.md",
    "模块和包": "chapter09.md",
    "网络编程": "chapter10.md",
    "多线程编程": "chapter11.md",
}

# 颜色代码
COLORS = {
    "HEADER": "\033[95m",
    "BLUE": "\033[94m",
    "GREEN": "\033[92m",
    "YELLOW": "\033[93m",
    "RED": "\033[91m",
    "ENDC": "\033[0m",
    "BOLD": "\033[1m",
    "UNDERLINE": "\033[4m"
}


def print_colored(text, color):
    """打印彩色文本"""
    print(f"{COLORS[color]}{text}{COLORS['ENDC']}")


def print_section(title):
    """打印章节标题"""
    print("\n" + "=" * 50)
    print(f"{title:^50}")
    print("=" * 50 + "\n")


def print_usage():
    """打印使用说明"""
    print_section("Python代码跟练系统")
    print("使用方法:")
    print("  python code_practice.py [教程名称]")
    print("\n可用的教程:")
    for key, value in TUTORIALS.items():
        print(f"  {key}: {value.split('.')[0].split('_')[1]}")
    print("\n示例:")
    print("  python code_practice.py basic  # 学习基础语法")


def extract_code_blocks(md_content):
    """从Markdown内容中提取Python代码块"""
    pattern = r'```python\n(.+?)\n```'
    return re.findall(pattern, md_content, re.DOTALL)


def extract_sections(md_content):
    """从Markdown内容中提取章节"""
    sections = []
    current_section = {"title": "", "content": "", "code_blocks": []}

    lines = md_content.split('\n')
    for line in lines:
        if line.startswith('## '):
            if current_section["title"]:
                sections.append(current_section)
            current_section = {"title": line[3:], "content": line + '\n', "code_blocks": []}
        elif line.startswith('### '):
            current_section["content"] += line + '\n'
        else:
            current_section["content"] += line + '\n'

    if current_section["title"]:
        sections.append(current_section)

    # 提取每个章节中的代码块
    for section in sections:
        section["code_blocks"] = extract_code_blocks(section["content"])

    return sections


def run_code(code):
    """运行用户输入的代码并捕获输出和错误"""
    # 创建一个临时的本地命名空间
    local_vars = {}

    try:
        # 重定向标准输出以捕获print输出
        import io
        from contextlib import redirect_stdout

        f = io.StringIO()
        with redirect_stdout(f):
            exec(code, globals(), local_vars)

        output = f.getvalue()
        return True, output, local_vars
    except Exception as e:
        error_msg = traceback.format_exc()
        return False, error_msg, local_vars


def evaluate_code(expected_code, user_code, expected_output=None):
    """评估用户代码是否正确实现了预期功能"""
    # 运行用户代码
    success, user_output, user_vars = run_code(user_code)

    if not success:
        print_colored("代码运行出错:", "RED")
        print(user_output)
        return False

    # 如果有预期输出，检查输出是否匹配
    if expected_output and expected_output.strip() != user_output.strip():
        print_colored("输出与预期不符:", "YELLOW")
        print_colored(f"预期输出:\n{expected_output}", "GREEN")
        print_colored(f"实际输出:\n{user_output}", "RED")
        # 即使输出不匹配，也交给AI进行最终判断

    # 使用AI评估代码
    try:
        ai_tutor = AITutor()
        ai_result = ai_tutor.evaluate_code(expected_code, user_code, user_output)

        if ai_result:
            return True
        else:
            print_colored("AI评估结果: 代码功能实现不正确", "YELLOW")
            return False
    except Exception as e:
        print_colored(f"AI评估失败，回退到传统评估方式: {str(e)}", "YELLOW")

        # 回退到传统评估方式
        # 检查关键变量
        expected_success, _, expected_vars = run_code(expected_code)
        if not expected_success:
            # 如果示例代码有错误，我们只检查输出
            return True

        # 检查关键变量是否存在并且值相同
        for var_name, var_value in expected_vars.items():
            if var_name not in user_vars:
                print_colored(f"缺少变量: {var_name}", "YELLOW")
                return False
            if user_vars[var_name] != var_value:
                print_colored(f"变量 {var_name} 的值不正确:", "YELLOW")
                print_colored(f"预期值: {var_value}", "GREEN")
                print_colored(f"实际值: {user_vars[var_name]}", "RED")
                return False

        return True


def practice_code_block(code_block, block_index, section_blocks=None, current_block_index=None):
    """让用户练习一个代码块"""
    print_colored(f"\n代码练习 #{block_index}:", "HEADER")
    print_colored("示例代码:", "BLUE")
    print(code_block)
    # 初始化AI助手
    try:
        ai_tutor = AITutor()
    except Exception as e:
        print_colored(f"AI功能初始化失败: {str(e)}", "RED")
        ai_tutor = None
    # 创建临时文件供用户编辑
    temp_file_path = Path(__file__).parent / "practice_temp.py"

    # 写入初始注释和示例代码
    with open(temp_file_path, 'w', encoding='utf-8') as f:
        f.write(f"""# 代码练习 #{block_index}
# 请在此文件中编写你的代码
# 完成后保存文件，然后回到终端按Enter键执行
# 输入' skip '跳过, ' hint '获取提示, ' solution '查看解决方案

# 示例代码:
"""
)
        f.write(f"""'''
{code_block}
'''

# 在下方编写你的代码:

""")

    print_colored(f"\n已创建临时文件: {temp_file_path}", "BLUE")
    print_colored("请在该文件中编写你的代码，完成后保存文件，然后回到这里按Enter键执行", "BOLD")

    while True:  # 主循环：处理用户输入和代码评估
        print_colored("(输入'skip'跳过, 'hint'获取提示, 'solution'查看解决方案, 'evaluate'重新评估, 'back'返回上一题, 'exit'或'quit'退出):", "BOLD")
        command = input().lower()

        if command == 'skip':
            print_colored("已跳过此练习。\n", "YELLOW")
            with open(temp_file_path, 'w') as f:
                f.write("")
            return
        elif command in ['exit', 'quit']:
            print_colored("已退出练习模式。\n", "YELLOW")
            with open(temp_file_path, 'w') as f:
                f.write("")
            sys.exit(0)
        elif command == 'hint':
            if ai_tutor:
                # 获取用户当前代码，指定编码为utf-8
                with open(temp_file_path, 'r', encoding='utf-8') as f:
                    current_code = f.read()

                # 运行代码获取实际输出
                _, actual_output, _ = run_code(current_code)

                # 生成智能提示
                hint = ai_tutor.generate_hint(
                    user_code=current_code,
                    expected_output=code_block,
                    actual_output=actual_output
                )
                print_colored("\nAI提示:", "BLUE")
                print(hint)
            else:
                print_colored("提示功能不可用", "YELLOW")

        elif command == 'back':
            # 检查是否有上一个代码块可以返回
            if section_blocks and current_block_index is not None and current_block_index > 0:
                print_colored("返回到上一个练习。\n", "YELLOW")
                with open(temp_file_path, 'w') as f:
                    f.write("")
                # 返回特殊值，表示需要返回上一个代码块
                return "back"
            else:
                print_colored("没有上一个练习可以返回。\n", "YELLOW")

        elif command == 'evaluate':
            if ai_tutor:
                # 获取用户当前代码
                with open(temp_file_path, 'r', encoding='utf-8') as f:
                    current_code = f.read()

                # 提取有效代码部分
                lines = current_code.split('\n')
                actual_code_lines = []
                in_code_section = False
                for line in lines:
                    if line.strip() == "# 在下方编写你的代码:":
                        in_code_section = True
                        continue
                    if in_code_section and not (line.startswith("# ") or line.startswith("'''")):
                        actual_code_lines.append(line)

                user_code = '\n'.join(actual_code_lines).strip()

                if not user_code:
                    print_colored("没有代码可以评估。\n", "YELLOW")
                    continue

                # 运行代码获取实际输出
                success, output, _ = run_code(user_code)

                if not success:
                    print_colored("\n代码运行出错:", "RED")
                    print(output)
                    continue

                print_colored("\n代码运行成功!", "GREEN")
                print_colored("输出:", "BLUE")
                print(output)

                # 使用AI评估代码
                if evaluate_code(code_block, user_code, output):
                    print_colored("\nAI评估: 代码功能实现正确\n", "GREEN")
                else:
                    print_colored("\nAI评估: 代码需要调整，请修改后重新运行\n", "YELLOW")
            else:
                print_colored("评估功能不可用", "YELLOW")

        elif command == 'solution':
            if ai_tutor:
                # 获取用户当前代码，指定编码为utf-8
                with open(temp_file_path, 'r', encoding='utf-8') as f:
                    current_code = f.read()

                _, actual_output, _ = run_code(current_code)

                solution = ai_tutor.generate_solution(
                    user_code=current_code,
                    expected_output=code_block,
                    actual_output=actual_output
                )
                print_colored("\nAI解决方案:", "GREEN")
                print(solution)

                # 将解决方案写入临时文件，指定编码为utf-8
                with open(temp_file_path, 'w', encoding='utf-8') as f:
                    f.write(f"# AI生成解决方案\n{solution}")
            else:
                print_colored("解决方案功能不可用", "YELLOW")
        elif command == '':
            # 内部循环：处理代码执行和评估
            while True:
                try:
                    with open(temp_file_path, 'r', encoding='utf-8') as f:
                        user_code = f.read()

                    # 提取有效代码部分
                    lines = user_code.split('\n')
                    actual_code_lines = []
                    in_code_section = False
                    for line in lines:
                        if line.strip() == "# 在下方编写你的代码:":
                            in_code_section = True
                            continue
                        if in_code_section and not (line.startswith("# ") or line.startswith("'''")):
                            actual_code_lines.append(line)

                    user_code = '\n'.join(actual_code_lines).strip()

                    if not user_code:
                        print_colored("没有输入代码，已跳过。\n", "YELLOW")
                        with open(temp_file_path, 'w') as f:
                            f.write("")
                        return

                    # 运行并评估代码
                    success, output, _ = run_code(user_code)

                    if success:
                        print_colored("\n代码运行成功!", "GREEN")
                        print_colored("输出:", "BLUE")
                        print(output)

                        if evaluate_code(code_block, user_code):
                            print_colored("\n恭喜! 你的代码实现了预期功能。\n", "GREEN")
                            print_colored("AI评估: 代码功能实现正确", "GREEN")
                            with open(temp_file_path, 'w') as f:
                                f.write("")
                            return
                        else:
                            print_colored("\n代码需要调整，请修改后重新运行（按Enter）", "YELLOW")
                            break  # 返回主循环
                    else:
                        print_colored("\n代码运行出错:", "RED")
                        print(output)
                        print_colored("\n请修改后重新运行（按Enter）", "YELLOW")
                        break  # 返回主循环

                except Exception as e:
                    print_colored(f"文件读取错误: {e}", "RED")
                    break
        else:
            print_colored("无效指令，请重新输入", "RED")


def practice_section(section):
    """让用户练习一个章节的内容"""
    print_section(section["title"])

    # 显示章节内容（不包括代码块）
    content_without_code = re.sub(r'```python\n.+?\n```', '', section["content"], flags=re.DOTALL)
    print(content_without_code)

    # 如果有代码块，让用户练习
    if section["code_blocks"]:
        i = 0
        while i < len(section["code_blocks"]):
            result = practice_code_block(section["code_blocks"][i], i+1,
                                        section["code_blocks"], i)
            # 如果返回值是"back"，则返回上一个代码块
            if result == "back":
                i = max(0, i-1)  # 确保索引不会小于0
            else:
                i += 1

    input("按Enter键继续...")


def practice_tutorial(tutorial_key):
    """让用户练习特定教程"""
    if tutorial_key not in TUTORIALS:
        print_colored(f"错误: 未找到教程 '{tutorial_key}'", "RED")
        print_usage()
        return

    # 读取Markdown文件
    md_file = Path(__file__).parent / "notes" / TUTORIALS[tutorial_key]
    if not md_file.exists():
        print_colored(f"错误: 未找到Markdown文件 '{md_file}'", "RED")
        return

    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # 提取章节
    sections = extract_sections(md_content)

    # 显示教程标题
    title = md_content.split('\n')[0].lstrip('#').strip()
    print_section(title)

    # 介绍
    print("欢迎来到Python代码跟练系统!")
    print("本系统将引导你学习并实践Python编程。")
    print("对于每个代码示例，你将有机会自己编写代码并获得即时反馈。")
    print("\n指令:")
    print("- 输入'skip'跳过当前练习")
    print("- 输入'hint'获取提示")
    print("- 输入'solution'查看解决方案")
    print("- 输入'evaluate'重新评估当前代码")
    print("- 输入'back'返回到上一个练习")
    print("- 输入'done'完成代码输入并运行")
    print("\n让我们开始吧!")
    input("按Enter键继续...")

    # 逐章节练习
    for section in sections:
        practice_section(section)

    # 完成教程
    print_section(f"{title} - 完成!")
    print("恭喜你完成了本教程的学习和练习!")
    print("继续学习其他教程，或尝试创建自己的Python项目来巩固所学知识。")


def main():
    """主函数"""
    if len(sys.argv) < 2:
        print_usage()
        return

    tutorial_key = sys.argv[1].lower()
    practice_tutorial(tutorial_key)


if __name__ == "__main__":
    main()
