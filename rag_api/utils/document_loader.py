from langchain.schema import Document
from langchain_community.document_loaders import PyPDFLoader


def load_pdf(pdf_path: str) -> list[Document]:
    """
    Utility function to read PDF files
    """
    loader = PyPDFLoader(pdf_path)
    return loader.load()
