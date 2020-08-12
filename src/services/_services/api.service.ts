import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Injectable } from '@angular/core';
import { map, tap } from "rxjs/operators";
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: "root",
})
export class APIService {
  public ROOT_URL = environment.URL_API;
  private headers = new Headers();
  httpHeaders: HttpHeaders = new HttpHeaders({
    Authorization: "JWT " + localStorage.getItem("access_token"),
  });
  constructor(private http: HttpClient) {}
  // headers: new HttpHeaders({'Authorization': 'Bearer ' + token}

  testGet() {
    return this.http.get<any>(this.ROOT_URL + "/").pipe(
      map((data) => {
        console.log(data);
        return data;
      })
    );
  }

  headerAuthorization() {
    // console.log("JWT " + localStorage.getItem("access_token"));
    // (this.headers as any).append(
    //   "Authorization",
    //   "JWT " + localStorage.getItem("access_token")
    // );
    this.httpHeaders.append(
      "Authorization",
      "JWT " + localStorage.getItem("access_token")
    );
  }

  // getWithHeaders() {
  //   this.headerAuthorization();
  //   return this.http
  //     .get(this.ROOT_URL + "/api/user-info", { headers: this.httpHeaders })
  //     .pipe(map((res: Response) => res.json()));
  // }
  
  // reqGetApi(): Observable<any> {
  //   return this.getWithHeaders();
  // }

  getWithHeader(addr: string) {
  // The Observable returned by get() is of type Observable<string>
  // because a text response was specified.
  // There's no need to pass a <string> type parameter to get().
  return this.http
    .get(this.ROOT_URL + addr , { headers: this.httpHeaders })
    .pipe(
      tap(
        (data) => data,
        (error) => error
      )
    );
  }
}
