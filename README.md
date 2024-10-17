
# FODCam

## About the FODCam
FODCam, or Foreign Object Detection Camera, is an innovative surveillance solution designed to enhance security by detecting and identifying objects in real time.

This advanced system operates similarly to traditional CCTV cameras but with a significant upgrade: it utilizes cutting-edge hardware to capture image feeds, which are then transmitted to a Flask server for processing.

By leveraging powerful libraries like OpenCV and the YOLO (You Only Look Once) model, FODCam efficiently analyzes the incoming images to detect foreign objects within its field of view.

This capability not only improves situational awareness but also aids in proactive security measures, making FODCam an invaluable tool for both commercial and residential surveillance applications.

With its seamless integration of hardware and software, FODCam is poised to redefine how we monitor our surroundings.

### Developers
- Mateo, Jonathan Emmannuel
- Sapiter, Ann Louise Margueritt
- Asuncion, Ashley Nicole
- Santos, Mary Franceska
- Rivera, Ervin Jay


### Schools
The Philippine College of Aeronautics (PCA), also known as PhilSCA, located in Villamor, Pasay City, is a premier institution dedicated to providing high-quality education and training in the field of aviation and aeronautics. With a strong emphasis on practical experience and industry partnerships, PCA prepares its students for successful careers in various aviation sectors, including pilot training, aircraft maintenance, and aviation management.

## Installation

To get started with the FODCam project, you will need to install the following dependencies:

1. **Eventlet** for asynchronous networking:
   ```bash
   pip install eventlet
   ```

2. **OpenCV** for image and video processing:
   ```bash
   pip install opencv-python
   ```

3. **Flask** and **Flask-SocketIO** for the web application and real-time communication:
   ```bash
   pip install Flask Flask-SocketIO
   ```

4. **NumPy** for efficient array and matrix operations:
   ```bash
   pip install numpy
   ```

5. **CSV Handling** (optional):
   ```bash
   pip install python-csv
   ```
### Other Files Dependencies
- coco.names https://github.com/pjreddie/darknet/blob/master/data/coco.names
- yolo3.cfg https://github.com/pjreddie/darknet/blob/master/cfg/yolov3.cfg
- yolo3.weights https://github.com/patrick013/Object-Detection---Yolov3/blob/master/model/yolov3.weights

## Usage

Once you have installed the necessary packages, you can start developing the FODCam application. Below is a sample import statement to include in your main application file:

```python
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
```

### Running the Application

Follow these steps to run the application:
1. Ensure all the dependencies are installed.
2. Start the Flask server.
3. Access the application through your web browser.

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please feel free to reach out or submit a pull request.


