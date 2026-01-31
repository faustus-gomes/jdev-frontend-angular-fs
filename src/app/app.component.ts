import { LoginService } from './services/login.service';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Usuario } from './model/usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  titulologin = 'Login do Sistema FS';


  constructor (private fb: FormBuilder, private LoginService: LoginService) {

  }
  /* Pegar dados do formulário*/
  loginForm = this.fb.group({
    id:[],
    login:[null, Validators.required],
    senha:[null, Validators.required]
  });

  /** Transformar em objeto */
  loginObjeto(): Usuario {
    return {
      login: this.loginForm.get('login')?.value!,
      senha: this.loginForm.get('senha')?.value!
    }
  }

  fazerLogin() {
    const usuario = this.loginObjeto();

    this.LoginService.logar(usuario);

    console.info('dado de login -> '+ usuario.login);
     console.info('dado de senha -> '+ usuario.senha);
  }
}


