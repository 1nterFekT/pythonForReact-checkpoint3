import os
import shutil
import uuid

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from PIL import Image

ALLOWED_TYPES = ["image/png", "image/jpeg"]
MAX_FILE_SIZE = 5 * 1024 * 1024
UPLOAD_DIR = "uploads"
THUMB_DIR = "uploads/thumbnails"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(THUMB_DIR, exist_ok=True)

app = FastAPI()

app.mount("/static", StaticFiles(directory="uploads"))


@app.post("/upload/")
async def upload_file(request: Request, file: UploadFile = File()):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400, detail=f"Недопустимый тип файла: {file.content_type}"
        )

    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Размер файла превышает 5 МБ")

    await file.seek(0)

    file_id = uuid.uuid4()
    extension = file.filename.split(".")[-1]

    original_path = f"{UPLOAD_DIR}/{file_id}.{extension}"
    thumb_path = f"{THUMB_DIR}/{file_id}_thumb.{extension}"

    with open(original_path, "wb") as f:
        f.write(contents)

    img = Image.open(original_path)
    img.thumbnail((200, 200))
    img.save(thumb_path)

    return {
        "original_name": file.filename,
        "saved_as": f"{file_id}.{extension}",
        "original_url": f"{request.base_url}static/{file_id}.{extension}",
        "thumbnail_url": f"{request.base_url}static/thumbnails/{file_id}_thumb.{extension}",
    }
