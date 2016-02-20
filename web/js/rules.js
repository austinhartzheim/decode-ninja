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
