angular.module("GoodPhood.Controller", ['GoodPhood.appCtrl'])
    .controller('AppCtrl', function ($scope, $ionicSlideBoxDelegate, AccessScope, appService) {
        //Storing All Scopes into one service..
        AccessScope.store('AppCtrl', $scope);
        $scope.orderId = "";
        $scope.tableId = "";
        $scope.userId = 1;
        /********* Collapsible ************/
        $scope.toggleGroup = function (group) {
            if ($scope.isGroupShown(group)) {
                $scope.shownGroup = null;
            } else {
                $scope.shownGroup = group;
            }
        };
        $scope.isGroupShown = function (group) {
            return $scope.shownGroup === group;
        };
    $scope.tableDetails = {
                               qrNumber: "",
                               orderNumber: "",
                               tableNumber: "",
                               userNumber: ""
                           };
    $scope.AccesstableDetails = AccessScope.get("tableDetails");
    
        $scope.$watch('AccesstableDetails', function (newValue) {
            console.log("changed value");
             $scope.tableDetails = newValue;
            console.log($scope.tableDetails);
        }, true);
    
    
    $scope.loaderVisible = false;
        $scope.myActiveSlide = 0;
        $scope.slidePrevious = function () {

            $ionicSlideBoxDelegate.previous();
        }

        $scope.slideNext = function () {
            $ionicSlideBoxDelegate.next();
        }

        ///TABS METHOD ;
        var panes = $scope.panes = [];
        $scope.select = function (pane) {
            angular.forEach(panes, function (pane) {
                pane.selected = false;
            });

            pane.selected = true;
        };

        this.addPane = function (pane) {
            if (panes.length === 0) {
                $scope.select(pane);
            }
            panes.push(pane);
        };

        $scope.slideGoto = function (index) {
            $scope.myActiveSlide = index;
            console.log($scope.myActiveSlide);
            $ionicSlideBoxDelegate.slide(index, 500);

        }
        $scope.slideHasChanged = function ($index) {
            $scope.myActiveSlide = $index;
        };


        $scope.message = "asfasfasf";

        $scope.$watch('message', function (newValue) {
            console.log(newValue)
            AccessScope.store('message', $scope.message);
            //Storing All Scopes into one service..
        }, true);
        
        //---------------- ADD ITEM SERVICE-----------------
       var addItemOrder = function (itemId, qty, kotItemId, preferences, viewHandler, errorHandler) {
           
           $scope.orderInfo = AccessScope.get('tableDetails'); 
           console.log($scope.orderInfo);
           
           
           var postData = {
               OrderId: $scope.orderInfo.orderNumber,
               UserId: $scope.orderInfo.userNumber,
               ItemId: itemId,
               Quantity: qty,
               KOTItemId: null,
               Preferences: null
           };
           appService.post("addorupdate", postData).then(function (summery) {
               alert("CLICK success");
               viewHandler(summery);
               //$scope.orderSummeryCount = summery
           }, function () {
               alert("some thing went wrong....")
               errorHandler();
           });
       };
       //~~~~~~~~~~~~~~ SPINNER MINUS METHOD
       $scope.menuMinusClick = function (itemIdVal, itemObj) {
           
           console.log(itemObj);
           if(itemObj.confirmCount == undefined) itemObj.confirmCount = 0;
           if(itemObj.reviewCount == undefined) itemObj.reviewCount = 0;
           
           if (itemObj.confirmCount != undefined) {
               if (itemObj.reviewCount <= itemObj.confirmCount) {
                   alert("INSIDE = "+itemObj.reviewCount);
                   return;
               }
           }
           
           var iCount = (itemObj.reviewCount); 
           alert(iCount)
           
           
           var quantityItemVal = -1;
           if (iCount > 0) {
               itemObj.reviewCount = (iCount - 1);
               alert(itemObj.reviewCount);
           } 
           addItemOrder(itemIdVal, quantityItemVal, null, "", function (summery) {

           }, function () {
               if (itemObj.reviewCount >= 0) {
                   itemObj.reviewCount = itemObj.reviewCount + 1;
               }
           });

       };
       //~~~~~~~~~~~~~~ SPINNER PLUS METHOD
       $scope.menuPlusClick = function (itemIdVal, itemObj) {
           
           console.log(itemObj);
           if(itemObj.confirmCount == undefined) itemObj.confirmCount = 0;
           if(itemObj.reviewCount == undefined) itemObj.reviewCount = 0;
            
           var quantityItemVal = 1;
            
                itemObj.reviewCount = itemObj.reviewCount + 1;
                alert(itemObj.reviewCount);
             
           
           addItemOrder(itemIdVal, quantityItemVal, null, "", function (summery) { 
               console.log(itemObj);
           }, function () { 
               if (itemObj.reviewCount >= 0) {
                   itemObj.reviewCount = itemObj.reviewCount - 1;
               } 
               console.log(itemObj);
           });

       };
       
    
    
    

    });
