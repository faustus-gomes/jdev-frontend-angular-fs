import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service';

export const guardiaoGuard: CanActivateFn = (route, state) => {

  var username =  localStorage.getItem('username');
  var roles = route.data;

  console.info('Username: '+ username);
  console.info(roles);

  return inject(LoginService).usuarioLogado();
};
