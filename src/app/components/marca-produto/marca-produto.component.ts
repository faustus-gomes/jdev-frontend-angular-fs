import { MarcaProdutoService } from '../../services/marca-produto.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MarcaProduto } from 'src/app/model/marca-produto';
import { LoginService } from 'src/app/services/login.service';
import { BigInteger } from 'jsbn';
import { __values } from 'tslib';

@Component({
  selector: 'app-marca-produto',
  templateUrl: './marca-produto.component.html',
  styleUrls: ['./marca-produto.component.css']
})
export class MarcaProdutoComponent implements OnInit {

  marProdForm: FormGroup;
  lista = new Array<MarcaProduto>();
  marProduto: MarcaProduto;
  varPesquisa: String = '';
  qtdPagina: Number = 0;
  arrayNumber: Number[] = [];
  paginaAtual: Number = 1;

  constructor (private fb: FormBuilder, private marcaProdutoService: MarcaProdutoService, private loginService: LoginService) {
    //var codEmpresa = loginService.codEmpresa();
    //document.getElementById('empresa').value = codEmpresa;
    //console.info('------->>>> Cod Empresa:'+codEmpresa);

    this.marProduto = new MarcaProduto();

    /* Pegar dados do formulário, inicia e limpa */
    this.marProdForm = this.fb.group({
      id:[],
      nomeDesc:[null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  /* Executa consulta no momento que a tela abre*/
  ngOnInit(): void {

    this.marcaProdutoService.qtdPagina().subscribe({
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

    this.listaMarca(1);
  }

  novo(): void {
    this.marProdForm = this.fb.group({
      id:[],
      nomeDesc:[null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  listaMarca(pagina: Number): void{
    this.marcaProdutoService.listarMarcaProduto(pagina).subscribe({

      next: (res) => {
         this.lista = res;
      },
      error: (error) => {
        alert(error);
      }
    });
  }



    /** Transformar em objeto */
      marProdObjeto(): MarcaProduto {
        return {
          id: this.marProdForm.get('id')?.value!,
          nomeDesc: this.marProdForm.get('nomeDesc')?.value!,
          empresa: this.marProdForm.get('empresa')?.value!
        }
      }

      /*Editar Categoria Produto*/
      editarCp(c: MarcaProduto): void {
        //console.info('Editando : '+ c.id);
        /*this.catProdForm = this.fb.group({
            id:[c.id],
            nomeDesc:[c.nomeDesc, Validators.required],
            empresa: [c.empresa, Validators.required]
          });*/

          this.marcaProdutoService.buscarPorId(c.id).subscribe({
            next: (data) => {
              this.marProduto = data;

              // Só atualiza o formulário depois que os dados chegaram
              this.marProdForm = this.fb.group({
                id: [this.marProduto.id],
                nomeDesc: [this.marProduto.nomeDesc, Validators.required],
                empresa: [this.marProduto.empresa, Validators.required]
              });
            },
            error: (error) => {
              alert(error);
            }
          });
      }

      deletar(c: MarcaProduto): void {
        var confir = confirm('Deseja realmente deletar?');

        if (confir) {
          this.marcaProdutoService.deletar(c);

          // 🔥 Aguarda um pouco e atualiza a lista
            setTimeout(() => {
                this.listaMarca(this.paginaAtual);
              }, 500
            );
        }
      }

      /*Salvar categoria produto*/
      cadProdCategoria(){
        const marca = this.marProdObjeto();
        console.info(marca);

        // Chamar o método que já tem o subscribe interno
        this.marcaProdutoService.salvarMarcaProduto(marca);

        // Pequeno delay para garantir que o salvamento foi processado
        setTimeout(() => {
            this.novo();
            this.listaMarca(this.paginaAtual);
        }, 500);
      }

      setPesquisa(val:String): void {
        this.varPesquisa = val;
      }

      pesquisar(): void {

        if(this.varPesquisa.length <= 0 || this.varPesquisa == null || this.varPesquisa.trim() == '') {
          this.listaMarca(this.paginaAtual);
          return;
        }

        this.marcaProdutoService.buscarPorDescMarcaEmp(this.varPesquisa).subscribe({
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
        this.listaMarca(this.paginaAtual);
      }

      voltar(): void {
        if(this.paginaAtual.valueOf() > 1) {
           this.paginaAtual = this.paginaAtual.valueOf() - 1;
        }

        this.listaMarca(this.paginaAtual);
      }

      avancar(): void {
          if(this.paginaAtual.valueOf() < this.qtdPagina.valueOf()){
            this.paginaAtual = this.paginaAtual.valueOf() + 1;
          }

          this.listaMarca(this.paginaAtual);

      }

      /* ********************* Rotina Relatório ********************************** */


      /* Imprimir Relatório da Categoria */
      imprimirRelatorio(c: MarcaProduto): void {
        this.marcaProdutoService.buscarPorId(c.id).subscribe({
          next: (data) => {
            this.marProduto = data;
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
                      <span class="valor">${this.marProduto.id}</span>
                    </div>
                    <div style="margin-top: 10px;">
                      <span class="label">Nome:</span>
                      <span class="valor">${this.marProduto.nomeDesc}</span>
                    </div>
                    <div style="margin-top: 10px;">
                      <span class="label">Empresa:</span>
                      <span class="valor">${this.marProduto.empresa}</span>
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
