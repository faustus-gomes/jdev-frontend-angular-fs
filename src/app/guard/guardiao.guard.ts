import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';
import { environment } from 'src/environments/environment';

export const guardiaoGuard: CanActivateFn = (route, state) => {

  var username =  localStorage.getItem('username');
  var roles = route.data;

  //console.info('Username: '+ username);
  //console.info(JSON.parse(JSON.stringify(roles)).role.toString());
  var role = JSON.parse(JSON.stringify(roles)).role.toString();
  var autorization = '' + localStorage.getItem('Authorization');

  // Montar requisição sincrona
  var request = new XMLHttpRequest();
  request.open("GET", environment.urlApiLocal + 'possuiAcesso/' + username + '/'+ role, false);
  request.setRequestHeader('Authorization', autorization);
  request.send();

  var possuiAcessoRetorno = request.responseText === 'true' || new Boolean(request.responseText) === true
  var usuarioLogado = inject(LoginService).usuarioLogado();
  //console.info('possuiAcessoRetorno : ' + new Boolean(possuiAcessoRetorno));

  return (usuarioLogado && possuiAcessoRetorno);
};
