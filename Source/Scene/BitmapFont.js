define([
        '../Core/defaultValue',
        '../Core/defined',
        '../Core/defineProperties',
        '../Core/BoundingRectangle',
        '../Core/Resource',
        '../ThirdParty/when'
    ], function(
        defaultValue,
        defined,
        defineProperties,
        BoundingRectangle,
        Resource,
        when) {
    'use strict';

    function BitmapFont(options) {
        options = defaultValue(options, defaultValue.EMPTY_OBJECT);

        this._path = options.path;

        this._pages = [];
    }

    defineProperties(BitmapFont.prototype, {
        /**
         * The path to the bitmap font configuration
         * @memberof BitmapFont.prototype
         * @type {String}
         */
        path : {
            get : function() {
                return this._path;
            }
        }
    });

    BitmapFont.prototype.load = function(callback) {
        this.loading = true;
        var that = this;
        Resource.fetchJson({
            url: this._path
        }).then(function(data) {
            that.init(data);
            that.loading = false;
            callback(that);
        });
    }

    BitmapFont.prototype.getBounds = function(char) {
        for (var i = 0; i < this.chars.length; i++) {
            if (this.chars[i].char === char) {
                return new BoundingRectangle(this.chars[i].x, 256 - this.chars[i].height - this.chars[i].y, this.chars[i].width, this.chars[i].height);
            }
        }
        return undefined;
    }

    BitmapFont.prototype.getCharInfo = function(char) {
        for (var i = 0; i < this.chars.length; i++) {
            if (this.chars[i].char === char) {
                return this.chars[i];
            }
        }
        return undefined;
    }

    BitmapFont.prototype.getKerning = function(first, second) {
        for (var i = 0; i < this.kernings.length; i++) {
            if (this.kernings[i].first === first && this.kernings[i].second === second) {
                return this.kernings[i];
            }
        }
        return undefined;
    }

    BitmapFont.prototype.init = function(data) {
        this.pages = data.pages;
        this.chars = data.chars;
        this.info = data.info;
        this.common = data.common;
        this.distanceField = data.distanceField;
        this.kernings = data.kernings;
    }

    return BitmapFont;
});
