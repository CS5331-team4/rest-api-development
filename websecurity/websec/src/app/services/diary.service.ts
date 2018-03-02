import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DiaryService{
	constructor(private http:Http){
		console.log('diary service initiated');
	}

	getPublicEntries(){
		return this.http.get('http://localhost:3000/diary').map(res => {
			console.log(res);
			return res.json();
		});
	}

	getPrivateEntries(token: string){
		return this.http.post('http://localhost:3000/secure-api/diary',{'token': token}).map(res => res.json());
	}

	addEntry(title: string, text: string, isPublic: boolean, token: string){
		return this.http.post('http://localhost:3000/secure-api/diary/create',{
			'title': title,
			'text': text,
			'public': isPublic,
			'token': token
		}).map(res => res.json());
	}

	deleteEntry(id: string, token: string){
		return this.http.post('http://localhost:3000/secure-api/diary/delete', {'id': id, 'token': token}).map(res => res.json());
	}

	updatePermission(id: string, token: string, isPublic: boolean){
		return this.http.post('http://localhost:3000/secure-api/diary/permission', {'id': id, 'token': token, 'public': isPublic}).map(res => res.json());
	}


}