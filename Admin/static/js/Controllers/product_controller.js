(function() {

  var app = angular.module('ShopKare_Backend-master', []);
//   var base = 'http://127.0.0.1:5000';
  var base = 'http://shopkare.com';
  
  var categories = [];
  var level1keys= [];
   app.controller('AppCTRL',['$scope','$http', '$window',function($scope, $http, $window){
	  console.log('App control');
     $http.post(base+'/api/Admin/reteriveCategories/')
 	.success(function(data){
 	  categories = data;
	  console.log()
	  level1keys = Object.keys(data)
	  for (key in level1keys)
	  {
	    level1keys[key] = data[key]._id;
	    console.log(data[key]._id);
	  }
	  
	  $scope.categories = categories;
	  console.log(data);
 	})
 	.error(function(err){
 	  console.log(err);
 	});
	$scope.mainCategories = [];
	$scope.MAINCATEGORY="";
	$scope.subcategories=[];
	$scope.SUBCATEGORY="";
    $scope.selectLevel1Category = function()
    {
      $scope.mainCategories=[];
      var a = JSON.parse($scope.l1category);
      $scope.MainCategories = a.Categories; 
//       console.log(a.Categories);
      $scope.level1keys = Object.keys(a.Categories);
      
// 	console.log(Object.keys(a.Categories[]));
	for (key in $scope.level1keys)
	{
	  $scope.mainCategories.push(Object.keys(a.Categories[key])[0]);
	}
	//console.log($scope.mainCategories);
    };
    
    $scope.selectmainCategory = function(){
     
      $scope.subcategories = JSON.parse($scope.l1category).Categories[$scope.mainCategory];
      $scope.MAINCATEGORY=$scope.mainCategories[$scope.mainCategory];
      console.log($scope.MAINCATEGORY);
      var mainCategory = $scope.mainCategories[$scope.mainCategory]; 
	console.log($scope.subcategories[mainCategory]);
      $scope.subcategories = $scope.subcategories[mainCategory];
//       console.log(Object.keys(a.Categories[key])[0]); 
    };
    $scope.selectsubcategories=function(){
      $scope.SUBCATEGORY=$scope.subcategories[$scope.subcategoryindex];
      $scope.getProducts();
      console.log($scope.SUBCATEGORY);
      
      
    };
    $scope.getproducts = function()
    {
      var id = level1keys.indexOf(JSON.parse($scope.l1category)._id).toString() + $scope.mainCategory.toString() + $scope.subcategoryindex.toString();
      console.log(id);
    };
    
    $scope.RemoveBatch = function(index)
    {
      console.log($scope.Batches[index]['_id']);
      $http.post(base + '/api/Admin/removeBatch/?pid='+$scope.p_id+'&bid='+$scope.Batches[index]['_id'])
      .success(function(response){
	alert(response);
	$window.location.href = base + "/Admin/static/batches.html";
      })
      .error(function(error){
	$scope.removeReply = 'Unable to Remove Try again later';
	console.log(error);
      });
    };
    
   $scope.getProducts=function(){
     $http.post("/api/admin/getProducts/?maincategory="+$scope.MAINCATEGORY+"&subcategory="+$scope.SUBCATEGORY)
     .success(function(response) {
       $scope.reply=response;
       $scope.products=response;
       console.log($scope.reply);
       //$window.location.href=base+"/Admin/static/products.html";
     })
     .error(function(error){
       $scope.error=error;
    });
   };
   
   
   $scope.delete_Product=function(index){
    console.log(JSON.stringify($scope.products[index]));
    $http.post("/api/Admin/removeProduct/?product="+JSON.stringify($scope.products[index]))
    .success(function(response){
      console.log(response);
    })
    .error(function(response){
      console.log(response);
    });
  };  
  
  
     $scope.selectproducts=function(){
       $scope.product=$scope.products[$scope.productindex];
       console.log($scope.product);
       $scope.quantity=$scope.products[$scope.productindex].Quantity;
       console.log($scope.quantity);
       
        var x=$scope.productindex;
   console.log(x);
   $scope.p_id=$scope.products[x]._id;  
    console.log($scope.p_id);
   
     };
  
  //Batch fuctions
   $scope.post_batch_data=function(){
     $http.post(base+"/api/Admin/addatch/?pid="+$scope.p_id+"&Batch="+JSON.stringify($scope.Batch_data))
     .success(function(data){
       $scope.BatchReply = data;
    })
     .error(function(data){
       console.log(data);
    });
     
    };
  
 
    
    $scope.getBatches=function(){
	  $http.post(base+"/api/Admin/reteriveBatches/?pid="+$scope.p_id)
	  .success(function(data){
	    console.log(data);
	    $scope.Batches=data;
	  })
	  .error(function(data){
	    console.log(data);
	  });
	
      };
   
  
   }]);
   
   



})();







 