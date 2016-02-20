var rules = [];


function RuleHighlightNewLines() {
    this.fields = {
        color_fg: {
            name: 'Foreground Color',
            value: 'black'
        },
        color_bg: {
            name: 'Background Color',
            value: 'white'
        }
    };
    
    this.name = 'Highlight Newlines';
    this.apply = function(bytes, i) {
        if (bytes[i].d == 10) {
            bytes[i].style.background = this.fields.color_bg.value;
            bytes[i].style.color = this.fields.color_fg.value;
        }
    };
}
rules.push({
    name: 'Highlight Newlines',
    desc: 'Find newline characters in a file and highlight them.',
    obj: RuleHighlightNewLines
});


function RuleHighlightNullBytes() {
    this.fields = {
        color_fg: {
            name: 'Foreground Color',
            value: 'white'
        },
        color_bg: {
            name: 'Background Color',
            value: 'red'
        }
    };

    this,name = 'Highlight Null Bytes';
    this.apply = function(bytes, i) {
        if (bytes[i].d == 0) {
            bytes[i].style.background = this.fields.color_bg.value;
            bytes[i].style.color = this.fields.color_fg.value;
        }
    };
}
rules.push({
    name: 'Highlight Null Bytes',
    desc: 'Highlight all null (zero) bytes in a file.',
    obj: RuleHighlightNullBytes
});
