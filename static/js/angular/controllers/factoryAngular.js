var factoryApp=angular.module('FactoryHandler',[]);

factoryApp.service('cartService', function() {
  var y=[]
  var storedData = localStorage.getItem("product");
  if (JSON.parse(storedData)){
          y= JSON.parse(storedData);
  }
  var addProduct = function(newObj) {
      y.push(newObj);
      localStorage.setItem("product",  JSON.stringify(y));
        if(localStorage.setItem("product",  JSON.stringify(y))){
          cartQuantity();
          return true; 
        }
      return true;
  };


  var cartQuantity = function() {
      var cartitems=y.length;
      console.log(y.length); 
      return cartitems;
  };




  return {
    addProduct: addProduct,
    cartQuantity:cartQuantity
  };
});

