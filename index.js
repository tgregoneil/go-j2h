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

            Id = f.textMake (parent, relLoc, text);

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
    
    if (elName === 'form') {

        $(parent)
        .focus ();

    } // end if (elName === 'form')
    
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



