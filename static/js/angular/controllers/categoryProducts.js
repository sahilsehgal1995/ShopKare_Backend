var app=angular.module('Shopkare', [])

app.controller('productBycategory',['$scope','$http', function($scope,$http){ 
  $scope.RES="Beverages";
$scope.getProducts=function(id){
  $scope.RES=id;
  console.log($scope.RES);
 /* $http.post("url?category="+$scope.tab)
  .success(function(data){
    $scope.products=data;
    console.log("Data Available");
  })
  .error(function(response){
    console.log(response);
  });*/
};

console.log('featuredProducts');
  /*$http.get("url")
  .success(function(data){
    $scope.products=data;
    console.log($scope.products);
  })
  .error(function(response){
    console.log(response);
  }); */

   console.log('recommended');
  /*$http.get("url")
  .success(function(data){
    $scope.products=data;
    console.log($scope.products);
  })
  .error(function(response){
    console.log(response);
  }); */


  console.log('leftmenu');
  /*$http.get("url")
  .success(function(data){
    $scope.products=data;
    console.log($scope.products);
  })
  .error(function(response){
    console.log(response);
  }); */

}]);



