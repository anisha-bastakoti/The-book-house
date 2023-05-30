
const products=[];
class product{

  constructor(price,productname,productdescription,author,expiredate,image){
    this.author=author;
    this.price=price;
    this.productdescription=productdescription;
    this.productname=productname;
    this.expiredate=expiredate;
    this.image=image;

  }
  save(){
    products.push(this);
  }
  static find(){
    return products;
  }
}
module.exports=product;