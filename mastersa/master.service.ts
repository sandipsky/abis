import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { masterModel, taxTypes } from './master.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  sharedValue$ = new Subject();
  apiUnitMasterAdd = environment.apiUrl + '/master/';
  apiURLDivisionList = environment.apiUrl + '/dropdown/divisions';
  apiUrl = environment.apiUrl + '/master';

  constructor(
    private _http: HttpClient,
  ) {

  }

  public addUnitMaster(endPoint: string, unitMaster: any) {
    if (unitMaster.id) {
      return this._http.put(this.apiUnitMasterAdd + endPoint + '/' + unitMaster.id, unitMaster);
    }
    else {
      return this._http.post(this.apiUnitMasterAdd + endPoint, unitMaster);
    }
  }

  public addCustomerMaster(endPoint: string, unitMaster: any, id: any) {
    if (id != null) {
      return this._http.put(this.apiUnitMasterAdd + endPoint + '/' + id, unitMaster);
    }
    else {
      return this._http.post(this.apiUnitMasterAdd + endPoint, unitMaster);
    }
  }

  getMRHQDIV(id: number) {
    return this._http.get(environment.apiUrl + `/master/marketers/${id}`)
  }

  getFile(fileUrl: string) {
    return this._http.get(fileUrl, { responseType: 'blob' as 'json' })
  }

  public addProductUnitMaster(file: any, endPoint: string, unitMaster: masterModel) {
    let formData = new FormData();
    let jsonPayload = JSON.stringify(unitMaster);

    if (file != null) {
      formData.append('file', file);
    }
    formData.append('product', new Blob([jsonPayload], { type: "application/json" }));

    if (unitMaster.id) {
      return this._http.put(this.apiUnitMasterAdd + endPoint + '/' + unitMaster.id, formData);
    }
    else {
      return this._http.post(this.apiUnitMasterAdd + endPoint, formData);
    }
  }

  public getAllUnitMaster(endPoint: string) {
    return this._http.get<masterModel>(this.apiUnitMasterAdd + endPoint);
  }

  // public getMasterList(endPoint: string, data: any) {
  //   return this._http.post<masterModel>(this.apiUnitMasterAdd + endPoint + '/view', data);
  // }

  unlockUser(id: number) {
    return this._http.get(environment.apiUrl + `/master/users/unlock/${id}`)
  }

  getUserDetail(id: number) {
    return this._http.get<any>(environment.apiUrl + '/master/postSave/view' + '/' + id);
  }

  public getMasterList(data: any, endPoint: string,) {
    return this._http.post<masterModel>(this.apiUnitMasterAdd + endPoint + '/view', data);
  }

  public deleteUnit(endPoint: string, id: Array<number>) {
    return this._http.delete(this.apiUnitMasterAdd + endPoint + '/' + id);
  }

  createMaster(formData: any, endPoint: string): Observable<any> {
    return this._http.post<any>(`${this.apiUrl}/${endPoint}`, formData);
  }

  updateMaster(formData: any, id: number, endPoint: string): Observable<any> {
    return this._http.put<any>(`${this.apiUrl}/${endPoint}/${id}`, formData);
  }

  getMasterCode(type: string): Observable<any> {
    return this._http.get(environment.apiUrl + `/master/${type}/getSystemGeneratedNumber`, { responseType: 'text' });
  }

  getAccountCode() {
    return this._http.get(environment.apiUrl + `/accountMaster/getSystemGeneratedNumber`, { responseType: 'text' });
  }

  deleteMaster(id: number, endPoint: string): Observable<any> {
    return this._http.delete<any>(`${this.apiUrl}/${endPoint}/${id}`);
  }

  getMasterDetail(id: number, endPoint: string): Observable<any> {
    return this._http.get<any>(`${this.apiUrl}/${endPoint}/${id}`);
  }



  public masterDetail(endPoint: string, id: number) {
    return this._http.get<masterModel>(this.apiUnitMasterAdd + endPoint + '/' + id);
  }



  public getDivision(id: number) {
    return this._http.get<masterModel>(this.apiURLDivisionList + '/' + id)
  }

  public getPDF(name?: string): Observable<Blob> {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/pdf');
    return this._http.get<Blob>(environment.apiUrl + `/master/${name}/export/pdf`, { headers: headers, responseType: 'blob' as 'json' });
  }

  getProductList(data: any): Observable<any> {
    return this._http.post(environment.apiUrl + '/master/products/view', data)
  }

  getProductCode() {
    return this._http.get(environment.apiUrl + `/master/products/getSystemGeneratedNumber`, { responseType: 'text' });
  }

  getCustomerList(data: any): Observable<any> {
    return this._http.post(environment.apiUrl + '/master/customers/view', data)
  }

  getVendorList(data: any): Observable<any> {
    return this._http.post(environment.apiUrl + '/master/vendors/view', data)
  }

  getSubAccountList(data: any): Observable<any> {
    return this._http.post(environment.apiUrl + '/master/subAccounts/view', data)
  }

  sortList(data: any, active: any, direction: any) {
    return data.sort((a: any, b: any) => {
      const valueA =
        typeof a[active] === 'string' ? a[active].toLowerCase() : a[active];
      const valueB =
        typeof b[active] === 'string' ? b[active].toLowerCase() : b[active];

      if (typeof a[active] === 'number' && typeof b[active] === 'number') {
        if (direction === 'asc') {
          return a[active] - b[active];
        } else {
          return b[active] - a[active];
        }
      } else {
        // Handle string comparison
        if (direction === 'asc') {
          return valueA?.localeCompare(valueB);
        } else {
          return valueB?.localeCompare(valueA);
        }
      }
    });
  }

  getProductsInfo() {
    return this._http.get(environment.apiUrl + '/master/products/info');
  }

}
