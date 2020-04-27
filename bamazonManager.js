// load node module dependencies 
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

var productIds = [];

const bamazonDb = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

var menuInput = [{ 
    type: "rawlist", name: "mainMenu", message: "Select an option",
    choices: [
       "View Products for Sale",
       "View Low Inventory",
       "Add to Inventory",
       "Add New Product",
       "Quit"
    ], default: 1
}];

// ### START


showMenu(); // show menu to user

// ### FUNCTIONS

function showMenu() {
    inquirer.prompt([{ 
        type: "rawlist", name: "selection", message: "Select an option",
        choices: [
           "View Products for Sale",
           "View Low Inventory",
           "Add to Inventory",
           "Add New Product",
           "Quit"
        ], default: 0
    }]).then(answer => {
        // switch on user's selction, call corresponding function
        switch (answer.selection) {
            case "View Products for Sale": viewProducts(); break;
            case "View Low Inventory": viewLowInventory(); break;
            case "Add to Inventory": addInventory(); break;
            case "Add New Product": addProduct(); break;
            case "Quit": closeApp(); break;
            default: break;
        }      
});
};

// query db for all products and columns and display results to user
function viewProducts() {
    console.log('\n # ALL PRODUCTS FOR SALE #\n');
    // query all products in the database and show results to user
    bamazonDb.query('SELECT * FROM products;', (err, result) => {
        if(err) throw err;
        console.table(result);
        showMenu(); // return user to selection menu
    });
};

// query db for all products if stock quantity is less than five, display to user 
function viewLowInventory() {
    console.log('\n # LOW INVENTORY (LESS THAN FIVE IN STOCK) #\n');
    // query all products in the database where quanitty is less than five and show results
    bamazonDb.query('SELECT * FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity ASC;', (err, result) => {
        if(err) throw err;
        console.table(result);
        showMenu(); // return user to selection menu
    });
};

// query db for all products (to get ids), ask user which product to update inventory,
// update product stock in db based on user input
function addInventory() {
    console.log("\n # ADD MORE TO INVENTORY STOCK #\n");
    // show all products 
    bamazonDb.query('SELECT * FROM products;', (err, result) => {
        if(err) throw err;
        console.table(result);
        // store product Ids in global array for input validation
        if (productIds.length <= 0) {
            productIds = result.map(p => p.id) 
        } else {
            productIds = [];
            productIds = result.map(p => p.id);
        }
        // prompt user for product and quantity to add
        inquirer.prompt([
            { type: "number", name: "productId", message: "Enter id of product to add:",
                validate: val => {
                    // validate user input is a number and is a product id in inventory
                     if (!isNaN(val) && productIds.indexOf(val) >= 0) {
                        return true;
                     } else {
                        console.log
                        return "Enter the id of a product in inventory!";
                     }
                 }
            },
            { type: "number", name: "quantity", message: "Enter quantity to add: ",
                validate: val => isNaN(val) ? "Please enter a number as quantity to add." : true
            }
        ]).then(answers => {
            bamazonDb.query("UPDATE products SET ? WHERE ?;", [
                {stock_quantity: answers.quantity}, {id: answers.productId}
            ], (err, result) => {
                    if (err) throw err;
                    console.table(result);
                    console.log("\nProduct quantity updated successfully!\n");
                    showMenu(); // return user to selection menu
            });
        });
    });
};

function addProduct() {
    console.log("\n # ADD NEW PRODUCT #\n");
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter the product name:"
        },
        {
            name: "department",
            type: "input",
            message: "Enter the product department:"
        },
        {
            name: "price",
            type: "input",
            message: "Enter the product price:",
            validate: val => {
                if (!isNaN(val) && val > 0) {
                    return true;
                } else {
                    return "Please enter a numeric value greater than 0!"
                }
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter product quantity:",
            validation: val => {
                if (!isNaN(val) && val > 0) {
                    return true;
                } else {
                    return "Please enter a numeric value greater than 0!"
                }
            }
        }
    ]).then(answers => {
        let sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?,?,?,?);"
        bamazonDb.query(sql, [
            answers.name,
            answers.department,
            answers.price,
            answers.quantity
        ], (err, result) => {
            if (err) throw err;
            console.log("\nProduct added successfully!\n");
            showMenu();
        });
    });
};

// close connect and exit
function closeApp() {
    bamazonDb.end();
    process.exit();
};
