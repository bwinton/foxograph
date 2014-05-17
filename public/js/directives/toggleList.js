foxographApp.directive('toggleList', function () {
  var template = '<ul>' +
    '<a class="list-group-item toggle-list" ng-repeat="listItem in list" ng-click="toggle(listItem)"' +  
    'ng-class="{on: isSelected(listItem)}">' +
    '<span class="title" ng-bind="listItem[attribute]"></span><span class="circle"></span></a>' +
    '</ul>';
  return {
    template: template,
    restrict: 'E',
    scope: {
      list: '=list',
      selected: '=selected',
      attribute: '=attribute'
    },
    transclude : false,
    link: function (scope, element, attrs) {
      scope.isSelected = function(listItem) {
        for (var i = 0; i < scope.selected.length; i++) {
          if (scope.selected[i][scope.attribute] === listItem[scope.attribute]) {
            return true;
          }
        }
        return false;
      };

      scope.toggle = function(listItem) {
        console.log(scope.isSelected(listItem));
        if (scope.isSelected(listItem)) {
          var newSelected = []
          for (var i = 0; i < scope.selected.length; i++) {
            if (scope.selected[i][scope.attribute] !== listItem[scope.attribute]) {
              newSelected.push(scope.selected[i]);
            }
          }
          scope.selected = newSelected
        } else {
          console.log(scope.selected);
          scope.selected.push(listItem);
        }
      }
    }
  };
});
