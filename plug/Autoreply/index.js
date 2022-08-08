const path = require('path');



module.exports = {
    main
}
const qunid = ["817333925","392889846"]


function main(ws, str) {
    // if(!(((/教程/g.test(str.message)) || (/帮忙/g.test(str.message)))&&((qunid).includes(`${str.group_id}`)))) return;

    if (!((/教程/g.test(str.message)) || (/帮忙/g.test(str.message)))) return ;
    if(!((qunid).includes(`${str.group_id}`))) return;


    crease(ws, str) 
}

function crease(ws, str) {
    //上linux时需要改为`file:\/\/`
    let imgStr = `file:\/\/${path.join(__dirname, '..\/..\/img\/ruqun.png')}`
    const jsonStr =
    {
        "action": "send_group_msg",
        "params": {
            "group_id": str.group_id,
            "message": [
                { "data": { "qq": str.user_id }, "type": "at" },
                { "data": { "text": "\n找教程可以看群文件里萌新专用文件夹，里面都是教程\n实在不会可以呼叫703" }, "type": "text" },
                { "data": { "type": "image", "file": imgStr }, "type": "image" }
            ]
        }
    }
    ws.send(JSON.stringify(jsonStr))
}