import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable,BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; //Laravel backend URL
  id = localStorage.getItem('id');
  token = localStorage.getItem('token'); // Retrieve the token dynamically
  private adminPicSubject = new BehaviorSubject<string | null>(null); // This will store the admin image URL
  adminPic$ = this.adminPicSubject.asObservable();
  constructor(private http: HttpClient) {}
  
  //preloader
  private _preloader: boolean = false;
  get preloader(): boolean {
    return this._preloader;
  }

  set preloader(value: boolean) {
    this._preloader = value;
  }

  login(data: any): Observable<any> {
    return this.http.post(this.apiUrl + '/login', data);
  }
  logout(): Observable<any> {
    const headers = {'Authorization': 'Bearer ' + this.token};
    console.log('token:', headers);
    return this.http.post(this.apiUrl + '/logout', {}, { headers }); // Pass headers in the request
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

  //messages
  getMessages(uid: any){
    return this.http.get(this.apiUrl + '/getMessages', {params: {uid: uid}});
  }
  getConvo(sid: any, uid: any){
    return this.http.get(this.apiUrl + '/getConvo/' + sid , {params: {uid: uid}});
  }
  getAdmins(){
    return this.http.get(this.apiUrl + '/getAdmins');
  }
  sendMessage(mdata: any){
    return this.http.post(this.apiUrl + '/sendMessage', mdata );
  }
  getRecipients(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/getrecepeints');
  }
  composeMessage(messageData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/composemessage', messageData);
  }

  //announcements
  getannouncement(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + '/announcements'); 
  }
}