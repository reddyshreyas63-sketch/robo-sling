const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 650;


// ============================================================
// WORLD
// ============================================================

const WORLD = {
    width: 1200,
    height: 650,
    groundY: 500
};

const GRAVITY = 850;
const POWER = 7.2;
const MAX_PULL = 145;

let score = 0;
let shots = 5;
let dragging = false;
let gameEnded = false;

let lastTime = performance.now();


// ============================================================
// SLINGSHOT
// ============================================================

const sling = {
    x: 190,
    y: 405
};


// ============================================================
// ROBOT
// ============================================================

const robot = {
    x: sling.x,
    y: sling.y,

    radius: 27,

    vx: 0,
    vy: 0,

    rotation: 0,
    rotationSpeed: 0,

    flying: false
};


// ============================================================
// TARGETS
// ============================================================

let targets = [];

function createTargets() {

    targets = [

        {
            x: 850,
            y: 445,
            radius: 32,
            vx: 0,
            vy: 0,
            alive: true
        },

        {
            x: 950,
            y: 445,
            radius: 32,
            vx: 0,
            vy: 0,
            alive: true
        },

        {
            x: 900,
            y: 375,
            radius: 32,
            vx: 0,
            vy: 0,
            alive: true
        }

    ];
}

createTargets();


// ============================================================
// WOODEN STRUCTURES
// ============================================================

let blocks = [];

function createBlocks() {

    blocks = [

        {
            x: 850,
            y: 485,
            width: 170,
            height: 25,
            alive: true
        },

        {
            x: 850,
            y: 425,
            width: 25,
            height: 100,
            alive: true
        },

        {
            x: 950,
            y: 425,
            width: 25,
            height: 100,
            alive: true
        },

        {
            x: 900,
            y: 320,
            width: 170,
            height: 25,
            alive: true
        }

    ];
}

createBlocks();


// ============================================================
// BACKGROUND
// ============================================================

function drawBackground() {

    // Sky gradient
    const sky = ctx.createLinearGradient(
        0,
        0,
        0,
        WORLD.groundY
    );

    sky.addColorStop(0, "#4DA9E8");
    sky.addColorStop(0.65, "#9DDDF7");
    sky.addColorStop(1, "#DDF5FF");

    ctx.fillStyle = sky;

    ctx.fillRect(
        0,
        0,
        WORLD.width,
        WORLD.groundY
    );


    // Sun

    const sun = ctx.createRadialGradient(
        1000,
        100,
        10,
        1000,
        100,
        100
    );

    sun.addColorStop(0, "#FFF8B0");
    sun.addColorStop(1, "rgba(255,248,176,0)");

    ctx.fillStyle = sun;

    ctx.fillRect(
        900,
        0,
        200,
        200
    );


    // Clouds

    drawCloud(260, 110, 1.0);
    drawCloud(600, 150, 0.8);
    drawCloud(920, 210, 0.7);


    // Mountains

    ctx.fillStyle = "#7198A5";

    ctx.beginPath();

    ctx.moveTo(0, 410);
    ctx.lineTo(160, 250);
    ctx.lineTo(290, 410);
    ctx.lineTo(440, 220);
    ctx.lineTo(610, 410);
    ctx.lineTo(760, 260);
    ctx.lineTo(940, 410);
    ctx.lineTo(1080, 230);
    ctx.lineTo(1200, 410);

    ctx.closePath();

    ctx.fill();


    // Mountain snow

    ctx.fillStyle = "rgba(255,255,255,0.65)";

    drawSnowMountain(440, 220, 360);
    drawSnowMountain(1080, 230, 250);


    // Far grass

    ctx.fillStyle = "#5B9B38";

    ctx.fillRect(
        0,
        405,
        WORLD.width,
        100
    );


    // Ground

    const ground = ctx.createLinearGradient(
        0,
        WORLD.groundY,
        0,
        WORLD.height
    );

    ground.addColorStop(0, "#79B83F");
    ground.addColorStop(1, "#3E7D28");

    ctx.fillStyle = ground;

    ctx.fillRect(
        0,
        WORLD.groundY,
        WORLD.width,
        WORLD.height - WORLD.groundY
    );


    // Ground line

    ctx.fillStyle = "#315D20";

    ctx.fillRect(
        0,
        WORLD.groundY,
        WORLD.width,
        8
    );
}


function drawCloud(x, y, scale) {

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.fillStyle = "rgba(255,255,255,0.8)";

    ctx.beginPath();

    ctx.arc(0, 15, 28, 0, Math.PI * 2);
    ctx.arc(30, 5, 38, 0, Math.PI * 2);
    ctx.arc(70, 18, 25, 0, Math.PI * 2);

    ctx.fill();

    ctx.restore();
}


