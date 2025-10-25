from fastapi import FastAPI
from pydantic import BaseModel
from fastapi import Request


from lang import get_transcript_for_youtube
from lang import summarize_transcript


app = FastAPI()

class VideoRequest(BaseModel):
    video_id: str
    video_url: str

class ChatRequest(BaseModel):
    chat_id: str
    query: str

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.post("/process_video")
def process_video(request: Request, payload: VideoRequest):
    video_id = payload.video_id
    video_url = payload.video_url
    transcript = get_transcript_for_youtube(video_id,video_url)
    if transcript is None:
        return {"message": "No transcript found for video ID", "video_id": payload.video_id, "video_url": payload.video_url}
    else:
        return {"message": "Transcript found for video ID", "transcript": transcript, "video_id": payload.video_id, "video_url": payload.video_url}
    # summary = summarize_transcript(transcript)

@app.post("/chat")
def chat(request: Request, payload: ChatRequest):
    return {"message": "Chat processed successfully", "chat_id": payload.chat_id, "query": payload.query}