import { MarcaProduto } from './../model/marca-produto';
import { LoginComponent } from '../login/login/login.component';
import { CategoriaProduto } from '../model/categoria-produto';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class MarcaProdutoService {

  private urlApi = environment.urlApiLocal;

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) {

  }

  deletar(m: MarcaProduto): void {
      this.http.post(this.urlApi + 'deleteMarca', m, {
          responseType: 'text'  // ← Força tratar como texto
        }).subscribe ({
            next: (res) => {
                // Agora 'res' é string diretamente
                if(res && res.includes('error')) {
                  alert(res);
                } else {
                  alert(res || 'Marca deletada com sucesso!');
                }
            },
            error: (error) => {
              alert('erro: ' + error);
            }
      });
  }

  salvarMarcaProduto(marcaProduto:MarcaProduto){

    return this.http.post<String>(this.urlApi + 'salvarMarcaProduto', marcaProduto).subscribe({
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

  listarMarcaProduto(pagina: Number) {
        return this.http.get<MarcaProduto[]>(this.urlApi + 'listaPorPageMarca/' + this.loginService.codEmpresa() + '/' + pagina);
  }

  buscarPorId(id: any) {
    return this.http.get<MarcaProduto>(this.urlApi + 'obterMarcaProduto/' + id);
  }

  buscarPorDescCategoriaEmp(val:String){
    return this.http.get<MarcaProduto[]>(this.urlApi + 'buscarPorDescMarcaEmp/' + val + '/' + this.loginService.codEmpresa());
  }

  qtdPagina() {
    return this.http.get<Number>(this.urlApi + 'buscarPorDescMarcaEmp/' + this.loginService.codEmpresa());
  }
}
