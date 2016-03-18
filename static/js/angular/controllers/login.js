
var appHeader=angular.module('userLogin', [])

appHeader.controller('HEADctrl',function($scope){
console.log("Controller HEader");
$scope.ldata={};
$scope.rdata={};
$scope.login=false;
$scope.postldata=function(){
  console.log("Function Called");
  console.log($scope.ldata);
}
$scope.postrdata=function(){
  console.log("Function Called");
  console.log($scope.rdata);
  console.log($scope.password2);
  if($scope.rdata.password != $scope.password2){
    $scope.messagePASSWORD="Password Doesnt match";
    return 0;
  }
}
});

/*
app.controller('login',['$scope','$http', function($scope,$http){ 
$scope.loginD={};
$scope.signup={};
console.log($scope.signup);
console.log($scope.loginD);
$scope.post_login_data=function(){
  console.log($scope.loginD);
  $http.post("url")
  .success(function(data){
    console.log(data);
  })
  .error(function(data){
    console.log(data);
  });
  $scope.loginD={};
};
$scope.post_signup_data=function(){
  console.log($scope.signup);
  $http.post("url")
  .success(function(data){
    console.log(data);
  })
  .error(function(data){
    console.log(data);
  });
  $scope.signup={};
};

}]);
