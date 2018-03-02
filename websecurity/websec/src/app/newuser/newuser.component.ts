import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';


@Component({
  selector: 'app-newuser',
  templateUrl: './newuser.component.html',
  styleUrls: ['./newuser.component.css']
})
export class NewuserComponent implements OnInit {

	registrationForm: FormGroup;
	username: string = '';
	fullname: string = '';
	age: number = 0;
	password: string = '';
	confirm: string = '';


	constructor(private fb: FormBuilder, private userService: UserService, private router: Router){
		this.registrationForm = fb.group({
			'username': [null, Validators.required],
			'fullname': [null, Validators.required],
			'age': [null, Validators.required],
			'password': [null, Validators.required],
			'confirm': [null, Validators.required]
		});
	}

	ngOnInit() {
	}

	addPost(post){
		console.log(post);
		this.username = post.username;
		this.fullname = post.fullname;
		this.age = Number(post.age);
		this.password = post.password;
		this.confirm = post.confirm;

		this.userService.registerUser(this.username, this.fullname, this.age, this.password).subscribe(
			result => {
				console.log(result);
				if(result.status === 'true' || result.status === true){
					this.router.navigate(['/login']);
				}
			},
			error => {
				console.log(error);
			}
		);


	}

}
