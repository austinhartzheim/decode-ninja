angular.module('decodeninja', [])
    .controller('DecodeController', ['$scope', function($scope) {
        dc = this;
        this.pane = 'pane-upload-file';
        this.bytes = [];
        this.plain = [];
        this.rules = [];
        this.upload_box = null;
        this.check_file = function() {
            console.log('triggered');
            console.log(this.upload_box);
        };
        this.file_changed = function(file) {
            console.log(file);
            reader = new FileReader();
            reader.addEventListener('loadend', function() {
                $scope.$apply(function() {
                    console.log(reader.result);
                    for (i = 0; i < reader.result.length; i++) {
                        dc.bytes.push(reader.result.charCodeAt(i));
                        dc.plain.push(reader.result.charAt(i));
                    }
                    dc.pane = 'pane-decode';
                });
            });
            reader.readAsText(file);
        };
    }]);
