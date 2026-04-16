import { CategoriaProdutoService } from './../../services/categoria-produto.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriaProduto } from 'src/app/model/categoria-produto';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-categoria-produto',
  templateUrl: './categoria-produto.component.html',
  styleUrls: ['./categoria-produto.component.css']
})
export class CategoriaProdutoComponent implements OnInit {

  lista = new Array<CategoriaProduto>();

  constructor (private fb: FormBuilder, private categoriaProdutoService: CategoriaProdutoService, private loginService: LoginService) {
    //var codEmpresa = loginService.codEmpresa();
    //document.getElementById('empresa').value = codEmpresa;
    //console.info('------->>>> Cod Empresa:'+codEmpresa);
  }

  /* Executa consulta no momento que a tela abre*/
  ngOnInit(): void {
    this.listaCategoria();
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

  /* Pegar dados do formulário*/
    catProdForm = this.fb.group({
      id:[],
      nomeDesc:[null, Validators.required],
      empresa: [this.loginService.objetoEmpresa(), Validators.required]
    });

    /** Transformar em objeto */
      catProdObjeto(): CategoriaProduto {
        return {
          id: this.catProdForm.get('id')?.value!,
          nomeDesc: this.catProdForm.get('nomeDesc')?.value!,
          empresa: this.catProdForm.get('empresa')?.value!
        }
      }

      /*Salvar categoria produto*/
      cadProdCategoria(){
        const categoria = this.catProdObjeto();
        console.info(categoria);

        this.categoriaProdutoService.salvarCategoriaProduto(categoria);

        this.listaCategoria();
      }

}
