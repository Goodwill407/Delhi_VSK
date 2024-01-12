import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularSchoolComponent } from './tabular-school.component';

describe('TabularSchoolComponent', () => {
  let component: TabularSchoolComponent;
  let fixture: ComponentFixture<TabularSchoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabularSchoolComponent]
    });
    fixture = TestBed.createComponent(TabularSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
