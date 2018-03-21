import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  register() {
    console.log(this.credentials);
    this.auth.register(this.credentials).subscribe(() => {
      // TODO : display appropriate messages for success and fail
      this.router.navigateByUrl('/dashboard');      
    }, (err) => {
      console.error(err);
    });
  }
}
