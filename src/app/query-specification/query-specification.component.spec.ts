import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuerySpecificationComponent } from './query-specification.component';

describe('QuerySpecificationComponent', () => {
  let component: QuerySpecificationComponent;
  let fixture: ComponentFixture<QuerySpecificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuerySpecificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuerySpecificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
