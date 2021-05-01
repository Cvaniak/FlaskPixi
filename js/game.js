
namespace = '/test';
var socket = io(namespace);

socket.on('connect', function() {
    console.log("Connected");   
});

socket.on('my_response', function(msg, cb) {
    console.log("MyResponse");   
});

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}
PIXI.utils.sayHello(type)

window.PIXI = PIXI;
window.PIXI[ "default" ] = PIXI;

const app = new PIXI.Application({
    antialias: true,
    autoDensity: true,
    backgroundColor: 0x1099bb,
    resolution: devicePixelRatio,
});

document.body.appendChild(app.view);
const loader = new PIXI.Loader(); // you can also create your own if you want

function newCard(tex, arr, cont){
    const bunny1 = new PIXI.Sprite(tex);
    const bunny2 = new PIXI.Sprite(tex);
    const bunny = new PIXI.Container();
    bunny1.interactive = true;
    bunny2.interactive = false;
    // bunny2.alpha = 0;
    bunny.interactive = true;
    bunny1.buttonMode = true;
    console.log(bunny.width, bunny.scale, app.screen.width)
    bunny
    // events for drag start
    .on('mousedown', onDragStart)
    .on('touchstart', onDragStart)
    // // events for drag end
    .on('mouseup', onDragEnd)
    .on('mouseupoutside', onDragEnd)
    .on('touchend', onDragEnd)
    .on('touchendoutside', onDragEnd)
    .on('mousemove', onDragMove)
    .on('touchmove', onDragMove)
    bunny1
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);
    bunny.offsetUp = 40;
    // bunny.hitArea1 = new PIXI.Rectangle(-bunny.width/2, -bunny.height/2, bunny.width, bunny.height+bunny.offsetUp);
    bunny1.hitArea = new PIXI.Rectangle(-bunny1.width/2, -bunny1.height/2-bunny.offsetUp/2, bunny1.width, bunny1.height+bunny.offsetUp/2);
    bunny2.scale.set(2);
    bunny2.anchor.set(0.5);
    bunny1.alpha = 0;
    bunny1.scale.set(2);
    bunny1.anchor.set(0.5);
    bunny.addChild(bunny1);
    bunny.addChild(bunny2);
    bunny.inHand = true;
    bunny.isDraged = false;
    var filter1 = new PIXI.filters.OutlineFilter();
    filter1.color = 0x000000;
    filter1.thickness = 3;
    
    var filter2 = new PIXI.filters.CRTFilter();
    filter2.time = 2;
    filter2.vignetting = 0.3;
    filter2.vignettingAlpha = 0.5
    filter2.noise = 0.2;
    filter2.noiseSize = 4.2;
    filter2.lineWidth = 1.2;
    filter2.lineContrast = 0.3;
    bunny2.filters = [filter1, filter2];
    return bunny
}

function addCard(){
        var tex = resourcesLoaded['card'+cardNumber].texture;
        card = new newCard(tex)
        arrCardsHand.push(card);
        // Add it into the scene
        // app.stage.addChild(bunny);
        cards.addChild(card);
}

function addCardToHand(){
        cardNumber = (cardNumber+1)%54;
        addCard();
        arrSort(arrCardsHand)
}

const allObjects = new PIXI.Container();
const cards = new PIXI.Container();
cards.sortableChildren  = true;
allObjects.sortableChildren  = true;
// app.sortableChildren = true;
allObjects.addChild(cards);
cards.zIndex = 3;
app.stage.addChild(allObjects);
// Chainable `add` to enqueue a resource
for(var i=1; i<14; i++){
    // loader.add('card'+i,      'img/SuitOfClubs/suitOfClubs(1x)'+i+'.png');
    
    // loader.add('card'+(13+i), 'img/SuitOfSpades/suitOfSpades(1x)'+i+'.png');
    // loader.add('card'+(26+i), 'img/SuitOfDiamonds/suitOfDiamonds(1x)'+i+'.png');
    // loader.add('card'+(39+i), 'img/SuitOfHearts/suitOfHearts(1x)'+i+'.png');
    loader.add('card'+i,      'https://dummyimage.com/33x49/C11/fff&text='+i+'.png');
    loader.add('card'+(13+i), 'https://dummyimage.com/33x49/1C1/fff&text='+i+'.png');
    loader.add('card'+(26+i), 'https://dummyimage.com/33x49/11C/fff&text='+i+'.png');
    loader.add('card'+(39+i), 'https://dummyimage.com/33x49/C1C/fff&text='+i+'.png');
}

var arrCardsHand = [];
var arrCardsTable = [];
var tex = null
var cardNumber = 0;
var resourcesLoaded = null;
var highestZIndex = 0;

loader.load((loader, resources) => {
    resourcesLoaded = resources;
    for (let i = 1; i <= 5; i++) {
        // var str = 'clubs'+i
        // tex = resourcesLoaded['clubs'+i].texture
        // Create our little bunny friend..
        console.log(resources);
        addCardToHand();
    };
});

