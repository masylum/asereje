        .aMMMb  .dMMMb  dMMMMMP dMMMMb  dMMMMMP dMMMMMP dMMMMMP
       dMP"dMP dMP" VP dMP     dMP.dMP dMP         dMP dMP
      dMMMMMP  VMMMb  dMMMP   dMMMMK" dMMMP       dMP dMMMP
     dMP dMP dP .dMP dMP     dMP"AMF dMP     dK .dMP dMP
    dMP dMP  VMMMP" dMMMMMP dMP dMP dMMMMMP  VMMMP" dMMMMMP


"Aserejé ja de jé de jebe, tu de jebere sebiunouba, majabi an de bugui an de buididip"

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
  active: process.env.NODE_ENV === 'production';        // enable it just for production
, js_globals: ['lib/jquery', 'global', 'underscore'];   // js files that will be present always
, css_globals: ['reset', 'global'];                     // css files that will be present always
, js_path: _dirname + '/public/javascripts'            // javascript folder path
, css_path: _dirname + '/public/css'                   // css folder path
});
```

Then you can use `css` or `js` function to get the file names.

``` javascript
res.render('users/index', {
  css: asereje.css(['users', users/index]) // => ['reset', 'global', 'users', 'users/index']
});

... it builds the files and the next requests fill be:

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
