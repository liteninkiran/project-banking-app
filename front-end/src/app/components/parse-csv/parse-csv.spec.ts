import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParseCsv } from './parse-csv';

describe('ParseCsv', () => {
  let component: ParseCsv;
  let fixture: ComponentFixture<ParseCsv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParseCsv]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParseCsv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
