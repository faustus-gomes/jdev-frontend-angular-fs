import { Component, OnInit } from '@angular/core';
import { PessoaJuridica } from 'src/app/model/pessoa-juridica';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PessoaJuridicaService } from 'src/app/services/pessoaJuridica.service';

@Component({
  selector: 'app-pessoa-juridica',
  templateUrl: './pessoa-juridica.component.html',
  styleUrls: ['./pessoa-juridica.component.css']
})
export class PessoaJuridicaComponent implements OnInit{
      lista = new Array<PessoaJuridica>();
      PJForm: FormGroup;
      PJ: PessoaJuridica;
      varPesquisa: String = '';
      qtdPagina: Number = 0;
      arrayNumber: Number[] = [];
      paginaAtual: Number = 1;

      constructor (private fb: FormBuilder, private pjService: PessoaJuridicaService, private loginService: LoginService) {

          this.PJ = new PessoaJuridica();

          /* Pegar dados do formulário, inicia e limpa */
          this.PJForm = this.fb.group({
            id:[],
            cnpj:[null, Validators.required],
            inscEstadual:[null, Validators.required],
            nomeFantasia: [null, Validators.required],
            razaoSocial: [null, Validators.required],
            categoria: [null, Validators.required],
            nome: [null, Validators.required],
            email: [null, Validators.required],
            telefone: [null, Validators.required],
            tipoPessoa: [null, Validators.required],
            asaasId: [null, Validators.required],
            dataCadastro: [null, Validators.required],
            empresa: [this.loginService.objetoEmpresa(), Validators.required]
          });
        }

    ngOnInit(): void {
          this.pjService.qtdPagina().subscribe({
            next: (res) => {
                //qtdPagina = res;
                 this.qtdPagina = Number(res);
                 this.arrayNumber = Array(this.qtdPagina).fill(0).map((x,i) =>i);

                 console.info(this.arrayNumber);
            },
            error: (error) => {
                this.qtdPagina = Number("0");
            }
          });

          this.listaPJ(1);

    }

    novo(): void {
    this.PJForm = this.fb.group({
      id:[],
      cnpj:[null, Validators.required],
      inscEstadual:[null, Validators.required],
      nomeFantasia: [null, Validators.required],
      razaoSocial: [null, Validators.required],
      categoria: [null, Validators.required],
      nome: [null, Validators.required],
      email: [null, Validators.required],
      telefone: [null, Validators.required],
      tipoPessoa: [null, Validators.required],
      asaasId: [null, Validators.required],
      dataCadastro: [null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
      //empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  /*Salvar PJ produto*/
      salvaPJ(){
        const acesso = this.pjObjeto();
        console.info(this.PJ);

        // Chamar o método que já tem o subscribe interno
        this.pjService.salvarPJ(this.PJ);

        // Pequeno delay para garantir que o salvamento foi processado
        setTimeout(() => {
            this.novo();
            this.listaPJ(this.paginaAtual);
        }, 500);
      }

    listaPJ(pagina: Number): void{
            this.pjService.listarPJ(pagina).subscribe({

        next: (res) => {
            this.atualizaQtdPagina();
            this.lista = res;

      },
      error: (error) => {
        alert(error);
      }
    });
  }

  /*Editar Categoria Produto*/
        editarPJ(c: PessoaJuridica): void {
          //console.info('Editando : '+ c.id);
          /*this.catProdForm = this.fb.group({
              id:[c.id],
              nomeDesc:[c.nomeDesc, Validators.required],
              empresa: [c.empresa, Validators.required]
            });*/

            this.pjService.buscarPorId(c.id).subscribe({
              next: (data) => {
                this.PJ = data;

                // Só atualiza o formulário depois que os dados chegaram
                this.PJForm = this.fb.group({
                  id: [this.PJ.id],
                  cnpj: [this.PJ.cnpj, Validators.required],
                  inscEstadual: [this.PJ.inscEstadual, Validators.required],
                  nomeFantasia: [this.PJ.nomeFantasia, Validators.required],
                  razaoSocial: [this.PJ.razaoSocial, Validators.required],
                  categoria: [this.PJ.categoria, Validators.required],
                  nome: [this.PJ.nome, Validators.required],
                  email: [this.PJ.email, Validators.required],
                  tipoPessoa: [this.PJ.tipoPessoa, Validators.required],
                  asaasId: [this.PJ.asaasId, Validators.required],
                  dataCadastro: [this.PJ.dataCadastro, Validators.required],
                  empresa: [this.PJ.empresa, Validators.required]
                });
              },
              error: (error) => {
                alert(error);
              }
            });
        }
/** Deletar PJ*/
        deletar(c: PessoaJuridica): void {
                var confir = confirm('Deseja realmente deletar?');

                if (confir) {
                  this.pjService.deletar(c);

                  // 🔥 Aguarda um pouco e atualiza a lista
                    setTimeout(() => {
                        this.listaPJ(this.paginaAtual);
                      }, 500
                    );
                }
              }

  /** Transformar em objeto */
        pjObjeto(): PessoaJuridica {
          return {
            id: this.PJForm.get('id')?.value!,
            cnpj: this.PJForm.get('cnpj')?.value!,
            inscEstadual: this.PJForm.get('inscEstadual')?.value!,
            nomeFantasia: this.PJForm.get('nomeFantasia')?.value!,
            razaoSocial: this.PJForm.get('razaoSocial')?.value!,
            categoria: this.PJForm.get('categoria')?.value!,
            nome: this.PJForm.get('nome')?.value!,
            email: this.PJForm.get('email')?.value!,
            telefone: this.PJForm.get('telefone')?.value!,
            tipoPessoa: this.PJForm.get('tipoPessoa')?.value!,
            asaasId: this.PJForm.get('asaasId')?.value!,
            dataCadastro: this.PJForm.get('dataCadastro')?.value!,
            empresa: this.PJForm.get('empresa')?.value!
          }
        }

  atualizaQtdPagina(): void {
        this.pjService.qtdPagina().subscribe({
            next: (res) => {
                //qtdPagina = res;
                 this.qtdPagina = Number(res);
                 this.arrayNumber = Array(this.qtdPagina).fill(0).map((x,i) =>i);

                 console.info(this.arrayNumber);
            },
            error: (error) => {
                this.qtdPagina = Number("0");
            }
          });
  }

  setPesquisa(val:String): void {
        this.varPesquisa = val;
      }

      pesquisar(): void {

        if(this.varPesquisa.length <= 0 || this.varPesquisa == null || this.varPesquisa.trim() == '') {
          this.listaPJ(this.paginaAtual);
          return;
        }

        this.pjService.buscarPorDescPJEmp(this.varPesquisa).subscribe({
          next: (res) => {
            this.lista = res;
          },
          error: (error) => {
            alert(error);
          }
        });
      }

      buscarPagina(p: Number): void{
        this.paginaAtual = p;
        this.listaPJ(this.paginaAtual);
      }

      voltar(): void {
        if(this.paginaAtual.valueOf() > 1) {
           this.paginaAtual = this.paginaAtual.valueOf() - 1;
        }

        this.listaPJ(this.paginaAtual);
      }

      avancar(): void {
          if(this.paginaAtual.valueOf() < this.qtdPagina.valueOf()){
            this.paginaAtual = this.paginaAtual.valueOf() + 1;
          }

          this.listaPJ(this.paginaAtual);

      }


}
