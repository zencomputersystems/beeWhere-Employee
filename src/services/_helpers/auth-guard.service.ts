import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '@services/_services/authentication.service';

/**
 * This service be used to prevent unauthenticated users from accessing restricted routes
 * @export
 * @class AuthGuardService
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authenticationService.isAuthenticated()) {
      return true;
    } else {
    // not logged in so redirect to login page with the return url
      this.router.navigate(["/login"], { queryParams: { returnUrl: state.url } });
      return false;
    }

  }
}
