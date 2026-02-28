const canvas = document.getElementById("c");
if(!canvas) throw new Error();
const ctx = canvas.getContext("2d");
const param = new URLSearchParams(window.location.search);

// ---------- infinite ocean example ----------
// the idea here is to keep a world offset that moves when the
// "camera" (in this simple demo the player) moves.  the canvas is
// completely filled every frame by drawing a repeating tile at
// positions calculated with mod (%) arithmetic so that the pattern
// seamlessly wraps.  no matter how far you move, the ocean appears
// to be never-ending.

// make the canvas fill the screen
function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// we'll just use a solid-blue square as a "tile"; in a real game you
// would use an image and ctx.createPattern.
const TILE_SIZE = 128;
// world offset (can be fractional)
const world = { x: 0, y: 0 };
// money counter
let money = param.has("mode", "dev") ? 10000000 : 0;
let armExtenderCounter = 0;
let speedCounter = 0;
let damageCounter = 0;
let plasticValueCounter = 0;
let armSpeedCounter = 0;
let strengthCounter = 0;
let doom = 0;
let doomIV = null;
let upgradeCosts = {
    armExtender: 25,
    speed: 50,
    damage: 75,
    strength: 350,
    plasticValue: 200,
	armSpeed: 250
};
var gameState = 1;
window.addEventListener("keydown", (e) => {
    if(e.code == "Escape") gameState = gameState == 1 ? 0 : 1;
});
const moneyDisplay = document.getElementById("money-counter");
const armExtenderDisplay = document.getElementById("arm-extender-counter");
const speedDisplay = document.getElementById("speed-counter");
const damageDisplay = document.getElementById("damage-counter");
const strengthDisplay = document.getElementById("strength-counter");
const plasticValueDisplay = document.getElementById("plastic-value-counter");
const armSpeedDisplay = document.getElementById("arm-speed-counter");

const armextenderPrice=document.getElementById("arm-extender-price");
const speedPrice=document.getElementById("speed-price");
const damagePrice=document.getElementById("damage-price");
const strengthPrice=document.getElementById("strength-price");
const plasticValuePrice=document.getElementById("plastic-value-price");
const armSpeedPrice=document.getElementById("arm-speed-price");

const armExtenderButton = document.getElementById("arm-extender-button");
const speedButton = document.getElementById("speed-button");
const damageButton = document.getElementById("damage-button");
const strengthButton = document.getElementById("strength-button");
const plasticValueButton = document.getElementById("plastic-value-button");
const armSpeedButton = document.getElementById("arm-speed-button");
const progressBar = document.getElementById("progress-bar");
const healthBar = document.getElementById("health");


// plastic particles array
const plasticPieces = [];
// interval id for spawning plastic (guard against multiple intervals)
let plasticIntervalId = null;
var move = true;

// simple input state for WASD movement
const keys = {};
window.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
window.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
var rad = 0;
var arm = [0, 0];
var armState = 0;
// arm length in world pixels (0 when retracted)
var armLen = 0;
// maximum extension length
var armMax = 300;
// starting world position of the base of the arm when it was fired
var armSX = 0;
var armSY = 0;
var spd = 200;
// how many pieces the arm can hit before it must retract
var armStrength = 1;
// track boats hit during current shot to avoid multi-counting
var armHitSet = new Set();
var hp = 5;
const ARM_STRENGTH_DEFAULT = 1;
var dmg = 1;
var armSpd = 500;
var bonus = 0;
var bhp = 0;
var strength = 1;
var deathTime = 0;
var deathIV = null;
const img = (src) => {
    const out = new Image();
    out.src = `assets/${src}`;
    return out;
}
const aud = (src) => {
    return new Audio(`assets/${src}`);
}
const drone = img("drone.png");
const ship = img("boat.png");
const explod = img("explod.jpg");
const explodAud = aud("explode.mp3");
const swooshAud = aud("swoosh.wav");
const bgAud = aud("bg-music-epic.mp3");
bgAud.play();
bgAud.addEventListener("ended", () => bgAud.play());
var droneFace = 0;

