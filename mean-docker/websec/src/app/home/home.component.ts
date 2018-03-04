import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

	taskList: Array<{title: string,link: string}>;
	members: Array<string>;

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.taskList = [
			{title: 'Register a user', link: 'newuser'},
			{title: 'Display all public diary entries', link: 'entries/public'},
			{title: 'Display all private diary entries', link: 'entries/private'},
			{title: 'Create a new diary entry', link: 'newentry'},
			{title: 'Delete an existing diary entry', link: 'entries/private'},
			{title: 'Toggle permissions for a diary entry', link: 'entries/private'}
		];

		this.userService.getTeamMembers().subscribe(result => {
			console.log(result);
			this.members = result.result;
		});

	}

}
