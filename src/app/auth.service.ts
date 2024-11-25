import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; //Laravel backend URL
  id = localStorage.getItem('id');
  private adminPicSubject = new BehaviorSubject<string | null>(null); // This will store the admin image URL
  adminPic$ = this.adminPicSubject.asObservable();
  constructor(private http: HttpClient) {}
  

  login(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data);
  }
  updatePass(email:any){

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
    const token = localStorage.getItem('token'); // Retrieve the token dynamically
    const headers = { Authorization: `Bearer ${token}` }; // Correctly format the headers
    console.log('token:', token);
    return this.http.post(`${this.apiUrl}/logout`, {}, { headers }); // Pass headers in the request
  }
  getAttendance(lcn: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/attendances/${lcn}`);
  }
  update(email: string, OldPassword: string, newData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-password`, {
      email: email,
      oldPassword: OldPassword,
      ...newData
    });
  }
  uploadImage(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload-image`, formData);
  }
  updateParentPic(newImageUrl: string) {
    this.adminPicSubject.next(newImageUrl); // Emit new image URL
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