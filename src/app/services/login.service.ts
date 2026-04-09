import { routes } from './../app.module';
import { Usuario } from './../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
/*Para gerar o service -> ng generate service*/
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private urlApi = environment.urlApiLocal + 'login';
  constructor(private http: HttpClient, private router: Router) {

  }

  usuarioLogado(){
    var autorization = '' + localStorage.getItem('Authorization');

    return autorization !== '' && autorization !== null && autorization !== 'null';
  }

  recuperarSenha(login: String) {
      //return this.http.post<String>(environment.urlApiLocal + 'recuperarSenha', login).subscribe
      return this.http.post<String>(environment.urlApiLocal + 'recuperarSenha', login);

  }

  codEmpresa() {
    return localStorage.getItem("empresa");
  }

  logar(usuario: Usuario) {
    return this.http.post<String>(this.urlApi, usuario).subscribe({
      next: (res) => {
        var resJson = JSON.stringify(res);
        var jwt = JSON.parse(resJson);
        localStorage.setItem("Authorization",jwt.Authorization);
        localStorage.setItem("username",jwt.username);
        localStorage.setItem("empresa", jwt.empresa);
        //console.info(jwt.Authorization);
        //console.log('Resposta completa:', res);

        this.router.navigate(['home']);

      },

      error: (error) => {
        console.info(error)
        alert('Deu erro: '+ error.error.text);
      }
    });
  }

  deslogar(): void{
    localStorage.setItem("Authorization",'');
        localStorage.setItem("username",'');
        //console.info(jwt.Authorization);
        //console.log('Resposta completa:', res);

        this.router.navigate(['login']);
  }
}
