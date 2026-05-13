import re

input_file = "./backup/backup_full.sql"
output_file = "./backup/extracted_content.txt"

# Regex to find the start of the posts table data
# UpdraftPlus usually has one big INSERT statement per table or multiple chunks
# We'll look for lines starting with INSERT INTO `wpmq_posts`

with open(input_file, 'rb') as f:
    with open(output_file, 'w', encoding='utf-8') as out:
        for line in f:
            try:
                line_str = line.decode('utf-8', errors='ignore')
                if "INSERT INTO `wpmq_posts`" in line_str:
                    out.write(line_str)
            except:
                continue

print(f"Extracted posts data to {output_file}")
