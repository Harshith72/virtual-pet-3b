//Create variables here
var dog,dogImg;
var happyDog,sadDog;
var database;
var foodS;
var foodStock;
var fedTime;
var lastFed;
var foodObj;
var changeState,readState;
var bedroomImg,gardenImg,washroomImg;
var gameState;

function preload()
{
  //load images here
  dogImg = loadImage("images/Dog.png");
  happyDog = loadImage("images/happy dog.png");
  gardenImg = loadImage("images/gg.png");
  bedroomImg = loadImage("images/bed.png");
  washroomImg = loadImage("images/washroom.png")
  sadDog = loadImage("images/Lazy.png")
}

function setup() {
	createCanvas(1000, 1000);
  
  database=firebase.database();

  readState = database.ref('gameState');
   readState.on("value", function (data) {
      readState = data.val();
  });

  dog = createSprite(800,550,10,10);
  dog.addImage(dogImg);
  dog.scale = 0.4;

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  feed = createButton("Feed the dog");
  feed.position(400,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(400,125);
  addFood.mousePressed(addFoods);

   if (gameState == "sleeping"){
    bedroom();
    feed.show();
    addFood.show();
    dog.remove(); 
  }
  else if (gameState == "hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog); 
  }

}


function draw() {  
  background(46,139,87);

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  //add styles here
  textSize(25);
  fill("white");
  stroke("red");
  if(lastFed>=12){
    text("last Fed:" + lastFed%12 + "PM",200,30);
  }
  if(lastFed==0){
    text("last Fed: 12 AM",350,30);
  }
  else{
    text("last Fed:" + lastFed + "AM",200,30)
  }
  currentTime = hour();
 if(currentTime == (lastFed+1)){
    update("playing");
    garden();
    dog.remove();
  }
  else if(currentTime == (lastFed+2)){
    update("sleeping");
    bedroom();
    dog.remove();
  }
  else if(currentTime >= (lastFed+2) && currentTime <=(lastFed+4)){
    update("bathing");
    dog.remove();
  }
  else{
    update("hungry")
    foodObj.display();
  }
  

  drawSprites();

}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}
function addFoods(){
  foodS++;
  dog.addImage(dogImg);
  background(46,139,87);
  database.ref('/').update({
    Food:foodS
  });
}
  
  function showError() {
    console.log("Error in writing to the database");
}
function feedDog(){
  dog.addImage(happyDog);
  background(46,139,87);
  foodS--;
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}

function bedroom(){
  background(bedroomImg,550,500)
}

function garden(){
  background(gardenImg,550,500)
}

function washroom(){
  background(washroomImg,550,500)
}