import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertModalService } from 'src/app/services/alert-modal.service';

@Component({
    selector: 'app-alert-modal',
    templateUrl: './alert-modal.component.html',
    styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent{

    type: string = '';

    constructor(
      public snackBarRef: MatSnackBarRef<AlertModalService>, private alertModalService: AlertModalService,
      @Inject(MAT_SNACK_BAR_DATA) public data: any
    ) {

    }

    ngOnInit() {
      this.type = this.alertModalService.type;
    }
}
