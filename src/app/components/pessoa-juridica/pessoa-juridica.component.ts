import { Component, OnInit } from '@angular/core';
import { PessoaJuridica } from 'src/app/model/pessoa-juridica';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PessoaJuridicaService } from 'src/app/services/pessoaJuridica.service';
import { Endereco } from 'src/app/model/endereco';

@Component({
  selector: 'app-pessoa-juridica',
  templateUrl: './pessoa-juridica.component.html',
  styleUrls: ['./pessoa-juridica.component.css']
})
export class PessoaJuridicaComponent implements OnInit{
      mostrarFormPrincipal: boolean = false;  // Formulário começa visível
      mostrarEnderecos: boolean = false; // Inicialmente escondido

      lista = new Array<PessoaJuridica>();
      enderecos =  new Array<Endereco>;
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
            categoria: ["", Validators.required],
            nome: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            telefone: [null, Validators.required],
            tipoPessoa: ["", Validators.required],
            asaasId: [null, !Validators.required],
            dataCadastro: [null, !Validators.required],
            enderecos: [this.enderecos, !Validators.required],
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
    this.enderecos = new Array<Endereco>();

    this.PJForm = this.fb.group({
      id:[],
      cnpj:[null, Validators.required],
      inscEstadual:[null, Validators.required],
      nomeFantasia: [null, Validators.required],
      razaoSocial: [null, Validators.required],
      categoria: ["", Validators.required],
      nome: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      telefone: [null, Validators.required],
      tipoPessoa: ["", Validators.required],
      asaasId: [null, !Validators.required],
      dataCadastro: [null, !Validators.required],
      enderecos: [this.enderecos, !Validators.required],
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

        // Fechar o formulário se estiver fechado
            if (this.mostrarFormPrincipal) {
              this.mostrarFormPrincipal = false;
            }
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

            // 1. Abrir o formulário se estiver fechado
            if (!this.mostrarFormPrincipal) {
              this.mostrarFormPrincipal = true;
            }

            // 2. Carregar os dados da pessoa jurídica no formulário
            this.pjService.buscarPorId(c.id).subscribe({
              next: (data) => {
                this.PJ = data;

                this.enderecos = this.PJ.endereco !== undefined ? this.PJ.endereco : new Array<Endereco>();

                // Como o dataCadastro vem como timestamp, criar Date diretamente
                let dataCadastroConvertida = this.PJ.dataCadastro
                  ? new Date(this.PJ.dataCadastro as any)
                  : null;

                console.log('Data convertida:', dataCadastroConvertida);

                // Só atualiza o formulário depois que os dados chegaram
                //this.PJForm = this.fb.group
                this.PJForm.patchValue({
                  /*id: [this.PJ.id],
                  cnpj: [this.PJ.cnpj, Validators.required],
                  inscEstadual: [this.PJ.inscEstadual, Validators.required],
                  nomeFantasia: [this.PJ.nomeFantasia, Validators.required],
                  razaoSocial: [this.PJ.razaoSocial, Validators.required],
                  categoria: [this.PJ.categoria, Validators.required],
                  nome: [this.PJ.nome, Validators.required],
                  email: [this.PJ.email, [Validators.required, Validators.email]],
                  telefone: [this.PJ.telefone, Validators.required],
                  tipoPessoa: [this.PJ.tipoPessoa, Validators.required],
                  asaasId: [this.PJ.asaasId, !Validators.required],
                  //dataCadastro: [this.PJ.dataCadastro, !Validators.required],
                  dataCadastro: [dataCadastroConvertida],
                  empresa: [this.PJ.empresa, !Validators.required]*/
                  id: this.PJ.id,
                  cnpj: this.PJ.cnpj,
                  inscEstadual: this.PJ.inscEstadual,
                  nomeFantasia: this.PJ.nomeFantasia,
                  razaoSocial: this.PJ.razaoSocial,
                  categoria: this.PJ.categoria,
                  nome: this.PJ.nome,
                  email: this.PJ.email,
                  telefone: this.PJ.telefone,
                  tipoPessoa: this.PJ.tipoPessoa,
                  endereco: [this.enderecos],
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
            //dataCadastro: this.PJForm.get('dataCadastro')?.value!,
            dataCadastro: dataCadastroValue,  // 👈 DATA CONVERTIDA CORRETAMENTE
            empresa: this.PJForm.get('empresa')?.value!,
            endereco: this.enderecos
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

      // Método para toggle do formulário principal
      toggleFormPrincipal() {
        this.mostrarFormPrincipal = !this.mostrarFormPrincipal;
      }

      toggleEnderecos() {
          this.mostrarEnderecos = !this.mostrarEnderecos;
      }

      /* ********************* Rotina Relatório ********************************** */


            /* Imprimir Relatório da Categoria */
            imprimirRelatorio(c: PessoaJuridica): void {
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
                            <span class="valor">${this.PJ.nomeFantasia}</span>
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
