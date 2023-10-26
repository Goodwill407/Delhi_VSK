import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EastDelhiComponent } from './east-delhi.component';

describe('EastDelhiComponent', () => {
  let component: EastDelhiComponent;
  let fixture: ComponentFixture<EastDelhiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EastDelhiComponent]
    });
    fixture = TestBed.createComponent(EastDelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
