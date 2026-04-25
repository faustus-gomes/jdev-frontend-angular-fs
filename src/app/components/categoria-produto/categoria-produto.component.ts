import { CategoriaProdutoService } from './../../services/categoria-produto.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaProduto } from 'src/app/model/categoria-produto';
import { LoginService } from 'src/app/services/login.service';
import { BigInteger } from 'jsbn';

@Component({
  selector: 'app-categoria-produto',
  templateUrl: './categoria-produto.component.html',
  styleUrls: ['./categoria-produto.component.css']
})
export class CategoriaProdutoComponent implements OnInit {

  catProdForm: FormGroup;
  lista = new Array<CategoriaProduto>();
  catProduto: CategoriaProduto;
  varPesquisa: String = '';
  qtdPagina: Number = 0;

  constructor (private fb: FormBuilder, private categoriaProdutoService: CategoriaProdutoService, private loginService: LoginService) {
    //var codEmpresa = loginService.codEmpresa();
    //document.getElementById('empresa').value = codEmpresa;
    //console.info('------->>>> Cod Empresa:'+codEmpresa);

    this.catProduto = new CategoriaProduto();

    /* Pegar dados do formulário, inicia e limpa */
    this.catProdForm = this.fb.group({
      id:[],
      nomeDesc:[null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  /* Executa consulta no momento que a tela abre*/
  ngOnInit(): void {

    this.categoriaProdutoService.qtdPagina().subscribe({
      next: (res) => {
          //qtdPagina = res;
           this.qtdPagina = new Number(res);
           console.log('Valor recebido:', res);
           console.log('BigInteger:', this.qtdPagina.toString());
      },
      error: (error) => {
          this.qtdPagina = new Number("0");
      }
    });

    this.listaCategoria();
  }

  novo(): void {
    this.catProdForm = this.fb.group({
      id:[],
      nomeDesc:[null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });
  }

  listaCategoria(): void{
    this.categoriaProdutoService.listarCategoriaProduto().subscribe({

      next: (res) => {
         this.lista = res;
      },
      error: (error) => {
        alert(error);
      }
    });
  }



    /** Transformar em objeto */
      catProdObjeto(): CategoriaProduto {
        return {
          id: this.catProdForm.get('id')?.value!,
          nomeDesc: this.catProdForm.get('nomeDesc')?.value!,
          empresa: this.catProdForm.get('empresa')?.value!
        }
      }

      /*Editar Categoria Produto*/
      editarCp(c: CategoriaProduto): void {
        //console.info('Editando : '+ c.id);
        /*this.catProdForm = this.fb.group({
            id:[c.id],
            nomeDesc:[c.nomeDesc, Validators.required],
            empresa: [c.empresa, Validators.required]
          });*/

          this.categoriaProdutoService.buscarPorId(c.id).subscribe({
            next: (data) => {
              this.catProduto = data;

              // Só atualiza o formulário depois que os dados chegaram
              this.catProdForm = this.fb.group({
                id: [this.catProduto.id],
                nomeDesc: [this.catProduto.nomeDesc, Validators.required],
                empresa: [this.catProduto.empresa, Validators.required]
              });
            },
            error: (error) => {
              alert(error);
            }
          });
      }

      deletar(c: CategoriaProduto): void {
        var confir = confirm('Deseja realmente deletar?');

        if (confir) {
          this.categoriaProdutoService.deletar(c);

          // 🔥 Aguarda um pouco e atualiza a lista
            setTimeout(() => {
                this.listaCategoria();
              }, 500
            );
        }
      }

      /*Salvar categoria produto*/
      cadProdCategoria(){
        const categoria = this.catProdObjeto();
        console.info(categoria);

        // Chamar o método que já tem o subscribe interno
        this.categoriaProdutoService.salvarCategoriaProduto(categoria);

        // Pequeno delay para garantir que o salvamento foi processado
        setTimeout(() => {
            this.novo();
            this.listaCategoria();
        }, 500);
      }

      setPesquisa(val:String): void {
        this.varPesquisa = val;
      }

      pesquisar(): void {

        if(this.varPesquisa.length <= 0 || this.varPesquisa == null || this.varPesquisa.trim() == '') {
          this.listaCategoria();
          return;
        }

        this.categoriaProdutoService.buscarPorDescCategoriaEmp(this.varPesquisa).subscribe({
          next: (res) => {
            this.lista = res;
          },
          error: (error) => {
            alert(error);
          }
        });
      }



      /* Imprimir Relatório da Categoria */
      imprimirRelatorio(c: CategoriaProduto): void {
        this.categoriaProdutoService.buscarPorId(c.id).subscribe({
          next: (data) => {
            this.catProduto = data;
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
                      <span class="valor">${this.catProduto.id}</span>
                    </div>
                    <div style="margin-top: 10px;">
                      <span class="label">Nome:</span>
                      <span class="valor">${this.catProduto.nomeDesc}</span>
                    </div>
                    <div style="margin-top: 10px;">
                      <span class="label">Empresa:</span>
                      <span class="valor">${this.catProduto.empresa}</span>
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
