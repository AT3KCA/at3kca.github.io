#!/bin/bash

# 设置输出文件
output_file="htp_files_summary.txt"

# 清空或创建输出文件
> "$output_file"

# 查找所有的 .java 文件并处理
find . -name "*.htp" -type f | while read -r file; do
    # 写入文件名
    echo "$file" >> "$output_file"
    # 写入文件内容
    cat "$file" >> "$output_file"
    # 添加空行分隔
    echo >> "$output_file"
done

echo "所有 HTP 文件已汇总到 $output_file"
