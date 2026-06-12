import { Acesso } from './../../model/acesso';
import { AcessoService } from 'src/app/services/acesso.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { BigInteger } from 'jsbn';
import { __values } from 'tslib';

@Component({
  selector: 'app-acesso',
  templateUrl: './acesso.component.html',
  styleUrls: ['./acesso.component.css']
})
export class AcessoComponent implements OnInit {

  mostrarFormPrincipal: boolean = false;  // Formulário começa visível

  acessoForm: FormGroup;
  lista = new Array<Acesso>();
  acesso: Acesso;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 1;

  constructor (private fb: FormBuilder, private acessoService: AcessoService, private loginService: LoginService) {
    //var codEmpresa = loginService.codEmpresa();
    //document.getElementById('empresa').value = codEmpresa;
    //console.info('------->>>> Cod Empresa:'+codEmpresa);

    this.acesso = new Acesso();

    /* Pegar dados do formulário, inicia e limpa */
    this.acessoForm = this.fb.group({
      id:[],
      descricao:[null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  /* Executa consulta no momento que a tela abre*/
  ngOnInit(): void {

    this.acessoService.qtdPagina().subscribe({
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

    this.listaAcesso(1);
  }

  novo(): void {
    this.acessoForm = this.fb.group({
      id:[],
      descricao:[null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  listaAcesso(pagina: Number): void{
    this.acessoService.listarAcesso(pagina).subscribe({

      next: (res) => {
        this.atualizaQtdPagina();
        this.lista = res;

      },
      error: (error) => {
        alert(error);
      }
    });
  }



    /** Transformar em objeto */
      acessoObjeto(): Acesso {
        return {
          id: this.acessoForm.get('id')?.value!,
          descricao: this.acessoForm.get('descricao')?.value!,
          empresa: this.acessoForm.get('empresa')?.value!
        }
      }

      /*Editar Categoria Produto*/
      editarCp(c: Acesso): void {
          // 1. Abrir o formulário se estiver fechado
          if (!this.mostrarFormPrincipal) {
              this.mostrarFormPrincipal = true;
          }

          this.acessoService.buscarPorId(c.id).subscribe({
            next: (data) => {
              this.acesso = data;

              // Só atualiza o formulário depois que os dados chegaram
              this.acessoForm = this.fb.group({
                id: [this.acesso.id],
                descricao: [this.acesso.descricao, Validators.required],
                empresa: [this.acesso.empresa, Validators.required]
              });
            },
            error: (error) => {
              alert(error);
            }
          });
      }

      deletar(c: Acesso): void {
        var confir = confirm('Deseja realmente deletar?');

        if (confir) {
          this.acessoService.deletar(c);

          // 🔥 Aguarda um pouco e atualiza a lista
            setTimeout(() => {
                this.listaAcesso(this.paginaAtual);
              }, 500
            );
        }
      }

      /*Salvar categoria produto*/
      cadAcesso(){
        const acesso = this.acessoObjeto();
        console.info(acesso);

        // Chamar o método que já tem o subscribe interno
        this.acessoService.salvarAcesso(acesso);

        // Pequeno delay para garantir que o salvamento foi processado
        setTimeout(() => {
            this.novo();
            this.  listaAcesso(this.paginaAtual);
        }, 500);

        // Fechar o formulário se estiver fechado
        if (this.mostrarFormPrincipal) {
          this.mostrarFormPrincipal = false;
        }
      }

      setPesquisa(val:String): void {
        this.varPesquisa = val;
      }

      pesquisar(): void {

        if(this.varPesquisa.length <= 0 || this.varPesquisa == null || this.varPesquisa.trim() == '') {
          this.listaAcesso(this.paginaAtual);
          return;
        }

        this.acessoService.buscarPorDescAcessoEmp(this.varPesquisa).subscribe({
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
        this.listaAcesso(this.paginaAtual);
      }

      voltar(): void {
        if(this.paginaAtual.valueOf() > 1) {
           this.paginaAtual = this.paginaAtual.valueOf() - 1;
        }

        this.listaAcesso(this.paginaAtual);
      }

      avancar(): void {
          if(this.paginaAtual.valueOf() < this.qtdPagina.valueOf()){
            this.paginaAtual = this.paginaAtual.valueOf() + 1;
          }

          this.listaAcesso(this.paginaAtual);

      }

      atualizaQtdPagina(): void {
        this.acessoService.qtdPagina().subscribe({
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

      // Método para toggle do formulário principal
      toggleFormPrincipal() {
        this.mostrarFormPrincipal = !this.mostrarFormPrincipal;
      }

      /* ********************* Rotina Relatório ********************************** */


      /* Imprimir Relatório da Categoria */
      imprimirRelatorio(c: Acesso): void {
        this.acessoService.buscarPorId(c.id).subscribe({
          next: (data) => {
            this.acesso = data;
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
                      <span class="valor">${this.acesso.id}</span>
                    </div>
                    <div style="margin-top: 10px;">
                      <span class="label">Nome:</span>
                      <span class="valor">${this.acesso.descricao}</span>
                    </div>
                    <div style="margin-top: 10px;">
                      <span class="label">Empresa:</span>
                      <span class="valor">${this.acesso.empresa}</span>
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
