import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IDropdownItem } from '../models/dropdown.model';
import { Observable } from 'rxjs';

export type IStatusType = 'active' | 'all';

@Injectable({
  providedIn: 'root'
})

export class DropdownsService {
  readonly apiUrl = environment.apiUrl + '/dropdown';
  private _http = inject(HttpClient);


  getMasterDropdown(masterType: string, status?: IStatusType): Observable<IDropdownItem[]> {
    return this._http.get<IDropdownItem[]>(`${this.apiUrl}/${masterType}/${status || 'all'}`);
  }

  getProductDropdown(serviceType?: 'service' | 'inventory' | 'all', productType?: 'sellable' | 'purchasable' | 'all', status?: IStatusType): Observable<IDropdownItem[]> {
    return this._http.get<IDropdownItem[]>(`${this.apiUrl}/${serviceType || 'all'}/${productType || 'all'}/${status || 'all'}`);
  }

}

