import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { TestModule } from "../../test.module";
import { Router, Routes } from "@angular/router";
import { Location } from "@angular/common";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { ListComponent } from "../lists/list.component";
import { RouterTestingModule } from "@angular/router/testing";

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'list', component: ListComponent }
];

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestModule, RouterTestingModule.withRoutes(routes),
      ],
      declarations: [
        HomeComponent, DashboardComponent, ListComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('navigate to "dashboard" takes you to /dashboard', fakeAsync(() => {
    router.navigate(["dashboard"]).then(() => {
      expect(location.path()).toBe("/dashboard");
    });
  }));

  it('navigate to "list" takes you to /list', fakeAsync(() => {
    router.navigate(["list"]).then(() => {
      expect(location.path()).toBe("/list");
    });
  }));
});
