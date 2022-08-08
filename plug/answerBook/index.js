const fs = require('fs');
const path = require('path');

const Database = require("better-sqlite3")
const db = new Database(path.join(__dirname, `../database/database.db`), { verbose: console.log })

module.exports = {
    main
}
function main(ws, str) {
    //标识符开头，且有空格才识别
    if (str.message.split(" ")[1] === undefined) return;
    if (!((str.message.split(" ")[0] === "我想知道") || (str.message.split(" ")[0] === "答案"))) return;
    check(ws, str)
}

function aswer(ws, str) {
    //获取文本
    const answerstr = (JSON.parse(fs.readFileSync(path.join(__dirname, './answersbook.json'), 'utf8')))
    //随机数
    let random = Math.floor(Math.random() * 268) + 1
    console.log(answerstr[random].answer);
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.user_id, "id": str.message_id }, "type": "reply" },
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": answerstr[random].answer }, "type": "text" },
                { "data": { "type": "image", "file": `file:\/${path.join(__dirname, `../../img/book.gif`)}` }, "type": "image" },

            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
    koufen(ws, str)
}





function check(ws, str) {
    //查询
    const select_stmt = db.prepare(`select count(*) from user where id=${str.sender.user_id}`).all();
    // console.log(select_stmt[0]["count(*)"] === 1);
    //判断这个人有没有记录
    if (select_stmt[0]["count(*)"] === 1) {
        //有记录
        const select_stmt = db.prepare(`select integral from user where id=${str.sender.user_id}`).all();
        //判断积分是否小于2
        if (select_stmt[0].integral.toString() <= 2) return kouFenErr(ws, str)
        //调用发送文本函数
        aswer(ws, str)
        //更新数据库数据(操作积分数据)
        const upDate = db.prepare(`update user set integral = integral-2 WHERE ID = ${str.sender.user_id}`);
        upDate.run()

    } else {
        //积分不足调用发送提示函数
        kouFenErr(ws, str)
    }
}

//扣分函数
function koufen(ws, str, moneyStr) {
    const moneyVicoce = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": "答案书吃掉了你2🏅" }, "type": "text" },
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
                { "data": { "text": "\n🏅不足，答案书对你不理睬" }, "type": "text" },
            ]
        },
    }
    ws.send(JSON.stringify(moneyVicoce));
}