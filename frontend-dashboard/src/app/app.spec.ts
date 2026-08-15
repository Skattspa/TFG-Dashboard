import { TestBed } from "@angular/core/testing";
import { App } from "./app";
import { provideRouter } from "@angular/router";

describe("App", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]), // Proporcionamos un enrutador simulado
      ],
    }).compileComponents();
  });

  it("debe crearse correctamente la aplicación", () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
