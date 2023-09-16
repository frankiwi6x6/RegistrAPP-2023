import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingPagePage } from './loading-page.page';

describe('LoadingPagePage', () => {
  let component: LoadingPagePage;
  let fixture: ComponentFixture<LoadingPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LoadingPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
