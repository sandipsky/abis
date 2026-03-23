import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConfigurationService {

    private _http = inject(HttpClient);

    private configuration = new BehaviorSubject<any>({ dateType: 'BS' });
    configuration$ = this.configuration.asObservable();

    private companyDetailsSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    companyDetails$ = this.companyDetailsSubject.asObservable();

    updateBreadcrumbs(item: any) {
        this.configuration.next(item);
    }

    setConfigData(configData: any): void {
        this.companyDetailsSubject.next(configData);
    }

    setCompanyImage(data: any) {
        return this._http.post(environment.apiUrl + '/master/uploadLogo', data);
    }

    getCompanyImage(imageName: string) {
        return this._http.get(environment.apiUrl + `/master/${imageName}`);
    }

    getCompanyName(): Observable<any> {
        return this._http.get(environment.apiUrl + '/master/configuration/companyName', {
            responseType: 'text',
        });
    }

    addConfiguration(configModel: any): Observable<any> {
        return this._http.post(environment.apiUrl + '/master/configurations', configModel);
    }

    getAllConfigData() {
        return this._http.get<any>(environment.apiUrl + '/master/configuration/view').pipe(
            tap((res: any) => {
                this.setConfigData({
                    companyName: res?.find((item: any) => item.name == 'company_name')?.value || "",
                    companyAddress: res?.find((item: any) => item.name == 'company_address')?.value || "",
                    companyReg: res?.find((item: any) => item.name == 'company_reg')?.value || "",
                    companyContact: res?.find((item: any) => item.name == 'company_contact')?.value || "",
                    companyEmail: res?.find((item: any) => item.name == 'company_email')?.value || "",
                    max_failed_attempts: res?.find((item: any) => item.name == 'max_failed_attempts')?.value || "",
                    session_time_limit_hour: res?.find((item: any) => item.name == 'session_time_limit_hour')?.value || "",
                    pdf_format: res?.find((item: any) => item.name == 'pdf_format')?.value || "",
                    division_wise_sales: res?.find((item: any) => item.name == 'division_wise_sales')?.value || "",
                    category_wise_discount: res?.find((item: any) => item.name == 'category_wise_discount')?.value || "",
                    sales_payment_alert_days: res?.find((item: any) => item.name == 'sales_due_alert_days')?.value || "",
                    treat_expiry_as_product_stock: res?.find((item: any) => item.name == 'treat_expiry_as_product_stock')?.value || "",
                    is_IRD_certified: res?.find((item: any) => item.name == 'is_IRD_certified')?.value || "",
                    username_IRD: res?.find((item: any) => item.name == 'username_IRD')?.value || "",
                    password_IRD: res?.find((item: any) => item.name == 'password_IRD')?.value || "",
                    company_reg_type: res?.find((item: any) => item.name == 'company_reg_type')?.value || "",
                    default_rounding: res?.find((item: any) => item.name == 'default_rounding')?.value || "",
                    trade_price: res?.find((item: any) => item.name == 'trade_price')?.value || "",
                    mfg_date: res?.find((item: any) => item.name == 'mfg_date')?.value || "",
                    is_free_sample: res?.find((item: any) => item.name == 'is_free_sample')?.value || "",
                    default_unit_purchase: res?.find((item: any) => item.name == 'default_unit_purchase')?.value || "",
                    default_unit_purchase_return: res?.find((item: any) => item.name == 'default_unit_purchase_return')?.value || "",
                    default_unit_sales: res?.find((item: any) => item.name == 'default_unit_sales')?.value || "",
                    default_unit_sales_return: res?.find((item: any) => item.name == 'default_unit_sales_return')?.value || "",
                    default_unit_expiries: res?.find((item: any) => item.name == 'default_unit_expiries')?.value || "",
                    default_unit_inventories: res?.find((item: any) => item.name == 'default_unit_inventories')?.value || "",
                    zero_value_sales: res?.find((item: any) => item.name == 'zero_value_sales')?.value || "",
                    zero_value_purchase: res?.find((item: any) => item.name == 'zero_value_purchase')?.value || "",
                    zero_value_finish_goods: res?.find((item: any) => item.name == 'zero_value_finish_goods')?.value || "",
                    product_valuation_method: res?.find((item: any) => item.name == 'product_valuation_method')?.value || "FIFO",
                    allow_day_in_expiry: res?.find((item: any) => item.name == 'allow_day_in_expiry')?.value || "",
                });
            })
        );
    }
}