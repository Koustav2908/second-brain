from langchain.schema import Document
from sentence_transformers import SentenceTransformer

model = None


def load_embedding_model() -> SentenceTransformer:
    """
    Function to load the embedding model used
    """
    global model
    if model is None:
        model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    return model


def embed_docs(chunks: list[Document]) -> list[dict]:
    """
    Function to convert text chunks into vector embeddings
    """
    model = load_embedding_model()

    texts = [chunk.page_content for chunk in chunks]
    embeddings = model.encode(texts)

    embedded_chunks = []
    for chunk, emb in zip(chunks, embeddings):
        embedded_chunks.append(
            {
                "content": chunk.page_content,
                "embedding": emb.tolist(),
                "metadata": chunk.metadata,
            }
        )
    return embedded_chunks
