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
                    dc.parseTextToBytes(reader.result);
                    dc.pane = 'pane-decode';
                    dc.apply_rules();
                });
            });
            reader.readAsText(file);
        };

        this.parseTextToBytes = function(text) {
            dc.bytes = [];
            for (i = 0; i < text.length; i++) {
                dc.bytes.push({
                    d: text.charCodeAt(i),
                    c: get_char(text.charCodeAt(i)),
                    style: {}
                });
            }
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
            for (j = 0; j < dc.rules.length; j++) {
                dc.rules[j].post_apply(dc.bytes);
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

        this.remove_rule = function(index) {
            this.rules.pop(index);
            this.apply_rules();
        };

        this.activate_hover = function(index) {
            this.bytes[index].style.opacity = 0.65;
        };
        this.deactivate_hover = function(index) {
            this.bytes[index].style.opacity = 1;
        };
    }]);
