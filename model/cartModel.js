module.exports=function Cart(oldcart){
    this.item=oldcart.item|| 0;
    this.totyalQty=oldcart.totyalQty|| 0;
    this.totaPrice=oldcart.totaPrice|| 0;
 this.add =function(item,_id){
    var storedItem=this.item[_id];
    if(!storedItem){
        storedItem=this.item[_id]={item:item,qty:0,price:0}

    }
    storedItem.qty++;
    storedItem.price = storedItem.item.price * storedItem.qty; // Corrected calculation
  this.totyalQty++;
  this.totaPrice += storedItem.item.price; 
   

 }
 this.generateArray=function(){
    var arr=[];
    for(var _id in this.item){
        arr.push(this.item[_id])
    }
    return arr;
 }
}