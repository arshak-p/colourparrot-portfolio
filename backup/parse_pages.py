import re

input_file = "./backup/extracted_content.txt"
output_file = "./backup/pages_summary.txt"

# Typical wpmq_posts columns in order for UpdraftPlus
# (ID, post_author, post_date, post_date_gmt, post_content, post_title, post_excerpt, post_status, comment_status, ping_status, post_password, post_name, to_ping, pinged, post_modified, post_modified_gmt, post_content_filtered, post_parent, guid, menu_order, post_type, post_mime_type, comment_count)

# However, the structure can vary. Let's try to parse the VALUES part.
# The format is INSERT INTO `wpmq_posts` VALUES (row1), (row2), ...;

def parse_sql_values(sql):
    # This is a very rough parser for SQL values
    rows = []
    # Find all ( ... ) blocks that are not preceded by a backslash
    # and handle commas inside strings. This is hard.
    # We'll use a simpler approach: split by '),(' but that's risky.
    
    # Let's just find the titles and types using regex on the whole line
    # (ID, author, date, date_gmt, content, title, excerpt, status, ..., type, ...)
    
    # Example: (910, 1, '2025-09-22 12:20:32', ..., 'BRANDING IDENTITY', ..., 'revision', ...)
    
    # Regex for typical post entry
    # (\d+, \d+, '[^']+', '[^']+', '.*?', '[^']+', '.*?', '[^']+', ..., '[^']+')
    
    return re.findall(r"\((\d+),.*?'(.*?)', '(.*?)', '(.*?)', '(.*?)', '(.*?)',.*?'(publish|inherit|draft|private)',.*?'(post|page|attachment|revision|nav_menu_item)'.*?\)", sql)

with open(input_file, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# UpdraftPlus often has multiple rows per INSERT
# We'll try to find all entries
entries = []
# Find all occurrences of (ID, author, date, date_gmt, content, title, ...)
# This is a bit of a gamble with regex but let's try
# ID is \d+, author is \d+, date is '\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}'

# Let's use a simpler approach: extract everything between ' and '
# and try to find the post_type and post_title

results = []
# We'll look for specific patterns like ', 'page', 
# or just look for the title and type in each row

# Let's use a regex that looks for (ID, author, date, date_gmt, content, title, excerpt, status, ..., post_type)
# This is very specific to the schema
pattern = re.compile(r"\((\d+),\s*\d+,\s*'[^']+',\s*'[^']+',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',.*?'(post|page|attachment|revision|nav_menu_item)'", re.DOTALL)

with open(output_file, 'w', encoding='utf-8') as out:
    for match in pattern.finditer(content):
        post_id = match.group(1)
        post_content = match.group(2)[:100].replace('\n', ' ') # Snippet
        post_title = match.group(3)
        post_status = match.group(5)
        post_type = match.group(6)
        
        if post_status == 'publish' and post_type in ['page', 'post']:
            out.write(f"ID: {post_id} | Type: {post_type} | Title: {post_title} | Status: {post_status}\n")
            out.write(f"Content Snippet: {post_content}...\n")
            out.write("-" * 40 + "\n")

print(f"Summary written to {output_file}")
