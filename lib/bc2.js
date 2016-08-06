/**
 *
 * Block Compression 2 : DXT2 (alpha premultiplied) and DXT3 (not alpha premultiplied)
 *
 */

"use strict";

var utils = require('./utils');

var getAlphaValue = function getAlphaValue (alphaValue, pixelIndex) {
    return utils.extractBitsFromUin16Array(alphaValue, (4 * (15 - pixelIndex)), 4) * 17;
};

module.exports = function decodeBC2 (imageData, width, height, premultiplied) {
    var rgba = new Uint8Array(width * height * 4),
        height_4 = (height / 4) | 0,
        width_4 = (width / 4) | 0,
        offset = 0,
        alphaValues,
        alphaValue,
        multiplier,
        colorValues,
        colorIndices,
        colorIndex,
        pixelIndex,
        rgbaIndex,
        h,
        w,
        x,
        y;

    for (h = 0; h < height_4; h++) {
        for (w = 0; w < width_4; w++) {
            alphaValues = [
                imageData.getUint16(offset + 6, true),
                imageData.getUint16(offset + 4, true),
                imageData.getUint16(offset + 2, true),
                imageData.getUint16(offset, true)
            ]; // reordered as big endian

            colorValues = utils.interpolateColorValues(imageData.getUint16(offset + 8, true), imageData.getUint16(offset + 10, true));
            colorIndices = imageData.getUint32(offset + 12, true);

            for (y = 0; y < 4; y++) {
                for (x = 0; x < 4; x++) {
                    pixelIndex = (3 - x) + (y * 4);
                    rgbaIndex = (h * 4 + 3 - y) * width * 4 + (w * 4 + x) * 4;
                    colorIndex = (colorIndices >> (2 * (15 - pixelIndex))) & 0x03;
                    alphaValue = getAlphaValue(alphaValues, pixelIndex);

                    multiplier = premultiplied ? 255 / alphaValue : 1;

                    rgba[rgbaIndex] = utils.multiply(colorValues[colorIndex * 4], multiplier);
                    rgba[rgbaIndex + 1] = utils.multiply(colorValues[colorIndex * 4 + 1], multiplier);
                    rgba[rgbaIndex + 2] = utils.multiply(colorValues[colorIndex * 4 + 2], multiplier);
                    rgba[rgbaIndex + 3] = getAlphaValue(alphaValues, pixelIndex);
                }
            }

            offset += 16;
        }
    }

    return rgba;
};
