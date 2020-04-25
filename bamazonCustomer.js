// load node module dependencies 
const inquirer = require("inquirer");
const mysql = require("mysql");

const bamazonDb = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

inputProductId = [{
    name: "productId",
    message: "Enter a product Id",
    default: 1,
    validate: val => {
       return isEmpty(val) ? "Please enter a product Id number" :  true
    },
    filter: val => { return val.trim(); } 
 }];

inputProductQty = [{
    name: "productQty",
    message: "enter product quantity",
    default: 1,
    validate: val => {
        return isEmpty(val) ? "Please enter the how many you would like to buy" :  true
     },
     filter: val => { return val.trim(); } 

}];


// Start

bamazonDb.connect(err => {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + bamazonDb.threadId);
});

bamazonDb.query("SELECT * FROM products;", (err, res) => {
    if (err) throw err;
    console.log(res);
});

