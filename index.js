"use strict";

var bc1 = require('./lib/bc1'),
    bc2 = require('./lib/bc2'),
    bc3 = require('./lib/bc3');

//TODO check correctness of readDXT2 and readDXT4

module.exports = {
    readDXT1: function (imageData, width, height) {
        return bc1.read(imageData, width, height);
    },
    readDXT2: function (imageData, width, height) {
        return bc2.read(imageData, width, height, true);
    },
    readDXT3: function (imageData, width, height) {
        return bc2.read(imageData, width, height, false);
    },
    readDXT4: function (imageData, width, height) {
        return bc3.read(imageData, width, height, true);
    },
    readDXT5: function (imageData, width, height) {
        return bc3.read(imageData, width, height, false);
    }
};
