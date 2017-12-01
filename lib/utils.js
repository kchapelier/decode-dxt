"use strict";

var utils = {};

var lerp = function lerp (v1, v2, r) {
    return v1 * (1 - r) + v2 * r;
};

var convert565ByteToRgb = function convert565ByteToRgb (byte) {
    return [
        Math.round(((byte >>> 11) & 31) * (255 / 31)),
        Math.round(((byte >>> 5) & 63) * (255 / 63)),
        Math.round((byte & 31) * (255 / 31))
    ];
};

utils.extractBitsFromUin16Array = function extractBitsFromUin16Array (array, shift, length) {
    // sadly while javascript operates with doubles, it does all its binary operations on 32 bytes integers
    // so we have to get a bit dirty to do the bitshifting on the 48 bytes integer for the alpha values of DXT5

    var height = array.length,
        heightm1 = height - 1,
        width = 16,
        rowS = ((shift / width) | 0),
        rowE = (((shift + length - 1) / width) | 0),
        shiftS,
        shiftE,
        result;

    if (rowS === rowE) {
        // all the requested bits are contained in a single uint16
        shiftS = (shift % width);
        result = (array[heightm1 - rowS] >> shiftS) & (Math.pow(2, length) - 1);
    } else {
        // the requested bits are contained in two continuous uint16
        shiftS = (shift % width);
        shiftE = (width - shiftS);
        result = (array[heightm1 - rowS] >> shiftS) & (Math.pow(2, length) - 1);
        result += (array[heightm1 - rowE] & (Math.pow(2, length - shiftE) - 1)) << shiftE;
    }

    return result;
};

utils.interpolateColorValues = function interpolateColorValues (firstVal, secondVal, isDxt1) {
    var firstColor = convert565ByteToRgb(firstVal),
        secondColor = convert565ByteToRgb(secondVal),
        colorValues = [].concat(firstColor, 255, secondColor, 255);

    if (isDxt1 && firstVal <= secondVal) {
        colorValues.push(
            Math.round((firstColor[0] + secondColor[0]) / 2),
            Math.round((firstColor[1] + secondColor[1]) / 2),
            Math.round((firstColor[2] + secondColor[2]) / 2),
            255,

            0,
            0,
            0,
            0
        );
    } else {
        colorValues.push(
            Math.round(lerp(firstColor[0], secondColor[0], 1 / 3)),
            Math.round(lerp(firstColor[1], secondColor[1], 1 / 3)),
            Math.round(lerp(firstColor[2], secondColor[2], 1 / 3)),
            255,

            Math.round(lerp(firstColor[0], secondColor[0], 2 / 3)),
            Math.round(lerp(firstColor[1], secondColor[1], 2 / 3)),
            Math.round(lerp(firstColor[2], secondColor[2], 2 / 3)),
            255
        );
    }

    return colorValues;
};

utils.interpolateAlphaValues = function interpolateAlphaValues (firstVal, secondVal) {
    var alphaValues = [firstVal, secondVal];

    if (firstVal > secondVal) {
        alphaValues.push(
            Math.floor(lerp(firstVal, secondVal, 1 / 7)),
            Math.floor(lerp(firstVal, secondVal, 2 / 7)),
            Math.floor(lerp(firstVal, secondVal, 3 / 7)),
            Math.floor(lerp(firstVal, secondVal, 4 / 7)),
            Math.floor(lerp(firstVal, secondVal, 5 / 7)),
            Math.floor(lerp(firstVal, secondVal, 6 / 7))
        );
    } else {
        alphaValues.push(
            Math.floor(lerp(firstVal, secondVal, 1 / 5)),
            Math.floor(lerp(firstVal, secondVal, 2 / 5)),
            Math.floor(lerp(firstVal, secondVal, 3 / 5)),
            Math.floor(lerp(firstVal, secondVal, 4 / 5)),
            0,
            255
        );
    }

    return alphaValues;
};

utils.multiply = function (component, multiplier) {
    if (!isFinite(multiplier) || multiplier === 0) {
        return 0;
    }

    return Math.round(component * multiplier);
};

module.exports = utils;
