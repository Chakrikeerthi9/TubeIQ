from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from lang import get_transcript_for_youtube, video_vector_store, summarize_transcript, chat_with_transcript

app = FastAPI(title="TubeIQ Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class VideoRequest(BaseModel):
    video_id: str
    video_url: str

class ChatRequest(BaseModel):
    chat_id: str
    query: str


@app.get("/")
def root():
    return {"message": "TubeIQ API is running"}


@app.post("/process_video")
def process_video(payload: VideoRequest):
    try:
        # Step 1: Fetch transcript
        transcript = get_transcript_for_youtube(payload.video_id, payload.video_url)

        # Step 2: Build vector store (auto-delete old store handled in lang.py)
        vector_store = video_vector_store(transcript)

        # Step 3: Generate summary
        summary = summarize_transcript()
        print(summary)
        return {
            "summary": summary
        }

    except Exception as e:
        # Gracefully return the error
        raise HTTPException(status_code=500, detail=f"Error processing video: {e}")


@app.post("/chat")
def chat(payload: ChatRequest):
    # Placeholder chat route (you can later integrate embedding-based Q&A)
    return {
        "chat_id": payload.chat_id,
        "response": chat_with_transcript(payload.query)
    }
