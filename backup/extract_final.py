import re

input_file = "./backup/extracted_content.txt"
output_file = "./backup/final_pages.txt"

with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Find the part after VALUES
# UpdraftPlus format: INSERT INTO `wpmq_posts` VALUES (row1), (row2), ...;
# There can be multiple INSERT statements.

all_rows = []
insert_pattern = re.compile(r"INSERT INTO `wpmq_posts` VALUES (.*?);", re.DOTALL)

for insert_match in insert_pattern.finditer(content):
    values_part = insert_match.group(1)
    # Split by ), ( but handle nested parens and escaped quotes
    # This is still hard, but let's try to find tuples starting with (ID, 
    # Row starts with ( and ends with ) followed by , or ;
    
    # Simple split by ), (
    rows = values_part.split('), (')
    for row in rows:
        # Clean up the start and end parens if they exist
        row = row.strip()
        if row.startswith('('): row = row[1:]
        if row.endswith(')'): row = row[:-1]
        
        # Now we have the columns. They are comma separated.
        # But content column has commas.
        # We know post_type is one of the last columns.
        # Let's try to find columns by matching 'string' or numbers
        
        # Columns: ID, author, date, date_gmt, content, title, excerpt, status, ...
        # A row looks like: 294, 1, '...', '...', '...', 'TITLE', '', 'publish', ...
        
        # Let's use a simpler check: find title and type in the raw row string
        # using a regex that assumes the structure
        match = re.search(r"^\d+,\s*\d+,\s*'[^']+',\s*'[^']+',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',.*?'(publish|inherit|draft|private)',.*?'(post|page|attachment|revision|nav_menu_item)'", row, re.DOTALL)
        
        if match:
            post_content = match.group(1)
            post_title = match.group(2)
            post_status = match.group(4)
            post_type = match.group(5)
            
            if post_status == 'publish' and post_type in ['page', 'post']:
                all_rows.append({
                    'title': post_title,
                    'type': post_type,
                    'content': post_content
                })

with open(output_file, 'w', encoding='utf-8') as out:
    for row in all_rows:
        out.write(f"TITLE: {row['title']}\n")
        out.write(f"TYPE: {row['type']}\n")
        out.write(f"CONTENT: {row['content'][:500]}...\n")
        out.write("=" * 80 + "\n")

print(f"Extracted {len(all_rows)} published pages/posts to {output_file}")
