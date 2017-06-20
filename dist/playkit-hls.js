(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("hls.js"), require("playkit-js"));
	else if(typeof define === 'function' && define.amd)
		define(["hls.js", "playkit-js"], factory);
	else if(typeof exports === 'object')
		exports["PlaykitJsHls"] = factory(require("hls.js"), require("playkit-js"));
	else
		root["PlaykitJsHls"] = factory(root["Hls"], root["Playkit"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var cov_29usqbrt0g = function () {
  var path = '/Users/dan.ziv/WebstormProjects/playkit-js-hls/src/hls-adapter.js',
      hash = '7044baaabd630e527fdda6203fb87e8922b036ca',
      global = new Function('return this')(),
      gcv = '__coverage__',
      coverageData = {
    path: '/Users/dan.ziv/WebstormProjects/playkit-js-hls/src/hls-adapter.js',
    statementMap: {
      '0': {
        start: {
          line: 69,
          column: 25
        },
        end: {
          line: 69,
          column: 123
        }
      },
      '1': {
        start: {
          line: 70,
          column: 4
        },
        end: {
          line: 70,
          column: 113
        }
      },
      '2': {
        start: {
          line: 71,
          column: 4
        },
        end: {
          line: 71,
          column: 26
        }
      },
      '3': {
        start: {
          line: 81,
          column: 25
        },
        end: {
          line: 81,
          column: 44
        }
      },
      '4': {
        start: {
          line: 82,
          column: 4
        },
        end: {
          line: 82,
          column: 62
        }
      },
      '5': {
        start: {
          line: 83,
          column: 4
        },
        end: {
          line: 83,
          column: 26
        }
      },
      '6': {
        start: {
          line: 93,
          column: 4
        },
        end: {
          line: 93,
          column: 80
        }
      },
      '7': {
        start: {
          line: 94,
          column: 4
        },
        end: {
          line: 94,
          column: 40
        }
      },
      '8': {
        start: {
          line: 95,
          column: 4
        },
        end: {
          line: 95,
          column: 40
        }
      },
      '9': {
        start: {
          line: 96,
          column: 4
        },
        end: {
          line: 96,
          column: 24
        }
      },
      '10': {
        start: {
          line: 106,
          column: 4
        },
        end: {
          line: 106,
          column: 63
        }
      },
      '11': {
        start: {
          line: 107,
          column: 4
        },
        end: {
          line: 107,
          column: 80
        }
      },
      '12': {
        start: {
          line: 108,
          column: 4
        },
        end: {
          line: 108,
          column: 91
        }
      },
      '13': {
        start: {
          line: 118,
          column: 4
        },
        end: {
          line: 130,
          column: 5
        }
      },
      '14': {
        start: {
          line: 119,
          column: 6
        },
        end: {
          line: 129,
          column: 9
        }
      },
      '15': {
        start: {
          line: 120,
          column: 8
        },
        end: {
          line: 124,
          column: 11
        }
      },
      '16': {
        start: {
          line: 121,
          column: 10
        },
        end: {
          line: 121,
          column: 78
        }
      },
      '17': {
        start: {
          line: 122,
          column: 10
        },
        end: {
          line: 122,
          column: 55
        }
      },
      '18': {
        start: {
          line: 123,
          column: 10
        },
        end: {
          line: 123,
          column: 48
        }
      },
      '19': {
        start: {
          line: 125,
          column: 8
        },
        end: {
          line: 128,
          column: 9
        }
      },
      '20': {
        start: {
          line: 126,
          column: 10
        },
        end: {
          line: 126,
          column: 52
        }
      },
      '21': {
        start: {
          line: 127,
          column: 10
        },
        end: {
          line: 127,
          column: 52
        }
      },
      '22': {
        start: {
          line: 131,
          column: 4
        },
        end: {
          line: 131,
          column: 29
        }
      },
      '23': {
        start: {
          line: 140,
          column: 4
        },
        end: {
          line: 140,
          column: 40
        }
      },
      '24': {
        start: {
          line: 141,
          column: 4
        },
        end: {
          line: 141,
          column: 20
        }
      },
      '25': {
        start: {
          line: 142,
          column: 4
        },
        end: {
          line: 142,
          column: 29
        }
      },
      '26': {
        start: {
          line: 143,
          column: 4
        },
        end: {
          line: 143,
          column: 27
        }
      },
      '27': {
        start: {
          line: 144,
          column: 4
        },
        end: {
          line: 144,
          column: 28
        }
      },
      '28': {
        start: {
          line: 145,
          column: 4
        },
        end: {
          line: 145,
          column: 24
        }
      },
      '29': {
        start: {
          line: 155,
          column: 22
        },
        end: {
          line: 155,
          column: 68
        }
      },
      '30': {
        start: {
          line: 156,
          column: 22
        },
        end: {
          line: 156,
          column: 63
        }
      },
      '31': {
        start: {
          line: 157,
          column: 21
        },
        end: {
          line: 157,
          column: 79
        }
      },
      '32': {
        start: {
          line: 158,
          column: 4
        },
        end: {
          line: 158,
          column: 62
        }
      },
      '33': {
        start: {
          line: 168,
          column: 22
        },
        end: {
          line: 168,
          column: 24
        }
      },
      '34': {
        start: {
          line: 169,
          column: 4
        },
        end: {
          line: 179,
          column: 5
        }
      },
      '35': {
        start: {
          line: 171,
          column: 21
        },
        end: {
          line: 177,
          column: 7
        }
      },
      '36': {
        start: {
          line: 178,
          column: 6
        },
        end: {
          line: 178,
          column: 49
        }
      },
      '37': {
        start: {
          line: 180,
          column: 4
        },
        end: {
          line: 180,
          column: 23
        }
      },
      '38': {
        start: {
          line: 190,
          column: 22
        },
        end: {
          line: 190,
          column: 24
        }
      },
      '39': {
        start: {
          line: 191,
          column: 4
        },
        end: {
          line: 201,
          column: 5
        }
      },
      '40': {
        start: {
          line: 193,
          column: 21
        },
        end: {
          line: 199,
          column: 7
        }
      },
      '41': {
        start: {
          line: 200,
          column: 6
        },
        end: {
          line: 200,
          column: 49
        }
      },
      '42': {
        start: {
          line: 202,
          column: 4
        },
        end: {
          line: 202,
          column: 23
        }
      },
      '43': {
        start: {
          line: 212,
          column: 21
        },
        end: {
          line: 212,
          column: 23
        }
      },
      '44': {
        start: {
          line: 213,
          column: 4
        },
        end: {
          line: 223,
          column: 5
        }
      },
      '45': {
        start: {
          line: 215,
          column: 21
        },
        end: {
          line: 221,
          column: 7
        }
      },
      '46': {
        start: {
          line: 222,
          column: 6
        },
        end: {
          line: 222,
          column: 47
        }
      },
      '47': {
        start: {
          line: 224,
          column: 4
        },
        end: {
          line: 224,
          column: 22
        }
      },
      '48': {
        start: {
          line: 235,
          column: 4
        },
        end: {
          line: 237,
          column: 5
        }
      },
      '49': {
        start: {
          line: 236,
          column: 6
        },
        end: {
          line: 236,
          column: 43
        }
      },
      '50': {
        start: {
          line: 248,
          column: 4
        },
        end: {
          line: 250,
          column: 5
        }
      },
      '51': {
        start: {
          line: 249,
          column: 6
        },
        end: {
          line: 249,
          column: 45
        }
      },
      '52': {
        start: {
          line: 261,
          column: 4
        },
        end: {
          line: 266,
          column: 5
        }
      },
      '53': {
        start: {
          line: 262,
          column: 6
        },
        end: {
          line: 262,
          column: 35
        }
      },
      '54': {
        start: {
          line: 263,
          column: 6
        },
        end: {
          line: 263,
          column: 70
        }
      },
      '55': {
        start: {
          line: 264,
          column: 6
        },
        end: {
          line: 264,
          column: 64
        }
      },
      '56': {
        start: {
          line: 265,
          column: 6
        },
        end: {
          line: 265,
          column: 38
        }
      },
      '57': {
        start: {
          line: 276,
          column: 4
        },
        end: {
          line: 276,
          column: 29
        }
      },
      '58': {
        start: {
          line: 288,
          column: 21
        },
        end: {
          line: 290,
          column: 6
        }
      },
      '59': {
        start: {
          line: 289,
          column: 6
        },
        end: {
          line: 289,
          column: 73
        }
      },
      '60': {
        start: {
          line: 291,
          column: 4
        },
        end: {
          line: 291,
          column: 64
        }
      },
      '61': {
        start: {
          line: 292,
          column: 4
        },
        end: {
          line: 292,
          column: 37
        }
      },
      '62': {
        start: {
          line: 304,
          column: 21
        },
        end: {
          line: 306,
          column: 6
        }
      },
      '63': {
        start: {
          line: 305,
          column: 6
        },
        end: {
          line: 305,
          column: 67
        }
      },
      '64': {
        start: {
          line: 307,
          column: 4
        },
        end: {
          line: 307,
          column: 64
        }
      },
      '65': {
        start: {
          line: 308,
          column: 4
        },
        end: {
          line: 308,
          column: 37
        }
      },
      '66': {
        start: {
          line: 317,
          column: 24
        },
        end: {
          line: 317,
          column: 53
        }
      },
      '67': {
        start: {
          line: 318,
          column: 4
        },
        end: {
          line: 320,
          column: 5
        }
      },
      '68': {
        start: {
          line: 319,
          column: 6
        },
        end: {
          line: 319,
          column: 39
        }
      },
      '69': {
        start: {
          line: 331,
          column: 20
        },
        end: {
          line: 331,
          column: 29
        }
      },
      '70': {
        start: {
          line: 332,
          column: 23
        },
        end: {
          line: 332,
          column: 35
        }
      },
      '71': {
        start: {
          line: 333,
          column: 21
        },
        end: {
          line: 333,
          column: 31
        }
      },
      '72': {
        start: {
          line: 334,
          column: 4
        },
        end: {
          line: 368,
          column: 5
        }
      },
      '73': {
        start: {
          line: 335,
          column: 6
        },
        end: {
          line: 348,
          column: 7
        }
      },
      '74': {
        start: {
          line: 337,
          column: 10
        },
        end: {
          line: 337,
          column: 86
        }
      },
      '75': {
        start: {
          line: 338,
          column: 10
        },
        end: {
          line: 338,
          column: 32
        }
      },
      '76': {
        start: {
          line: 339,
          column: 10
        },
        end: {
          line: 339,
          column: 16
        }
      },
      '77': {
        start: {
          line: 341,
          column: 10
        },
        end: {
          line: 341,
          column: 84
        }
      },
      '78': {
        start: {
          line: 342,
          column: 10
        },
        end: {
          line: 342,
          column: 40
        }
      },
      '79': {
        start: {
          line: 343,
          column: 10
        },
        end: {
          line: 343,
          column: 16
        }
      },
      '80': {
        start: {
          line: 345,
          column: 10
        },
        end: {
          line: 345,
          column: 66
        }
      },
      '81': {
        start: {
          line: 346,
          column: 10
        },
        end: {
          line: 346,
          column: 25
        }
      },
      '82': {
        start: {
          line: 347,
          column: 10
        },
        end: {
          line: 347,
          column: 16
        }
      },
      '83': {
        start: {
          line: 350,
          column: 6
        },
        end: {
          line: 367,
          column: 7
        }
      },
      '84': {
        start: {
          line: 363,
          column: 10
        },
        end: {
          line: 363,
          column: 60
        }
      },
      '85': {
        start: {
          line: 364,
          column: 10
        },
        end: {
          line: 364,
          column: 16
        }
      },
      '86': {
        start: {
          line: 366,
          column: 10
        },
        end: {
          line: 366,
          column: 16
        }
      },
      '87': {
        start: {
          line: 377,
          column: 4
        },
        end: {
          line: 377,
          column: 53
        }
      },
      '88': {
        start: {
          line: 378,
          column: 4
        },
        end: {
          line: 378,
          column: 70
        }
      },
      '89': {
        start: {
          line: 379,
          column: 4
        },
        end: {
          line: 379,
          column: 81
        }
      },
      '90': {
        start: {
          line: 389,
          column: 4
        },
        end: {
          line: 391,
          column: 5
        }
      },
      '91': {
        start: {
          line: 390,
          column: 6
        },
        end: {
          line: 390,
          column: 33
        }
      },
      '92': {
        start: {
          line: 392,
          column: 4
        },
        end: {
          line: 392,
          column: 14
        }
      },
      '93': {
        start: {
          line: 397,
          column: 0
        },
        end: {
          line: 399,
          column: 1
        }
      },
      '94': {
        start: {
          line: 398,
          column: 2
        },
        end: {
          line: 398,
          column: 41
        }
      }
    },
    fnMap: {
      '0': {
        name: '(anonymous_0)',
        decl: {
          start: {
            line: 68,
            column: 2
          },
          end: {
            line: 68,
            column: 3
          }
        },
        loc: {
          start: {
            line: 68,
            column: 48
          },
          end: {
            line: 72,
            column: 3
          }
        },
        line: 68
      },
      '1': {
        name: '(anonymous_1)',
        decl: {
          start: {
            line: 80,
            column: 2
          },
          end: {
            line: 80,
            column: 3
          }
        },
        loc: {
          start: {
            line: 80,
            column: 32
          },
          end: {
            line: 84,
            column: 3
          }
        },
        line: 80
      },
      '2': {
        name: '(anonymous_2)',
        decl: {
          start: {
            line: 92,
            column: 2
          },
          end: {
            line: 92,
            column: 3
          }
        },
        loc: {
          start: {
            line: 92,
            column: 78
          },
          end: {
            line: 97,
            column: 3
          }
        },
        line: 92
      },
      '3': {
        name: '(anonymous_3)',
        decl: {
          start: {
            line: 105,
            column: 2
          },
          end: {
            line: 105,
            column: 3
          }
        },
        loc: {
          start: {
            line: 105,
            column: 23
          },
          end: {
            line: 109,
            column: 3
          }
        },
        line: 105
      },
      '4': {
        name: '(anonymous_4)',
        decl: {
          start: {
            line: 117,
            column: 2
          },
          end: {
            line: 117,
            column: 3
          }
        },
        loc: {
          start: {
            line: 117,
            column: 26
          },
          end: {
            line: 132,
            column: 3
          }
        },
        line: 117
      },
      '5': {
        name: '(anonymous_5)',
        decl: {
          start: {
            line: 119,
            column: 38
          },
          end: {
            line: 119,
            column: 39
          }
        },
        loc: {
          start: {
            line: 119,
            column: 51
          },
          end: {
            line: 129,
            column: 7
          }
        },
        line: 119
      },
      '6': {
        name: '(anonymous_6)',
        decl: {
          start: {
            line: 120,
            column: 51
          },
          end: {
            line: 120,
            column: 52
          }
        },
        loc: {
          start: {
            line: 120,
            column: 81
          },
          end: {
            line: 124,
            column: 9
          }
        },
        line: 120
      },
      '7': {
        name: '(anonymous_7)',
        decl: {
          start: {
            line: 139,
            column: 2
          },
          end: {
            line: 139,
            column: 3
          }
        },
        loc: {
          start: {
            line: 139,
            column: 18
          },
          end: {
            line: 146,
            column: 3
          }
        },
        line: 139
      },
      '8': {
        name: '(anonymous_8)',
        decl: {
          start: {
            line: 154,
            column: 2
          },
          end: {
            line: 154,
            column: 3
          }
        },
        loc: {
          start: {
            line: 154,
            column: 40
          },
          end: {
            line: 159,
            column: 3
          }
        },
        line: 154
      },
      '9': {
        name: '(anonymous_9)',
        decl: {
          start: {
            line: 167,
            column: 2
          },
          end: {
            line: 167,
            column: 3
          }
        },
        loc: {
          start: {
            line: 167,
            column: 70
          },
          end: {
            line: 181,
            column: 3
          }
        },
        line: 167
      },
      '10': {
        name: '(anonymous_10)',
        decl: {
          start: {
            line: 189,
            column: 2
          },
          end: {
            line: 189,
            column: 3
          }
        },
        loc: {
          start: {
            line: 189,
            column: 70
          },
          end: {
            line: 203,
            column: 3
          }
        },
        line: 189
      },
      '11': {
        name: '(anonymous_11)',
        decl: {
          start: {
            line: 211,
            column: 2
          },
          end: {
            line: 211,
            column: 3
          }
        },
        loc: {
          start: {
            line: 211,
            column: 83
          },
          end: {
            line: 225,
            column: 3
          }
        },
        line: 211
      },
      '12': {
        name: '(anonymous_12)',
        decl: {
          start: {
            line: 234,
            column: 2
          },
          end: {
            line: 234,
            column: 3
          }
        },
        loc: {
          start: {
            line: 234,
            column: 49
          },
          end: {
            line: 238,
            column: 3
          }
        },
        line: 234
      },
      '13': {
        name: '(anonymous_13)',
        decl: {
          start: {
            line: 247,
            column: 2
          },
          end: {
            line: 247,
            column: 3
          }
        },
        loc: {
          start: {
            line: 247,
            column: 49
          },
          end: {
            line: 251,
            column: 3
          }
        },
        line: 247
      },
      '14': {
        name: '(anonymous_14)',
        decl: {
          start: {
            line: 260,
            column: 2
          },
          end: {
            line: 260,
            column: 3
          }
        },
        loc: {
          start: {
            line: 260,
            column: 46
          },
          end: {
            line: 267,
            column: 3
          }
        },
        line: 260
      },
      '15': {
        name: '(anonymous_15)',
        decl: {
          start: {
            line: 275,
            column: 2
          },
          end: {
            line: 275,
            column: 3
          }
        },
        loc: {
          start: {
            line: 275,
            column: 32
          },
          end: {
            line: 277,
            column: 3
          }
        },
        line: 275
      },
      '16': {
        name: '(anonymous_16)',
        decl: {
          start: {
            line: 287,
            column: 2
          },
          end: {
            line: 287,
            column: 3
          }
        },
        loc: {
          start: {
            line: 287,
            column: 51
          },
          end: {
            line: 293,
            column: 3
          }
        },
        line: 287
      },
      '17': {
        name: '(anonymous_17)',
        decl: {
          start: {
            line: 288,
            column: 45
          },
          end: {
            line: 288,
            column: 46
          }
        },
        loc: {
          start: {
            line: 288,
            column: 56
          },
          end: {
            line: 290,
            column: 5
          }
        },
        line: 288
      },
      '18': {
        name: '(anonymous_18)',
        decl: {
          start: {
            line: 303,
            column: 2
          },
          end: {
            line: 303,
            column: 3
          }
        },
        loc: {
          start: {
            line: 303,
            column: 56
          },
          end: {
            line: 309,
            column: 3
          }
        },
        line: 303
      },
      '19': {
        name: '(anonymous_19)',
        decl: {
          start: {
            line: 304,
            column: 45
          },
          end: {
            line: 304,
            column: 46
          }
        },
        loc: {
          start: {
            line: 304,
            column: 56
          },
          end: {
            line: 306,
            column: 5
          }
        },
        line: 304
      },
      '20': {
        name: '(anonymous_20)',
        decl: {
          start: {
            line: 316,
            column: 2
          },
          end: {
            line: 316,
            column: 3
          }
        },
        loc: {
          start: {
            line: 316,
            column: 26
          },
          end: {
            line: 321,
            column: 3
          }
        },
        line: 316
      },
      '21': {
        name: '(anonymous_21)',
        decl: {
          start: {
            line: 330,
            column: 2
          },
          end: {
            line: 330,
            column: 3
          }
        },
        loc: {
          start: {
            line: 330,
            column: 43
          },
          end: {
            line: 369,
            column: 3
          }
        },
        line: 330
      },
      '22': {
        name: '(anonymous_22)',
        decl: {
          start: {
            line: 376,
            column: 2
          },
          end: {
            line: 376,
            column: 3
          }
        },
        loc: {
          start: {
            line: 376,
            column: 26
          },
          end: {
            line: 380,
            column: 3
          }
        },
        line: 376
      },
      '23': {
        name: '(anonymous_23)',
        decl: {
          start: {
            line: 388,
            column: 2
          },
          end: {
            line: 388,
            column: 3
          }
        },
        loc: {
          start: {
            line: 388,
            column: 20
          },
          end: {
            line: 393,
            column: 3
          }
        },
        line: 388
      }
    },
    branchMap: {
      '0': {
        loc: {
          start: {
            line: 69,
            column: 25
          },
          end: {
            line: 69,
            column: 123
          }
        },
        type: 'cond-expr',
        locations: [{
          start: {
            line: 69,
            column: 58
          },
          end: {
            line: 69,
            column: 115
          }
        }, {
          start: {
            line: 69,
            column: 118
          },
          end: {
            line: 69,
            column: 123
          }
        }],
        line: 69
      },
      '1': {
        loc: {
          start: {
            line: 118,
            column: 4
          },
          end: {
            line: 130,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 118,
            column: 4
          },
          end: {
            line: 130,
            column: 5
          }
        }, {
          start: {
            line: 118,
            column: 4
          },
          end: {
            line: 130,
            column: 5
          }
        }],
        line: 118
      },
      '2': {
        loc: {
          start: {
            line: 125,
            column: 8
          },
          end: {
            line: 128,
            column: 9
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 125,
            column: 8
          },
          end: {
            line: 128,
            column: 9
          }
        }, {
          start: {
            line: 125,
            column: 8
          },
          end: {
            line: 128,
            column: 9
          }
        }],
        line: 125
      },
      '3': {
        loc: {
          start: {
            line: 125,
            column: 12
          },
          end: {
            line: 125,
            column: 50
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 125,
            column: 12
          },
          end: {
            line: 125,
            column: 27
          }
        }, {
          start: {
            line: 125,
            column: 31
          },
          end: {
            line: 125,
            column: 50
          }
        }],
        line: 125
      },
      '4': {
        loc: {
          start: {
            line: 155,
            column: 45
          },
          end: {
            line: 155,
            column: 67
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 155,
            column: 45
          },
          end: {
            line: 155,
            column: 61
          }
        }, {
          start: {
            line: 155,
            column: 65
          },
          end: {
            line: 155,
            column: 67
          }
        }],
        line: 155
      },
      '5': {
        loc: {
          start: {
            line: 156,
            column: 45
          },
          end: {
            line: 156,
            column: 62
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 156,
            column: 45
          },
          end: {
            line: 156,
            column: 56
          }
        }, {
          start: {
            line: 156,
            column: 60
          },
          end: {
            line: 156,
            column: 62
          }
        }],
        line: 156
      },
      '6': {
        loc: {
          start: {
            line: 157,
            column: 43
          },
          end: {
            line: 157,
            column: 78
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 157,
            column: 43
          },
          end: {
            line: 157,
            column: 72
          }
        }, {
          start: {
            line: 157,
            column: 76
          },
          end: {
            line: 157,
            column: 78
          }
        }],
        line: 157
      },
      '7': {
        loc: {
          start: {
            line: 235,
            column: 4
          },
          end: {
            line: 237,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 235,
            column: 4
          },
          end: {
            line: 237,
            column: 5
          }
        }, {
          start: {
            line: 235,
            column: 4
          },
          end: {
            line: 237,
            column: 5
          }
        }],
        line: 235
      },
      '8': {
        loc: {
          start: {
            line: 235,
            column: 8
          },
          end: {
            line: 235,
            column: 87
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 235,
            column: 8
          },
          end: {
            line: 235,
            column: 40
          }
        }, {
          start: {
            line: 235,
            column: 44
          },
          end: {
            line: 235,
            column: 62
          }
        }, {
          start: {
            line: 235,
            column: 66
          },
          end: {
            line: 235,
            column: 87
          }
        }],
        line: 235
      },
      '9': {
        loc: {
          start: {
            line: 248,
            column: 4
          },
          end: {
            line: 250,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 248,
            column: 4
          },
          end: {
            line: 250,
            column: 5
          }
        }, {
          start: {
            line: 248,
            column: 4
          },
          end: {
            line: 250,
            column: 5
          }
        }],
        line: 248
      },
      '10': {
        loc: {
          start: {
            line: 248,
            column: 8
          },
          end: {
            line: 248,
            column: 114
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 248,
            column: 8
          },
          end: {
            line: 248,
            column: 40
          }
        }, {
          start: {
            line: 248,
            column: 45
          },
          end: {
            line: 248,
            column: 63
          }
        }, {
          start: {
            line: 248,
            column: 67
          },
          end: {
            line: 248,
            column: 93
          }
        }, {
          start: {
            line: 248,
            column: 98
          },
          end: {
            line: 248,
            column: 114
          }
        }],
        line: 248
      },
      '11': {
        loc: {
          start: {
            line: 261,
            column: 4
          },
          end: {
            line: 266,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 261,
            column: 4
          },
          end: {
            line: 266,
            column: 5
          }
        }, {
          start: {
            line: 261,
            column: 4
          },
          end: {
            line: 266,
            column: 5
          }
        }],
        line: 261
      },
      '12': {
        loc: {
          start: {
            line: 261,
            column: 8
          },
          end: {
            line: 261,
            column: 92
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 261,
            column: 8
          },
          end: {
            line: 261,
            column: 38
          }
        }, {
          start: {
            line: 261,
            column: 42
          },
          end: {
            line: 261,
            column: 59
          }
        }, {
          start: {
            line: 261,
            column: 63
          },
          end: {
            line: 261,
            column: 92
          }
        }],
        line: 261
      },
      '13': {
        loc: {
          start: {
            line: 289,
            column: 14
          },
          end: {
            line: 289,
            column: 71
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 289,
            column: 14
          },
          end: {
            line: 289,
            column: 41
          }
        }, {
          start: {
            line: 289,
            column: 45
          },
          end: {
            line: 289,
            column: 71
          }
        }],
        line: 289
      },
      '14': {
        loc: {
          start: {
            line: 305,
            column: 14
          },
          end: {
            line: 305,
            column: 65
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 305,
            column: 14
          },
          end: {
            line: 305,
            column: 41
          }
        }, {
          start: {
            line: 305,
            column: 45
          },
          end: {
            line: 305,
            column: 65
          }
        }],
        line: 305
      },
      '15': {
        loc: {
          start: {
            line: 334,
            column: 4
          },
          end: {
            line: 368,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 334,
            column: 4
          },
          end: {
            line: 368,
            column: 5
          }
        }, {
          start: {
            line: 334,
            column: 4
          },
          end: {
            line: 368,
            column: 5
          }
        }],
        line: 334
      },
      '16': {
        loc: {
          start: {
            line: 335,
            column: 6
          },
          end: {
            line: 348,
            column: 7
          }
        },
        type: 'switch',
        locations: [{
          start: {
            line: 336,
            column: 8
          },
          end: {
            line: 339,
            column: 16
          }
        }, {
          start: {
            line: 340,
            column: 8
          },
          end: {
            line: 343,
            column: 16
          }
        }, {
          start: {
            line: 344,
            column: 8
          },
          end: {
            line: 347,
            column: 16
          }
        }],
        line: 335
      },
      '17': {
        loc: {
          start: {
            line: 350,
            column: 6
          },
          end: {
            line: 367,
            column: 7
          }
        },
        type: 'switch',
        locations: [{
          start: {
            line: 351,
            column: 8
          },
          end: {
            line: 351,
            column: 52
          }
        }, {
          start: {
            line: 352,
            column: 8
          },
          end: {
            line: 352,
            column: 54
          }
        }, {
          start: {
            line: 353,
            column: 8
          },
          end: {
            line: 353,
            column: 55
          }
        }, {
          start: {
            line: 354,
            column: 8
          },
          end: {
            line: 354,
            column: 49
          }
        }, {
          start: {
            line: 355,
            column: 8
          },
          end: {
            line: 355,
            column: 51
          }
        }, {
          start: {
            line: 356,
            column: 8
          },
          end: {
            line: 356,
            column: 51
          }
        }, {
          start: {
            line: 357,
            column: 8
          },
          end: {
            line: 357,
            column: 48
          }
        }, {
          start: {
            line: 358,
            column: 8
          },
          end: {
            line: 358,
            column: 56
          }
        }, {
          start: {
            line: 359,
            column: 8
          },
          end: {
            line: 359,
            column: 50
          }
        }, {
          start: {
            line: 360,
            column: 8
          },
          end: {
            line: 360,
            column: 51
          }
        }, {
          start: {
            line: 361,
            column: 8
          },
          end: {
            line: 361,
            column: 52
          }
        }, {
          start: {
            line: 362,
            column: 8
          },
          end: {
            line: 364,
            column: 16
          }
        }, {
          start: {
            line: 365,
            column: 8
          },
          end: {
            line: 366,
            column: 16
          }
        }],
        line: 350
      },
      '18': {
        loc: {
          start: {
            line: 389,
            column: 4
          },
          end: {
            line: 391,
            column: 5
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 389,
            column: 4
          },
          end: {
            line: 391,
            column: 5
          }
        }, {
          start: {
            line: 389,
            column: 4
          },
          end: {
            line: 391,
            column: 5
          }
        }],
        line: 389
      },
      '19': {
        loc: {
          start: {
            line: 389,
            column: 8
          },
          end: {
            line: 389,
            column: 44
          }
        },
        type: 'binary-expr',
        locations: [{
          start: {
            line: 389,
            column: 8
          },
          end: {
            line: 389,
            column: 25
          }
        }, {
          start: {
            line: 389,
            column: 29
          },
          end: {
            line: 389,
            column: 44
          }
        }],
        line: 389
      },
      '20': {
        loc: {
          start: {
            line: 397,
            column: 0
          },
          end: {
            line: 399,
            column: 1
          }
        },
        type: 'if',
        locations: [{
          start: {
            line: 397,
            column: 0
          },
          end: {
            line: 399,
            column: 1
          }
        }, {
          start: {
            line: 397,
            column: 0
          },
          end: {
            line: 399,
            column: 1
          }
        }],
        line: 397
      }
    },
    s: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0,
      '16': 0,
      '17': 0,
      '18': 0,
      '19': 0,
      '20': 0,
      '21': 0,
      '22': 0,
      '23': 0,
      '24': 0,
      '25': 0,
      '26': 0,
      '27': 0,
      '28': 0,
      '29': 0,
      '30': 0,
      '31': 0,
      '32': 0,
      '33': 0,
      '34': 0,
      '35': 0,
      '36': 0,
      '37': 0,
      '38': 0,
      '39': 0,
      '40': 0,
      '41': 0,
      '42': 0,
      '43': 0,
      '44': 0,
      '45': 0,
      '46': 0,
      '47': 0,
      '48': 0,
      '49': 0,
      '50': 0,
      '51': 0,
      '52': 0,
      '53': 0,
      '54': 0,
      '55': 0,
      '56': 0,
      '57': 0,
      '58': 0,
      '59': 0,
      '60': 0,
      '61': 0,
      '62': 0,
      '63': 0,
      '64': 0,
      '65': 0,
      '66': 0,
      '67': 0,
      '68': 0,
      '69': 0,
      '70': 0,
      '71': 0,
      '72': 0,
      '73': 0,
      '74': 0,
      '75': 0,
      '76': 0,
      '77': 0,
      '78': 0,
      '79': 0,
      '80': 0,
      '81': 0,
      '82': 0,
      '83': 0,
      '84': 0,
      '85': 0,
      '86': 0,
      '87': 0,
      '88': 0,
      '89': 0,
      '90': 0,
      '91': 0,
      '92': 0,
      '93': 0,
      '94': 0
    },
    f: {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      '6': 0,
      '7': 0,
      '8': 0,
      '9': 0,
      '10': 0,
      '11': 0,
      '12': 0,
      '13': 0,
      '14': 0,
      '15': 0,
      '16': 0,
      '17': 0,
      '18': 0,
      '19': 0,
      '20': 0,
      '21': 0,
      '22': 0,
      '23': 0
    },
    b: {
      '0': [0, 0],
      '1': [0, 0],
      '2': [0, 0],
      '3': [0, 0],
      '4': [0, 0],
      '5': [0, 0],
      '6': [0, 0],
      '7': [0, 0],
      '8': [0, 0, 0],
      '9': [0, 0],
      '10': [0, 0, 0, 0],
      '11': [0, 0],
      '12': [0, 0, 0],
      '13': [0, 0],
      '14': [0, 0],
      '15': [0, 0],
      '16': [0, 0, 0],
      '17': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      '18': [0, 0],
      '19': [0, 0],
      '20': [0, 0]
    },
    _coverageSchema: '332fd63041d2c1bcb487cc26dd0d5f7d97098a6c'
  },
      coverage = global[gcv] || (global[gcv] = {});

  if (coverage[path] && coverage[path].hash === hash) {
    return coverage[path];
  }

  coverageData.hash = hash;
  return coverage[path] = coverageData;
}();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hls = __webpack_require__(1);

