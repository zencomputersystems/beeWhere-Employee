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
  private UPLOAD_URL = environment.URL_UPLOAD;
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

  /**
   * Get method with passing header to return the data from db
   * @param {string} addr
   * @returns
   * @memberof APIService
   */
  getWithHeader(addr: string) {
    return this.http
      .get(this.ROOT_URL + addr, { headers: this.httpHeaders })
      .pipe(
        tap(
          (data) => data,
          (error) => error
        )
      );
  }

  /**
   * Post method with passing it's header, array to db using ROOT_URL
   * @param {string} addr
   * @param {*} array
   * @memberof APIService
   */
  postWithHeader(addr: string, array: any) {
    return this.http
      .post(this.ROOT_URL + addr, array, { headers: this.httpHeaders })
      .pipe(
        tap(
          (data) => data,
          (error) => error
        )
      );
  }

  /**
   * Post method with passing it's header, array to db using UPLOAD_URL
   * @param {string} addr
   * @param {*} array
   * @returns
   * @memberof APIService
   */
  postUpload(addr: string, array: any) {
    return this.http
      .post(this.UPLOAD_URL + addr, array, { headers: this.httpHeaders })
      .pipe(
        tap(
          (data) => data,
          (error) => error
        )
      );
  }

  /**
   * Patch data to db
   * @param {string} addr
   * @param {*} array
   * @returns
   * @memberof APIService
   */
  patchWithHeader(addr: string, array: any) {
    return this.http
      .patch(this.ROOT_URL + addr, array, { headers: this.httpHeaders })
      .pipe(
        tap(
          (data) => data,
          (error) => error
        )
      );
  }
}
