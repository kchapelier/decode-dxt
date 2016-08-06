"use strict";

var decodeBC1 = require('./lib/bc1'),
    decodeBC2 = require('./lib/bc2'),
    decodeBC3 = require('./lib/bc3');

/**
 * Decode a DXT image to RGBA data.
 * @param {DataView} imageDataView A DataView pointing directly to the data of the DXT image
 * @param {int} width Width of the image
 * @param {int} height Height of the image
 * @param {string} [format='dxt1'] Format of the image (dxt1, dxt2, dxt3, dxt4 or dxt5)
 * @returns {Uint8Array} Decoded RGBA data
 * @throws Will throw if the format is not recognized
 */
function decode (imageDataView, width, height, format) {
    var result;

    format = format ? format.toLowerCase() : 'dxt1';

    if (format === decode.dxt1) {
        result = decodeBC1(imageDataView, width, height);
    } else if(format === decode.dxt2) {
        result = decodeBC2(imageDataView, width, height, true);
    } else if(format === decode.dxt3) {
        result = decodeBC2(imageDataView, width, height, false);
    } else if(format === decode.dxt4) {
        result = decodeBC3(imageDataView, width, height, true);
    } else if(format === decode.dxt5) {
        result = decodeBC3(imageDataView, width, height, false);
    } else {
        throw new Error('Unknown DXT format : \'' + format + '\'');
    }

    return result;
}

decode.dxt1 = 'dxt1';
decode.dxt2 = 'dxt2';
decode.dxt3 = 'dxt3';
decode.dxt4 = 'dxt4';
decode.dxt5 = 'dxt5';

module.exports = decode;
