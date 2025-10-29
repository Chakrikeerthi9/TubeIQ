# import os
# import boto3
# import pickle
# import faiss

# S3_BUCKET = "tubeiq-embeddings-storage"
# LOCAL_DATA_PATH = "./data"
# INDEX_FILE = "index.faiss"
# PKL_FILE = "index.pkl"

# s3 = boto3.client("s3")

# def download_embeddings_from_s3():
#     """Try downloading FAISS and metadata files from S3"""
#     os.makedirs(LOCAL_DATA_PATH, exist_ok=True)
#     try:
#         s3.download_file(S3_BUCKET, INDEX_FILE, os.path.join(LOCAL_DATA_PATH, INDEX_FILE))
#         s3.download_file(S3_BUCKET, PKL_FILE, os.path.join(LOCAL_DATA_PATH, PKL_FILE))
#         print("✅ Existing embeddings downloaded from S3.")
#         return True
#     except Exception as e:
#         print(f"⚠️ No embeddings found on S3 or error: {e}")
#         return False


# def upload_embeddings_to_s3():
#     """Upload FAISS and metadata to S3"""
#     try:
#         s3.upload_file(os.path.join(LOCAL_DATA_PATH, INDEX_FILE), S3_BUCKET, INDEX_FILE)
#         s3.upload_file(os.path.join(LOCAL_DATA_PATH, PKL_FILE), S3_BUCKET, PKL_FILE)
#         print("✅ Embeddings uploaded to S3.")
#     except Exception as e:
#         print(f"❌ Upload failed: {e}")
