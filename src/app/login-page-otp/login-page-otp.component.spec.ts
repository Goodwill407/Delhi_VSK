import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageOtpComponent } from './login-page-otp.component';

describe('LoginPageOtpComponent', () => {
  let component: LoginPageOtpComponent;
  let fixture: ComponentFixture<LoginPageOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPageOtpComponent]
    });
    fixture = TestBed.createComponent(LoginPageOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
