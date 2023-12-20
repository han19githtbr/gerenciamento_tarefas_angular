import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertModalService } from 'src/app/services/alert-modal.service';
import { Tarefa } from 'src/app/model/Tarefa.model';
import { TarefaService } from 'src/app/services/tarefa.service';

@Component({
  selector: 'app-adicionar-tarefa',
  templateUrl: './adicionar-tarefa.component.html',
  styleUrls: ['./adicionar-tarefa.component.scss']
})
export class AdicionarTarefaComponent implements OnInit {

  form!: FormGroup;

  title: string = '';

  oldTitle: string = '';

  tarefaButton: string = '';

  disableBox = false;

  tarefa: Tarefa = new Tarefa();

  tarefas: Tarefa[] = [];

  constructor(
      private fb: FormBuilder,
      public dialogRef: MatDialogRef<AdicionarTarefaComponent>,
      private alertModalService: AlertModalService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private tarefaService: TarefaService
  ) {
      this.title = data['title'];
      this.tarefa.id = data['id'];
      this.tarefa.titulo = data['titulo'];
      this.tarefa.descricao = data['descricao'];
      this.tarefa.prazo = data['prazo'];
      this.tarefa.ordem_apresentacao = data['ordem_apresentacao'];
      this.oldTitle = data['titulo'];
      this.tarefaButton = data['tarefaButton'];
  }

  ngOnInit() {
      this.form = this.fb.group({
        titulo: ['', [Validators.required, Validators.maxLength(255)]],
        descricao: ['', Validators.required],
        prazo: ['', [Validators.required, this.dataValida]],
      });
      this.tarefaService.getAllTarefa().subscribe((data: any) => {
        this.tarefas = data.body;
        console.log(this.tarefas);
      })
  }


  fecharCadastrarDialog(): void{
    this.dialogRef.close();
  }


  dataValida(control: FormControl) {
    const inputDate = new Date(control.value);

    if (isNaN(inputDate.getTime())) {
      return { dataInvalida: true };
    }

    return null;
  }


  /*submit(form: any) {
    this.disableBox = true;
    const tituloControl = form.get('titulo');
    if(!tituloControl.value){
        this.disableBox = false;
        this.alertModalService.mostrarMensagem("O campo tem que ser preenchido.", this.alertModalService.ERRO);
    } else {
        if(this.tarefaButton == "Create"){

            this.tarefaService.salvarTarefa(this.tarefa).subscribe(data => {
                if(data.body.success){
                    this.tarefa.id = data.body.id;
                    this.tarefa.titulo = data.body.titulo;
                    this.tarefa.descricao = data.body.descricao;
                    this.tarefa.prazo = data.body.prazo;
                    this.tarefa.ordem_apresentacao = data.body.ordem_apresentacao;
                    this.tarefa.mensagem = data.body.mensagem;
                    this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                    this.dialogRef.close(this.tarefa);
                } else{
                    this.disableBox = false;
                    this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                }
            })
          } else {
                const nomeTarefa = encodeURIComponent(this.oldTitle);
                this.tarefaService.alterarTarefa(nomeTarefa, this.tarefa).subscribe(data => {
                  if(data.body.success){
                      this.tarefa.id = data.body.id;
                      this.tarefa.titulo = data.body.titulo;
                      this.tarefa.descricao = data.body.descricao;
                      this.tarefa.prazo = data.body.prazo;
                      this.tarefa.ordem_apresentacao = data.body.ordem_apresentacao;
                      this.tarefa.mensagem = data.body.mensagem;
                      this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
                      this.dialogRef.close(this.tarefa);
                  } else {
                      this.disableBox = false;
                      this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
                  }
                })
        }
    }
  }*/


  submit(form: any) {
    this.disableBox = true;
    const tituloControl = form.get('titulo');
    if (!tituloControl.value) {
      this.disableBox = false;
      this.alertModalService.mostrarMensagem("O campo tem que ser preenchido.", this.alertModalService.ERRO);
    } else {
      const saveObservable = this.tarefaButton === "Create" ? this.tarefaService.salvarTarefa(this.tarefa) : this.tarefaService.alterarTarefa(this.oldTitle, this.tarefa);

      saveObservable.subscribe(
        (data) => {
          if (data.body.success) {
            this.tarefa = data.body;
            this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.SUCESSO);
            this.dialogRef.close(this.tarefa);
          } else {
            this.disableBox = false;
            this.alertModalService.mostrarMensagem(data.body.mensagem, this.alertModalService.ERRO);
          }
        },
        (error) => {
          this.disableBox = false;
          this.alertModalService.mostrarMensagem("Erro ao processar a requisição.", this.alertModalService.ERRO);
        }
      );
    }
  }

}
