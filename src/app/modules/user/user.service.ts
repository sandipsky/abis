// import { User } from './user.model';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { environment } from 'src/environments/environment';
// import { Observable } from 'rxjs';
// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   apiUrl = environment.apiUrl + '/master/users'
//   apiUrlView = environment.apiUrl + '/master/users/view'
//   apiUrlDetailView = environment.apiUrl + '/master/postSave/view'

//   apiUrlProfileImage = environment.apiUrl + '/master/profilePics'

//   constructor(private _http: HttpClient) { }

//   getUser() {
//     return this._http.get<User[]>(this.apiUrlView);
//   }

//   // createUser(user: User) {
//   //   if (user.id) {
//   //     return this._http.put(this.apiUrl + '/' + user.id, user);
//   //   } else {
//   //     return this._http.post(this.apiUrl, user);
//   //   }
//   // }\

//   getUserList(data: any): Observable<any> {
//     return this._http.post(environment.apiUrl + '/master/users/view', data)
//   }

//   deleteUser(id: Array<number>) {
//     return this._http.delete(this.apiUrl + '/' + id);
//   }

//   createUser(file: any, user: any) {
//     let formData = new FormData();
//     let jsonPayload = JSON.stringify(user);

//     if (file != null) {
//       formData.append('file', file);
//     }
//     formData.append('user', new Blob([jsonPayload], { type: "application/json" }));

//     //   formData.append('general_settings', JSON.parse(generalSettings),{
//     //     type: "application/json"
//     // });

//     // var request = this._http.post(this.apiUrlLogo + '/' + 1 ,formData);

//     if (user.id) {
//       var request = this._http.put(this.apiUrl + '/' + user.id, formData);
//       return request;
//     } else {
//       var request = this._http.post(this.apiUrl, formData);
//       return request;
//     }
//   }

//   changePassword(data: any, id: number) {
//     return this._http.post(environment.apiUrl + `/master/users/changePassword/${id}`, data);
//   }

//   getImage(id: number) {
//     return this._http.get(this.apiUrlProfileImage + '/' + id)
//   }

//   // getImage(id:number){
//   //   return this._http.get(this.url + '/' + id)
//   // }

//   getUserDetail(id: number) {
//     return this._http.get<User[]>(this.apiUrlDetailView + '/' + id);
//   }

//   unlockUser(id: number) {
//     return this._http.get(environment.apiUrl + `/master/users/unlock/${id}`)
//   }

//   public getPDF(): Observable<Blob> {
//     let url = this.apiUrl + '/' + 'export/pdf';
//     let headers = new HttpHeaders();
//     headers = headers.set('Accept', 'application/pdf');
//     return this._http.get<Blob>(url, { headers: headers, responseType: 'blob' as 'json' });
//   }

//   getUserCode() {
//     return this._http.get(environment.apiUrl + `/master/users/getSystemGeneratedNumber`, { responseType: 'text' });
//   }
// }
