import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DiaryService } from '../services/diary.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
	entries: any;

	constructor(private diaryService: DiaryService){
		this.diaryService.getPublicEntries()
			.subscribe(entries => {
				entries.result.sort((a,b) => Number(new Date(b.publish_date)) - Number(new Date(a.publish_date)));
				this.entries = entries.result;
			});
	}

	ngOnInit() {
	}

}
