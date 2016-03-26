var app2=angular.module('HeaderOperation',['FactoryHandler']);

app2.controller('HEADctrl',['$scope','$state','$http','$window','cartService','$rootScope',function($scope,$state,$http,$window,cartService,$rootScope){

$scope.ldata={};
$scope.rdata={};
$scope.messageLogin="";
//   var base = 'http://127.0.0.1:5000';

var base = 'http://shopkare.com';
$scope.login=false;
$scope.ProdtmessageError=true;
$scope.CartProductsCheck=true;

$rootScope.COUNTcartItems=0;
$rootScope.COUNTcartItems=cartService.cartQuantity();

var userData = localStorage.getItem("SHOPKAREuser");
if (JSON.parse(userData)){
  y= JSON.parse(userData);
  $scope.login=true;
}

// Retrieve Categories

$scope.level1Categories=[];
var categories = [];
var level1keys= [];
$scope.level2CategoriesWTF=[];
$scope.level2Categories=[];
$scope.level3Categories=[];   
  
    

  $http.post(base+'/api/Admin/reteriveCategories/')
    .success(function(data){
              categories = data;
              level1keys = Object.keys(data)
              for (key in level1keys)
              {
                level1keys[key] = data[key]._id;
                if(data[key]._id=='Grocery'){
                   $scope.level1Categories.push(data[key]._id); 
                   var obj=data[key].Categories;
                  for(x in obj){
                       result = Object.keys(obj[x]); 
                       var z=obj[x];
                       for(var t in z){
                           $scope.level3Categories.push(z[t]);
                       }
                       $scope.level2Categories.push(result[0]);
                  }         
                }
              }
              for (var z in $scope.level2Categories){
                $scope.level2CategoriesWTF.push(($scope.level2Categories[z].replace(/\s/g,'')));
              }
             $scope.categories = categories;
      })
  .error(function(err){
      console.log(err);
  });



    


      $scope.searchOperation=function(){
        console.log($scope.searchKey);
	$http.post(base+'Url?pid='+$scope.searchKey)
	.success(function(data){
		console.log(data);
	})
	.error(function(response){
	console.log(response);
	});

 }







        $scope.postldata=function(){
       
        $scope.ldata['Mobile']="";
        console.log(JSON.stringify($scope.ldata));
        $http.post(base+'/api/Customer/login/?user='+JSON.stringify($scope.ldata))
        .success(function(response){
          console.log(response);
          console.log($scope.ldata);
          $scope.messageLogin=response; 
          if(response=='Login Success'){
            $scope.login=true;
            localStorage.setItem("SHOPKAREuser",  JSON.stringify($scope.ldata));
            if(localStorage.setItem("SHOPKAREuser",  JSON.stringify($scope.ldata))){
            $window.location.href = 'home.html';
          return true;
          }         
        }
        })
        .error(function(response){
          console.log(response);
        });
      };



      $scope.postrdata=function(){
        $scope.messageSignUP="";
         $scope.messagePASSWORD="";
        if($scope.rdata.Password != $scope.password2){
          $scope.messagePASSWORD="Password Doesnt match..!! Try Again";
          return false;
        }
        $http.post(base+'/api/Customer/signup/?user='+JSON.stringify($scope.rdata))
        .success(function(response){
          console.log(response);
          $scope.messageSignUP=response;
          $scope.login=true;
        })
        .error(function(response){
          console.log(response);
        });
      };



      $scope.logOUT=function(){
        $http.get(base+'/api/Customer/logout')
        .success(function(response){
          console.log(response);
          $scope.messageLOGOUT=response;
          localStorage.removeItem("SHOPKAREuser");
          alert(response);
          $scope.login=false;
          $scope.ldata={};
          $scope.rdata={};
          $scope.messageLogin="";
          $scope.messageSignUP="";
            
         })
        .error(function(response){
          console.log(response);
        });

      };





        $scope.GETProducts=function(c1,c2){
          var category1=c1;
          var category2=c2;
          $scope.products=[];
          
         var storedData = localStorage.getItem("product");
              if (JSON.parse(storedData)){
                  storedData= JSON.parse(storedData);
                  if(storedData.length>0){
                    $scope.CartProductsCheck=false;  
                  } 
              }

        $http.get("http://shopkare.com/api/Product/getCategoryProducts/?level1Category=Grocery&MainCategory="+category1+"&SubCategory="+category2)
        .success(function(response){
          $scope.Pindex=0;  
          $scope.prodt=response;
          if(response.length>0){

            for(var i in $scope.prodt){
              $scope.prodt[i]['Qwt']=[];
              $scope.prodt[i]['Qrs']=[];
              $scope.prodt[i]['cart']=[];
              $scope.prodt[i]['Availablity']=[];
              $scope.prodt[i]['orgPrice']=[];
              $scope.prodt[i]['discount']=[];
              var QArray=JSON.parse(JSON.stringify($scope.prodt[i].Quantity[0].Quantities));

              for(var z in QArray) {
                $scope.prodt[i]['Qwt'].push(QArray[z].Quantity[0]);
                $scope.prodt[i]['Qrs'].push(QArray[z].Quantity[1]);
                $scope.prodt[i]['Availablity'].push(QArray[z].Quantity[4]);
                $scope.prodt[i]['orgPrice'].push(QArray[z].Quantity[2]);
                $scope.prodt[i]['discount'].push(QArray[z].Quantity[3]);
                $scope.prodt[i]['cart'].push("Add to Cart"); 
              }
            $scope.products.push($scope.prodt[i]);  
          }
          if(storedData){
          if(storedData.length>0){
          for(var z in storedData){
                for(var i in $scope.products){
                     if($scope.products[i].product_name==storedData[z][1]){
                               for(var x in $scope.products[i].Qwt){
                                   if($scope.products[i].Qwt[x]==storedData[z][2]){
                                      $scope.products[i]['cart'][x]="Already in Cart";
                                   }
                                   
                               }
                        }
                     }
                  }
               }
              }
               $scope.ProdtmessageError=false;
          }

          else{
            $scope.ProdtmessageError=true;
          }
          
          if($scope.products.length>0){
              $scope.NO_PAGES=[];
              var x=$scope.products.length/18;
              if(x % 1 != 0){
                x=parseInt(x);
                x++;
                  console.log(x); 
                for(var z=0; z<x; z++){
                 $scope.NO_PAGES.push(z);   
                }
              }
            }
       
        })
        .error(function(response){
          console.log(response);
        });
      };



 $scope.pdetail=function(id){
        console.log(id);
        $state.go('main.pdetails',{pID:JSON.stringify(id)});
      }



        $scope.setIndexp=function(id){

            console.log(id);
            $scope.Pindex=id*18;
            console.log($scope.Productsindex);
        }

$scope.addCart=function(id,k){        
        var z=[ id.images , id.product_name , id.Qwt[k] , id.Qrs[k], id.description,1 ]; 
        var p=cartService.addProduct(z);
        for(var i in $scope.products){
            if (id.product_name == $scope.products[i].product_name) {
            $scope.products[i].cart[k]="Added in Your Cart";
          }
        }
       // var Quantities=id.Quantity[0].Quantities;
       // var selectedQunatity=id.Quantity[0].Quantities[k];
       // var productindex=Quantities.indexOf(selectedQunatity);
       // console.log(productindex);
        
        
        $rootScope.COUNTcartItems=$rootScope.COUNTcartItems+1;
        };


}]);
