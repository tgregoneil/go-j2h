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

        return Ids;
        
    };  // end doArray 

        // ----  doObject ----
    var doObject = function (dispOb) {

        var dispObParsed = v.msg.parseMsg (dispOb);

        var primaryKey = dispObParsed.p;

        var meta = dispObParsed.m;
        var metaKeys = Object.keys (meta);

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
        
        for (var key = 0; key < metaKeys.length; key++) {

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
            

        } // end for (var key = 0; key < metaKeys.length; key++)
        

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







    /*
    if (isPrimitive) {


    } else {
        
            // NE => Not Empty
        var isNEArray = Array.isArray (dispOb) && dispOb.length > 0;
        var isNEObject = !Array.isArray(dispOb) && dispObType == 'object' && Object.keys(dispOb).length > 0;
        
        var Id = null;
            // capital Id to indicate id with '#' prefixing it
    
        if (isNEObject) {
    
            if (dispOb.hasOwnProperty ('rm')) {


            } else if (dispOb.hasOwnProperty ('empty')) {


            } else if (dispOb.hasOwnProperty ('content')) {

                f.displayObH (parent, dispOb.content);

            } else if (dispOb.hasOwnProperty ('attr')) {


            //} else if (dispOb.hasOwnProperty ('script') && dispOb.script !== 0) {
//
                //var scriptFn = eval (dispOb.script);
//
                //var goKey = require ('go-key');
                //scriptFn (P.displayOb, P.genId, goKey, dispOb.parent);
//


            } else if (dispOb.hasOwnProperty ('script') && dispOb.script !== 0) {


            } else {
                
                parent = dispOb.hasOwnProperty ('parent') ? dispOb.parent : parent;

                var attrs = {};
                var elementName = null;
                var content;
            
                var keys = Object.keys (dispOb);
                var insertLocation = 'append';
                for (var i = 0; i < keys.length; i++) {
        
                    var ky = keys [i];
        
                    var tagType = f.getTagType (ky);
        
                    var styleInHead = parent === 'head' && ky === 'style';
                        // style in head => html element
                        // style not in head => attribute of dispOb
                        
                    var tagNotStyle = tagType !== 0 && ky !== 'style';
        
                    if (tagNotStyle || styleInHead) {
        
                        elementName = ky;
                        content = dispOb [elementName];
        
                    } else {
                        
                        switch (ky) {
            
                            case 'parent':
                                    // do nothing -- Prevents 'parent' from becoming an attribute
                                break;
                            case 'prepend':
                            case 'append':
                            case 'before':
                            case 'after':
                                insertLocation = ky;
                                parent = dispOb [ky] === 1 || dispOb [ky] === true ? parent : dispOb [ky];
                                    // if any of prepend, ... are specified, and the value is other
                                    // than a '1' or 'true', override the parent value with that value
                                break;
            
                            default:
                                
                                attrs [ky] = dispOb [ky];
                                break;
            
                        } // end switch (ky)
        
                    } // end if (tagType !== 0)
        
                } // end for (var i = 0; i < keys; i++)
                
        
                if (!elementName) {
                    // error case -- set as text and display entire dispOb

                    elementName = 'text';
                    content = JSON.stringify (dispOb);

                } // end if (!elementName)
                
                if (elementName === 'text') {

                    Id = f.textMake (parent, content, insertLocation);

                } else {

                    Id = f.elementMake (elementName, parent, insertLocation, attrs);

                } // end if (elementName === 'text')
                
                
                if (Id !== null) {
                    // case for element not 'text'
                    
                    f.displayObH (Id, content);

                    if (elementName === 'form') {

                        $(parent)
                        .focus();

                    } // end if (elementName === 'form')
                
                } // end if (Id !== null)
                

            } // end if (dispOb.hasOwnProperty ('rm'))
            
    
        } else if (isNEArray) {
    
            for (var i = 0; i < dispOb.length; i++) {
    
                    // returned Id will be for last item in array
                    // useful to later add siblings with 'after' key
                Id = f.displayObH (parent, dispOb [i]);
    
            } // end for (var i = 0; i < dispOb.length; i++)
    
        } else {
    
            Id = null;
                // case for dispOb as an empty object or empty array
    
        } // end if (isNEObject)

    } // end if (v.primitiveTypesNotNull.hasOwnProperty (dispObType))
    
        
    return Id;

}; // end f.displayObH 

*/
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
        script.id = dispOb.id;
        
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

        res.err = 'No primary candidates found in msgOb: ' + JSON.stringify (msgOb);

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
        res.c = v.primary [primaryKey] !== 0 ? msgOb [primaryKey] : null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlc19nbG9iYWwvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInRlc3QuanMiLCIuLi9nby1tc2cvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hpQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIGdvLWoyaC9pbmRleC5qc1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG5cbi8vIFBSSVZBVEUgUHJvcGVydGllcy9NZXRob2RzXG52YXIgdiA9IHtcblxuICAgIGlkOiAwLFxuICAgIHByaW1pdGl2ZVR5cGVzTm90TnVsbDogeydzdHJpbmcnOjEsICdudW1iZXInOjEsICdib29sZWFuJzoxLCAnc3ltYm9sJzogMX0sXG4gICAgICAgIC8vIHNpbmNlIHR5cGVvZiBudWxsIHlpZWxkcyAnb2JqZWN0JywgaXQncyBoYW5kbGVkIHNlcGFyYXRlbHlcblxuICAgIG1zZ1R5cGVzOiB7XG5cbiAgICAgICAgcHJpbWFyeToge1xuICAgICAgICAgICAgICAgIC8vIHZvaWQgdGFnc1xuICAgICAgICAgICAgYXJlYTogMCwgYmFzZTogMCwgYnI6IDAsIGNvbDogMCwgZW1iZWQ6IDAsIGhyOiAwLCBpbWc6IDAsIGlucHV0OiAwLCBrZXlnZW46IDAsIGxpbms6IDAsIG1ldGE6IDAsIHBhcmFtOiAwLCBzb3VyY2U6IDAsIHRyYWNrOiAwLCB3YnI6IDAsIFxuXG4gICAgICAgICAgICAgICAgLy8gbm9uLXZvaWQgdGFnc1xuICAgICAgICAgICAgYTogMSwgYWJicjogMSwgYWRkcmVzczogMSwgYXJ0aWNsZTogMSwgYXNpZGU6IDEsIGF1ZGlvOiAxLCBiOiAxLCBiZGk6IDEsIGJkbzogMSwgYmxvY2txdW90ZTogMSwgYm9keTogMSwgYnV0dG9uOiAxLCBjYW52YXM6IDEsIGNhcHRpb246IDEsIGNpdGU6IDEsIGNvZGU6IDEsIGNvbGdyb3VwOiAxLCBkYXRhbGlzdDogMSwgZGQ6IDEsIGRlbDogMSwgZGV0YWlsczogMSwgZGZuOiAxLCBkaWFsb2c6IDEsIGRpdjogMSwgZGw6IDEsIGR0OiAxLCBlbTogMSwgZmllbGRzZXQ6IDEsIGZpZ2NhcHRpb246IDEsIGZpZ3VyZTogMSwgZm9vdGVyOiAxLCBmb3JtOiAxLCBoMTogMSwgaDI6IDEsIGgzOiAxLCBoNDogMSwgaDU6IDEsIGg2OiAxLCBoZWFkOiAxLCBoZWFkZXI6IDEsIGhncm91cDogMSwgaHRtbDogMSwgaTogMSwgaWZyYW1lOiAxLCBpbnM6IDEsIGtiZDogMSwgbGFiZWw6IDEsIGxlZ2VuZDogMSwgbGk6IDEsIG1hcDogMSwgbWFyazogMSwgbWVudTogMSwgbWV0ZXI6IDEsIG5hdjogMSwgbm9zY3JpcHQ6IDEsIG9iamVjdDogMSwgb2w6IDEsIG9wdGdyb3VwOiAxLCBvcHRpb246IDEsIG91dHB1dDogMSwgcDogMSwgcHJlOiAxLCBwcm9ncmVzczogMSwgcTogMSwgcnA6IDEsIHJ0OiAxLCBydWJ5OiAxLCBzOiAxLCBzYW1wOiAxLCBzY3JpcHQ6IDEsIHNlY3Rpb246IDEsIHNlbGVjdDogMSwgc21hbGw6IDEsIHNwYW46IDEsIHN0cm9uZzogMSwgc3R5bGU6IDEsIHN1YjogMSwgc3VtbWFyeTogMSwgc3VwOiAxLCBzdmc6IDEsIHRhYmxlOiAxLCB0Ym9keTogMSwgdGQ6IDEsIHRleHRhcmVhOiAxLCB0Zm9vdDogMSwgdGg6IDEsIHRoZWFkOiAxLCB0aW1lOiAxLCB0aXRsZTogMSwgdHI6IDEsIHU6IDEsIHVsOiAxLCAndmFyJzogMSwgdmlkZW86IDEsXG4gICAgICAgIH0sXG5cbiAgICAgICAgc2Vjb25kYXJ5OiB7c3R5bGU6IDF9LFxuICAgICAgICAgICAgLy8gZWxlbWVudHMgdGhhdCBjYW4gYmUgZWl0aGVyIGEgcHJpbWFyeSB0YWcgaXRzZWxmIG9yIGFuIGF0dHJpYnV0ZSBvZiBhbm90aGVyIHByaW1hcnkgdGFnXG4gICAgICAgICAgICAvLyBpZiBhbnkgb3RoZXIgcHJpbWFyeSB0YWdzIGlzIHByZXNlbnQsIHRoZW4gc2Vjb25kYXJ5IHRhZ3MgYXJlIHRyZWF0ZWQgYXNcbiAgICAgICAgICAgIC8vIGF0dHJpYnV0ZXMgb2YgdGhlIG90aGVyIHByaW1hcnkgdGFnXG5cbiAgICAgICAgbWV0YToge1xuICAgICAgICAgICAgZW1wdHk6IDEsIHJtOiAxLCBcbiAgICAgICAgICAgIHByZXBlbmQ6IDEsIGFwcGVuZDogMSwgYmVmb3JlOiAxLCBhZnRlcjogMSwgcGFyZW50OiAxLFxuICAgICAgICAgICAgYXR0cjogMSwgY29udGVudDogMSwgdGV4dDogMSwgXG4gICAgICAgIH0sXG5cbiAgICB9LFxuXG4gICAgbXNnMDogcmVxdWlyZSAoJ2dvLW1zZycpLFxuICAgIG1zZzogbnVsbCxcblxufTsgLy8gZW5kIFBSSVZBVEUgcHJvcGVydGllc1xudmFyIGY9e307XG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmluaXQgPSAoKSA9PiB7XG4gICAgXG4gICAgdi5tc2cgPSBuZXcgdi5tc2cwICh2Lm1zZ1R5cGVzKTtcblxufTsgLy8gZW5kIGYuaW5pdFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmF0dHIgPSAoc2VsZWN0b3IsIGF0dHIpID0+IHtcbiAgICBcbiAgICAkKHNlbGVjdG9yKVxuICAgIC5hdHRyIChhdHRyKTtcblxufTsgLy8gZW5kIGYuYXR0ciBcblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5lbXB0eSA9IChzZWxlY3RvcikgPT4ge1xuICAgIFxuICAgICQoc2VsZWN0b3IpXG4gICAgLmVtcHR5ICgpXG4gICAgLm9mZiAoJ2tleWRvd24nKTtcblxufTsgLy8gZW5kIGYuZW1wdHkgXG5cblxuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5ybSA9IChzZWxlY3RvcikgPT4ge1xuXG4gICAgJChzZWxlY3RvcilcbiAgICAucmVtb3ZlICgpO1xuXG59OyAvLyBlbmQgZi5ybVxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLmRpc3BsYXlPYkggPSAocGFyZW50LCBkaXNwT2IpID0+IHtcbiAgICBcbiAgICAgICAgLy8gLS0tLSAgZG9BcnJheSAtLS0tXG4gICAgdmFyIGRvQXJyYXkgPSBmdW5jdGlvbiAoZGlzcE9iKSB7XG5cbiAgICAgICAgdmFyIElkcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BPYi5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICBJZHMucHVzaCAoZi5kaXNwbGF5T2JIIChwYXJlbnQsIGRpc3BPYiBbaV0pKTtcblxuICAgICAgICB9IC8vIGVuZCBmb3IgKHZhciBpID0gMDsgaSA8IGRpc3BPYi5sZW5ndGg7IGkrKylcblxuICAgICAgICByZXR1cm4gSWRzO1xuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGRvQXJyYXkgXG5cbiAgICAgICAgLy8gLS0tLSAgZG9PYmplY3QgLS0tLVxuICAgIHZhciBkb09iamVjdCA9IGZ1bmN0aW9uIChkaXNwT2IpIHtcblxuICAgICAgICB2YXIgZGlzcE9iUGFyc2VkID0gdi5tc2cucGFyc2VNc2cgKGRpc3BPYik7XG5cbiAgICAgICAgdmFyIHByaW1hcnlLZXkgPSBkaXNwT2JQYXJzZWQucDtcblxuICAgICAgICB2YXIgbWV0YSA9IGRpc3BPYlBhcnNlZC5tO1xuICAgICAgICB2YXIgbWV0YUtleXMgPSBPYmplY3Qua2V5cyAobWV0YSk7XG5cbiAgICAgICAgdmFyIGRlbEtleSA9IG51bGw7XG4gICAgICAgIHZhciByZWxMb2MgPSAnYXBwZW5kJztcblxuICAgICAgICB2YXIgYXR0ciA9IG51bGw7XG4gICAgICAgIHZhciBjb250ZW50ID0gbnVsbDtcbiAgICAgICAgdmFyIHRleHQgPSBudWxsO1xuXG4gICAgICAgIGlmIChtZXRhLmhhc093blByb3BlcnR5ICgncGFyZW50JykpIHtcbiAgICAgICAgICAgIC8vIGVuc3VyZXMgcHJvY2Vzc2luZyBvZiAncGFyZW50JyBiZWZvcmUgcmVtYWluZGVyIG9mIG1ldGEga2V5c1xuXG4gICAgICAgICAgICBwYXJlbnQgPSBtZXRhLnBhcmVudDtcbiAgICAgICAgICAgIGRlbGV0ZSBtZXRhLnBhcmVudDtcblxuICAgICAgICB9IC8vIGVuZCBpZiAobWV0YS5oYXNPd25Qcm9wZXJ0eSAoJ3BhcmVudCcpKVxuICAgICAgICBcbiAgICAgICAgZm9yICh2YXIga2V5ID0gMDsga2V5IDwgbWV0YUtleXMubGVuZ3RoOyBrZXkrKykge1xuXG4gICAgICAgICAgICBzd2l0Y2ggKGtleSkge1xuXG4gICAgICAgICAgICAgICAgY2FzZSAnZW1wdHknOlxuICAgICAgICAgICAgICAgIGNhc2UgJ3JtJzpcbiAgICAgICAgICAgICAgICAgICAgZGVsS2V5ID0ga2V5O1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBtZXRhIFtrZXldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2F0dHInOlxuICAgICAgICAgICAgICAgICAgICBhdHRyID0gbWV0YS5hdHRyO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgICAgICAgICBjb250ZW50ID0gbWV0YS5jb250ZW50O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0ZXh0JzpcbiAgICAgICAgICAgICAgICAgICAgdGV4dCA9IG1ldGEudGV4dDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdwcmVwZW5kJzpcbiAgICAgICAgICAgICAgICBjYXNlICdhcHBlbmQnOlxuICAgICAgICAgICAgICAgIGNhc2UgJ2JlZm9yZSc6XG4gICAgICAgICAgICAgICAgY2FzZSAnYWZ0ZXInOlxuICAgICAgICAgICAgICAgICAgICByZWxMb2MgPSBrZXk7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSBtZXRhIFtrZXldO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZG9QYXJlbnQgPSB2YWwgIT09IDEgJiYgdmFsICE9PSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBwYXJlbnQgPSBkb1BhcmVudCA/IHZhbCA6IHBhcmVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIHZhbCBpcyBvdGhlciB0aGFuIDEgb3IgdHJ1ZSwgcmVsTG9jIG92ZXJyaWRlcyBib3RoIHBhcmVudCB2YWx1ZXMgcGFzc2VkIFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW50byBkaXNwbGF5T2JIIGFuZCBkZWZpbmVkIGJ5IG9wdGlvbmFsIHBhcmVudCBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIH0gLy8gZW5kIHN3aXRjaCAoa2V5KVxuICAgICAgICAgICAgXG5cbiAgICAgICAgfSAvLyBlbmQgZm9yICh2YXIga2V5ID0gMDsga2V5IDwgbWV0YUtleXMubGVuZ3RoOyBrZXkrKylcbiAgICAgICAgXG5cbiAgICAgICAgSWQgPSBudWxsO1xuXG4gICAgICAgIGlmIChkZWxLZXkpIHtcblxuICAgICAgICAgICAgZiBbZGVsS2V5XSAocGFyZW50KTtcblxuICAgICAgICB9IGVsc2UgaWYgKGF0dHIpIHtcblxuICAgICAgICAgICAgZi5hdHRyIChwYXJlbnQsIGF0dHIpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoY29udGVudCkge1xuICAgICAgICAgICAgLy8gcmVwbGFjZXMgZW50aXJlIGNvbnRlbnQgb2YgcGFyZW50IHdpdGggbmV3IGNvbnRlbnRcblxuICAgICAgICAgICAgJChwYXJlbnQpXG4gICAgICAgICAgICAuZW1wdHkgKCk7XG5cbiAgICAgICAgICAgIGYuZGlzcGxheU9iSCAocGFyZW50LCBjb250ZW50KTtcbiAgICAgICAgICAgICAgICAvLyB3aXRob3V0IGVtcHR5aW5nIGZpcnN0LCB3aWxsIHNpbXBseSBhcHBlbmQgY29udGVudCB0byBleGlzdGluZyBjb250ZW50XG5cbiAgICAgICAgfSBlbHNlIGlmICh0ZXh0KSB7XG5cbiAgICAgICAgICAgIElkID0gZi50ZXh0TWFrZSAocGFyZW50LCByZWxMb2MsIGRpc3BPYik7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgSWQgPSBmLmVsZW1lbnRNYWtlIChwYXJlbnQsIHJlbExvYywgcHJpbWFyeUtleSwgZGlzcE9iUGFyc2VkLmMsIGRpc3BPYlBhcnNlZC5zKTtcblxuICAgICAgICB9IC8vIGVuZCBpZiAoZGVsS2V5KVxuICAgICAgICBcbiAgICB9OyAgLy8gZW5kIGRvT2JqZWN0IFxuXG5cblxuICAgICAgIC8vIC0tLS0gbWFpbiAtLS0tXG4gICAgdmFyIElkO1xuICAgIHZhciBkaXNwT2JUeXBlID0gdHlwZW9mIGRpc3BPYjtcblxuICAgIGlmIChkaXNwT2JUeXBlID09PSAndW5kZWZpbmVkJyB8fCBkaXNwT2IgPT09IDAgfHwgZGlzcE9iID09PSBudWxsKSB7XG5cbiAgICAgICAgSWQgPSBudWxsO1xuXG4gICAgfSBlbHNlIGlmICh2LnByaW1pdGl2ZVR5cGVzTm90TnVsbC5oYXNPd25Qcm9wZXJ0eSAoZGlzcE9iVHlwZSkpIHtcblxuICAgICAgICBJZCA9IGYudGV4dE1ha2UgKHBhcmVudCwgJ2FwcGVuZCcsIGRpc3BPYik7XG4gICAgICAgICAgICAvLyBpZiB0ZXh0IHNob3VsZCBiZSBwbGFjZWQgYXQgb3RoZXIgdGhhbiAnYXBwZW5kJyBsb2NhdGlvbiwgdGhlbiB1c2VcbiAgICAgICAgICAgIC8vICd0ZXh0JyB0YWcgYW5kIHNwZWNpZnkgcHJlcGVuZCwgYWZ0ZXIgb3IgYmVmb3JlIGFzIG5lZWRlZFxuXG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5IChkaXNwT2IpKSB7XG5cbiAgICAgICAgSWQgPSBkb0FycmF5IChkaXNwT2IpO1xuXG4gICAgfSBlbHNlIGlmIChkaXNwT2JUeXBlID09ICdvYmplY3QnKSB7XG5cbiAgICAgICAgSWQgPSBkb09iamVjdCAoZGlzcE9iKTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICAgSWQgPSBudWxsO1xuXG4gICAgfSAvLyBlbmQgaWYgKHR5cGVvZiBkaXNwT2IgPT09ICd1bmRlZmluZWQnIHx8IGRpc3BPYiA9PT0gMCB8fCBkaXNwT2IgPT09IG51bGwpXG4gICAgXG4gICAgcmV0dXJuIElkO1xuXG59OyAvLyBlbmQgZi5kaXNwbGF5T2JIIFxuXG5cblxuXG5cblxuXG4gICAgLypcbiAgICBpZiAoaXNQcmltaXRpdmUpIHtcblxuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBORSA9PiBOb3QgRW1wdHlcbiAgICAgICAgdmFyIGlzTkVBcnJheSA9IEFycmF5LmlzQXJyYXkgKGRpc3BPYikgJiYgZGlzcE9iLmxlbmd0aCA+IDA7XG4gICAgICAgIHZhciBpc05FT2JqZWN0ID0gIUFycmF5LmlzQXJyYXkoZGlzcE9iKSAmJiBkaXNwT2JUeXBlID09ICdvYmplY3QnICYmIE9iamVjdC5rZXlzKGRpc3BPYikubGVuZ3RoID4gMDtcbiAgICAgICAgXG4gICAgICAgIHZhciBJZCA9IG51bGw7XG4gICAgICAgICAgICAvLyBjYXBpdGFsIElkIHRvIGluZGljYXRlIGlkIHdpdGggJyMnIHByZWZpeGluZyBpdFxuICAgIFxuICAgICAgICBpZiAoaXNORU9iamVjdCkge1xuICAgIFxuICAgICAgICAgICAgaWYgKGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ3JtJykpIHtcblxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ2VtcHR5JykpIHtcblxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ2NvbnRlbnQnKSkge1xuXG4gICAgICAgICAgICAgICAgZi5kaXNwbGF5T2JIIChwYXJlbnQsIGRpc3BPYi5jb250ZW50KTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdhdHRyJykpIHtcblxuXG4gICAgICAgICAgICAvL30gZWxzZSBpZiAoZGlzcE9iLmhhc093blByb3BlcnR5ICgnc2NyaXB0JykgJiYgZGlzcE9iLnNjcmlwdCAhPT0gMCkge1xuLy9cbiAgICAgICAgICAgICAgICAvL3ZhciBzY3JpcHRGbiA9IGV2YWwgKGRpc3BPYi5zY3JpcHQpO1xuLy9cbiAgICAgICAgICAgICAgICAvL3ZhciBnb0tleSA9IHJlcXVpcmUgKCdnby1rZXknKTtcbiAgICAgICAgICAgICAgICAvL3NjcmlwdEZuIChQLmRpc3BsYXlPYiwgUC5nZW5JZCwgZ29LZXksIGRpc3BPYi5wYXJlbnQpO1xuLy9cblxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ3NjcmlwdCcpICYmIGRpc3BPYi5zY3JpcHQgIT09IDApIHtcblxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHBhcmVudCA9IGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ3BhcmVudCcpID8gZGlzcE9iLnBhcmVudCA6IHBhcmVudDtcblxuICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IHt9O1xuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50TmFtZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzIChkaXNwT2IpO1xuICAgICAgICAgICAgICAgIHZhciBpbnNlcnRMb2NhdGlvbiA9ICdhcHBlbmQnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGt5ID0ga2V5cyBbaV07XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgdGFnVHlwZSA9IGYuZ2V0VGFnVHlwZSAoa3kpO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0eWxlSW5IZWFkID0gcGFyZW50ID09PSAnaGVhZCcgJiYga3kgPT09ICdzdHlsZSc7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzdHlsZSBpbiBoZWFkID0+IGh0bWwgZWxlbWVudFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3R5bGUgbm90IGluIGhlYWQgPT4gYXR0cmlidXRlIG9mIGRpc3BPYlxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhciB0YWdOb3RTdHlsZSA9IHRhZ1R5cGUgIT09IDAgJiYga3kgIT09ICdzdHlsZSc7XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAodGFnTm90U3R5bGUgfHwgc3R5bGVJbkhlYWQpIHtcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50TmFtZSA9IGt5O1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGRpc3BPYiBbZWxlbWVudE5hbWVdO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChreSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncGFyZW50JzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGRvIG5vdGhpbmcgLS0gUHJldmVudHMgJ3BhcmVudCcgZnJvbSBiZWNvbWluZyBhbiBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAncHJlcGVuZCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnYXBwZW5kJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlICdiZWZvcmUnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJ2FmdGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0TG9jYXRpb24gPSBreTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50ID0gZGlzcE9iIFtreV0gPT09IDEgfHwgZGlzcE9iIFtreV0gPT09IHRydWUgPyBwYXJlbnQgOiBkaXNwT2IgW2t5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlmIGFueSBvZiBwcmVwZW5kLCAuLi4gYXJlIHNwZWNpZmllZCwgYW5kIHRoZSB2YWx1ZSBpcyBvdGhlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhhbiBhICcxJyBvciAndHJ1ZScsIG92ZXJyaWRlIHRoZSBwYXJlbnQgdmFsdWUgd2l0aCB0aGF0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzIFtreV0gPSBkaXNwT2IgW2t5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIHN3aXRjaCAoa3kpXG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAodGFnVHlwZSAhPT0gMClcbiAgICAgICAgXG4gICAgICAgICAgICAgICAgfSAvLyBlbmQgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzOyBpKyspXG4gICAgICAgICAgICAgICAgXG4gICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghZWxlbWVudE5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3IgY2FzZSAtLSBzZXQgYXMgdGV4dCBhbmQgZGlzcGxheSBlbnRpcmUgZGlzcE9iXG5cbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudE5hbWUgPSAndGV4dCc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBKU09OLnN0cmluZ2lmeSAoZGlzcE9iKTtcblxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmICghZWxlbWVudE5hbWUpXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnROYW1lID09PSAndGV4dCcpIHtcblxuICAgICAgICAgICAgICAgICAgICBJZCA9IGYudGV4dE1ha2UgKHBhcmVudCwgY29udGVudCwgaW5zZXJ0TG9jYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICBJZCA9IGYuZWxlbWVudE1ha2UgKGVsZW1lbnROYW1lLCBwYXJlbnQsIGluc2VydExvY2F0aW9uLCBhdHRycyk7XG5cbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAoZWxlbWVudE5hbWUgPT09ICd0ZXh0JylcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoSWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY2FzZSBmb3IgZWxlbWVudCBub3QgJ3RleHQnXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBmLmRpc3BsYXlPYkggKElkLCBjb250ZW50KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudE5hbWUgPT09ICdmb3JtJykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkKHBhcmVudClcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mb2N1cygpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIChlbGVtZW50TmFtZSA9PT0gJ2Zvcm0nKVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gLy8gZW5kIGlmIChJZCAhPT0gbnVsbClcbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfSAvLyBlbmQgaWYgKGRpc3BPYi5oYXNPd25Qcm9wZXJ0eSAoJ3JtJykpXG4gICAgICAgICAgICBcbiAgICBcbiAgICAgICAgfSBlbHNlIGlmIChpc05FQXJyYXkpIHtcbiAgICBcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzcE9iLmxlbmd0aDsgaSsrKSB7XG4gICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybmVkIElkIHdpbGwgYmUgZm9yIGxhc3QgaXRlbSBpbiBhcnJheVxuICAgICAgICAgICAgICAgICAgICAvLyB1c2VmdWwgdG8gbGF0ZXIgYWRkIHNpYmxpbmdzIHdpdGggJ2FmdGVyJyBrZXlcbiAgICAgICAgICAgICAgICBJZCA9IGYuZGlzcGxheU9iSCAocGFyZW50LCBkaXNwT2IgW2ldKTtcbiAgICBcbiAgICAgICAgICAgIH0gLy8gZW5kIGZvciAodmFyIGkgPSAwOyBpIDwgZGlzcE9iLmxlbmd0aDsgaSsrKVxuICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgSWQgPSBudWxsO1xuICAgICAgICAgICAgICAgIC8vIGNhc2UgZm9yIGRpc3BPYiBhcyBhbiBlbXB0eSBvYmplY3Qgb3IgZW1wdHkgYXJyYXlcbiAgICBcbiAgICAgICAgfSAvLyBlbmQgaWYgKGlzTkVPYmplY3QpXG5cbiAgICB9IC8vIGVuZCBpZiAodi5wcmltaXRpdmVUeXBlc05vdE51bGwuaGFzT3duUHJvcGVydHkgKGRpc3BPYlR5cGUpKVxuICAgIFxuICAgICAgICBcbiAgICByZXR1cm4gSWQ7XG5cbn07IC8vIGVuZCBmLmRpc3BsYXlPYkggXG5cbiovXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuZi5lbGVtZW50TWFrZSA9IChwYXJlbnRPclNpYmxJZCwgcmVsTG9jLCBlbE5hbWUsIGNvbnRlbnQsIGF0dHJzKSA9PiB7XG4gICAgXG4gICAgdmFyIGlkO1xuICAgIHZhciBhdHRyS2V5cyA9IE9iamVjdC5rZXlzIChhdHRycyk7XG4gICAgdmFyIGhhc0F0dHJzID0gYXR0cktleXMubGVuZ3RoID4gMDtcblxuICAgIGlmIChoYXNBdHRycyAmJiBhdHRycy5oYXNPd25Qcm9wZXJ0eSAoJ2lkJykpIHtcblxuICAgICAgICBpZCA9IGF0dHJzLmlkO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBpZCA9IFAuZ2VuSWQgKCk7XG5cbiAgICB9IC8vIGVuZCBpZiAoaGFzQXR0cnMpXG4gICAgXG4gICAgdmFyIElkID0gJyMnICsgaWQ7XG4gICAgXG4gICAgaWYgKGVsTmFtZSA9PT0gJ3NjcmlwdCcgJiYgY29udGVudCAhPT0gMCkge1xuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy85NDEzNzM3L2hvdy10by1hcHBlbmQtc2NyaXB0LXNjcmlwdC1pbi1qYXZhc2NyaXB0XG4gICAgICAgIC8vIGluc3BpcmVkIGJ5IFNPIHF1ZXN0aW9uLCBidXQgc2V0dGluZyBpbm5lckhUTUwgaXNuJ3Qgc3VwcG9zZWQgdG8gd29ya1xuICAgICAgICAvLyB0aGVyZWZvcmUsIHNldCBzcmMgYXR0cmlidXRlIHdpdGggcGF0aCB0byBmaWxlLCBpbnN0ZWFkIG9mIFxuICAgICAgICAvLyBzZXR0aW5nIGlubmVySFRNTCB0byBjb250ZW50IG9mIGZpbGVcblxuICAgICAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy82MTA5OTUvY2FudC1hcHBlbmQtc2NyaXB0LWVsZW1lbnRcbiAgICAgICAgLy8galF1ZXJ5IHdvbid0IGFkZCBzY3JpcHQgZWxlbWVudCBhcyBpdCBkb2VzIHdpdGggYW55IG90aGVyIGVsZW1lbnQuICBUaGVyZWZvcmUsIG11c3QgYmUgZG9uZVxuICAgICAgICAvLyB1c2luZyBvbmx5IGphdmFzY3JpcHQgYXMgZm9sbG93czpcbiAgICAgICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG5cbiAgICAgICAgc2NyaXB0LnNyYyA9IGNvbnRlbnQ7XG4gICAgICAgIHNjcmlwdC5pZCA9IGRpc3BPYi5pZDtcbiAgICAgICAgXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTsgICAgIFxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICB2YXIgZGl2ZWwgPSAnPCcgKyBlbE5hbWUgKyAnIGlkPVwiJyArIGlkICsgJ1wiJztcbiAgICBcbiAgICAgICAgaWYgKGNvbnRlbnQpIHtcbiAgICBcbiAgICAgICAgICAgIGRpdmVsICs9ICc+PC8nICsgZWxOYW1lICsgJz4nO1xuICAgIFxuICAgICAgICB9IGVsc2Uge1xuICAgIFxuICAgICAgICAgICAgZGl2ZWwgKz0gJz4nO1xuICAgIFxuICAgICAgICB9IC8vIGVuZCBpZiAoY29udGVudClcbiAgICBcbiAgICAgICAgJChwYXJlbnRPclNpYmxJZClbcmVsTG9jXSAoZGl2ZWwpO1xuXG4gICAgfSAvLyBlbmQgaWYgKGVsTmFtZSA9PT0gJ3NjcmlwdCcpXG4gICAgXG4gICAgXG4gICAgaWYgKGhhc0F0dHJzKSB7XG4gICAgICAgIFxuICAgICAgICAkKElkKVxuICAgICAgICAuYXR0ciAoYXR0cnMpO1xuXG4gICAgfSAvLyBlbmQgaWYgKGhhc0F0dHJzKVxuXG4gICAgZi5kaXNwbGF5T2JIIChJZCwgY29udGVudCk7XG4gICAgXG4gICAgcmV0dXJuIElkO1xuXG59OyAvLyBlbmQgZi5lbGVtZW50TWFrZVxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5mLnRleHRNYWtlID0gKHBhcmVudCwgcmVsTG9jLCBwcmltaXRpdmUpID0+IHtcbiAgICBcbiAgICBpZiAodHlwZW9mIHByaW1pdGl2ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBzaW5nbGVxdW90ZSA9ICcmI3gwMDI3Oyc7XG4gICAgICAgIHZhciBiYWNrc2xhc2ggPSAnJiN4MDA1YzsnO1xuICAgICAgICB2YXIgZG91YmxlcXVvdGUgPSAnJiN4MDAyMjsnO1xuICAgICAgICB2YXIgbHQgPSAnJmx0Oyc7XG4gICAgICAgIFxuICAgICAgICBwcmltaXRpdmUgPSBwcmltaXRpdmUucmVwbGFjZSAoLycvZywgc2luZ2xlcXVvdGUpO1xuICAgICAgICBwcmltaXRpdmUgPSBwcmltaXRpdmUucmVwbGFjZSAoL1wiL2csIGRvdWJsZXF1b3RlKTtcbiAgICAgICAgcHJpbWl0aXZlID0gcHJpbWl0aXZlLnJlcGxhY2UgKC9cXFxcL2csIGJhY2tzbGFzaCk7XG4gICAgICAgIHByaW1pdGl2ZSA9IHByaW1pdGl2ZS5yZXBsYWNlICgvPC9nLCBsdCk7XG5cbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBwcmltaXRpdmUgPT09ICdzeW1ib2wnKSB7XG5cbiAgICAgICAgcHJpbWl0aXZlID0gJ3N5bWJvbCc7XG4gICAgICAgICAgICAvLyBvdGhlcndpc2Ugc3RyaW5naWZ5IHdvdWxkIHByb2R1Y2UgJ3t9JyB3aGljaCBpcyBsZXNzIHVzZWZ1bFxuXG4gICAgfSBlbHNlIHtcblxuICAgICAgICBwcmltaXRpdmUgPSBKU09OLnN0cmluZ2lmeSAocHJpbWl0aXZlKTtcblxuICAgIH0gLy8gZW5kIGlmICh0eXBlb2YgcHJpbWl0aXZlID09PSAnc3RyaW5nJylcbiAgICBcblxuICAgICQocGFyZW50KSBbcmVsTG9jXSAocHJpbWl0aXZlKTtcblxuICAgIHJldHVybiBudWxsO1xuICAgICAgICAvLyB0ZXh0IG9icyBoYXZlIG5vIGlkJ3M6IG9ubHkgdGV4dCBpcyBhcHBlbmRlZCB3aXRoIG5vIHdheSB0byBhZGRyZXNzIGl0XG4gICAgICAgIC8vIGlmIGFkZHJlc3NpbmcgaXMgbmVjZXNzYXJ5LCB1c2Ugc3BhbiBpbnN0ZWFkIG9mIHRleHRcblxufTsgLy8gZW5kIGYudGV4dE1ha2UgXG5cblxuXG4vLyBQVUJMSUMgUHJvcGVydGllcy9NZXRob2RzXG52YXIgUCA9IHt9O1xuXG4vLy0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuUC5kaXNwbGF5T2IgPSAoZGlzcE9iKSA9PiB7XG4gICAgXG4gICAgdmFyIHBhcmVudCA9ICdib2R5JztcbiAgICAgICAgLy8gaWYgcGFyZW50IG5vdCBmb3VuZCwgYXBwZW5kIHRvIGJvZHlcblxuICAgIGlmICh0eXBlb2YgZGlzcE9iID09PSAnb2JqZWN0JyAmJiBkaXNwT2IuaGFzT3duUHJvcGVydHkgKCdwYXJlbnQnKSkge1xuXG4gICAgICAgIHBhcmVudCA9IGRpc3BPYi5wYXJlbnQ7XG5cbiAgICB9IC8vIGVuZCBpZiAodHlwZW9mIGRpc3BPYiA9PT0gJ29iamVjdCcgJiYgZGlzcE9iLmhhc093blByb3BlcnR5ICgncGFyZW50JykpXG4gICAgXG4gICAgdmFyIElkID0gZi5kaXNwbGF5T2JIIChwYXJlbnQsIGRpc3BPYik7XG5cbiAgICByZXR1cm4gSWQ7XG5cbn07IC8vIGVuZCBQLmRpc3BsYXlPYiBcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAuZ2VuSWQgPSAoKSA9PiB7XG5cbiAgICB2YXIgaWQgPSAnaScgKyB2LmlkKys7XG4gICAgcmV0dXJuIGlkO1xuXG59OyAvLyBlbmQgUC5nZW5JZFxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5QLmdlbklkcyA9ICgpID0+IHtcbiAgICBcbiAgICB2YXIgaWQgPSBQLmdlbklkICgpO1xuICAgIHZhciBJZCA9ICcjJyArIGlkO1xuXG4gICAgcmV0dXJuIFtpZCwgSWRdO1xuXG59OyAvLyBlbmQgUC5nZW5JZHNcblxuXG5cbi8vIGVuZCBQVUJMSUMgc2VjdGlvblxuXG5mLmluaXQgKCk7XG5cbnJldHVybiBQO1xuXG59KCkpO1xuXG5cblxuIiwiXG4vLyB0ZXN0LmpzXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICAkKGRvY3VtZW50KVxuICAgIC5yZWFkeSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgajJoID0gcmVxdWlyZSAoJ2dvLWoyaCcpLmRpc3BsYXlPYjtcblxuICAgICAgICBqMmggKHtcbiAgICAgICAgICAgIHNwYW46IHtsYWJlbDogJ3Rlc3QgZ28tajJoJ30sIFxuICAgICAgICAgICAgc3R5bGU6IFwiYm9yZGVyOiAxcHggc29saWQgYmx1ZTtcIiArXG4gICAgICAgICAgICAgICAgXCJib3JkZXItcmFkaXVzOiA0cHg7XCIgK1xuICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvcjogI2NjZmZjYztcIlxuICAgICAgICB9KTtcblxuICAgICAgICBqMmggKHticjogMH0pO1xuICAgICAgICBqMmggKFwicGxhaW4gdGV4dFwiKTtcblxuICAgIH0pO1xuXG59KSAoKTtcbiIsIi8vIGdvLW1zZy9pbmRleC5qc1xuLy8gZ28tbXNnIG9iamVjdCBoYXMgYSB1bmlxdWUgcHJpbWFyeSBtc2cgYW5kIHplcm8gb3IgbW9yZSBvcHRpb25hbCBhdHRyaWJ1dGVzXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAocDApIHtcblxuICAgIC8vIFBSSVZBVEUgUHJvcGVydGllc1xudmFyIHYgPSB7XG5cbiAgICBwcmltYXJ5OiBudWxsLFxuICAgICAgICAvLyBwcmltYXJ5OiB7Y21kOiAxfSAoY29udGFpbnMgb3B0aW9uYWwgY29udGVudCkgb3Ige2NtZDogMH0gKG5vIG9wdGlvbmFsIGNvbnRlbnQgYWxsb3dlZClcblxuICAgIHNlY29uZGFyeTogbnVsbCxcbiAgICAgICAgLy8gaWYgYSBwcmltYXJ5IG1lc3NhZ2UgaGFzIGFuIG9wdGlvbmFsIGF0dHJpYnV0ZSB0aGF0IGNvbmNpZGVudGFsbHkgaXMgdGhlIHNhbWUgYXNcbiAgICAgICAgLy8gYW5vdGhlciBwcmltYXJ5IG1lc3NhZ2UsIGl0IHNob3VsZCBiZSBoYXZlIGEga2V5L3ZhbHVlIHBhaXIgaW4gc2Vjb25kYXJ5IHthdHRyOiAxfVxuICAgICAgICAvLyB0byBlbnN1cmUgdGhhdCBpdCB3aWxsIGJlIHRyZWF0ZWQgYXMgYW4gYXR0cmlidXRlIGluIGNhc2UgYSBwcmltYXJ5IGlzIHByZXNlbnRcbiAgICAgICAgLy8gU2Vjb25kYXJ5IGlzIG9ubHkgdGVzdGVkIGlmIHRoZXJlIGV4aXN0cyBhIHByaW1hcnkga2V5XG5cbiAgICBtZXRhOiBudWxsLFxuICAgICAgICAvLyBtZXRhIHBhcmFtZXRlcnMgaW50ZW5kZWQgZm9yIGN0cmwgb3Igb3RoZXIgcHVycG9zZSBvdXRzaWRlIG9mIHByaW1hcnkgYW5kIHNlY29uZGFyeSBtc2dcbiAgICAgICAgLy8gcGFyYW1ldGVyIHVzYWdlXG5cbn07ICAvLyBlbmQgUFJJVkFURSBwcm9wZXJ0aWVzXG5cbiAgICAvLyBQUklWQVRFIEZ1bmN0aW9uc1xuZiA9IHt9O1xuXG5cbmYuaW5pdCA9ICgpID0+IHtcblxuICAgIHYucHJpbWFyeSA9IHAwLnByaW1hcnk7XG4gICAgdi5zZWNvbmRhcnkgPSBwMC5oYXNPd25Qcm9wZXJ0eSAoJ3NlY29uZGFyeScpID8gcDAuc2Vjb25kYXJ5IDoge307XG4gICAgdi5tZXRhID0gcDAuaGFzT3duUHJvcGVydHkgKCdtZXRhJykgPyBwMC5tZXRhIDoge307XG59O1xuXG4gICAgLy8gUFVCTElDIEZ1bmN0aW9uc1xudmFyIFAgPSB7fTtcblxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblAucGFyc2VNc2cgPSAobXNnT2IpID0+IHtcbiAgICBcbiAgICB2YXIgcmVzID0ge307XG4gICAgdmFyIG1zZ0tleXMgPSBPYmplY3Qua2V5cyAobXNnT2IpO1xuXG4gICAgdmFyIHByaW1hcnlDYW5kaWRhdGVzT2IgPSB7fTtcbiAgICB2YXIgYXR0cnNPYiA9IHt9O1xuICAgIHZhciBtZXRhT2IgPSB7fTtcblxuICAgIHZhciBrZXk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtc2dLZXlzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAga2V5ID0gbXNnS2V5cyBbaV07XG4gICAgICAgIFxuICAgICAgICBpZiAodi5wcmltYXJ5Lmhhc093blByb3BlcnR5IChrZXkpKSB7XG5cbiAgICAgICAgICAgIHByaW1hcnlDYW5kaWRhdGVzT2IgW2tleV0gPSAxO1xuXG4gICAgICAgIH0gZWxzZSBpZiAodi5tZXRhLmhhc093blByb3BlcnR5IChrZXkpKSB7XG5cbiAgICAgICAgICAgIG1ldGFPYiBba2V5XSA9IG1zZ09iIFtrZXldO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGF0dHJzT2IgW2tleV0gPSBtc2dPYiBba2V5XTtcblxuICAgICAgICB9IC8vIGVuZCBpZiAodi5wcmltYXJ5Lmhhc093blByb3BlcnR5IChrZXkpKVxuICAgICAgICBcbiAgICB9IC8vIGVuZCBmb3IgKHZhciBpID0gMDsgaSA8IG1zZ0tleXMubGVuZ3RoOyBpKyspXG5cbiAgICB2YXIgcHJpbWFyeUNhbmRpZGF0ZXNBID0gT2JqZWN0LmtleXMgKHByaW1hcnlDYW5kaWRhdGVzT2IpO1xuXG4gICAgdmFyIHByaW1hcnlLZXk7XG4gICAgdmFyIGNvbnRlbnQ7XG5cbiAgICBpZiAocHJpbWFyeUNhbmRpZGF0ZXNBLmxlbmd0aCA9PT0gMCkge1xuXG4gICAgICAgIHJlcy5lcnIgPSAnTm8gcHJpbWFyeSBjYW5kaWRhdGVzIGZvdW5kIGluIG1zZ09iOiAnICsgSlNPTi5zdHJpbmdpZnkgKG1zZ09iKTtcblxuICAgIH0gZWxzZSBpZiAocHJpbWFyeUNhbmRpZGF0ZXNBLmxlbmd0aCA9PT0gMSkge1xuXG4gICAgICAgIHByaW1hcnlLZXkgPSBwcmltYXJ5Q2FuZGlkYXRlc0EgWzBdO1xuXG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaGFuZGxlIHByaW1hcnkvc2Vjb25kYXJ5IGtleSByZXNvbHV0aW9uXG5cbiAgICAgICAgcHJpbWFyeUtleSA9IG51bGw7XG4gICAgICAgIGZvciAoa2V5IGluIHByaW1hcnlDYW5kaWRhdGVzT2IpIHtcblxuICAgICAgICAgICAgaWYgKHYuc2Vjb25kYXJ5Lmhhc093blByb3BlcnR5IChrZXkpKSB7XG5cbiAgICAgICAgICAgICAgICBhdHRyc09iIFtrZXldID0gbXNnT2IgW2tleV07XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJpbWFyeUtleSA9PT0gbnVsbCkge1xuXG4gICAgICAgICAgICAgICAgICAgIHByaW1hcnlLZXkgPSBrZXk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgICAgIHJlcy5lcnIgPSAnTXVsdGlwbGUgcHJpbWFyeSBrZXlzIGZvdW5kIG5vdCBpbiBzZWNvbmRhcnkgb2JqZWN0OiAnICsgSlNPTi5zdHJpbmdpZnkgKG1zZyk7XG5cbiAgICAgICAgICAgICAgICB9IC8vIGVuZCBpZiAocHJpbWFyeUtleSA9PT0gbnVsbClcbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfSAvLyBlbmQgaWYgKHYuc2Vjb25kYXJ5Lmhhc093blByb3BlcnR5IChrZXkpKVxuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgIH0gLy8gZW5kIGlmIChwcmltYXJ5Q2FuZGlkYXRlc0EubGVuZ3RoID09PSAwKVxuXG5cbiAgICBpZiAoIXJlcy5oYXNPd25Qcm9wZXJ0eSAoJ2VycicpKSB7XG5cbiAgICAgICAgcmVzLnAgPSBwcmltYXJ5S2V5O1xuICAgICAgICByZXMuYyA9IHYucHJpbWFyeSBbcHJpbWFyeUtleV0gIT09IDAgPyBtc2dPYiBbcHJpbWFyeUtleV0gOiBudWxsO1xuICAgICAgICAgICAgLy8gZXhhbXBsZSB2b2lkIGh0bWwgdGFnIGhhcyB6ZXJvIGNvbnRlbnQsIHNvIGNvbnRlbnQgaXMgZm9yY2VkIHRvIG51bGxcblxuICAgICAgICByZXMucyA9IGF0dHJzT2I7XG4gICAgICAgIHJlcy5tID0gbWV0YU9iO1xuXG4gICAgfSAvLyBlbmQgaWYgKCFyZXMuaGFzT3duUHJvcGVydHkgKCdlcnInKSlcbiAgICBcbiAgICBcbiAgICByZXR1cm4gcmVzO1xuXG59OyAvLyBlbmQgUC5wYXJzZU1zZyBcblxuXG5cbiAgICAvLyBlbmQgUFVCTElDIEZ1bmN0aW9uc1xuXG5mLmluaXQgKCk7XG5cbnJldHVybiBQO1xuXG59O1xuXG5cblxuIl19
