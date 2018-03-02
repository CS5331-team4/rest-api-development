import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService{
	constructor(private http:Http){
		console.log('login service initiated');
	}

	authenticateUser(username: string, password: string){
		return this.http.post('http://localhost:3000/users/authenticate',{'username': username, 'password': password})
			.map(res => res.json());
	}

	logoutUser(token: string){
		return this.http.post('http://localhost:3000/secure-api/users/expire', {'token': token}).map(res => res.json());
	}


}