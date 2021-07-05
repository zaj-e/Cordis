import pandas as pd
from keras.models import model_from_json

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
    # custom_model.compare_training_predictions_with_expected_values()
    print('Fresh model')

# custom_model.predict(pd.DataFrame(
#     {"age": [63, 57],
#      "sex": [1, 0],
#      "cp": [3, 1],
#      "trestbps": [145, 130],
#      "chol": [233, 236],
#      "fbs": [1, 0],
#      "restecg": [0, 0],
#      "thalach": [150, 174],
#      "exang": [0, 0],
#      "oldpeak": [2.3, 0],
#      "slope": [0, 1],
#      "ca": [0, 1],
#      "thal": [1, 2]}), should_print=True)

export_model_to_js(custom_model.model)
