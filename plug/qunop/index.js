const op1 = require('./op1')

const fs = require('fs');
const path = require('path');

module.exports = {
    main
}
const qqHao = "[CQ:at,qq=1656413546]"
function main(ws, str, opDate) {
    //获取op用户数组
    if (str.post_type === 'notice' || str.post_type === "request") return op1.main(ws, str, opDate)
    if (!(str.message_type === "group") || !((opDate.qun).includes(`${str.group_id}`)) || (/http/g.test(str.message))) return;
    //是op则结束进程
    if ((opDate.op).includes(`${str.user_id}`)) return op(ws, str, opDate);
    //不是则检测违禁词
    if (check(str, opDate.che)) {
        //定义撤回内容
        let jsonStrEmpty = '触发关键词，已撤回。'
        //调用撤回函数
        // console.log("调用撤回函数");
        let wsStr = ""
        withDraw(ws, str, jsonStrEmpty, wsStr)
    } else if (check(str, opDate.ban)) {
        //调用撤回禁言函数
        // console.log("调用撤回禁言函数");
        //定义撤回内容
        let jsonStrEmpty = '触发关键词，已撤回、禁言。'
        let wsStr = "ban"
        withDraw(ws, str, jsonStrEmpty, wsStr)
    } else if (str.message.slice(0, 3) === "bme" || str.message.slice(0, 3) === "kme") return banMe(ws, str);
    return

}

//执行撤回and禁言函数
function withDraw(ws, str, jsonStrEmpty, wsStr) {
    const withstr =
    {
        "action": "delete_msg",
        "params": {
            "group_id": str.group_id,
            "message_id": `${str.message_id}`
        },
    }
    const ban =
    {
        "action": "set_group_ban",
        "params": {
            "group_id": str.group_id,
            "user_id": str.user_id,
            "duration": "180",

        },
    }
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": jsonStrEmpty }, "type": "text" },
                { "data": { "text": "\n扣除2🏅" }, "type": "text" },
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr));
    ws.send(JSON.stringify(eval(wsStr)));
    ws.send(JSON.stringify(withstr));
    return
}

//敏感词检测函数
function check(str, arr) {
    for (var i = 0; i < arr.length; i++) {
        // 创建一个正则表达式
        var r = new RegExp(arr[i], 'ig');
        if (r.test(str.message) === true) {
            console.log(r);
            return true
        }
    }
    return false
}

//op指令函数
function op(ws, str, opDate) {
    switch (str.message.slice(0, 1)) {
        case "禁":
            ban(ws, str);
            break;
        case "删":
            deleteCi(ws, str, opDate);
            break;
        case "加":
            create(ws, str, opDate);
            break;
        case "踢":
            ti(ws, str);
            break;
        case "t":
            ti(ws, str);
            break;
        case "解":
            jie(ws, str)
            break;
        default:
            if ((str.message.split(" ")[0] === qqHao) && ((str.message.split(" ")[1]) === "功能" || (str.message.split(" ")[1]) === "help")) {
                senHelp(ws, str)

            }
    }
}

