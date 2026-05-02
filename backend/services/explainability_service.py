from lime.lime_text import LimeTextExplainer
from utils.logger import get_logger

logger = get_logger(__name__)

def get_lime_explanation(text: str, predict_proba_fn):
    try:
        explainer = LimeTextExplainer(class_names=["Fake", "Real"])
        # Limiting length of text for explanation to avoid massive delays
        short_text = text[:1500] if len(text) > 1500 else text
        exp = explainer.explain_instance(short_text, predict_proba_fn, num_features=10)
        
        highlights = []
        for word, weight in exp.as_list():
            highlights.append({"word": word, "weight": weight})
            
        return highlights
    except Exception as e:
        logger.error(f"Error generating LIME explanation: {e}")
        return []
