$inputFile = "./backup/backup_2025-12-27-0717_Colourparrot_d0f73d44b862-db.gz"
$outputFile = "./backup/backup.sql"
$input = [System.IO.File]::OpenRead($inputFile)
$output = [System.IO.File]::Create($outputFile)
$gzip = New-Object System.IO.Compression.GZipStream($input, [System.IO.Compression.CompressionMode]::Decompress)
$gzip.CopyTo($output)
$gzip.Close()
$output.Close()
$input.Close()
Write-Host "Decompression complete: $outputFile"
