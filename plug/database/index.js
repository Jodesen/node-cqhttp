const Database = require("better-sqlite3")
const db = new Database('database.db', { verbose: console.log })

// const create_table_cats=
//     `CREATE TABLE cats
//      (
//          id      INT   PRIMARY KEY  NOT NULL,
//          name    CHAR(50)           NOT NULL,
//          age   INT
//      );`


// //创建插入语句
// const insert = db.prepare('INSERT INTO cats (id,name, age) VALUES (@id,@name, @age)');

// //插入一条记录
// insert.run({id:1,name:'Jack',age:2})


const stmt=db.prepare('SELECT * FROM test ');
// var cats=select_stmt.all()
// console.log(cats)
var row=stmt.all()//返回全部记录

console.log(row)



// const deleteA = db.prepare("DROP TABLE cats")
// deleteA.run()


// //创建批量插入过程
// const insertMany = db.transaction((cats) => {
//     for (const cat of cats) insert.run(cat);
// });

// //执行批量插入语句
// insertMany([
//     {name: 'Joey', age: 2 },
//     {name: 'Sally', age: 4 },
//     {name: 'Junior', age: 1 },
// ]);
