module.exports.config = {
    name: "adminUpdate",
    eventType: ["log:thread-admins", "log:thread-name", "log:user-nickname", "log:thread-icon", "log:thread-color"],
    version: "1.0.1",
    credits: "kawsar",
    description: "Update team information quickly",
    envConfig: {
        sendNoti: false
    }
};

module.exports.run = async function ({ event, Threads }) {
    const fs = require("fs");
    const iconPath = __dirname + "/emoji.json";
    if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));

    const { threadID, logMessageType, logMessageData } = event;
    const { setData, getData } = Threads;
    const thread = global.data.threadData.get(threadID) || {};

    if (typeof thread["adminUpdate"] !== "undefined" && thread["adminUpdate"] === false) return;

    try {
        let dataThread = (await getData(threadID)).threadInfo;

        switch (logMessageType) {
            case "log:thread-admins": {
                if (logMessageData.ADMIN_EVENT === "add_admin") {
                    dataThread.adminIDs.push({ id: logMessageData.TARGET_ID });
                } else if (logMessageData.ADMIN_EVENT === "remove_admin") {
                    dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                }
                break;
            }

            case "log:thread-icon": {
                let preIcon = JSON.parse(fs.readFileSync(iconPath));
                dataThread.threadIcon = logMessageData.thread_icon || "👍";
                preIcon[threadID] = dataThread.threadIcon;
                fs.writeFileSync(iconPath, JSON.stringify(preIcon));
                break;
            }

            case "log:thread-color": {
                dataThread.threadColor = logMessageData.thread_color || "🌤";
                break;
            }

            case "log:user-nickname": {
                dataThread.nicknames[logMessageData.participant_id] = logMessageData.nickname;
                break;
            }

            case "log:thread-name": {
                dataThread.threadName = logMessageData.name || "No name";
                break;
            }
        }

        await setData(threadID, { threadInfo: dataThread });
    } catch (err) {
        console.log("[adminUpdate] Error:", err);
    }
};
