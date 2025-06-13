from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, origins="*")


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"msg": "Hello, moon!"})


if __name__ == "__main__":
    app.run(debug=True)
