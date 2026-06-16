Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$url = "http://localhost:8080/"
$output = "c:\Users\linso\Documents\wordcup\screenshot.png"

$browser = New-Object -ComObject "InternetExplorer.Application"
$browser.Visible = $true
$browser.Navigate($url)

while ($browser.Busy -or $browser.ReadyState -ne 4) {
    Start-Sleep -Milliseconds 500
}

Start-Sleep -Seconds 3

$width = $browser.Document.body.scrollWidth
$height = $browser.Document.body.scrollHeight
$browser.Width = $width + 20
$browser.Height = $height + 100

$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bitmap = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)

$browser.Quit()
$graphics.Dispose()
$bitmap.Dispose()

Write-Host "Screenshot saved to $output"