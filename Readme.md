        .aMMMb  .dMMMb  dMMMMMP dMMMMb  dMMMMMP dMMMMMP dMMMMMP
       dMP"dMP dMP" VP dMP     dMP.dMP dMP         dMP dMP
      dMMMMMP  VMMMb  dMMMP   dMMMMK" dMMMP       dMP dMMMP
     dMP dMP dP .dMP dMP     dMP"AMF dMP     dK .dMP dMP
    dMP dMP  VMMMP" dMMMMMP dMP dMP dMMMMMP  VMMMP" dMMMMMP


"Aserejé ja de jé de jebe, tu de jebere sebiunouba, majabi an de bugui an de buididipí"

## Description

Asereje is a library that builds your assets on demand.

## Installation

``` bash
npm install asereje
```

## Usage

First you have to configure asereje:

``` javascript
var asereje = require('asereje');

asereje.config({
  active: process.env.NODE_ENV === 'production'        // enable it just for production
, js_globals: ['lib/jquery', 'global', 'underscore']   // js files that will be present always
, css_globals: ['reset', 'global']                     // css files that will be present always
, js_path: _dirname + '/public/javascripts'            // javascript folder path
, css_path: _dirname + '/public/css'                   // css folder path
});
```

Then you can use `css` or `js` function to get the file names.

``` javascript
res.render('users/index', {
  css: asereje.css(['users', users/index]) // => ['reset', 'global', 'users', 'users/index']
});

... it builds the files and the next requests will return:

res.render('users/index', {
  css: asereje.css(['users', users/index]) // => ['dist/f330099956c144c090b06f6d4bae8770', 'dist/caa6925553b03e049eeda6f70da9dc1a']
});
```

``` jade
html
  head
    -if(css)
      -each file in css
        link(rel= 'stylesheet', href= '/css/' + file + '.css' )
  ...
```

## Explanation

Asereje does 3 things:

  * Bundles your files together and build 2 files. The first is for the files that are common to all the pages, such a reset.css or jquery.js.
    This files will be cached once and not requested anymore. The second file is specific to each page.
  * Applies minification. `Ugilify-js` for javascripts and `sqwish` for css.
  * Renames the files with the md5 of the content. This way we can set the expires header to max.

## Configure your webserver to take advantage

Built files are stored under `js_path|css_path/dist`. Add expires headers to all this files so the users will have them cached forever.

```
// nginx conf
location ~* ^/(css|javascripts)/dist/.+\.(css|js)$ {
  expires max;
}
```

## Asereje? What does it mean??

[The true meaning of life](http://www.youtube.com/watch?v=drw-M-t4OTo)

## License

(The MIT License)

Copyright (c) 2011 Pau Ramon Revilla &lt;masylum@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
