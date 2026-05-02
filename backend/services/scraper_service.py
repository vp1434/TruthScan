from newspaper import Article
from utils.logger import get_logger

logger = get_logger(__name__)

def scrape_url(url: str) -> str:
    try:
        article = Article(url)
        article.download()
        article.parse()
        text = article.text
        if not text:
            raise ValueError("Could not extract text from URL")
        return text
    except Exception as e:
        logger.error(f"Error scraping URL {url}: {e}")
        raise ValueError(f"Error scraping URL: {str(e)}")
