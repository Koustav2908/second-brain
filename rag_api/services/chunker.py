from langchain.text_splitter import RecursiveCharacterTextSplitter


def chunk_pdf(pages):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        length_function=len,
        separators=["\n\n", "\n", " ", ""],
    )

    chunks = splitter.split_documents(pages)
    return {
        "chunks": chunks,
        "length": len(chunks),
    }
