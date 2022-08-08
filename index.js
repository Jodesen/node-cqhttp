const daliy = require('./plug/daliy')
// const jf = require('./plug/gol')
const op = require('./plug/qunop')
const book = require('./plug/answerBook')
const dailyMessage = require('./plug/dailyMessage')
const autoReply = require('./plug/Autoreply')
const jupai = require('./plug/jupai')
const night = require('./plug/GoodNight')


const fs = require('fs')
const path = require('path')
const config = require('./config');
const WebSocket = require('ws');
const ws = new WebSocket(config.xieyi.ws);
const schedule = require('node-schedule');















ws.onmessage = function (event) {
    //转换字符串为对象
    const str = JSON.parse(event.data);
    // console.log(str);
    const opDate = (JSON.parse(fs.readFileSync(path.join(__dirname, './plug/qunop/op.json'), 'utf8')))
    op.main(ws, str, opDate);
    if (!(str.message_type === "group") || !((opDate.qun).includes(`${str.group_id}`)) || (/http/g.test(str.message))) return;
    daliy.main(ws, str);
    // zfb.main(ws, str);
    // jf.main(ws, str);
    book.main(ws, str);
    autoReply.main(ws,str);
    jupai.main(ws, str);
}




// 当前时间的秒值为 10 时执行任务，如：2018-7-8 13:25:10
schedule.scheduleJob('0 30 7 * * ?', () => {
    dailyMessage.getImageUrl(ws)
});
schedule.scheduleJob('0 0 23 * * ?', () => {
    night.main(ws)
});

测试das