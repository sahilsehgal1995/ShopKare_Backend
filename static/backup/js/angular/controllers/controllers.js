angular.module('Shopkare.controllers',['angularBootstrapNavTree', 'Data.factory'])

.controller('indexController', function($scope){
	console.log("index");
})

.controller('headerController',['$scope','$http', '$state', 'UserFactory', 'AuthFactory', function($scope, $http, $state, UserFactory, AuthFactory){
  console.log('header');
  $scope.Login = function()
  {
    $scope.messageLogin = '';
    console.log(JSON.stringify($scope.user));
    $scope.user['Mobile']= '';
    UserFactory.login(JSON.stringify($scope.user))
    .success(function(resp){
      $scope.messageLogin =  resp; 
      if (resp=='Login Success')
       {
 	 $state.go('grocery.home.CategoryProducts');
       }
       else{
	 $scope.messageLogin =  resp;
       }
    })
     .error(function(error){
       console.log(JSON.stringify(error));
       $scope.messageLogin =  'Unable to Login. Try again later';
    });
  };
  $scope.signup = function()
  {
    $scope.messageLogin = '';
    UserFactory.register(JSON.stringify($scope.rdata))
    .success(function(resp){
      $scope.messageLogin = resp;
      if (resp == 'Registration Successfull')
      {
	AuthFactory.setUser($scope.rdata.Name);
	AuthFactory.setEmail($scope.rdata.Email);
	location.reload();
      }
    })
    .error(function(err){
      $scope.messageLogin = err;
    })
  };
  $scope.searchProduct = function()
  {
    $state.go('grocery.home.search', {query:$scope.query});
  };
}])

.controller('footerController',['$scope','$http',function($scope,$http){
	console.log('footer');
}])



.controller('homeController', function($scope){
	console.log("home");
})

.controller('productsMainController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	console.log('products');
	
}])

.controller('sidebarController', function($scope,$location, $state, Categories){
	console.log("sidebar");

	$scope.path = $location.path().slice(1);
	$scope.allCategories = Categories.getCategories();
	$scope.showCategoryProducts = function(mainCategory,subCategory)
	{
	  console.log(mainCategory);
	  console.log(subCategory);
	  $state.go('grocery.home.CategoryProducts',{
	    level1Category : 'Grocery',
	    mainCategory : mainCategory,
	    subcategory : subCategory
	  });
	};
	$scope.Categories =['Baby Products', 'Food'];
	$scope.categories = {
		'grocery' : [ {label : "Baby Products", children :[ "Baby Food", "Baby Hygiene", "Baby Care" ] ,
											onSelect: function(branch){
												console.log(branch);
											}
										},
							    {label :"Cereals and Spreads" , children : [ "Canned Food", "Jams and Honey", "Ready to Eat", "Cereals" ]},
							    {label :"Beverages and Drinks" , children : [ "Cold Drinks", "Tea and Coffee", "Health Drinks", "Other" ] },
							    {label :"Personal Care" , children : [ "Oral Care", "Hair Care", "Skin Care", "Hand and Body Wash", "Fragrances", "Feminine Needs", "Male Grooming" ]},
							    {label : "Biscuits and Snacks" , children : [ "Chips and Namkeen", "Cookies", "Bakery Products", "Other" ]},
							    {label :"Chocolates and Candy" , children : [ "Candy", "Chocolates" ]},
							    {label :"Cleaning and Hygiene" , children : [ "Laundry", "Cleaning", "Pet Care", "Pest Control", "Air Freshners" ]},
							    {label :"Staples" , children : [ "Pulses and Grains", "Masala and Spices" ]},
							    {label : "Pickles and Sauces" , children : [ "Pickles", "Sauces" ]},
							    {label :"Home Care" , children : [ "Pooja Items" ]}
					  		],
		'stationary' : [],
		'courier' : [],
		'home' : [{'label' : 'Grocery'}, {'label' : 'Stationary'}, {'label' : 'Medicine'}, {'label' : 'Courier'}]
	};

	$scope.cat = $scope.categories[$scope.path];
	// console.log($scope.cat);
	// console.log($scope.path);

})


