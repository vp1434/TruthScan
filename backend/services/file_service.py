from io import BytesIO
from PyPDF2 import PdfReader
from docx import Document
from utils.logger import get_logger

logger = get_logger(__name__)

def extract_text_from_file(filename: str, content: bytes) -> str:
    try:
        if filename.endswith(".pdf"):
            reader = PdfReader(BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
        elif filename.endswith(".docx"):
            doc = Document(BytesIO(content))
            text = "\n".join([para.text for para in doc.paragraphs])
            return text
        elif filename.endswith(".txt"):
            return content.decode("utf-8")
        else:
            raise ValueError(f"Unsupported file type for {filename}")
    except Exception as e:
        logger.error(f"Error parsing file {filename}: {e}")
        raise ValueError(f"Error parsing file: {str(e)}")
