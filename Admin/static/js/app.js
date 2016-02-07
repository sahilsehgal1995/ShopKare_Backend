var app = angular.module('Authentication', []);
 

// Controller to login the user
app.controller('LogInController', function($scope, $http) {


    //Variables

    this.name = "Angular is working fine";


    $scope.signUpInfo = {
        Name:undefined,
        Password: undefined,
        Mobile: undefined,
        Email: undefined,
        secretkey: undefined
    }
    
    $scope.loginInfo = {
        Email: undefined,
        Password: undefined
    }
    
    var result = {
        test: undefined
    }
    
    result.test = {
        test: "test",
        test2: "test2",
        test3: "testers"
    }
    
    result.test = JSON.stringify(result.test);
    
    //Functions


    //JUST TESTING
    // $scope.hello = function() {
    //     console.log("Hello World");
    // }
    
    $scope.signUserUp = function (){


        // var data = {
        //     Email: $scope.signUpInfo.Email,
        //     Password: $scope.signUpInfo.Password
        // }

        var data = {
            Name: $scope.SignUpInfo.Name,
            Password: $scope.SignUpInfo.Password,
            Mobile: $scope.SignUpInfo.Mobile,
            Email: $scope.SignUpInfo.Email,
            secretkey: $scope.SignUpInfo.secretkey
        }
        
        $http.post("../../api/Admin/signup/", data).success(function(response){
            console.log(response);
            // localStorage.setItem("token", JSON.stringify(response));
            // $state.go("application");
        }).error(function(error){
            console.error(error);
        });
    };
    
    $scope.loginUser = function () {
         var data = {
            Email: $scope.loginInfo.Email,
            Password: $scope.loginInfo.Password
        }
        


        $http.post("../../api/Admin/login/", data).success(function(response){
            console.log(response);
            // localStorage.setItem("token", JSON.stringify(response));
            // $state.go("application", result);
        }).error(function(error){
            console.error(error);
        });
    
    }

});