from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/posts/1', methods=['GET'])
def get_post():
    response = {
        "userId": 1,
        "id": 1,
        "title": "Sample Post",
        "body": "This is a sample post from the local server."
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Host on all network interfaces
