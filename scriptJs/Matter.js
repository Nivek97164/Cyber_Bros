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
        width: 1280,
        height: 720,
        wireframes: false,
    }
});

// Créer les objets
var ground = Bodies.rectangle(640, 600, 1280, 50, { isStatic: true, render: { fillStyle: ' #FF0000 ' } });
var circleA = Bodies.rectangle(110, 400, 150, 30, {
    render: {sprite: {fillStyle: ' #00FF00 '}},});
var circleB = Bodies.rectangle(1170, 400, 150, 30, {
    render: {sprite: {fillStyle: ' #00FF00 '}},});

var walls = [
    Bodies.rectangle(1280, 475, 50, 200, { isStatic: true, render: { fillStyle: ' #00FF00 ' } , label : "rectangle_green" }),

    Bodies.rectangle(0, 475, 50, 200, { isStatic: true, render: { fillStyle: ' #00FFFF ' }, label : "rectangle_blue_light"  }),

    Bodies.rectangle(75, 360, 150, 30, { isStatic: true, render: { fillStyle: ' #0000FF ' } }),

    Bodies.rectangle(1205, 360, 150, 30, { isStatic: true, render: { fillStyle: ' #0000FF ' } }),

    Bodies.rectangle(-50, 360, 100, 720, { isStatic: true, render: { fillStyle: ' #FF0000 ' } }),

    Bodies.rectangle(1330, 360, 100, 720, { isStatic: true, render: { fillStyle: ' #FF0000 ' } }),

    Bodies.rectangle(640, -50, 1280, 100, { isStatic: true, render: { fillStyle: ' #FF0000 ' } }),

    Bodies.circle(640, 200, 40, { isStatic: false, render: { texture: '/asset/pokeball.png', xScale: 0.1, yScale: 0.1, }, label : "ball" ,restitution: 1,
    slop: 1 }),
];

// Ajouter tous les objets au monde
World.add(engine.world, [ground, circleA, circleB, ...walls]);

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