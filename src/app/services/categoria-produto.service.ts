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

  deletar(cat: CategoriaProduto): void {
      this.http.post(this.urlApi + 'deleteCategoria', cat, {
          responseType: 'text'  // ← Força tratar como texto
        }).subscribe ({
            next: (res) => {
                // Agora 'res' é string diretamente
                if(res && res.includes('error')) {
                  alert(res);
                } else {
                  alert(res || 'Categoria deletada com sucesso!');
                }
            },
            error: (error) => {
              alert('erro: ' + error);
            }
      });
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
        alert('Deu erro: ' + error);
      }

    });
  }

  listarCategoriaProduto() {
        return this.http.get<CategoriaProduto[]>(this.urlApi + 'listarCategoriaProduto/' + this.loginService.codEmpresa());
  }

  buscarPorId(id: any) {
    return this.http.get<CategoriaProduto>(this.urlApi + 'buscarPorId/' + id);
  }

  buscarPorDescCategoriaEmp(val:String){
    return this.http.get<CategoriaProduto[]>(this.urlApi + 'buscarPorDescCategoriaEmp/' + val + '/' + this.loginService.codEmpresa());
  }

  qtdPagina() {
    return this.http.get<Number>(this.urlApi + 'qtdePaginaCategoriaProduto/' + this.loginService.codEmpresa());
  }
}
