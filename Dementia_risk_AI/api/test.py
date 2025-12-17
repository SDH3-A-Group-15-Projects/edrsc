import os, shutil
print("PATH is:", os.environ.get("PATH", ""))
print("ffmpeg which:", shutil.which("ffmpeg"))
