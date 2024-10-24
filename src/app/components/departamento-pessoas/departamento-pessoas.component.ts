import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pessoa } from 'src/app/model/Pessoa.model';
import { PessoaService } from 'src/app/services/pessoa.service';

@Component({
  selector: 'app-departamento-pessoas',
  templateUrl: './departamento-pessoas.component.html',
  styleUrls: ['./departamento-pessoas.component.css']
})
export class DepartamentoPessoasComponent implements OnInit {

  departamentoId: number;
  pessoas: Pessoa[];

  constructor(
    private route: ActivatedRoute,
    private pessoaService: PessoaService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.departamentoId = params['departamentoId'];
      this.carregarPessoasPorDepartamento(this.departamentoId);
    });
  }

  carregarPessoasPorDepartamento(departamentoId: number): void {
    this.pessoaService.getPessoasPorDepartamento(departamentoId).subscribe(
      (data: Pessoa[]) => {
        this.pessoas = data;
      },
      error => {
        console.error('Erro ao carregar pessoas por departamento:', error);
      }
    );
  }
}

