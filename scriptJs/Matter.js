// Créer un moteur Matter.js
var Engine = Matter.Engine,
Render = Matter.Render,
World = Matter.World,
Bodies = Matter.Bodies,
Body = Matter.Body;

var engine = Engine.create();

var goal_count_player_1 = 0;
var goal_count_player_2 = 0;

// Créer un rendu
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 1280,
        height: 720,
        wireframes: false,
        background: 'rgba(0, 0, 0, 0)'
    }
});

// Créer les objets
var ground = Bodies.rectangle(640, 600, 1280, 50, { isStatic: true, render: { fillStyle: '#FF0000' } });

var player1 = Bodies.rectangle(110, 400, 150, 30, {
    render: {sprite: {fillStyle: '#00FF00'}},});
    
var player2 = Bodies.rectangle(1170, 400, 150, 30, {
    render: {sprite: {fillStyle: '#00FF00'}},});

var walls = [
    Bodies.rectangle(1280, 475, 50, 200, { isStatic: true, render: { fillStyle: '#00FF00' } , label : "rectangle_green" }),

    Bodies.rectangle(0, 475, 50, 200, { isStatic: true, render: { fillStyle: '#00FFFF' }, label : "rectangle_blue_light"  }),

    Bodies.rectangle(75, 360, 150, 30, { isStatic: true, render: { fillStyle: '#0000FF' } }),

    Bodies.rectangle(1205, 360, 150, 30, { isStatic: true, render: { fillStyle: '#0000FF' } }),

    Bodies.rectangle(-50, 360, 100, 720, { isStatic: true, render: { fillStyle: '#FF0000' } }),

    Bodies.rectangle(1330, 360, 100, 720, { isStatic: true, render: { fillStyle: '#FF0000 ' } }),

    Bodies.rectangle(640, -50, 1280, 100, { isStatic: true, render: { fillStyle: '#FF0000' } }),

    Bodies.circle(640, 200, 50, { isStatic: false,render: {
        sprite: {
            texture: '/asset/pokeball.png',
            xScale: 0.1,
            yScale: 0.1,
        }
    }, label : "ball", restitution: 1, slop: 1 }),];

// Ajouter tous les objets au monde
World.add(engine.world, [ground, player1, player2, ...walls]);

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
        Body.applyForce(player1, { x: player1.position.x, y: player1.position.y }, { x: 0, y: -0.3 });
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
            if ((pair.bodyA === walls[j] && pair.bodyB === player1) || (pair.bodyB === walls[j] && pair.bodyA === player1)) {
                jumping = false;
                break;
            }
        }
        if ((pair.bodyA === ground && pair.bodyB === player1) || (pair.bodyB === ground && pair.bodyA === player1)) {
            jumping = false;
        }
    }
});

Matter.Events.on(engine, 'collisionEnd', function(event) {
    var pairs = event.pairs;
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        for (var j = 0; j < walls.length; j++) {
            if ((pair.bodyA === walls[j] && pair.bodyB === player1) || (pair.bodyB === walls[j] && pair.bodyA === player1)) {
                jumping = true;
                break;
            }
        }
        if ((pair.bodyA === ground && pair.bodyB === player1) || (pair.bodyB === ground && pair.bodyA === player1)) {
            jumping = true;
        }
    }
});

// Mettre à jour le mouvement horizontal
Matter.Events.on(engine, 'beforeUpdate', function(event) {
    Body.setVelocity(player1, { x: xSpeed, y: player1.velocity.y });
});

function goal_count() {
    var collisionDetected = false;
    // Vérifier chaque paire de collisions
    Matter.Events.on(engine, 'collisionStart', function (event) {
        var pairs = event.pairs;

        pairs.forEach(function (pair) {
            // Vérifier si la collision implique un cercle et un rectangle bleu
            if ((pair.bodyA.label === 'ball' && pair.bodyB.label === 'rectangle_blue_light') ||
                (pair.bodyA.label === 'rectangle_blue_light' && pair.bodyB.label === 'ball')) {
                goal_limit();

                // Mettre à jour la variable pour indiquer la détection de collision
                collisionDetected = true;
                // Afficher le résultat dans la console
                console.log('Le joueur 2 a marqué', collisionDetected);
                goal_count_player_2 = (goal_count_player_2 + 1)
                var scoreDisplay = document.getElementById("scoreDisplay");
                scoreDisplay.innerHTML = goal_count_player_1 +  "/" + goal_count_player_2;                // World.add(engine.world, [ground, player1, player2, ...walls]);
                console.log(goal_count_player_1,goal_count_player_2);
                console.log("aj uig" + scoreDisplay);
            }
            if ((pair.bodyA.label === 'ball' && pair.bodyB.label === 'rectangle_green') ||
                (pair.bodyA.label === 'rectangle_green' && pair.bodyB.label === 'ball')) {
                goal_limit();
                        
                // Mettre à jour la variable pour indiquer la détection de collision
                collisionDetected = true;
                // Afficher le résultat dans la console
                console.log('Le joueur 1 a marqué', collisionDetected);
                goal_count_player_1 = (goal_count_player_1 + 1)
                var scoreDisplay2 = document.getElementById("scoreDisplay");
                scoreDisplay2.innerHTML = goal_count_player_1 +  "/" + goal_count_player_2;
                // World.add(engine.world, [ground, player1, player2, ...walls]);
                console.log(goal_count_player_1,goal_count_player_2);
                console.log("aj uig" + scoreDisplay2);
            }
        });
    });
}

goal_count();

function goal_limit() {
    if ((goal_count_player_1 >= 9) ||( goal_count_player_2 >= 9) ){
        goal_count_player_1 = 0
        goal_count_player_2 = 0
    }
    return

}




