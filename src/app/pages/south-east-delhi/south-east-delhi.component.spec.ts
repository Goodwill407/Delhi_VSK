import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SouthEastDelhiComponent } from './south-east-delhi.component';

describe('SouthEastDelhiComponent', () => {
  let component: SouthEastDelhiComponent;
  let fixture: ComponentFixture<SouthEastDelhiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SouthEastDelhiComponent]
    });
    fixture = TestBed.createComponent(SouthEastDelhiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
