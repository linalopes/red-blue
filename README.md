# Red-Blue Project
This project combines Teachable Machine and p5.js to create an interactive experience where users can control animations using their body poses. The project uses pose estimation to detect whether the user is in a "Red" or "Blue" pose, and based on the prediction, different animations are displayed on the screen.

## Features
Pose Detection: The project uses Google's Teachable Machine to detect user poses in real-time via a webcam.

Interactive Animations: Based on the detected pose (Red or Blue), different animations are triggered using p5.js.

Multiple Animations: The project includes three different animations that can be switched using keyboard inputs (1, 2, 3).

## Technologies Used
- Teachable Machine: For training and deploying the pose estimation model.
- p5.js: For creating and rendering interactive animations.
- TensorFlow.js: For running the machine learning model in the browser.
- Bootstrap: For responsive design and layout.

## How It Works
Pose Detection: The webcam captures the user's pose, and the Teachable Machine model predicts whether the pose is "Red" (both arms up) or "Blue" (right arm down).

Animation Control: Based on the predicted pose, the corresponding animation is displayed. The user can also switch between animations using the keyboard keys 1, 2, and 3.

Real-Time Feedback: The webcam feed and the predicted pose are displayed on the screen, along with the probability of each pose.

## Setup Instructions
Prerequisites
- A modern web browser with webcam access.
- Node.js (optional, for local development).
- Running the Project

Clone the Repository:

```
git clone https://github.com/your-username/red-blue-project.git
cd red-blue-project
```

Open the Project Using a Local Server:

If you want to run the project on a local server (recommended for development), you can use a simple HTTP server like http-server:

```
npm install -g http-server
http-server
```

Then, open http://localhost:8080 in your browser.

## Customizing the Model
If you want to train your own pose detection model:

- Go to Teachable Machine and create a new pose estimation project.
- Train the model with your own poses (e.g., "Red" and "Blue").
- Export the model and replace the URL in tm-pose.js with your model's URL.

## Project Structure
- index.html: The main HTML file that includes the necessary scripts and sets up the layout.
- sketch.js: Contains the p5.js code for rendering animations based on the predicted pose.
- tm-pose.js: Handles the pose detection using Teachable Machine and TensorFlow.js.
- styles.css: Custom styles for the project.

## Animations
- Animation 1: Circles grow from the center of the canvas. The color of the circles changes based on the predicted pose (Red or Blue).
- Animation 2: Lines move horizontally across the canvas. The color of the lines changes based on the predicted pose.
- Animation 3: Random rectangles appear on the canvas with varying transparency. The color of the rectangles changes based on the predicted pose.

## Keyboard Controls
1: Switch to Animation 1.
2: Switch to Animation 2.
3: Switch to Animation 3.

---

Contributing
Contributions are welcome! If you have any suggestions, improvements, or bug fixes, feel free to open an issue or submit a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.