# Bamazon Node App

Bamazon is an Amazon-like storefront that that makes shopping and storefront managment possible with a simple commandline interface (it's about time!).

Customers can use the customer app to view products and make purchases. Managing inventory, overhead costs, and viewing sales reports are also possible through stand-alone versions of the Bamazon app.

## Installation

1. Install Node 
2. Clone or download the repo.
3. Open a terminal window and navigate to the repository folder on your machine.
4. At the command prompt enter: `npm install`

## Usage

To open the customer menu interface, run:
```
node bamazonCustomer.js
```
Customers can view all products, and enter a product and quantity to purchase.

To open the Manager menu interface, run:
```
node bamazonManager.js
```
Managers can perform the following function on inventory:
Commands | Description
---------|------------
**View Products for Sale**  | View all current products on inventory. 
**View Low Inventory**      | View products of with five or less quantity in stock.
**Add to Inventory**        | Add more product quantity to stock.
**Add New Product**         | Add a new product to the inventory database.

To open the Supervisor menu interface, run:
```
node bamazonSupervisor.js
```
Commands | Description
---------|------------
**View Product Sales by Department**  | View a summary of total sales by product department.
**Create New Department**             | Create a new product department.

## Demo
![bamazon-demo](https://user-images.githubusercontent.com/59757720/80436793-cf33f100-88b4-11ea-88b6-15a76e6f1f84.gif)

## Built with
* NodeJS
* JavaScript
* NPM mysql
* NPM inquirer

# Author
David Flores
