import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { userModel } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  user:userModel;
  rememberMe = false;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.user = new userModel();
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
     this.auth.newUser(this.user)
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
        title: "Registration error",
        icon: "error"
      });
      });

   }

}
