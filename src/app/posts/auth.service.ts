import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../models/auth.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL: string = environment.Url + 'user';


  private userIsAuthenticate = false;
  userId!:string;
  private token!:string;
  private userAuthicatedSubject = new Subject<boolean>();



  constructor(private http: HttpClient, private route: Router) {}



  addUser(email: string, password: string) {
    const user: Auth = { email, password}
    this.http.post(this.URL+'/signup', user)
    .subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error) => {
        console.log(error.error.message);
      }
    });
}

  login(email: string, password: string) {
    const user: Auth = { email, password} 
    this.http.post<{message: string, token: any, userid: string}>(this.URL+'/login', user)
    .subscribe({
      next: (response) => {
      this.token = response.token;
      if(this.token) {
        this.userIsAuthenticate = true;
        this.userAuthicatedSubject.next(true)
        this.userId = response.userid;
        localStorage.setItem('user_id', this.userId);
        console.log(response)
        localStorage.setItem('token', this.token)
        this.route.navigate(['/'])
      }
    },
      error: error => {
        console.log(error.error.message);
      }
      
  })
  }

  getToken() {
    return this.token;
  }

  userAuthenticatedListener () {
    return this.userAuthicatedSubject.asObservable();
  }

  getIsAuthenticate() {
    const token = localStorage.getItem('token');
    if(token) {
      return true
    }
    return false
  }

  getUserId() {
    return localStorage.getItem('user_id');
  }



  logout() {
    this.token = '';
    this.userId = '';
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    this.userIsAuthenticate = false;
    this.userAuthicatedSubject.next(false);
    this.route.navigate(['/login']);
  }
}
