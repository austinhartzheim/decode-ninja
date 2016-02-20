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
                            c: get_char(reader.result.charCodeAt(i)),
                            style: {}
                        });
                    }
                    dc.pane = 'pane-decode';
                    dc.apply_rules();
                });
            });
            reader.readAsText(file);
        };

        this.list_available_rules = function() {
            return rules;
        };

        this.apply_rules = function() {
            dc.reset_colors();
            for (i = 0; i < dc.bytes.length; i++) {
                for (j = 0; j < dc.rules.length; j++) {
                    dc.rules[j].apply(dc.bytes, i);
                }
            }
        };

        this.reset_colors = function() {
            for (i = 0; i < dc.bytes.length; i++) {
                dc.bytes[i].style = {};
            }
        };

        this.add_rule = function(rule) {
            this.rules.push(new rule());
            this.apply_rules();
        };
    }]);
