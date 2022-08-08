const request = require('request');
const fs = require('fs');
const path = require('path');

const qunid = [ "852623157", "817333925","377313189"]


module.exports = {
    getImageUrl
}



function getImageUrl(ws) {
    request({
        url: 'https://api.03c3.cn/zb/api.php',
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
        },
    }, (err, rep, body) => {
        // body表示返回的数据
        if (body) {
            //调用写入图片函数
            main(ws,body.imageUrl);
        }
    })
}


function downImage(ImageUrl = 'https://api.03c3.cn/zb/') {
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
async function main(ws,imageUrl) {
    try {
        let one = await downImage(imageUrl);
        if(one) return sendArr(ws)
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
                { "data": { "text": "----------------\n" }, "type": "text" },
                { "data": { "text": "每日一早报·简约读新闻☀ " }, "type": "text" },
            ]
        },
    }
    ws.send(JSON.stringify(moneyVicoce))
    console.log(`${str}日报发送成功`);
    return false
}