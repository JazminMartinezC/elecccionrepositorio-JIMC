/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';
  constructor(private http: HttpClient) {}
  getUsers(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
  }
}

-----------------
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';
  private newsApiUrl = 'https://newsapi.org/v2/top-headlines?q=trump';
  private apiKey = 'b88050a0cf334cb5b4b827d63dff6f8d';
  private loggedInUser: any = null;
  constructor(private http: HttpClient) {}

  // Obtener usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
  authenticateUser(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users: any[]) =>
        users.find(user => user.email === email && user.password === password)
      )
    );
  }
  setLoggedInUser(user: any): void {
    this.loggedInUser = user;
  }
  getLoggedInUser(): any {
    return this.loggedInUser;
  }
  // Obtener noticias
  getNews(): Observable<any> {
    const headers = new HttpHeaders().set('X-Api-Key', this.apiKey);
    return this.http.get<any>(this.newsApiUrl, { headers });
  }
}
*/
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://api.escuelajs.co/api/v1/users';
  private newsApiUrl = 'https://newsapi.org/v2/top-headlines?q=trump';
  //private apiKey = 'b88050a0cf334cb5b4b827d63dff6f8d';
  private apiKey = 'eb98591c9c824958aa14d5b885b78ed9';
  private loggedInUser: any = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyección del ID de plataforma
  ) {}

  // Verifica si está en el navegador
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Obtener usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  authenticateUser(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((users: any[]) =>
        users.find(user => user.email === email && user.password === password)
      )
    );
  }

  setLoggedInUser(user: any): void {
    if (this.isBrowser()) {
      localStorage.setItem('loggedInUser', JSON.stringify(user)); // Guardar en localStorage
    }
  }

  getLoggedInUser(): any {
    if (this.isBrowser()) {
      const user = localStorage.getItem('loggedInUser');
      return user ? JSON.parse(user) : null; // Recuperar desde localStorage
    }
    return null; // Si no está en el navegador, retorna null
  }

  clearLoggedInUser(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('loggedInUser'); // Eliminar del almacenamiento
    }
  }

  // Obtener noticias
  getNews(): Observable<any> {
    const headers = new HttpHeaders().set('X-Api-Key', this.apiKey);
    return this.http.get<any>(this.newsApiUrl, { headers });
  }
}
