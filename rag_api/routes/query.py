from flask import jsonify, request
from services.rag_engine import run_rag

from routes import rag_bp


@rag_bp.route("/query", methods=["POST"])
def rag_query():
    data = request.get_json()

    query = data.get("query")
    user_id = data.get("userId")
    file_id = data.get("fileId")

    if not query or user_id:
        return jsonify({"error": "query and userId required"}), 400

    try:
        result = run_rag(query, user_id, file_id)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
