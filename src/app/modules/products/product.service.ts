import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IApiResponse } from '../../shared/models/api-response.model';
import { IPaginatedRequest } from '../../shared/models/paginated-request.model';
import { IPaginatedResponse } from '../../shared/models/paginated-response.model';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly apiUrl = environment.apiUrl + '/products';
  private _http = inject(HttpClient);

  getProductList(filters: IPaginatedRequest,): Observable<IPaginatedResponse<Product>> {
    return this._http.post<IPaginatedResponse<Product>>(`${this.apiUrl}/view`, filters);
  }

  getProductDetail(id: number): Observable<Product> {
    return this._http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(productData: Product): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}`, productData);
  }

  updateProduct(productData: Product): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${productData.id}`, productData);
  }

  deleteProduct(id: number): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${id}`);
  }
}
