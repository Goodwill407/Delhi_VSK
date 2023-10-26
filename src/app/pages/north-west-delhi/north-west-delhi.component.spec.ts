import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NorthWestDelhiComponent } from './north-west-delhi.component';

describe('NorthWestDelhiComponent', () => {
  let component: NorthWestDelhiComponent;
  let fixture: ComponentFixture<NorthWestDelhiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NorthWestDelhiComponent]
    });
    fixture = TestBed.createComponent(NorthWestDelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
