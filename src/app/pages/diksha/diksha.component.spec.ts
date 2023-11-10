import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DikshaComponent } from './diksha.component';

describe('DikshaComponent', () => {
  let component: DikshaComponent;
  let fixture: ComponentFixture<DikshaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DikshaComponent]
    });
    fixture = TestBed.createComponent(DikshaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
