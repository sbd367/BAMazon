var mysql = require("mysql");
var inquirer = require("inquirer");
var ProductN = [];
var ProductP = [];
var ProductI = [];
var ProductQ = [];
var updatedQ = 0;

var connection = mysql.createConnection({
    host: "LocalHost",

    port: 8889,

    user: "root",

    password: "root",

    database: "bamazon_db"
});

connection.connect((err)=>{
    if (err) throw err;
    console.log(connection.threadId);
    startMenu();
})

function storeValue(res){
    //loop to save everything
    for(y in res){
        ProductN.push(res[y].product_name);
        ProductI.push(res[y].item_id);
        ProductP.push(res[y].price);
        ProductQ.push(res[y].stock_quantity);
    }
}

function addProd(){
    inquirer
    .prompt([{
        type: "input",
        name:"NprodN",
        message: "Name of new product"
    },{
        type: "input",
        name: "NprodD",
        message: "Department of new product"
    },{
        type: "input",
        name: "NprodS",
        message: "How many would you like to stock"
    },{
        type: "input",
        name: "NprodP",
        message: "price of the item?"
    }]).then((res)=>{
    
        connection.query("INSERT INTO `bamazon_db`.`products` (`product_name`, `department_name`, `stock_quantity`, `price`) VALUES ('"+res.NprodN+"', '"+res.NprodD+"', '"+res.NprodS+"', '"+res.NprodP+"');", (err)=>{
            if (err){
                console.log(err);
            }else{
                console.log("-------Success--------");
                startMenu();
            }
        })
    })
    
}

function addInv(){
    inquirer
    .prompt([{
        type: "input",
        name: "ProdID",
        message: "What is the id of the product you want to stock?"
    },{
        type: "input",
        name: "ProdQ",
        message: "How many would you like to stalk?"
    }]).then((response)=>{

        connection.query("SELECT * FROM bamazon_db.products WHERE item_id ="+response.ProdID+";", (err, res)=>{

            if(err) throw err;
            ProductQ.push(res[0].stock_quantity);
           let leName = res[0].product_name;
            updatedQ = parseInt(ProductQ) + parseInt(response.ProdQ);
       

        connection.query("UPDATE products SET ? WHERE ?", [
            {stock_quantity: updatedQ},
            {item_id: response.ProdID}
        ], (err) => {
            if(err) throw err;
            console.log("you have added "+ response.ProdQ+" to the " + leName+" available quantity");
            startMenu();
        })
        })
    })
}


function startMenu(){
    inquirer
        .prompt([{
            type: "list",
            name: "StartPrompt",
            message: "choose a menu option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add a New Product", "Exit App"]
        }
    ]).then((response)=>{

        console.log(response);

        connection.query("SELECT * FROM bamazon_db.products;", (err, res)=>{

            if(err) throw err;

        switch(response.StartPrompt){

            //Handles response  
            case "View Products for Sale":
      
            storeValue(res);

                //loop to display everything
                for(I in ProductI){
                console.log("-------Product------");
                console.log("Poduct Name: "+ProductN[I]);
                console.log("Product ID: "+ProductI[I]);
                console.log("Product Quantity: "+ProductQ[I]);
                console.log("Product Price: "+ ProductP[I]);
                console.log("=============================\n");
                }
            startMenu();
            break;

            case "View Low Inventory":

            storeValue(res);

                // Loops through quantity and if the quantity is less than 5 it will show the low products
            for(I in ProductQ){

                if(ProductQ[I] < 5){
                    console.log(ProductN[I]+", Quantity: "+ProductQ[I]);
                }
            }
            startMenu();
            break;
        }
        })

            if(response.StartPrompt == "Add a New Product"){
                addProd();
            }

            if(response.StartPrompt == "Add to Inventory"){
                addInv();
            }

            if(response.StartPrompt == "Exit App"){
                connection.end();
            }
        
    })
    
}

