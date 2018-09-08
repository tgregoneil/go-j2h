#!/usr/bin/node
// test.js

(function () {

    $(document)
    .ready (function () {
        var j2h = require ('go-j2h').displayOb;

        j2h ({
            span: {label: 'test go-j2h'}, 
            style: "border: 1px solid blue;" +
                "border-radius: 4px;" +
                "background-color: #ccffcc;"
        });

        j2h ({br: 0});
        j2h ("plain text");

    });

}) ();
