import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StartupPage } from './startup.page';

describe('StartupPage', () => {
  let component: StartupPage;
  let fixture: ComponentFixture<StartupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StartupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
