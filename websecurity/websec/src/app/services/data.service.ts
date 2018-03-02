import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';


@Injectable()
export class DataService{

	private username = new BehaviorSubject<string>("");
	currentUsername = this.username.asObservable();

	private token = new BehaviorSubject<string>("");
	currentToken = this.token.asObservable();

	constructor(){ }

	changeUsername(user: string){
		this.username.next(user);
	}

	changeToken(tok: string){
		this.token.next(tok);
	}

}