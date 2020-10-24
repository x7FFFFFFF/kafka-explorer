var app = angular.module('app', ['ui.grid', 'ui.grid.pagination', 'ui.bootstrap', 'ngSanitize']);

function RowEditCtrl($scope, $modalInstance, PersonSchema, row) {


    //vm.schema = PersonSchema;
    $scope.entity = angular.copy(row.entity);
    $scope.entity.message =  $scope.entity.message.replace(/\n/g, "<br />")
   /* vm.form = [
        'name',
        'company',
        'phone',
        {
            'key': 'address.city',
            'title': 'City'
        },
    ];*/

 /*   vm.save = function save() {
        // Copy row values over
        row.entity = angular.extend(row.entity, vm.entity);
        $modalInstance.close(row.entity);
    }*/
}

app.controller('MsgCtrl', ['$scope', '$modal', 'RestService', function ($scope, $modal, RestService) {
    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 5,
        sort: null
    };
    //var vm = this;
    $scope.editRow = function editRow(grid, row) {
        $modal.open({
            templateUrl: 'edit-modal.html',
            controller: ['$scope', '$modalInstance', 'grid', 'row', RowEditCtrl],
            //controllerAs: 'vm',
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

    /*  RestService.getMessages($scope.topic, paginationOptions.pageNumber,
          paginationOptions.pageSize).success(function (data) {
          $scope.gridOptions.data = data.content;
          $scope.gridOptions.totalItems = data.totalElements;
      });*/

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: $scope.paginationOptions.pageSize,
        enableColumnMenus: false,
        useExternalPagination: true,
        columnDefs: [
            {field: 'button', name: '', cellTemplate: 'edit-button.html', width: 64},
            {name: 'id'},
            {name: 'topic'},
            {name: 'created'},
            {name: 'message'},
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                $scope.paginationOptions.pageNumber = newPage;
                $scope.paginationOptions.pageSize = pageSize;
                $scope.reloadMessages();
                /* RestService.getMessages($scope.topic, newPage, pageSize).success(function (data) {
                     $scope.gridOptions.data = data.content;
                     $scope.gridOptions.totalItems = data.totalElements;
                 });*/
            });
        }
    };

}]);

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
        }
    };

}]);
