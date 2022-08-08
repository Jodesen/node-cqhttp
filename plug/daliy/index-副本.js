const fs = require('fs');
const path = require('path');


module.exports = {
    main
}

function main(ws, str) {
    if (!(str.message === "签到" || str.message === "打卡")) return;
    //获取2-15的随机数
    let randDom = Math.floor(Math.random() * (15 - 2 + 1) + 2);
    //判断群文件是否存在
    fs.access(path.join(__dirname, `${str.group_id}.json`), fs.constants.F_OK, (err) => {
        //不存在执行创建函数
        if (err) return create(ws, str, randDom)
        //存在执行写入函数
        return write(ws, str, randDom);//console.log("群json文件已存在"),
    })
}

//写入文件
function write(ws, str, randDom) {
    //获取当前几号
    const time = ((new Date()).getDate()).toString()
    //定义文件路径
    const fileName = path.join(__dirname, `${str.group_id}.json`)
    //读取文件
    fs.readFile(fileName, 'utf8', function (err, data) {
        // console.log('');
        //将读取的字符串转换为对象
        let newData = JSON.parse(data);
        //判断文件是否是昨天的文件
        if (newData.time != time) return create(ws, str, randDom);
        if (newData.hasOwnProperty(str.user_id)) return repeatDaliy(ws, str, randDom);//console.log("已经打卡")
        // console.log(newData);
        newData[str.user_id] = "1"
        fs.writeFile(fileName, JSON.stringify(newData), { encoding: 'utf8' }, function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            return sucessDaliy(ws, str, randDom);//console.log('写入成功')
        })

        fs.access(path.join(__dirname, '../', `积分数据.json`), fs.constants.F_OK, (err) => {
            //不存在执行创建函数
            if (err) return createJf(str)
            //存在执行写入函数
            let gol = 10
            return gral(str, gol);//console.log("群json文件已存在"),
        })
    })
}

//创建文件
function create(ws, str, randDom) {
    //获取当前几号
    const time = ((new Date()).getDate()).toString()
    fs.writeFile(path.join(__dirname, `${str.group_id}.json`), '{"time":' + time + "}", { encoding: 'utf8' }, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        console.log('创建群json文件成功');
        write(ws, str, randDom)
    }
    )
}

//成功打卡反馈函数
function sucessDaliy(ws, str, randDom) {
    imgUrl = 'http://ovooa.com/API/zan/api.php?QQ=' + str.sender.user_id;
    const daliyStr = {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.sender.user_id }, "type": "at" },
                { "data": { "text": `${str.message}成功,获得${randDom}🏅` }, "type": "text" },
                { "data": { "type": "image", "file": imgUrl,"cache": 0}, "type": "image" }
            ]
        },
    }
    if (ws.send(JSON.stringify(daliyStr))) return console.log("奖励成功");
}

//重复打卡反馈函数
function repeatDaliy(ws, str, randDom) {
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
    gral(str, randDom)
    if (ws.send(JSON.stringify(daliyStr))) return false;
}



//写入积分数据函数
function gral(str, gol) {
    //读取积分文件
    fs.readFile(path.join(__dirname, '../', `积分数据.json`), 'utf8', function (err, data) {
        if (err) {
            console.log("读取积分文件失败");
        }
        let jfDate = JSON.parse(data)
        if (typeof (jfDate[str.user_id]) === "undefined") {
            jfDate[str.user_id] = 10
            // console.log("等于undefined");
        } else if ((jfDate[str.user_id]) <= '-10') {
            jfDate[str.user_id] = 0
        }
        else {
            jfDate[str.user_id] = Number(jfDate[str.user_id]) + gol
            // console.log("不等于undefined");
        }
        fs.writeFile(path.join(__dirname, '../', `积分数据.json`), JSON.stringify(jfDate), { encoding: 'utf8' }, function (err) {
            if (err) {
                console.log(err);
                return false;
            }
            console.log("");


        })
        // console.log(JSON.stringify(jfDate));
    })
}





//创建积分文件
function createJf(str) {
    fs.writeFile(path.join(__dirname, '../', `积分数据.json`), '{"log":"1"}', { encoding: 'utf8' }, function (err) {
        if (err) {
            console.log(err);
            return false;
        }
        console.log('创建积分文件成功');
        gral(str)
    }
    )
}




