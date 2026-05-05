import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IPaginatedRequest } from '@/shared/models/paginated-request.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { ICustomer } from './customer.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  readonly apiUrl = environment.apiUrl + '/customer';
  private _http = inject(HttpClient);

  getCustomerList(filters: IPaginatedRequest): Observable<IPaginatedResponse<ICustomer>> {
    return this._http.post<IPaginatedResponse<ICustomer>>(`${this.apiUrl}/view`, filters);
  }

  getCustomerDetail(id: number): Observable<ICustomer> {
    return this._http.get<ICustomer>(`${this.apiUrl}/${id}`);
  }

  createCustomer(customerData: ICustomer): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}`, customerData);
  }

  updateCustomer(customerData: ICustomer, id: number): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${id}`, customerData);
  }

  deleteCustomer(id: number): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${id}`);
  }
}
