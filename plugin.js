var path = require('path');
var postcss = require('postcss');
var RawSource = require('webpack/lib/RawSource');

function DedupCSSPlugin(opts) {
  var options = this.options = {};
  opts = opts || {};
  options.suffix = !!opts.override ? '' : (opts.suffix || '');
}

function deduplicate(root) {
  root.each(function (node) {
    if (node.nodes) deduplicate(node);
  });

  root.each(function (node) {
    if (node.type === 'comment') return;

    var nodeStr = node.toString();
    while (node = node.next()) {
      if (node.toString() === nodeStr) {
        node = [node.prev(), node.remove()][0];
      }
    }
  });
}

DedupCSSPlugin.prototype.apply = function(compiler) {
  var suffix = this.options.suffix;
  compiler.plugin('emit', function(compilation, cb) {
    var assets = compilation.assets;
    Object.keys(assets).forEach(function(assetName) {
      if (path.extname(assetName) === '.css') {
        var asset = assets[assetName];
        var root = postcss.parse(asset.source(), { map: { prev: false }});
        deduplicate(root);
        assets[assetName + suffix] = new RawSource(root.toResult().css);
      }
    });
    cb();
  });
};

module.exports = DedupCSSPlugin;
