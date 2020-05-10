import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { userModel } from '../models/user.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url ='https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyDFEu-VNOklqro9yKuhlSooK7xxYuGXRXw';
  private userToken = '';

  //Create new users
  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Exisiting users
  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]


  constructor(private http: HttpClient) {
    this.readToken();
   }

  logOut() {
   localStorage.removeItem('token');
  }

  logIn(user: userModel) {
    const authData = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(`${this.url}signInWithPassword?key=${this.apiKey}`, authData)
            .pipe(
              map(resp => {
                this.saveToken(resp['idToken']);
                return resp;
              })
             );
  }

  newUser(user: userModel) {
    const authData = {
      ...user,
      returnSecureToken: true
    };
    return this.http.post(`${this.url}signUp?key=${this.apiKey}`,authData)
              .pipe(
                map( resp => {
                  this.saveToken( resp['idToken']);
                  return resp;
                })
              );
  }

  saveToken(idToken: string) {
   this.userToken = idToken;
   localStorage.setItem('token',idToken);
   let today = new Date();
   today.setSeconds(3600);
   localStorage.setItem('expires',today.getTime().toString());

  }
  
  readToken() {
    if(localStorage.getItem('token')) {
     this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }


  isAuthenticated(): boolean {
    
    if(this.userToken.length < 2) {
      return false;
    }
    const expires = Number(localStorage.getItem('expires'));
    const expiresDate = new Date();
    expiresDate.setTime(expires)

    if(expiresDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }

}
