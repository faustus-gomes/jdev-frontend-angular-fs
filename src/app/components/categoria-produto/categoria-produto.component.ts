import { CategoriaProdutoService } from './../../services/categoria-produto.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriaProduto } from 'src/app/model/categoria-produto';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-categoria-produto',
  templateUrl: './categoria-produto.component.html',
  styleUrls: ['./categoria-produto.component.css']
})
export class CategoriaProdutoComponent implements OnInit {

  catProdForm: FormGroup;
  lista = new Array<CategoriaProduto>();
  catProduto: CategoriaProduto;

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

}
