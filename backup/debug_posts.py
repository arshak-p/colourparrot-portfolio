import re

input_file = "./backup/backup_full.sql"
output_file = "./backup/all_posts_debug.txt"

# We'll extract all titles and types from wpmq_posts
found = []
with open(input_file, 'rb') as f:
    in_posts_table = False
    for line in f:
        try:
            line_str = line.decode('utf-8', errors='ignore')
            if "INSERT INTO `wpmq_posts`" in line_str:
                in_posts_table = True
            
            if in_posts_table:
                # Find titles and types
                # Tuples: (\d+, \d+, '...', '...', '...', 'TITLE', ..., 'STATUS', ..., 'TYPE', ...)
                # This is a very loose regex to catch anything that might be a title and type
                matches = re.finditer(r"\(\d+,\s*\d+,\s*'[^']+',\s*'[^']+',\s*'.*?',\s*'(.*?)',.*?'(publish|inherit|draft|private|trash)',.*?'(post|page|attachment|revision|nav_menu_item)'", line_str)
                for m in matches:
                    title = m.group(1)
                    status = m.group(2)
                    ptype = m.group(3)
                    found.append(f"Title: {title} | Status: {status} | Type: {ptype}")
            
            if in_posts_table and ";" in line_str:
                # End of INSERT
                pass
        except:
            continue

with open(output_file, 'w', encoding='utf-8') as out:
    for item in found:
        out.write(item + "\n")

print(f"Found {len(found)} entries in wpmq_posts.")
