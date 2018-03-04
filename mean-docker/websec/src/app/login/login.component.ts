import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	loginForm: FormGroup;

	username: string = '';
	password: string = '';
	token: string = '';

	constructor(private loginService: LoginService, private fb: FormBuilder, private dataService: DataService, private router: Router){
		this.loginForm = fb.group({
			'username': [null, Validators.required],
			'password': [null, Validators.required]
		});
	}

	ngOnInit() {

	}

	userLogin(post){
	//	console.log(post);
		this.loginService.authenticateUser(post.username, post.password).subscribe(
			result => {
				console.log(result);
				if(result.status === true || result.status === 'true'){
					console.log(post);
					localStorage.setItem("token",result.result.token);
					this.dataService.changeUsername(post.username);
					this.dataService.changeToken(result.result.token);
					this.router.navigate(['/']);
				}
			},
			error => {
				console.log(error);
			}
		);
	}


}
