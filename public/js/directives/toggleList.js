foxographApp.directive('toggleList', function () {
  var template = '<div class="panel panel-default">' +
      '<div class="panel-heading"><h3 class="toggle-list panel-title">{{title}}</h3>' +
        '<button ng-show="clearable" type="button" ng-click="clear()" class="btn btn-default btn-xs pull-right">Clear</button>' +
      '</div>' +
      '<ul class="toggle-list list-group">' +
        '<a class="list-group-item toggle-list" ng-repeat="listItem in list" ng-click="toggle(listItem)"' +
          'ng-class="{on: isSelected(listItem)}">' +
          '<span class="title" ng-bind="listItem[attribute]"></span><span class="circle"></span></a>' +
        '<a ng-show="addable && !adding" ng-click="add()" class="list-group-item toggle-list">Add' +
          '<span class="plus"></span>'+
        '</a>' +
        '<form ng-show="addable && adding">' +
          '<input type="text" ng-model="newItem" placeholder="Adding to {{title}}">' +
          '<button type="button" ng-click="addItem()" class="btn btn-default btn-xs pull-right">Add</button>' +
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
    },
    transclude : false,
    link: function (scope, element, attrs) {
      scope.adding = false;

      scope.isSelected = function(listItem) {
        if (scope.selected) {
          for (var i = 0; i < scope.selected.length; i++) {
            if (scope.selected[i][scope.attribute] === listItem[scope.attribute]) {
              return true;
            }
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

      scope.add = function() {
        scope.adding = true;
      }

      scope.addItem = function() {
        var item = {};
        item[scope.attribute] = scope.newItem;
        var itemLC = scope.newItem.toLowerCase();
        var itemsLC = [];
        var selectedLC = [];

        for (var i = 0; i < scope.list.length; i++) {
          itemsLC.push(scope.list[i][scope.attribute].toLowerCase());
        }

        for (var i = 0; i < scope.selected.length; i++) {
          selectedLC.push(scope.list[i][scope.attribute].toLowerCase());
        }

        var index = itemsLC.indexOf(itemLC);
        if (index !== -1) {
          if (selectedLC.indexOf(itemLC) === -1) {
            scope.selected.push(scope.list[index]);
          }
        } else {
          scope.selected.push(item);
          scope.list.push(item);
        }

        scope.newItem = '';
        scope.adding = false;
      };
    }
  };
});
