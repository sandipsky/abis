import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/api-response.model';
import { PaginatedRequest } from '../../shared/models/paginated-request.model';
import { PaginatedResponse } from '../../shared/models/paginated-response.model';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly apiUrl = environment.apiUrl + '/products';
  private _http = inject(HttpClient);

  getProductList(filters: PaginatedRequest,): Observable<PaginatedResponse<Product>> {
    return this._http.post<PaginatedResponse<Product>>(`${this.apiUrl}/view`, filters);
  }

  getProductDetail(id: number): Observable<Product> {
    return this._http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(productData: Product): Observable<ApiResponse> {
    return this._http.post<ApiResponse>(`${this.apiUrl}`, productData);
  }

  updateProduct(productData: Product): Observable<ApiResponse> {
    return this._http.put<ApiResponse>(`${this.apiUrl}/${productData.id}`, productData);
  }

  deleteProduct(id: number): Observable<ApiResponse> {
    return this._http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }
}
