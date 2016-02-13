(function() {
  var app = angular.module('ShopKare_Backend-master', []);

//   var base = 'http://127.0.0.1:5000';
  var base = 'http://shopkare.com';
  var categories = [];
  var level1keys= [];

  app.controller('addlevel1category',function($scope,$http){
      $scope.level1category="";
      $scope.addlevel1category=function(){
        $http.post(base+"/api/Admin/addlevel1category/?level1category="+$scope.level1category)
        .then(function(response){
            $scope.message=response.data;
            $scope.level1category="";
        })
        .error(function(error){
        console.log(error);
      });
      };
      $scope.mainCategories = [];
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
	console.log($scope.mainCategories);
    };
    
    $scope.selectmainCategory = function(){
      
      $scope.subcategories = JSON.parse($scope.l1category).Categories[$scope.mainCategory];
      var mainCategory = $scope.mainCategories[$scope.mainCategory]; 
      console.log($scope.subcategories[mainCategory]);
      $scope.subcategories = $scope.subcategories[mainCategory];
//       console.log(Object.keys(a.Categories[key])[0]);
    };
    });



    app.controller('addmaincategory',function($scope,$http){
      $scope.level1category="";
      $scope.Maincategory="";
      
      $http.post(base+'/api/Admin/reteriveCategories/')
 	.success(function(data){
 	  categories = data;
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
      $scope.add_new_category_database=function(){
        console.log(JSON.parse($scope.l1category)._id);
      $http.post(base + "/api/Admin/addMainCategory/?level1category=" + JSON.parse($scope.l1category)._id + "&MainCategory=" + JSON.stringify($scope.Maincategory))
        .success(function(response){
            $scope.message=response;
          $scope.level1category="";
          $scope.Maincategory="";
         })
          .error(function(error){
        console.log(error);
      });
      };
      $scope.mainCategories = [];
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
	console.log($scope.mainCategories);
    };
    
    $scope.selectmainCategory = function(){
      
      $scope.subcategories = JSON.parse($scope.l1category).Categories[$scope.mainCategory];
      var mainCategory = $scope.mainCategories[$scope.mainCategory]; 
      console.log($scope.subcategories[mainCategory]);
      $scope.subcategories = $scope.subcategories[mainCategory];
//       console.log(Object.keys(a.Categories[key])[0]);
    };
    });



      app.controller('addsubcategory',function($scope,$http){
      $scope.level1category="";
      $scope.Maincategory="";
      $scope.subCategory="";
      $http.post(base+'/api/Admin/reteriveCategories/')
 	.success(function(data){
 	  categories = data;
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
      $scope.add_new_subCategory=function(){
	$http.post(base+"/api/Admin/addSubCategory/?level1category=" + JSON.parse($scope.l1category)._id + "&MainCategory=" + $scope.mainCategories[$scope.mainCategory] + "&subCategory=" + JSON.stringify($scope.subCategory))
        .success(function(response){
            $scope.response1=response;
          $scope.level1category="";
          $scope.Maincategory="";
        })
          .error(function(error){
        console.log(error);
      });
      };
      $scope.mainCategories = [];
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
	console.log($scope.mainCategories);
    };
    
    $scope.selectmainCategory = function(){
      
      $scope.subcategories = JSON.parse($scope.l1category).Categories[$scope.mainCategory];
      var mainCategory = $scope.mainCategories[$scope.mainCategory]; 
      console.log($scope.subcategories[mainCategory]);
      $scope.subcategories = $scope.subcategories[mainCategory];
//       console.log(Object.keys(a.Categories[key])[0]);
    };
    });
 

    


})();