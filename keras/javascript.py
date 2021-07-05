import keras
import tensorflowjs as tfjs


def export_model_to_js(model: keras.models.Sequential):
    tfjs.converters.save_keras_model(model, 'js_model')