function drawSnowMountain(x, y, size) {

    ctx.beginPath();

    ctx.moveTo(x, y);
    ctx.lineTo(
        x - size * 0.22,
        y + size * 0.32
    );

    ctx.lineTo(
        x,
        y + size * 0.18
    );

    ctx.lineTo(
        x + size * 0.22,
        y + size * 0.32
    );

    ctx.closePath();

    ctx.fill();
}


// ============================================================
// SLINGSHOT
// ============================================================

function drawSlingshot() {

    // Shadow

    ctx.fillStyle = "rgba(0,0,0,0.2)";

    ctx.beginPath();

    ctx.ellipse(
        sling.x,
        WORLD.groundY + 5,
        70,
        12,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Wooden arms

    ctx.strokeStyle = "#5A2E13";
    ctx.lineWidth = 22;
    ctx.lineCap = "round";

    ctx.beginPath();

    ctx.moveTo(
        sling.x,
        475
    );

    ctx.lineTo(
        sling.x - 5,
        375
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        sling.x - 5,
        375
    );

    ctx.lineTo(
        sling.x - 48,
        325
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        sling.x - 5,
        375
    );

    ctx.lineTo(
        sling.x + 38,
        325
    );

    ctx.stroke();


    // Highlights

    ctx.strokeStyle = "#A65A2A";
    ctx.lineWidth = 7;

    ctx.beginPath();

    ctx.moveTo(
        sling.x - 6,
        470
    );

    ctx.lineTo(
        sling.x - 10,
        380
    );

    ctx.stroke();


    // Rubber bands

    ctx.strokeStyle = "#282828";
    ctx.lineWidth = 6;

    ctx.beginPath();

    ctx.moveTo(
        sling.x - 48,
        325
    );

    ctx.lineTo(
        robot.x,
        robot.y
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        sling.x + 38,
        325
    );

    ctx.lineTo(
        robot.x,
        robot.y
    );

    ctx.stroke();
}


// ============================================================
// ROBOT
// ============================================================

function drawRobot() {

    ctx.save();

    ctx.translate(
        robot.x,
        robot.y
    );

    ctx.rotate(
        robot.rotation
    );


    // Shadow

    if (!robot.flying) {

        ctx.fillStyle =
            "rgba(0,0,0,0.25)";

        ctx.beginPath();

        ctx.ellipse(
            0,
            34,
            28,
            8,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    // Body gradient

    const body =
        ctx.createLinearGradient(
            -25,
            -25,
            25,
            25
        );

    body.addColorStop(
        0,
        "#D9E2EA"
    );

    body.addColorStop(
        0.5,
        "#788999"
    );

    body.addColorStop(
        1,
        "#3E4C59"
    );

    ctx.fillStyle = body;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        robot.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Outer ring

    ctx.strokeStyle = "#26333D";
    ctx.lineWidth = 4;

    ctx.stroke();


    // Face panel

    ctx.fillStyle = "#1C2730";

    ctx.beginPath();

    ctx.roundRect(
        -19,
        -14,
        38,
        27,
        8
    );

    ctx.fill();


    // Eyes

    ctx.fillStyle = "#27E5FF";

    ctx.beginPath();

    ctx.arc(
        -8,
        -2,
        5,
        0,
        Math.PI * 2
    );

    ctx.arc(
        8,
        -2,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Antenna

    ctx.strokeStyle = "#26333D";
    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        0,
        -26
    );

    ctx.lineTo(
        0,
        -40
    );

    ctx.stroke();


    ctx.fillStyle = "#FFD43B";

    ctx.beginPath();

    ctx.arc(
        0,
        -43,
        6,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Small side bolts

    ctx.fillStyle = "#B8C4CE";

    ctx.beginPath();

    ctx.arc(
        -24,
        10,
        4,
        0,
        Math.PI * 2
    );

    ctx.arc(
        24,
        10,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.restore();
}


// ============================================================
// TARGET
// ============================================================

function drawTarget(target) {

    if (!target.alive) return;

    ctx.save();

    ctx.translate(
        target.x,
        target.y
    );


    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.25)";

    ctx.beginPath();

    ctx.ellipse(
        0,
        35,
        28,
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Body

    const gradient =
        ctx.createRadialGradient(
            -10,
            -10,
            5,
            0,
            0,
            35
        );

    gradient.addColorStop(
        0,
        "#FF7777"
    );

    gradient.addColorStop(
        1,
        "#B51F2A"
    );

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        target.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle = "#7D1720";
    ctx.lineWidth = 4;

    ctx.stroke();


    // Eyes

    ctx.fillStyle = "white";

    ctx.beginPath();

    ctx.arc(
        -10,
        -7,
        7,
        0,
        Math.PI * 2
    );

    ctx.arc(
        10,
        -7,
        7,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillStyle = "#222";

    ctx.beginPath();

    ctx.arc(
        -10,
        -7,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        10,
        -7,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Angry eyebrows

    ctx.strokeStyle = "#351313";
    ctx.lineWidth = 5;

    ctx.beginPath();

    ctx.moveTo(-20, -16);
    ctx.lineTo(-5, -11);

    ctx.moveTo(20, -16);
    ctx.lineTo(5, -11);

    ctx.stroke();


    // Mouth

    ctx.strokeStyle = "#351313";
    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.arc(
        0,
        10,
        10,
        0,
        Math.PI
    );

    ctx.stroke();


    ctx.restore();
}


// ============================================================
// BLOCKS
// ============================================================

function drawBlock(block) {

    if (!block.alive) return;

    ctx.save();

    ctx.translate(
        block.x,
        block.y
    );

    // Shadow

    ctx.fillStyle =
        "rgba(0,0,0,0.2)";

    ctx.fillRect(
        -block.width / 2 + 6,
        -block.height / 2 + 8,
        block.width,
        block.height
    );


    // Wood

    const wood =
        ctx.createLinearGradient(
            0,
            -block.height / 2,
            0,
            block.height / 2
        );

    wood.addColorStop(
        0,
        "#D99A52"
    );

    wood.addColorStop(
        1,
        "#8B5425"
    );

    ctx.fillStyle = wood;

    ctx.fillRect(
        -block.width / 2,
        -block.height / 2,
        block.width,
        block.height
    );


    // Border

    ctx.strokeStyle = "#633A18";
    ctx.lineWidth = 4;

    ctx.strokeRect(
        -block.width / 2,
        -block.height / 2,
        block.width,
        block.height
    );


    // Wood grain

    ctx.strokeStyle =
        "rgba(80,40,10,0.35)";

    ctx.lineWidth = 2;

    for (
        let y = -block.height / 2 + 8;
        y < block.height / 2;
        y += 9
    ) {

        ctx.beginPath();

        ctx.moveTo(
            -block.width / 2 + 5,
            y
        );

        ctx.lineTo(
            block.width / 2 - 5,
            y
        );

        ctx.stroke();
    }


    ctx.restore();
}


// ============================================================
// TRAJECTORY PREVIEW
// ============================================================

function drawTrajectory() {

    if (!dragging) return;


    let vx =
        (sling.x - robot.x)
        * POWER;

    let vy =
        (sling.y - robot.y)
        * POWER;


    let x = robot.x;
    let y = robot.y;


    ctx.fillStyle =
        "rgba(255,255,255,0.8)";


    for (
        let i = 0;
        i < 45;
        i++
    ) {

        x += vx * 0.08;
        y += vy * 0.08;

        vy += GRAVITY * 0.08;


        if (
            y > WORLD.groundY
        ) {
            break;
        }


        if (i % 3 === 0) {

            ctx.beginPath();

            ctx.arc(
                x,
                y,
                4,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }
    }
}


// ============================================================
// MOUSE POSITION
// ============================================================

function mousePosition(event) {

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            (event.clientX - rect.left)
            * WORLD.width
            / rect.width,

        y:
            (event.clientY - rect.top)
            * WORLD.height
            / rect.height
    };
}


// ============================================================
// DRAG START
// ============================================================

canvas.addEventListener(
    "mousedown",
    event => {

        if (
            robot.flying ||
            shots <= 0 ||
            gameEnded
        ) {
            return;
        }


        const mouse =
            mousePosition(event);


        const dx =
            mouse.x - robot.x;

        const dy =
            mouse.y - robot.y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance < 65) {

            dragging = true;
        }
    }
);


// ============================================================
// DRAG
// ============================================================

canvas.addEventListener(
    "mousemove",
    event => {

        if (!dragging) return;


        const mouse =
            mousePosition(event);


        let dx =
            mouse.x - sling.x;

        let dy =
            mouse.y - sling.y;


        // Force robot to remain behind sling

        if (dx > 0) {
            dx = 0;
        }


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        if (distance > MAX_PULL) {

            dx =
                dx / distance *
                MAX_PULL;

            dy =
                dy / distance *
                MAX_PULL;
        }


        robot.x =
            sling.x + dx;

        robot.y =
            sling.y + dy;
    }
);


// ============================================================
// RELEASE
// ============================================================

canvas.addEventListener(
    "mouseup",
    () => {

        if (!dragging) return;


        dragging = false;


        const dx =
            sling.x - robot.x;

        const dy =
            sling.y - robot.y;


        robot.vx =
            dx * POWER;

        robot.vy =
            dy * POWER;


        robot.rotationSpeed =
            robot.vx * 0.006;


        robot.flying = true;


        shots--;

        document.getElementById(
            "shots"
        ).textContent = shots;
    }
);


// ============================================================
// COLLISION
// ============================================================

function checkTargetCollision(target) {

    const dx =
        robot.x - target.x;

    const dy =
        robot.y - target.y;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    return (
        distance <
        robot.radius +
        target.radius
    );
}


// ============================================================
// PHYSICS UPDATE
// ============================================================

function physics(dt) {

    if (!robot.flying) {
        return;
    }


    // Gravity

    robot.vy +=
        GRAVITY * dt;


    // Air resistance

    robot.vx *=
        Math.pow(0.999, dt * 60);


    robot.vy *=
        Math.pow(0.999, dt * 60);


    // Position

    robot.x +=
        robot.vx * dt;

    robot.y +=
        robot.vy * dt;


    // Rotation

    robot.rotation +=
        robot.rotationSpeed;


    // =========================
    // TARGET COLLISION
    // =========================

    for (const target of targets) {

        if (!target.alive) continue;


        if (
            checkTargetCollision(target)
        ) {

            const speed =
                Math.sqrt(
                    robot.vx * robot.vx +
                    robot.vy * robot.vy
                );


            if (speed > 150) {

                target.alive = false;

                score += 100;

                document.getElementById(
                    "score"
                ).textContent = score;
            }


            // Bounce

            robot.vx *= -0.45;
            robot.vy *= -0.45;
        }
    }


    // =========================
    // GROUND
    // =========================

    if (
        robot.y +
        robot.radius >=
        WORLD.groundY
    ) {

        robot.y =
            WORLD.groundY -
            robot.radius;


        robot.vy *= -0.42;

        robot.vx *= 0.72;


        if (
            Math.abs(robot.vy) < 80
        ) {

            robot.vy = 0;
        }


        if (
            Math.abs(robot.vx) < 25 &&
            Math.abs(robot.vy) < 25
        ) {

            resetRobot();
        }
    }


    // =========================
    // SCREEN LIMIT
    // =========================

    if (
        robot.x > WORLD.width + 100 ||
        robot.x < -100 ||
        robot.y > WORLD.height + 100
    ) {

        resetRobot();
    }
}


// ============================================================
// RESET ROBOT
// ============================================================

function resetRobot() {

    robot.x = sling.x;
    robot.y = sling.y;

    robot.vx = 0;
    robot.vy = 0;

    robot.rotation = 0;
    robot.rotationSpeed = 0;

    robot.flying = false;


    checkWin();
}


// ============================================================
// WIN CONDITION
// ============================================================

function checkWin() {

    const remaining =
        targets.filter(
            target => target.alive
        );


    if (remaining.length === 0) {

        gameEnded = true;

        document.getElementById(
            "message"
        ).textContent =
            "ALL TARGETS DESTROYED!";
    }


    else if (shots === 0) {

        document.getElementById(
            "message"
        ).textContent =
            "OUT OF SHOTS — RESET TO TRY AGAIN";
    }
}


// ============================================================
// RESET GAME
// ============================================================

document.getElementById(
    "resetBtn"
).addEventListener(
    "click",
    () => {

        score = 0;
        shots = 5;
        gameEnded = false;


        document.getElementById(
            "score"
        ).textContent = "0";


        document.getElementById(
            "shots"
        ).textContent = "5";


        document.getElementById(
            "message"
        ).textContent =
            "Pull the robot back and release!";


        createTargets();
        createBlocks();

        resetRobot();
    }
);


// ============================================================
// GAME LOOP
// ============================================================

function gameLoop(timestamp) {

    let dt =
        (timestamp - lastTime) / 1000;

    lastTime = timestamp;


    // Prevent huge physics jumps

    dt = Math.min(
        dt,
        0.033
    );


    physics(dt);


    // DRAW

    drawBackground();

    drawTrajectory();

    blocks.forEach(
        drawBlock
    );

    targets.forEach(
        drawTarget
    );

    drawSlingshot();

    drawRobot();


    requestAnimationFrame(
        gameLoop
    );
}


requestAnimationFrame(
    gameLoop
);