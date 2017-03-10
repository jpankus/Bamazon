// dependencies
var mysql = require("mysql");
var prompt = require("prompt");
var inquirer = require("inquirer");

//create a port for node
//var PORT = 3000;

// Connect to the Bamazon database
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "Bamazon"
});


// running sql query

var execute = function(){

	connection.query("SELECT * FROM products", function(err, result) {
		return (inTable(result));
	  
	  });

	// prompt and set a timeout to disconnect 
    setTimeout(function() {
	    prompt.get(["item_id", "quantity"], function (err, result) {
		    var shopperItem = result.item_id;
		    var shopperQuant = result.quantity;

		    inventoryCheck(shopperItem, shopperQuant);
		    setTimeout(function() {execute();}, 3500);
		});
	}, 750);
}

// Check inventory

var inventoryCheck = function (id, quantity){
	connection.query("SELECT * FROM products WHERE item_id = " + id, function (err, result){
		if (err) throw err;

		var total = result[0].price * quantity;

		var inventory = result[0].quantity - quantity;

		if (inventory < 0){
			console.log("Insufficient stock. There are only "+ result[0].quantity + "item(s) left.");
		} else {
			console.log("User has bought " + quantity + " " + result[0].product_name + " for $" + total);
			console.log("There are " + inventory + " " + result[0].product_name + " remaining.")
			databaseUpdate(id, inventory)
		}
	});
}

// update database 
var databaseUpdate = function(id, quantity){
	connection.query("update products set quantity = " + quantity + " where item_id = " + id, function(err, result) {
        if (err) throw err;
    });
}

// create a table to view inventory in terminal

function inTable(items){
	for (var i = 0; i < items.length; i++) {
		console.log("------------------------");
		console.log("ID: " + items[i].item_id);
		console.log("Item: " + items[i].product_name);
		console.log("Department: " + items[i].department_name);
		console.log("Price: $" + items[i].price);
        console.log("Quantity: " + items[i].quantity);
	}
	console.log("------------------------");
}


// connect to bamazon
connection.connect(function(err) {
    if (err) {
		console.error("error connecting: " + err);
	    return;
	}
});

// execute it
execute();