class Boat {
    constructor(x, y, w, h) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.cd = false; this.hp = 3 + bhp;
        setInterval(() => {
            if(Math.floor(Math.random() * 101) <= 50) {
                this.cd = true;
            }
        }, 1000);
        this.face = 0;
        boats.push(this);
        this.iv = setInterval(trash, 3000);
        this.hurtCd = true;
        setInterval(() => this.hurtCd = true, 2000);
        this.expl = 0;
        this.explCd = null;
    }
    upd() {
        if(this.hp <= 0) {
            if(this.expl > 5) {
                clearInterval(this.explCd);
                boats.splice(boats.indexOf(this), 1);
            }
            return;
        }
        if(this.cd) {
            const o = Math.floor(Math.random() * 101);
            if(o <= 25) {
                this.x += 5;
                this.face = 1;
            }
            else if(o <= 50) {
                this.x -= 5;
                this.face = 1;
            }
            else if(o <= 75) {
                this.y += 5;
                this.face = 0;
            }
            else {
                this.y -= 5;
                this.face = 0;
            }
            this.cd = false;
        }
        const [cx, cy] = center();
        // player's top-left in world coordinates
        const playerWorldX = world.x + cx;
        const playerWorldY = world.y + cy;
        const w1 = this.w, h1 = this.h, x1 = this.x, y1 = this.y;
        const w2 = 25, h2 = 25, x2 = playerWorldX, y2 = playerWorldY;
        if(this.hurtCd && x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1) {
            hp--;
            if(hp <= 0) {
                move = false;
            }
            this.hurtCd = false;
            updateHealthBar();
        }
    }
    kill() {
        clearInterval(this.iv);
        money += 10;
        this.explCd = setInterval(() => this.expl++, 1000);
        explodAud.play();
    }
    hurt(n) {
        this.hp -= n;
        if(this.hp <= 0) this.kill();
		updateHealthBar();
    }
}
const boats = [];
const spawn = setInterval(spawnBoat, 10000);
setInterval(() => bhp++, 30000);

function plastic(){
	// ensure we only create one interval
	if (plasticIntervalId) return;
	// spawn new plastic every 5 seconds
	plasticIntervalId = setInterval(trash, 12000);
}
function summonAround() {
    const _ = () => Math.floor(Math.random() * 800) - 400;
    return [world.x + _(), world.y + _()];
}
function trash() {
    const [x, y] = summonAround();
    const v = Math.floor(Math.random() * 1000);
    let rv;
	let color;
    if(v <= 809) {
		rv = 3;
		color = "#ff0000";
	}
    else if(v <= 909){
		 rv = 6;
		 color = "#820707";
	}
    else if(v <= 969) {
		rv = 10;
		color = "#f55200";
	}
    else if(v <= 994) {
		rv = 15;
		color = "#2ece0a";
	}
    else if(v <= 999) {
		rv = 25;
		color = "#32600f";
	}
    else {
		rv = 100;
		color = "#917400";
	}
    plasticPieces.push({ x, y, w: 20, h: 20, value: rv+bonus, color });
	updateProgressBar();
}
function spawnBoat() {
    const [x, y] = summonAround();
    new Boat(x, y, 30, 60);
}

const upgradeInfo = {
    armExtender: { display: armExtenderDisplay, button: armExtenderButton },
    speed: { display: speedDisplay, button: speedButton },
    damage: { display: damageDisplay, button: damageButton },
    strength: { display: strengthDisplay, button: strengthButton },
    plasticValue: { display: plasticValueDisplay, button: plasticValueButton },
	armSpeed: { display: armSpeedDisplay, button: armSpeedButton }
};

function updateCounterDisplays() {
    armExtenderDisplay.textContent = armExtenderCounter;
    speedDisplay.textContent = speedCounter;
    damageDisplay.textContent = damageCounter;
    strengthDisplay.textContent = strengthCounter;
    plasticValueDisplay.textContent = plasticValueCounter;
    armSpeedDisplay.textContent = armSpeedCounter;

    armExtenderButton.textContent = `Buy: ${armExtenderCounter}`;
    speedButton.textContent = `Buy: ${speedCounter}`;
    damageButton.textContent = `Buy: ${damageCounter}`;
    strengthButton.textContent = `Buy: ${strengthCounter}`;
    plasticValueButton.textContent = `Buy: ${plasticValueCounter}`;
    armSpeedButton.textContent = `Buy: ${armSpeedCounter}`;
}

function updatePriceDisplays() {
    armextenderPrice.textContent = upgradeCosts.armExtender;
    speedPrice.textContent = upgradeCosts.speed;
    damagePrice.textContent = upgradeCosts.damage;
    strengthPrice.textContent = upgradeCosts.strength;
    plasticValuePrice.textContent = upgradeCosts.plasticValue;
    armSpeedPrice.textContent = upgradeCosts.armSpeed;
}

function updateProgressBar() {
    progressBar.value = plasticPieces.length * 0.1;	
}
function updateHealthBar() {
	healthBar.value = hp;
}

