import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


SPOONACULAR_API_KEY = os.getenv("SPOONACULAR_API_KEY")

if not SPOONACULAR_API_KEY:
    raise ValueError("Missing Spoonacular API key in .env file!")

@app.route("/getIngredients", methods=["POST"])
def get_recipes():
    try:
        data = request.get_json()
        if not data or "query" not in data:
            return jsonify({"error": "Missing 'query' in request body"}), 400

        query = data["query"]

        url = (
            "https://api.spoonacular.com/food/ingredients/search"
            f"?query={query}&number=20&apiKey={SPOONACULAR_API_KEY}"
        )

        response = requests.get(url)
        response.raise_for_status()
        api_data = response.json()

        return jsonify(api_data)

    except requests.RequestException as e:
        return jsonify({"error": "Error calling Spoonacular API", "details": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
