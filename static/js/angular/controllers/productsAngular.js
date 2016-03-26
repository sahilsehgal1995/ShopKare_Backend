var app9=angular.module('ProductsHandler',[]);

var base="http://shopkare.com";
app9.controller('HOT_DEALS',['$scope','$http',function($scope,$http){

}]);






app9.controller('productBycategory',['$scope','$http', function($scope,$http){ 

$http.get(base+'/api/Product/getRandomProducts/?level1category=Grocery')
.success(function(data){
	$scope.McategoryPoducts=data;
	$scope.NEW_Products=data;
	console.log(data);
})
.error(function(response){
	console.log(response);
});


$scope.getProducts=function(id){
  console.log(id);
 $http.get(base+"/api/Product/getRandomMainCategoryProducts/?level1category=Grocery&mainCategory="+id)
  .success(function(data){
  	console.log(data);
    $scope.products=data;
    })
  .error(function(response){
    console.log(response);
  });
};

}]);

