from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import base64
import io
from PIL import Image

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the trained model
model = tf.keras.models.load_model('circuit_recognition_model.h5')

def recognize_image(image_data):
    image_data = image_data.split(",")[1]
    image_data = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_data)).convert('L')
    image = image.resize((28, 28))
    image = np.array(image)
    image = image / 255.0
    image = image.reshape((1, 28, 28))

    predictions = model.predict(image)
    recognized_class = np.argmax(predictions)
    return recognized_class

@app.route('/recognize', methods=['POST'])
def recognize():
    data = request.get_json()
    if 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400
    
    image_data = data['image']
    recognized_symbol = recognize_image(image_data)
    
    return jsonify({'recognized': recognized_symbol})

if __name__ == '__main__':
    app.run(debug=True)
