import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit {

	username: string = '';
	token: string = '';
	fullname: string = '';
	age: number = 0;

	constructor(private dataService: DataService,
				private userService: UserService,
				private loginService: LoginService,
				private router: Router,
				private modalService: NgbModal) {}

	ngOnInit() {

		this.dataService.currentToken.subscribe(tok => {
			if(tok !== ''){
				this.token = tok;
			}
			else if(localStorage.getItem('token')){
				this.token = localStorage.getItem('token');
			}
			else{
				this.token = '';
			}

			if(this.token !== ''){
				this.getData();
			}


		});

		this.dataService.currentUsername.subscribe(user => {
			if(user !== ''){
				this.username = user;
			}
		});

	}
	
	logOut(){
		this.loginService.logoutUser(this.token).subscribe(result => {
			console.log(result);
			if(result.status === 'true' || result.status === true){
				localStorage.removeItem('token');
				this.dataService.changeToken('');
				this.router.navigate(['/']);
			}
		});
	}

	getData(){
		this.userService.getUserData(this.token).subscribe(result => {
			console.log(result);
			if(result.status === 'true' || result.status === true){
				this.username = result.result.username;
				this.fullname = result.result.fullname;
				this.age = result.result.age;
				this.dataService.changeUsername(this.username);	
			}
		});
	}

	open(content) {
		this.modalService.open(content);
	}

}
