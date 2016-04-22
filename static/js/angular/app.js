var app = angular.module('Shopkare', ['ui.router','Shopkare.controllers','ui.bootstrap']);


app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/index');
  $stateProvider

    .state('index',{
      url : '/index',
      'templateUrl' : 'partial-index.html',
      'controller' : 'indexController'
    })

    .state('home',{
      url : '/home',
      views: {

          '': { templateUrl: 'home.html' },

          'header@home': { 
            templateUrl : 'templates/header.html',
            controller : 'headerController'
          },

          'footer@home': { 
            templateUrl : 'templates/footer.html',
            controller : 'footerController'
          },

          'products@home': { 
            templateUrl : 'templates/indexProduct.html',
            controller : 'productsMainController'
          },

          'sidebar@home': { 
            templateUrl : 'templates/sidebar.html',
            controller : 'sidebarController'
          }
        },

        controller : 'homeController'
    })

    .state('grocery',{
      url : '/grocery',
      views: {

          '': { templateUrl: 'home.html' },

          'header@grocery': { 
            templateUrl : 'templates/header.html',
            controller : 'headerController'
          },

          'footer@grocery': { 
            templateUrl : 'templates/footer.html',
            controller : 'footerController'
          },

         'content@grocery': {
            templateUrl : 'templates/content.html',
            controller : ''
          }
        },
        controller : 'groceryController'
    })
    .state('grocery.home',{
      url : '/home',
      views: {
         'sidebar@grocery': {
            templateUrl : 'templates/sidebar.html',
            controller : 'sidebarController'
          }
        },
        controller : 'groceryController'
    })
    .state('grocery.home.products',{
      url : '/products',
      views: {
          'products@grocery': { 
            templateUrl : 'templates/groceryProduct.html',
            controller : 'productsGroceryController'
          }
        }
    })
    .state('grocery.home.search',{
      url : '/search?query',
      views: {
          'products@grocery': { 
            templateUrl : 'templates/searchProduct.html',
            controller : 'searchController'
          }
        }
    })
    .state('grocery.home.CategoryProducts',{
      url : '/categoryproducts?level1Category&mainCategory&subcategory',
      views: {
          'products@grocery': { 
            templateUrl : 'templates/CategoryProducts.html',
            controller : 'CategoryProductsController'
          }
        }
    })

    .state('stationary',{
      url : '/stationary',
      views: {

          '': { templateUrl: 'home.html' },

          'header@stationary': { 
            templateUrl : 'templates/header.html',
            controller : 'headerController'
          },

          'footer@stationary': { 
            templateUrl : 'templates/footer.html',
            controller : 'footerController'
          },

         'sidebar@stationary': { 
            templateUrl : 'templates/sidebar.html',
            controller : 'sidebarController'
          },
        
          'products@stationary': { 
            templateUrl : 'templates/groceryProduct.html',
            controller : 'productsStationaryController'
          }
        },


        controller : 'stationaryController'
    })

    .state('courier',{
      url : '/courier',
      views: {

          '': { templateUrl: 'home.html' },

          'header@courier': { 
            templateUrl : 'templates/header.html',
            controller : 'headerController'
          },

          'footer@courier': { 
            templateUrl : 'templates/footer.html',
            controller : 'footerController'
          },

         'sidebar@courier': { 
            templateUrl : 'templates/sidebar.html',
            controller : 'sidebarController'
          },

          'products@courier': { 
            templateUrl : 'templates/courierProduct.html',
            controller : 'productsCourierController'
          }
        },

        controller : 'courierController'
    })


    .state('medicine',{
      url : '/medicine',
      views: {

          '': { templateUrl: 'templates/medicine.html' },

          'header@medicine': { 
            templateUrl : 'templates/header.html',
            controller : 'headerController'
          },

          'footer@medicine': { 
            templateUrl : 'templates/footer.html',
            controller : 'footerController'
          },

         'sidebar@medicine': { 
            templateUrl : 'templates/sidebar.html',
            controller : 'sidebarController'
          }
        },

        controller : 'medicineController'
    })

   .state('cart',{
      url : '/cart',
      views: {
          '': { templateUrl: 'templates/cart.html'},

          'header@cart': { 
            templateUrl : 'templates/header.html',
            controller : 'headerController'
          },

          'footer@cart': { 
            templateUrl : 'templates/footer.html',
            controller : 'footerController'
          },
        },
      controller : 'cartController'
    })
   
   .state('checkout',{
      url : '/checkout',
      views: {
          '': { templateUrl: 'templates/cart.html'},

          'header@cart': { 
            templateUrl : 'templates/header.html',
            controller : 'headerController'
          },

          'footer@cart': { 
            templateUrl : 'templates/footer.html',
            controller : 'footerController'
          },
        },
      controller : 'cartController'
    })
   
   .state('contact',{
      url : '/contact',
      views: {
          '': { templateUrl: 'templates/contact-us.html'},

          'header@contact': { 
            templateUrl : 'templates/header.html',
            controller : 'headerController'
          },

          'footer@contact': { 
            templateUrl : 'templates/footer.html',
            controller : 'footerController'
          },
        },
      controller : 'contactController'
    })

  });












    
    
   
 
 
   
  
   
   






 

          

 