var _hls2 = _interopRequireDefault(_hls);

var _playkitJs = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Adapter of hls.js lib for hls content
 * @classdesc
 */
var HlsAdapter = function (_BaseMediaSourceAdapt) {
  _inherits(HlsAdapter, _BaseMediaSourceAdapt);

  _createClass(HlsAdapter, null, [{
    key: 'canPlayType',


    /**
     * Checks if hls adapter can play a given mime type.
     * @function canPlayType
     * @param {string} mimeType - The mime type to check.
     * @returns {boolean} - Whether the hls adapter can play a specific mime type.
     * @static
     */

    /**
     * The hls player instance.
     * @member {any} _hls
     * @private
     */

    /**
     * The load promise
     * @member {Promise<Object>} - _loadPromise
     * @type {Promise<Object>}
     * @private
     */

    /**
     * Reference to the player tracks.
     * @member {Array<Track>} - _playerTracks
     * @type {Array<Track>}
     * @private
     */

    /**
     * The adapter logger.
     * @member {any} _logger
     * @static
     * @private
     */
    value: function canPlayType(mimeType) {
      ++cov_29usqbrt0g.f[0];

      var canHlsPlayType = (++cov_29usqbrt0g.s[0], typeof mimeType === 'string' ? (++cov_29usqbrt0g.b[0][0], HlsAdapter._hlsMimeTypes.includes(mimeType.toLowerCase())) : (++cov_29usqbrt0g.b[0][1], false));
      ++cov_29usqbrt0g.s[1];
      HlsAdapter._logger.debug('canPlayType result for mimeType:' + mimeType + ' is ' + canHlsPlayType.toString());
      ++cov_29usqbrt0g.s[2];
      return canHlsPlayType;
    }

    /**
     * Checks if the hls adapter is supported.
     * @function isSupported
     * @returns {boolean} - Whether hls is supported.
     * @static
     */

    /**
     * The supported mime types by the hls adapter.
     * @member {Array<string>} _hlsMimeType
     * @static
     * @private
     */

    /**
     * The id of the adapter.
     * @member {string} id
     * @static
     * @private
     */

  }, {
    key: 'isSupported',
    value: function isSupported() {
      ++cov_29usqbrt0g.f[1];

      var isHlsSupported = (++cov_29usqbrt0g.s[3], _hls2.default.isSupported());
      ++cov_29usqbrt0g.s[4];
      HlsAdapter._logger.debug('isSupported:' + isHlsSupported);
      ++cov_29usqbrt0g.s[5];
      return isHlsSupported;
    }

    /**
     * @constructor
     * @param {HTMLVideoElement} videoElement - The video element which will bind to the hls adapter
     * @param {Object} source - The source object
     * @param {Object} config - The media source adapter configuration
     */

  }]);

  function HlsAdapter(videoElement, source, config) {
    _classCallCheck(this, HlsAdapter);

    ++cov_29usqbrt0g.f[2];
    ++cov_29usqbrt0g.s[6];

    HlsAdapter._logger.debug('Creating adapter. Hls version: ' + _hls2.default.version);
    ++cov_29usqbrt0g.s[7];

    var _this = _possibleConstructorReturn(this, (HlsAdapter.__proto__ || Object.getPrototypeOf(HlsAdapter)).call(this, videoElement, source, config));

    ++cov_29usqbrt0g.s[8];

    _this._hls = new _hls2.default(_this._config);
    ++cov_29usqbrt0g.s[9];
    _this._addBindings();
    return _this;
  }

  /**
   * Adds the required bindings with hls.js.
   * @function _addBindings
   * @private
   * @returns {void}
   */


  _createClass(HlsAdapter, [{
    key: '_addBindings',
    value: function _addBindings() {
      ++cov_29usqbrt0g.f[3];
      ++cov_29usqbrt0g.s[10];

      this._hls.on(_hls2.default.Events.ERROR, this._onError.bind(this));
      ++cov_29usqbrt0g.s[11];
      this._hls.on(_hls2.default.Events.LEVEL_SWITCHED, this._onLevelSwitched.bind(this));
      ++cov_29usqbrt0g.s[12];
      this._hls.on(_hls2.default.Events.AUDIO_TRACK_SWITCHED, this._onAudioTrackSwitched.bind(this));
    }

    /**
     * Load the video source
     * @function load
     * @returns {Promise<Object>} - The loaded data
     * @override
     */

  }, {
    key: 'load',
    value: function load() {
      var _this2 = this;

      ++cov_29usqbrt0g.f[4];
      ++cov_29usqbrt0g.s[13];

      if (!this._loadPromise) {
        ++cov_29usqbrt0g.b[1][0];
        ++cov_29usqbrt0g.s[14];

        this._loadPromise = new Promise(function (resolve) {
          ++cov_29usqbrt0g.f[5];
          ++cov_29usqbrt0g.s[15];

          _this2._hls.on(_hls2.default.Events.MANIFEST_LOADED, function (event, data) {
            ++cov_29usqbrt0g.f[6];
            ++cov_29usqbrt0g.s[16];

            HlsAdapter._logger.debug('The source has been loaded successfully');
            ++cov_29usqbrt0g.s[17];
            _this2._playerTracks = _this2._parseTracks(data);
            ++cov_29usqbrt0g.s[18];
            resolve({ tracks: _this2._playerTracks });
          });
          ++cov_29usqbrt0g.s[19];
          if ((++cov_29usqbrt0g.b[3][0], _this2._sourceObj) && (++cov_29usqbrt0g.b[3][1], _this2._sourceObj.url)) {
            ++cov_29usqbrt0g.b[2][0];
            ++cov_29usqbrt0g.s[20];

            _this2._hls.loadSource(_this2._sourceObj.url);
            ++cov_29usqbrt0g.s[21];
            _this2._hls.attachMedia(_this2._videoElement);
          } else {
            ++cov_29usqbrt0g.b[2][1];
          }
        });
      } else {
        ++cov_29usqbrt0g.b[1][1];
      }
      ++cov_29usqbrt0g.s[22];
      return this._loadPromise;
    }

    /**
     * Destroying the hls adapter.
     * @function destroy
     * @override
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      ++cov_29usqbrt0g.f[7];
      ++cov_29usqbrt0g.s[23];

      HlsAdapter._logger.debug('destroy');
      ++cov_29usqbrt0g.s[24];
      _get(HlsAdapter.prototype.__proto__ || Object.getPrototypeOf(HlsAdapter.prototype), 'destroy', this).call(this);
      ++cov_29usqbrt0g.s[25];
      this._loadPromise = null;
      ++cov_29usqbrt0g.s[26];
      this._removeBindings();
      ++cov_29usqbrt0g.s[27];
      this._hls.detachMedia();
      ++cov_29usqbrt0g.s[28];
      this._hls.destroy();
    }

    /**
     * Parse the hls tracks into player tracks.
     * @param {any} data - The event data.
     * @returns {Array<Track>} - The parsed tracks.
     * @private
     */

  }, {
    key: '_parseTracks',
    value: function _parseTracks(data) {
      ++cov_29usqbrt0g.f[8];

      var audioTracks = (++cov_29usqbrt0g.s[29], this._parseAudioTracks((++cov_29usqbrt0g.b[4][0], data.audioTracks) || (++cov_29usqbrt0g.b[4][1], [])));
      var videoTracks = (++cov_29usqbrt0g.s[30], this._parseVideoTracks((++cov_29usqbrt0g.b[5][0], data.levels) || (++cov_29usqbrt0g.b[5][1], [])));
      var textTracks = (++cov_29usqbrt0g.s[31], this._parseTextTracks((++cov_29usqbrt0g.b[6][0], this._videoElement.textTracks) || (++cov_29usqbrt0g.b[6][1], [])));
      ++cov_29usqbrt0g.s[32];
      return audioTracks.concat(videoTracks).concat(textTracks);
    }

    /**
     * Parse hls audio tracks into player audio tracks.
     * @param {Array<Object>} hlsAudioTracks - The hls audio tracks.
     * @returns {Array<AudioTrack>} - The parsed audio tracks.
     * @private
     */

  }, {
    key: '_parseAudioTracks',
    value: function _parseAudioTracks(hlsAudioTracks) {
      ++cov_29usqbrt0g.f[9];

      var audioTracks = (++cov_29usqbrt0g.s[33], []);
      ++cov_29usqbrt0g.s[34];
      for (var i = 0; i < hlsAudioTracks.length; i++) {
        // Create audio tracks
        var settings = (++cov_29usqbrt0g.s[35], {
          id: hlsAudioTracks[i].id,
          active: this._hls.audioTrack === hlsAudioTracks[i].id,
          label: hlsAudioTracks[i].name,
          language: hlsAudioTracks[i].lang,
          index: i
        });
        ++cov_29usqbrt0g.s[36];
        audioTracks.push(new _playkitJs.AudioTrack(settings));
      }
      ++cov_29usqbrt0g.s[37];
      return audioTracks;
    }

    /**
     * Parse hls video tracks into player video tracks.
     * @param {Array<Object>} hlsVideoTracks - The hls video tracks.
     * @returns {Array<VideoTrack>} - The parsed video tracks.
     * @private
     */

  }, {
    key: '_parseVideoTracks',
    value: function _parseVideoTracks(hlsVideoTracks) {
      ++cov_29usqbrt0g.f[10];

      var videoTracks = (++cov_29usqbrt0g.s[38], []);
      ++cov_29usqbrt0g.s[39];
      for (var i = 0; i < hlsVideoTracks.length; i++) {
        // Create video tracks
        var settings = (++cov_29usqbrt0g.s[40], {
          active: this._hls.startLevel === i,
          label: hlsVideoTracks[i].name,
          bandwidth: hlsVideoTracks[i].bitrate,
          language: '',
          index: i
        });
        ++cov_29usqbrt0g.s[41];
        videoTracks.push(new _playkitJs.VideoTrack(settings));
      }
      ++cov_29usqbrt0g.s[42];
      return videoTracks;
    }

    /**
     * Parse native video tag text tracks into player text tracks.
     * @param {TextTrackList} vidTextTracks - The native video tag text tracks.
     * @returns {Array<TextTrack>} - The parsed text tracks.
     * @private
     */

  }, {
    key: '_parseTextTracks',
    value: function _parseTextTracks(vidTextTracks) {
      ++cov_29usqbrt0g.f[11];

      var textTracks = (++cov_29usqbrt0g.s[43], []);
      ++cov_29usqbrt0g.s[44];
      for (var i = 0; i < vidTextTracks.length; i++) {
        // Create text tracks
        var settings = (++cov_29usqbrt0g.s[45], {
          active: vidTextTracks[i].mode === 'showing',
          label: vidTextTracks[i].label,
          kind: vidTextTracks[i].kind,
          language: vidTextTracks[i].language,
          index: i
        });
        ++cov_29usqbrt0g.s[46];
        textTracks.push(new _playkitJs.TextTrack(settings));
      }
      ++cov_29usqbrt0g.s[47];
      return textTracks;
    }

    /**
     * Select an audio track.
     * @function selectAudioTrack
     * @param {AudioTrack} audioTrack - the audio track to select.
     * @returns {void}
     * @public
     */

  }, {
    key: 'selectAudioTrack',
    value: function selectAudioTrack(audioTrack) {
      ++cov_29usqbrt0g.f[12];
      ++cov_29usqbrt0g.s[48];

      if ((++cov_29usqbrt0g.b[8][0], audioTrack instanceof _playkitJs.AudioTrack) && (++cov_29usqbrt0g.b[8][1], !audioTrack.active) && (++cov_29usqbrt0g.b[8][2], this._hls.audioTracks)) {
        ++cov_29usqbrt0g.b[7][0];
        ++cov_29usqbrt0g.s[49];

        this._hls.audioTrack = audioTrack.id;
      } else {
        ++cov_29usqbrt0g.b[7][1];
      }
    }

    /**
     * Select a video track.
     * @function selectVideoTrack
     * @param {VideoTrack} videoTrack - the track to select.
     * @returns {void}
     * @public
     */

  }, {
    key: 'selectVideoTrack',
    value: function selectVideoTrack(videoTrack) {
      ++cov_29usqbrt0g.f[13];
      ++cov_29usqbrt0g.s[50];

      if ((++cov_29usqbrt0g.b[10][0], videoTrack instanceof _playkitJs.VideoTrack) && ((++cov_29usqbrt0g.b[10][1], !videoTrack.active) || (++cov_29usqbrt0g.b[10][2], this._hls.autoLevelEnabled)) && (++cov_29usqbrt0g.b[10][3], this._hls.levels)) {
        ++cov_29usqbrt0g.b[9][0];
        ++cov_29usqbrt0g.s[51];

        this._hls.nextLevel = videoTrack.index;
      } else {
        ++cov_29usqbrt0g.b[9][1];
      }
    }

    /**
     * Select a text track.
     * @function selectTextTrack
     * @param {TextTrack} textTrack - the track to select.
     * @returns {void}
     * @public
     */

  }, {
    key: 'selectTextTrack',
    value: function selectTextTrack(textTrack) {
      ++cov_29usqbrt0g.f[14];
      ++cov_29usqbrt0g.s[52];

      if ((++cov_29usqbrt0g.b[12][0], textTrack instanceof _playkitJs.TextTrack) && (++cov_29usqbrt0g.b[12][1], !textTrack.active) && (++cov_29usqbrt0g.b[12][2], this._videoElement.textTracks)) {
        ++cov_29usqbrt0g.b[11][0];
        ++cov_29usqbrt0g.s[53];

        this._disableAllTextTracks();
        ++cov_29usqbrt0g.s[54];
        this._videoElement.textTracks[textTrack.index].mode = 'showing';
        ++cov_29usqbrt0g.s[55];
        HlsAdapter._logger.debug('Text track changed', textTrack);
        ++cov_29usqbrt0g.s[56];
        this._onTrackChanged(textTrack);
      } else {
        ++cov_29usqbrt0g.b[11][1];
      }
    }

    /**
     * Enables adaptive bitrate switching according to hls.js logic.
     * @function enableAdaptiveBitrate
     * @returns {void}
     * @public
     */

  }, {
    key: 'enableAdaptiveBitrate',
    value: function enableAdaptiveBitrate() {
      ++cov_29usqbrt0g.f[15];
      ++cov_29usqbrt0g.s[57];

      this._hls.nextLevel = -1;
    }

    /**
     * Triggers on video track selection (auto or manually) the 'videotrackchanged' event forward.
     * @function _onLevelSwitched
     * @param {string} event - The event name.
     * @param {any} data - The event data object.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onLevelSwitched',
    value: function _onLevelSwitched(event, data) {
      ++cov_29usqbrt0g.f[16];

      var videoTrack = (++cov_29usqbrt0g.s[58], this._playerTracks.find(function (track) {
        ++cov_29usqbrt0g.f[17];
        ++cov_29usqbrt0g.s[59];

        return (++cov_29usqbrt0g.b[13][0], track instanceof _playkitJs.VideoTrack) && (++cov_29usqbrt0g.b[13][1], track.index === data.level);
      }));
      ++cov_29usqbrt0g.s[60];
      HlsAdapter._logger.debug('Video track changed', videoTrack);
      ++cov_29usqbrt0g.s[61];
      this._onTrackChanged(videoTrack);
    }

    /**
     * Triggers on audio track selection (auto or manually) the 'audiotrackchanged' event forward.
     * @function _onAudioTrackSwitched
     * @param {string} event - The event name.
     * @param {any} data - The event data object.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onAudioTrackSwitched',
    value: function _onAudioTrackSwitched(event, data) {
      ++cov_29usqbrt0g.f[18];

      var audioTrack = (++cov_29usqbrt0g.s[62], this._playerTracks.find(function (track) {
        ++cov_29usqbrt0g.f[19];
        ++cov_29usqbrt0g.s[63];

        return (++cov_29usqbrt0g.b[14][0], track instanceof _playkitJs.AudioTrack) && (++cov_29usqbrt0g.b[14][1], track.id === data.id);
      }));
      ++cov_29usqbrt0g.s[64];
      HlsAdapter._logger.debug('Audio track changed', audioTrack);
      ++cov_29usqbrt0g.s[65];
      this._onTrackChanged(audioTrack);
    }

    /**
     * Disables all the video tag text tracks.
     * @returns {void}
     * @private
     */

  }, {
    key: '_disableAllTextTracks',
    value: function _disableAllTextTracks() {
      ++cov_29usqbrt0g.f[20];

      var vidTextTracks = (++cov_29usqbrt0g.s[66], this._videoElement.textTracks);
      ++cov_29usqbrt0g.s[67];
      for (var i = 0; i < vidTextTracks.length; i++) {
        ++cov_29usqbrt0g.s[68];

        vidTextTracks[i].mode = 'hidden';
      }
    }

    /**
     * Handles hls errors.
     * @param {string} event - The event name.
     * @param {any} data - The event data object.
     * @private
     * @returns {void}
     */

  }, {
    key: '_onError',
    value: function _onError(event, data) {
      ++cov_29usqbrt0g.f[21];

      var errorType = (++cov_29usqbrt0g.s[69], data.type);
      var errorDetails = (++cov_29usqbrt0g.s[70], data.details);
      var errorFatal = (++cov_29usqbrt0g.s[71], data.fatal);
      ++cov_29usqbrt0g.s[72];
      if (errorFatal) {
        ++cov_29usqbrt0g.b[15][0];
        ++cov_29usqbrt0g.s[73];

        switch (errorType) {
          case _hls2.default.ErrorTypes.NETWORK_ERROR:
            ++cov_29usqbrt0g.b[16][0];
            ++cov_29usqbrt0g.s[74];

            HlsAdapter._logger.error("fatal network error encountered, try to recover");
            ++cov_29usqbrt0g.s[75];
            this._hls.startLoad();
            ++cov_29usqbrt0g.s[76];
            break;
          case _hls2.default.ErrorTypes.MEDIA_ERROR:
            ++cov_29usqbrt0g.b[16][1];
            ++cov_29usqbrt0g.s[77];

            HlsAdapter._logger.error("fatal media error encountered, try to recover");
            ++cov_29usqbrt0g.s[78];
            this._hls.recoverMediaError();
            ++cov_29usqbrt0g.s[79];
            break;
          default:
            ++cov_29usqbrt0g.b[16][2];
            ++cov_29usqbrt0g.s[80];

            HlsAdapter._logger.error("fatal error, cannot recover");
            ++cov_29usqbrt0g.s[81];
            this.destroy();
            ++cov_29usqbrt0g.s[82];
            break;
        }
      } else {
        ++cov_29usqbrt0g.b[15][1];
        ++cov_29usqbrt0g.s[83];

        switch (errorDetails) {
          case _hls2.default.ErrorDetails.MANIFEST_LOAD_ERROR:
            ++cov_29usqbrt0g.b[17][0];

          case _hls2.default.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
            ++cov_29usqbrt0g.b[17][1];

          case _hls2.default.ErrorDetails.MANIFEST_PARSING_ERROR:
            ++cov_29usqbrt0g.b[17][2];

          case _hls2.default.ErrorDetails.LEVEL_LOAD_ERROR:
            ++cov_29usqbrt0g.b[17][3];

          case _hls2.default.ErrorDetails.LEVEL_LOAD_TIMEOUT:
            ++cov_29usqbrt0g.b[17][4];

          case _hls2.default.ErrorDetails.LEVEL_SWITCH_ERROR:
            ++cov_29usqbrt0g.b[17][5];

          case _hls2.default.ErrorDetails.FRAG_LOAD_ERROR:
            ++cov_29usqbrt0g.b[17][6];

          case _hls2.default.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
            ++cov_29usqbrt0g.b[17][7];

          case _hls2.default.ErrorDetails.FRAG_LOAD_TIMEOUT:
            ++cov_29usqbrt0g.b[17][8];

          case _hls2.default.ErrorDetails.FRAG_PARSING_ERROR:
            ++cov_29usqbrt0g.b[17][9];

          case _hls2.default.ErrorDetails.BUFFER_APPEND_ERROR:
            ++cov_29usqbrt0g.b[17][10];

          case _hls2.default.ErrorDetails.BUFFER_APPENDING_ERROR:
            ++cov_29usqbrt0g.b[17][11];
            ++cov_29usqbrt0g.s[84];

            HlsAdapter._logger.error(errorType, errorDetails);
            ++cov_29usqbrt0g.s[85];
            break;
          default:
            ++cov_29usqbrt0g.b[17][12];
            ++cov_29usqbrt0g.s[86];

            break;
        }
      }
    }

    /**
     * Removes hls.js bindings.
     * @returns {void}
     * @private
     */

  }, {
    key: '_removeBindings',
    value: function _removeBindings() {
      ++cov_29usqbrt0g.f[22];
      ++cov_29usqbrt0g.s[87];

      this._hls.off(_hls2.default.Events.ERROR, this._onError);
      ++cov_29usqbrt0g.s[88];
      this._hls.off(_hls2.default.Events.LEVEL_SWITCHED, this._onLevelSwitched);
      ++cov_29usqbrt0g.s[89];
      this._hls.off(_hls2.default.Events.AUDIO_TRACK_SWITCHED, this._onAudioTrackSwitched);
    }

    /**
     * Getter for the src that the adapter plays on the video element.
     * In case the adapter preformed a load it will return the manifest url.
     * @public
     * @returns {string} - The src url.
     */

  }, {
    key: 'src',
    get: function get() {
      ++cov_29usqbrt0g.f[23];
      ++cov_29usqbrt0g.s[90];

      if ((++cov_29usqbrt0g.b[19][0], this._loadPromise) && (++cov_29usqbrt0g.b[19][1], this._sourceObj)) {
        ++cov_29usqbrt0g.b[18][0];
        ++cov_29usqbrt0g.s[91];

        return this._sourceObj.url;
      } else {
        ++cov_29usqbrt0g.b[18][1];
      }
      ++cov_29usqbrt0g.s[92];
      return "";
    }
  }]);

  return HlsAdapter;
}(_playkitJs.BaseMediaSourceAdapter);

// Register hls adapter to the media source adapter provider.


HlsAdapter.id = 'HlsAdapter';
HlsAdapter._logger = _playkitJs.BaseMediaSourceAdapter.getLogger(HlsAdapter._name);
HlsAdapter._hlsMimeTypes = ['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/x-mpegurl', 'video/x-mpegurl', 'video/mpegurl', 'application/mpegurl'];
exports.default = HlsAdapter;
++cov_29usqbrt0g.s[93];
if (HlsAdapter.isSupported()) {
  ++cov_29usqbrt0g.b[20][0];
  ++cov_29usqbrt0g.s[94];

  (0, _playkitJs.registerMediaSourceAdapter)(HlsAdapter);
} else {
  ++cov_29usqbrt0g.b[20][1];
}

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=playkit-hls.js.map