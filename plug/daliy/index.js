const fs = require('fs');
const path = require('path');

const Database = require("better-sqlite3")
const db = new Database(path.join(__dirname, `../database/database.db`), { verbose: console.log })

//创建数据库
// const create_table_cats=
//     `CREATE TABLE user
//     (
//         id   INTEGER PRIMARY KEY NOT NULL UNIQUE,
//         time   INTEGER NOT NULL,
//         num   INTEGER NOT NULL,
//         integral   INTEGER NOT NULL    
//     );`

// db.exec(create_table_cats)

//查询语句
// const select_stmt=db.prepare("SELECT * FROM user where id ='2' ")
// var cats=select_stmt.all()
// console.log(typeof cats)
// console.log(cats);
// console.log(cats[1]);

//插入语句
// const insert = db.prepare('INSERT INTO user (qq, name ,day, num) VALUES (@name, @age)');
// // insert.run({name: 'Jack', age: 2})


module.exports = {
    main
}

function main(ws, str) {
    if (!(str.message === "签到" || str.message === "打卡")) return;
    // //获取2-15的随机数
    // let randDom = Math.floor(Math.random() * (15 - 2 + 1) + 2);
    checkData(ws, str)
}

//检查是否数据库是否有数据
function checkData(ws, str) {
    //获取2-15的随机数
    let randDom = Math.floor(Math.random() * (8 - 2 + 1) + 2);
    //获取当前几号
    const timeData = ((new Date()).getDate()).toString()
    //查询
    const select_stmt = db.prepare(`select count(*) from user where id=${str.sender.user_id}`).all();
    // console.log(select_stmt[0]["count(*)"] === 1);
    //判断这个人有没有记录
    if (select_stmt[0]["count(*)"] === 1) {
        //有记录
        checkDaily(ws, str, timeData, randDom)
    } else {
        insertDaily(ws, str, timeData, randDom);
    }
}

//判断是否已经签到
function checkDaily(ws, str, timeData, randDom) {
    //查询用户的time值
    const select_stmt = db.prepare(`SELECT time FROM user where id =${str.sender.user_id}`).all();
    // console.log(select_stmt[0].time == timeData);
    //判断存储的日期是否等于当前日期
    if (select_stmt[0].time == timeData) return repeatDaliy(ws, str);
    //说明不是重复打卡，执行打卡成功函数
    reward(ws, str, timeData, randDom)
}

//重复打卡反馈函数
function repeatDaliy(ws, str) {
    imgUrl = 'http://ovooa.com/API/pa/api.php?QQ=' + str.sender.user_id;
    const daliyStr = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": "重复" + str.message + "扣你2🏅" }, "type": "text" },
                { "data": { "type": "image", "file": imgUrl }, "type": "image" }
            ]
        },
    }
    const select_stmt = db.prepare(`select integral from user where id=${str.sender.user_id}`).all();
    // console.log("这个判断",select_stmt[0].integral.toString() <= -2);
    //判断积分是否小于-2
    if (select_stmt[0].integral.toString() <= -2) return //可以写一个禁言函数，让你疯狂重复打卡！
    operationJf(str, -2);
    ws.send(JSON.stringify(daliyStr));
}

//判断是否积分是否足够
function operationJf(str, gol) {
    //更新数据库数据(操作积分数据)
    const upDate = db.prepare(`update user set integral = integral+${gol} WHERE ID = ${str.sender.user_id}`);
    upDate.run()
}


//插入打卡数据
function insertDaily(ws, str, timeData, randDom) {
    //定义插入语句
    const insert = db.prepare('INSERT INTO user (id, time ,num, integral) VALUES (@id, @time, @num, @integral)');
    //插入的数值
    insert.run({ id: str.sender.user_id, time: timeData, num: 0, integral: 0 })
    //调用成功签到函数
    sucessDaliy(ws, str, timeData, randDom)
}

//判断是否连续打卡
function reward(ws, str, timeData, randDom) {
    const select_stmt = db.prepare(`select num from user where id=${str.sender.user_id}`).all();
    let num = select_stmt[0].num
    //判断区间
    if (num >= 5 && num <= 10) {
        console.log("ok");
        let randDom = Math.floor(Math.random() * (10 - 5 + 1) + 5);
        plusDaily(ws, str, num, randDom);
    } else if (num >= 10 && num <= 20) {
        let randDom = Math.floor(Math.random() * (15 - 8 + 1) + 8);
        plusDaily(ws, str, num, randDom);
    } else if (num >= 35) {
        let randDom = Math.floor(Math.random() * (30 - 15 + 1) + 15);
        plusDaily(ws, str, num, randDom);
    } else {
        sucessDaliy(ws, str, timeData, randDom);
    }
}

//连续打卡奖励函数
function plusDaily(ws, str, num, randDom) {
    imgUrl = 'http://ovooa.com/API/zan/api.php?QQ=' + str.sender.user_id;
    const daliyStr = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": `\n连续${str.message}${num}天,获得${randDom}🏅\n连续打卡可获得更多🏅噢` }, "type": "text" },
                { "data": { "type": "image", "file": imgUrl, "cache": 0 }, "type": "image" }
            ]
        },
    }
    ws.send(JSON.stringify(daliyStr));
    //更新日期
    const upDate = db.prepare(`update user set time =${(new Date()).getDate()} WHERE ID = ${str.sender.user_id}`);
    //更新打卡次数
    const upNum = db.prepare(`update user set num=num+1 WHERE ID = ${str.sender.user_id}`);
    upDate.run()
    upNum.run()
    operationJf(str, randDom)
}


//成功打卡反馈函数
function sucessDaliy(ws, str, timeData, randDom) {
    imgUrl = 'http://ovooa.com/API/zan/api.php?QQ=' + str.sender.user_id;
    const daliyStr = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": `\n${str.message}成功,获得${randDom}🏅` }, "type": "text" },
                { "data": { "type": "image", "file": imgUrl, "cache": 0 }, "type": "image" }
            ]
        },
    }
    ws.send(JSON.stringify(daliyStr));
    //更新日期
    const upDate = db.prepare(`update user set time =${(new Date()).getDate()} WHERE ID = ${str.sender.user_id}`);
    //更新打卡次数
    const upNum = db.prepare(`update user set num=num+1 WHERE ID = ${str.sender.user_id}`);
    upNum.run()
    upDate.run()
    operationJf(str, randDom)
}


















