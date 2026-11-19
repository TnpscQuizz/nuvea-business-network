$logPath = "tunnel.log"
while ($true) {
    "[$(Get-Date -Format 'o')] Launching SSH tunnel to localhost.run..." | Out-File -Append -FilePath $logPath
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=20 -o ServerAliveCountMax=3 -R 80:127.0.0.1:3000 nokey@localhost.run 2>&1 | Tee-Object -Append -FilePath $logPath
    "[$(Get-Date -Format 'o')] Tunnel disconnected. Auto-reconnecting in 3 seconds..." | Out-File -Append -FilePath $logPath
    Start-Sleep -Seconds 3
}
