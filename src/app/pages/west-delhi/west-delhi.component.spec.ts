import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WestDelhiComponent } from './west-delhi.component';

describe('WestDelhiComponent', () => {
  let component: WestDelhiComponent;
  let fixture: ComponentFixture<WestDelhiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WestDelhiComponent]
    });
    fixture = TestBed.createComponent(WestDelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
