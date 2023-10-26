import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NorthEastDelhiComponent } from './north-east-delhi.component';

describe('NorthEastDelhiComponent', () => {
  let component: NorthEastDelhiComponent;
  let fixture: ComponentFixture<NorthEastDelhiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NorthEastDelhiComponent]
    });
    fixture = TestBed.createComponent(NorthEastDelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
