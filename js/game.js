
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
    return bunny
}

function addCard(){
        card = new newCard(tex)
        arrCardsHand.push(card);
        // Add it into the scene
        // app.stage.addChild(bunny);
        cards.addChild(card);
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
loader.add('card', 'img/card.png')
var arrCardsHand = [];
var arrCardsTable = [];
var tex = null

loader.load((loader, resources) => {
    tex = resources.card.texture
    for (let i = 0; i < 5; i++) {
        // Create our little bunny friend..
        console.log(resources);
        addCard();
    };
    arrSort(arrCardsHand);
});


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
const imageTexture = PIXI.Texture.from('img/card.png');

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
        addCard();
        arrSort(arrCardsHand);
    }
    else{
        arrCardsHand.pop().destroy();
        arrSort(arrCardsHand);
    }
}

function onDragStart(event)
{
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

    console.log(this.position, this.ax, this.ay)
    if (this.position.y > table.position.y+table.height/2 ||
        !(this.position.x > table.position.x-table.width/2 && 
        this.position.x < table.position.x+table.width/2) )
    {
        this.position.y = this.ay;
        this.position.x = this.ax;
    }
    else{
        socket.emit('my_event', {data: 'In Rect'});
        arrCardsTable.push(this);
        const index = arrCardsHand.indexOf(this);
        if (index > -1) {
            arrCardsHand.splice(index, 1);
        }
    }
    console.log(this.position, this.ax, this.ay)
    // set the interaction data to null
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
    this.isdown = true;
}

function onButtonUp() {
    this.isdown = false;
}

function onButtonOver() {
    this.isOver = true;
    this.parent.getChildAt(1).position.y = -this.parent.offsetUp;
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
