var rules = [];


function RuleHighlightNewLines() {
    this.color_bg = 'white';
    this.color_fg = 'black';
    
    this.name = 'Highlight Newlines';
    this.apply = function(bytes, i) {
        if (bytes[i].d == 10) {
            bytes[i].style.background = this.color_bg;
            bytes[i].style.color = this.color_fg;
        }
    };
}
rules.push({
    name: 'Highlight Newlines',
    desc: 'Find newline characters in a file and highlight them.',
    obj: RuleHighlightNewLines
});
