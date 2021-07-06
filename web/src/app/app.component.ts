import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';

interface ElectrocardiogramResult {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  title = 'bio';
  value = 'Clear me';
  model : tf.LayersModel
  selectedValue: string;

  electrocardiogram_results: ElectrocardiogramResult[] = [
    {value: '0', viewValue: 'Normal'},
    {value: '1', viewValue: 'Tener una anomalía de la onda ST-T'},
    {value: '2', viewValue: 'Hipertrofia ventricular izquierda'}
  ];

  ngOnInit(): void {
    this.loadModel().then(() => {
      this.makePrediction();
    })
  }

  async loadModel() {
    this.model = await tf.loadLayersModel
    ("https://raw.githubusercontent.com/zaj-e/Cordis/main/keras/js_model/model.json");
  }


  makePrediction() {
    let input_xs = tf.tensor2d([
      // [63, 1, 3, 145, 233, 1, 0, 150, 0, 2.3, 0, 0, 1]
      // sf_enc
      [23, 1, 0, 130, 131, 0, 1, 115, 1, 1.2, 1, 1, 3]
    ]);

    let output = this.model.predict(input_xs) as tf.Tensor;
    let realOutput = Math.round(output.dataSync()[0])
    console.log('This is the good one:', realOutput);
  }

  formatLabel(value: number) {
    return value;
  }

}
