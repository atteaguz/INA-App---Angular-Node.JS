import {computed, inject, Injectable, signal } from '@angular/core';
import { LoginModel, LoginResponse } from '../models/loginModel';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Login } from '../pages/auth/login/login';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //signals
  private tokenSignal = signal<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  );

  isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {}
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/api/auth';

  login(datos: LoginModel): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, datos);
  }

  saveSession(resp: LoginResponse): void{
    console.log('Login correcto:', resp);
        localStorage.setItem('token', resp.token);
        localStorage.setItem('usuario', resp.user.toString());
        localStorage.setItem('rol', resp.role);

        //Actualizar el token en la señal
        this.tokenSignal.set(resp.token);
  }

  logout(): void{
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    this.tokenSignal.set(null);
    this.router.navigate(['/iniciarsesion'], { replaceUrl: true });
  }

  //Obtener token
  getToken(): string | null {
    return this.tokenSignal();
  }
  //Obtener usuario
  getUsuario(): string | null {
    return localStorage.getItem('usuario');
  }
  //Obtener rol
  getRol(): string | null {
    return localStorage.getItem('rol');
  }
}
