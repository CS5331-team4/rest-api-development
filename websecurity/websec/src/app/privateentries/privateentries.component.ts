import { Component, OnInit } from '@angular/core';
import { DiaryService } from '../services/diary.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-privateentries',
  templateUrl: './privateentries.component.html',
  styleUrls: ['./privateentries.component.css']
})
export class PrivateentriesComponent implements OnInit {
	entries: any;
	username: string;
	token: string;

	constructor(private diaryService: DiaryService, private dataService: DataService){
		
	}

	ngOnInit() {

		this.dataService.currentToken.subscribe(tok => {
			if(tok !== ''){
				this.token = tok;
				console.log(this.token);
			}
		});

		if(localStorage.getItem("token")){
			console.log(localStorage.getItem("token"));
			this.diaryService.getPrivateEntries(localStorage.getItem("token"))
			.subscribe(entries => {
				console.log(entries);
				entries.result.sort((a,b) => Number(new Date(b.publish_date)) - Number(new Date(a.publish_date)));
				this.entries = entries.result;
			});
		}


	}

	deleteEntry(id: string){
		this.diaryService.deleteEntry(id, this.token)
		.subscribe(result => {
			console.log(result);
			if(result.status === 'true' || result.status === true){
				for(let i=0;i<this.entries.length;i++){
					if(this.entries[i].id === id){
						this.entries.splice(i, 1);
						break;
					}
				}
			}
		});
	}

	updatePermission(entry){
		this.diaryService.updatePermission(entry.id, this.token, !entry.public)
		.subscribe(result => {
			console.log(result);
			if(result.status === 'true' || result.status === true){
				for(let i=0;i<this.entries.length;i++){
					if(this.entries[i].id === entry.id){
						this.entries[i].public = !this.entries[i].public;
						console.log('permissions changed');
						break;
					}
				}
			}
		});
	}


}
