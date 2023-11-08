var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;

// Créer un moteur Matter.js
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body;

var engine = Engine.create();

// Créer un rendu
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: windowWidth,
        height: windowHeight,
        wireframes: false,
    }
});

// Créer les objets
var ground = Bodies.rectangle(windowWidth / 2, 600, windowWidth, 50, { isStatic: true, render: { fillStyle: ' #FF0000 ' } });
var circleA = Bodies.circle(55, 515, 52, {
    render: {
        sprite: {
            texture: '/asset/pokeball.png',
            xScale: 0.1,
            yScale: 0.1,
        }
    },
    // restitution: 0.5,
    slop: 0.5
});

// var numberWall = 0
// function addWall(x, y, l, h) {
//     var wallnumberWall = Bodies.rectangle(100, 100, 100, 100, { isStatic: true, render: { fillStyle: ' #00FF00 ' } }),
// }

// addWall(400, 420, 200, 100)

var walls = [
    Bodies.rectangle(600, 526, 200, 100, { isStatic: true, render: { fillStyle: ' #00FF00 ' } }),
    Bodies.rectangle(100, 350, 200, 30, { isStatic: true, render: { fillStyle: ' #0000FF ' } }),
    Bodies.rectangle(350, 200, 200, 30, { isStatic: false, render: { fillStyle: ' #FF00FF ' } }),
];

// Ajouter tous les objets au monde
World.add(engine.world, [ground, circleA, ...walls]);

// Exécuter le moteur
Engine.run(engine);

// Exécuter le rendu
Render.run(render);

// Ajouter la gestion de l'événement de saut
var jumping = false;
var moveSpeed = 8;
var xSpeed = 0;

document.body.addEventListener('keydown', function(event) {
    if (event.keyCode === 38 && !jumping) {
        Body.applyForce(circleA, { x: circleA.position.x, y: circleA.position.y }, { x: 0, y: -0.3 });
        jumping = true;
    } else if (event.keyCode === 37) {
        xSpeed = -moveSpeed;
    } else if (event.keyCode === 39) {
        xSpeed = moveSpeed;
    }
});

document.body.addEventListener('keyup', function(event) {
    if (event.keyCode === 37 || event.keyCode === 39) {
        xSpeed = 0;
    }
});

// Gérer les événements de collision
Matter.Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        for (var j = 0; j < walls.length; j++) {
            if ((pair.bodyA === walls[j] && pair.bodyB === circleA) || (pair.bodyB === walls[j] && pair.bodyA === circleA)) {
                jumping = false;
                break;
            }
        }
        if ((pair.bodyA === ground && pair.bodyB === circleA) || (pair.bodyB === ground && pair.bodyA === circleA)) {
            jumping = false;
        }
    }
});

Matter.Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        for (var j = 0; j < walls.length; j++) {
            if ((pair.bodyA === walls[j] && pair.bodyB === circleA) || (pair.bodyB === walls[j] && pair.bodyA === circleA)) {
                jumping = true;
                break;
            }
        }
        if ((pair.bodyA === ground && pair.bodyB === circleA) || (pair.bodyB === ground && pair.bodyA === circleA)) {
            jumping = true;
        }
    }
});

// Mettre à jour le mouvement horizontal
Matter.Events.on(engine, 'beforeUpdate', function(event) {
    Body.setVelocity(circleA, { x: xSpeed, y: circleA.velocity.y });
});