//禁言函数
function ban(ws, str) {
    if (!(/CQ:at/.test(str.message))) return;
    //获取需要禁言的qq
    let banQq = (str.message.split(" ")[0]).slice(11, -1)
    //判断是否是自身
    if (Number(banQq) === str.self_id) {
        const jsonStr =
        {
            "action": "send_group_msg",
            "params": {
                "group_id": str.group_id,
                "message": [
                    { "data": { "qq": banQq }, "type": "at" },
                    { "data": { "text": "干嘛禁言我(；′⌒`)" }, "type": "text" },
                    { "data": { "type": "image", "file": "file:///D:/img/banme.jpg" }, "type": "image" }
                ]
            }
        }
        ws.send(JSON.stringify(jsonStr))
        return
    }

    // console.log(banQq);
    let banTime = (str.message.split(" ")[1]);
    if (!banTime) banTime = Math.ceil(Math.random() * 10);
    const ban =
    {
        "action": "set_group_ban",
        "params": {
            "group_id": str.group_id,
            "user_id": banQq,
            "duration": banTime * 60,
        }
    }
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": banQq }, "type": "at" },
                { "data": { "text": "被" }, "type": "text" },
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": "禁言了" + banTime + "分钟" }, "type": "text" },
            ]
        }
    }
    ws.send(JSON.stringify(ban))
    ws.send(JSON.stringify(jsonStr))
    return

    //使用正则获取禁言时间
    // const banTime = (str.message.slice(1)).replace(/\[.*?\]\s/g,'')



}
//解除禁言
function jie(ws, str) {
    if (!(/CQ:at/.test(str.message))) return;
    //获取需要禁言的qq
    let unbanQq = (str.message.split(" ")[0]).slice(11, -1)
    const unban =
    {
        "action": "set_group_ban",
        "params": {
            "group_id": str.group_id,
            "user_id": unbanQq,
            "duration": 0,
        }
    }
    ws.send(JSON.stringify(unban))
    return
}
//踢人
function ti(ws, str) {
    if (!(/CQ:at/.test(str.message))) return;
    //获取需要禁言的qq
    let tiQq = (str.message.split(" ")[0]).slice(11, -1)
    //判断是否是自身
    if (Number(tiQq) === str.self_id && (/CQ:at/.test(str.message))) {
        const jsonStr =
        {
            "action": "send_group_msg",
            "params": {
                "group_id": str.group_id,
                "message": [
                    { "data": { "qq": str.user_id }, "type": "at" },
                    { "data": { "text": "干嘛踢我(；′⌒`)" }, "type": "text" },
                    { "data": { "type": "image", "file": "file:///D:/img/banme.jpg" }, "type": "image" }
                ]
            }
        }
        ws.send(JSON.stringify(jsonStr))
        return
    }
    const ti =
    {
        "action": "set_group_kick",
        "params": {
            "group_id": str.group_id,
            "user_id": tiQq,
        }
    }
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": tiQq }, "type": "at" },
                { "data": { "text": "被" }, "type": "text" },
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": "踹了出去" }, "type": "text" },
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
    ws.send(JSON.stringify(ti))
    return
}
//删除违禁词
function deleteCi(ws, str, opDate) {
    let errMsgStr = "关键词不存在，删除失败❎"
    if (!(opDate.che).includes(str.message.split(" ")[1])) return errMsg(ws, str, errMsgStr);
    let index = (opDate.che).indexOf(str.message.split(" ")[1]);
    (opDate.che).splice(index, 1);
    // console.log(opDate.che);

    fs.writeFile(path.join(__dirname, 'op.json'), JSON.stringify(opDate), function (err, data) {
        if (err) { }
        // console.log("删除成功");
        const jsonStr =
        {
            "action": "send_group_msg",
            "params": {
                "group_id": str.group_id,
                "message": [
                    { "data": { "qq": str.user_id }, "type": "at" },
                    { "data": { "text": "屏蔽词删除成功✅" }, "type": "text" },
                ]
            }
        }
        ws.send(JSON.stringify(jsonStr))
        return
    })
    // console.log(newArr); 

}
//添加违禁词
function create(ws, str, opDate) {
    if (str.message.split(" ")[1] === undefined) return;
    let errMsgStr = "关键词已存在，添加失败❎"
    if ((opDate.che).includes(str.message.split(" ")[1])) return errMsg(ws, str, errMsgStr);
    (opDate.che).push(str.message.split(" ")[1]);
    // console.log(opDate.che);

    fs.writeFile(path.join(__dirname, 'op.json'), JSON.stringify(opDate), function (err, data) {
        if (err) { }
        // console.log("删除成功");
        const jsonStr =
        {
            "action": "send_group_msg",
            "params": {
                "group_id": str.group_id,
                "message": [
                    { "data": { "qq": str.user_id }, "type": "at" },
                    { "data": { "text": "屏蔽词添加成功✅" }, "type": "text" },
                ]
            }
        }
        ws.send(JSON.stringify(jsonStr))
        return
    })
}



//操作失败函数
function errMsg(ws, str, errMsgStr) {
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": errMsgStr }, "type": "text" },
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
    return
}

//禁言自己函数
function banMe(ws, str) {
    let banTime = Math.ceil(Math.random() * 720);
    const ban =
    {
        "action": "set_group_ban",
        "params": {
            "group_id": str.group_id,
            "user_id": str.user_id,
            "duration": banTime * 60,
        }
    }
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": "快去小黑屋待" + banTime + "分钟" }, "type": "text" },
            ]
        }
    }
    ws.send(JSON.stringify(ban))
    ws.send(JSON.stringify(jsonStr))
    return
}

function senHelp(ws, str) {
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": "\n目前功能有：\n答案书，每日早报，zfb到账" }, "type": "text" },
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
    return
}