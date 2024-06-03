import tensorflow as tf
from tensorflow.keras import layers, models

def train_model():
    # Load the MNIST dataset
    (train_images, train_labels), (test_images, test_labels) = tf.keras.datasets.mnist.load_data()

    # Normalize the images
    train_images = train_images / 255.0
    test_images = test_images / 255.0

    # Define the model
    model = models.Sequential([
        layers.Flatten(input_shape=(28, 28)),
        layers.Dense(128, activation='relu'),
        layers.Dense(10, activation='softmax')
    ])

    # Compile the model
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    # Train the model
    model.fit(train_images, train_labels, epochs=5)

    # Save the model
    model.save('circuit_recognition_model.h5')

if __name__ == "__main__":
    train_model()
