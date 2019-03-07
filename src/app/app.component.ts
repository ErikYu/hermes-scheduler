import { Component } from '@angular/core';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [LoginService],
})
export class AppComponent {
  title = 'hermes-scheduler';

  menu = [

  ];

  constructor(
    private _login: LoginService,
  ) {}

  signOut() {
    this._login.signOut().subscribe(res => {});
  }
}
