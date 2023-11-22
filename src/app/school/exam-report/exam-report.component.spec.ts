import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamReportComponent } from './exam-report.component';

describe('ExamReportComponent', () => {
  let component: ExamReportComponent;
  let fixture: ComponentFixture<ExamReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamReportComponent]
    });
    fixture = TestBed.createComponent(ExamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
