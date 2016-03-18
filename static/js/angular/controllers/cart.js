var app=angular.module('Shopkare', [])

app.controller('cartitems',['$scope','$http', function($scope,$http){ 
console.log("cart controller");
$scope.cartProducts={};
console.log($scope.cartProducts);
$scope.post_login_data=function(){
  $http.post("url")
  .success(function(data){
    console.log(data);
    $scope.cartProducts=data;
  })
  .error(function(data){
    console.log(data);
  });
 };

}]);
