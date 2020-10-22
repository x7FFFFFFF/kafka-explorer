var app = angular.module('app', ['ui.grid', 'ui.grid.pagination']);

app.controller('StudentCtrl', ['$scope', 'RestService', function ($scope, RestService) {
    let paginationOptions = {
        pageNumber: 1,
        pageSize: 5,
        sort: null
    };
    this.getTopic = getTopic;

    RestService.getMessages(paginationOptions.pageNumber,
        paginationOptions.pageSize).success(function (data) {
        $scope.gridOptions.data = data.content;
        $scope.gridOptions.totalItems = data.totalElements;
    });

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 20],
        paginationPageSize: paginationOptions.pageSize,
        enableColumnMenus: false,
        useExternalPagination: true,
        columnDefs: [
            {name: 'id'},
            {name: 'topic'},
            {name: 'created'},
            {name: 'message'},
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
                paginationOptions.pageNumber = newPage;
                paginationOptions.pageSize = pageSize;
                RestService.getMessages(newPage, pageSize).success(function (data) {
                    $scope.gridOptions.data = data.content;
                    $scope.gridOptions.totalItems = data.totalElements;
                });
            });
        }
    };

}]);

function getTopic() {
    return window.location.hash ? window.location.hash.substr(1) : 'lunda_stocks'
}

app.service('RestService', ['$http', function ($http) {

    function getMessages(pageNumber, size) {
        let topic = getTopic();
        pageNumber = pageNumber > 0 ? pageNumber - 1 : 0;
        return $http({
            method: 'GET',
            url: 'api/messages/?topic=' + topic + '&page=' + pageNumber + '&size=' + size
        });
    }

    return {
        getMessages: getMessages
    };

}]);
