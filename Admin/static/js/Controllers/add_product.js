(function() {
  var app = angular.module('ShopKare_Backend-master', []);
//   var base = 'http://127.0.0.1:5000';
  var base = 'http://shopkare.com';

  var categories = [];
  var level1keys= [];
  var ProductQuantityArray= {};
    app.controller('add_new_product',['$scope', '$http',function($scope,$http){
      console.log("CONtroller Working");
     
      /*$http.post("GETSESSIONCITY")
      .success(function(response){
        $scope.city=response;
      })
      .error(function(response){
        console.log("response");
      });
*/  
      $scope.city="Hyderabad";
      $scope.Product={};
      $scope.index1=0;
      $scope.quantities=[{"Quantity":["",""]}];
      console.log($scope.city);
      $http.get(base+"/api/Admin/addProduct?user="+JSON.stringify($scope.Product))
       .then(function(response){
        $scope.main_level_products=response['data'];
       });

       $scope.button_function=function(){
        console.log("Function Called Successfully");
        $scope.index1=$scope.index1+1;
	$scope.dataa={"Quantity": [" "," "]};
        $scope.quantities.push($scope.dataa);
       };

	$scope.getFileDetails = function (e) {

            $scope.files = [];
            $scope.$apply(function () {

                // STORE THE FILE OBJECT IN AN ARRAY.
                for (var i = 0; i < e.files.length; i++) {
                    $scope.files.push(e.files[i])
                }

            });
        };
       		// NOW UPLOAD THE FILES.
        $scope.uploadFiles = function () {

            //FILL FormData WITH FILE DETAILS.
	    console.log("Sumitted");
            var data = new FormData();
            console.log($scope.files);
            for (var i in $scope.files) {
                data.append("uploadedFile", $scope.files[i]);
            }

            // ADD LISTENERS.
            var objXhr = new XMLHttpRequest();
            objXhr.addEventListener("progress", updateProgress, false);
            objXhr.addEventListener("load", transferComplete, false);
	    
	  //add Product details in Product
	    $scope.addProduct();

            // SEND FILE DETAILS TO THE API.
            objXhr.open("POST", base+"/api/Admin/addProduct/?product=JSON.stringify($scope.Product)");
            objXhr.send(data);
        }

        // UPDATE PROGRESS BAR.
        function updateProgress(e) {
            if (e.lengthComputable) {
                document.getElementById('pro').setAttribute('value', e.loaded);
                document.getElementById('pro').setAttribute('max', e.total);
            }
        }

        // CONFIRMATION.
        function transferComplete(e) {
            alert("Files uploaded successfully."+ e);
        }
               
     
      $scope.addProduct = function()
      { 
    
      ProductQuantityArray['City']=$scope.city; 
      ProductQuantityArray['Quantities']=$scope.quantities; 
	//console.log(getproducts());  
	$scope.Product['_id'] = getproducts();
	$scope.Product['Quantity']=ProductQuantityArray;
	$scope.Product['Level1 Category'] = JSON.parse($scope.l1category)._id;
	$scope.Product['Main Category'] = $scope.mainCategories[$scope.mainCategory];
	$scope.Product['Sub Category'] = $scope.subcategories[$scope.subcategoryindex];
	console.log(JSON.stringify($scope.Product));
	
	
	$http.post(base+'/api/Admin/addProduct/?product='+JSON.stringify($scope.Product))
	.success(function(response){
	  $scope.reply=response;
	  if (response == 'Registered')
	  {
  	    $scope.formproduct=JSON.stringify($scope.Product);
	    console.log(document.getElementById("myForm").action);
	    console.log($scope.formproduct);
 	    document.getElementById("myForm").action = document.getElementById("myForm").action +'?product='+$scope.formproduct;
	    console.log(document.getElementById("myForm").action)
   	    document.getElementById("myForm").submit();
	  }
	})
	.error(function(error){
	  console.log(error);
	})
	;
	
	
	
      };
       $scope.gettablenames=function(){
        console.log("function Called Successfully");
       	$http.post("php/getTablename.php",{"category1":$scope.level_2_category})
       	.then(function(response){
       		$scope.getTablenames=response['data'];
                  console.log("php page Called Successfully");
       	})

       };
       
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
    var getproducts = function()
    {
      var id = level1keys.indexOf(JSON.parse($scope.l1category)._id).toString() +'_'+ $scope.mainCategory.toString() + '_'+ $scope.subcategoryindex.toString();
      return id;
    };
   
    }]);
})();
