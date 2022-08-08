//引入ws模块
const WebSocket = require('ws');
const config = require('../config');


// // //监听服务端消息
function Ws() {
    //创建ws实例
    const ws = new WebSocket(config.xieyi.ws);
    ws.onmessage = function (event) {
        const str = JSON.parse(event.data);
        console.log(str);
        // //如果不是消息和
        // if (str.post_type !== "message" || /url/g.test(str.message) || /face/g.test(str.message)) return;
    }
}


module.exports = {
    Ws
}
