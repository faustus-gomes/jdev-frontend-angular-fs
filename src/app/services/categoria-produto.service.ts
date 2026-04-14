import { CategoriaProduto } from './../model/categoria-produto';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProdutoService {

  private urlApi = environment.urlApiLocal;

  constructor(private http: HttpClient, private router: Router) {

  }

  salvarCategoriaProduto(categoriaProduto:CategoriaProduto){

    return this.http.post<String>(this.urlApi + 'salvarCategoria', categoriaProduto).subscribe({
      next: (res) => {

        alert('Salvo com Sucesso!');

      },
      error: (error)=> {
        console.info(error.error.error);
        alert('Deu erro: ' + error.error.error);
      }

    });
  }
}
