import re

input_file = "./backup/backup_full.sql"
target_titles = ["About Us", "Services", "Contact Us", "BRANDING IDENTITY"]
output_file = "./backup/extracted_pages_content.txt"

with open(output_file, 'w', encoding='utf-8') as out:
    out.write("EXTRACTED PAGES CONTENT\n")
    out.write("="*80 + "\n")

with open(input_file, 'rb') as f:
    in_posts_table = False
    for line in f:
        try:
            line_str = line.decode('utf-8', errors='ignore')
            if "INSERT INTO `wpmq_posts`" in line_str:
                # Look for targets in this block
                for title in target_titles:
                    # Pattern: (ID, author, date, date_gmt, 'CONTENT', 'TITLE', ..., 'publish', ..., 'page')
                    # This regex is a bit risky but let's try to find the title and extract content
                    # We know title is the 6th column, content is 5th.
                    
                    # Search for the title first to confirm presence
                    if f"'{title}'" in line_str:
                        # Extract the whole tuple containing this title
                        # Tuples are separated by ), (
                        parts = line_str.split('),(')
                        for p in parts:
                            if f"'{title}'" in p and "'publish'" in p and "'page'" in p:
                                with open(output_file, 'a', encoding='utf-8') as out:
                                    out.write(f"TITLE: {title}\n")
                                    out.write(f"RAW DATA: {p[:2000]}...\n") # Save raw data for parsing
                                    out.write("-" * 80 + "\n")
        except:
            continue
