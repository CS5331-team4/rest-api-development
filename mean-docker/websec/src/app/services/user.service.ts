import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService{
	constructor(private http:Http){
		console.log('user service initiated');
	}

	registerUser(username: string, fullname: string, age: number, password: string){
		return this.http.post('http://localhost:8080/users/register',{'username': username, 'password': password, 'fullname': fullname, 'age': age})
			.map(res => res.json());
	}

	getUserData(token: string){
		return this.http.post('http://localhost:8080/users',{'token': token}).map(res => res.json());
	}

	getTeamMembers(){
		return this.http.get('http://localhost:8080/meta/members').map(res => res.json());
	}

}