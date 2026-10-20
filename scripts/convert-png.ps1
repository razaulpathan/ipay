Add-Type -AssemblyName System.Drawing

$iconPath = Join-Path $PSScriptRoot "..\apps\mobile\assets\app_icon.jpg"
$iconOut = Join-Path $PSScriptRoot "..\apps\mobile\assets\app_icon.png"
$splashPath = Join-Path $PSScriptRoot "..\apps\mobile\assets\splash_screen.jpg"
$splashOut = Join-Path $PSScriptRoot "..\apps\mobile\assets\splash_screen.png"

$img1 = [System.Drawing.Image]::FromFile($iconPath)
$img1.Save($iconOut, [System.Drawing.Imaging.ImageFormat]::Png)
$img1.Dispose()

$img2 = [System.Drawing.Image]::FromFile($splashPath)
$img2.Save($splashOut, [System.Drawing.Imaging.ImageFormat]::Png)
$img2.Dispose()

Write-Host "Successfully converted mobile assets to PNG!"
