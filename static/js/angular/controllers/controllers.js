angular.module('Shopkare.controllers',['angularBootstrapNavTree', 'Data.factory'])

.controller('indexController', function($scope, $state, UserFactory, AuthFactory, ProductFactory){
  console.log("index controller");
  $scope.showLogin=true;
  $scope.toggleshowLogin = function()
  {
    $scope.showLogin = !$scope.showLogin;
    $scope.messageSignup = '';
    $scope.messageLogin = '';
  };
  $scope.Login = function()
  {
    $scope.messageLogin = '';
    console.log(JSON.stringify($scope.user));
    UserFactory.login(JSON.stringify($scope.user))
    .success(function(resp){
      $scope.messageLogin =  resp; 
      if (resp=='Login Success')
      {
        location.reload();
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
    $scope.messageSignup = '';
    UserFactory.register(JSON.stringify($scope.rdata))
    .success(function(resp){
      $scope.messageSignup = resp;
      console.log(resp);
      if (resp == 'Registration Successfull')
      {
        AuthFactory.setUser($scope.rdata.Name);
        AuthFactory.setEmail($scope.rdata.Email);
        location.reload();
      }
    })
    .error(function(err){
      $scope.messageSignup = 'Unable to Login Please try after sometime';
    })
  };

  $scope.viewProduct = function(product){
    $state.go('grocery.home.Product',{
      product: JSON.stringify(product)
    });
  };
  ProductFactory.getRandomProducts('Grocery')
  .success(function(resp){
    if (Object.keys(resp).length == 0 )
    {
      console.log('Sorry no new products are available');
    }
    else{
      $scope.trendingProducts=resp;
    }
  })
  .error(function(error){
    console.log(error);
    console.log('Unable to Fetch Products. Try again later');
  });
})

.controller('headerController',['$scope','$http', '$state','$stateParams', 'UserFactory', 'AuthFactory','ProductFactory', 'CartFactory', function($scope, $http, $state,$stateParams, UserFactory, AuthFactory,ProductFactory, CartFactory){
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

  $scope.states = [];
  console.log($scope.states);

  $scope.searchProduct1 = function()
  {
    ProductFactory.searchProduct('Grocery', $scope.query)
    .success(function(reply){
      if (reply == 'Unable to Fetch')
      {
        console.log("afa");
        $scope.message = 'Sorry Unable to fetch Products right now.';
      }
      else if(Object.keys(reply).length == 0)
      {
        console.log("afa2");
        $scope.message = 'No Results found. Try something else';
      }
      else{
        $scope.items = reply;
      }
    })
    .error(function(error){
      $scope.message ='Unable to Search Results';
    });
  };
  $scope.show_length = 5;
  $scope.show_result = false;
  $scope.hide_popup = function(){
    $scope.show_result = false;
  }
  $scope.show_popup = function(){
    $scope.show_result = true;
  }

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
      $scope.products=['None'];
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

  $scope.query = "";
  // END point for quesring productlist

  $scope.searchProduct = function()
  {
    $state.go('grocery.home.search', {query:$scope.query});
  };
  $scope.addToCart = function(product_data, quantity){
    console.log('Add to cart');
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:quantity.selected_quantity,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      console.log(response);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
  };
  $scope.viewProduct = function(product){
    $state.go('grocery.home.Product',{
      product: JSON.stringify(product)
    });
  };
  $scope.showSubCategoryProducts = function(mainCategory,subCategory)
  {
    $state.go('grocery.home.SubCategoryProducts',{
      level1Category : 'Grocery',
      mainCategory : mainCategory,
      subcategory : subCategory
    });
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

.controller('sidebarController', function($scope,$location, $state, $location, $rootScope, Categories){
  console.log("sidebar");

  $scope.path = $location.path().slice(1);
  $scope.allCategories = Categories.getCategories();
  $scope.showCategoryProducts = function(mainCategory)
  {
    console.log(mainCategory);
    $state.go('grocery.home.CategoryProducts',{
      level1Category : 'Grocery',
      mainCategory : mainCategory
    });
  };
  $scope.showSubCategoryProducts = function(mainCategory,subCategory)
  {
    console.log(mainCategory);
    console.log(subCategory);
    $state.go('grocery.home.SubCategoryProducts',{
      level1Category : 'Grocery',
      mainCategory : mainCategory,
      subcategory : subCategory
    });
  };
  $scope.showCategories=[];
  $scope.expandCategory = function(index)
  {
    console.log(index);
    $scope.showCategories = Array($scope.showCategories.length).fill(false);
    $scope.showCategories[index]=true;
  }
  $scope.collapseCategory = function(index)
  {
    console.log(index);
    $scope.showCategories = Array($scope.showCategories.length).fill(false);
    $scope.showCategories[index]=false;
  }
  $scope.$on('show_filter', function(event, show_filter){
    $scope.show_filter = show_filter;
  });
  $scope.$on('brand_filters', function(event, data){
    $scope.brand_filters = data;
  });
  $scope.selected_filters = [];
  $scope.manage_filter = function(val){
    var i = $scope.selected_filters.indexOf(val);
    if(i === -1)
      $scope.selected_filters.push(val);
    else
      $scope.selected_filters.splice(i, 1);
    $rootScope.$broadcast('selected_filters', $scope.selected_filters);
  };
  $scope.check_filter = function(val){
    var i = $scope.selected_filters.indexOf(val);
    if(i === -1)
      return false;
    else
      return true;
  };
  $scope.reset_filter = function(){
    $scope.selected_filters = [];
    $rootScope.$broadcast('selected_filters', $scope.selected_filters);
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


.controller('cartController', function($scope, $rootScope, CartFactory){
  console.log("cart");
  $rootScope.$broadcast('show_filter', false);
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
          //   $scope.items[index].Quantity = $scope.items[index].Quantity-1;
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
        //   $scope.items[index].Quantity = $scope.items[index].Quantity + 1;
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
        //   $scope.items[index].Quantity = $scope.items[index].Quantity + 1;
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


.controller('productsGroceryController',['$scope', '$http', '$rootScope', '$state', 'ProductFactory', 'CartFactory', 'Categories', function($scope, $http, $rootScope, $state, ProductFactory, CartFactory, Categories){
  $rootScope.$broadcast('show_filter', false);
  $scope.IncreaseQuantity = function(product_data, quantity)
  {
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:product_data.quantity+1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      if (response == 'Updated in cart' || response == 'Added to cart')
      {
        product_data.quantity = product_data.quantity+1;

      }
      console.log(response,2000);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
  };

  $scope.DecreaseQuantity = function(product_data, quantity)
  {
    if(product_data.quantity){
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:product_data.quantity-1,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.addToCart(product)
      .success(function(response){
        if (response == 'Updated in cart' || response == 'Added to cart')
        {
          product_data.quantity = product_data.quantity-1;
        }
        console.log(response);
      }).error(function(error){
        console.log('Unable to add. Please try after sometime');
        console.log(error);
      });
    }
    else if(product_data.quantity==0)
    {
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:0,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.removeCartItem(product)
      .success(function(response){
        if (response == 'Removed from cart')
        {
          product_data.quantity=0;
        }
        console.log(response);
      })
      .error(function(error){
        console.log(error);
      }); 
    }
  };

  $scope.AddToCart = function(product_data, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      console.log(response);
    }).error(function(error){
      console.log('Unable to add. Please try after sometime');
      console.log(error);
    });
  };

  $scope.viewProduct = function(product){
    $state.go('grocery.home.Product',{
      product: JSON.stringify(product)
    });
  };
  $scope.removeSpace = function(value){
    if (value)
      return value.replace(/ /g, '_');
  };

  $scope.allCategories = Categories.getCategories();
  $scope.productsData = {};

  for(var i = 0; i < $scope.allCategories.length; i++){
    ProductFactory.getRandomMainCategoryProducts('Grocery', Object.keys($scope.allCategories[i])[0])
    .success(function(resp){
      if (Object.keys(resp).length == 0 )
        console.log('Sorry no new products are available');
      else{
        var name = $scope.removeSpace(resp[0]['Main Category']);
        $scope.productsData[name] = resp;
      }
    })
    .error(function(error){
      console.log(error);
      console.log('Unable to Fetch Products. Try again later');
    });
  }
}])

.controller('CategoryProductsController',['$scope','$http','$rootScope', '$stateParams', '$state', 'ProductFactory', 'CartFactory', 'Categories', function($scope,$http,$rootScope, $stateParams, $state, ProductFactory, CartFactory, Categories){
  console.log('CategoryProductsControllerproducts');
  $rootScope.$broadcast('show_filter', false);
  $scope.mainCategory = $stateParams.mainCategory;
  $scope.subCategories = Categories.getSubCategories($stateParams.level1Category, $stateParams.mainCategory);
  $scope.showallSubCategoryProducts = function(mainCategory, subCategory)
  {
    $state.go('grocery.home.AllSubCategoryProducts',{
      level1Category : 'Grocery',
      mainCategory : mainCategory,
      subcategory : subCategory
    });
  };
  $scope.AddQuantity = function(product_data, quantity)
  {
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:product_data.quantity+1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      if (response == 'Updated in cart' || response == 'Added to cart')
      {
        product_data.quantity = product_data.quantity+1;
      }
      product_data.message = response;
    }).error(function(error){
      product_data.message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.RemoveQuantity = function(product_data, quantity)
  {
    if(product_data.quantity){
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:product_data.quantity-1,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.addToCart(product)
      .success(function(response){
        if (response == 'Updated in cart' || response == 'Added to cart')
        {
          product_data.quantity = product_data.quantity-1;
        }
        product_data.message = response;
      }).error(function(error){
        product_data.message = 'Unable to add. Please try after sometime' ;
        console.log(error);
      });
    }
    else if(product_data.quantity==0)
    {
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:0,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.removeCartItem(product)
      .success(function(response){
        if (response == 'Removed from cart')
        {
          product_data.quantity=0;
        }
        product_data.message = response;
      })
      .error(function(error){
        console.log(error);
        product_data.message = 'Unable to add';
      }); 
    }
  };
  $scope.AddToCart1 = function(product_data, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      product_data.message = response;
    }).error(function(error){
      product_data.message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.viewProduct = function(product){
    $state.go('grocery.home.Product',{
      product: JSON.stringify(product)
    });
  };
  $rootScope.$broadcast('show_filter', false);
  $scope.removeSpace = function(value){
    if (value)
      return value.replace(/ /g, '_');
  };

  $scope.quantity='';
  $scope.products=[];

  $scope.productsData = {};
  for(var i = 0; i < $scope.subCategories.length; i++){
    ProductFactory.getProducts($stateParams.level1Category, $stateParams.mainCategory, $scope.subCategories[i])
    .success(function(reply){
      if (reply == 'Unable to Fetch')
      {
        console.log('Sorry Unable to fetch Products right now.');
      }
      else{
        var name = $scope.removeSpace(reply[0]['Sub Category']);
        $scope.productsData[name] = reply;
      }
    });
  }
}])

.controller('SubCategoryProductsController',['$scope','$http','$rootScope', '$stateParams', '$state', 'ProductFactory', 'CartFactory', function($scope,$http,$rootScope, $stateParams, $state, ProductFactory, CartFactory){
  console.log('CategoryProductsControllerproducts');
  $rootScope.$broadcast('show_filter', false);
  $scope.mainCategory = $stateParams.mainCategory;
  $scope.subCategory = $stateParams.subcategory;
  $scope.showallSubCategoryProducts = function()
  {
    $state.go('grocery.home.AllSubCategoryProducts',{
      level1Category : 'Grocery',
      mainCategory : $scope.mainCategory,
      subcategory : $scope.subCategory
    });
  };
  $scope.IncreaseQuantity = function(product_data, quantity)
  {
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:product_data.quantity+1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      if (response == 'Updated in cart' || 'Added to cart')
      {
        product_data.quantity = product_data.quantity+1;
      }
      product_data.message = response;
    }).error(function(error){
      product_data.message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.DecreaseQuantity = function(product_data, quantity)
  {
    if(product_data.quantity){
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:product_data.quantity-1,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.addToCart(product)
      .success(function(response){
        if (response == 'Updated in cart' || 'Added to cart')
        {
          product_data.quantity = product_data.quantity-1;
        }
        product_data.message = response;
      }).error(function(error){
        product_data.message = 'Unable to add. Please try after sometime' ;
        console.log(error);
      });
    }
    else if(product_data.quantity==0)
    {
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:0,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.removeCartItem(product)
      .success(function(response){
        if (response == 'Removed from cart')
        {
          product_data.quantity=0;
        }
        product_data.message = response;
      })
      .error(function(error){
        console.log(error);
        product_data.message = 'Unable to add';
      }); 
    }
  };
  $scope.AddToCart = function(product_data, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      product_data.message = response;
    }).error(function(error){
      product_data.message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.viewProduct = function(product){
    $state.go('grocery.home.Product',{
      product: JSON.stringify(product)
    });
  };

  $scope.products = {};

  ProductFactory.getProducts($stateParams.level1Category, $stateParams.mainCategory, $stateParams.subcategory)
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      console.log('Sorry Unable to fetch Products right now.');
    }
    else{
      $scope.products.trending_products = reply;
    }
  });
  ProductFactory.getProducts($stateParams.level1Category, $stateParams.mainCategory, $stateParams.subcategory)
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      console.log('Sorry Unable to fetch Products right now.');
    }
    else{
      $scope.products.new_products = reply;
    }
  });
  ProductFactory.getProducts($stateParams.level1Category, $stateParams.mainCategory, $stateParams.subcategory)
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      console.log('Sorry Unable to fetch Products right now.');
    }
    else{
      $scope.products.try_products = reply;
    }
  });
}])

.controller('searchController',['$scope','$http','$rootScope', '$stateParams' , 'ProductFactory', 'CartFactory',function($scope,$http,$rootScope, $stateParams, ProductFactory, CartFactory){
  console.log($stateParams.query);
  $rootScope.$broadcast('show_filter', true);
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
  $scope.selected_filters = [];
  $scope.$on('selected_filters', function(event, data){
    $scope.selected_filters = data;
  });
  $scope.filter_results = function(item){
    if(!$scope.selected_filters.length || $scope.selected_filters.indexOf(item['Product Category']) !== -1)
      return true;
  }
  $scope.quantity='';

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
      var brand_filters = [];
      for (var i=0; i< Object.keys(reply).length; i++)
      {
        $scope.products.push(reply[i]);
        $scope.products[i].quantity=0;
        if(brand_filters.indexOf(reply[i]['Product Category']) === -1)
          brand_filters.push(reply[i]['Product Category']);
      }
      $rootScope.$broadcast('brand_filters', brand_filters);
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

.controller('dropdownMenuController',['$scope','$http','$rootScope', '$location', '$state', 'Categories', function($scope, $http, $rootScope, $location, $state, Categories){
  console.log('dropdown menu');
  var temp = Categories.getCategories(), obj;
  $scope.allCategories = {};
  for(var i = 0; i < temp.length; i++){
    obj = Object.keys(temp[i])[0];
    $scope.allCategories[obj] = temp[i][obj];
  }
  $scope.showCategoryProducts = function(mainCategory)
  {
    console.log(mainCategory);
    $state.go('grocery.home.CategoryProducts',{
      level1Category : 'Grocery',
      mainCategory : mainCategory
    });
  };
  $scope.showSubCategoryProducts = function(mainCategory,subCategory)
  {
    $state.go('grocery.home.SubCategoryProducts',{
      level1Category : 'Grocery',
      mainCategory : mainCategory,
      subcategory : subCategory
    });
  };
}])
.controller('AllSubCategoryProductsController',['$scope','$http','$rootScope', '$stateParams', '$state', 'ProductFactory', 'CartFactory', function($scope,$http,$rootScope, $stateParams, $state, ProductFactory, CartFactory){
  console.log('CategoryProductsControllerproducts');
  $rootScope.$broadcast('show_filter', true);
  $scope.mainCategory = $stateParams.mainCategory;
  $scope.subCategory = $stateParams.subcategory;
  $scope.IncreaseQuantity = function(product_data, quantity)
  {
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:product_data.quantity+1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){console.log(response)
      if (response == 'Updated in cart' || response == 'Added to cart')
      {
        product_data.quantity = product_data.quantity+1;
      }
      product_data.message = response;
    }).error(function(error){
      product_data.message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.DecreaseQuantity = function(product_data, quantity)
  {
    if(product_data.quantity){
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:product_data.quantity-1,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.addToCart(product)
      .success(function(response){
        if (response == 'Updated in cart' || response == 'Added to cart')
        {
          product_data.quantity = product_data.quantity-1;
        }
        product_data.message = response;
      }).error(function(error){
        product_data.message = 'Unable to add. Please try after sometime' ;
        console.log(error);
      });
    }
    else if(product_data.quantity==0)
    {
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:0,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.removeCartItem(product)
      .success(function(response){
        if (response == 'Removed from cart')
        {
          product_data.quantity=0;
        }
        product_data.message = response;
      })
      .error(function(error){
        console.log(error);
        product_data.message = 'Unable to add';
      }); 
    }
  };
  $scope.AddToCart = function(product_data, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      product_data.message = response;
    }).error(function(error){
      product_data.message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.viewProduct = function(product){
    $state.go('grocery.home.Product',{
      product: JSON.stringify(product)
    });
  };
  $scope.selected_filters = [];
  $scope.$on('selected_filters', function(event, data){
    $scope.selected_filters = data;
  });
  $scope.filter_results = function(item){
    if(!$scope.selected_filters.length || $scope.selected_filters.indexOf(item['Product Category']) !== -1)
      return true;
  }
  ProductFactory.getProducts($stateParams.level1Category, $stateParams.mainCategory, $stateParams.subcategory)
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      console.log('Sorry Unable to fetch Products right now.');
    }
    else{
      $scope.products = reply;
      var brand_filters = [];
      for(var i = 0; i < reply.length; i++){
        if(brand_filters.indexOf(reply[i]['Product Category']) === -1)
            brand_filters.push(reply[i]['Product Category']);
      }
      $rootScope.$broadcast('brand_filters', brand_filters);
    }
  });
}])
.controller('ProductDetailsController',['$scope','$http','$rootScope', '$stateParams', '$state', 'ProductFactory', 'CartFactory', function($scope,$http,$rootScope, $stateParams, $state, ProductFactory, CartFactory){
  console.log('ProductDetailsController');
  $rootScope.$broadcast('show_filter', false);
  $scope.product_data = JSON.parse($stateParams.product);
  console.log($scope.product_data);

  $scope.IncreaseQuantity = function(product_data, quantity)
  {
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:product_data.quantity+1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){console.log(response)
      if (response == 'Updated in cart' || response == 'Added to cart')
      {
        product_data.quantity = product_data.quantity+1;
      }
      product_data.message = response;
    }).error(function(error){
      product_data.message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.DecreaseQuantity = function(product_data, quantity)
  {
    if(product_data.quantity){
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:product_data.quantity-1,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.addToCart(product)
      .success(function(response){
        if (response == 'Updated in cart' || response == 'Added to cart')
        {
          product_data.quantity = product_data.quantity-1;
        }
        product_data.message = response;
      }).error(function(error){
        product_data.message = 'Unable to add. Please try after sometime' ;
        console.log(error);
      });
    }
    else if(product_data.quantity==0)
    {
      var cityIndex = 0;
      var product={
        ProductID: product_data._id,
        QuantityType: quantity[0],
        QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
        Price: quantity[1],
        Quantity:0,
        product_name: product_data.product_name,
        'Main Category': product_data['Main Category'],
        'Sub Category': product_data['Sub Category'],
        'Level1 Category': product_data['Level1 Category']
      };
      CartFactory.removeCartItem(product)
      .success(function(response){
        if (response == 'Removed from cart')
        {
          product_data.quantity=0;
        }
        product_data.message = response;
      })
      .error(function(error){
        console.log(error);
        product_data.message = 'Unable to add';
      }); 
    }
  };
  $scope.AddToCart = function(product_data, quantity)
  {
    console.log('Add to cart');
    var cityIndex = 0;
    var product={
      ProductID: product_data._id,
      QuantityType: quantity[0],
      QuantityIndex: product_data.Quantity[cityIndex].Quantities.indexOf(quantity),
      Price: quantity[1],
      Quantity:1,
      product_name: product_data.product_name,
      'Main Category': product_data['Main Category'],
      'Sub Category': product_data['Sub Category'],
      'Level1 Category': product_data['Level1 Category']
    };
    CartFactory.addToCart(product)
    .success(function(response){
      product_data.message = response;
    }).error(function(error){
      product_data.message = 'Unable to add. Please try after sometime';
      console.log(error);
    });
  };
  $scope.viewProduct = function(product){
    $state.go('grocery.home.Product',{
      product: JSON.stringify(product)
    });
  };
  ProductFactory.getProducts($scope.product_data['Level1 Category'], $scope.product_data['Main Category'], $scope.product_data['Sub Category'])
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      console.log('Sorry Unable to fetch Products right now.');
    }
    else{
      $scope.similar_products = reply;
    }
  });
  ProductFactory.getRandomProducts($scope.product_data['Level1 Category'])
  .success(function(reply){
    if (reply == 'Unable to Fetch')
    {
      console.log('Sorry Unable to fetch Products right now.');
    }
    else{
      $scope.try_products = reply;
    }
  });
}]);