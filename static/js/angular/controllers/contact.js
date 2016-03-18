var app=angular.module('Shopkare', [])




app.controller('contactus',['$scope','$http', function($scope,$http){ 
$scope.contact={};
console.log($scope.contact);
$scope.post_data=function(){
  console.log($scope.contact);

  $http.post("url")
  .success(function(data){
    console.log(data);

  })
  .error(function(response){
    console.log(response);
  });
};

}]);


