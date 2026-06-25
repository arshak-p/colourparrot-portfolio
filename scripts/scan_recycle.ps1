$shell = New-Object -ComObject Shell.Application
$recycleBin = $shell.NameSpace(10)

$items = @()
foreach ($item in $recycleBin.Items()) {
    $path = $recycleBin.GetDetailsOf($item, 1)
    $date = $recycleBin.GetDetailsOf($item, 2)
    $items += [PSCustomObject]@{
        Name = $item.Name
        OriginalPath = $path
        DateDeleted = $date
        Item = $item
    }
}

$items | Sort-Object DateDeleted -Descending | Select-Object -First 50 | ForEach-Object {
    Write-Host "$($_.DateDeleted) - $($_.Name) - $($_.OriginalPath)"
}
