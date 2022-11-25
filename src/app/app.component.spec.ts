import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TestModule } from "./test.module";
import { findComponent } from "./helpers/element.spec-helper";
import { RouterTestingModule } from "@angular/router/testing";

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestModule, RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'golden_awards'`, () => {
    expect(component.title).toEqual('golden_awards');
  });

  it('contains a router outlet', () => {
    const el = findComponent(fixture, 'router-outlet');
    expect(el).toBeTruthy();
  });
});
