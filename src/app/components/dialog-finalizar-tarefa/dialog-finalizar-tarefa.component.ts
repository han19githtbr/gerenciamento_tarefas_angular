import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-finalizar-tarefa',
  templateUrl: './dialog-finalizar-tarefa.component.html',
  styleUrls: ['./dialog-finalizar-tarefa.component.scss']
})
export class DialogFinalizarTarefaComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogFinalizarTarefaComponent>
  ) {}
}