.controller('cartController', function($scope, CartFactory){
  console.log("cart");
  $scope.items=[];
  $scope.totalammount=0;
  CartFactory.getCartItems()
  .success(function(response){
    if (response == 'Unable to get cart items'){
      $scope.message = false;
    }
    else if (Object.keys(response).length == 0)
    {
      $scope.message = false;
    }
    else{
     $scope.items=[];
     $scope.message=true;
     for (var i=0; i<Object.keys(response).length;i++)
     {
       response[i].totalPrice = response[i].Price * response[i].Quantity; 
       $scope.items.push(response[i]);
       console.log(response[i]);
        $scope.totalammount = $scope.totalammount + response[i].totalPrice;
     }
    }
  })
  .error(function(error){
    $scope.message = false;
  });
  $scope.RemoveItem = function(index)
  {
    CartFactory.removeCartItem($scope.items[index])
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.totalammount = $scope.totalammount - $scope.items[index].totalPrice;
	$scope.items.splice(index,1);
	$scope.items[index].message='';
      }
      else{
	$scope.items[index].message = response;
      }
    })
    .error(function(error){
      $scope.items[index].message = 'Unable to Remove. Try Again later';
    });
    
  };
  $scope.DecreaseQuantity = function(index)
  {
    if($scope.items[index].Quantity>0)
    {
      var product = $scope.items[index];
      product.Quantity = $scope.items[index].Quantity-1;
      CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart')
       {
	 $scope.items[index].totalPrice = $scope.items[index].totalPrice - $scope.items[index].Price;
	 $scope.totalammount = $scope.totalammount - $scope.items[index].Price;
// 	 $scope.items[index].Quantity = $scope.items[index].Quantity-1;
       }
       $scope.items[index].message = response;
    }).error(function(error){
      $scope.items[index].message = 'Unable to update. Please try after sometime';
      console.log(error);
    });
    }
    else{
      $scope.RemoveItem(index);
    }
  };
  $scope.IncreaseQuantity = function(index)
  {
    var product = $scope.items[index];
    product.Quantity = $scope.items[index].Quantity+1;
    CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart')
       {
	 $scope.items[index].totalPrice = $scope.items[index].totalPrice + $scope.items[index].Price;
	 $scope.totalammount = $scope.totalammount + $scope.items[index].Price;
	 console.log($scope.items[index].Quantity);
// 	 $scope.items[index].Quantity = $scope.items[index].Quantity + 1;
       }
       $scope.items[index].message = response;
    }).error(function(error){
      $scope.items[index].message = 'Unable to update. Please try after sometime';
      console.log(error);
    });
  };
  $scope.ChangeQuantity = function(index)
  {
    var product = $scope.items[index];
    product.Quantity = $scope.items[index].Quantity;
    CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart')
       {
	 $scope.items[index].totalPrice = $scope.items[index].totalPrice + $scope.items[index].Price;
	 $scope.totalammount = $scope.totalammount + $scope.items[index].Price;
// 	 $scope.items[index].Quantity = $scope.items[index].Quantity + 1;
       }
       $scope.items[index].message = response;
    }).error(function(error){
      $scope.items[index].message = 'Unable to update. Please try after sometime';
      console.log(error);
    });
  }
  $scope.confirmOrder = false;
  $scope.ConfirmOrder = function()
  {
    $scope.confirmOrder = !$scope.confirmOrder;
  };
})

.controller('contactController', function($scope){
	console.log("contact");
})

.controller('groceryController', function($scope){
	console.log("grocery");
})

.controller('stationaryController', function($scope){
	console.log("stationary");
})

.controller('courierController', function($scope){
	console.log("courier");
})


.controller('medicineController', function($scope){
	console.log("medicine");
})


