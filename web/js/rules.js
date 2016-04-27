var rules = [];


function RuleHighlightNewLines() {
  this.fields = {
    color_fg: {
      name: 'Foreground Color',
      value: 'red',
      type: 'text'
    },
    color_bg: {
      name: 'Background Color',
      value: 'lightgray',
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

  this.save = function() {
    return {
      id: 0,
      fields: {
        color_fg: this.fields.color_fg.value,
        color_bg: this.fields.color_bg.value
      }
    };
  };

  this.post_apply = function(bytes) {

  };
}
rules.push({
  name: 'Highlight Newlines',
  desc: 'Find newline characters in a file and highlight them.',
  obj: RuleHighlightNewLines,
  id: 0
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

  this.save = function() {
    return {
      id: 1,
      fields: {
        color_fg: this.fields.color_fg.value,
        color_bg: this.fields.color_bg.value
      }
    };
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
  obj: RuleHighlightNullBytes,
  id: 1
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

  this.save = function() {
    return {
      id: 2,
      fields: {
        byte_sequence: this.fields.byte_sequence.value,
        comment: this.fields.comment.value
      }
    };
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
  obj: RuleFindConstantBytes,
  id: 2
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

  this.save = function() {
    return {
      id: 3,
      fields: {
        byte_index: this.fields.byte_index.value,
        comment: this.fields.comment.value
      }
    };
  };

  this.apply = function(bytes, i) {

  };
  
  this.post_apply = function(bytes) {
    bytes[this.fields.byte_index.value].style['border-width'] = '1px';
    bytes[this.fields.byte_index.value].style['border-style'] = 'solid';
    bytes[this.fields.byte_index.value].style['border-color'] = 'orange';
  };
}
rules.push({
  name: 'Comment',
  desc: 'Place a comment on a specific byte,',
  obj: RuleComment,
  id: 3
});

count = 0;
function RulePrefixLengthData() {
  this.fields = {
    prefix: {
      name: 'Prefix Bytes',
      value: '0,0',
      type: 'text'
    },
    length_byte_count: {
      name: 'Length Field Size',
      value: 2,
      type: 'number'
    }
  };

  this.name = 'Prefix, Length, Payload';

  this.save = function() {
    return {
      id: 4,
      fields: {
        prefix: this.fields.prefix.value,
        length_byte_count: this.fields.length_byte_count.value
      }
    };
  };

  this.sequence_index = 0;
  this.data_size = 0;
  this.apply = function(bytes, i) {
    target = this.fields.prefix.value.split(',');
    if (target.length == 0) return;
    for (var j = 0; j < target.length; j++)
      target[j] = parseInt(target[j], 16);

    if (i == 0)  // Need to reset any latent remains
      this.sequence_index = 0;

    // Colorize the prefix, data length, and payload bytes
    if (this.sequence_index < target.length) {  // Still finding the prefix
      this.data_size = 0;
      if (bytes[i].d == target[this.sequence_index])
        this.sequence_index++;
      else
        this.sequence_index = 0;

      if (this.sequence_index == target.length) {
        for (var j = i; j > i - target.length; j--) {
          bytes[j].style.background = 'orange';
        }
      }
    } else if (this.sequence_index < target.length + this.fields.length_byte_count.value) { // In the data field
      // Set this.data_size here
      // TODO: implement bit shifting.
      this.data_size += bytes[i].d;
      console.log('Increasing data size by ', bytes[i].d, ' from cell ', i);
      if (bytes[i].d > 1) {
        console.log('sequence_index', this.sequence_index);
        console.log('target.length', target.length);
        console.log('fied count', this.fields.length_byte_count.value);
        console.log('data_size', this.data_size);
        console.trace();
      }
      bytes[i].style.background = 'blue';
      bytes[i].style.color = 'white';
      this.sequence_index++;
    } else if (this.sequence_index < target.length + this.fields.length_byte_count.value + this.data_size) {
      bytes[i].style.background = 'green';
      bytes[i].style.color = 'white';
      this.sequence_index++;
      console.log('diff', this.sequence_index - (target.length + this.fields.length_byte_count.value + this.data_size));
      if (this.sequence_index == target.length + this.fields.length_byte_count.valute + this.data_size) {
        this.sequence_index = 0;
      }
    } else {  // Beyond data segment
      this.sequence_index = 0;
    }
    
  };

  this.post_apply = function(bytes) {};
  this.waste = function(bytes) {
    // Parse the user-given prefix into integer values
    target = this.fields.prefix.value.split(',');
    if (target.length == 0) return;
    for (var j = 0; j < target.length; j++)
      target[j] = parseInt(target[j], 16);

    // Colorize the prefix, data length and payload bytes
    var seq_progress = 0;
    var data_size = 0;
    for (var i = 0; i < bytes.length; i++) {
      if (seq_progress < target.length) {
        if (bytes[i] == target[seq_progress])
          seq_progress++;
        else
          seq_progress = 0;
      } else if (seq_progress == target.length) {
        for (var j = i - target.length; j < i; j++) {
          bytes[j].style.background = 'orange';
          bytes[j].style.color = 'black';
        }
        for (var j = i; j < i + this.fields.length_byte_count; j++) {
          data_size += bytes[i];
          bytes[j].style.background = 'blue';
          bytes[j].style.color = 'white';
        }
        i = j;
      } else {
        for (var j = i; j < i + data_size; j++) {
          bytes[j].style.background = 'green';
          bytes[j].style.color = 'white';
        }
      }
      
    }

  };
}
rules.push({
  name: 'Prefix, Length, Payload',
  desc: 'Detect the standard prefix, length, data payloads.',
  obj: RulePrefixLengthData,
  id: 4
});
