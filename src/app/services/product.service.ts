import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable'

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProductService {
  
  constructor(private http: Http, private httpClient: HttpClient) { }
  //lấy danh sách hotel
  // host = 'http://localhost/product_coffee/';
  host = 'http://coffeestore-online.000webhostapp.com/';
  getAll() {
    let URL = this.host + "get_coffee.php";
    return this.httpClient.get(URL);
  }
  getCafeHat() {
    let URL = this.host + "get_coffee_hat.php";
    return this.httpClient.get(URL);
  }
  getCafeXay() {
    let URL = this.host + "get_coffee_xay.php";
    return this.httpClient.get(URL);
  }
  getCity() {
    return this.httpClient.get('./assets/json/thanhpho.json');
  }
  getDistrict() {
    return this.httpClient.get('./assets/json/quanhuyen.json');
  }
  addOrder(data) {
    let URL = this.host + "add_new_order.php";
    console.log(JSON.stringify({ data: data }));
    return this.http.post(URL, JSON.stringify({ data: data }));
  }
  deleteProduct(id){
    let URL = this.host + "delete_product.php?id=" + id;
    return this.http.get(URL);
  }
  updateProduct(data){
    let URL = this.host + "update_product.php";
    console.log(JSON.stringify({ data: data }));
    return this.http.post(URL, JSON.stringify({ data: data }));
  }
  uploadImg(fd, id) {
    let URL = this.host + "upload_avatar.php?id="+id;
    return this.http.post(URL, fd);
  }
  updateOrder(id, status){
    let URL = this.host + "update_order.php?id="+id+"&status="+status;
    return this.http.get(URL);
  }
  getOrder(){
    let URL = this.host + "get_order.php";
    return this.httpClient.get(URL);
  }
  getOrderOnduty(){
    let URL = this.host + "get_order_onduty.php";
    return this.httpClient.get(URL);
  }
  getHistoryOrder(start_day, end_day){
    let URL = this.host + "get_history_order.php";
    return this.http.post(URL, JSON.stringify({start_day: start_day, end_day: end_day}));
  }
  deleteOrder(id){
    let URL = this.host + "delete_order.php?id="+id;
    return this.http.get(URL);
  }
  addProduct(data){
    let URL = this.host + "add_new_product.php";
    console.log(JSON.stringify({data: data}));
    return this.http.post(URL, JSON.stringify({data: data}));
  }
}
