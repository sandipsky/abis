import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class IdGeneratorService {
    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    saveConfig(formData: any): Observable<any> {
        return this.http.put(this.apiUrl + `/master/automaticIdGeneration`, formData);
    }

    editConfig(formData: any, id: number): Observable<any> {
        return this.http.put(this.apiUrl + `/master/automaticIdGeneration/${id}`, formData);
    }

    deleteConfig(id: number): Observable<any> {
        return this.http.delete(this.apiUrl + `/master/automaticIdGeneration/${id}`);
    }

    getConfig(): Observable<any> {
        return this.http.get(this.apiUrl + `/master/automaticIdGeneration/view`);
    }

    getAutoCode(type: string): Observable<any> {
        return this.http.get(this.apiUrl + `/master/${type}/getSystemGeneratedNumber`, { responseType: 'text' });
    }

    getProductCode(): Observable<any> {
        return this.http.get(this.apiUrl + `/master/product/getSystemGeneratedNumber`, { responseType: 'text' });
    }

    getUserCode(): Observable<any> {
        return this.http.get(this.apiUrl + `/master/user/getSystemGeneratedNumber`, { responseType: 'text' });
    }

    getAccountCode(): Observable<any> {
        return this.http.get(this.apiUrl + `/master/account/getSystemGeneratedNumber`, { responseType: 'text' });
    }

    getBillingTermCode(): Observable<any> {
        return this.http.get(this.apiUrl + `/master/billingTerm/getSystemGeneratedNumber`, { responseType: 'text' });
    }
}

