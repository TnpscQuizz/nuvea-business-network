$dir = "C:\Users\chand\.gemini\antigravity\scratch\nuvea-business-network"
Set-Location $dir
$logPath = Join-Path $dir "tunnel.log"
$urlPath = Join-Path $dir "active_tunnel_url.txt"

while ($true) {
    "[$(Get-Date -Format 'o')] Starting SSH tunnel to localhost.run..." | Out-File -Append -FilePath $logPath -Encoding utf8
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -R 80:127.0.0.1:3000 nokey@localhost.run 2>&1 | ForEach-Object {
        $line = $_
        $line | Out-File -Append -FilePath $logPath -Encoding utf8
        if ($line -match "https://[a-zA-Z0-9\.\-_]+\.lhr\.life") {
            $matches[0] | Out-File -FilePath $urlPath -Encoding utf8
            "[$(Get-Date -Format 'o')] Found active URL: $($matches[0])" | Out-File -Append -FilePath $logPath -Encoding utf8
        }
    }
    "[$(Get-Date -Format 'o')] Tunnel disconnected. Reconnecting in 3 seconds..." | Out-File -Append -FilePath $logPath -Encoding utf8
    Start-Sleep -Seconds 3
}
