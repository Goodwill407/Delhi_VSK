import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningInitiativesComponent } from './learning-initiatives.component';

describe('LearningInitiativesComponent', () => {
  let component: LearningInitiativesComponent;
  let fixture: ComponentFixture<LearningInitiativesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearningInitiativesComponent]
    });
    fixture = TestBed.createComponent(LearningInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
