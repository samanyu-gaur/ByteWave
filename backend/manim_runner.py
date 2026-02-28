import subprocess
import sys
import tempfile
import uuid
from pathlib import Path

class ManimExecutionError(Exception):
    def __init__(self, message, stderr):
        super().__init__(message)
        self.stderr = stderr

def run_manim_script(code: str) -> str:
    """
    Executes the given Manim Python code and returns the path to the generated MP4.
    Raises ManimExecutionError if execution fails.
    """
    # Create a temporary directory to hold the script and output
    work_dir = Path("media_output")
    work_dir.mkdir(exist_ok=True)
    
    script_id = str(uuid.uuid4())
    script_path = work_dir / f"{script_id}.py"
    
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(code)
        
    # Run manim to generate the video
    # command: manim -ql media_output/<id>.py PhysicsAnimation --media_dir media_output/media
    # -ql specifies low quality for faster rendering during testing.
    # --format mp4
    
    media_dir = work_dir / "media"
    
    cmd = [
        sys.executable,
        "-m", "manim",
        "-ql", # Use -qh for high quality, -ql for low quality (faster)
        "--media_dir", str(media_dir),
        str(script_path),
        "PhysicsAnimation"
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print("Manim execution successful.")
    except subprocess.CalledProcessError as e:
        print("Manim Error Output:")
        print(e.stderr)
        raise ManimExecutionError(f"Manim failed to compile the animation. See backend logs for details.", e.stderr)
        
    # Find the generated mp4
    # Manim outputs to: media_dir/videos/<script_name>/480p15/PhysicsAnimation.mp4 (for -ql)
    
    video_dir = media_dir / "videos" / script_id / "480p15"
    videos = list(video_dir.glob("*.mp4"))
    
    if not videos:
        raise Exception("Manim ran successfully but no MP4 was found.")
        
    # Return the relative path so the frontend can access it
    video_path = videos[0]
    return str(video_path)
