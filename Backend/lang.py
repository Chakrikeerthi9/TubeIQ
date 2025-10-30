import os
import uuid
import shutil
from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qs
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain_core.messages import HumanMessage
from langchain_core.prompts import PromptTemplate
from langchain.chains import LLMChain
from fastapi import HTTPException


VECTOR_STORE_PATH = "data"

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL")

def get_transcript_for_youtube(video_url: str) -> str:
    print("1")
    parsed = urlparse(video_url)
    if parsed.netloc in ("youtu.be", "www.youtu.be"):
        video_code = parsed.path.lstrip("/")
        print("2")
    else:
        query = parse_qs(parsed.query)
        video_code = query.get("v", [None])[0]
        print("3")
    if not video_code:
        raise ValueError(f"Invalid YouTube URL: {video_url}")
    print("4")
    try:
        yt_api = YouTubeTranscriptApi()
        transcript = yt_api.fetch(video_code)
        transcript_text = " ".join([s.text for s in transcript.snippets])
        print("5")
        return transcript_text.strip()
    except (TranscriptsDisabled, NoTranscriptFound):
        raise RuntimeError(f"No transcript found for this video: {video_url}")
    except Exception as e:
        raise RuntimeError(f"Transcript error: {e}")

def video_vector_store(transcript: str) -> str:
    # Clean up previous vector store safely
    if os.path.exists(VECTOR_STORE_PATH):
        shutil.rmtree(VECTOR_STORE_PATH)
        print("Old vector store deleted.")

    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_text(transcript)

    embeddings = OpenAIEmbeddings(model=OPENAI_EMBEDDING_MODEL)
    vector_store = FAISS.from_texts(chunks, embeddings)

    vector_store.save_local(VECTOR_STORE_PATH)
    print("New vector store saved successfully.")
    return VECTOR_STORE_PATH

def summarize_transcript() -> str:
    embeddings = OpenAIEmbeddings(model=OPENAI_EMBEDDING_MODEL)
    vector_store = FAISS.load_local(VECTOR_STORE_PATH, embeddings, allow_dangerous_deserialization=True)

    # Retrieve transcript summary context
    docs = vector_store.similarity_search("Summarize this video transcript.")
    context = " ".join([d.page_content for d in docs])

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    prompt = PromptTemplate(
        template=(
            "You are a concise assistant. Summarize the following transcript in a structured way with the following sections: \n\n"
            "Title: The title of the video.\n"
            "1. Introduction: Briefly introduce the video and its main topic.\n"
            "2. Main Points: Summarize the main points of the video.\n"
            "3. Key Takeaways: Highlight the key takeaways from the video.\n"
            "4. Conclusion: Summarize the main points of the video.\n\n"
            "{context}\n\nSummary:"
        ),
        input_variables=["context"]
    )
    chain = prompt | llm
    summary = chain.invoke({"context": context})
    return summary.content if hasattr(summary, "content") else str(summary)


def chat_with_transcript(query: str) -> str:
    try:
        # 1️⃣ Load embeddings and stored FAISS index
        embeddings = OpenAIEmbeddings(model=os.getenv("OPENAI_EMBEDDING_MODEL"))
        vector_store = FAISS.load_local(VECTOR_STORE_PATH, embeddings, allow_dangerous_deserialization=True)
        print("Vector store loaded...")

        # 2️⃣ Retrieve top-matching transcript chunks
        docs = vector_store.similarity_search(query, k=4)
        if not docs:
            raise ValueError("No relevant context found in the transcript.")

        context = " ".join([d.page_content for d in docs])

        # 3️⃣ LLM setup using LangChain’s LCEL pipeline
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        prompt = PromptTemplate(
            template=(
                "You are TubeIQ, a helpful assistant that answers questions based on a YouTube transcript.\n\n"
                "Transcript context:\n{context}\n\n"
                "Question: {question}\n\n"
                "Provide a concise, accurate answer."
            ),
            input_variables=["context", "question"]
        )
        messages = [HumanMessage(content=prompt.format_prompt(context=context, question=query).to_string())]
        response = llm.invoke(messages)
        return response.content if hasattr(response, "content") else str(response)
    except Exception as e:
        raise RuntimeError(f"Chat error: {e}")