function animate(){
    for(var i=0;i<arrCardsHand.length; i++)
    {
        arrCardsHand[i].getChildAt(1).filters[1].time += 0.4;     
    }
    for(var i=0;i<arrCardsTable.length; i++)
    {
        arrCardsTable[i].getChildAt(1).filters[1].time += 0.4;     
    }
}
app.ticker.add(animate);
var table = new PIXI.Graphics();

table.beginFill(0x1144CC);

// set the line style to have a width of 5 and set the color to red
table.lineStyle(5, 0x2277BB);

// draw a rectangle
// table.set(0.5);
table.drawRect(-200, -100, 400, 200);
table.x = app.screen.width / 2
table.y = app.screen.height*1 / 5;
table.zIndex = 1;


allObjects.addChild(table);


var graphics = new PIXI.Graphics();
graphics.beginFill(0xCC4444);
graphics.lineStyle(5, 0x2277BB);
graphics.drawRect(-20, -40, 40, 80);
graphics.interactive = true;
graphics.x = app.screen.width *1 / 8 
graphics.y = app.screen.height*1 / 5;
graphics.zz = -1;
graphics
    .on('mousedown', onAdd)
    .on('touchstart', onAdd)
allObjects.addChild(graphics);


var graphics = new PIXI.Graphics();
graphics.beginFill(0x44CC44);
graphics.lineStyle(5, 0x2277BB);
graphics.drawRect(-20, -40, 40, 80);
graphics.interactive = true;
graphics.x = app.screen.width *7 / 8 
graphics.y = app.screen.height*1 / 5;
graphics.zz = 1;
graphics
    .on('mousedown', onAdd)
    .on('touchstart', onAdd)
allObjects.addChild(graphics);

// Create a texture from an image path
// Make the whole scene interactive
app.stage.interactive = true;
// Make sure stage captures all events when interactive
app.stage.hitArea = app.renderer.screen;
// Handle clicks on the canvas
app.stage.on('click', onClick);
// Populate scene graph with bunnies

function arrSort(arr){
    // bunny.x = 1
    if (arr.length <= 0){
        return; 
    }
    maxT = arr[0].width + 10;
    minT = 20;
    wT = app.screen.width - arr[0].width*2;
    xT = wT/(arr.length);
    for (var i = 0; i < arr.length; i++)
    {
        
        arr[i].x = app.screen.width / 2 + ((arr.length-1)/2-i)*(xT);
        arr[i].y = app.screen.height*4 / 5;
        arr[i].zIndex = arr.length-i;
    
        arr[i].ax = arr[i].position.x;
        arr[i].ay = arr[i].position.y;
    }

}

function onAdd(event){
    console.log("Here")
    if (this.zz > 0)
    {
        addCardToHand();
    }
    else{
        if (arrCardsHand.length>0){
            cardNumber -= 1;
            arrCardsHand.pop().destroy();
            arrSort(arrCardsHand);
        }
    }
}

function onDragStart(event)
{   
    this.lastZIndex = this.zIndex;
    this.zIndex = 1111;
    this.position.y = this.position.y + this.getChildAt(1).position.y;
    this.getChildAt(1).position.y = 0;
    // this.ax = this.position.x;
    // this.ay = this.position.y;
    console.log(this.position, this.ax, this.ay)
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
}

function onDragEnd()
{
    this.alpha = 1;

    this.dragging = false;

    console.log(this)
    if (this.position.y > table.position.y+table.height/2 ||
        !(this.position.x > table.position.x-table.width/2 && 
        this.position.x < table.position.x+table.width/2) )
    {
        this.position.y = this.ay;
        this.position.x = this.ax;
        if (!this.inHand){
            arrCardsHand.push(this);
            const index = arrCardsTable.indexOf(this);
            if (index > -1) {
                arrCardsTable.splice(index, 1);
            }
            this.inHand = true;
        }
    }
    else{
        socket.emit('my_event', {data: 'In Rect'});
        arrCardsTable.push(this);
        const index = arrCardsHand.indexOf(this);
        if (index > -1) {
            arrCardsHand.splice(index, 1);
        }
        this.inHand = false;
    }
    console.log(this);
    // set the interaction data to null
    highestZIndex = Math.max(cardNumber, highestZIndex)+1;
    this.zIndex = highestZIndex;
    this.data = null;
    arrSort(arrCardsHand);
}

function onDragMove()
{
    if (this.dragging)
    {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.position.x = newPosition.x;
        this.position.y = newPosition.y;
    }
}

function onClick(e) {
    // if (selectedTarget) {
    //     selectedTarget.position.copyFrom(e.global);
    // }
}

function onButtonDown() {
}

function onButtonUp() {
}

function onButtonOver() {
    this.isOver = true;
    if (!this.parent.isDraged && this.parent.inHand){
        this.parent.getChildAt(1).position.y = -this.parent.offsetUp;
    }
    // this.ay-this.offsetUp;
    
    // this.getChildAt(0).position.y = 50;
    // t = this.hitArea
    // this.hitArea = this.hitArea1
    // this.hitArea1 = t
}

function onButtonOut() {
    this.isOver = false;
    this.parent.getChildAt(1).position.y = 0;
    // this.position.y = this.ay;
    // t = this.hitArea
    // this.hitArea = this.hitArea1
    // this.hitArea1 = t
}
