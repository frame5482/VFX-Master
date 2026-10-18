$ErrorActionPreference = 'Stop'
$siteSource = Join-Path $PSScriptRoot 'dist'
$webRoot = 'C:\xampp\htdocs'
$siteDestination = Join-Path $webRoot 'vfx-forge'
$configPath = Join-Path $webRoot '.htaccess'
if (!(Test-Path -LiteralPath $webRoot)) { throw 'XAMPP htdocs not found' }
if (Test-Path -LiteralPath $siteDestination) {
    $existingMarker = Join-Path $siteDestination '.vfx-forge-managed'
    if (!(Test-Path -LiteralPath $existingMarker)) { throw 'Destination exists and is not managed by this project' }
}
New-Item -ItemType Directory -Path $siteDestination -Force | Out-Null
Get-ChildItem -LiteralPath $siteSource -File | Copy-Item -Destination $siteDestination -Force
$utf8 = New-Object System.Text.UTF8Encoding($false)
$html = [IO.File]::ReadAllText((Join-Path $siteSource 'index.html'))
$html = $html.Replace('<head>', '<head><base href="/vfx-forge/">')
[IO.File]::WriteAllText((Join-Path $siteDestination 'index.html'), $html, $utf8)
[IO.File]::WriteAllText((Join-Path $siteDestination '.vfx-forge-managed'), 'Managed by D:\Project\VFX-Master\vfx-forge', $utf8)
$marker = '# VFX FORGE LOCALHOST'
$config = ''
if (Test-Path -LiteralPath $configPath) {
    $config = [IO.File]::ReadAllText($configPath)
    if (!$config.Contains($marker)) {
        $backup = $configPath + '.vfx-forge-backup-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
        Copy-Item -LiteralPath $configPath -Destination $backup
        Write-Output ('Backup: ' + $backup)
    }
}
if (!$config.Contains($marker)) {
    $config += "`r`n$marker`r`nDirectoryIndex /vfx-forge/index.html index.php index.html`r`n"
    [IO.File]::WriteAllText($configPath, $config, $utf8)
}
Write-Output 'Installed VFX Forge at http://localhost/ using existing Apache. No Apache restart required.'
