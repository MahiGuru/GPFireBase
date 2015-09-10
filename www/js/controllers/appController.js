   var appControllers = angular.module("GoodPhood.appCtrl", ['GoodPhood.Services', 'GoodPhood.directive', 'ionicLazyLoad']);

   appControllers.controller('loginCtrl', function ($scope, AccessScope, appService, $state, $ionicModal, $ionicPlatform, $cordovaDevice) {
       $scope.user = {
           mobileNumber: "9441076540",
           deviceNumber: "0.5353",
           firstName: "Mahipal",
           lastName: "Guru",
           email: "mahi6535@gmail.com",
           userNumber: ''
       };
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
              StatusBar.styleDefault();
            }

            var device = $cordovaDevice.getDevice();  
            var uuid = $cordovaDevice.getUUID();
            $scope.user.deviceNumber = uuid;
            console.log(device);
            console.log($scope.user);


          });
       //Temporary Code..
       if ($scope.user.deviceNumber == "") $scope.user.deviceNumber = Math.random().toFixed("4");

       //SETTING AND GETTING USER VALUE **** WATCHING ******
       $scope.$watch('user.userNumber', function (newValue, oldValue) {
           console.log(newValue);
           AccessScope.store('userNumber', newValue);
           console.log("From Access Scope = " + AccessScope.get('userNumber'));
       }, true);
       $scope.initialDivShow = true;
       $scope.secondDivShow = false;
       $scope.loginFirstBtnClick = function () {
           $scope.secondDivShow = true;
           $scope.initialDivShow = false;
       }
       $scope.loginBtnValid = function () {
           //validatemobile
           var postData = {
               mobileNo: $scope.user.mobileNumber,
               firstName: $scope.user.firstName,
               lastName: $scope.user.lastName,
               emailId: $scope.user.email,
               deviceId: $scope.user.deviceNumber
           }; 
           $scope.loaderVisible = true;
           appService.post("validatemobile", postData).then(function (loginData) {
               alert("CLICK success");
               AccessScope.store("userNumber", loginData.userId);
               $scope.initialDivShow = true;
               $scope.secondDivShow = false; 
                $scope.loaderVisible = false;
               $state.go("common.table", {
                   "userNum": loginData.userId
               });



               //$scope.orderSummeryCount = summery
           }, function () {
               alert("Oops error occured..");
           });

       }

   });
   appControllers.controller('tableCtrl', function ($scope, AccessScope, $state, $stateParams) {
       $scope.tableDetails = {
           qrNumber: "",
           orderNumber: "",
           tableNumber: "",
           userNumber: $stateParams.userNum
       };
       //SETTING AND GETTING TABLE RELATED VALUES **** WATCHING ******
       $scope.$watch('tableDetails.qrNumber', function (newValue, oldValue) {
           console.log(newValue)
           console.log(newValue.charAt(0));
           if (newValue.length == 1) {
               $scope.tableDetails.qrNumber = newValue.replace(/^[0-9]/g, newValue + "#");
           }
           if (newValue.length == 3 && newValue.indexOf("#") >= -1) {
               $scope.tableDetails.orderNumber = newValue.charAt(0);
               $scope.tableDetails.tableNumber = newValue.charAt(2);
               $scope.tableDetails.userNumber = AccessScope.get('userNumber') || 1;

               AccessScope.store('tableDetails', $scope.tableDetails);
               console.log(AccessScope.get('tableDetails'));
           }
       }, true);
       $scope.tableSelectedClick = function () {
           if ($scope.tableDetails.orderNumber != "" && $scope.tableDetails.tableNumber != "" && $scope.tableDetails.userNumber != "") {
               $state.go("gp.menu", {
                   "venueId": $scope.tableDetails.orderNumber,
                   "tableId": $scope.tableDetails.tableNumber,
                   "userId": $scope.tableDetails.userNumber
               });
           } else {
               alert("Please choose Table and Order Number!! ");
           }
       }

   });




   appControllers.controller('menuCtrl', function ($scope, appService, $ionicSlideBoxDelegate, $ionicModal, $ionicPopup, $timeout, $interval, $state, $stateParams, AccessScope, $window) {
       
       /* ---------------------------------- IONIC VIEW ENTER  ------------------------------- */
       $scope.$on('$ionicView.enter', function () { /* TODO :  loading view time do your logic */
           $scope.itemsReview = {};
           console.log($window);
           //REVIEW AND CONFIRM ITEMS SET TO CURRENT ITEMS
           function looptoItems(sections) {
               //alert("Loop inside");
               console.log(sections);
               $(sections).each(function (i, section) {
                   $(section.Categories).each(function (k, category) {
                       $(category.Items).each(function (key, item) {
                           angular.forEach($scope.itemsReview.reviewItems, function (value, ri) {
                               if ((item.ItemId == value.itemId)) {
                                   if (value.kotitems != undefined && value.kotitems != null) {
                                       $scope.sections[i].Categories[k].Items[key]["reviewCount"] = value.kotitems[0].quantity;
                                   }
                               }
                           });
                           angular.forEach($scope.itemsReview.confirmedItems, function (value, ci) {
                               if ((item.ItemId == value.itemId)) {
                                   if (value.kotitems != undefined && value.kotitems != null) {
                                       $scope.sections[i].Categories[k].Items[key]["confirmCount"] = value.kotitems[0].quantity;
                                   }
                               }
                           })

                       });
                   });
               });
           };

           appService.get("vieworder/" + $scope.tableDetails.orderNumber, "GET", null).then(function (viewOrderResponce) {
               //alert("view order");
               $scope.itemsReview.ordersResponce = viewOrderResponce;
               $scope.itemsReview.reviewItems = viewOrderResponce.reviewItems;
               $scope.itemsReview.confirmedItems = viewOrderResponce.confirmedItems;
           })

           $scope.$watch("itemsReview", function (newValue, oldValue) {
               $scope.$watch("sections", function (newValue, oldValue) {
                   console.log("Sectionsss");
                   alert("Sectionsss");
                   looptoItems(newValue);
               });

           }, true);
       });

       /* ---------------------------------- ///////IONIC VIEW ENTER  ------------------------------- */


       /**** 
            TEMPORARY INFO ABOUT ORDER DETAILS....
       ****/
       $scope.tableDetails = {
           qrNumber: "",
           orderNumber: "1",
           tableNumber: "1",
           userNumber: "1"
       };

       AccessScope.store('tableDetails', $scope.tableDetails);
       $scope.orderInfo = AccessScope.get('tableDetails');

       /**** 
            ////////TEMPORARY 
       ****/
       /*--------- GETTING ORDER DATA FROM STORED SERVICE ------- */
       //$scope.orderInfo = AccessScope.get('tableDetails');

       $scope.$watchCollection('$stateParams', function (newParams) {
           // alert("State Params page");
       });


       /* ---------------------------------- MENU SERVICE ------------------------------- */

       $scope.venueMenu = '';

       if ($scope.orderInfo != undefined) {
           $scope.menuPath = "create/" + $scope.orderInfo.orderNumber + "/" + $scope.orderInfo.tableNumber + "/" + $scope.orderInfo.userNumber;
       }
       
      $scope.loaderVisible = true;
       appService.get($scope.menuPath, null).then(function (resp) {
           
           $scope.venueMenu = resp.menu.Sections;
           $scope.sampleMenuData = resp;
           $scope.orderId = resp.orderId;
           /********* Collapsible ************/
           $ionicSlideBoxDelegate.update();
           $scope.loaderVisible = false;

       });

       // ~~~~~~ WATCHING MENU SERVICE AND ASSIGNING TO "SECTIONS" SCOPE
       $scope.$watch("venueMenu", function (newValue, oldValue) {
           if (!angular.equals(newValue, oldValue)) {
               $scope.sections = newValue;
           }
       });

       /* ------------------------- ///////MENU SERVICE ------------------------ */

       /* ------------------------- ORDER SUMMERY SERVICE --------------- ---------- */

       $scope.orderSummeryCount = "";
       var orderSummeryInterval = '';

       orderSummeryInterval = function () {
           appService.get("ordersummary/1/1", null).then(function (summery) {
               // alert("success");
               $scope.orderSummeryCount = summery
           });
       };
       $interval(function () {
           orderSummeryInterval();
       }, 2000);

       // ~~~~~ WATCHING ORDER SUMMERY COUNT
       $scope.$watch("orderSummeryCount", function (newValue, oldValue) {
           console.log("order");
           console.log(oldValue);
           console.log(newValue);
           console.log("ORDER = " + newValue);
           $scope.orderSummery = newValue;
       }, true);

       // ~~~~~ ORDER SUMMERY COUNT CLICK METHOD
       $scope.orderSummeryClick = function (itemCount) {
           if (itemCount >= 0) {
               $state.go("gp.review", {
                   "orderId": 1
               });
           } else {
               $state.go("common.table");
           }
       };

       /* ------------------------- /////ORDER SUMMERY SERVICE --------------- ---------- */

       /* ------------------------- CUSTOMIZE PANEL----------------------------------- */
       $scope.customizeLink = function (item) {
           $scope.customizeData = "";
           appService.get("getpreferences/" + $scope.orderInfo.orderNumber + "/" + item.ItemId + "/" + $scope.orderInfo.orderNumber, null).then(function (customiseData) {
               alert("success");
               console.log(customiseData);
               if(customiseData[0] != undefined || customiseData[0] != null){    
               $scope.customizeData = customiseData[0];
               $scope.data.oldPrice = $scope.modelItem.Price;
                   angular.forEach($scope.customizeData.options, function(obj){
                        if(obj.isDefault == 1) 
                            $scope.data.customizeRadioSelected = obj.optionName;
                   });
                $scope.modal.show(); 
               }else {
                   $scope.customizeData = customiseData;
                    $scope.showCustomizeAlert(customiseData.message);
               }
           }); 
           
           $scope.data = {
               customizeRadioSelected : "",
               customizeOptionIds : [],
               oldPrice : '',
               customizeCheckBoxSelected : [],
           }
           console.log("customize link");
           $scope.customizeRadioChange = function(item){
               console.log(item);
               $scope.data.customizeOptionIds = [];
               $scope.data.customizeOptionIds.push(item.id);
               $scope.modelItem.Price = $scope.data.oldPrice+item.price
           }
           $scope.customizeCheckboxChange = function(item){
               console.log(item);
               if($scope.data.customizeOptionIds.indexOf(item.id)){
                   $scope.data.customizeOptionIds.push(item.id);
                   $scope.modelItem.Price = $scope.data.oldPrice+item.price
               }
               
           }
           $scope.showCustomizeAlert = function(msg) {
            $ionicPopup.alert({
              title: 'Customize',
              content: msg+'!!!'
            }).then(function(res) { 
            });
          };
           $scope.modelItem = item; 
            
       }  

       $scope.savePreference = function (item) {
           alert("save prefernce");
            console.log($scope.data.customizeOptionIds.join(","));
           var postData = { orderId:  $scope.orderInfo.orderNumber, itemId: item.ItemId, userId: $scope.orderInfo.userNumber, options: $scope.data.customizeOptionIds.join(",") };
           console.log(postData)
            appService.post("savepreferences", postData).then(function (summery) {
                   alert("Successfully Saved the Preferences!");
                   $scope.modal.hide();  
               }, function () {
                   alert("some thing went wrong while Saving the preferences");
               });
            
       };
       $ionicModal.fromTemplateUrl('templates/customizePage.html', {
           scope: $scope,
           animation: 'slide-in-up'
       }).then(function (modal) {
           $scope.modal = modal;
       });
       $scope.openModal = function () {
           $scope.modal.show();
       };
       $scope.closeModal = function () {
           $scope.modal.hide();
       };

       /* ------------------------- ////CUSTOMIZE PANEL----------------------------------- */

       /* -------------------------- POPUPS ---------------------------------- */

       // Triggered on a button click, or some other target
       /*
             <button class="button button-dark" ng-click="showPopup()">
              show
            </button>
       */
       $scope.filterList = [
           {
               text: "Vegeterian",
               checked: true
           },
           {
               text: "Non Vegeterian",
               checked: false
           },
           {
               text: "Eggeterian",
               checked: false
           }
           ];
       $scope.filteredItems = [];
       $scope.showPopup = function () {
           $scope.data = {}

           // An elaborate, custom popup
           var myPopup = $ionicPopup.show({
               templateUrl: 'templates/filterPage.html',
               title: 'Filter',
               subTitle: 'Choose type of items',
               scope: $scope,
               buttons: [
                   {
                       text: '<b>OK</b>',
                       type: 'button-positive',
                       onTap: function (e) {
                           angular.forEach($scope.filterList, function (value) {
                               if (value.checked == true) {
                                   $scope.filteredItems.push(value);
                               }
                           })
                       }
               },
             ]
           });
           myPopup.then(function (res) {
               console.log('Tapped!', res);
           });
           $timeout(function () {
               myPopup.close(); //close the popup after 3 seconds for some reason
           }, 13000);
       };


       /* -------------------------- /////POPUPS ---------------------------------- */

       /* ---------------------------  FILTER --------------------------------*/

       $scope.filterTypes = [
           {
               text: "Vegeterian",
               value: "Vegeterian"
           },
           {
               text: "Non Vegeterian",
               value: "NonVegeterian"
           },
           {
               text: "Eggterian",
               value: "Eggterian"
           }
          ];

       /* -------------------------- /////FILTER ---------------------------------- */


       $scope.$on('$ionicView.leave', function () {
           /* TODO :  Complete view  time do your logic */
           $interval.cancel(orderSummeryInterval);
       });

   });


   /************** 
                   REVIEW CTRL  
                            **************/
   appControllers.controller('reviewCtrl', function ($scope, appService, $stateParams, AccessScope, $window) {


       $scope.$on('$ionicView.enter', function () {
           
           $scope.winHeight = ($window.innerHeight);
           /**** 
                TEMPORARY 
           ****/
           $scope.tableDetails = {
               qrNumber: "",
               orderNumber: "1",
               tableNumber: "1",
               userNumber: "1"
           };

           AccessScope.store('tableDetails', $scope.tableDetails);

           $scope.orderInfo = AccessScope.get('tableDetails');

           /**** 
                /TEMPORARY 
           ****/

           /* TODO :  loading view time do your logic */
           
           $scope.loaderVisible = true; 
           appService.get("vieworder/" + $stateParams.orderId, "GET", null).then(function (viewOrderResponce) {
               alert(viewOrderResponce);
               $scope.ordersResponce = viewOrderResponce;
               $scope.loaderVisible = false;  
               AccessScope.store('discount', viewOrderResponce.discount);
                 
           })

           $scope.reviewData = "Scope from Review";
           $scope.ordersResponce = '';

           $scope.$watch("ordersResponce", function (newValue, oldValue) {
               $scope.reviewResponce = newValue;
               $scope.reviewItems = newValue.reviewItems;
               $scope.confirmedItems = newValue.confirmedItems;

           });


           $scope.placeOrder = function () {
               debugger;
               var kotIds = "";
               var kotItemIds = "";
               angular.forEach($scope.reviewItems, function (value, ri) {
                   if (($scope.reviewItems.length - 1) != ri) {
                       kotIds += value.kotitems[0].kotId + ",";
                       kotItemIds += value.kotitems[0].kotItemId + ",";
                   } else {
                       kotIds += value.kotitems[0].kotId;
                       kotItemIds += value.kotitems[0].kotItemId;
                   }
               });

               var postData = {
                   orderId: $scope.orderInfo.orderNumber,
                   userId: $scope.orderInfo.userNumber,
                   kotIds: kotIds,
                   kotItemIds: kotItemIds
               };
               appService.post("confirmorder", postData).then(function (summery) {
                   alert("Successfully place the order!");
                   /* TODO :  loading view time do your logic */
                   appService.get("vieworder/" + $scope.orderInfo.orderNumber, "GET", null).then(function (viewOrderResponce) {
                       $scope.ordersResponce = viewOrderResponce;
                   })


               }, function () {
                   alert("some thing went wrong while placing the order");
               });

           };

       });


   });

   /************** INVOICE CTRL  **************/
   appControllers.controller('invoiceCtrl', function ($scope, appService, $stateParams, AccessScope) {

       $scope.$on('$ionicView.enter', function () {

           /**** 
                TEMPORARY 
           ****/
           $scope.tableDetails = {
               qrNumber: "",
               orderNumber: "1",
               tableNumber: "1",
               userNumber: "1"
           };

           AccessScope.store('tableDetails', $scope.tableDetails);

           $scope.orderInfo = AccessScope.get('tableDetails');

           /**** 
                /TEMPORARY 
           ****/
           
           $scope.loaderVisible = true; 
           /* TODO :  loading view time do your logic */
           appService.get("getinvoice/" + $stateParams.orderId, "GET", null).then(function (invoiceResponce) {
               $scope.invoiceResponce = invoiceResponce;
               $scope.loaderVisible = false; 
           });
           $scope.totalPrice = 0;
           $scope.$watch("invoiceResponce", function (newValue, oldValue) {
               $scope.invoiceDetails = newValue;
           });
           $scope.Discount = AccessScope.get("discount") || 30;
           $scope.$watch("invoiceDetails", function (newValue, oldValue) {
               if (newValue != undefined) {
                   angular.forEach(newValue.Items, function (val) {
                       $scope.totalPrice = $scope.totalPrice + (val.itemPrice * val.itemQuantity)
                   });
                   //(((newValue.serviceTax) / 100) * invoiceBillTotal).toFixed(2)
                   $scope.serviceTax = (((newValue.serviceTax) / 100) * $scope.totalPrice);
                   $scope.vat = (((newValue.VAT) / 100) * $scope.totalPrice); 
                   $scope.totalBill = $scope.totalPrice - ($scope.serviceTax - $scope.vat).toFixed(2);
               }
           }, true);
           var now = new Date();
           var nowDate = (now.getDate()) + '/' + (now.getMonth() + 1) + '/' + now.getFullYear();
           var nowTime = now.getHours() + ':' + ((now.getMinutes() < 10) ? ("0" + now.getMinutes()) : (now.getMinutes())) + ':' + ((now.getSeconds() < 10) ? ("0" + now.getSeconds()) : (now.getSeconds()));

           $scope.invoice = {
               date: nowDate,
               time: nowTime,
               totalPrice: ""
           }


       });


   });


   /************** FEEDBACK CTRL  **************/
   appControllers.controller('feedbackCtrl', function ($scope, appService, $stateParams, AccessScope) {

       $scope.$on('$ionicView.enter', function () {

           /**** 
                TEMPORARY 
           ****/
           $scope.tableDetails = {
               qrNumber: "",
               orderNumber: "1",
               tableNumber: "1",
               userNumber: "1"
           };

           AccessScope.store('tableDetails', $scope.tableDetails);

           $scope.orderInfo = AccessScope.get('tableDetails');

           /**** 
                /TEMPORARY 
           ****/
           
           $scope.loaderVisible = true; 
           /* TODO :  loading view time do your logic */
           appService.get("getfeedback/" + $stateParams.orderId + "/" + $stateParams.userId, "GET", null).then(function (feedbackResponce) {
               alert(feedbackResponce);
               $scope.feedbackResponce = feedbackResponce;
            $scope.loaderVisible = false; 
           })
           $scope.itemLikeMethod = function(items){
                //var status = (that.parents(".feedBackCol").find(".feedItemLikeId").val() == false || that.parents(".feedBackCol").find(".feedItemLikeId").val() == "") ? 1 : 0;
                console.log(items);
               
                var postData = { orderId: parseInt($stateParams.orderId), userId: parseInt($stateParams.userId), itemId: items.id, status: items.isLike };
                 console.log(postData);
                 
               appService.post("addorupdatelike", postData).then(function (summery) {
                   alert("CLICK success");
                   console.log(summery);
                   if(summery.status){
                        items.isLike = summery.likeFlag
                   }
                   //$scope.orderSummeryCount = summery
               }, function () {                   
                   alert("some thing went wrong....") 
               }); 
                
           }

           $scope.$watch("feedbackResponce", function (newValue, oldValue) {
               $scope.feedbackDetails = newValue;
           });

       });


   });
   
   /************** USERS CTRL  **************/
   appControllers.controller('usersCtrl', function ($scope, appService, $stateParams, AccessScope) {

       $scope.$on('$ionicView.enter', function () {

           /**** 
                TEMPORARY 
           ****/
           $scope.tableDetails = {
               qrNumber: "",
               orderNumber: "1",
               tableNumber: "1",
               userNumber: "2"
           };

           AccessScope.store('tableDetails', $scope.tableDetails);

           $scope.orderInfo = AccessScope.get('tableDetails');

           /**** 
                /TEMPORARY 
           ****/
           $scope.loaderVisible = true;
           /* TODO :  loading view time do your logic */
           appService.get("getusers/" + $stateParams.orderId + "/" + $stateParams.userId, "GET", null).then(function (usersResponse) {
               alert(usersResponse);
               $scope.usersResponse = usersResponse;
               $scope.loaderVisible = false;
           });
           //authorizeuser;
           $scope.userAcceptMethod = function(user){
               console.log(user); 
           var postData = {rowId: user.rowId, status: user.status}
               appService.post("authorizeuser", postData).then(function (userStatus) {
                   alert("CLICK success"); 
                   user.status = userStatus.updatedStatus
                   console.log(user); 
                   //$scope.orderSummeryCount = summery
               }, function () {                   
                   alert("some thing went wrong....") 
               }); 
           }
           
           
            
       });


   });
