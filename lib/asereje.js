var _cache = {}
  , ASEREJE = {}
  , _settings = { active: true
                , js_globals: []
                , css_globals: []
                , sqwish_strict: true
                }
  , uglify = require('uglify-js')
  , sqwish = require('sqwish')
  , _ = require('underscore')
  , crypto = require('crypto')
  , fs = require('fs');

function md5(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}

function _get(type, global_files, files) {
  if (!_settings[type + '_path']) throw (Error('You must configure asereje paths first!'));

  function getCache(files) {
    return _cache[files.join(';')];
  }

  function setAndCache(files) {
    var funk = require('funk')('parallel')
      , path = _settings[type + '_path'] + '/';

    files.forEach(function (el) {
      fs.readFile(path + el + '.' + type, 'utf8', funk.result(el));
    });

    funk.run(function () {
      var self = this, minified, bundled = '';

      files.forEach(function (el) {
        bundled += self[el];
      });

      if (type === 'css') {
        minified = sqwish.minify(bundled, _settings.sqwish_strict);
      } else if (type === 'js') {
        (function () {
          var jsp = uglify.parser
            , pro = uglify.uglify
            , ast = jsp.parse(bundled);

          ast = pro.ast_mangle(ast);
          ast = pro.ast_squeeze(ast);
          minified = pro.gen_code(ast);
        }());
      }

      _cache[files.join(';')] = ['dist/' + md5(minified), minified];
      fs.writeFile(path + getCache(files)[0] + '.' + type, getCache(files)[1]);
    });
  }

  function run(files) {
    var cached = getCache(files);

    if (cached) {
      return [cached[0]];
    } else {
      if (files.length) {
        setAndCache(files);
      }
      return files;
    }
  }

  return run(global_files).concat(run(files));
}

/**
 * Sets a config value
 *
 * @param {Object} values
 *
 * @return itself
 */
ASEREJE.config = function (values) {
  _settings = _.extend(_settings, values);
  return ASEREJE;
};

/**
 * Returns an array of file names.
 * Creates and caches the new css assets.
 *
 * @param {Array} files
 *
 * @return {Array}
 */
ASEREJE.css = function (files) {
  if (!_settings.css_globals) throw (Error('You must configure asereje `css_globals` first!'));

  files = files || [];

  if (_settings.active) {
    return _get('css', _settings.css_globals, files);
  } else {
    return _settings.css_globals.concat(files);
  }
};

/**
 * Returns an array of file names.
 * Creates and caches the new javascript assets.
 *
 * @param {Array} global_files
 * @param {Array} files
 *
 * @return {Array}
 */
ASEREJE.js = function (files) {
  if (!_settings.js_globals) throw (Error('You must configure asereje `js_globals` first!'));

  files = files || [];

  if (_settings.active) {
    return _get('js', _settings.js_globals, files);
  } else {
    return _settings.js_globals.concat(files);
  }
};

module.exports = ASEREJE;
