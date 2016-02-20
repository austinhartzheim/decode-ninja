var rules = [];


function RuleHighlightNewLines() {
    this.fields = {
        color_fg: {
            name: 'Foreground Color',
            value: 'black',
            type: 'text'
        },
        color_bg: {
            name: 'Background Color',
            value: 'white',
            type: 'text'
        }
    };
    
    this.name = 'Highlight Newlines';
    this.apply = function(bytes, i) {
        if (bytes[i].d == 10) {
            bytes[i].style.background = this.fields.color_bg.value;
            bytes[i].style.color = this.fields.color_fg.value;
        }
    };

    this.post_apply = function(bytes) {

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
            value: 'white',
            type: 'text'
        },
        color_bg: {
            name: 'Background Color',
            value: 'red',
            type: 'text'
        }
    };

    this.name = 'Highlight Null Bytes';
    this.apply = function(bytes, i) {
        if (bytes[i].d == 0) {
            bytes[i].style.background = this.fields.color_bg.value;
            bytes[i].style.color = this.fields.color_fg.value;
        }
    };

    this.post_apply = function(bytes) {

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
            value: '0,0',
            type: 'text'
        },
        comment: {
            name: 'Comment',
            value: '',
            type: 'text'
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

    this.post_apply = function(bytes) {

    };
}
rules.push({
    name: 'Find Constant Byte Sequences',
    desc: '...',
    obj: RuleFindConstantBytes
});


function RuleComment() {
    this.fields = {
        byte_index: {
            name: 'Byte Index',
            value: 0,
            type: 'number'
        },
        comment: {
            name: 'Comment',
            value: '',
            type: 'text'
        }
    };

    this.name = 'Comment';
    this.apply = function(bytes, i) {
        if (i == this.fields.byte_index.value) {
            bytes[i].style['border-width'] = 1;
            bytes[i].style['border-style'] = 'solid';
            bytes[i].style['border-color'] = 'orange';
        }
    };

    this.post_apply = function(bytes) {

    };
}
rules.push({
    name: 'Comment',
    desc: 'Place a comment on a specific byte,',
    obj: RuleComment
});
