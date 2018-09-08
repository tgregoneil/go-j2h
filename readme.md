 
### go-j2h 

Converts objects, arrays and primitives into html. An html-object is 
an object that has a key that is a valid html tag and is converted into 
the corresponding html element. The remaining keys/values of the object 
are treated as corresponding attributes/values for that html element. 

Arrays are interpreted as corresponding sequences of html elements. 

Any arbitrary html structure can be rendered with arbitrarily deep nesting. 

A 'cmd-object' is an object that has one of the command keys: 
    'empty': empties the html element, but leaves the element itself in place
    'rm': removes the content and the element itself
    'content': replaces existing content of a non-void html element 
    'attr': sets an attribute (or replaces with new value, if attribute exists)

Replaces Deprecated go-json2html

### Installation
```shell
$ npm install go-j2h
```

### Example (test.js)

```js
var j2h = require ('go-j2h').displayOb;

j2h ({
    span: {label: 'test go-j2h'}, 
    style: "border: 1px solid blue;" +
        "border-radius: 4px;" +
        "background-color: #ccffcc;"
});

j2h ({br: 0});
j2h ("plain text");
```
![rendered](https://raw.githubusercontent.com/tgregoneil/go-j2h/master/testGoJ2H.png)