.controller('productsGroceryController',['$scope','$http','$rootScope', 'ProductFactory', 'CartFactory',function($scope,$http,$rootScope, ProductFactory, CartFactory){
  
  $scope.IncreaseTrendingQuantity = function(productindex, quantity)
  {
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity+1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity+1;
       }
       console.log(response,2000);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.DecreaseTrendingQuantity = function(productindex, quantity)
  {
    if($scope.trendingProducts[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity-1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity-1;
       }
       console.log(response);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
    }
    else if($scope.trendingProducts[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.trendingProducts[productindex].quantity=0;
      }
      console.log(response);
    })
    .error(function(error){
      console.log(error);
    }); 
    }
    
  };
  $scope.IncreaseNewQuantity = function(productindex, quantity)
  {
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity+1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity+1;
       }
       console.log(response);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.DecreaseNewQuantity = function(productindex, quantity)
  {
    if($scope.trendingProducts[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.trendingProducts[productindex].quantity-1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || response == 'Added to cart')
       {
	 $scope.trendingProducts[productindex].quantity = $scope.trendingProducts[productindex].quantity-1;
       }
       console.log(response);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
    }
    else if($scope.trendingProducts[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.trendingProducts[productindex].quantity=0;
      }
      console.log(response);
    })
    .error(function(error){
      console.log(error);
    }); 
    }
    
  };
  $scope.viewTrendingProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.trendingProducts[index])
    });
  };
  $scope.viewNewReleaseProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.newProducts[index])
    });
  };  
  $scope.AddToNewReleasesCart = function(productindex, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
      var product={
        ProductID: $scope.newProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.newProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.newProducts[productindex].product_name,
	'Main Category': $scope.newProducts[productindex]['Main Category'],
	'Sub Category': $scope.newProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.newProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       console.log(response);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.AddToTrendingCart = function(productindex, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
      var product={
        ProductID: $scope.trendingProducts[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.trendingProducts[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.trendingProducts[productindex].product_name,
	'Main Category': $scope.trendingProducts[productindex]['Main Category'],
	'Sub Category': $scope.trendingProducts[productindex]['Sub Category'],
	'Level1 Category': $scope.trendingProducts[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       console.log(response);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  ProductFactory.getRandomProducts('Grocery')
  .success(function(resp){
    if (Object.keys(resp).length == 0 )
    {
      console.log('Sorry no new products are available');
    }
    else{
      $scope.newProducts=resp;
    }
  })
  .error(function(error){
    console.log(error);
    console.log('Unable to Fetch Products. Try again later');
  });
  console.log('grocery products');
  
  ProductFactory.getRandomProducts('Grocery')
  .success(function(data, status, headers, config){
    console.log(JSON.stringify(data));
    console.log(status);
    console.log(headers);
    console.log(config);
    if (Object.keys(data).length == 0 )
    {
      console.log('Sorry no Trending products are available');
    }
    else{
      $scope.trendingProducts=[];
      for (var i=0; i< Object.keys(data).length; i++)
      {
	console.log(JSON.stringify(data[i]));
	$scope.trendingProducts.push(data[i]);
      }
    }
  })
  .error(function(error){
    console.log(error);
    console.log('Unable to Fetch Products. Try again later');
  });
	
}])

.controller('CategoryProductsController',['$scope','$http','$rootScope', '$stateParams', 'ProductFactory', 'CartFactory', function($scope,$http,$rootScope, $stateParams, ProductFactory, CartFactory){
  console.log('CategoryProductsControllerproducts');
  $scope.mainCategory = $stateParams.mainCategory;
  $scope.subcategory = $stateParams.subcategory; 
  $scope.AddQuantity = function(productindex, quantity)
  {
    var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.products[productindex].quantity+1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || 'Added to cart')
       {
	 $scope.products[productindex].quantity = $scope.products[productindex].quantity+1;
       }
       $scope.products[productindex].message = response;
    }).error(function(error){
      $scope.products[productindex].message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.RemoveQuantity = function(productindex, quantity)
  {
    if($scope.products[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.products[productindex].quantity-1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || 'Added to cart')
       {
	 $scope.products[productindex].quantity = $scope.products[productindex].quantity-1;
       }
       $scope.products[productindex].message = response;
    }).error(function(error){
      $scope.products[productindex].message = 'Unable to add. Please try after sometime' ;
      console.log(error);
    });
    }
    else if($scope.products[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.products[productindex].quantity=0;
      }
      $scope.products[productindex].message = response;
    })
    .error(function(error){
      console.log(error);
      $scope.products[productindex].message = 'Unable to add';
    }); 
    }
  };
  $scope.AddToTrendingCart = function(productindex, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       $scope.products[productindex].message = response;
    }).error(function(error){
      $scope.products[productindex].message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.viewProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.products[index])
    });
  };
  $scope.quantity='';
  $scope.products=[];
  ProductFactory.getProducts($stateParams.level1Category, $stateParams.mainCategory, $stateParams.subcategory)
   .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      console.log('Sorry Unable to fetch Products right now.');
    }
    else{
      $scope.products=[];
      for (var i=0; i< Object.keys(reply).length; i++)
	{
	  console.log(JSON.stringify(reply[i]));
	  $scope.products.push(reply[i]);
	  $scope.products[i].quantity=0;
	}
    }
  })
	
}])

