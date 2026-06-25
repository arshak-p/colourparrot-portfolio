$shell = New-Object -ComObject Shell.Application
$recycleBin = $shell.NameSpace(10)
foreach ($item in $recycleBin.Items()) {
    $path = $recycleBin.GetDetailsOf($item, 1)
    if ($path -match 'colourparrot.com') {
        Write-Host "Found in Recycle Bin: $($item.Name) -> $path"
        $item.InvokeVerb("undelete")
    }
}
