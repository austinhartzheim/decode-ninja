function get_char(ascii) {
    if (ascii == 0)
        return '\\0';
    else if (ascii == 10)
        return '\\n';
    else if (ascii < 31 || ascii > 127)
        return '';
    else
        return String.fromCharCode(ascii);
}
