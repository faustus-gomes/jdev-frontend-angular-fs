import { LoginService } from './services/login.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Usuario } from './model/usuario';
import { LoginComponent } from './login/login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor (private fb: FormBuilder, private loginService: LoginService, private router: Router) {

  }

  ngOnInit(): void {
    if(this.loginService.usuarioLogado()){
        this.router.navigate(['home']);
    }else{
      this.router.navigate(['login']);
    }
  }
}


