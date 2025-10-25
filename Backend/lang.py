import os
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from langchain. text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL")


def get_transcript_for_youtube(video_id: str, video_url: str) -> str:
    parsed = urlparse(video_url)
    if parsed.netloc in ("youtu.be", "www.youtu.be"):
        video_code = parsed.path.lstrip("/")
    else:
        query = parse_qs(parsed.query)
        video_code = query.get("v", [None])[0]

    if not video_code:
        raise ValueError(f"Could not extract video code from URL: {video_url}")

    # Attempt to fetch transcript
    try:
        yt_api = YouTubeTranscriptApi()
        transcript_segments = yt_api.fetch(video_code).to_raw_data()
        transcript_text = " ".join([seg["text"] for seg in transcript_segments])
        return transcript_text

    except TranscriptsDisabled: 
        raise RuntimeError(f"Transcripts are disabled for this video: {video_url}")
    except NoTranscriptFound:
        raise RuntimeError(f"No transcript available for this video: {video_url}")
    except Exception as e:
        raise RuntimeError(f"Error fetching transcript: {str(e)}")


def summarize_transcript(transcript: str) -> str:
    return "This is a summary of the transcript"