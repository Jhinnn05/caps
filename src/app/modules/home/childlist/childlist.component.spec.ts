import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildlistComponent } from './childlist.component';

describe('ChildlistComponent', () => {
  let component: ChildlistComponent;
  let fixture: ComponentFixture<ChildlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
