import pandas as pd
from keras.models import model_from_json
from sklearn.preprocessing import StandardScaler

from javascript import export_model_to_js
from neural_network import CustomModel

load_existing = True
custom_model: CustomModel = CustomModel()

if load_existing:
    json_file = open('model/model.json', 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    keras_model = model_from_json(loaded_model_json)
    keras_model.load_weights("model/model.h5")
    custom_model.model = keras_model
    print('Loaded persisted model')
else:
    try:
        dataset = pd.read_csv('../data/heart.csv', delimiter=',')
    except IOError:
        raise Exception("Unable to read file")

    custom_model.configure(dataset)
    custom_model.train()
    custom_model.save()
    export_model_to_js(custom_model.model)

    # custom_model.compare_training_predictions_with_expected_values()
    print('Fresh model')

df = pd.DataFrame(
    {"age": [63, 46, 23],
     "sex": [1, 1, 1],
     "cp": [3, 0, 0],
     "trestbps": [145, 140, 130],
     "chol": [233, 311, 131],
     "fbs": [1, 0, 0],
     "restecg": [0, 1, 1],
     "thalach": [150, 120, 115],
     "exang": [0, 1, 1],
     "oldpeak": [2.3, 1.8, 1.2],
     "slope": [0, 1, 1],
     "ca": [0, 2, 1],
     "thal": [1, 3, 3]})

# g_df = StandardScaler().fit_transform(df)

custom_model.predict(df, should_print=True)

