import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-navbar-admin',
  templateUrl: './navbar-admin.component.html',
  styleUrls: ['./navbar-admin.component.css']
})
export class NavbarAdminComponent implements OnInit {

  order: any;
  order_onduty: any;
  order_history: any;

  start_day = '';
  end_day = '';

  constructor(private productService: ProductService) { }
  ngOnInit() {
    var d = new Date();
    var dd = d.getDate();
    var mm = d.getMonth()+1;
    var yyyy = d.getFullYear();
    this.start_day = yyyy + '-' + this.AddZero(mm) + '-' + this.AddZero(dd);
    this.end_day = yyyy + '-' + this.AddZero(mm) + '-' + this.AddZero(dd);
    
    this.productService.getHistoryOrder(this.start_day, this.end_day).subscribe(res => {
      this.order_history = res.json();
    });

    this.productService.getOrder().subscribe(order =>{
      this.order = order;
    });
    this.productService.getOrderOnduty().subscribe(duty => {
      this.order_onduty = duty;
    });
  }
  //thêm số 0 trước các số < 10
  AddZero(num) {
    return (num >= 0 && num < 10) ? "0" + num : num + "";
  }
  filter(){
    this.productService.getHistoryOrder(this.start_day, this.end_day).subscribe(res => {
      this.order_history = res.json();
      console.log(this.order_history);
    });
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
  showOrder(){
    this.productService.getOrder().subscribe(order =>{
      this.order = order;
    });
  }
  onDuty(id){
    if (confirm("Chuyển đơn hàng '" + id + "' sang đơn hàng chờ xử lý")) {
      this.productService.updateOrder(id, '2').subscribe(res => {
        if (res.text() === 'ok') {
          for (var i = 0; i < this.order.length; i++) {
            if (this.order[i].id === id) {
              this.order_onduty.push(this.order[i]);
              this.order.splice(i, 1);
              break;
            }
          }
        } else {
          alert('Có lỗi xảy ra!');
        }
      });
    }
  }
  onSuccess(id){
    if(confirm("Đơn hàng '"+id+"' đã hoàn thành?")){
      this.productService.updateOrder(id, '3').subscribe(res => {
        if(res.text() === 'ok'){
          for(var i=0; i<this.order_onduty.length; i++){
            if(this.order_onduty[i].id === id){
              this.order_onduty.splice(i, 1);
              break;
            }
          }
        }
      });
    }
  }
  onDelete(id){
    if(confirm("Bạn có chắc chắn muốn xóa hóa đơn'"+ id +"' này không?")){
      this.productService.deleteOrder(id).subscribe(res => {
        if(res.text() === 'ok'){
          for(var i=0; i<this.order_history.length; i++){
            if(this.order_history[i].id === id){
              this.order_history.splice(i, 1);
              break;
            }
          }
          for(var i=0; i<this.order.length; i++){
            if(this.order[i].id === id){
              this.order.splice(i, 1);
              break;
            }
          }
        }
      });
    }
  }
  tensp = '';
  masp = '';
  mota = '';
  avatar = 'assets/images/logo.png';
  loaisp = '1';
  gia = '0';
  uudai = '';
  donvi = 'kg';
  file: File;

  changeTypeProduct(value){
    this.loaisp = value;
  }
  onFileSelect(event: File) {
    this.file = event[0];
    if (this.file.size / (1024 * 1024) < 1) {
      var reader = new FileReader();
      reader.onload = (ev: any) => {
        this.avatar = ev.target.result;
      }
      reader.readAsDataURL(this.file);
    } else {
      alert('Vui lòng chọn những file ảnh có dung lượng nhỏ hơn 1MB!');
    }
  }
  validation(){
    return this.tensp === '' || this.masp === '' || this.mota === '' || Number(this.gia) < 10000 || this.avatar === 'assets/images/logo.png';
  }
  addProduct(){
    if(this.validation()){
      alert('Vui lòng kiểm tra lại dữ liệu nhập vào!');
      return false;
    }
    
    const fd = new FormData();
    const namefile = this.file.name.split('.')[0] + this.masp + "." + this.file.name.split('.')[1];
    fd.append('uploaded_file', this.file, namefile);
    this.productService.uploadImg(fd, '').subscribe(res =>{
      if(res.text() !== "fail" && res.text() !== null && res.text() !== ''){
        let data = {
          masp: this.masp,
          tensp: this.tensp,
          loaisp: this.loaisp,
          gia: this.gia,
          avatar: res.text(),
          mota: this.mota,
          uudai: this.uudai,
          donvi: this.donvi
        }
        this.productService.addProduct(data).subscribe(res =>{
          if(res.text() === 'success'){
            if(confirm('Thêm thành công! Bạn có muốn reset lại dữ liệu không?')){
              this.tensp = '';
              this.masp = '';
              this.mota = '';
              this.avatar = 'assets/images/logo.png';
              this.loaisp = '1';
              this.gia = '0';
              this.uudai = '';
            }
          }else{
            alert('Thêm thất bại! Vui lòng kiểm tra lại mã sản phẩm!');
          }
        });
      }
    });

  }

}
