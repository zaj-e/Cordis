import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-dialog-content-example-dialog',
  templateUrl: './dialog-content-example-dialog.component.html',
})
export class  DialogContentExampleDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: {text: string, description: string, disclaimer: string}) {}
}
