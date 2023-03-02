import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CircularTimelineComponent } from './circular-timeline.component';

describe('CircularTimelineComponent', () => {
  let component: CircularTimelineComponent;
  let fixture: ComponentFixture<CircularTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CircularTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CircularTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
