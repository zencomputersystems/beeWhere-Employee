import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClockInPage } from './clock-in.page';

describe('ClockInPage', () => {
  let component: ClockInPage;
  let fixture: ComponentFixture<ClockInPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockInPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClockInPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
