import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IApiResponse } from '@/shared/models/api-response.model';
import { IPaginatedRequest } from '@/shared/models/paginated-request.model';
import { IPaginatedResponse } from '@/shared/models/paginated-response.model';
import { IProduct } from './product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  readonly apiUrl = environment.apiUrl + '/products';
  private _http = inject(HttpClient);

  getProductList(filters: IPaginatedRequest,): Observable<IPaginatedResponse<IProduct>> {
    return this._http.post<IPaginatedResponse<IProduct>>(`${this.apiUrl}/view`, filters);
  }

  getProductDetail(id: number): Observable<IProduct> {
    return this._http.get<IProduct>(`${this.apiUrl}/${id}`);
  }

  getProductImage(imageName: string): Observable<Blob> {
    return this._http.get(`${environment.apiUrl}/master/products/image/${imageName}`, {
      responseType: 'blob',
    });
  }

  createProduct(productData: FormData | IProduct): Observable<IApiResponse> {
    return this._http.post<IApiResponse>(`${this.apiUrl}`, productData);
  }

  updateProduct(productData: FormData | IProduct, id: number): Observable<IApiResponse> {
    return this._http.put<IApiResponse>(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: number): Observable<IApiResponse> {
    return this._http.delete<IApiResponse>(`${this.apiUrl}/${id}`);
  }
}
