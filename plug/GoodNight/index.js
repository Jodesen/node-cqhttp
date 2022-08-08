const request = require('request');
const fs = require('fs');
const path = require('path');



const qunid = ["852623157", "817333925", "377313189", "392889846"]


module.exports = {
    main
}

function downImage(ImageUrl = 'http://ovooa.com/API/image_Tnem/?Time=evening&QR_parent=0') {
    return new Promise((resolve, reject) => {
        //定义图片名字
        let writeStream = fs.createWriteStream(path.join(__dirname, 'daily.png'));
        //定义下载地址
        let readStream = request(ImageUrl)
        readStream.pipe(writeStream);
        writeStream.on("finish", function () {
            console.log("图片写入成功");
            writeStream.end();
            //成功
            resolve(true);
        });
    })
}
//声明一个 async 函数
async function main(ws, imageUrl) {
    try {
        let one = await downImage(imageUrl);
        if (one) return sendArr(ws)
    } catch (e) {
        console.log(e);
    }
}






function sendArr(ws) {
    setTimeout(() => {
        qunid.forEach(function (str) {
            sendImg(ws, str)
            // console.log(str);
        })
        // index.next();
    }, 1000)
}

function sendImg(ws, str) {
    const moneyVicoce = {
        "action": "send_group_msg",
        "params": {
            "group_id": str,
            "message": [
                { "data": { "type": "image", "file": `file:\/\/${__dirname}\/daily.png` }, "type": "image" },
                { "data": { "text": "大家早点睡吧，晚安zzzz~ " }, "type": "text" },
                {"type": "face","data": {"id": "75"}}
            ]
        },
    }
    ws.send(JSON.stringify(moneyVicoce))
    console.log(`${str}日报发送成功`);
    return false
}