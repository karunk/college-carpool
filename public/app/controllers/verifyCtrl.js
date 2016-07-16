var app = angular.module('verifyCtrl', ['lService','formService','dashService','ngAnimate'])


app.controller('verifyController', function($scope, $stateParams, myModal, Form, ngProgressFactory, sharedProperties){

    var vm = this;
    $scope.setObject = function(newValue1, newValue2) {
        $scope.objectValue = sharedProperties.getObject();
        $scope.objectValue.data1 = newValue1;
        $scope.objectValue.data2 = newValue2;
    };
    $scope.setString = function(newValue) {
        sharedProperties.setString(newValue);
    };
     
    $scope.verifyId =   $stateParams.verifyId;
    this.show = myModal.activate;
    function verify(){
        $scope.progressbar = ngProgressFactory.createInstance();
        $scope.progressbar.setHeight('20px');
        $scope.progressbar.start();
        Form.verify($scope.verifyId)
            .success(function(data){
                if(!data.success){
                    sharedProperties.setSignal(false);
                    vm.modal_signal = "ERROR DURING VERIFICATION!";
                    vm.modal_message = data.message;
                }
                else{
                    sharedProperties.setSignal(true);
                    vm.modal_signal = "VERIFICATION COMPLETE!";
                    vm.modal_message = data.message;
                }
                $scope.setObject(vm.modal_signal, vm.modal_message );
            });
        
    };
                $scope.pop = function(){
                    $scope.requestCount++;
            toaster.pop({
                type: 'error',
                title: 'Title text',
                body: 'Body text',
                showCloseButton: true
            });
        };
    verify();
    $scope.progressbar.complete();
    $scope.setString('VERIFICATION');
    myModal.activate();

});