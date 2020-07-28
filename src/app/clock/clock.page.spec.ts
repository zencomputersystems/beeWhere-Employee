import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClockPage } from './clock.page';

describe('ClockPage', () => {
  let component: ClockPage;
  let fixture: ComponentFixture<ClockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
