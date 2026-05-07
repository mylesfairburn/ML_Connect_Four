# Machine Learning - Connect Four Game

I am attempting to create an AI that you can play against at connect four. To achieve this I am going to create my own neural network, not using PyTorch or TensorFlow.
Flask is going to be used to control the server, handling communication between; HTML, JavaScript and python files.

## File Structure
```
ML_Connect_Four/
├── static/
│   ├── client.js
│   └── style.css
├── templates/
│   └── index.html
├── .gitignore
├── README.md
├── requirements.txt
├── app.py
├── model.py
├── train.py
└── weights.npy
```

## Web Design
Since the main focus of this project is not to improve web design skills, I have used a generative AI to create; index.html, style.css and client.js.
All other files have been created by myself.

## Neural network Architecture
NumPy is going to be the biggest helper when creating the neural network from scratch, using NumPy arrays to store the board state. <br>

- **Input layer:** 42 nodes (6 X 7 board size, encoded to player, AI and empty)
- **Hidden Layer:** 2 dense layers with ReLU activation
- **Output Layer** 7 nodes (one per column) using softmax activation

## Training
In order to train the AI, to improve its connect four skills, the train.py file will be used. 
Consequently the training can be completed offline, speeding up the training process. <br>

Two versions of the bot will be used for training, saving model versions as 'checkpoints' as it continues to improves.

## Dependancies
See the requirements file for depenancies.
