import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CodeSendService {

  constructor(private http: HttpClient) {
  }

  private headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*'});

  sendCode(data: any): Observable<any> {
    return this.http.post<any>("http://localhost:8888/parseprogram", data, { headers: this.headers });
  }

  clearAll(): Observable<any> {
    return this.http.get<any>("http://localhost:8888/clearall");
  }

  getExplanation(data: any): Observable<any> {
    return this.http.get<any>(data);
  }
  getLiteral(): Observable<any> {
    return this.http.get<any>("http://localhost:8888/getLiterals");
  }

  grounding(data: any): Observable<any> {
    let params = new HttpParams().set("aspCode",data.aspCode).set("preBind", data.preBind); //Create new HttpParams
    return this.http.get<any>("http://localhost:8888/grounding", { headers: this.headers, params: params });
  }

}
