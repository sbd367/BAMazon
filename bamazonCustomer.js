var mysql = require("mysql");
var inquire = require("inquirer");
var ProductN = [];
var ProductP = [];
var ProductI = [];
var ProductQ = [];
var selectID = 0;
var selectQ = 0;
var updatedQ = 0; 
var updatedP = 0;
var selectedN = "";

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3307,
  
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
          console.log("=============================\n");
          }
          shop();
      })
      
  }
   function continueS(){
       inquire
       .prompt([{
           type: "confirm",
           name: "trynashop",
           message: "do you want to contine shopping?"
       }]).then((res)=>{
           
           if(res.trynashop == true){
               displayThings();
           }else{
               console.log("okay then...");
               connection.end();
           }
       })
   }
  

    function shop(){
        inquire
        .prompt([{
            type: "input",
            name:"select_id",
            message: "What is the ID of the product youd like to purchase"
        },{
            type: "input",
            name: "select_q",
            message: "how many would you like to purchase"
        }
    ]).then(function(response){

        //stores users wanted id and quantity into a variable
        selectID = response.select_id;
        selectQ = response.select_q;
        console.log(selectID, selectQ);
        connection.query("SELECT stock_quantity, price, product_name FROM products WHERE item_id ="+selectID, (err, res) => {
            if(err) throw err;

            if(selectQ <= res[0].stock_quantity){
                updatedQ = res[0].stock_quantity - selectQ;
                updatedP = res[0].price * selectQ;
                selectedN = res[0].product_name;
               
        connection.query("UPDATE products SET ? WHERE ?", [
            {stock_quantity: updatedQ},
            {item_id: selectID}
        ], (err) => {
            if(err) throw err;
            console.log("you have purchased "+selectQ+", "+selectedN+" for a total of $"+ updatedP);
            continueS();
        })
    }

    })
  })
  
}