function upgrade(stat) {
    if (money >= upgradeCosts[stat]) {
        money -= upgradeCosts[stat];
        upgradeCosts[stat] = Math.floor(upgradeCosts[stat] * 1.5);
        
        if (stat === "armExtender") {
            armExtenderCounter++;
            armMax += 10;
        } else if (stat === "speed") {
            speedCounter++;
            spd += 20;
        } else if (stat === "damage") {
            damageCounter++;
            dmg++;
        } else if(stat == "strength") {
            strengthCounter++;
            armStrength++;
        } else if (stat === "plasticValue") {
            plasticValueCounter++;
            bonus++;
        } else if (stat === "armSpeed") {
            armSpeedCounter++;
            armSpd += 20;
        } else {
            console.error("Unknown stat:", stat);
            return;
        }
        
        moneyDisplay.textContent = Math.floor(money);
        updateCounterDisplays();
        updatePriceDisplays();
    }
}

function renderPlastic() {
	// draw all plastic pieces relative to camera
	for (const piece of plasticPieces) {
        ctx.fillStyle = piece.color;
		const screenX = piece.x - world.x;
		const screenY = piece.y - world.y;
		ctx.fillRect(screenX, screenY, piece.w, piece.h);
	}
}
function renderBoats() {
    boats.forEach(b => {
        const sx = b.x - world.x;
        const sy = b.y - world.y;
        const wh = b.face == 0 ? [b.w, b.h] : [b.h, b.w];
        if(b.hp > 0) ctx.drawImage(ship, sx, sy, wh[0], wh[1]);
        else ctx.drawImage(explod, sx, sy, wh[0], wh[1]);
    });
}

const binds = {
    w: () => keys.w || keys.arrowup, a: () => keys.a || keys.arrowleft,
    s: () => keys.s || keys.arrowleft, d: () => keys.d || keys.arrowright
};
function update(dt) {
    if(!gameState) return;
    updateProgressBar();
    if(progressBar.value == "100") {
        if(!doomIV) doomIV = setInterval(() => doom++, 1000);
        progressBar.style.color = "red";
        if(doom >= 10) {
            window.location.href = "lose.html";
        }
    } else {
        if(doomIV) clearInterval(doomIV);
        progressBar.style.color = "inital";
    }
	if(move) {
        const W = binds.w();
        const A = binds.a();
        const S = binds.s();
        const D = binds.d();
        if(W) world.y -= spd * dt;
	    if(A) world.x -= spd * dt;
        if(S) world.y += spd * dt;
	    if(D) world.x += spd * dt;
        
        if(W) droneFace = 0;
        if(A) droneFace = 3;
        if(S) droneFace = 2;
        if(D) droneFace = 1;

        // WA, WD, AS, SD
        if(W && A) droneFace = 4;
        if(W && D) droneFace = 5;
        if(A && S) droneFace = 6;
        if(S && D) droneFace = 7;
        
        if(keys[" "]) {
			// begin a pull action only if idle
			if (armState == 0) {
				move = false;                          // pause movement while arm is active
                swooshAud.play();
				const [cx, cy] = center();
				const playerWorldX = world.x + cx;
				const playerWorldY = world.y + cy;
				const playerW = 25;
				const playerH = 25;

				// record base position and reset length
				armSX = playerWorldX + playerW / 2;
				armSY = playerWorldY + playerH / 2;
				armLen = 0;
                // set strength when firing (base default + any strength upgrades)
                armStrength = ARM_STRENGTH_DEFAULT + strengthCounter;
                armHitSet.clear();
                armState = 1;   // start extending
			}
			// once the arm has been shot, don't re-trigger until it returns
		}
    }
    // increment money slowly as you move
	//money += dt * 10;
	moneyDisplay.textContent = Math.floor(money);

    const hits = [];
	// ---- arm logic ------------------------------------------------
	if (armState != 0) {
		// direction unit vector pointing toward current mouse angle
		const fvec = [Math.cos(rad), Math.sin(rad)];
		if (armState == 1) { // extending
			armLen += armSpd * dt;
			if (armLen >= armMax) {
				armLen = armMax;
				armState = -1; // reach full extension, start retracting
			}
		} else if (armState == -1) { // retracting
			armLen -= armSpd * dt;
			if (armLen <= 0) {
				armLen = 0;
                armState = 0; // back to idle
                armHitSet.clear();
                setTimeout(() => move = true, 300); // restore movement after full pull
			}
		}
		arm[0] = armSX + fvec[0] * armLen;
		arm[1] = armSY + fvec[1] * armLen;

        // check for collision with plastic or boats while arm is extended
        if (armState == 1) {
            const idx = plasticPieces.findIndex(p => {
                // simple point-in-rect test
                return arm[0] >= p.x && arm[0] <= p.x + p.w &&
                       arm[1] >= p.y && arm[1] <= p.y + p.h;
            });
            if (idx != -1) {
                const p = plasticPieces.splice(idx, 1);
                money += p[0].value;
                updateProgressBar();
                // decrement strength; only retract when strength is exhausted
                armStrength -= 1;
                if (armStrength <= 0) {
                    armState = -1; // start retracting
                }
            }

            const b = boats.find(b => {
                return arm[0] >= b.x && arm[0] <= b.x + b.w &&
                    arm[1] >= b.y && arm[1] <= b.y + b.h;
            });
            if (b && b.hp > 0) {
                // apply at most one hit per boat per shot
                if (!armHitSet.has(b)) {
                    armHitSet.add(b);
                    b.hurt(dmg);
                    armStrength -= 1;
                    if (armStrength <= 0) armState = -1;
                }
            }
        }
    }
    boats.forEach(b => b.upd());
}
function center() {
    return [canvas.width / 2, canvas.height / 2];
}

