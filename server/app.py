from flask import Flask, jsonify
from flask_cors import CORS
from pre_process.presentation import extract_pptx

app = Flask(__name__)
cors = CORS(app, origins="*")


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"msg": "Hello, world!"})


@app.route("/api/extract", methods=["GET"])
def process():
    file_path = "temporary_folder/data_mining.pptx"
    data = extract_pptx(file_path)
    return jsonify({"content": data})


if __name__ == "__main__":
    app.run(debug=True)
