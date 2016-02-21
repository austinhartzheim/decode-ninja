function get_char(ascii) {
    if (ascii == 0)
        return '\\0';
    else if (ascii == 10)
        return '\\n';
    else
        return String.fromCharCode(ascii);
}
