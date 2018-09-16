import { Component, OnInit } from '@angular/core';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  isLoading = true;
  details;
  products: any;
  product_total: any;
  tmp: any;
  tong: number = 0;
  isDetail = false;
  isEmpty = false;
  title = '';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getAll().subscribe(product => {
      this. products = product;
      this.product_total = product;
      
      this.isEmpty = this.products.length === 0;
      this.isLoading = false;
    });
    this.productService.getAll().subscribe(product => {
      this.tmp = product;
    });
  }
  show(id){
    this.isEdit =  false;
    for(var i=0; i<this.products.length; i++){
      if(this.products[i].id === id){
        this.isDetail = true;
        this.details = this.products[i];
        this.update = this.tmp[i];

        let element_mota: HTMLElement = document.getElementById('decribes') as HTMLElement;
        element_mota.innerHTML = this.details.mota;

        break;
      }
    }
  }
  //xóa sản phẩm
  deleteProduct(id, tensp){
    if(confirm("Bạn có chắn chắc muốn xóa sản phẩm '" + tensp + "' này không?")){
      this.productService.deleteProduct(id).subscribe(res => {
        if(res.text() === "Success"){
          alert('Xóa thành công!');
          for(var i=0; i<this.products.length; i++){
            if(this.products[i].id === id){
              this.products.splice(i, 1);
              break;
            }
          }
        }else{
          alert('Xóa thất bại!');
        }
      });
    }
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
  onSearch() {
    if (this.keysearch === '') {
      return false;
    }
    this.isSearch = true;
    let tmp = [];
    for (var i = 0; i < this.product_total.length; i++) {
      if (this.convertChar(this.product_total[i].tensp).match(this.convertChar(this.keysearch)) !== null) {
        tmp.push(this.product_total[i]);
      }
    }
    this.products = tmp;
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
  isEdit = false;
  update: any = [];
  file: File = null;
  ischangeImg = false;

  onFileSelect(event: File) {
    this.ischangeImg = true;
    this.file = event[0];
    if (this.file.size / (1024 * 1024) < 1) {
      var reader = new FileReader();
      reader.onload = (ev: any) => {
        this.update.avatar = ev.target.result;
      }
      reader.readAsDataURL(this.file);
    } else {
      alert('Vui lòng chọn những file ảnh có dung lượng nhỏ hơn 1MB!');
    }
  }
  changeStatus(value){
    this.update.tinhtrang = value;
  }
  updateProduct(){
    if(this.ischangeImg){
      const fd = new FormData();
      const namefile = this.file.name.split('.')[0] + this.details.id + "." + this.file.name.split('.')[1];
      fd.append('uploaded_file', this.file, namefile);
    
      this.productService.uploadImg(fd, this.details.id).subscribe(res =>{
        if(res.text() !== "fail" && res.text() !== null && res.text() !== ''){
          this.update.avatar = res.text();
          this.productService.updateProduct(this.update).subscribe(rs => {
            if(rs.text() === "success"){
              this.isEdit = false;
              this.details.tensp = this.update.tensp;
              this.details.gia = this.update.gia;
              this.details.avatar = this.update.avatar;
              this.details.mota = this.update.mota;
              this.details.tinhtrang = this.update.tinhtrang;
              this.details.uudai = this.update.uudai;
            }else{
              alert('Cập nhật thất bại!');
            }
          });
        }else{
          alert('Thất bại!');
        }
      });
    }else{
      this.productService.updateProduct(this.update).subscribe(rs => {
        if (rs.text() === "success") {
          this.isEdit = false;
          this.details.tensp = this.update.tensp;
          this.details.gia = this.update.gia;
          this.details.mota = this.update.mota;
          this.details.tinhtrang = this.update.tinhtrang;
          this.details.uudai = this.update.uudai;
        } else {
          alert('Cập nhật thất bại!');
        }
      });
    }
  }
  pageChange(){
    window.scrollTo(0);
  }
}
