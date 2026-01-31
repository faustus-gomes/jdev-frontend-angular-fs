import { Usuario } from './../model/usuario';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
/*Para gerar o service -> ng generate service*/
@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private urlApi = environment.urlApiLocal + 'login';
  constructor(private http: HttpClient) {

  }

  logar(usuario: Usuario) {
    return this.http.post<String>(this.urlApi, usuario).subscribe({
      next: (res) => {
        console.info(res)
        alert('Login realizado');
      },

      error: (error) => {
        console.info(error)
        alert('Login não realizado');
      }
    });
  }
}
