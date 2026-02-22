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

  recuperarSenha() {
    const Usuario = this.loginObjeto();
    var login = Usuario.login;

    console.info('------> Login : '+login);


    if (login == '') {
        alert('Informe o login para recuperar a senha');
    }else{
      //this.LoginService.recuperarSenha(login);
      // Agora fazemos o subscribe AQUI no componente
          this.LoginService.recuperarSenha(login).subscribe({
            next: (res) => {
              alert('Senha recuperada com sucesso! Verifique seu e-mail.');
              console.log('Resposta:', res);
              // Opcional: limpar o campo ou redirecionar
            },
            error: (error) => {
              console.error('Erro detalhado:', error);
              alert('Erro ao recuperar senha. Tente novamente.');
            }
          });
    }
  }
}


