(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// go-j2h/index.js

module.exports = (function () {

// PRIVATE Properties/Methods
var v = {

    id: 0,
    primitiveTypesNotNull: {'string':1, 'number':1, 'boolean':1, 'symbol': 1},
        // since typeof null yields 'object', it's handled separately

    msgTypes: {

        primary: {
                // void tags
            area: 0, base: 0, br: 0, col: 0, embed: 0, hr: 0, img: 0, input: 0, keygen: 0, link: 0, meta: 0, param: 0, source: 0, track: 0, wbr: 0, 

                // non-void tags
            a: 1, abbr: 1, address: 1, article: 1, aside: 1, audio: 1, b: 1, bdi: 1, bdo: 1, blockquote: 1, body: 1, button: 1, canvas: 1, caption: 1, cite: 1, code: 1, colgroup: 1, datalist: 1, dd: 1, del: 1, details: 1, dfn: 1, dialog: 1, div: 1, dl: 1, dt: 1, em: 1, fieldset: 1, figcaption: 1, figure: 1, footer: 1, form: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, head: 1, header: 1, hgroup: 1, html: 1, i: 1, iframe: 1, ins: 1, kbd: 1, label: 1, legend: 1, li: 1, map: 1, mark: 1, menu: 1, meter: 1, nav: 1, noscript: 1, object: 1, ol: 1, optgroup: 1, option: 1, output: 1, p: 1, pre: 1, progress: 1, q: 1, rp: 1, rt: 1, ruby: 1, s: 1, samp: 1, script: 1, section: 1, select: 1, small: 1, span: 1, strong: 1, style: 1, sub: 1, summary: 1, sup: 1, svg: 1, table: 1, tbody: 1, td: 1, textarea: 1, tfoot: 1, th: 1, thead: 1, time: 1, title: 1, tr: 1, u: 1, ul: 1, 'var': 1, video: 1,
        },

        secondary: {style: 1},
            // elements that can be either a primary tag itself or an attribute of another primary tag
            // if any other primary tags is present, then secondary tags are treated as
            // attributes of the other primary tag

        meta: {
            empty: 1, rm: 1, 
            prepend: 1, append: 1, before: 1, after: 1, parent: 1,
            attr: 1, content: 1, text: 1, 
        },

    },

    msg0: require ('go-msg'),
    msg: null,

}; // end PRIVATE properties
var f={};

//---------------------
f.init = () => {
    
    v.msg = new v.msg0 (v.msgTypes);

}; // end f.init


//---------------------
f.attr = (selector, attr) => {
    
    $(selector)
    .attr (attr);

}; // end f.attr 


//---------------------
f.empty = (selector) => {
    
    $(selector)
    .empty ()
    .off ('keydown');

}; // end f.empty 



//---------------------
f.rm = (selector) => {

    $(selector)
    .remove ();

}; // end f.rm


//---------------------
f.displayObH = (parent, dispOb) => {
    
        // ----  doArray ----
    var doArray = function (dispOb) {

        var Ids = [];
        for (var i = 0; i < dispOb.length; i++) {

            Ids.push (f.displayObH (parent, dispOb [i]));

        } // end for (var i = 0; i < dispOb.length; i++)

        //return Ids;
        return Ids [Ids.length - 1];
        
    };  // end doArray 

        // ----  doObject ----
    var doObject = function (dispOb) {

        var dispObParsed = v.msg.parseMsg (dispOb);

        var primaryKey = dispObParsed.p;

        var meta = dispObParsed.m;

        var delKey = null;
        var relLoc = 'append';

        var attr = null;
        var content = null;
        var text = null;

        if (meta.hasOwnProperty ('parent')) {
            // ensures processing of 'parent' before remainder of meta keys

            parent = meta.parent;
            delete meta.parent;

        } // end if (meta.hasOwnProperty ('parent'))
        
        var metaKeys = Object.keys (meta);
        for (var idx = 0; idx < metaKeys.length; idx++) {

            var key = metaKeys [idx];
            switch (key) {

                case 'empty':
                case 'rm':
                    delKey = key;
                    parent = meta [key];
                    break;

                case 'attr':
                    attr = meta.attr;
                    break;

                case 'content':
                    content = meta.content;
                    break;
                case 'text':
                    text = meta.text;
                    break;

                case 'prepend':
                case 'append':
                case 'before':
                case 'after':
                    relLoc = key;
                    var val = meta [key];
                    var doParent = val !== 1 && val !== true;
                    parent = doParent ? val : parent;
                        // if val is other than 1 or true, relLoc overrides both parent values passed 
                        // into displayObH and defined by optional parent attribute
                    break;

            } // end switch (key)
            

        } // end for (var idx = 0; idx < metaKeys.length; idx++)
        

        Id = null;

        if (delKey) {

            f [delKey] (parent);

        } else if (attr) {

            f.attr (parent, attr);

        } else if (content) {
            // replaces entire content of parent with new content

            $(parent)
            .empty ();

            f.displayObH (parent, content);
                // without emptying first, will simply append content to existing content

        } else if (text) {

            Id = f.textMake (parent, relLoc, dispOb);

        } else {

            Id = f.elementMake (parent, relLoc, primaryKey, dispObParsed.c, dispObParsed.s);

        } // end if (delKey)

        return Id;
        
    };  // end doObject 



       // ---- main ----
    var Id;
    var dispObType = typeof dispOb;

    if (dispObType === 'undefined' || dispOb === 0 || dispOb === null) {

        Id = null;

    } else if (v.primitiveTypesNotNull.hasOwnProperty (dispObType)) {

        Id = f.textMake (parent, 'append', dispOb);
            // if text should be placed at other than 'append' location, then use
            // 'text' tag and specify prepend, after or before as needed

    } else if (Array.isArray (dispOb)) {

        Id = doArray (dispOb);

    } else if (dispObType == 'object') {

        Id = doObject (dispOb);

    } else {

        Id = null;

    } // end if (typeof dispOb === 'undefined' || dispOb === 0 || dispOb === null)
    
    return Id;

}; // end f.displayObH 

//---------------------
f.elementMake = (parentOrSiblId, relLoc, elName, content, attrs) => {
    
    var id;
    var attrKeys = Object.keys (attrs);
    var hasAttrs = attrKeys.length > 0;

    if (hasAttrs && attrs.hasOwnProperty ('id')) {

        id = attrs.id;

    } else {

        id = P.genId ();

    } // end if (hasAttrs)
    
    var Id = '#' + id;
    
    if (elName === 'script' && content !== 0) {
        // https://stackoverflow.com/questions/9413737/how-to-append-script-script-in-javascript
        // inspired by SO question, but setting innerHTML isn't supposed to work
        // therefore, set src attribute with path to file, instead of 
        // setting innerHTML to content of file

        // https://stackoverflow.com/questions/610995/cant-append-script-element
        // jQuery won't add script element as it does with any other element.  Therefore, must be done
        // using only javascript as follows:
        var script = document.createElement("script");

        script.src = content;
        script.id = attrs.id;
        
        document.head.appendChild(script);     

    } else {

        var divel = '<' + elName + ' id="' + id + '"';
    
        if (content) {
    
            divel += '></' + elName + '>';
    
        } else {
    
            divel += '>';
    
        } // end if (content)
    
        $(parentOrSiblId)[relLoc] (divel);

    } // end if (elName === 'script')
    
    
    if (hasAttrs) {
        
        $(Id)
        .attr (attrs);

    } // end if (hasAttrs)

    f.displayObH (Id, content);
    
    return Id;

}; // end f.elementMake


//---------------------
f.textMake = (parent, relLoc, primitive) => {
    
    if (typeof primitive === 'string') {
        
        var singlequote = '&#x0027;';
        var backslash = '&#x005c;';
        var doublequote = '&#x0022;';
        var lt = '&lt;';
        
        primitive = primitive.replace (/'/g, singlequote);
        primitive = primitive.replace (/"/g, doublequote);
        primitive = primitive.replace (/\\/g, backslash);
        primitive = primitive.replace (/</g, lt);

    } else if (typeof primitive === 'symbol') {

        primitive = 'symbol';
            // otherwise stringify would produce '{}' which is less useful

    } else {

        primitive = JSON.stringify (primitive);

    } // end if (typeof primitive === 'string')
    

    $(parent) [relLoc] (primitive);

    return null;
        // text obs have no id's: only text is appended with no way to address it
        // if addressing is necessary, use span instead of text

}; // end f.textMake 



// PUBLIC Properties/Methods
var P = {};

//---------------------
P.displayOb = (dispOb) => {
    
    var parent = 'body';
        // if parent not found, append to body

    if (typeof dispOb === 'object' && dispOb.hasOwnProperty ('parent')) {

        parent = dispOb.parent;

    } // end if (typeof dispOb === 'object' && dispOb.hasOwnProperty ('parent'))
    
    var Id = f.displayObH (parent, dispOb);

    return Id;

}; // end P.displayOb 

P.displayPage = P.displayOb;

//---------------------
P.genId = () => {

    var id = 'i' + v.id++;
    return id;

}; // end P.genId


//---------------------
P.genIds = () => {
    
    var id = P.genId ();
    var Id = '#' + id;

    return [id, Id];

}; // end P.genIds



// end PUBLIC section

f.init ();

return P;

}());




},{"go-msg":3}],2:[function(require,module,exports){

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

},{"go-j2h":1}],3:[function(require,module,exports){
// go-msg/index.js
// go-msg object has a unique primary msg and zero or more optional attributes


module.exports = function (p0) {

    // PRIVATE Properties
var v = {

    primary: null,
        // primary: {cmd: 1} (contains optional content) or {cmd: 0} (no optional content allowed)

    secondary: null,
        // if a primary message has an optional attribute that concidentally is the same as
        // another primary message, it should be have a key/value pair in secondary {attr: 1}
        // to ensure that it will be treated as an attribute in case a primary is present
        // Secondary is only tested if there exists a primary key

    meta: null,
        // meta parameters intended for ctrl or other purpose outside of primary and secondary msg
        // parameter usage

};  // end PRIVATE properties

    // PRIVATE Functions
f = {};


f.init = () => {

    v.primary = p0.primary;
    v.secondary = p0.hasOwnProperty ('secondary') ? p0.secondary : {};
    v.meta = p0.hasOwnProperty ('meta') ? p0.meta : {};
};

    // PUBLIC Functions
var P = {};

//---------------------
P.parseMsg = (msgOb) => {
    
    var res = {};
    var msgKeys = Object.keys (msgOb);

    var primaryCandidatesOb = {};
    var attrsOb = {};
    var metaOb = {};

    var key;
    for (var i = 0; i < msgKeys.length; i++) {

        key = msgKeys [i];
        
        if (v.primary.hasOwnProperty (key)) {

            primaryCandidatesOb [key] = 1;

        } else if (v.meta.hasOwnProperty (key)) {

            metaOb [key] = msgOb [key];

        } else {

            attrsOb [key] = msgOb [key];

        } // end if (v.primary.hasOwnProperty (key))
        
    } // end for (var i = 0; i < msgKeys.length; i++)

    var primaryCandidatesA = Object.keys (primaryCandidatesOb);

    var primaryKey;
    var content;

    if (primaryCandidatesA.length === 0) {

        primaryKey = null;

    } else if (primaryCandidatesA.length === 1) {

        primaryKey = primaryCandidatesA [0];

    } else {
        // handle primary/secondary key resolution

        primaryKey = null;
        for (key in primaryCandidatesOb) {

            if (v.secondary.hasOwnProperty (key)) {

                attrsOb [key] = msgOb [key];

            } else {

                if (primaryKey === null) {

                    primaryKey = key;

                } else {

                    res.err = 'Multiple primary keys found not in secondary object: ' + JSON.stringify (msg);

                } // end if (primaryKey === null)
                

            } // end if (v.secondary.hasOwnProperty (key))
            
        }

    } // end if (primaryCandidatesA.length === 0)


    if (!res.hasOwnProperty ('err')) {

        res.p = primaryKey;
        res.c = primaryKey && v.primary [primaryKey] !== 0 ? msgOb [primaryKey] : null;
            // example void html tag has zero content, so content is forced to null

        res.s = attrsOb;
        res.m = metaOb;

    } // end if (!res.hasOwnProperty ('err'))
    
    
    return res;

}; // end P.parseMsg 



    // end PUBLIC Functions

f.init ();

return P;

};




},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlc19nbG9iYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInRlc3QuanMiLCIuLi9nby1tc2cvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBnby1qMmgvaW5kZXguanNcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuXG4vLyBQUklWQVRFIFByb3BlcnRpZXMvTWV0aG9kc1xudmFyIHYgPSB7XG5cbiAgICBpZDogMCxcbiAgICBwcmltaXRpdmVUeXBlc05vdE51bGw6IHsnc3RyaW5nJzoxLCAnbnVtYmVyJzoxLCAnYm9vbGVhbic6MSwgJ3N5bWJvbCc6IDF9LFxuICAgICAgICAvLyBzaW5jZSB0eXBlb2YgbnVsbCB5aWVsZHMgJ29iamVjdCcsIGl0J3MgaGFuZGxlZCBzZXBhcmF0ZWx5XG5cbiAgICBtc2dUeXBlczoge1xuXG4gICAgICAgIHByaW1hcnk6IHtcbiAgICAgICAgICAgICAgICAvLyB2b2lkIHRhZ3NcbiAgICAgICAgICAgIGFyZWE6IDAsIGJhc2U6IDAsIGJyOiAwLCBjb2w6IDAsIGVtYmVkOiAwLCBocjogMCwgaW1nOiAwLCBpbnB1dDogMCwga2V5Z2VuOiAwLCBsaW5rOiAwLCBtZXRhOiAwLCBwYXJhbTogMCwgc291cmNlOiAwLCB0cmFjazogMCwgd2JyOiAwLCBcblxuICAgICAgICAgICAgICAgIC8vIG5vbi12b2lkIHRhZ3NcbiAgICAgICAgICAgIGE6IDEsIGFiYnI6IDEsIGFkZHJlc3M6IDEsIGFydGljbGU6IDEsIGFzaWRlOiAxLCBhdWRpbzogMSwgYjogMSwgYmRpOiAxLCBiZG86IDEsIGJsb2NrcXVvdGU6IDEsIGJvZHk6IDEsIGJ1dHRvbjogMSwgY2FudmFzOiAxLCBjYXB0aW9uOiAxLCBjaXRlOiAxLCBjb2RlOiAxLCBjb2xncm91cDogMSwgZGF0YWxpc3Q6IDEsIGRkOiAxLCBkZWw6IDEsIGRldGFpbHM6IDEsIGRmbjogMSwgZGlhbG9nOiAxLCBkaXY6IDEsIGRsOiAxLCBkdDogMSwgZW06IDEsIGZpZWxkc2V0OiAxLCBmaWdjYXB0aW9uOiAxLCBmaWd1cmU6IDEsIGZvb3RlcjogMSwgZm9ybTogMSwgaDE6IDEsIGgyOiAxLCBoMzogMSwgaDQ6IDEsIGg1OiAxLCBoNjogMSwgaGVhZDogMSwgaGVhZGVyOiAxLCBoZ3JvdXA6IDEsIGh0bWw6IDEsIGk6IDEsIGlmcmFtZTogMSwgaW5zOiAxLCBrYmQ6IDEsIGxhYmVsOiAxLCBsZWdlbmQ6IDEsIGxpOiAxLCBtYXA6IDEsIG1hcms6IDEsIG1lbnU6IDEsIG1ldGVyOiAxLCBuYXY6IDEsIG5vc2NyaXB0OiAxLCBvYmplY3Q6IDEsIG9sOiAxLCBvcHRncm91cDogMSwgb3B0aW9uOiAxLCBvdXRwdXQ6IDEsIHA6IDEsIHByZTogMSwgcHJvZ3Jlc3M6IDEsIHE6IDEsIHJwOiAxLCBydDogMSwgcnVieTogMSwgczogMSwgc2FtcDogMSwgc2NyaXB0OiAxLCBzZWN0aW9uOiAxLCBzZWxlY3Q6IDEsIHNtYWxsOiAxLCBzcGFuOiAxLCBzdHJvbmc6IDEsIHN0eWxlOiAxLCBzdWI6IDEsIHN1bW1hcnk6IDEsIHN1cDogMSwgc3ZnOiAxLCB0YWJsZTogMSwgdGJvZHk6IDEsIHRkOiAxLCB0ZXh0YXJlYTogMSwgdGZvb3Q6IDEsIHRoOiAxLCB0aGVhZDogMSwgdGltZTogMSwgdGl0bGU6IDEsIHRyOiAxLCB1OiAxLCB1bDogMSwgJ3Zhcic6IDEsIHZpZGVvOiAxLFxuICAgICAgICB9LFxuXG4gICAgICAgIHNlY29uZGFyeToge3N0eWxlOiAxfSxcbiAgICAgICAgICAgIC8vIGVsZW1lbnRzIHRoYXQgY2FuIGJlIGVpdGhlciBhIHByaW1hcnkgdGFnIGl0c2VsZiBvciBhbiBhdHRyaWJ1dGUgb2YgYW5vdGhlciBwcmltYXJ5IHRhZ1xuICAgICAgICAgICAgLy8gaWYgYW55IG90aGVyIHByaW1hcnkgdGFncyBpcyBwcmVzZW50LCB0aGVuIHNlY29uZGFyeSB0YWdzIGFyZSB0cmVhdGVkIGFzXG4gICAgICAgICAgICAvLyBhdHRyaWJ1dGVzIG9mIHRoZSBvdGhlciBwcmltYXJ5IHRhZ1xuXG4gICAgICAgIG1ldGE6IHtcbiAgICAgICAgICAgIGVtcHR5OiAxLCBybTogMSwgXG4gICAgICAgICAgICBwcmVwZW5kOiAxLCBhcHBlbmQ6IDEsIGJlZm9yZTogMSwgYWZ0ZXI6IDEsIHBhcmVudDogMSxcbiAgICAgICAgICAgIGF0dHI6IDEsIGNvbnRlbnQ6IDEsIHRleHQ6IDEsIFxuICAgICAgICB9LFxuXG4gICAgfSxcblxuICAgIG1zZzA6IHJlcXVpcmUgKCdnby1tc2cnKSxcbiAgICBtc2c6IG51bGwsXG5cbn07IC8vIGVuZCBQUklWQVRFIHByb3BlcnRpZXNcbnZhciBmPXt9O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5pbml0ID0gKCkgPT4ge1xuICAgIFxuICAgIHYubXNnID0gbmV3IHYubXNnMCAodi5tc2dUeXBlcyk7XG5cbn07IC8vIGVuZCBmLmluaXRcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5hdHRyID0gKHNlbGVjdG9yLCBhdHRyKSA9PiB7XG4gICAgXG4gICAgJChzZWxlY3RvcilcbiAgICAuYXR0ciAoYXR0cik7XG5cbn07IC8vIGVuZCBmLmF0dHIgXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYuZW1wdHkgPSAoc2VsZWN0b3IpID0+IHtcbiAgICBcbiAgICAkKHNlbGVjdG9yKVxuICAgIC5lbXB0eSAoKVxuICAgIC5vZmYgKCdrZXlkb3duJyk7XG5cbn07IC8vIGVuZCBmLmVtcHR5IFxuXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYucm0gPSAoc2VsZWN0b3IpID0+IHtcblxuICAgICQoc2VsZWN0b3IpXG4gICAgLnJlbW92ZSAoKTtcblxufTsgLy8gZW5kIGYucm1cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5kaXNwbGF5T2JIID0gKHBhcmVudCwgZGlzcE9iKSA9PiB7XG4gICAgXG4gICAgICAgIC8vIC0tLS0gIGRvQXJyYXkgLS0tLVxuICAgIHZhciBkb0FycmF5ID0gZnVuY3Rpb24gKGRpc3BPYikge1xuXG4gICAgICAgIHZhciBJZHMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwT2IubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgSWRzLnB1c2ggKGYuZGlzcGxheU9iSCAocGFyZW50LCBkaXNwT2IgW2ldKSk7XG5cbiAgICAgICAgfSAvLyBlbmQgZm9yICh2YXIgaSA9IDA7IGkgPCBkaXNwT2IubGVuZ3RoOyBpKyspXG5cbiAgICAgICAgLy9yZXR1cm4gSWRzO1xuICAgICAgICByZXR1cm4gSWRzIFtJZHMubGVuZ3RoIC0gMV07XG4gICAgICAgIFxuICAgIH07ICAvLyBlbmQgZG9BcnJheSBcblxuICAgICAgICAvLyAtLS0tICBkb09iamVjdCAtLS0tXG4gICAgdmFyIGRvT2JqZWN0ID0gZnVuY3Rpb24gKGRpc3BPYikge1xuXG4gICAgICAgIHZhciBkaXNwT2JQYXJzZWQgPSB2Lm1zZy5wYXJzZU1zZyAoZGlzcE9iKTtcblxuICAgICAgICB2YXIgcHJpbWFyeUtleSA9IGRpc3BPYlBhcnNlZC5wO1xuXG4gICAgICAgIHZhciBtZXRhID0gZGlzcE9iUGFyc2VkLm07XG5cbiAgICAgICAgdmFyIGRlbEtleSA9IG51bGw7XG4gICAgICAgIHZhciByZWxMb2MgPSAnYXBwZW5kJztcblxuICAgICAgICB2YXIgYXR0ciA9IG51bGw7XG4gICAgICAgIHZhciBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgdmFyIHRleHQgPSBudWxsO1xuXG4gICAgICAgIGlmIChtZXRhLmhhc093blByb3BlcnR5ICgncGFyZW50JykpIHtcbiAgICAgICAgICAgIC8vIGVuc3VyZXMgcHJvY2Vzc2luZyBvZiAncGFyZW50JyBiZWZvcmUgcmVtYWluZGVyIG9mIG1ldGEga2V5c1xuXG4gICAgICAgICAgICBwYXJlbnQgPSBtZXRhLnBhcmVudDtcbiAgICAgICAgICAgIGRlbGV0ZSBtZXRhLnBhcmVudDtcblxuICAgICAgICB9IC8vIGVuZCBpZiAobWV0YS5oYXNPd25Qcm9wZXJ0eSAoJ3BhcmVudCcpKVxuICAgICAgICBcbiAgICAgICAgdmFyIG1ldGFLZXlzID0gT2JqZWN0LmtleXMgKG1ldGEpO1xuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBtZXRhS2V5cy5sZW5ndGg7IGlkeCsrKSB7XG5cbiAgICAgICAgICAgIHZhciBrZXkgPSBtZXRhS2V5cyBbaWR4XTtcbiAgICAgICAgICAgIHN3aXRjaCAoa2V5KSB7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdlbXB0eSc6XG4gICAgICAgICAgICAgICAgY2FzZSAncm0nOlxuICAgICAgICAgICAgICAgICAgICBkZWxLZXkgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IG1ldGEgW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnYXR0cic6XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgPSBtZXRhLmF0dHI7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBtZXRhLmNvbnRlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gbWV0YS50ZXh0O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ3ByZXBlbmQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2FwcGVuZCc6XG4gICAgICAgICAgICAgICAgY2FzZSAnYmVmb3JlJzpcbiAgICAgICAgICAgICAgICBjYXNlICdhZnRlcic6XG4gICAgICAgICAgICAgICAgICAgIHJlbExvYyA9IGtleTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IG1ldGEgW2tleV07XG4gICAgICAgICAgICAgICAgICAgIHZhciBkb1BhcmVudCA9IHZhbCAhPT0gMSAmJiB2YWwgIT09IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHBhcmVudCA9IGRvUGFyZW50ID8gdmFsIDogcGFyZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWYgdmFsIGlzIG90aGVyIHRoYW4gMSBvciB0cnVlLCByZWxMb2Mgb3ZlcnJpZGVzIGJvdGggcGFyZW50IHZhbHVlcyBwYXNzZWQgXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnRvIGRpc3BsYXlPYkggYW5kIGRlZmluZWQgYnkgb3B0aW9uYWwgcGFyZW50IGF0dHJpYnV0ZVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfSAvLyBlbmQgc3dpdGNoIChrZXkpXG4gICAgICAgICAgICBcblxuICAgICAgICB9IC8vIGVuZCBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBtZXRhS2V5cy5sZW5ndGg7IGlkeCsrKVxuICAgICAgICBcblxuICAgICAgICBJZCA9IG51bGw7XG5cbiAgICAgICAgaWYgKGRlbEtleSkge1xuXG4gICAgICAgICAgICBmIFtkZWxLZXldIChwYXJlbnQpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoYXR0cikge1xuXG4gICAgICAgICAgICBmLmF0dHIgKHBhcmVudCwgYXR0cik7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZW50KSB7XG4gICAgICAgICAgICAvLyByZXBsYWNlcyBlbnRpcmUgY29udGVudCBvZiBwYXJlbnQgd2l0aCBuZXcgY29udGVudFxuXG4gICAgICAgICAgICAkKHBhcmVudClcbiAgICAgICAgICAgIC5lbXB0eSAoKTtcblxuICAgICAgICAgICAgZi5kaXNwbGF5T2JIIChwYXJlbnQsIGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgIC8vIHdpdGhvdXQgZW1wdHlpbmcgZmlyc3QsIHdpbGwgc2ltcGx5IGFwcGVuZCBjb250ZW50IHRvIGV4aXN0aW5nIGNvbnRlbnRcblxuICAgICAgICB9IGVsc2UgaWYgKHRleHQpIHtcblxuICAgICAgICAgICAgSWQgPSBmLnRleHRNYWtlIChwYXJlbnQsIHJlbExvYywgZGlzcE9iKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBJZCA9IGYuZWxlbWVudE1ha2UgKHBhcmVudCwgcmVsTG9jLCBwcmltYXJ5S2V5LCBkaXNwT2JQYXJzZWQuYywgZGlzcE9iUGFyc2VkLnMpO1xuXG4gICAgICAgIH0gLy8gZW5kIGlmIChkZWxLZXkpXG5cbiAgICAgICAgcmV0dXJuIElkO1xuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGRvT2JqZWN0IFxuXG5cblxuICAgICAgIC8vIC0tLS0gbWFpbiAtLS0tXG4gICAgdmFyIElkO1xuICAgIHZhciBkaXNwT2JUeXBlID0gdHlwZW9mIGRpc3BPYjtcblxuICAgIGlmIChkaXNwT2JUeXBlID09PSAndW5kZWZpbmVkJyB8fCBkaXNwT2IgPT09IDAgfHwgZGlzcE9iID09PSBudWxsKSB7XG5cbiAgICAgICAgSWQgPSBudWxsO1xuXG4gICAgfSBlbHNlIGlmICh2LnByaW1pdGl2ZVR5cGVzTm90TnVsbC5oYXNPd25Qcm9wZXJ0eSAoZGlzcE9iVHlwZSkpIHtcblxuICAgICAgICBJZCA9IGYudGV4dE1ha2UgKHBhcmVudCwgJ2FwcGVuZCcsIGRpc3BPYik7XG4gICAgICAgICAgICAvLyBpZiB0ZXh0IHNob3VsZCBiZSBwbGFjZWQgYXQgb3RoZXIgdGhhbiAnYXBwZW5kJyBsb2NhdGlvbiwgdGhlbiB1c2VcbiAgICAgICAgICAgIC8vICd0ZXh0JyB0YWcgYW5kIHNwZWNpZnkgcHJlcGVuZCwgYWZ0ZXIgb3IgYmVmb3JlIGFzIG5lZWRlZFxuXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5IChkaXNwT2IpKSB7XG5cbiAgICAgICAgSWQgPSBkb0FycmF5IChkaXNwT2IpO1xuXG4gICAgfSBlbHNlIGlmIChkaXNwT2JUeXBlID09ICdvYmplY3QnKSB7XG5cbiAgICAgICAgSWQgPSBkb09iamVjdCAoZGlzcE9iKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgSWQgPSBudWxsO1xuXG4gICAgfSAvLyBlbmQgaWYgKHR5cGVvZiBkaXNwT2IgPT09ICd1bmRlZmluZWQnIHx8IGRpc3BPYiA9PT0gMCB8fCBkaXNwT2IgPT09IG51bGwpXG4gICAgXG4gICAgcmV0dXJuIElkO1xuXG59OyAvLyBlbmQgZi5kaXNwbGF5T2JIIFxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5lbGVtZW50TWFrZSA9IChwYXJlbnRPclNpYmxJZCwgcmVsTG9jLCBlbE5hbWUsIGNvbnRlbnQsIGF0dHJzKSA9PiB7XG4gICAgXG4gICAgdmFyIGlkO1xuICAgIHZhciBhdHRyS2V5cyA9IE9iamVjdC5rZXlzIChhdHRycyk7XG4gICAgdmFyIGhhc0F0dHJzID0gYXR0cktleXMubGVuZ3RoID4gMDtcblxuICAgIGlmIChoYXNBdHRycyAmJiBhdHRycy5oYXNPd25Qcm9wZXJ0eSAoJ2lkJykpIHtcblxuICAgICAgICBpZCA9IGF0dHJzLmlkO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBpZCA9IFAuZ2VuSWQgKCk7XG5cbiAgICB9IC8vIGVuZCBpZiAoaGFzQXR0cnMpXG4gICAgXG4gICAgdmFyIElkID0gJyMnICsgaWQ7XG4gICAgXG4gICAgaWYgKGVsTmFtZSA9PT0gJ3NjcmlwdCcgJiYgY29udGVudCAhPT0gMCkge1xuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NDEzNzM3L2hvdy10by1hcHBlbmQtc2NyaXB0LXNjcmlwdC1pbi1qYXZhc2NyaXB0XG4gICAgICAgIC8vIGluc3BpcmVkIGJ5IFNPIHF1ZXN0aW9uLCBidXQgc2V0dGluZyBpbm5lckhUTUwgaXNuJ3Qgc3VwcG9zZWQgdG8gd29ya1xuICAgICAgICAvLyB0aGVyZWZvcmUsIHNldCBzcmMgYXR0cmlidXRlIHdpdGggcGF0aCB0byBmaWxlLCBpbnN0ZWFkIG9mIFxuICAgICAgICAvLyBzZXR0aW5nIGlubmVySFRNTCB0byBjb250ZW50IG9mIGZpbGVcblxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82MTA5OTUvY2FudC1hcHBlbmQtc2NyaXB0LWVsZW1lbnRcbiAgICAgICAgLy8galF1ZXJ5IHdvbid0IGFkZCBzY3JpcHQgZWxlbWVudCBhcyBpdCBkb2VzIHdpdGggYW55IG90aGVyIGVsZW1lbnQuICBUaGVyZWZvcmUsIG11c3QgYmUgZG9uZVxuICAgICAgICAvLyB1c2luZyBvbmx5IGphdmFzY3JpcHQgYXMgZm9sbG93czpcbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG5cbiAgICAgICAgc2NyaXB0LnNyYyA9IGNvbnRlbnQ7XG4gICAgICAgIHNjcmlwdC5pZCA9IGF0dHJzLmlkO1xuICAgICAgICBcbiAgICAgICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpOyAgICAgXG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHZhciBkaXZlbCA9ICc8JyArIGVsTmFtZSArICcgaWQ9XCInICsgaWQgKyAnXCInO1xuICAgIFxuICAgICAgICBpZiAoY29udGVudCkge1xuICAgIFxuICAgICAgICAgICAgZGl2ZWwgKz0gJz48LycgKyBlbE5hbWUgKyAnPic7XG4gICAgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgXG4gICAgICAgICAgICBkaXZlbCArPSAnPic7XG4gICAgXG4gICAgICAgIH0gLy8gZW5kIGlmIChjb250ZW50KVxuICAgIFxuICAgICAgICAkKHBhcmVudE9yU2libElkKVtyZWxMb2NdIChkaXZlbCk7XG5cbiAgICB9IC8vIGVuZCBpZiAoZWxOYW1lID09PSAnc2NyaXB0JylcbiAgICBcbiAgICBcbiAgICBpZiAoaGFzQXR0cnMpIHtcbiAgICAgICAgXG4gICAgICAgICQoSWQpXG4gICAgICAgIC5hdHRyIChhdHRycyk7XG5cbiAgICB9IC8vIGVuZCBpZiAoaGFzQXR0cnMpXG5cbiAgICBmLmRpc3BsYXlPYkggKElkLCBjb250ZW50KTtcbiAgICBcbiAgICByZXR1cm4gSWQ7XG5cbn07IC8vIGVuZCBmLmVsZW1lbnRNYWtlXG5cblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbmYudGV4dE1ha2UgPSAocGFyZW50LCByZWxMb2MsIHByaW1pdGl2ZSkgPT4ge1xuICAgIFxuICAgIGlmICh0eXBlb2YgcHJpbWl0aXZlID09PSAnc3RyaW5nJykge1xuICAgICAgICBcbiAgICAgICAgdmFyIHNpbmdsZXF1b3RlID0gJyYjeDAwMjc7JztcbiAgICAgICAgdmFyIGJhY2tzbGFzaCA9ICcmI3gwMDVjOyc7XG4gICAgICAgIHZhciBkb3VibGVxdW90ZSA9ICcmI3gwMDIyOyc7XG4gICAgICAgIHZhciBsdCA9ICcmbHQ7JztcbiAgICAgICAgXG4gICAgICAgIHByaW1pdGl2ZSA9IHByaW1pdGl2ZS5yZXBsYWNlICgvJy9nLCBzaW5nbGVxdW90ZSk7XG4gICAgICAgIHByaW1pdGl2ZSA9IHByaW1pdGl2ZS5yZXBsYWNlICgvXCIvZywgZG91YmxlcXVvdGUpO1xuICAgICAgICBwcmltaXRpdmUgPSBwcmltaXRpdmUucmVwbGFjZSAoL1xcXFwvZywgYmFja3NsYXNoKTtcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC88L2csIGx0KTtcblxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHByaW1pdGl2ZSA9PT0gJ3N5bWJvbCcpIHtcblxuICAgICAgICBwcmltaXRpdmUgPSAnc3ltYm9sJztcbiAgICAgICAgICAgIC8vIG90aGVyd2lzZSBzdHJpbmdpZnkgd291bGQgcHJvZHVjZSAne30nIHdoaWNoIGlzIGxlc3MgdXNlZnVsXG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIHByaW1pdGl2ZSA9IEpTT04uc3RyaW5naWZ5IChwcmltaXRpdmUpO1xuXG4gICAgfSAvLyBlbmQgaWYgKHR5cGVvZiBwcmltaXRpdmUgPT09ICdzdHJpbmcnKVxuICAgIFxuXG4gICAgJChwYXJlbnQpIFtyZWxMb2NdIChwcmltaXRpdmUpO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gICAgICAgIC8vIHRleHQgb2JzIGhhdmUgbm8gaWQnczogb25seSB0ZXh0IGlzIGFwcGVuZGVkIHdpdGggbm8gd2F5IHRvIGFkZHJlc3MgaXRcbiAgICAgICAgLy8gaWYgYWRkcmVzc2luZyBpcyBuZWNlc3NhcnksIHVzZSBzcGFuIGluc3RlYWQgb2YgdGV4dFxuXG59OyAvLyBlbmQgZi50ZXh0TWFrZSBcblxuXG5cbi8vIFBVQkxJQyBQcm9wZXJ0aWVzL01ldGhvZHNcbnZhciBQID0ge307XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLmRpc3BsYXlPYiA9IChkaXNwT2IpID0+IHtcbiAgICBcbiAgICB2YXIgcGFyZW50ID0gJ2JvZHknO1xuICAgICAgICAvLyBpZiBwYXJlbnQgbm90IGZvdW5kLCBhcHBlbmQgdG8gYm9keVxuXG4gICAgaWYgKHR5cGVvZiBkaXNwT2IgPT09ICdvYmplY3QnICYmIGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ3BhcmVudCcpKSB7XG5cbiAgICAgICAgcGFyZW50ID0gZGlzcE9iLnBhcmVudDtcblxuICAgIH0gLy8gZW5kIGlmICh0eXBlb2YgZGlzcE9iID09PSAnb2JqZWN0JyAmJiBkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdwYXJlbnQnKSlcbiAgICBcbiAgICB2YXIgSWQgPSBmLmRpc3BsYXlPYkggKHBhcmVudCwgZGlzcE9iKTtcblxuICAgIHJldHVybiBJZDtcblxufTsgLy8gZW5kIFAuZGlzcGxheU9iIFxuXG5QLmRpc3BsYXlQYWdlID0gUC5kaXNwbGF5T2I7XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLmdlbklkID0gKCkgPT4ge1xuXG4gICAgdmFyIGlkID0gJ2knICsgdi5pZCsrO1xuICAgIHJldHVybiBpZDtcblxufTsgLy8gZW5kIFAuZ2VuSWRcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5nZW5JZHMgPSAoKSA9PiB7XG4gICAgXG4gICAgdmFyIGlkID0gUC5nZW5JZCAoKTtcbiAgICB2YXIgSWQgPSAnIycgKyBpZDtcblxuICAgIHJldHVybiBbaWQsIElkXTtcblxufTsgLy8gZW5kIFAuZ2VuSWRzXG5cblxuXG4vLyBlbmQgUFVCTElDIHNlY3Rpb25cblxuZi5pbml0ICgpO1xuXG5yZXR1cm4gUDtcblxufSgpKTtcblxuXG5cbiIsIlxuLy8gdGVzdC5qc1xuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgJChkb2N1bWVudClcbiAgICAucmVhZHkgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGoyaCA9IHJlcXVpcmUgKCdnby1qMmgnKS5kaXNwbGF5T2I7XG5cbiAgICAgICAgajJoICh7XG4gICAgICAgICAgICBzcGFuOiB7bGFiZWw6ICd0ZXN0IGdvLWoyaCd9LCBcbiAgICAgICAgICAgIHN0eWxlOiBcImJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XCIgK1xuICAgICAgICAgICAgICAgIFwiYm9yZGVyLXJhZGl1czogNHB4O1wiICtcbiAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3I6ICNjY2ZmY2M7XCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgajJoICh7YnI6IDB9KTtcbiAgICAgICAgajJoIChcInBsYWluIHRleHRcIik7XG5cbiAgICB9KTtcblxufSkgKCk7XG4iLCIvLyBnby1tc2cvaW5kZXguanNcbi8vIGdvLW1zZyBvYmplY3QgaGFzIGEgdW5pcXVlIHByaW1hcnkgbXNnIGFuZCB6ZXJvIG9yIG1vcmUgb3B0aW9uYWwgYXR0cmlidXRlc1xuXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHAwKSB7XG5cbiAgICAvLyBQUklWQVRFIFByb3BlcnRpZXNcbnZhciB2ID0ge1xuXG4gICAgcHJpbWFyeTogbnVsbCxcbiAgICAgICAgLy8gcHJpbWFyeToge2NtZDogMX0gKGNvbnRhaW5zIG9wdGlvbmFsIGNvbnRlbnQpIG9yIHtjbWQ6IDB9IChubyBvcHRpb25hbCBjb250ZW50IGFsbG93ZWQpXG5cbiAgICBzZWNvbmRhcnk6IG51bGwsXG4gICAgICAgIC8vIGlmIGEgcHJpbWFyeSBtZXNzYWdlIGhhcyBhbiBvcHRpb25hbCBhdHRyaWJ1dGUgdGhhdCBjb25jaWRlbnRhbGx5IGlzIHRoZSBzYW1lIGFzXG4gICAgICAgIC8vIGFub3RoZXIgcHJpbWFyeSBtZXNzYWdlLCBpdCBzaG91bGQgYmUgaGF2ZSBhIGtleS92YWx1ZSBwYWlyIGluIHNlY29uZGFyeSB7YXR0cjogMX1cbiAgICAgICAgLy8gdG8gZW5zdXJlIHRoYXQgaXQgd2lsbCBiZSB0cmVhdGVkIGFzIGFuIGF0dHJpYnV0ZSBpbiBjYXNlIGEgcHJpbWFyeSBpcyBwcmVzZW50XG4gICAgICAgIC8vIFNlY29uZGFyeSBpcyBvbmx5IHRlc3RlZCBpZiB0aGVyZSBleGlzdHMgYSBwcmltYXJ5IGtleVxuXG4gICAgbWV0YTogbnVsbCxcbiAgICAgICAgLy8gbWV0YSBwYXJhbWV0ZXJzIGludGVuZGVkIGZvciBjdHJsIG9yIG90aGVyIHB1cnBvc2Ugb3V0c2lkZSBvZiBwcmltYXJ5IGFuZCBzZWNvbmRhcnkgbXNnXG4gICAgICAgIC8vIHBhcmFtZXRlciB1c2FnZVxuXG59OyAgLy8gZW5kIFBSSVZBVEUgcHJvcGVydGllc1xuXG4gICAgLy8gUFJJVkFURSBGdW5jdGlvbnNcbmYgPSB7fTtcblxuXG5mLmluaXQgPSAoKSA9PiB7XG5cbiAgICB2LnByaW1hcnkgPSBwMC5wcmltYXJ5O1xuICAgIHYuc2Vjb25kYXJ5ID0gcDAuaGFzT3duUHJvcGVydHkgKCdzZWNvbmRhcnknKSA/IHAwLnNlY29uZGFyeSA6IHt9O1xuICAgIHYubWV0YSA9IHAwLmhhc093blByb3BlcnR5ICgnbWV0YScpID8gcDAubWV0YSA6IHt9O1xufTtcblxuICAgIC8vIFBVQkxJQyBGdW5jdGlvbnNcbnZhciBQID0ge307XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLnBhcnNlTXNnID0gKG1zZ09iKSA9PiB7XG4gICAgXG4gICAgdmFyIHJlcyA9IHt9O1xuICAgIHZhciBtc2dLZXlzID0gT2JqZWN0LmtleXMgKG1zZ09iKTtcblxuICAgIHZhciBwcmltYXJ5Q2FuZGlkYXRlc09iID0ge307XG4gICAgdmFyIGF0dHJzT2IgPSB7fTtcbiAgICB2YXIgbWV0YU9iID0ge307XG5cbiAgICB2YXIga2V5O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXNnS2V5cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgIGtleSA9IG1zZ0tleXMgW2ldO1xuICAgICAgICBcbiAgICAgICAgaWYgKHYucHJpbWFyeS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSkge1xuXG4gICAgICAgICAgICBwcmltYXJ5Q2FuZGlkYXRlc09iIFtrZXldID0gMTtcblxuICAgICAgICB9IGVsc2UgaWYgKHYubWV0YS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSkge1xuXG4gICAgICAgICAgICBtZXRhT2IgW2tleV0gPSBtc2dPYiBba2V5XTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBhdHRyc09iIFtrZXldID0gbXNnT2IgW2tleV07XG5cbiAgICAgICAgfSAvLyBlbmQgaWYgKHYucHJpbWFyeS5oYXNPd25Qcm9wZXJ0eSAoa2V5KSlcbiAgICAgICAgXG4gICAgfSAvLyBlbmQgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2dLZXlzLmxlbmd0aDsgaSsrKVxuXG4gICAgdmFyIHByaW1hcnlDYW5kaWRhdGVzQSA9IE9iamVjdC5rZXlzIChwcmltYXJ5Q2FuZGlkYXRlc09iKTtcblxuICAgIHZhciBwcmltYXJ5S2V5O1xuICAgIHZhciBjb250ZW50O1xuXG4gICAgaWYgKHByaW1hcnlDYW5kaWRhdGVzQS5sZW5ndGggPT09IDApIHtcblxuICAgICAgICBwcmltYXJ5S2V5ID0gbnVsbDtcblxuICAgIH0gZWxzZSBpZiAocHJpbWFyeUNhbmRpZGF0ZXNBLmxlbmd0aCA9PT0gMSkge1xuXG4gICAgICAgIHByaW1hcnlLZXkgPSBwcmltYXJ5Q2FuZGlkYXRlc0EgWzBdO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaGFuZGxlIHByaW1hcnkvc2Vjb25kYXJ5IGtleSByZXNvbHV0aW9uXG5cbiAgICAgICAgcHJpbWFyeUtleSA9IG51bGw7XG4gICAgICAgIGZvciAoa2V5IGluIHByaW1hcnlDYW5kaWRhdGVzT2IpIHtcblxuICAgICAgICAgICAgaWYgKHYuc2Vjb25kYXJ5Lmhhc093blByb3BlcnR5IChrZXkpKSB7XG5cbiAgICAgICAgICAgICAgICBhdHRyc09iIFtrZXldID0gbXNnT2IgW2tleV07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJpbWFyeUtleSA9PT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlLZXkgPSBrZXk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHJlcy5lcnIgPSAnTXVsdGlwbGUgcHJpbWFyeSBrZXlzIGZvdW5kIG5vdCBpbiBzZWNvbmRhcnkgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkgKG1zZyk7XG5cbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAocHJpbWFyeUtleSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfSAvLyBlbmQgaWYgKHYuc2Vjb25kYXJ5Lmhhc093blByb3BlcnR5IChrZXkpKVxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgIH0gLy8gZW5kIGlmIChwcmltYXJ5Q2FuZGlkYXRlc0EubGVuZ3RoID09PSAwKVxuXG5cbiAgICBpZiAoIXJlcy5oYXNPd25Qcm9wZXJ0eSAoJ2VycicpKSB7XG5cbiAgICAgICAgcmVzLnAgPSBwcmltYXJ5S2V5O1xuICAgICAgICByZXMuYyA9IHByaW1hcnlLZXkgJiYgdi5wcmltYXJ5IFtwcmltYXJ5S2V5XSAhPT0gMCA/IG1zZ09iIFtwcmltYXJ5S2V5XSA6IG51bGw7XG4gICAgICAgICAgICAvLyBleGFtcGxlIHZvaWQgaHRtbCB0YWcgaGFzIHplcm8gY29udGVudCwgc28gY29udGVudCBpcyBmb3JjZWQgdG8gbnVsbFxuXG4gICAgICAgIHJlcy5zID0gYXR0cnNPYjtcbiAgICAgICAgcmVzLm0gPSBtZXRhT2I7XG5cbiAgICB9IC8vIGVuZCBpZiAoIXJlcy5oYXNPd25Qcm9wZXJ0eSAoJ2VycicpKVxuICAgIFxuICAgIFxuICAgIHJldHVybiByZXM7XG5cbn07IC8vIGVuZCBQLnBhcnNlTXNnIFxuXG5cblxuICAgIC8vIGVuZCBQVUJMSUMgRnVuY3Rpb25zXG5cbmYuaW5pdCAoKTtcblxucmV0dXJuIFA7XG5cbn07XG5cblxuXG4iXX0=
