import {Component, OnInit} from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogContentExampleDialogComponent} from "./dialog-content-example-dialog/dialog-content-example-dialog.component";

interface ListItem {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  constructor(public dialog: MatDialog) {
    this.disclaimer = "Descargo de responsabilidad: Este software no representa un resultado clínico serio ni pretende reemplazar atención medica.";
  }

  title = 'bio';
  value = 'Clear me';
  model: tf.LayersModel

  age: string;
  sex: string;
  cp: string;
  trestbps: string;
  chol: string;
  fbs: string;
  restecg: string;
  thalach: string;
  exang: string;
  oldpeak: string;
  slope: string;
  ca: string;
  thal: string;

  text: string;
  description: string;
  disclaimer: string;

  electrocardiogramResults: ListItem[] = [
    {value: '0', viewValue: 'Normal'},
    {value: '1', viewValue: 'Anomalía de la onda ST-T'},
    {value: '2', viewValue: 'Hipertrofia ventricular izquierda'}
  ];

  thalOptions: ListItem[] = [
    {value: '0', viewValue: 'Normal'},
    {value: '1', viewValue: 'Defecto fijo'},
    {value: '2', viewValue: 'Defecto reversible'}
  ];

  chestPain: ListItem[] = [
    {value: '1', viewValue: 'Angina típica'},
    {value: '2', viewValue: 'Angina atípica'},
    {value: '3', viewValue: 'Dolor no anginoso'},
    {value: '4', viewValue: 'Asintomático'}
  ];

  ngOnInit(): void {
    this.loadModel().then(() => {
      console.log("Model loaded correctly");
    })
  }

  async loadModel() {
    this.model = await tf.loadLayersModel
    ("https://raw.githubusercontent.com/zaj-e/Cordis/main/keras/js_model/model.json");
  }

  makePrediction(inputs: number[]): number {
    let input_xs = tf.tensor2d([
      inputs
      // [63, 1, 3, 145, 233, 1, 0, 150, 0, 2.3, 0, 0, 1]
      // [23, 1, 0, 130, 131, 0, 1, 115, 1, 1.2, 1, 1, 3]
    ]);

    let output = this.model.predict(input_xs) as tf.Tensor;
    let value = Math.round(output.dataSync()[0]);
    return value;
  }

  formatLabel(value: number) {
    return value;
  }

  openDialog() {
    let errors: string [] = [];

    if (this.age == undefined) {
      errors.push('Edad');
    }

    if (this.trestbps == undefined) {
      errors.push('Presión sanguínea en reposo');
    }

    if (this.chol == undefined) {
      errors.push('Colesterol sérico');
    }

    if (this.thalach == undefined) {
      errors.push('Frecuencia cardíaca máxima alcanzada');
    }

    if (this.oldpeak == undefined) {
      errors.push('Depresión del ST');
    }

    if (this.slope == undefined) {
      errors.push('Pendiente del segmento ST ');
    }

    if (this.ca == undefined) {
      errors.push('Número de vasos principales ');
    }

    if (this.sex == undefined) {
      errors.push('Sexo');
    }

    if (this.cp == undefined) {
      errors.push('Tipo de dolor en pecho');
    }

    if (this.fbs == undefined) {
      errors.push('Glucemia en ayunas > 120 mg/dl');
    }

    if (this.exang == undefined) {
      errors.push('Angina inducida por ejercicio');
    }

    if (this.restecg == undefined) {
      errors.push('Resultados electrocardiográficos');
    }

    if (this.thal == undefined) {
      errors.push('Thal');
    }


    if (errors.length > 0) {
      alert(`Faltan los siguientes campos: ${errors}`)
    } else {

      let result = this.makePrediction([
        Number(this.age),
        Number(this.sex),
        Number(this.cp),
        Number(this.trestbps),
        Number(this.chol),
        Number(this.fbs),
        Number(this.restecg),
        Number(this.thalach),
        Number(this.exang),
        Number(this.oldpeak),
        Number(this.slope),
        Number(this.ca),
        Number(this.thal),
      ]);

      if (result == 0) {
        this.text = 'No es muy probable que usted sufra un infarto';
        this.description = 'Diagnóstico de enfermedad cardíaca (estado de enfermedad angiográfica) [Menos de 50% de estrechamiento del diámetro]';
      } else {
        this.text = 'Es probable que usted llegue a sufrir un infarto';
        this.description = 'Diagnóstico de enfermedad cardíaca (estado de enfermedad angiográfica) [Mas de 50% de estrechamiento del diámetro].';
      }

      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = {
        text: this.text,
        description: this.description,
        disclaimer: this.disclaimer
      };

      const dialogRef = this.dialog.open(DialogContentExampleDialogComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }
  }
}
