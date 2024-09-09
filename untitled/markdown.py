import os
import markdown

def generate_file_structure(root_dir):
    structure = []
    for root, dirs, files in os.walk(root_dir):
        level = root.replace(root_dir, '').count(os.sep)
        indent = ' ' * 4 * (level)
        structure.append(f'{indent}{os.path.basename(root)}/')
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            structure.append(f'{subindent}{f}')
    return '\n'.join(structure)

def read_file_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

def generate_markdown(root_dir):
    md_content = "# Project Structure\n\n```\n"
    md_content += generate_file_structure(root_dir)
    md_content += "\n```\n\n# File Contents\n\n"

    for root, dirs, files in os.walk(root_dir):
        for file in files:
            file_path = os.path.join(root, file)
            md_content += f"## {file}\n\n```\n"
            md_content += read_file_content(file_path)
            md_content += "\n```\n\n"

    return md_content

def save_markdown(content, output_file):
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(content)

# 使用示例
root_directory = "/path/to/your/project"
output_file = "project_overview.md"

md_content = generate_markdown(root_directory)
save_markdown(md_content, output_file)

print(f"Markdown file generated: {output_file}")

# 向AI提问的示例
question = "请分析这个项目的整体结构和主要功能。"
print(f"\n向AI提问:\n{question}")
print("\n请将生成的Markdown文件内容和上述问题一起发送给AI进行分析。")