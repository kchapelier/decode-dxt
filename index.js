"use strict";

var dxt1 = require('./lib/dxt1'),
    dxt3 = require('./lib/dxt3'),
    dxt5 = require('./lib/dxt5');

//TODO support DXT2 and DXT4 (3 and 5 with colors premultiplied with alpha)

module.exports = {
    readDXT1: function (imageData, width, height) {
        return dxt1.read(imageData, width, height);
    },
    readDXT3: function (imageData, width, height) {
        return dxt3.read(imageData, width, height);
    },
    readDXT5: function (imageData, width, height) {
        return dxt5.read(imageData, width, height);
    }
};
