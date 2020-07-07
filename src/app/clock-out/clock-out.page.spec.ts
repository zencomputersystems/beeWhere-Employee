import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClockOutPage } from './clock-out.page';

describe('ClockOutPage', () => {
  let component: ClockOutPage;
  let fixture: ComponentFixture<ClockOutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockOutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockOutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
