module.exports = function (event) {
  const { senderID, threadID } = event;

 
  const userToggle = global.whitelistUserToggle;
  const threadToggle = global.whitelistThreadToggle;

 
  const adminList = global.config.ADMINBOT;

  const whitelistUser = global.whitelistUser;
  const whitelistThread = global.whitelistThread;

  
  if (userToggle) {
    if (!whitelistUser.has(senderID) && !adminList.includes(senderID)) {
      return true; // blocked
    }
  }

  
  if (threadToggle) {
    if (!whitelistThread.has(threadID) && !adminList.includes(senderID)) {
      return true; // blocked
    }
  }

 
  return false;
};
