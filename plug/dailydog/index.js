const request = require('request');


const promise = new Promise((resolve, reject) => {
    // request的post请求,获取api中的图片地址
    request({
        url: 'http://ovooa.com/API/tgrj/api.php',
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36"
        },
    }, (err, rep, body) => {
        if (err) {
            reject(err);
        }
        // body表示返回的数据
        if (body) {
            resolve(body);
        }
    })
})
promise.then((value) => {});