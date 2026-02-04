from flask import jsonify, request
from services.pinecone_service import delete_embeddings

from routes import rag_bp


@rag_bp.route("/delete", methods=["DELETE"])
def delete_vectors():
    data = request.get_json()

    user_id = data.get("userId")
    file_id = data.get("fileId")

    if not user_id or not file_id:
        return jsonify({"error": "Missing fields"}), 400

    delete_embeddings(user_id, file_id)

    return jsonify({"success": True})
