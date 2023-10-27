import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouthWestDelhiComponent } from './south-west-delhi.component';

describe('SouthWestDelhiComponent', () => {
  let component: SouthWestDelhiComponent;
  let fixture: ComponentFixture<SouthWestDelhiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SouthWestDelhiComponent]
    });
    fixture = TestBed.createComponent(SouthWestDelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
