from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from lang import get_transcript_for_youtube, video_vector_store, summarize_transcript, chat_with_transcript
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
# from embeddings_manager import download_embeddings_from_s3, upload_embeddings_to_s3

def get_user_key(request: Request) -> str:
    user_id = request.headers.get("x-clerk-user-id")
    if user_id:
        return user_id
    return request.client.host

app = FastAPI(title="TubeIQ Backend")

limiter = Limiter(key_func=get_user_key, default_limits=["10/hour"])

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://tube-iq.vercel.app"],
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
@limiter.limit("10/hour")
async def process_video(payload: VideoRequest, request: Request):
    # try:
    #     if download_embeddings_from_s3():
    #         print("Embeddings downloaded from S3.")
    #     else:
    #         print("Embeddings not found on S3. Downloading from local storage.")
            

        # Step 1: Fetch transcript
        transcript = get_transcript_for_youtube(payload.video_id, payload.video_url)

        # Step 2: Build vector store (auto-delete old store handled in lang.py)
        vector_store = video_vector_store(transcript)

        # Step 3: Generate summary
        summary = summarize_transcript()
        print(summary)

        # upload_embeddings_to_s3()
        return {
            "summary": summary
        }


@app.post("/chat")
@limiter.limit("10/hour")
async def chat(payload: ChatRequest, request: Request):
    # Placeholder chat route (you can later integrate embedding-based Q&A)
    return {
        "chat_id": payload.chat_id,
        "response": chat_with_transcript(payload.query)
    }
