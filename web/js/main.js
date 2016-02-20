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
                            c: reader.result.charAt(i),
                            style: {}
                        });
                    }
                    dc.pane = 'pane-decode';
                });
            });
            reader.readAsText(file);
        };

        this.apply_rules = function() {
            rule_highlight_newlines = new RuleHighlightNewLines();
            $scope.$apply(function() {
                for (i = 0; i < dc.bytes.length; i++) {
//                    if (dc.bytes[i].d == 10) {
//                        dc.bytes[i].style.background = 'white';
//                        dc.bytes[i].style.color = 'black';
                    //                    }
                    rule_highlight_newlines.apply(dc.bytes, i);
                }
            });
        };
    }]);
