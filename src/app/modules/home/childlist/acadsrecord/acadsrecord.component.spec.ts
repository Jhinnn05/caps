import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcadsrecordComponent } from './acadsrecord.component';

describe('AcadsrecordComponent', () => {
  let component: AcadsrecordComponent;
  let fixture: ComponentFixture<AcadsrecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcadsrecordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcadsrecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
