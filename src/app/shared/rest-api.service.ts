import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  apiURL = 'http://localhost:8080';
  constructor(private http: HttpClient) { 
    RestApiService.httpOptions.headers.append('Access-Control-Allow-Origin','*');
    RestApiService.httpOptions.headers.append('Content-Type', 'application/json');
    
  }
  
  public static httpOptions = {
    headers: new HttpHeaders()
    , withCredentials: true
  }  

  listAllColumnsQuery(): Observable<any> {
    return this.http.get<any>(this.apiURL + '/listAllColumnsQuery', RestApiService.httpOptions)
      .pipe(
        retry(1),
        map(data => data),
        catchError(this.handleError)
      )
  }

  executeQuery(query:string): Observable<any> {
    return this.http.get<any>(this.apiURL + '/executeQuery?query='+query , RestApiService.httpOptions)
      .pipe(
        retry(1),
        map(data => data),
        catchError(this.handleError)
      )
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
