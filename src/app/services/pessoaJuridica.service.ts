import { PessoaJuridica } from './../model/pessoa-juridica';
import { LoginComponent } from '../login/login/login.component';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class PessoaJuridicaService {

  private urlApi = environment.urlApiLocal;

  constructor(private http: HttpClient, private router: Router, private loginService: LoginService) {

  }

  deletar(m: PessoaJuridica): void {
      this.http.post(this.urlApi + 'deletePJ', m, {
          responseType: 'text'  // ← Força tratar como texto
        }).subscribe ({
            next: (res) => {
                // Agora 'res' é string diretamente
                if(res && res.includes('error')) {
                  alert(res);
                } else {
                  alert(res || 'Acesso deletada com sucesso!');
                }
            },
            error: (error) => {
              alert('erro: ' + error);
            }
      });
  }

  salvarPJ(pessoaPJ:PessoaJuridica){

    return this.http.post<String>(this.urlApi + 'salvarPj', pessoaPJ).subscribe({
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

  listarPJ(pagina: Number) {
        return this.http.get<PessoaJuridica[]>(this.urlApi + 'listaPorPagePJ/' + this.loginService.codEmpresa() + '/' + pagina);
  }

  buscarPorId(id: any) {
    return this.http.get<PessoaJuridica>(this.urlApi + 'buscarPJPorId/' + id);
  }

  buscarPorDescPJEmp(val:String){
    return this.http.get<PessoaJuridica[]>(this.urlApi + 'buscarPorDescPJ/' + val + '/' + this.loginService.codEmpresa());
  }

  qtdPagina() {
    return this.http.get<Number>(this.urlApi + 'qtdPaginaPJ/' + this.loginService.codEmpresa());
  }


}
