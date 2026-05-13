// permission.service.ts
import { Injectable } from '@angular/core';
import { guardiaoGuard } from '../guard/guardiao.guard';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() { }

  // Pega as roles do usuário logado (ajuste conforme seu sistema)
  getUserRoles(): string[] {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user).roles || [];
    }
    return [];
  }

  // Verifica se o usuário tem alguma das roles necessárias
  hasPermission(requiredRoles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return requiredRoles.some(role => userRoles.includes(role));
  }
}
