import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  // apiURL = 'http://165.22.210.138:3000/v1/' // Development
  // // apiURL = 'http://165.22.216.223:3000/v1/' // Production
  apiURL = 'https://server.toknowmore.com/v1/' // Production

  token = '';
  headerToken: any
  constructor(private http: HttpClient) {
    this.setTokens();
  }

  post(url: string, data: any) {
    return this.http.post<any>(this.apiURL + url, data);
  }

  patch(url: string, data: any) {
    const type = Object.getPrototypeOf(data);
    let id: any;
    if (type.append) {
      const stringifyId = JSON.stringify(Object.fromEntries(data));
      const pasrseId = JSON.parse(stringifyId);
      id = pasrseId.id;
      data.delete("id");
    } else {
      id = data.id;
      delete data.id;
    }
    return this.http.patch<any>(this.apiURL + url + "/" + id, data);
  }

  get(url: string) {
    return this.http.get<any>(this.apiURL + url, { headers: this.headerToken });
  }

  getById(url: string, id: string) {
    return this.http.get<any>(this.apiURL + url + "/" + id);
  }

  delete(url: string, id: any) {
    return this.http.delete<any>(this.apiURL + url + "/" + id);
  }

  setTokens() {
    const token = JSON.parse(sessionStorage.getItem('tokens') || '{}');
    if (token && token.access) {
      this.token = token.access.token;
      this.headerToken = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      });
    }
  }
}
