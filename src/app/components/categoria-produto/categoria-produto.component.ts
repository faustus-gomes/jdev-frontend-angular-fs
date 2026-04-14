import { CategoriaProdutoService } from './../../services/categoria-produto.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriaProduto } from 'src/app/model/categoria-produto';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-categoria-produto',
  templateUrl: './categoria-produto.component.html',
  styleUrls: ['./categoria-produto.component.css']
})
export class CategoriaProdutoComponent {

  constructor (private fb: FormBuilder, private categoriaProdutoService: CategoriaProdutoService, private loginService: LoginService) {
    //var codEmpresa = loginService.codEmpresa();
    //document.getElementById('empresa').value = codEmpresa;
    //console.info('------->>>> Cod Empresa:'+codEmpresa);
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
      }

}
