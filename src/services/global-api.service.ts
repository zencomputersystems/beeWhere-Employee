import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GlobalApiService {
  /**
   * To pass dreamfactory url from enviroment variable
   * @private
   * @memberof GlobalApiService
   */
  private DF_URL = environment.URL_DF;

  constructor(private http: HttpClient) {}

  dfGetApi(address: string) {
    return this.http.get(this.DF_URL + address).pipe(map((res: Response) => res.json()));
  }

  reqDfGetApi(address): Observable<any> {
    return this.dfGetApi(address);
  }
}
