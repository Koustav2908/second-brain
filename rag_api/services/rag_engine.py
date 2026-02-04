import random
from collections import Counter

from dotenv import load_dotenv
from google import genai
from services.embeddings import load_embedding_model
from services.pinecone_service import get_similar_embeddings
from sklearn.cluster import DBSCAN

load_dotenv()

EMBEDDING_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
GENERATIVE_MODEL_NAME = "gemini-2.5-flash"
NOT_IN_RAG_THRESHOLD = 0.60
N_RESPONSES = 3

emb_model = load_embedding_model()
client = genai.Client()


def embed_user_query(query: str) -> list[float]:
    """
    Function to embed user query to query embedding
    """
    query_emb = emb_model.encode(query).tolist()
    return query_emb


def build_prompt(query: str, context: str | None = None) -> str:
    """
    Function to build the prompt using query and context
    """
    prompt = f"""
You are an expert study helper.
Give answer to the user query based on the provided context.
Use the context only if it exists.
If no context is available, say clearly that user has not studied that topic yet.

Think step-by-step carefully and reason internally before answering.
Answer in simple english to the user.

User Query:
{query}

{f"Context:\n{context}" if context else ""}
"""
    return prompt


def generate_responses(prompt: str) -> list[str]:
    """
    Function to generate N responses from the same prompt
    """
    responses = []

    for _ in range(N_RESPONSES):
        response = client.models.generate_content(
            model=GENERATIVE_MODEL_NAME, contents=prompt
        )
        responses.append(response.text)

    return responses


def self_consistency(responses: list[str]) -> tuple[str, float]:
    """
    Function that returns a random response with its confidence score from the majority cluster from the N generated responses
    """
    embeddings = emb_model.encode(responses)

    dbscan_model = DBSCAN(eps=0.3, min_samples=2, metric="cosine")
    clusters = dbscan_model.fit(embeddings)
    labels = clusters.labels_

    label_counts = Counter(labels)
    label_counts.pop(-1, None)

    if not label_counts:
        return random.choice(responses), 0.33

    majority_label = label_counts.most_common(1)[0][0]

    majority_sentences = [
        responses[i] for i, label in enumerate(labels) if label == majority_label
    ]

    confidence = len(majority_sentences) / N_RESPONSES
    final_response = random.choice(majority_sentences)

    return final_response, confidence


def extract_citations(matches: list[dict]) -> list[dict]:
    """
    Function to extract each citation's file and page number
    """
    seen = set()
    citations = []

    for m in matches:
        meta = m["metadata"]
        key = (meta["file_id"], meta.get("page"))

        if key not in seen:
            seen.add(key)

            citations.append({"file_id": meta["file_id"], "page": meta.get("page")})

    return citations


def run_rag(query: str, user_id: str, file_id: str | None = None) -> dict:
    """
    Function to run the entire RAG pipeline
    """
    query_emb = embed_user_query(query)
    matches = get_similar_embeddings(query_emb, user_id, file_id)

    if not matches or matches[0]["score"] < NOT_IN_RAG_THRESHOLD:
        context = None
        citations = []
    else:
        context = "\n\n".join(m["metadata"]["content"] for m in matches)
        citations = extract_citations(matches)

    prompt = build_prompt(query, context)

    responses = generate_responses(prompt)

    final_answer, confidence = self_consistency(responses)

    return {
        "answer": final_answer,
        "confidence": confidence,
        "used_context": context is not None,
        "citations": citations,
    }
