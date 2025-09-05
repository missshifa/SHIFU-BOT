module.exports.config = {
  'name': "id",
  'version': "1.0.0",
  'hasPermssion': 0x0,
  'credits': "MAHBUB SHAON",
  'description': "chak information for Facebook uid and massage link",
  'commandCategory': " provide fb uid link",
  'cooldowns': 0x0
};
module.exports.run = async function ({
  event: _0x2cff52,
  api: _0x22577e,
  args: _0x3df47f,
  client: _0x4dbed4,
  Currencies: _0x1c95b6,
  Users: _0x20ea63,
  utils: _0x21dc6d,
  __GLOBAL: _0x10f55d,
  reminder: _0x420553
}) {
  const _0x59fe93 = global.nodemodule["fs-extra"];
  const _0x36eb41 = global.nodemodule.request;
  const _0x1cf196 = global.nodemodule.axios;
  if (_0x2cff52.type == "message_reply") {
    _0x3a37cf = _0x2cff52.messageReply.senderID;
    var _0x53a7ff = () => _0x22577e.sendMessage({
      'body': "•┄┅════❁🌺❁════┅┄•\n\nআসসালামু আলাইকুম-!!🖤💫 \n•—»✨আপনারা User ID হলো: " + _0x3a37cf + "\n\n•—»✨আপনি এই‌ লিংক এর মাধ্যমে তার ইনবক্সে নক করতে পারবেন : m.me/" + _0x3a37cf + "\n\n•—»✨এটি আপনার Facebook Id Link https://www.facebook.com/profile.php?id=" + _0x3a37cf + "\n\n•┄┅════❁🌺❁════┅┄•",
      'attachment': _0x59fe93.createReadStream(__dirname + "/cache/1.png")
    }, _0x2cff52.threadID, () => _0x59fe93.unlinkSync(__dirname + "/cache/1.png"), _0x2cff52.messageID);
    return _0x36eb41(encodeURI("https://graph.facebook.com/" + _0x3a37cf + "/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662")).pipe(_0x59fe93.createWriteStream(__dirname + "/cache/1.png")).on("close", () => _0x53a7ff());
  }
  if (!_0x3df47f[0]) {
    var _0x3a37cf = _0x2cff52.senderID;
    const _0x4d1abb = await _0x1cf196.get("https://www.nguyenmanh.name.vn/api/fbInfo?id=" + _0x3a37cf + "&apikey=LV7LWgAp");
    var _0x24b60c = _0x4d1abb.data.result.name;
    var _0x53a7ff = () => _0x22577e.sendMessage({
      'body': "•┄┅════❁🌺❁════┅┄•\n\nআসসালামু আলাইকুম-!!🖤💫\n•—»✨আপনারা User ID হলো: " + _0x3a37cf + "\n\n•—»✨আপনি এই‌ লিংক এর মাধ্যমে তার ইনবক্সে নক করতে পারবেন : m.me/" + _0x3a37cf + "\n\n•—»✨এটি আপনার Facebook Id Link https://www.facebook.com/profile.php?id=" + _0x3a37cf + "\n\n•┄┅════❁🌺❁════┅┄•",
      'attachment': _0x59fe93.createReadStream(__dirname + "/cache/1.png")
    }, _0x2cff52.threadID, () => _0x59fe93.unlinkSync(__dirname + "/cache/1.png"), _0x2cff52.messageID);
    return _0x36eb41(encodeURI("https://graph.facebook.com/" + _0x2cff52.senderID + "/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662")).pipe(_0x59fe93.createWriteStream(__dirname + "/cache/1.png")).on("close", () => _0x53a7ff());
  } else {
    if (_0x3df47f[0].indexOf(".com/") !== -1) {
      const _0x26bdfd = await _0x22577e.getUID(_0x3df47f[0]);
      var _0x24b60c = _0x4b442f.name;
      var _0x4b442f = await _0x22577e.getUserInfoV2(_0x26bdfd);
      var _0x53a7ff = () => _0x22577e.sendMessage({
        'body': "•┄┅════❁🌺❁════┅┄•\n\nআসসালামু আলাইকুম-!!🖤💫 \n•—»✨আপনারা User ID হলো: " + _0x3a37cf + "\n\n•—»✨আপনি এই‌ লিংক এর মাধ্যমে তার ইনবক্সে নক করতে পারবেন : m.me/" + _0x3a37cf + "\n\n•—»✨এটি আপনার Facebook Id Link https://www.facebook.com/profile.php?id=" + _0x3a37cf + "\n\n•┄┅════❁🌺❁════┅┄•",
        'attachment': _0x59fe93.createReadStream(__dirname + "/cache/1.png")
      }, _0x2cff52.threadID, () => _0x59fe93.unlinkSync(__dirname + "/cache/1.png"), _0x2cff52.messageID);
      return _0x36eb41(encodeURI("https://graph.facebook.com/" + _0x26bdfd + "/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662")).pipe(_0x59fe93.createWriteStream(__dirname + "/cache/1.png")).on("close", () => _0x53a7ff());
    } else {
      if (_0x3df47f.join().indexOf('@') !== -1) {
        var _0x3a37cf = Object.keys(_0x2cff52.mentions);
      }
      var _0x53a7ff = () => _0x22577e.sendMessage({
        'body': "•┄┅════❁🌺❁════┅┄•\n\nআসসালামু আলাইকুম-!!🖤💫\n•—»✨আপনারা User ID হলো: " + _0x3a37cf + "\n\n•—»✨আপনি এই‌ লিংক এর মাধ্যমে তার ইনবক্সে নক করতে পারবেন : m.me/" + _0x3a37cf + "\n\n•—»✨এটি আপনার Facebook Id Link https://www.facebook.com/profile.php?id=" + _0x3a37cf + "\n\n•┄┅════❁🌺❁════┅┄•",
        'attachment': _0x59fe93.createReadStream(__dirname + "/cache/1.png")
      }, _0x2cff52.threadID, () => _0x59fe93.unlinkSync(__dirname + "/cache/1.png"), _0x2cff52.messageID);
      return _0x36eb41(encodeURI("https://graph.facebook.com/" + _0x3a37cf + "/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662")).pipe(_0x59fe93.createWriteStream(__dirname + "/cache/1.png")).on("close", () => _0x53a7ff());
    }
  }
};
