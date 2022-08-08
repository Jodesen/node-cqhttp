// const request = require('request');
const fs = require('fs');
const path = require('path');
const Database = require("better-sqlite3")
const db = new Database(path.join(__dirname, `../database/database.db`), { verbose: console.log })


module.exports = {
    main
}

function main(ws, str) {
    if (str.message.slice(0, 2) === "举牌" && str.message.slice(2, 3) === ' ') {
        // send(ws, str)
        gral(ws, str)


    }
    return


}

//判断积分是否足够
function gral(ws, str) {
    //查询
    const select_stmt = db.prepare(`select count(*) from user where id=${str.sender.user_id}`).all();
    // console.log(select_stmt[0]["count(*)"] === 1);
    //判断这个人有没有记录
    if (select_stmt[0]["count(*)"] === 1) {
        //有记录
        const select_stmt = db.prepare(`select integral from user where id=${str.sender.user_id}`).all();
        //判断积分是否小于2
        if (select_stmt[0].integral.toString() <= 2) return kouFenErr(ws, str)
        //调用发送函数
        send(ws, str)
        //更新数据库数据(操作积分数据)
        const upDate = db.prepare(`update user set integral = integral-2 WHERE ID = ${str.sender.user_id}`);
        upDate.run()

    } else {
        //积分不足调用发送提示函数
        kouFenErr(ws, str)
    }
}


//发送图片函数
function send(ws, str) {
    let key = str.message.slice(3)
    let urlStr = `https://xiaobapi.top/api/xb/api/jupai.php?msg=${key}`
    console.log(urlStr);
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                // { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "type": "image", "file": urlStr }, "type": "image" }
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
    koufen(ws, str);//回调扣分函数
}

//发送扣分成功信息
function koufen(ws, str) {
    const moneyVicoce = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": `功能使用成功` }, "type": "text" },
                { "data": { "text": "扣除2🏅" }, "type": "text" },
            ]
        },
    }
    ws.send(JSON.stringify(moneyVicoce));
}

//扣分失败函数
function kouFenErr(ws, str) {
    const moneyVicoce = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": "\n🏅不足,攒点🏅再来吧" }, "type": "text" },
            ]
        },
    }
    ws.send(JSON.stringify(moneyVicoce));
}
