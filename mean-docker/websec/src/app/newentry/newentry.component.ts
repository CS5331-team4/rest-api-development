import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DiaryService } from '../services/diary.service';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newentry',
  templateUrl: './newentry.component.html',
  styleUrls: ['./newentry.component.css']
})
export class NewentryComponent implements OnInit {

	newEntryForm: FormGroup;

	title: string = '';
	text: string = '';
	public: boolean;
	post: any;
	username: string = '';
	token: string = '';


	constructor(private diaryService: DiaryService, private fb: FormBuilder, private dataService: DataService, private router: Router){
		this.newEntryForm = fb.group({
			'title': [null, Validators.required],
			'entrytext': [null, Validators.required],
			'public': false
		});
	}

	ngOnInit() {
		this.dataService.currentUsername.subscribe(user => {
			if(user !== ''){
				this.username = user;
				console.log(this.username);
			}
		});

		this.dataService.currentToken.subscribe(tok => {
			if(tok !== ''){
				this.token = tok;
				console.log(this.token);
			}
			else if(localStorage.getItem('token')){
				this.token = localStorage.getItem('token');
			}
		});

	}

		addEntry(post){
		console.log(post);
		this.diaryService.addEntry(post.title, post.entrytext, post.public, this.token).subscribe(
			result => {
				console.log(result);
				if(result.status === true || result.status === 'true'){
					console.log('entry created');
					this.router.navigate(['/entries/private']);
				}
			},
			error => {
				console.log(error);
			}
		);
	}

}
