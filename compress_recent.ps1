$source = "D:\c p web\colourparrot.com"
$dest = "D:\c p web\colourparrot.com\public\compressed_motion\recent"
if (!(Test-Path $dest)) { New-Item -ItemType Directory -Force -Path $dest | Out-Null }

$videos = @(
    "capitus edited.mp4",
    "Klaqy mothers day.mp4",
    "love.mp4",
    "RR concept video.mp4"
)

foreach ($vid in $videos) {
    $inPath = Join-Path -Path $source -ChildPath $vid
    $outPath = Join-Path -Path $dest -ChildPath $vid
    Write-Host "Compressing $vid..."
    & ffmpeg -i $inPath -vcodec libx264 -crf 28 -preset fast -vf "scale='min(1080,iw)':-2" -an -y $outPath
}

# Update motion_videos.json
$motionVideos = Get-ChildItem -Path "D:\c p web\colourparrot.com\public\compressed_motion" -Recurse -Filter *.mp4
$motionArray = @()
foreach ($vid in $motionVideos) {
    $relPath = $vid.FullName.Substring("D:\c p web\colourparrot.com\public".Length).Replace('\', '/')
    $motionArray += $relPath
}
$motionArray | ConvertTo-Json | Out-File "D:\c p web\colourparrot.com\src\data\motion_videos.json" -Encoding utf8
Write-Host "Done!"
