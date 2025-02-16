import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPostComponentComponent } from './header-post-component.component';

describe('HeaderPostComponentComponent', () => {
  let component: HeaderPostComponentComponent;
  let fixture: ComponentFixture<HeaderPostComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPostComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPostComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
