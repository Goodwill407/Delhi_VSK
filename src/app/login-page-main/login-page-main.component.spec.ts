import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageMainComponent } from './login-page-main.component';

describe('LoginPageMainComponent', () => {
  let component: LoginPageMainComponent;
  let fixture: ComponentFixture<LoginPageMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPageMainComponent]
    });
    fixture = TestBed.createComponent(LoginPageMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
