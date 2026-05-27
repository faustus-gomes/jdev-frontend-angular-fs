import { Component, OnInit } from '@angular/core';
import { PessoaFisica } from 'src/app/model/pessoa-fisica';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PessoaFisicaService } from 'src/app/services/pessoaFisica.service';

@Component({
  selector: 'app-pessoa-fisica',
  templateUrl: './pessoa-fisica.component.html',
  styleUrls: ['./pessoa-fisica.component.css']
})
export class PessoaFisicaComponent implements OnInit{
      lista = new Array<PessoaFisica>();
      PJForm: FormGroup;
      PJ: PessoaFisica;
      varPesquisa: String = '';
      qtdPagina: Number = 0;
      arrayNumber: Number[] = [];
      paginaAtual: Number = 1;

      constructor (private fb: FormBuilder, private pjService: PessoaFisicaService, private loginService: LoginService) {

          this.PJ = new PessoaFisica();

          /* Pegar dados do formulário, inicia e limpa */
          this.PJForm = this.fb.group({
            id:[],
            cpf:[null, Validators.required],
            dataNascimento: [null, Validators.required],
            nome: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            telefone: [null, Validators.required],
            tipoPessoa: ["", Validators.required],
            asaasId: [null, !Validators.required],
            dataCadastro: [null, !Validators.required],
            empresa: [this.loginService.objetoEmpresa(), !Validators.required]
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
      cpf:[null, Validators.required],
      dataNascimento: [null, Validators.required],
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, Validators.required],
      tipoPessoa: ["", Validators.required],
      asaasId: [null, !Validators.required],
      dataCadastro: [null, !Validators.required],
      empresa: [this.loginService.objetoEmpresa(), !Validators.required]
      //empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  /*Salvar PJ*/
      salvaPJ(){
        const pj = this.pjObjeto();
        console.info(pj);

        // Chamar o método que já tem o subscribe interno
        this.pjService.salvarPJ(pj);

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
        editarPJ(c: PessoaFisica): void {
          //console.info('Editando : '+ c.id);
          /*this.catProdForm = this.fb.group({
              id:[c.id],
              nomeDesc:[c.nomeDesc, Validators.required],
              empresa: [c.empresa, Validators.required]
            });*/

            this.pjService.buscarPorId(c.id).subscribe({
              next: (data) => {
                this.PJ = data;

                // Como o dataCadastro vem como timestamp, criar Date diretamente
                let dataCadastroConvertida = this.PJ.dataCadastro
                  ? new Date(this.PJ.dataCadastro as any)
                  : null;

                console.log('Data convertida:', dataCadastroConvertida);

                // Só atualiza o formulário depois que os dados chegaram
                //this.PJForm = this.fb.group
                this.PJForm.patchValue({
                  id: this.PJ.id,
                  cpf: this.PJ.cpf,
                  dataNascimento: this.PJ.dataNascimento,
                  nome: this.PJ.nome,
                  email: this.PJ.email,
                  telefone: this.PJ.telefone,
                  tipoPessoa: this.PJ.tipoPessoa,
                  asaasId: this.PJ.asaasId,
                  dataCadastro: dataCadastroConvertida,
                  empresa: this.PJ.empresa
                });

              },
              error: (error) => {
                alert(error);
              }
            });
        }
/** Deletar PJ*/
        deletar(c: PessoaFisica): void {
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
        pjObjeto(): PessoaFisica {

          // Pega o valor da data do formulário
           let dataCadastroValue = this.PJForm.get('dataCadastro')?.value;

          // Se for Date, converter para YYYY-MM-DD (sem hora)
          /*if (dataCadastroValue instanceof Date) {
            const ano = dataCadastroValue.getFullYear();
            const mes = (dataCadastroValue.getMonth() + 1).toString().padStart(2, '0');
            const dia = dataCadastroValue.getDate().toString().padStart(2, '0');
            dataCadastroValue = `${ano}-${mes}-${dia}`;
          }*/

          // Se for Date, converter para timestamp (milissegundos)
          if (dataCadastroValue instanceof Date) {
            dataCadastroValue = dataCadastroValue.getTime(); // Ex: 1779408000000
          }

          return {
            id: this.PJForm.get('id')?.value!,
            cpf: this.PJForm.get('cpf')?.value!,
            dataNascimento: this.PJForm.get('dataNascimento')?.value!,
            nome: this.PJForm.get('nome')?.value!,
            email: this.PJForm.get('email')?.value!,
            telefone: this.PJForm.get('telefone')?.value!,
            tipoPessoa: this.PJForm.get('tipoPessoa')?.value!,
            asaasId: this.PJForm.get('asaasId')?.value!,
            //dataCadastro: this.PJForm.get('dataCadastro')?.value!,
            dataCadastro: dataCadastroValue,  // 👈 DATA CONVERTIDA CORRETAMENTE
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

      /* ********************* Rotina Relatório ********************************** */


            /* Imprimir Relatório da Categoria */
            imprimirRelatorio(c: PessoaFisica): void {
              this.pjService.buscarPorId(c.id).subscribe({
                next: (data) => {
                  this.PJ = data;
                  this.abrirJanelaImpressao();
                },
                error: (error) => {
                  alert('Erro ao carregar dados para impressão: ' + error);
                }
              });
            }



            abrirJanelaImpressao(): void {
              const janelaImpressao = window.open('', '_blank');

              if (janelaImpressao) {
                janelaImpressao.document.write(`
                  <html>
                    <head>
                      <title>Relatório da Categoria</title>
                      <style>
                        body {
                          font-family: Arial, sans-serif;
                          margin: 40px;
                          padding: 20px;
                        }
                        .container {
                          max-width: 800px;
                          margin: 0 auto;
                          border: 1px solid #ddd;
                          padding: 20px;
                          border-radius: 10px;
                        }
                        h1 {
                          color: #333;
                          text-align: center;
                          border-bottom: 2px solid #007bff;
                          padding-bottom: 10px;
                        }
                        .info {
                          margin: 20px 0;
                        }
                        .label {
                          font-weight: bold;
                          color: #555;
                          display: inline-block;
                          width: 120px;
                        }
                        .valor {
                          color: #333;
                          display: inline-block;
                        }
                        .footer {
                          margin-top: 30px;
                          text-align: center;
                          font-size: 12px;
                          color: #999;
                          border-top: 1px solid #ddd;
                          padding-top: 10px;
                        }
                        @media print {
                          body {
                            margin: 0;
                            padding: 0;
                          }
                          button {
                            display: none;
                          }
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>Relatório da Categoria</h1>

                        <div class="info">
                          <div>
                            <span class="label">ID:</span>
                            <span class="valor">${this.PJ.id}</span>
                          </div>
                          <div style="margin-top: 10px;">
                            <span class="label">Nome:</span>
                            <span class="valor">${this.PJ.nome}</span>
                          </div>
                          <div style="margin-top: 10px;">
                            <span class="label">Empresa:</span>
                            <span class="valor">${this.PJ.telefone}</span>
                          </div>
                        </div>

                        <div class="footer">
                          Relatório gerado em: ${new Date().toLocaleString()}
                        </div>
                      </div>

                      <div style="text-align: center; margin-top: 20px;">
                        <button onclick="window.print();" style="padding: 10px 20px; margin: 5px;">🖨️ Imprimir</button>
                        <button onclick="window.close();" style="padding: 10px 20px; margin: 5px;">❌ Fechar</button>
                      </div>
                    </body>
                  </html>
                `);

                janelaImpressao.document.close();
              } else {
                alert('Não foi possível abrir a janela de impressão. Verifique se o popup está bloqueado.');
              }
            }


}
