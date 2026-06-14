from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter


def generate_chunks(pages: list[Document]) -> list[Document]:
    """
    Utility function to convert text to small size chunks
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        length_function=len,
        separators=["\n\n", "\n", " ", ""],
    )

    return splitter.split_documents(pages)
