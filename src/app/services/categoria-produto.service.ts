import { LoginComponent } from './../login/login/login.component';
import { CategoriaProduto } from './../model/categoria-produto';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProdutoService {

  private urlApi = environment.urlApiLocal;

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) {

  }

  salvarCategoriaProduto(categoriaProduto:CategoriaProduto){

    return this.http.post<String>(this.urlApi + 'salvarCategoria', categoriaProduto).subscribe({
      next: (res) => {

        var varResposta = JSON.stringify(res);
        var jsonResposta = JSON.parse(varResposta);

        //console.info(jsonResposta.console.error);

        if (jsonResposta.error != undefined) {
            alert(jsonResposta.error);
        } else {
           alert('Salvo com Sucesso: ID: '+jsonResposta.id);
        }


      },
      error: (error)=> {
        console.info(error.error.error);
        alert('Deu erro: ' + error.error.error);
      }

    });
  }

  listarCategoriaProduto() {
        return this.http.get<CategoriaProduto[]>(this.urlApi + 'listarCategoriaProduto/' + this.loginService.codEmpresa());
     }
}
