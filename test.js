const schedule = require('node-schedule');
// 当前时间的秒值为 10 时执行任务，如：2018-7-8 13:25:10
let job = schedule.scheduleJob('10 * * * * *', () => {
    console.log(new Date());
   });

// // const config = require('./config');
// // const WebSocket = require('ws');
// // const ws = new WebSocket(config.xieyi.ws);
// // ws.onmessage = function(event) {
// //     const str = JSON.parse(event.data);
// //     // if(!(str.post_type==="message")) return
// //     if((str.message_type != "group")||(/http/g.test(str.message))) return;
// //     console.log(str);
    
// // }
// // const str = '[CQ:image,file=152041a8abe39afad71bf205417aab2a.image,subType=1,url=https://gchat.qpic.cn/gchatpic_new/2982143692/3882889846-3213164538-152041A8ABE39AFAD71BF205417AAB2A/0?term=3]'
// // console.log(/http/g.test(str.message));
// const fs = require('fs');
// const path = require('path');

// fs.readFile(path.join(__dirname, '1.txt'), 'utf8', function(err, data) {
//     // console.log(data.split(','));
//     let str = data.replace(/\r\n/g,"");
//     let newArr = str.split(",")
//     // console.log(json);
//     console.log(newArr);
//     // console.log(json["che"]);

//     fs.writeFile(path.join(__dirname, '2.json'),JSON.stringify(newArr), function(err, data) {
//         if (err) {}
//             console.log("写入成功");

//     })
//     // console.log(newArr);
// })