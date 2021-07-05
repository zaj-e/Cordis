from keras.models import Sequential
from keras.layers import Dense
from numpy import ndarray
from pandas import DataFrame
from sklearn.preprocessing import StandardScaler


class CustomModel:
    dataset: DataFrame
    model: Sequential
    X_scaled: ndarray
    X: DataFrame
    y: DataFrame

    def configure(self, dataset: DataFrame):
        self.dataset = dataset

        # noinspection SpellCheckingInspection
        input_attributes = ['age', 'sex', 'cp', 'trestbps', 'chol', 'fbs', 'restecg',
                            'thalach', 'exang', 'oldpeak', 'slope', 'ca', 'thal']
        predicted_attribute = ['target']

        self.X, self.y = self.dataset.loc[:, input_attributes], self.dataset.loc[:, predicted_attribute]
        self.X_scaled = StandardScaler().fit_transform(self.X)

        self.model = Sequential()

        self.model.add(Dense(150, input_dim=len(input_attributes), activation='relu'))
        self.model.add(Dense(8, activation='relu'))
        self.model.add(Dense(1, activation='sigmoid'))

        # noinspection SpellCheckingInspection
        self.model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

    def train(self):
        self.model.fit(self.X_scaled, self.y, epochs=150, batch_size=10)

    def determine_accuracy(self, should_print: bool = False):
        _, accuracy = self.model.evaluate(self.X_scaled, self.y)
        if should_print:
            print('Accuracy: %.2f' % (accuracy * 100))
        return accuracy

    def predict(self, x, should_print: bool = False):
        raw_predictions = self.model.predict(x)
        predictions = [round(x[0]) for x in raw_predictions]
        if should_print:
            print(predictions)
        return predictions

    def compare_training_predictions_with_expected_values(self):
        predictions = self.predict(self.X_scaled)
        for i in range(190):
            items = self.X.iloc[[i]].values
            prediction = predictions[i]
            expected = self.y.iloc[[i]].values[0][0]
            print(f'{items} => {prediction} (expected {expected})')

    def save(self):
        model_json = self.model.to_json()
        with open("model.json", "w") as json_file:
            json_file.write(model_json)

        self.model.save_weights("model.h5")
        print('Custom Model Saved')
