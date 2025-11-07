import faiss
from flask import Flask, jsonify, request
from flask_cors import CORS
from pre_process.presentation import extract_pptx
from sentence_transformers import SentenceTransformer
from transformers import T5ForConditionalGeneration, T5Tokenizer

app = Flask(__name__)
cors = CORS(app, origins="*")

tokenizer = T5Tokenizer.from_pretrained("google/flan-t5-large")
generator = T5ForConditionalGeneration.from_pretrained("google/flan-t5-large")

embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

dimension = 384
index = faiss.IndexFlatL2(dimension)
documents = []


@app.route("/api/hello", methods=["GET"])
def hello():
    return jsonify({"msg": "Hello, world!"})


@app.route("/api/extract", methods=["GET"])
def process():
    file_path = "temporary_folder/data_mining.pptx"
    slides = extract_pptx(file_path)

    chunks = []
    for slide in slides:
        slide_text = " ".join(slide["content"])
        words = slide_text.split()
        for i in range(0, len(words), 200):
            chunks.append(" ".join(words[i : i + 200]))

    # Generate embeddings
    embeddings = embedder.encode(chunks, convert_to_numpy=True)

    global documents
    documents.extend(chunks)
    index.add(embeddings)

    return jsonify({"msg": "Embeddings stored", "chunks": chunks})


@app.route("/api/query", methods=["GET"])
def query():
    if len(documents) == 0:
        return jsonify(
            {"error": "No documents indexed yet. Please call /api/extract first."}
        ), 400

    query_text = request.args.get("q", default="What is data mining?")

    query_emb = embedder.encode([query_text], convert_to_numpy=True)
    distances, indices = index.search(query_emb, k=3)
    retrieved_chunks = [documents[idx] for idx in indices[0]]

    context = " ".join(retrieved_chunks)
    prompt = f"Answer the question based on the context.\n\nContext: {context}\n\nQuestion: {query_text}\n\nAnswer:"

    input_ids = tokenizer(
        prompt, return_tensors="pt", truncation=True, max_length=512
    ).input_ids
    output_ids = generator.generate(
        input_ids, max_length=256, num_beams=5, early_stopping=True
    )
    answer = tokenizer.decode(output_ids[0], skip_special_tokens=True)

    return jsonify(
        {"query": query_text, "retrieved": retrieved_chunks, "answer": answer}
    )


if __name__ == "__main__":
    app.run(debug=True)
