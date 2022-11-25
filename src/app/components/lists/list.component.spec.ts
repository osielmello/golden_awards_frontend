import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ListComponent } from "./list.component";
import { TestModule } from "../../test.module";
import { click, setFieldValue } from "../../helpers/element.spec-helper";

describe('ListComponent', () => {
  let fixture: ComponentFixture<ListComponent>;
  let component: ListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      declarations: [
        ListComponent,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should movies', () => {
    expect(fixture.nativeElement.querySelectorAll('#movies').length).toBeGreaterThan(0);
  });

  it('should filter movies', () => {
    expect(fixture.nativeElement.querySelector('#winner-select')).toBeTruthy();
    setFieldValue(fixture, "winner-select-data", "YES");
    expect(fixture.nativeElement.querySelector('#winner-select').value).toEqual("YES");
    expect(component.data$.value.content.every(m => m.winner)).toBeTrue();

    expect(fixture.nativeElement.querySelector('#year-input')).toBeTruthy();
    setFieldValue(fixture, "year-input-data", "1980");
    expect(fixture.nativeElement.querySelector('#year-input').value).toEqual("1980");
  });

  it('should decrement', fakeAsync(() => {
    spyOn(component, "decrementPage");
    click(fixture, 'decrement');
    expect(component.decrementPage).toHaveBeenCalledTimes(1);
  }));

  it('should set page', fakeAsync(() => {
    spyOn(component, "setPage");
    click(fixture, 'set-page');
    expect(component.setPage).toHaveBeenCalledTimes(1);
  }));

  it('should increment', fakeAsync(() => {
    spyOn(component, "incrementPage");
    click(fixture, 'increment-page');
    expect(component.incrementPage).toHaveBeenCalledTimes(1);
  }));

});
