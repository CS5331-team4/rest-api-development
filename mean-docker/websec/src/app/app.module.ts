import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NewuserComponent } from './newuser/newuser.component';
import { UserService } from './services/user.service';
import { DiaryService } from './services/diary.service';
import { DataService } from './services/data.service';
import { LoginService } from './services/login.service';
import { LoginComponent } from './login/login.component';
import { EntriesComponent } from './entries/entries.component';
import { PrivateentriesComponent } from './privateentries/privateentries.component';
import { NewentryComponent } from './newentry/newentry.component';
import { TopnavbarComponent } from './topnavbar/topnavbar.component';

var routes = [
	{
		path: 'newuser',
		component: NewuserComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'entries/public',
		component: EntriesComponent
	},
	{
		path: 'entries/private',
		component: PrivateentriesComponent
	},
	{
		path: 'newentry',
		component: NewentryComponent
	},
	{
		path: '',
		component: HomeComponent
	}
]

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		NewuserComponent,
		LoginComponent,
		EntriesComponent,
		PrivateentriesComponent,
		NewentryComponent,
		TopnavbarComponent
	],
	imports: [
		NgbModule.forRoot(),
		BrowserModule,
		HttpModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forRoot(routes)
	],
	providers: [
		UserService,
		DiaryService,
		LoginService,
		DataService
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
