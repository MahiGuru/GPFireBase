angular.module("GoodPhood.directive", [])

.filter('appendAsh', function(){
  return function(input, char){
    if(isNaN(input)){
        console.log(input);
      return input.replace(/[0-9]/g, input+"#");
    } else {
      return input;
    }
  }
})

.directive('myTabs', function () {
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: "AppCtrl",
        templateUrl: 'js/directives/tabs.html'

    };
})
.directive('myPane', function () {
    return {
        require: '^myTabs',
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@'
        },
        link: function (scope, element, attrs, tCtrl) {
            console.log(tCtrl);
            tCtrl.addPane(scope);
        },
        template: '<div class="tab-pane" ng-show="selected" ng-transclude></div>'
    };
});
