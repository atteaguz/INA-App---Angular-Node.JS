import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario, UsuarioResponse } from '../models/usuario.model';
import { enviroment } from '../../enviroments';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${enviroment.apiUrl}${enviroment.endpoints.usuarios}`;

  getUsuarios(): Observable<UsuarioResponse[]> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.get<UsuarioResponse[]>(this.apiUrl, { headers });
  }

  getUsuarioById(id: number): Observable<UsuarioResponse> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/${id}`, { headers });
  }

  crearUsuario(usuario: Usuario): Observable<{ message: string }> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.post<{ message: string }>(this.apiUrl, usuario, { headers });
  }

  modificarUsuario(usuario: Usuario): Observable<{ message: string; user: UsuarioResponse }> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.patch<{ message: string; user: UsuarioResponse }>(
      `${this.apiUrl}/${usuario.id}`,
      usuario,
      { headers }
    );
  }

  eliminarUsuario(id: number): Observable<{ message: string }> {
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({ token: token });
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, { headers });
  }
}