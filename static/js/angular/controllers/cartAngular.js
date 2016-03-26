var app4=angular.module('CartHandler',[]);

app4.controller('cartItems',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
$scope.message=false;
$scope.Products=[];
var storedData = localStorage.getItem("product");

if(JSON.parse(storedData)){
  $scope.CartProducts = JSON.parse(storedData);
  for(var i in $scope.CartProducts){
    console.log($scope.CartProducts[i]);
    $scope.Products.push($scope.CartProducts[i]);  
  }

  console.log($scope.Products);
  if($scope.CartProducts.length!=0){
    $scope.message=true;
  }  
}


$scope.removeFromcart=function(id,index){
console.log($rootScope.COUNTcartItems);
$rootScope.COUNTcartItems=$rootScope.COUNTcartItems-1;
var storedData = localStorage.getItem("product");
console.log(JSON.parse(storedData));
$scope.CartProducts = JSON.parse(storedData);
$scope.CartProducts.splice(index,1);
localStorage.setItem("product",  JSON.stringify($scope.CartProducts));
$scope.Products.splice(index,1);
console.log($scope.Products.length);
if($scope.Products.length==0){
  $scope.message=false;
}
$scope.COUNTcartItems=$scope.COUNTcartItems-1;
console.log($scope.COUNTcartItems);

};
$scope.addQuantity=function(id,index){
  $scope.Products[index][5]=id+1;
  localStorage.setItem("product",  JSON.stringify($scope.Products));  
}
$scope.subQuantity=function(id,index){
  $scope.Products[index][5]=id-1;
  localStorage.setItem("product",  JSON.stringify($scope.Products));  
 }
}]);
