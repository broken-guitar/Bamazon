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


// >>>>> START <<<<<

showMenu(); // show menu to user

// ***** FUNCTIONS *****

function showMenu() {
    inquirer.prompt([{ 
        type: "rawlist", name: "selection", message: "Select an option",
        choices: [
           "View Product Sales by Department",
           "Create New Department",
           "Quit"
        ], default: 0
    }]).then(answer => {
        // switch on user's selction, call corresponding function
        switch (answer.selection) {
            case "View Product Sales by Department": viewSales(); break;
            case "Create New Department": createDept(); break;
            case "Quit": closeApp(); break;
            default: break;
        }      
    });
};

function viewSales() {
    console.log('\n # PRODUCT SALES #\n');
    // summarize sales with a join, calculated field, and group by clause
    let sql =   "SELECT department_id, d.department_name, over_head_costs, product_sales, " +
                "product_sales - over_head_costs AS total_profit " +
                "FROM departments AS d " +
                "LEFT JOIN products AS p " +
                "ON p.department_name = d.department_name " +
                "GROUP BY d.department_name;"
    bamazonDb.query(sql, (err, result) => {
        if(err) throw err;
        console.table(result);
        showMenu(); // return user to selection menu
    });
};

function createDept() {
    console.log('\n # CREATE A NEW DEPARTMENT #\n');
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Enter department name:",
            validate: val => {
                return isEmpty(val) ? "Please enter a department name!" :  true
             },
            filter: val => { return val.trim(); } 
        },
        {
            name: "overhead",
            type: "input",
            message: "Enter the overhead cost of the department:",
            validate: val => {
                if (!isNaN(val) && val > 0) {
                    return true;
                } else {
                    return "Please enter a numeric value greater than 0!"
                }
            }
        }
    ]).then(answers => {
        let sql = "INSERT INTO departments (department_name, over_head_costs) VALUES (?, ?);"
        bamazonDb.query(sql, [answers.name, answers.overhead], (err, result) => {
            if(err) throw err;
            console.log("\nDepartment " + answers.name + " added successfully!\n");
            showMenu(); // return user to selection menu
        });
    });
    // // query all products in the database and show results to user
    // bamazonDb.query('SELECT * FROM products;', (err, result) => {
    //     if(err) throw err;
    //     console.table(result);
    //     showMenu(); // return user to selection menu
    // });
};

// close connect and exit
function closeApp() {
    bamazonDb.end();
    process.exit();
};

// helper - check if string is empty
function isEmpty(string) {
    return string.match(/^\s*$/);
}