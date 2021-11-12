const express = require('express');
const app = express();
app.use(express.static('public'));
app.use(express.json());
const fs = require('fs');

var datetime = new Date();
var currenthr = datetime.getHours();
var currentmin = datetime.getMinutes();
var restaurantName;
var data = fs.readFileSync('database.json');
var json = JSON.parse(data);

async function restaurantCheck(location)
{
    let userPinCode = location;
    let restaurantCheck=fs.readFileSync('restaurantList.json');
    restaurantCheck = JSON.parse(restaurantCheck.toString());
    locationRestaurantFilter = (restaurantCheck.filter(
        function(restaurantCheck){ 
            if(restaurantCheck.pinCode == userPinCode)
                {   
                    return restaurantCheck;
                }
            }
    ));
    var userRestaurant = locationRestaurantFilter[0].name;
    return Promise.resolve(userRestaurant);
}
async function restaurantMenu(userRestaurantName)
{   
    console.log("this is first in func");
    console.log(userRestaurantName);
    let restaurantFileName = userRestaurantName.toString();
    restaurantFileName = userRestaurantName + '.json';
    let restaurantMenu = fs.readFileSync(restaurantFileName);
    restaurantMenu = JSON.parse(restaurantMenu.toString());
    console.log("Menu Items");
    console.log(restaurantMenu);
    return Promise.resolve(restaurantMenu); 
}
async function orderPlace(orderItems)
{
    let orderList = "Margherita,Double Cheese Margherita,Peppy Paneer";
    var pizzaList = orderList.split(',');
    console.log(pizzaList);
    let listLength = pizzaList.length;
    orderCheck = fs.readFileSync(restaurantName);
    orderCheck = JSON.parse(orderCheck.toString());
    let sum = 0;
    let price = 0;
    for(let i = 0; i < listLength; i++)
    {
        orderReturn = (orderCheck.filter(
            function(orderCheck){
                if(orderCheck.name == pizzaList[i]){
                    return orderCheck;
                }
            }
        ));
        price = parseInt(orderReturn[0].price);
        sum = sum + price;
    }
    console.log(sum);
    let tax = sum * 0.05; 
    let finalBill = "Final Bill is: ₹" + sum.toString() + " and taxes are: ₹" + tax.toString() + " hence, the final amount is : ₹" + (sum+tax);
    console.log(finalBill);
    return Promise.resolve(finalBill);    
}
async function orderConfirm(totalBill)
{
    
}
async function orderTrack(orderIDfromWatson,estimatedTime)
{   
    let orderNumber = orderIDfromWatson;
    let et = estimatedTime;
    filecheck=fs.readFileSync('database.json');
    filecheck = JSON.parse(filecheck.toString());
    catchreturn = (filecheck.filter(
        function(filecheck){ 
            if(filecheck.OrderID == orderNumber)
                {   
                    return filecheck;
                }
            }
    ));
    var hrCheck = parseInt(catchreturn[0].orderPlacehr);
    var minCheck = parseInt(catchreturn[0].orderPlacemin);
    var newtime = null;
    minCheck = minCheck + et;
    if(minCheck >= 60){
        minCheck = minCheck - 60;
        hrCheck = hrCheck + 1;
    }
    if(minCheck == 0 || minCheck == 1 || minCheck == 2 || minCheck == 3 || minCheck == 4 || minCheck == 5 ||minCheck == 6 ||minCheck == 7 || minCheck == 8 || minCheck == 9){
        minCheck = "0" + minCheck.toString();
    }
    newtime = "Your order should be delivered at approximately " + hrCheck.toString() + ":" + minCheck.toString() + ", please wait patiently, Thank you.";
    return Promise.resolve(newtime);

}

app.post('/',async (request,response) => {
    const data = request.body;
    if(request.body.mainIntent == "trackOrder")
    {
        let orderTrackingDetails = await orderTrack(data.orderID,25);
        console.log(orderTrackingDetails);
        response.send({orderTrackingDetails});
    }
    if(request.body.mainIntent == "RestaurantCheck")
    {
        let restaurantCheckDetails = await restaurantCheck(data.location);
        response.send({restaurantCheckDetails});

    }
    if(request.body.mainIntent == "OrderMenu")
    {   console.log("this is in function this is rest");
        console.log(data.OrderMenu);
        let menuResponse = await restaurantMenu(data.OrderMenu);
        response.send({menuResponse});    
    }
    
    // data.orderPlacehr = currenthr;
    // data.orderPlacemin = currentmin;
    // data.bill = totalBill;
    // console.log(data);
    // json.push(data);
    // fs.writeFile('database.json', JSON.stringify(json), function (err) {
    //         if (err) throw err;
    //         console.log('Saved!');
    //       });
    // response.json({
    //     status: 'success',
    //     data: data,
    // })
})
// async function main()
// {
//     // var UserResult = await restaurantCheck('400058');
//     // await restaurantMenu(UserResult);
//     // await orderPlace('lol');
//     console.log(request.body);
//     if(params == "trackOrder")
//     {
//         await orderTrack(orderID,25);
//     }

// }
// main();
app.listen(3000, () => console.log('listening at 3000'));
