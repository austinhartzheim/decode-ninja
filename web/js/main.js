// packet layout
// {
//   'bytes': [],
//   'style': []
// }

angular.module('decodeninja', [])
    .controller('DecodeController', ['$scope', function($scope) {
        dc = this;
        this.pane = 'pane-upload-file';
        this.bytes = [];
        this.plain = [];
        this.rules = [];
        this.upload_box = null;
        this.hover_index = -1;
        this.check_file = function() {
            console.log('triggered');
            console.log(this.upload_box);
        };
        this.file_changed = function(file) {
            console.log(file);
            reader = new FileReader();
            reader.addEventListener('loadend', function() {
                $scope.$apply(function() {
                    packet = {bytes: []};
                    for (i = 0; i < reader.result.length; i++) {
                        dc.bytes.push({
                            d: reader.result.charCodeAt(i),
                            c: reader.result.charAt(i)
                        });
                    }
                    dc.pane = 'pane-decode';
                });
            });
            reader.readAsText(file);
        };
    }]);
