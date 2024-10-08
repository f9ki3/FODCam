import eventlet
eventlet.monkey_patch()
import cv2
import os
import numpy as np
import csv
from flask import Flask, render_template, redirect, session, request, jsonify, url_for
from flask_socketio import SocketIO
import base64
import time
import threading

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ghjasqi'  # Replace with your secret key
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')
app.secret_key = 'jahsdgsajdbnjgas'

# Load YOLOv3
net = cv2.dnn.readNet("yolov3.weights", "yolov3.cfg")

# Load class names
with open("coco.names", "r") as f:
    classes = [line.strip() for line in f.readlines()]

# Initialize a lock for thread-safe operations
lock = threading.Lock()

# Initialize a list to store detected objects
detected_objects = []

# Define the log file path for CSV
log_file_path = os.path.join('static', 'logs', 'logs.csv')

# Create the logs directory if it doesn't exist
os.makedirs(os.path.dirname(log_file_path), exist_ok=True)

# Write CSV headers if the file does not exist
if not os.path.isfile(log_file_path):
    with open(log_file_path, mode='w', newline='') as log_file:
        writer = csv.writer(log_file)
        writer.writerow(['Date', 'Detected Objects'])  # Write headers

# Function to perform object detection
def detect_objects(frame):
    height, width, _ = frame.shape
    blob = cv2.dnn.blobFromImage(frame, 1/255.0, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    outs = net.forward(net.getUnconnectedOutLayersNames())

    class_ids = []
    confidences = []
    boxes = []
    current_detections = []

    # Process the output
    for out in outs:
        for detection in out:
            scores = detection[5:]  # The first 5 elements are box attributes
            class_id = np.argmax(scores)
            confidence = scores[class_id]
            if confidence > 0.5:  # Confidence threshold
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)

                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                boxes.append([x, y, w, h])
                confidences.append(float(confidence))
                class_ids.append(class_id)
                current_detections.append(classes[class_id])

    indexes = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    COLORS = np.random.uniform(0, 255, size=(len(classes), 3))

    if len(indexes) > 0:
        for i in indexes.flatten():
            x, y, w, h = boxes[i]
            label = str(classes[class_ids[i]])
            confidence = confidences[i]
            color = COLORS[class_ids[i]]
            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
            cv2.putText(frame, f"{label} {confidence:.2f}", (x, y - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

    return frame, current_detections

# Function to log detected objects every second
def log_detected_objects():
    global detected_objects
    
    while True:
        time.sleep(1)  # Wait for 1 second
        with lock:
            if detected_objects:
                # Create a timestamp
                timestamp = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
                # Write to CSV
                with open(log_file_path, mode='a', newline='') as log_file:
                    writer = csv.writer(log_file)
                    # Store detected objects as a single string in one column
                    writer.writerow([timestamp, ', '.join(set(detected_objects))])  # Write the date and unique objects
                # Clear the detected objects list
                detected_objects = []

# Start the logging thread
logging_thread = threading.Thread(target=log_detected_objects)
logging_thread.daemon = True
logging_thread.start()

# Background task for video streaming
def video_stream():
    global detected_objects
    camera = cv2.VideoCapture(0)  # 0 for the default webcam
    if not camera.isOpened():
        print("Error: Could not open video stream.")
        return

    while True:
        success, frame = camera.read()
        if not success:
            print("Error: Failed to read frame from camera.")
            break
        else:
            frame, current_detections = detect_objects(frame)
            frame_bytes = cv2.imencode('.jpg', frame)[1].tobytes()
            encoded_frame = base64.b64encode(frame_bytes).decode('utf-8')
            socketio.emit('frame', {'image': encoded_frame})

            # Update detected_objects list in a thread-safe manner
            with lock:
                detected_objects.extend(current_detections)

        socketio.sleep(0.01)  # Control frame capture rate

@app.route('/')
def index():
    if session.get('logged_in'):
        return redirect('FODCam-cctv') 
    return redirect('/login')

@app.route('/login')
def login():
    if session.get('logged_in'):
        return redirect('FODCam-cctv') 
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect('login')

@app.route('/post_login', methods=['POST'])
def post_login():
    data = request.get_json()
    uname = data.get('uname')
    passw = data.get('passw')
    
    if uname == "FODCamAdmin" and passw == "FODCam2024":
        session['logged_in'] = True  
        return jsonify({'status': 'success'})
    else:
        session['logged_in'] = False  
        return jsonify({'status': 'failure'})

@socketio.on('request_logs')
def send_logs():
    try:
        with open(log_file_path, mode='r', newline='') as log_file:
            reader = csv.reader(log_file)
            logs = list(reader)
        # Emit the logs to the client
        socketio.emit('update_logs', logs)
    except Exception as e:
        socketio.emit('update_logs', {'error': str(e)})


@app.route('/FODCam-cctv')
def cctv():
    if not session.get('logged_in'):
        return redirect(url_for('login'))  # Redirect to login if not logged in
    # Start the video feed task only when this route is requested
    socketio.start_background_task(video_stream)
    return render_template('cctv.html')

@app.route('/abouts')
def about():
    if not session.get('logged_in'):
        return redirect(url_for('login')) 
    return render_template('about.html')

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

if __name__ == "__main__":
    socketio.run(app, debug=True, host="0.0.0.0")