import os
import sys
import ftplib

host = "217.21.91.161"
port = 21
username = "u910611302.surenthersurenther08"
password = "rJX9eBtK.Ce4Jwd"
local_dir = os.path.abspath("dist")

print("=" * 60)
print(f"SHINEGAH HOSTINGER FTP DEPLOYMENT")
print(f"Target Host: {host}:{port}")
print(f"Username: {username}")
print(f"Local Dist Directory: {local_dir}")
print("=" * 60)

if not os.path.exists(local_dir):
    print("ERROR: dist folder does not exist! Run npm run build first.")
    sys.exit(1)

def ensure_remote_dir(ftp, remote_path):
    dirs = [d for d in remote_path.split("/") if d]
    current = ""
    for d in dirs:
        current += "/" + d
        try:
            ftp.cwd(current)
        except Exception:
            try:
                ftp.mkd(current)
                ftp.cwd(current)
            except Exception as e:
                pass

try:
    print("Connecting to FTP...")
    ftp = ftplib.FTP()
    ftp.connect(host, port, timeout=30)
    print("Connected. Logging in...")
    ftp.login(username, password)
    print("FTP Login SUCCESSFUL!")

    root_remote = "/"
    ftp.cwd(root_remote)
    print(f"Current Remote Working Directory: {ftp.pwd()}")

    # Walk local_dir and upload files
    total_files = 0
    uploaded_files = 0

    for root, dirs, files in os.walk(local_dir):
        total_files += len(files)

    print(f"\nTotal files to upload: {total_files}")

    for root, dirs, files in os.walk(local_dir):
        rel_path = os.path.relpath(root, local_dir)
        if rel_path == ".":
            remote_subdir = root_remote
        else:
            remote_subdir = root_remote.rstrip("/") + "/" + rel_path.replace("\\", "/")

        ensure_remote_dir(ftp, remote_subdir)

        for filename in files:
            local_filepath = os.path.join(root, filename)
            remote_filepath = remote_subdir.rstrip("/") + "/" + filename
            
            with open(local_filepath, "rb") as f:
                ftp.storbinary(f"STOR {filename}", f)
            uploaded_files += 1
            file_size_kb = os.path.getsize(local_filepath) / 1024
            print(f"[{uploaded_files}/{total_files}] Uploaded: {rel_path}/{filename} ({file_size_kb:.1f} KB)")

    print("\n" + "=" * 60)
    print(f"DEPLOYMENT COMPLETE! {uploaded_files} files uploaded successfully.")
    print("=" * 60)

    print("\nRemote Root Directory Listing:")
    ftp.cwd(root_remote)
    ftp.retrlines("LIST")

    ftp.quit()
    print("\nFTP connection closed.")

except Exception as err:
    print("DEPLOYMENT ERROR:", err)
    sys.exit(1)