.controller('searchController',['$scope','$http','$rootScope', '$stateParams' , 'ProductFactory', 'CartFactory',function($scope,$http,$rootScope, $stateParams, ProductFactory, CartFactory){
	console.log($stateParams.query);
  $scope.AddQuantity = function(productindex, quantity)
  {
    var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.products[productindex].quantity+1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || 'Added to cart')
       {
	 $scope.products[productindex].quantity = $scope.products[productindex].quantity+1;
       }
       $scope.products[productindex].message = response;
    }).error(function(error){
      $scope.products[productindex].message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.RemoveQuantity = function(productindex, quantity)
  {
    if($scope.products[productindex].quantity){
      var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:$scope.products[productindex].quantity-1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       if (response == 'Updated in cart' || 'Added to cart')
       {
	 $scope.products[productindex].quantity = $scope.products[productindex].quantity-1;
       }
       $scope.products[productindex].message = response;
    }).error(function(error){
      $scope.products[productindex].message = 'Unable to add. Please try after sometime' ;
      console.log(error);
    });
    }
    else if($scope.products[productindex].quantity==0)
    {
     var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:0,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
      CartFactory.removeCartItem(product)
    .success(function(response){
      if (response == 'Removed from cart')
      {
	$scope.products[productindex].quantity=0;
      }
      $scope.products[productindex].message = response;
    })
    .error(function(error){
      console.log(error);
      $scope.products[productindex].message = 'Unable to add';
    }); 
    }
  };
  $scope.AddToTrendingCart = function(productindex, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
      var product={
        ProductID: $scope.products[productindex]._id,
	QuantityType: quantity[0],
	QuantityIndex: $scope.products[productindex].Quantity[cityIndex].Quantities.indexOf(quantity),
	Price: quantity[1],
	Quantity:1,
	product_name: $scope.products[productindex].product_name,
	'Main Category': $scope.products[productindex]['Main Category'],
	'Sub Category': $scope.products[productindex]['Sub Category'],
	'Level1 Category': $scope.products[productindex]['Level1 Category']
     };
     CartFactory.addToCart(product)
     .success(function(response){
       $scope.products[productindex].message = response;
    }).error(function(error){
      $scope.products[productindex].message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.viewProduct = function(index){
    $state.go('app.product',{
      product:JSON.stringify($scope.products[index])
    });
  };
  $scope.quantity='';
  $scope.products=[];
  ProductFactory.searchProduct('Grocery', $stateParams.query)
   .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      $scope.message = 'Sorry Unable to fetch Products right now.';
    }
    else if(Object.keys(reply).length == 0)
    {
      $scope.message = 'No Results found. Try something else';
    }
    else{
      $scope.products=[];
      for (var i=0; i< Object.keys(reply).length; i++)
	{
	  $scope.products.push(reply[i]);
	  $scope.products[i].quantity=0;
	}
    }
  })
  .error(function(error){
    $scope.message ='Unable to Search Results';
  });
}])

.controller('productsStationaryController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	console.log('stationary products');
	
}])

.controller('productsCourierController',['$scope','$http','$rootScope',function($scope,$http,$rootScope){
	console.log('courier products');
	
}])

;


