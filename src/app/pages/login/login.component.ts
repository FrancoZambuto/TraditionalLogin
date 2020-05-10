import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { userModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: userModel = new userModel();
  rememberMe = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {

    if(localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.rememberMe = true;
    }

  }

  onSubmit(form:NgForm) {
    if(form.invalid) {
      return;
    }
    
    Swal.fire({
      allowOutsideClick: false,
      text: "Wait please...",
      icon: "info"
    });
    
    Swal.showLoading();

    this.auth.logIn(this.user)
      .subscribe(resp => {
        console.log(resp);
        Swal.close();
        if(this.rememberMe) {
          localStorage.setItem('email', this.user.email);
        }
        this.router.navigateByUrl('/home');

      }, (err) => {
       console.log(err.error.error.message);
       Swal.fire({
        text: err.error.error.message,
        title: "Authentication error",
        icon: "error"
      });
      });

  }

}
