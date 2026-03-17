import { CategoriaProdutoService } from './../../services/categoria-produto.service';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-categoria-produto',
  templateUrl: './categoria-produto.component.html',
  styleUrls: ['./categoria-produto.component.css']
})
export class CategoriaProdutoComponent {

  constructor (private fb: FormBuilder, private categoriaProdutoService: CategoriaProdutoService) {

  }

}