function render() {
    if(!gameState) return;
	// draw blue background for ocean
	ctx.fillStyle = "#006";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	const cols = Math.ceil(canvas.width  / TILE_SIZE) + 1;
    const rows = Math.ceil(canvas.height / TILE_SIZE) + 1;

    // world offset within a tile – make it positive so modulo works for negatives
    const offsetX = ((world.x % TILE_SIZE) + TILE_SIZE) % TILE_SIZE;
    const offsetY = ((world.y % TILE_SIZE) + TILE_SIZE) % TILE_SIZE;

	ctx.fillStyle = "#08f"; // lighter blue for tile pattern
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const x = c * TILE_SIZE - offsetX;
			const y = r * TILE_SIZE - offsetY;
			ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
		}
	}
    renderBoats();
	// draw plastic pieces
	renderPlastic();
    ctx.fillStyle = "#515151";
    const s = 25;
    const s2 = s/2;
    const [cx, cy] = center();
    if(hp > 0) {
        ctx.save();
        ctx.translate(cx + s2, cy + s2);
        ctx.rotate({ 0: 0, 1: 90, 2: 180, 3: 270, 4: 315, 5: 45, 6: 225, 7: 135 }[droneFace] * Math.PI / 180);
        ctx.drawImage(drone, -s2, -s2, s, s);
        ctx.restore();
        // ctx.save();
        // ctx.translate(cx + s/2, cy + s/2);
        // ctx.rotate(rad);
        // ctx.fillStyle = "red";
        // ctx.fillRect(-s / 2, -s / 2, 50, 15);
        // ctx.restore();
        // draw arm when active
        if(armState != 0) {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 4;
            ctx.beginPath();
            // start at player center in screen coordinates
            ctx.moveTo(cx + s2, cy + s2);
            const sx = arm[0] - world.x;
            const sy = arm[1] - world.y;
            ctx.lineTo(sx, sy);
            ctx.stroke();
            // optionally draw tip
            ctx.fillStyle = "yellow";
            ctx.beginPath();
            ctx.arc(sx, sy, 6, 0, Math.PI*2);
            ctx.fill();
        }
    } else {
        ctx.drawImage(explod, cx, cy, s * 2, s * 2);
        if(!explodAud.paused) explodAud.play();
        if(!deathIV) setInterval(() => deathTime++, 1000);
        if(deathTime > 5) {
            clearInterval(deathIV);
            window.location.href = "lose.html";
        }
    }
}
document.addEventListener("mousemove", (e) => {
    if(armState != 0) return;
    const bounds = canvas.getBoundingClientRect();
    const cx = bounds.left + bounds.width / 2;
    const cy = bounds.top + bounds.height / 2;
    const mx = e.clientX;
    const my = e.clientY;
    rad = Math.atan2(my - cy, mx - cx);
});

let last = performance.now();
function loop(time) {
	const dt = (time - last) / 1000;
	last = time;
	update(dt);
	render();
	requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
armExtenderButton.addEventListener("click", () => upgrade("armExtender"));
speedButton.addEventListener("click", () => upgrade("speed"));
damageButton.addEventListener("click", () => upgrade("damage"));
strengthButton.addEventListener("click", () => upgrade("strength"));
plasticValueButton.addEventListener("click", () => upgrade("plasticValue"));
armSpeedButton.addEventListener("click", () => upgrade("armSpeed"));
// start the plastic spawner once
plastic();

// ------------------------------------------------