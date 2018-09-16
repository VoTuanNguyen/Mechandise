import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  isLoading = true;
  details;
  products: any;
  tong: number = 0;
  isDetail = false;
  product_hat: any = [];
  product_xay: any = [];
  isHat = false;
  isEmpty = false;
  title = '';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    let url = window.location.href;
    let type_product = url.split('?type_product=')[1];
    this.productService.getAll().subscribe(product => {
      let tmp: any = product;
      for(var i=0; i<tmp.length; i++){
        if(tmp[i].tinhtrang === '1'){
          if (tmp[i].loaisp === '1') {
            this.product_hat.push(tmp[i]);
          } else {
            this.product_xay.push(tmp[i]);
          }
        }
      }
      if(type_product === 'coffee_hat'){
        this.products = this.product_hat;
        this.title = 'Cà phê hạt';
        this.isHat = true;
      }else{
        this.products = this.product_xay;
        this.title = 'Cà phê xay';
        this.isHat = false;
      }
      this.isEmpty = this.products.length === 0;
      this.isLoading = false;
    });
    console.log(window.location.href);
  }
  show(id){
    this.soluong = 1;
    for(var i=0; i<this.products.length; i++){
      if(this.products[i].id === id){
        this.isDetail = true;
        this.details = this.products[i];

        let element_mota: HTMLElement = document.getElementById('decribes') as HTMLElement;
        element_mota.innerHTML = this.details.mota;

        break;
      }
    }
  }
  //thêm hàng vào giỏ
  soluong = 1;
  addCart(masp, tensp, giaban, f){
    let soluong: number;
    if(f){
      soluong = 1;
    }else{
      soluong = this.soluong;
    }
    let tmp = {
      masp: masp,
      tensp: tensp,
      giasp: giaban,
      soluong: soluong
    };
    let flag = false;// cờ kiểm tra hàng có tồn tại trong giỏ
    let pos = -1;
    let mycart: any = JSON.parse(localStorage.getItem('mycart'));
    if(mycart === null || mycart.length === 0){// giỏ hàng không có gì
      mycart = [];
      mycart.push(tmp);
    }else{// đã có sp trong giỏ hàng
      //kiểm tra sản phẩm đã tồn tại trong giỏ chưa
      for(var i=0; i<mycart.length; i++){
        if(mycart[i].masp === masp){// món hàng này đã có trong giỏ hàng trước đó
          flag = true;
          pos = i;
          break;
        }
      }
      if(flag === true){// cập nhật lại số lượng của món hàng trong giỏ
        mycart[pos].soluong += soluong;
      }else{// món hàng này không có trong giỏ
        mycart.push(tmp);
      }
    }
    //lưu vào bộ nhớ localstorage
    localStorage.removeItem('mycart');// xóa bộ nhớ cũ cho chắc ăn 
    localStorage.setItem('mycart', JSON.stringify(mycart));
    alert('Thêm vào giỏ hàng thành công!');
  }
  // định dạng số tiền
  formatNumber(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
  keysearch = '';
  isSearch = false;
  enter(event){
    if(Number(event.keyCode) === 13){
      this.onSearch();
    }
  }
  onSearch(){
    if(this.keysearch === ''){
      return false;
    }
    this.isSearch = true;
    let tmp = [];
    if(this.title === 'Cà phê hạt'){
      for(var i=0; i<this.product_hat.length; i++){
        if(this.convertChar(this.product_hat[i].tensp).match(this.convertChar(this.keysearch)) !== null){
          tmp.push(this.product_hat[i]);
        }
      }
      this.products = tmp;
    }else{
      for(var i=0; i<this.product_xay.length; i++){
        if(this.convertChar(this.product_xay[i].tensp).match(this.convertChar(this.keysearch)) !== null){
          tmp.push(this.product_xay[i]);
        }
      }
      this.products = tmp;
    }
    
    this.isEmpty = this.products.length === 0;
  }
  convertChar(str){
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g,"-");
    str = str.replace(/-+-/g,"-"); //thay thế 2- thành 1-
    str = str.replace(/^\-+|\-+$/g,"");//cắt bỏ ký tự - ở đầu và cuối chuỗi

    let result = '';
    let a = str.split('-');
    for(var i=0; i<a.length; i++){
      if(i === a.length-1){
        result += a[i];
      }else{
        result += a[i] + " ";
      }
    }

    return result;
  }
  pageChange(){
    window.scrollTo(0);
  }
}
