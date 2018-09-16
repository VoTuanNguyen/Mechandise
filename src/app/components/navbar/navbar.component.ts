import { Component, OnInit, AfterContentChecked} from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterContentChecked {

  cartDetail: any;
  tinhthanh: any;
  quanhuyen: any;
  district: any;
  idtp = '';
  idqh = '';
  tentp = '';
  tenquanhuyen = '';
  constructor( private productService: ProductService) { }
  
  ngOnInit() {
    // localStorage.clear();
    this.productService.getCity().subscribe(city => {
      this.tinhthanh = city;
      this.tinhthanh = this.tinhthanh.thanhpho;
    });
    this.productService.getDistrict().subscribe(quanhuyen =>{
      this.quanhuyen = quanhuyen;
      this.quanhuyen = this.quanhuyen.quanhuyen;
    });
    let arr = JSON.parse(localStorage.getItem('infouser'));
    if(arr !== null){
      this.name = arr[0].name;
      this.email = arr[0].email;
      this.phone = arr[0].phone;
      this.diachi = arr[0].diachi;
      this.idtp = arr[0].idtp;
      this.idqh = arr[0].idqh;
      this.tentp = arr[0].tentp;
      this.tenquanhuyen = arr[0].tenquanhuyen;

      this.productService.getDistrict().subscribe(quanhuyen =>{
        let quanhuyen_tmp: any = quanhuyen;
        quanhuyen_tmp = quanhuyen_tmp.quanhuyen;

        this.district = [];
        for(var i=0; i<quanhuyen_tmp.length; i++){
          if(quanhuyen_tmp[i].idtp === this.idtp){
            this.district.push(quanhuyen_tmp[i]);
          }
        }
      });
    }
  }
  onChangeCity(id){
    this.district = [];
    if(id !== 'default'){
      this.idtp = id;
      for(var i=0; i<this.tinhthanh.length; i++){
        if(id === this.tinhthanh[i].id){
          this.tentp = this.tinhthanh[i].tentp;
          break;
        }
      }
      for(var i=0; i<this.quanhuyen.length; i++){
        if(this.quanhuyen[i].idtp === id){
          this.district.push(this.quanhuyen[i]);
        }
      }
    }else{
      this.idtp = '';
      this.tentp = '';
    }
  }
  onChangeDistrict(id){
    if(id !== 'default'){
      this.idqh = id;
      for(var i=0; i<this.quanhuyen.length; i++){
        if(id === this.quanhuyen[i].id){
          this.tenquanhuyen = this.quanhuyen[i].tenquanhuyen;
          break;
        }
      }
    }else{
      this.idqh = '';
      this.tenquanhuyen = '';
    }
  }
  public sohang : number = 0;
  ngAfterContentChecked(){
    let arr: any = JSON.parse(localStorage.getItem('mycart'));
    if(arr !== null){
      this.sohang = arr.length;
    }
  }
  showCart(){
    this.cartDetail = JSON.parse(localStorage.getItem('mycart'));
    
    this.thanhtien = 0;
    for(var i=0; i<this.cartDetail.length; i++){
      this.thanhtien += this.cartDetail[i].soluong*this.cartDetail[i].giasp;
    }
  }
  deleteItem(id){
    for(var i=0; i<this.cartDetail.length; i++){
      if(this.cartDetail[i].masp === id){
        if(confirm("Bạn có chắc chắn muốn xóa món hàng '"+ this.cartDetail[i].tensp +"' khỏi giỏ hàng!")){
          this.cartDetail.splice(i, 1);
          this.updateCart();
        }
        break;
      }
    }
  }
  thanhtien: number = 0;
  updateCart(){
    this.thanhtien = 0;
    for(var i=0; i<this.cartDetail.length; i++){
      this.thanhtien += this.cartDetail[i].soluong*this.cartDetail[i].giasp;
    }
    localStorage.setItem('mycart', JSON.stringify(this.cartDetail));// cập nhật thông tin giỏ hàng mới
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
  name='';
  email='';
  phone='';
  diachi='';
  validationPhone(event){
    if(Number(event.keyCode) < 48 || Number(event.keyCode) > 57){
      this.phone = this.phone.replace(this.phone.substring(this.phone.length - 1), '');
    }
  }

  // kiểm tra tên
  checkName(){
    return this.name === '';
  }
  //check phone
  checkPhone(){
    return this.phone === '';
  }
  //check address
  checkAddress(){
    return this.diachi === '';
  }
  checkLocation(){
    return (this.idtp !== '' && this.idqh !== '') ? false : true;
  }
  orderSuccess = false;
  orderProduct(){

    if(this.checkName()){
      alert('Vui lòng nhập họ tên!');
      return false;
    }
    if(this.checkPhone()){
      alert('Vui lòng nhập số điện thoại!');
      return false;
    }
    if(this.checkAddress()){
      alert('Vui lòng nhập địa chỉ!');
       return false;
    }
    if(this.checkLocation()){
      alert('Vui lòng chọn tỉnh/thành phố và quận/huyện nơi bạn đang sinh sống!');
      return false;
    }

    let closeModal : HTMLElement = document.getElementById('closemodal') as HTMLElement;
    closeModal.click();

    let openModal : HTMLElement = document.getElementById('openmodal') as HTMLElement;

    let address = this.diachi + ' - ' + this.tenquanhuyen + ' - ' + this.tentp;
    let motadonhang = '';
    for(var i=0; i<this.cartDetail.length; i++){
      motadonhang += '[' + this.cartDetail[i].soluong + '-' + this.cartDetail[i].tensp + '('+ this.cartDetail[i].masp + ')]';
    }

    // motadonhang = motadonhang.replace(motadonhang.substring(motadonhang.length - 1), '');// xóa phần tử , cuối cùng
    const data = {
      tenkh: this.name,
      email: this.email,
      sodt: this.phone,
      motadonhang: motadonhang,
      diachi: address,
      thanhtien: this.thanhtien
    };
    let info_user = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      diachi: this.diachi,
      idtp: this.idtp,
      idqh: this.idqh,
      tentp: this.tentp,
      tenquanhuyen: this.tenquanhuyen
    };
    let info = [];
    info.push(info_user);

    this.productService.addOrder(data).subscribe(res =>{
      openModal.click();
      if(res.text() === 'success'){
        this.orderSuccess = true;
        localStorage.removeItem('mycart');// xóa các món hàng trong giỏ hàng
        localStorage.setItem('infouser', JSON.stringify(info));
        this.sohang = 0;
      }else{
        this.orderSuccess = false;
      }
    });
    
  }
}
