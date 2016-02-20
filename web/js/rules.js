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

    this.name = 'Highlight Null Bytes';
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


function RuleFindConstantBytes() {
    this.fields = {
        byte_sequence: {
            name: 'Byte Sequence',
            value: '0,0'
        },
        comment: {
            name: 'Comment',
            value: ''
        }
    };

    this.name = 'Find Constant Byte Sequences';

    this.sequence_index = 0;
    this.apply = function(bytes, i) {
        target = this.fields.byte_sequence.value.split(',');
        if (target.length == 0) return;
        for (var j = 0; j < target.length; j++)
            target[j] = parseInt(target[j], 16);

        if (bytes[i].d == target[this.sequence_index]) {
            this.sequence_index++;
        } else {
            this.sequence_index = 0;
        }
        if (this.sequence_index >= target.length) {
            for (j = i; j > i - target.length; j--) {
//                console.log('Recoloring byte', j);
                bytes[j].style.background = 'yellow';
                bytes[j].style.color = 'black';
            }
        }
    };
}
rules.push({
    name: 'Find Constant Byte Sequences',
    desc: '...',
    obj: RuleFindConstantBytes
});
