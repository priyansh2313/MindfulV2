import cv2
import numpy as np
import tensorflow as tf

# Load pre-trained model
new_model = tf.keras.models.load_model('body_model_64p35_New6_Final.h5')  # Load your trained model

# Load Haar Cascade for face detection
faceCascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

angryCount = 0
happyCount = 0 
sadCount = 0
depressedCount = 0

# Initialize video capture
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    raise IOError("Cannot open webcam")

while True:
    ret, frame = cap.read()
    if not ret:
        continue  # Skip frame if not read properly

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = faceCascade.detectMultiScale(gray, 1.1, 4)

    status = "No One Detected"
    face_roi = None

    for x, y, w, h in faces:
        roi_gray = gray[y:y+h, x:x+w]
        roi_color = frame[y:y+h, x:x+w]

        # cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)

        # Crop face region
        face_roi = cv2.resize(roi_color, (224, 224))
        face_roi = np.expand_dims(face_roi, axis=0)  # Add batch dimension
        face_roi = face_roi / 255.0  # Normalize pixel values

        # Predict emotion
        Predictions = new_model.predict(face_roi)
        emotion_index = np.argmax(Predictions)

        emotions = ["Angry", "Sad", "Depressed", "Happy", "Sad", "Happy"]
        status = emotions[emotion_index]

        if status == "Angry":
            angryCount += 1
        elif status == "Happy":
            happyCount += 1
        elif status == "Sad":
            sadCount += 1
        elif status == "Depressed":
            depressedCount += 1

    # Display status
    x1, y1, w1, h1 = 10, 10, 200, 50
    cv2.rectangle(frame, (x1, y1), (x1 + w1, y1 + h1), (0, 0, 0), -1)
    cv2.putText(frame, status, (x1 + 10, y1 + 35), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow('Body Emotion Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        totalCount = angryCount + happyCount + sadCount + depressedCount
        angryPercentage = (angryCount / totalCount) * 100 if totalCount > 0 else 0
        happyPercentage = (happyCount / totalCount) * 100 if totalCount > 0 else 0
        sadPercentage = (sadCount / totalCount) * 100 if totalCount > 0 else 0
        depressedPercentage = (depressedCount / totalCount) * 100 if totalCount > 0 else 0

        print(f"Angry: {angryPercentage:.2f} %")
        print(f"Happy: {happyPercentage:.2f} %")
        print(f"Sad: {sadPercentage:.2f} %")
        print(f"Depressed: {depressedPercentage:.2f} %")
        break


cap.release()
cv2.destroyAllWindows()
