import routes.delete
import routes.index
import routes.query
from flask import Flask, jsonify
from routes import rag_bp

app = Flask(__name__)
app.register_blueprint(rag_bp, url_prefix="/rag")


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)
