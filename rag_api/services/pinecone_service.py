import os

from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

INDEX_NAME = "second-brain"

pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))
index = pc.Index(INDEX_NAME)


def upsert_embeddings(embedded_chunks: list[dict]) -> None:
    vectors = []

    for chunk in embedded_chunks:
        meta = chunk["metadata"]

        vector_id = f"{meta['user_id']}_{meta['file_id']}_{meta['chunk_index']}"

        vectors.append(
            {
                "id": vector_id,
                "values": chunk["embedding"],
                "metadata": {
                    **meta,
                    "content": chunk["content"],
                },
            }
        )
    index.upsert(vectors=vectors)


def get_similar_embeddings(
    query_embedding: list[float],
    user_id: str,
    pdf_id: str | None = None,
    top_k: int = 3,
) -> list[dict]:
    filter_query = {"user_id": user_id}
    if pdf_id:
        filter_query["file_id"] = pdf_id

    response = index.query(
        vector=query_embedding, top_k=top_k, include_metadata=True, filter=filter_query
    )

    return response.get("matches", [])


def delete_embeddings(user_id: str, file_id: str) -> None:
    index.delete(
        filter={
            "user_id": user_id,
            "file_id": file_id,
        }
    )
