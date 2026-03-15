import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapColumns } from './map-columns';

describe('MapColumns', () => {
  let component: MapColumns;
  let fixture: ComponentFixture<MapColumns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapColumns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapColumns);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
