import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _login: LoginService,
  ) { }

  login() {
    console.log(this.validateForm.value);
    this._login.login(this.validateForm.value).subscribe(res => {
      console.log(res);
      localStorage.setItem('ACT', res.content.data.ACT);
      this._router.navigate(['/scheduler/project']);
    });
  }

  ngOnInit() {
    this.validateForm = this._fb.group({
      login: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

}
