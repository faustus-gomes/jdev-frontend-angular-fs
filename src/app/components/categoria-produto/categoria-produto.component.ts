import { CategoriaProdutoService } from './../../services/categoria-produto.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriaProduto } from 'src/app/model/categoria-produto';

@Component({
  selector: 'app-categoria-produto',
  templateUrl: './categoria-produto.component.html',
  styleUrls: ['./categoria-produto.component.css']
})
export class CategoriaProdutoComponent {

  constructor (private fb: FormBuilder, private categoriaProdutoService: CategoriaProdutoService) {

  }

  /* Pegar dados do formulário*/
    catProdForm = this.fb.group({
      id:[],
      nomeDesc:[null, Validators.required]
    });

    /** Transformar em objeto */
      catProdObjeto(): CategoriaProduto {
        console.info('Chamou catProdObjeto');
        return {
          id: this.catProdForm.get('id')?.value!,
          nomeDesc: this.catProdForm.get('nomeDesc')?.value!,
          empresa: this.catProdForm.get('empresa')?.value!
        }
      }

      cadProdCategoria(){
        const categoria = this.catProdObjeto();
        console.info(categoria);
      }

}
