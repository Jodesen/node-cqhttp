const path = require('path');

module.exports = {
    main
}

function main(ws, str, opDate) {
    if (!(opDate.qun).includes(`${str.group_id}`)) return;
    //获得龙王
    if (str.honor_type === "talkative") return talkative(ws, str)

    //入群申请
    // if(str.request_type==="group") return group(ws, str)
    switch (str.notice_type) {
        case "group_increase":
            crease(ws, str);
            break;
        case "group_decrease":
            decrease(ws, str);
        default:
            break;
    }
}

//退群通知
function decrease(ws, str) { 
    let t = new Date((str.time)*1000);
    let leaveTime =t.getFullYear() + '年' + (t.getMonth() + 1) + '月' + t.getDate() + '日'+ t.getHours() + '时' + t.getMinutes() + '分' + t.getSeconds() + "秒";

    const jsonStr =
    {
        "action": "send_group_msg", 
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "text": `QQ:${str.user_id}\n悄咪咪的离开了本群,后会有期\n时间：${leaveTime}` }, "type": "text" }, 
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
    return
}
//入群通知
function crease(ws, str) {
    //上linux时需要改为`file:\/\/`
    let imgStr = `file:\/\/${path.join(__dirname, '..\/..\/img\/ruqun.png')}`
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": "欢迎来到本群，有问题多看公告\n找教程可以看群文件里萌新专用文件夹，里面都是教程实在不会可以呼叫703" }, "type": "text" },
                { "data": { "type": "image", "file":imgStr  }, "type": "image" }
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
}

//获得龙王通知
function talkative(ws, str) {
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "text": "恭喜" }, "type": "text" },
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": "，成为昨天的水群大魔王" }, "type": "text" },
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
}

// //入群申请
// function group(ws, str) {
//     console.log(str.comment);
// }