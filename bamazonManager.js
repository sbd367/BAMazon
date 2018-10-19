var mysql = require("mysql");
var inquire = require("inquirer");
var ProductN = [];
var ProductP = [];
var ProductI = [];
var ProductQ = [];

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 8889,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon_db"
  });

  connection.connect(function(err){
      if(err) throw err;
      console.log(connection.threadId);
      displayThings();
  })

  function displayThings(){
      connection.query("SELECT product_name, stock_quantity, price, item_id FROM bamazon_db.products;", function(err, res){

          if(err) throw err;
    
          //loop to save everything
          for(y in res){
              ProductN.push(res[y].product_name);
              ProductI.push(res[y].item_id);
              ProductP.push(res[y].price);
              ProductQ.push(res[y].stock_quantity);
          }

          //loop to display everything
          for(I in ProductI){
          console.log("-------Product------");
          console.log("Poduct Name: "+ProductN[I]);
          console.log("Product ID: "+ProductI[I]);
          console.log("Product Quantity: "+ProductQ[I]);
          console.log("Product Price: "+ ProductP[I]);
          console.log("===================\n");
          }
      })
  }

    function shop(){
        
    }