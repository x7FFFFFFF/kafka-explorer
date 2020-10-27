var app = angular.module('app', ['ngMaterial', 'md.data.table', 'ngSanitize']);
app.controller('MsgCtrl', [ '$scope',  'RestService', '$mdEditDialog', function ($scope, RestService, $mdEditDialog) {
  'use strict';

  $scope.selected = [];

  $scope.query = {
    order: 'created',
    limit: 5,
    page: 1,
    topic: 'lunda_stocks'
  };
   RestService.getMssgs($scope.query, success);

  function success(desserts) {
    $scope.desserts = {data: desserts.data.content, count: desserts.data.totalElements};
  }

  $scope.getDesserts = function () {
    $scope.promise = RestService.getMssgs($scope.query, success).$promise;
  };
  $scope.view = function (event, dessert) {
        event.stopPropagation();
         let editDialog = {
              modelValue: dessert.message.replace(/\n/g, "<br />"),
             /* placeholder: 'Add a comment',*/
              save: function (input) {
               /* if(input.$modelValue === 'Donald Trump') {
                  input.$invalid = true;
                  return $q.reject();
                }
                if(input.$modelValue === 'Bernie Sanders') {
                  return dessert.comment = 'FEEL THE BERN!'
                }
                dessert.comment = input.$modelValue;*/
              },
              targetEvent: event,
              title: 'Message',
              /*validators: {
                'md-maxlength': 30
              }*/
            };

           /* var promise;

            if($scope.options.largeEditDialog) {*/
              let promise = $mdEditDialog.large(editDialog);
           /* } else {
              promise = $mdEditDialog.small(editDialog);
            }*/

  };

}]);

/*var app = angular.module('app', ['ui.grid', 'ui.grid.pagination', 'ui.bootstrap', 'ngSanitize']);*/


/*function RowEditCtrl($scope, $modalInstance, PersonSchema, row) {
    $scope.entity = angular.copy(row.entity);
    $scope.entity.message =  $scope.entity.message.replace(/\n/g, "<br />");
}

app.controller('MsgCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.datepicker = {
               language: 'ru',
               format: 'M d, yyyy'
             }

    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 5,
        sort: null
    };
    $scope.editRow = function editRow(grid, row) {
        $modal.open({
            templateUrl: 'edit-modal.html',
            controller: ['$scope', '$modalInstance', 'grid', 'row', RowEditCtrl],
            resolve: {
                grid: function () {
                    return grid;
                },
                row: function () {
                    return row;
                }
            }
        });
    }

    $scope.topic = 'lunda_stocks';
    $scope.topicChange = function () {
        $scope.reloadMessages();
    }
    RestService.getTopics().success(function (data) {
        $scope.topics = data;
    });
    $scope.reloadMessages = function () {
        RestService.getMessages($scope.topic, $scope.paginationOptions.pageNumber,
            $scope.paginationOptions.pageSize).success(function (data) {
            $scope.gridOptions.data = data.content;
            $scope.gridOptions.totalItems = data.totalElements;
        });
    }
    $scope.reloadMessages();

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: $scope.paginationOptions.pageSize,
        enableColumnMenus: false,
        useExternalPagination: true,
        rowHeight:40,
        columnDefs: [
            {name: 'partition', width: 30},
            {name: 'topic', width: 150},
            {name: 'created', width: 210},
            {name: 'key',  width: 70},
            {name: 'message'},
            {field: 'button', name: '', cellTemplate: 'edit-button.html', width: 65}
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                $scope.paginationOptions.pageNumber = newPage;
                $scope.paginationOptions.pageSize = pageSize;
                $scope.reloadMessages();
            });
        }
    };

}]);*/

app.service('RestService', ['$http', function ($http) {



    function getMessages(topic, pageNumber, size) {
        pageNumber = pageNumber > 0 ? pageNumber - 1 : 0;
        return $http({
            method: 'GET',
            url: 'api/messages/?topic=' + topic + '&page=' + pageNumber + '&size=' + size
        });
    }


    return {
        getMessages: getMessages,
        getTopics: function () {
            return $http({
                method: 'GET',
                url: 'api/topics'
            });
        },
        getMssgs: function(query, successCallback) {
                pageNumber = query.page > 0 ? query.page - 1 : 0;
                return $http({
                    method: 'GET',
                    url: 'api/messages/?topic=' + query.topic + '&page=' + pageNumber + '&size=' + query.limit
                }).then(successCallback);
            }
    };

}]);
