import gzip
import shutil

input_file = "./backup/backup_2025-12-27-0717_Colourparrot_d0f73d44b862-db.gz"
output_file = "./backup/backup_full.sql"

with gzip.open(input_file, 'rb') as f_in:
    with open(output_file, 'wb') as f_out:
        shutil.copyfileobj(f_in, f_out)

print(f"Successfully decompressed to {output_file}")
