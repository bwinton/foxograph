foxographApp.directive('toggleList', function () {
  return {
    templateUrl: '/r/js/directives/toggleList.html',
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
      scope.form = {
        adding: false,
        newItem: '',
      };

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
      };

      scope.toggle = function(listItem) {
        if (scope.isSelected(listItem)) {
          var newSelected = [];
          for (var i = 0; i < scope.selected.length; i++) {
            if (scope.selected[i][scope.attribute] !== listItem[scope.attribute]) {
              newSelected.push(scope.selected[i]);
            }
          }
          scope.selected = newSelected;
        } else {
          scope.selected.push(listItem);
        }
      };

      scope.add = function() {
        scope.form.adding = true;
      };

      scope.addItem = function() {
        var item = {};
        item[scope.attribute] = scope.form.newItem;
        var itemLC = scope.form.newItem.toLowerCase();
        var itemsLC = [];
        var selectedLC = [];

        for (var i = 0; i < scope.list.length; i++) {
          itemsLC.push(scope.list[i][scope.attribute].toLowerCase());
        }

        for (i = 0; i < scope.selected.length; i++) {
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

        scope.form.newItem = '';
        scope.form.adding = false;
      };
    }
  };
});
