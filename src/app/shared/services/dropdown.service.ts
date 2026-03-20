import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DropdownsService {
  apiUrlRoles = environment.apiUrl + '/dropdown/roles';
  apiUrlMaster = environment.apiUrl + '/dropdown/parentAccount';
  
  apiUrlParent = environment.apiUrl + '/dropdown/parentAccount';  //parrent to parent
  apiUrlAccountTypes = environment.apiUrl + '/dropdown/accountTypes';
  apiURLFiscalyear = environment.apiUrl + '/dropdown/fiscalYear';

  apiUrlAccountMaster = environment.apiUrl + '/dropdown/accountMaster';
  
  apiUrlSubAccountMaster = environment.apiUrl + '/dropdown/subAccountNames';
  apiUrlAccountMasterBilling = environment.apiUrl + '/dropdown/billingTerm/accountMaster';
  apiUrlJournalAccountMaster = environment.apiUrl + '/journalEntries/accountMaster';
  apiUrlAccountMasterOpening = environment.apiUrl + '/dropdown/openingAccount/accounts';
  apiUrlRoleAccess = environment.apiUrl + '/dropdown/operations'
  apiUrlAccountReport = environment.apiUrl + '/dropdown/accountMaster/reports '
  apiUrlCompaniesDropDown = environment.apiUrl + '/dropdown/companies';

  apiURLAllProductInfo = environment.apiUrl + '/dropdown/products/getAllForView';
  apiUrlAllVendors = environment.apiUrl + '/dropdown/vendors';
  apiUrlAllProducts = environment.apiUrl + '/dropdown/products';
  apiUrlAllCategories = environment.apiUrl + '/dropdown/categories';
  apiUrlAllCustomers = environment.apiUrl + '/dropdown/customers';
  apiUrlAllUsers = environment.apiUrl + '/dropdown/users';
  apiUrlAllTax = environment.apiUrl + '/dropdown/tax_types';
  apiUrlAllUnits = environment.apiUrl + '/dropdown/units';

  apiGetIndvidualVendor = environment.apiUrl + '/master/vendors/';
  constructor(
    private _http: HttpClient
  ) { }

  public getRoles() {
    return this._http.get<any[]>(this.apiUrlRoles);
  }

  public getMasterDrpDown() {
    return this._http.get<any[]>(this.apiUrlMaster);
  }

  public getAccountTypes() {
    return this._http.get<any[]>(this.apiUrlAccountTypes);
  }

  public getMasterAccounts() {
    return this._http.get(this.apiUrlAccountMaster);
  }

  public getMasterSubAccounts() {
    return this._http.get(this.apiUrlSubAccountMaster);
  }

  public getMasterAccountsBilling() {
    
    return this._http.get(this.apiUrlAccountMasterBilling);
  }

  public getJournalMasterAccounts() {
    return this._http.get(this.apiUrlJournalAccountMaster);
  }

  public getMasterAccountsOpening() {
    return this._http.get(this.apiUrlAccountMasterOpening);
  }

  public getParentAccountDropDown(parentType: any) {
    return this._http.get<any[]>(this.apiUrlParent + '/' + parentType);
  }

  public getFiscalyearDropDown() {
    return this._http.get<any[]>(this.apiURLFiscalyear);
  }

  public getRoleAccess() {
    return this._http.get(this.apiUrlRoleAccess)
  }

  public getAccountReport() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/report/accountMaster`)
  }

  public getSubAccountReport() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/report/subAccountNames`)
  }

  public getPartyAccounts() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/partyAccounts`)
  }

  public getCustomerAccounts() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/customerAccounts`)
  }

  public getVendorAccounts() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/vendorAccounts`)
  }

  getCustomerDropdown(value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/customers/${value}`)
  }

  getCustomerDropdownReport(value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/reports/customers/${value}`)
  }

  getVendorDropdown(value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/vendors/${value}`)
  }

  getVendorDropdownReport(value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/reports/vendors/${value}`)
  }

  getProductDropdown(value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/products/${value}`)
  }

  getStockProductDropdown(value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/stockEdit/products/${value}`)
  }

  getDivisionDropdown() {
    return this._http.get(environment.apiUrl + `/dropdown/divisions`)
  }

  getDivisionDropdownUser() {
    return this._http.get(environment.apiUrl + `/dropdown/users/divisions`)
  }

  getDivisionDropdownCustomer(customerId: number) {
    return this._http.get(environment.apiUrl + `/dropdown/divisionsByCustomer/${customerId}`)
  }

  getDivisionDropdownAccount(partyId: number) {
    return this._http.get(environment.apiUrl + `/dropdown/divisionsByAccountMaster/${partyId}`)
  }

  getHQDropdown() {
    return this._http.get(environment.apiUrl + `/dropdown/hqs`)
  }

  getHQDropdownCustomer(id: number) {
    return this._http.get(environment.apiUrl + `/dropdown/hqs/${id}`)
  }

  getHQDropdownUser() {
    return this._http.get(environment.apiUrl + `/dropdown/report/hqs`)
  }

  getTransportDropdown() {
    return this._http.get(environment.apiUrl + `/dropdown/transport`)
  }

  getSalesOrderDropdown(customerId?: number, divisionId?: number) {
    return this._http.get(environment.apiUrl + `/dropdown/salesOrder/${customerId || 0}/${divisionId || 0}`)
  }

  getPurchaseOrderDropdown(vendorId?: number, divisionId?: number) {
    return this._http.get(environment.apiUrl + `/dropdown/purchaseOrder/${vendorId || 0}/${divisionId || 0}`)
  }

  getCustomerCategoryDropdown() {
    return this._http.get(environment.apiUrl + `/dropdown/customerCategories`)
  }

  getMRDropdown() {
    return this._http.get(environment.apiUrl + `/dropdown/marketers`)
  }

  getDesignationDropdown() {
    return this._http.get(environment.apiUrl + `/dropdown/designations`)
  }

  getMRSalesDropdown(hqId: number, divisionId: number) {
    return this._http.get(environment.apiUrl + `/dropdown/marketers/mr/${hqId}/${divisionId}`)
  }

  getMRDropdownReport(hqId: number, divisionId: number) {
    return this._http.get(environment.apiUrl + `/dropdown/marketers/mr/${hqId}/${divisionId}`)
  }

  getUserDropdown(value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/users/${value}`)
  }

  getProductsByType(type: string, value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/productsByType/${type}/${value}`)
  }

  getProductsByTypeDivision(type: string, value: string, divisionId: number) {
    return this._http.get(environment.apiUrl + `/dropdown/productsByType/${type}/${divisionId || 0}/${value}`)
  }

  getFinishProduct(value: string) {
    return this._http.get(environment.apiUrl + `/dropdown/materialIssues/${value}`)
  }

  getBatchListByProduct(productId: number) {
    return this._http.get(environment.apiUrl + `/dropdown/salesReturn/batches/${productId}`)
  }



  getProductsExpiry(type: string, value: string, customerId: number, divisionId: number) {
    // return this._http.get(environment.apiUrl + `/dropdown/expiries/productsByType/${type}/${value}/${customerId}`);
    return this._http.get(environment.apiUrl + `/dropdown/expiries/productsByType/${type}/${value}/${customerId}/${divisionId}`);
  }

  getProductsReturn(type: string, value: string, customerId: number, divisionId: number) {
    // return this._http.get(environment.apiUrl + `/dropdown/expiries/productsByType/${type}/${value}/${customerId}`);
    return this._http.get(environment.apiUrl + `/dropdown/salesReturn/productsByType/${type}/${value}/${customerId}/${divisionId}`);
  }

  getProductsByBatch(type: string, value: string, division_id?: number) {
    // if (division_id) {
    //   return this._http.get(environment.apiUrl + `/purchaseReturns/getProductBatchAvailable/${type}/${division_id || 0}/${value}`);
    // }
    // else {
    //   return this._http.get(environment.apiUrl + `/purchaseReturns/getProductBatchAvailable/${type}/${value}`);
    // }

    return this._http.get(environment.apiUrl + `/purchaseReturns/getProductBatchAvailable/${type}/${division_id || 0}/${value}`);

  }

  getProductsByBatchAdd(type: string, value: string, division_id?: number) {
    // if (division_id) {
    //   return this._http.get(environment.apiUrl + `/purchaseReturns/getProductBatchAvailableAdd/${type}/${division_id || 0}/${value}`);
    // }
    // else {
    //   return this._http.get(environment.apiUrl + `/purchaseReturns/getProductBatchAvailableAdd/${type}/${value}`);
    // }

    return this._http.get(environment.apiUrl + `/purchaseReturns/getProductBatchAvailableAdd/${type}/${division_id || 0}/${value}`);

  }

  getStockProductsByBatchAdd(type: string, value: string, division_id?: number) {
    return this._http.get(environment.apiUrl + `/stockAdjustments/getProductBatchAvailableAdd/${type}/${division_id || 0}/${value}`);
  }

  getStockProductsByBatch(type: string, value: string, division_id?: number) {
    return this._http.get(environment.apiUrl + `/stockAdjustments/getProductBatchAvailable/${type}/${division_id || 0}/${value}`);
  }

  getMaterialProductsByBatchAdd(type: string, value: string, division_id?: number) {
    return this._http.get(environment.apiUrl + `/materialIssues/getProductBatchAvailableAdd/${type}/${division_id || 0}/${value}`);
  }

  getMaterialProductsByBatch(type: string, value: string, division_id?: number) {
    return this._http.get(environment.apiUrl + `/materialIssues/getProductBatchAvailable/${type}/${division_id || 0}/${value}`);
  }

  public getCompaniesDropDown() {
    return this._http.get<any>(this.apiUrlCompaniesDropDown)
  }

  public getAllProductDropdownInfo() {
    return this._http.get<any>(this.apiURLAllProductInfo)
  }

  public getAllVendorsDropDown() {
    return this._http.get<any>(this.apiUrlAllVendors)
  }

  public getAllUsersDropDown() {
    return this._http.get<any>(this.apiUrlAllUsers)
  }

  getAllRepresentativeDropDown(name: string, hqId: number, divisionId: number) {
    return this._http.get<any>(environment.apiUrl + `/dropdown/users/salesOrder/${name}/${hqId}/${divisionId}`)
  }

  public getAllProductsDropDown() {
    return this._http.get<any>(this.apiUrlAllProducts)
  }

  getProductDropDownByType(type: string) {
    return this._http.get<any>(environment.apiUrl + `/dropdown/purchase/products`)
  }

  getProductDropDownReport() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/report/products`)
  }

  getCategoryDropDownReport() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/report/categories`)
  }

  getVendorDropDownReport() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/report/vendors`)
  }

  getCustomerDropDownReport() {
    return this._http.get<any>(environment.apiUrl + `/dropdown/report/customers`)
  }

  public getAllCategoryDropDown() {
    return this._http.get<any>(this.apiUrlAllCategories)
  }

  public getAllCustomersDropDown() {
    return this._http.get<any>(this.apiUrlAllCustomers)
  }

  public getAllTaxDropDown() {
    return this._http.get<any>(this.apiUrlAllTax)
  }

  getAllUnitDropDown() {
    return this._http.get<any>(this.apiUrlAllUnits)
  }

  public getPurchaseReturnProductDropDown() {
    // expecting dynamic return product drop
  }

  public getIndividualVendorInformationDropDown(id: number) {
    return this._http.get<any>(this.apiGetIndvidualVendor + id)
  }

  getSalesInvoices(customerId: number, hqId?: number, divisionId?: number) {
    // return this._http.get(environment.apiUrl + `/dropdown/expiries/productsByType/${type}/${value}/${customerId}`);
    return this._http.get(environment.apiUrl + `/dropdown/salesInvoices/${customerId}/${hqId || 0}/${divisionId || 0}`);
  }

  getPurchaseInvoices(vendorId: number, divisionId?: number, isImport?: boolean) {
    return this._http.get(environment.apiUrl + `/dropdown/purchaseInvoices/${vendorId}/${divisionId || 0}/${isImport}`);
  }

  getInvoicesList(partyId: number, hqId?: number, divisionId?: number, type?: string, searchTerm?: string) {
    return this._http.get(environment.apiUrl + `/dropdown/invoices/${partyId || 0}/${hqId || 0}/${divisionId || 0}/${type}/${searchTerm}`);
  }

  getBillingTermList() {
    return this._http.get(environment.apiUrl + `/dropdown/billingTerms`);
  }

  getCostCenterList() {
    return this._http.get(environment.apiUrl + `/dropdown/costCenters`);
  }

  getMaterialIssueList() {
    return this._http.get(environment.apiUrl + `/dropdown/materialIssues`);
  }

  getMaterialIssueListFinishGoods() {
    return this._http.get(environment.apiUrl + `/dropdown/finishGoods/materialIssues`);
  }

  getTransactionTypesBalance() {
    return this._http.get(environment.apiUrl + `/dropdown/transactionType/balance`)
  }

  getNarrationsList() {
    return this._http.get(environment.apiUrl + `/dropdown/narrations`)
  }

  getProductGroupList() {
    return this._http.get(environment.apiUrl + `/dropdown/products/groups`)
  }

  getChildAccountFromParent(parentAccountId: number) {
    return this._http.get(environment.apiUrl + `/dropdown/childAccount/${parentAccountId}`)
  }

  getProductBatchDetail(type: string, productId: number) {
    return this._http.get(environment.apiUrl + `/purchaseReturns/getProductBatchAvailable/${type}/${productId}`);
  }

  getMaterialProductBatchDetail(type: string, productId: number) {
    return this._http.get(environment.apiUrl + `/materialIssues/getProductBatchAvailable/${type}/${productId}`);
  }

  getFinishGoodsProductBatchDetail(type: string, productId: number) {
    return this._http.get(environment.apiUrl + `/finishGoods/getProductBatchAvailable/${productId}`);
  }
}

