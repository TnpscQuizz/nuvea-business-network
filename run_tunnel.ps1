$logPath = "tunnel.log"
$urlPath = "active_tunnel_url.txt"

while ($true) {
    "[$(Get-Date -Format 'o')] Launching SSH tunnel to localhost.run..." | Out-File -Append -FilePath $logPath
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=15 -o ServerAliveCountMax=3 -R 80:127.0.0.1:3000 nokey@localhost.run 2>&1 | ForEach-Object {
        $line = $_
        $line | Out-File -Append -FilePath $logPath
        if ($line -match "https://[a-zA-Z0-9\.\-_]+\.lhr\.life") {
            $matches[0] | Out-File -FilePath $urlPath -Encoding utf8
        }
    }
    "[$(Get-Date -Format 'o')] Tunnel disconnected. Auto-reconnecting in 3 seconds..." | Out-File -Append -FilePath $logPath
    Start-Sleep -Seconds 3
}
