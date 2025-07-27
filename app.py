from flask import Flask, render_template, request, jsonify, redirect
from googletrans import Translator
import json
from PIL import Image
import numpy as np

app = Flask(__name__)

# Load local data
with open('data/crop_calendar.json') as f:
    crop_data = json.load(f)

with open('data/tips.json') as f:
    tips_data = json.load(f)

# Home
@app.route('/')
def index():
    return render_template('index.html')

# Crop Calendar
@app.route('/calendar', methods=['GET', 'POST'])
def calendar():
    crops = []
    if request.method == 'POST':
        region = request.form['region'].strip().lower()
        month = request.form['month'].strip().lower()
        for entry in crop_data:
            entry_region = entry.get('region', '').lower()
            entry_month = entry.get('month', '').lower()
            if entry_region == region and entry_month == month:
                crops = entry.get('crops', [])
                break
    return render_template('calendar.html', crops=crops)
# Government Schemes
@app.route('/schemes', methods=['GET', 'POST'])
def schemes():
    schemes = {}
    if request.method == 'POST':
        farmer_type = request.form['farmer_type'].strip().lower()
        with open('data/govt_schemes.json') as f:
            all_schemes = json.load(f)
            schemes = all_schemes.get(farmer_type, [])
    return render_template('schemes.html', schemes=schemes)


# Disease Detector (Mocked for now)
@app.route('/disease', methods=['GET', 'POST'])
def disease():
    if request.method == 'POST':
        if 'file' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Dummy prediction for now (replace with your model logic)
        predicted_disease = "Tomato Yellow Leaf Curl Virus"
        confidence_score = "94%"
        treatment = "Neem oil spray, remove infected plants, and rotate crops."

        return jsonify({
            'disease': predicted_disease,
            'confidence': confidence_score,
            'treatment': treatment
        })

    # For GET requests, just render the HTML page
    return render_template('disease.html')
@app.route('/predict_disease', methods=['POST'])
def predict_disease():
    if 'image' not in request.files:
        return redirect('/disease')
    
    image = request.files['image']
    if image.filename == '':
        return redirect('/disease')

    # Save or process image here
    # Example dummy response
    prediction = "Tomato Leaf Blight"
    remedy = "Use copper-based fungicide. Ensure proper spacing between plants."

    return render_template('disease.html', prediction=prediction, remedy=remedy)

# Farming Tips (Rule-based response)
@app.route('/tips', methods=['GET', 'POST'])
def tips():
    if request.method == 'POST':
        try:
            data = request.get_json()
            query = data.get("query", "").lower()

            if "tomato" in query and "pest" in query:
                response = "🧪 Use neem oil spray and maintain clean surroundings."
            elif "fertilizer" in query:
                response = "🌿 Use urea for nitrogen, potash for flowering. Get soil tested."
            elif "organic" in query:
                response = "🌱 Use compost, vermicompost, and natural manure."
            elif "irrigation" in query:
                response = "💧 Prefer drip irrigation. Water early morning or late evening."
            elif "wheat" in query:
                response = "🌾 Wheat grows best in Rabi season. Use NPK-balanced fertilizers."
            elif "rice" in query:
                response = "🌾 Maintain water level and watch for blast disease symptoms."
            else:
                response = "🤖 Sorry, I don’t have tips for that yet. Try another question!"

            return jsonify({"response": response})
        except Exception as e:
            print("Error:", e)
            return jsonify({"response": "⚠️ Error getting tips. Try again later."})
    return render_template('tips.html')

# Translator
@app.route('/translator', methods=['GET', 'POST'])
def translator():
    translation = ""
    if request.method == 'POST':
        text = request.form['text']
        target = request.form['target']
        translator = Translator()
        translation = translator.translate(text, dest=target).text
    return render_template('translator.html', translation=translation)

if __name__ == '__main__':
    app.run(debug=True)
