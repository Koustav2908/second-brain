import tempfile

import requests
from flask import jsonify, request
from services.embeddings import embed_docs
from services.pinecone_service import upsert_embeddings
from utils.chunker import generate_chunks
from utils.document_loader import load_pdf

from routes import rag_bp


@rag_bp.route("/index", methods=["POST"])
def rag_index():
    data = request.get_json()

    user_id = data.get("userId")
    file_id = data.get("fileId")
    document_url = data.get("documentUrl")

    if not user_id or not file_id or not document_url:
        return jsonify({"error": "Missing required fields"}), 400

    try:
        response = requests.get(document_url)
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(response.content)
            tmp_path = tmp.name

        pages = load_pdf(tmp_path)
        num_pages = len(pages)

        chunks = generate_chunks(pages)
        num_chunks = len(chunks)

        for i, chunk in enumerate(chunks):
            chunk.metadata.update(
                {"user_id": user_id, "file_id": file_id, "chunk_index": i}
            )

        embedded_chunks = embed_docs(chunks)
        upsert_embeddings(embedded_chunks)

        return jsonify(
            {"sucess": True, "chunks_indexed": num_chunks, "pages": num_pages}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
