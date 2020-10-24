var app = angular.module('app', ['ui.grid', 'ui.grid.pagination']);

app.controller('MsgCtrl', ['$scope', 'RestService', function ($scope, RestService) {
    $scope.paginationOptions = {
        pageNumber: 1,
        pageSize: 5,
        sort: null
    };

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
            {field: 'button', name: '', cellTemplate: 'edit-button.html', width: 34},
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
