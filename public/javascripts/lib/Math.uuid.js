// Copyright (c) 2010 Robert Kieffer
//                      http://www.broofa.com
//                      mailto:robert@broofa.com
// Copyright (c) 2011 http://c4se.sakura.ne.jp/profile/ne.html
// Dual licensed under the MIT and GPL licenses.

(function() {
var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
    random;

try {
    random = Xorshift;
} catch (err) {
    random = Math.random;
}

// A more performant, but slightly bulkier, RFC4122v4 solution.  We boost performance
// by minimizing calls to random()
function Math_uuid() {
  var _chars = CHARS, _random = random,
      i = 0, uuid = new Array(36), rnd = 0;
  
  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
  uuid[14] = '4';
  
  for (; i < 36; ++i) {
    if (i !== 8 && i !== 13 && i !== 18 && i !== 14 && i !== 23) {
      if (rnd <= 0x02) {
          rnd = 0x2000000 + (_random() * 0x1000000) | 0;
      }
      rnd >>= 4;
      uuid[i] = _chars[(i === 19) ? ((rnd & 0xf) & 0x3) | 0x8 : rnd & 0xf];
    }
  }
  return uuid.join('');
}
Math.uuid = Math_uuid;

})();