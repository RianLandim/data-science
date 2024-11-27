from flask import Flask, request, jsonify
import pandas as pd
import joblib

# Load the trained model and LabelEncoder
rf_model = joblib.load('./model/rf_model_treinado.joblib')
region_label_encoder = joblib.load('./model/rf_label_encoder_region.joblib')
state_label_encoder = joblib.load('./model/rf_label_encoder_state.joblib')

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Parse input JSON
        data = request.json
        region = data['Region']  # Region as string (e.g., 'N')
        month = data['Month']    # Month as integer (e.g., 1)
        year = data['Year']    # Month as integer (e.g., 1)
        state = data['State']

        # Encode the region using LabelEncoder
        region_encoded = region_label_encoder.transform([region])[0]
        state_encoded = state_label_encoder.transform([state])[0]

        # Create a DataFrame for prediction
        new_data = pd.DataFrame({
            'Region': [region_encoded],
            'State': [state_encoded],
            'year': [year],
            'month': [month],
        })

        # Predict using the model
        prediction = rf_model.predict(new_data)[0]




        # Return the prediction and AI-generated explanation
        return jsonify({
            'prediction': prediction,
            # 'explanation': ai_response
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
