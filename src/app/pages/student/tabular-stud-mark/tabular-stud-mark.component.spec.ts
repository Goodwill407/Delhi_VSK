import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabularStudMarkComponent } from './tabular-stud-mark.component';

describe('TabularStudMarkComponent', () => {
  let component: TabularStudMarkComponent;
  let fixture: ComponentFixture<TabularStudMarkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TabularStudMarkComponent]
    });
    fixture = TestBed.createComponent(TabularStudMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
