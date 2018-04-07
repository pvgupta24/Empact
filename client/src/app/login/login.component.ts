import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
	templateUrl: './login.component.html'
})
export class LoginComponent {

	credentials: TokenPayload = {
		email: '',
		password: ''
	};

	constructor(private auth: AuthenticationService, private router: Router) { }

	login() {
		this.auth.login(this.credentials).subscribe(() => {
			console.log("Trying to login..");

			this.auth.profile().subscribe(user => {
				console.log(user);
				this.router.navigateByUrl('/dashboard');
			}, (err) => {
				console.error(err);
			});


		}, (err) => {
			console.error(err);
		});
	}
}
