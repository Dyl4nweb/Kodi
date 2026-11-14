Add-Type -AssemblyName System.Drawing

$srcPath = "public\kodi-icon.png"
$fullSrc = (Resolve-Path $srcPath).Path
$srcImg = [System.Drawing.Image]::FromFile($fullSrc)

function Resize-Image($img, [int]$w, [int]$h, [string]$destPath) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()
    $fullDest = Join-Path (Get-Location).Path $destPath
    $bmp.Save($fullDest, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Resize-Image $srcImg 32 32 "src-tauri\icons\32x32.png"
Resize-Image $srcImg 128 128 "src-tauri\icons\128x128.png"
Resize-Image $srcImg 256 256 "src-tauri\icons\128x128@2x.png"
Resize-Image $srcImg 256 256 "src-tauri\icons\icon.png"
Resize-Image $srcImg 256 256 "public\icon.png"

# Generate .ico file for Windows
$bmp256 = New-Object System.Drawing.Bitmap(256, 256)
$g = [System.Drawing.Graphics]::FromImage($bmp256)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.Clear([System.Drawing.Color]::Transparent)
$g.DrawImage($srcImg, 0, 0, 256, 256)
$g.Dispose()

$hIcon = $bmp256.GetHicon()
$icon = [System.Drawing.Icon]::FromHandle($hIcon)
$icoPath = Join-Path (Get-Location).Path "src-tauri\icons\icon.ico"
$fs = New-Object System.IO.FileStream($icoPath, [System.IO.FileMode]::Create)
$icon.Save($fs)
$fs.Close()
$icon.Dispose()
$bmp256.Dispose()
$srcImg.Dispose()

Write-Host "Icons successfully updated with user official logo!"

