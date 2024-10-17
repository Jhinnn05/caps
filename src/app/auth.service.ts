import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; //Laravel backend URL
  token =localStorage.getItem('token');
  id = localStorage.getItem('id');
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data);
  }
  getProfile(id:any): Observable<any>{
    const headers = {'Authorization': 'Bearer'+ this.token};  
    return this.http.get(`${this.apiUrl}/Account/${id}`,{headers});
  }
  updatePass(email:any){
    // const headers = {'Authorization': 'Bearer'+ this.token};  
    // return this.http.post(this.apiUrl + '/updatePass/',email,{headers});
    return this.http.get<any[]>(`${this.apiUrl}/updatePass?email=${email}`);
  }
  getparent(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/parentguardians?email=${email}`); 
}
  printSOA(id :any){
    return this.http.get(`${this.apiUrl}/displaySOA/${id}`);
  }
  getGrades(cid: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/displaygrades/${cid}`);
  }
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
//   getparent(email: any): Observable<any[]> {
//     const headers = {'Authorization': 'Bearer'+ this.token};
//     return this.http.get<any[]>(`${this.apiUrl}/parentguardians/${email}`);
// }

  // signup(userData: {name: string, email: string, password: string}): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/register`, userData);
  // }

  // logout(): void {
  //   localStorage.removeItem('token');
  // }

  // isAuthenticated(): boolean {
  //   return !!localStorage.getItem('token');
  // }
}