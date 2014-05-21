foxographApp.directive('toggleList', function () {
  var template = '<div class="panel panel-default">' +
      '<div class="panel-heading"><h3 class="toggle-list panel-title">{{title}}</h3>' +
        '<button ng-show="clearable" type="button" ng-click="clear()" class="btn btn-default btn-xs pull-right">Clear</button>' +
      '</div>' +
      '<ul class="toggle-list list-group">' +
        '<a class="list-group-item toggle-list" ng-repeat="listItem in list" ng-click="toggle(listItem)"' +  
          'ng-class="{on: isSelected(listItem)}">' +
          '<span class="title" ng-bind="listItem[attribute]"></span><span class="circle"></span></a>' +
        '<a ng-show="addable && !adding" ng-click="addItem()" class="list-group-item toggle-list">Add' + 
          '<span class="plus"></span>'+
        '</a>' +
        '<form ng-show="adding">' +
          '<input type="text" ng-model="newItem" placeholder="Adding to {{title}}">' +
          '<button type="button" ng-click="submitItem()" class="btn btn-default btn-xs pull-right">Add</button>'
      '</ul>' +
    '</div>';
  return {
    template: template,
    restrict: 'E',
    scope: {
      list: '=list',
      selected: '=selected',
      attribute: '=attribute',
      title: '=title',
      clearable: '=clearable',
      addable: '=addable',
      addfn: '=addfn'
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

      scope.clear = function() {
        scope.selected = [];
      }

      scope.toggle = function(listItem) {
        if (scope.isSelected(listItem)) {
          var newSelected = []
          for (var i = 0; i < scope.selected.length; i++) {
            if (scope.selected[i][scope.attribute] !== listItem[scope.attribute]) {
              newSelected.push(scope.selected[i]);
            }
          }
          scope.selected = newSelected
        } else {
          scope.selected.push(listItem);
        }
      }

      scope.addItem = function() {
        scope.adding = true;
      }

      scope.add = function(item) {
        scope.selected.push(item);
      }

      scope.submitItem = function() {
        scope.addfn(scope.newItem, scope.add);
      }
    }
  };
});
