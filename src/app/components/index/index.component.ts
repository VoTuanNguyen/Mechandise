import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  product_hat: any;
  isEmpty_Hat = true;
  product_xay: any;
  isEmpty_Xay = true;
  products: any = [];
  details: any;
  isDetail = false;
  linkcafehat = '/home/product/?type_product=coffee_hat';
  linkcafexay = '/home/product/?type_product=coffee_xay';
  isLoading = true;
  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getCafeHat().subscribe(data_hat => {
      this.product_hat = data_hat;
      this.isEmpty_Hat = this.product_hat.length === 0;
      this.pushMang(this.product_hat, this.products);
    });
    this.productService.getCafeXay().subscribe(data_xay => {
      this.product_xay = data_xay;
      this.isEmpty_Xay = this.product_xay.length === 0;
      this.pushMang(this.product_xay, this.products);
      this.isLoading = false;
    });
  }
  //do mang a va b
  pushMang(a: any, b: any){
    for(var i=0; i<a.length; i++){
      b.push(a[i]);
    }
  }
  soluong = 1;
  show(id) {
    this.soluong = 1;
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
        this.isDetail = true;
        this.details = this.products[i];

        let element_mota: HTMLElement = document.getElementById('decribes') as HTMLElement;
        element_mota.innerHTML = this.details.mota;

        break;
      }
    }
  }

  addCart(masp, tensp, giaban, f) {
    let soluong: number;
    if (f) {
      soluong = 1;
    } else {
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
    if (mycart === null || mycart.length === 0) {// giỏ hàng không có gì
      mycart = [];
      mycart.push(tmp);
    } else {// đã có sp trong giỏ hàng
      //kiểm tra sản phẩm đã tồn tại trong giỏ chưa
      for (var i = 0; i < mycart.length; i++) {
        if (mycart[i].masp === masp) {// món hàng này đã có trong giỏ hàng trước đó
          flag = true;
          pos = i;
          break;
        }
      }
      if (flag === true) {// cập nhật lại số lượng của món hàng trong giỏ
        mycart[pos].soluong += soluong;
      } else {// món hàng này không có trong giỏ
        mycart.push(tmp);
      }
    }
    //lưu vào bộ nhớ localstorage
    localStorage.removeItem('mycart');// xóa bộ nhớ cũ cho chắc ăn 
    localStorage.setItem('mycart', JSON.stringify(mycart));
    alert('Thêm vào giỏ hàng thành công!');
  }

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
}
