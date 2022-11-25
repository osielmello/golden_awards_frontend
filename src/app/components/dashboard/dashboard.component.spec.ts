import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { DashboardComponent } from "./dashboard.component";
import { TestModule } from "../../test.module";
import { click, findEl } from "../../helpers/element.spec-helper";

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
      declarations: [
        DashboardComponent,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should years with multiple winners', () => {
    expect(fixture.nativeElement.querySelectorAll('#years-multiple-winners').length).toBeGreaterThan(0);
  });

  it('should studios with win count', () => {
    expect(fixture.nativeElement.querySelectorAll('#studios-with-count').length).toBeGreaterThan(0);
  });

  it('should max-win-interval-producers', () => {
    expect(fixture.nativeElement.querySelectorAll('#max-win-interval-producers').length).toBeGreaterThan(0);
  });

  it('should "min-win-interval-producers', () => {
    expect(fixture.nativeElement.querySelectorAll('#min-win-interval-producers').length).toBeGreaterThan(0);
  });

  it('should search', fakeAsync(() => {
    expect(component.moviesByYear$.value).toEqual([]);
    const el = findEl(fixture, "input-year");
    expect(el).toBeTruthy();
    component.searchForm.controls.year.setValue(1989);

    component.evtSearch.subscribe(v => expect(v).toEqual(1989));

    spyOn(component, "onSearch");
    click(fixture, 'on-search');
    expect(component.onSearch).toHaveBeenCalledTimes(1);

    component.evtSearch.emit(1989);
    expect(component.moviesByYear$.value.length).toBeGreaterThan(0);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('#movies-by-year').length).toBeGreaterThan(0);
  }));

});
