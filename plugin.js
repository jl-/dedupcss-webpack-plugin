var path = require('path');
var postcss = require('postcss');
var RawSource = require('webpack-sources').RawSource;

function DedupCSSPlugin (options) {
    this.options = options || {
        removeComments: true
    };
}

function dedup (root, options) {
    function isNodeEqual (a, b) {
        var isSameShape = ['type', 'important', 'name', 'selector', 'params', 'prop', 'value'].every(function (i) {
            return a[i] === b[i];
        });
        if (isSameShape && a.nodes) {
            return a.nodes.length === b.nodes.length && a.nodes.every(function (item, index) {
                return isNodeEqual(item, b.nodes[index]);
            });
        }
        return isSameShape;
    }
    function removeComments (root) {
        root.walkComments(function (comment) {
            comment.remove();
        });
    }
    function dedupSiblings (node) {
        var precedent = node;
        while (precedent = precedent.prev()) {
            if (isNodeEqual(precedent, node)) {
                precedent = [precedent.next(), precedent.remove()][0];
            }
        }
        if (node.prev()) {
            dedupSiblings(node.prev());
        }
    }
    function digest (node) {
        if (!node || !node.nodes) {
            return node;
        }
        node.each(digest);
        if (node.last) {
            dedupSiblings(node.last);
        }
        return node;
    }

    if (options.removeComments) {
        removeComments(root);
    }
    return digest(root);
}

DedupCSSPlugin.prototype.apply = function (compiler) {
    var options = this.options;
    compiler.plugin('emit', function (compilation, callback) {
        var assets = compilation.assets;
        Object.keys(assets).forEach(function(assetName) {
            if (path.extname(assetName) === '.css') {
                var asset = assets[assetName];
                var source = postcss.parse(asset.source());
                var deduped = dedup(source, options);
                assets[assetName] = new RawSource(deduped.toResult().css);
            }
        });
        callback();
    });
};

module.exports = DedupCSSPlugin;
