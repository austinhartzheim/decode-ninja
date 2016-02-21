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
        this.session_id = null;
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

        this.apply_hack = function() {
            $scope.$apply(function() {});
        };

        this.restore_session = function() {
            this.session_id = parseInt(prompt('Please enter a session ID number:'));
            $.post('https://qn05wlnvgl.execute-api.us-east-1.amazonaws.com/prod/new-session-save',
                   JSON.stringify({id: this.session_id}))
                .done(function(data) {
                    console.log(data);
                    dc.rules = [];
                    for (var i = 0; i < data.rules.length; i++) {
                        rule = new rules[data.rules[i].id].obj();
                        for (fn of Object.keys(data.rules[i].fields)) {
                            console.log('rule.fields', rule.fields);
                            console.log('attempting to store to', fn, 'value', data.rules[i].fields[fn]);
                            rule.fields[fn].value = data.rules[i].fields[fn];
                        }
                        dc.rules.push(rule);
                    }
                    dc.apply_rules();
                    dc.apply_hack();
                })
                .fail(function() {
                    console.log('Request to API failed.');
                    dc.session_id = null;
                });
        };

        this.save_session = function() {
            this.session_id = Math.round(Math.random() * 9999999);
            console.log('Generated new Session ID:', this.session_id);

            obj = {id: this.session_id, rules: []};
            for (var i = 0; i < dc.rules.length; i++) {
                obj.rules.push(dc.rules[i].save());
            }

            // POST the data
            $.ajax('https://qn05wlnvgl.execute-api.us-east-1.amazonaws.com/prod/save-session',
                   {
                       method: 'POST',
                       data: JSON.stringify(obj),
                       headers: {
                           'x-api-key': 'aWrq3X0KxJabMFy0F7ftm2pJsULPF0mu6jEz8PDz'
                       }
                   }
                  )
                .done(function(data) {
                    console.log(data);
                })
                .fail(function(error) {
                    console.log('Save failed');
                    console.log(error);
                });
        };
    }]);
