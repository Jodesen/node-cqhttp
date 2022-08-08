const fs = require('fs');
const path = require('path');

const Database = require("better-sqlite3")
const db = new Database(path.join(__dirname, `../database/database.db`), { verbose: console.log })

module.exports = {
    main
}
function main(ws, str) {
    //识别符
    if (!(str.message === "积分" || str.message === "查询")) return;
    //调用判断字符函数
    gol(ws, str)
}


function gol(ws, str) {
    fs.readFile(path.join(__dirname, '../', `积分数据.json`), 'utf8', function (err, data) {
        if (err) {
            console.log("读取积分文件失败");
        }
        //将字符串转为对象
        let jfDate = JSON.parse(data)
        //获取用户积分
        let jf = jfDate[str.user_id]
        if (typeof jf === "undefined" || jf <= '0') {
            //积分不足调用发送提示函数
            kouFenErr(ws, str)
        }
        else {
            //将积分文件进行排序(变为数组
            var keyArr = Object.keys(jfDate).sort(function (a, b) { return -(jfDate[a] - jfDate[b]) });
            // console.log(keyArr);
            //定义当前排名
            const num = (keyArr.indexOf(`${str.sender.user_id}`) + 1);
            // console.log("你的排名为",num)
            //扣除积分
            jfDate[str.user_id] = Number(jfDate[str.user_id]) - 1
            //调用扣分函数
            koufen(ws, str, num, jf)
            //写入改变后的积分数据
            fs.writeFile(path.join(__dirname, '../', `积分数据.json`), JSON.stringify(jfDate), { encoding: 'utf8' }, function (err) {
                if (err) {
                    console.log(err);
                    return false;
                }
            })
        }
    })
}
//扣分函数
function koufen(ws, str, num, jf) {
    const jfDate = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": `\n你的🏅为${jf},当前排名${num},\n查询扣除1🏅` }, "type": "text" },
            ]
        },
    }
    ws.send(JSON.stringify(jfDate));
}

//扣分失败函数
function kouFenErr(ws, str) {
    const moneyVicoce = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": "\n🏅不足，请求失败" }, "type": "text" },
                { "data": { "id": "96" }, "type": "face" },
            ]
        },
    }
    ws.send(JSON.stringify(moneyVicoce));
}

