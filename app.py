from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import face_recognition
import numpy as np
import pickle
import base64
import datetime
import pandas as pd

app = Flask(__name__)
CORS(app)

# Constants
KNOWN_FACES_DIR = 'known_faces/images'
ENCODINGS_FILE = 'encodings.pkl'
ATTENDANCE_FILE = 'attendance.csv'

# Load encodings
if os.path.exists(ENCODINGS_FILE):
    with open(ENCODINGS_FILE, 'rb') as f:
        known_faces = pickle.load(f)
else:
    known_faces = []

# Init attendance file
if not os.path.exists(ATTENDANCE_FILE):
    df = pd.DataFrame(columns=["Name", "Time"])
    df.to_csv(ATTENDANCE_FILE, index=False)

def mark_attendance(name):
    now = datetime.datetime.now()
    time_str = now.strftime("%Y-%m-%d %H:%M:%S")
    df = pd.read_csv(ATTENDANCE_FILE)

    # check if already marked within 1 minute
    if name in df["Name"].values:
        last_time_str = df[df["Name"] == name]["Time"].values[-1]
        last_time = datetime.datetime.strptime(last_time_str, "%Y-%m-%d %H:%M:%S")
        if (now - last_time).total_seconds() < 60:
            return False  # ⏳ too soon, skip
          
    # ✅ mark new attendance
    df.loc[len(df.index)] = [name, time_str]
    df.to_csv(ATTENDANCE_FILE, index=False)
    return True



@app.route('/')
def home():
    return "Backend running!"

@app.route('/register', methods=['POST'])
def register_face():
    data = request.json
    name = data['name']
    image_data = data['image']  # base64 string

    # Decode base64 image
    img_bytes = base64.b64decode(image_data.split(',')[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Save image
    if not os.path.exists(KNOWN_FACES_DIR):
        os.makedirs(KNOWN_FACES_DIR)
    cv2.imwrite(f"{KNOWN_FACES_DIR}/{name}.jpg", img)

    # Encode face
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb_img)
    encodings = face_recognition.face_encodings(rgb_img, boxes)

    if encodings:
        known_faces.append((name, encodings[0]))
        with open(ENCODINGS_FILE, 'wb') as f:
            pickle.dump(known_faces, f)
        return jsonify({"message": "✅ Face registered successfully!"})
    else:
        return jsonify({"error": "❌ No face detected!"}), 400

@app.route('/detect', methods=['POST'])
def detect_faces():
    data = request.json
    image_data = data['image']  # base64 string

    # Decode base64 image
    img_bytes = base64.b64decode(image_data.split(',')[1])
    np_arr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    boxes = face_recognition.face_locations(rgb_img)
    encodings = face_recognition.face_encodings(rgb_img, boxes)

    matched = []

    for face_encoding, box in zip(encodings, boxes):
        for name, known_encoding in known_faces:
            match = face_recognition.compare_faces([known_encoding], face_encoding)[0]
            if match:
                matched.append({
                    "name": name,
                    "box": box  # (top, right, bottom, left)
                })
                break

    return jsonify({"matched": matched})
    
@app.route('/mark_attendance', methods=['POST'])
def mark_attendance_route():
    data = request.json
    names = data.get("names", [])
    marked = []
    skipped = []

    for name in names:
        success = mark_attendance(name)
        if success:
            marked.append(name)
        else:
            skipped.append(name)

    # 🧠 Build detailed message
    messages = []
    if marked:
        messages.append(f"✅ Marked: {', '.join(marked)}")
    if skipped:
        messages.append(f"⏳ Already marked recently: {', '.join(skipped)}")

    if messages:
        return jsonify({"message": " | ".join(messages)})
    else:
        return jsonify({"message": "ℹ️ No attendance marked."})



@app.route('/attendance', methods=['GET'])
def get_attendance():
    df = pd.read_csv(ATTENDANCE_FILE)
    attendance_data = df.to_dict(orient='records')
    return jsonify({"attendance": attendance_data})




if __name__ == '__main__':
    app.run(debug=True)
