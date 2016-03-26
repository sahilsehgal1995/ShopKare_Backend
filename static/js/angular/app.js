var app = angular.module('Shopkare', ['ui.router','courier_medicine','HeaderOperation','CartHandler','CheckoutHandler','ProductsHandler','FactoryHandler']);

    app.config(function($stateProvider, $urlRouterProvider) {
         $urlRouterProvider.otherwise('/main/home');

         $stateProvider
         .state('app',{
          url:'/app',
          templateUrl:'templates/index1.html'
         })
        .state('/courier',{
          url:'/courier',
          templateUrl:'templates/courier.html',
	  controller:'courierCtrl'	 
	 })
        .state('/medicines',{
          url:'/medicines',
          templateUrl:'templates/medicine.html',
      	 controller:'courierCtrl'
           })
         .state('main',{
          url:'/main',
          templateUrl:'templates/main.html'
         })
         .state('main.slider',{
          url:'/slider',
          views:{
            'slider':{
            templateUrl:'templates/slider.html'
              }
            }
           })
       
         .state('main.leftAdd',{
          url:'/adds',
          views:{
            'leftAdd':{
              templateUrl:'templates/leftAdds.html'    
            }
          }
         })
         
         .state('main.indexProd',{
          url:'/productsIndex',
          views:{
            'indexProducts':{
              templateUrl:'templates/indexProduct.html'    
            }
          },
          controller:'indexProducts'
         })


         .state('main.home',{
          url:'/home',
          views:{
            'leftAdd':{
              templateUrl:'templates/leftAdds.html'    
            },
            'slider':{
                templateUrl:'templates/sliderPrev.html'    
            },
            'indexProducts':{
              templateUrl:'templates/indexProduct.html'
            }
          },
         })

         .state('main.products',{
          url:'/products',
          views:{
            'slider':{
              templateUrl:'templates/shop.html'
            },
            'menuOtherOption':{
              templateUrl:'templates/menuBottom.html'
            }
          }
         })

	  .state('main.search',{
          url:'/search',
          views:{
            'slider':{
              templateUrl:'templates/shop.html'
         	   }
              }
       	   })

	 .state('main.pdetails',{
            url:'/pdetails/:pID',
            views:{
              'slider':{
                templateUrl:'templates/productdetails.html'
              }
            },
           
	   controller: function($scope, $stateParams,cartService,$rootScope) {
            $scope.initialImage=0;
            var p = $stateParams.pID;
            $scope.ProductDT=JSON.parse(p);

              $scope.changeImage=function(id){
                $scope.initialImage=id;
              }
              $scope.addCart=function(id,k){
                var pic=$scope.ProductDT.images[0].replace(/%/g,"/");
                for(var po=0;po<pic.length;po++){      
                  if(pic[po]=='/'){
                    pic=pic.slice(0,po+1)+pic.slice(po+3);    
                    }
                  }
               
                var picCart=Array();
                picCart.push(pic);
                var z=[ picCart , id.product_name , id.Qwt[k] , id.Qrs[k], id.description,1 ]; 
                console.log(z);
                var p=cartService.addProduct(z);
                if(p){
                  $rootScope.COUNTcartItems=$rootScope.COUNTcartItems+1;
                  console.log($rootScope.COUNTcartItems);
                }
                $scope.ProductDT.cart[k]="Added in Your Cart";
                $scope.COUNTcartItems=$scope.COUNTcartItems+1;
    

            //    var Quantities=id.Quantity[0].Quantities;
            //    var selectedQunatity=id.Quantity[0].Quantities[k];
            //    var productindex=Quantities.indexOf(selectedQunatity);
            //    console.log(productindex);
                
                };


            }
             
          })
/*         .state('main.menu.home',{
          url:'/home',
          views:{
            'hotdeals':{
                templateUrl:'templates/hotdeals.html'    
            },
            'categorywise':{
              templateUrl:'templates/bestcategoryProducts.html'
            },
            'featured':{
              templateUrl:'templates/featured.html'
            },
            'recommended':{
              templateUrl:'templates/recommended.html'
            }
          }
        })  */
         .state('checkout',{
          url:'/checkout',
          templateUrl:'templates/checkout.html'
         })
         .state('cart',{
          url:'/cart',
          templateUrl:'templates/cart.html'
         })
         .state('contactus',{
          url:'/contactus',
          templateUrl:'templates/contact-us.html'
         })
         /* .state('product',{
          url:'/product',
          templateUrl:'templates/shop.html'
         })
          .state('product.menu',{
          url:'/a',
          templateUrl:'templates/rightmenu.html'
         }) */
       });











    
    
   
 
 
   
  
   
   






 

          

 

