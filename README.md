# Circuit Diagram Recognition App

This project is aimed at recognizing hand-drawn circuit diagrams using a trained machine learning model and a Flask web application.

## Setup

1. **Clone the Repository:**
   ```
   git clone https://github.com/praveensg0/drawApp
   ```

2. **Install Dependencies:**
   ```
    pip install -r requirements.txt
   ```

3. **Run Flask App:**
   ```
   python app.py
   ```

4. **Open the Application:**
   Open `index.html` in a web browser.

## Issues Encountered

### Flask Method Not Allowed (405) Error:
- The Flask app might not be properly configured to handle POST requests.
- Ensure that the Flask server is running and accessible at `http://127.0.0.1:5000`.
- Check the CORS setup if accessing the server from a different origin.
- Verify that the `fetch` request in `script.js` points to the correct Flask URL.

### SyntaxError: Unexpected end of JSON input:
- This error occurs when the JSON response from the server is incomplete or invalid.
- Check the Flask server to ensure it is sending a valid JSON response.
- Verify that the response handling in `script.js` is correct.

## Contributing

Contributions to improve this project are welcome! If you encounter any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
