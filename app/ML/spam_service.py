from pathlib import Path
import joblib

ML_DIR = Path(__file__).resolve().parent

model = joblib.load(ML_DIR/"spam_model.pkl")
tfidf = joblib.load(ML_DIR/"tfidf_vectorizer.pkl")

def predict_spam(text:str) -> tuple[str,float]:

    # Use the same TF-IDF transformation learned during training.
    features = tfidf.transform([text])

    # Get the model's predicted class.
    prediction = model.predict(features)[0]

    # Find the probability associated with the spam class.
    probabilities = model.predict_proba(features)[0]
    classes = list(model.classes_)

    spam_index = next(
        (
            i for i, label in enumerate(classes)
            if str(label).strip().lower() in {"spam", "1"}
        ),
        None,
    )

    if spam_index is None:
        raise ValueError(
            f"Cannot identify the spam class. Model classes: {classes}"
        )

    spam_probability = float(probabilities[spam_index])

    # Support models trained with either string labels or 0/1 labels.
    is_spam = (
        str(prediction).strip().lower() in {"spam", "1"}
    )

    status = "spam" if is_spam else "legitimate"

    return status, spam_probability


