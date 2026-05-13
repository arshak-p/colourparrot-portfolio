input_file = "./backup/backup_full.sql"
output_file = "./backup/posts_definition.txt"

with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
    for i, line in enumerate(f):
        if i >= 23125 and i < 23225:
            with open(output_file, 'a', encoding='utf-8') as out:
                out.write(line)
        if i >= 23225:
            break

print(f"Read lines 23126 to 23226 to {output_file}")
