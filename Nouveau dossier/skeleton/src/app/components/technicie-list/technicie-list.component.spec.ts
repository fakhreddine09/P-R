import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicieListComponent } from './technicie-list.component';

describe('TechnicieListComponent', () => {
  let component: TechnicieListComponent;
  let fixture: ComponentFixture<TechnicieListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicieListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
