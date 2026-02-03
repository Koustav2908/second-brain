from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter


def chunk_pdf(pages: list[Document]) -> list[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=600,
        chunk_overlap=100,
        length_function=len,
        separators=["\n\n", "\n", " ", ""],
    )

    return splitter.split_documents(pages)
