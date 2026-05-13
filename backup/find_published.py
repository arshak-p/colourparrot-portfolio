import re

input_file = "./backup/backup_full.sql"
output_file = "./backup/published_pages.txt"

# Typical wpmq_posts columns:
# ID, author, date, date_gmt, content, title, excerpt, status, comment_status, ping_status, 
# password, name, to_ping, pinged, modified, modified_gmt, content_filtered, parent, guid, 
# menu_order, post_type, mime_type, comment_count

# We'll use a regex to find published pages and posts
# We look for: (ID, author, date, date_gmt, content, title, excerpt, 'publish', ..., 'page'|'post')

# The difficulty is the content can contain anything.
# But status and type are near the end.

rows_found = 0
with open(input_file, 'rb') as f:
    # We'll read the file and look for 'publish' and 'page' in the same line/block
    # UpdraftPlus usually puts all rows of a table in one or more INSERT INTO lines
    
    for line in f:
        try:
            line_str = line.decode('utf-8', errors='ignore')
            if "INSERT INTO `wpmq_posts`" in line_str:
                # This line contains many rows.
                # We'll split by the pattern of the end of a row and start of next: ), (
                # But that's not perfect. Let's try to find individual rows.
                # Each row ends with 'publish', ..., 'page') or 'post')
                
                # Let's find all published pages/posts
                # We'll look for: 'publish',.*?'(page|post)'
                # and then backtrack to find the title. This is tricky with regex.
                
                # Better: find all tuples in this INSERT
                # Tuples look like (1, 1, '...', '...', '...', '...', '', 'publish', ..., 'post', '', 0)
                
                # Let's use a very simple approach: search for the status and type,
                # then grab a bit of the surrounding text to find the title.
                
                matches = re.finditer(r"\(\d+,\s*\d+,\s*'[^']+',\s*'[^']+',\s*'(.*?)',\s*'(.*?)',\s*'(.*?)',\s*'publish',.*?'(page|post)',", line_str)
                for m in matches:
                    content = m.group(1)
                    title = m.group(2)
                    ptype = m.group(4)
                    
                    with open(output_file, 'a', encoding='utf-8') as out:
                        out.write(f"TITLE: {title}\n")
                        out.write(f"TYPE: {ptype}\n")
                        out.write(f"CONTENT: {content[:1000]}...\n")
                        out.write("="*80 + "\n")
                    rows_found += 1
        except:
            continue

print(f"Found {rows_found} published pages/posts.")
