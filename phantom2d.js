import { expect, findMissing, random, is, wait, getRemoteImg, getRemoteAudio, download, downloadJSON } from "/phantom.js";

// Phantom2D v0.0.7
/**
 * The root class for all Phantom2D entities.
 * @class
*/
class Phantom2DEntity {
  /**
   * An event cache.
   * @prop
   * @type {Map<string, function>}
   */
  #events;
  /**
   * A number to track lerp progress.
   * @prop
   * @type {number}
   */
  #lerpProgress;
  /**
   * The Phantom2DEntity constructor.
   * @param {string[]} expects - Keys that are required within settings.
   * @param {string} objname - The name of the constructing class.
   * @param {{ id: string, shape: string, color: string, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity.
   */
  constructor(expects, objname, settings) {
    // id, shape and color are all base properties
    const base = ["id", "shape", "color"];
    if(!expect(settings, [...base, ...expects])) throw new Error(`Missing keys(s) in ${objname} settings. (missing: ${findMissing(settings, [...base, ...expects]).join(", ")})`);
    /**
     * The unique name of this object.
     * @prop
     * @type {string}
     */
    this.id = settings.id;
    /**
     * The shape to be displayed.
     * @prop
     * @type {string}
     */
    this.shape = settings.shape;
    /**
     * The colour of this object.
     * @prop
     * @type {string}
     */
    this.color = settings.color;
    /**
     * The function to be ran when this object collides with another.
     * @prop
     * @type {function}
     */
    this.collide = settings.collide ?? (() => {});
    /**
     * The x-coordinate of this object.
     * @prop
     * @type {number}
     */
    this.x = settings.x ?? 0;
    /**
     * The y-coordinate of this object.
     * @prop
     * @type {number}
     */
    this.y = settings.y ?? 0;
    /**
     * The rotation of this object, in radians.
     * @prop
     * @type {number}
     */
    this.rot = settings.rot ?? 0;
    /**
     * The displayed width of this object.
     * @prop
     * @type {number}
     */
    this.width = settings.width ?? 0;
    /**
     * The displayed height of this object.
     * @prop
     * @type {number}
     */
    this.height = settings.height ?? 0;
    if(settings.custom) {
      for(const [key, value] of Object.entries(settings.custom)) {
        this[key] = value;
      }
    }
    this.#events = {};
    this.#lerpProgress = 0;
  }
  /**
   * A utility function to set the position.
   * @param {number} x - The x-coordinate to set to. 
   * @param {number} y - The y-coordinate to set to.
   */
  setPos(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * A utility function to set the rotation.
   * @param {number} rad - The radian rotation to set to.
   */
  setRot(rad) {
    this.rot = rad;
  }
  /**
   * A utility function to set the width.
   * @param {number} width - The width to set to.
   */
  setWidth(width) {
    this.width = width;
  }
  /**
   * A utility function to set the height.
   * @param {number} height - The height to set to.
   */
  setHeight(height) {
    this.height = height;
  }
  /**
   * A function that returns the forward facing vector relative to the entity.
   * @returns {{ dx: number, dy: number }} The forward facing vector.
   */
  getForwardVector() {
    const dx = Math.cos(this.rot);
    const dy = Math.sin(this.rot);
    return { dx, dy };
  }
  /**
   * A function that moves itself on the axis provided of the distance provided.
   * @param {number} distance - The distance to be moved.
   * @param {string|number} axis - The axis to move on.
   */
  move(distance, axis) {
    if(axis == "x" || axis == 0) {
      this.x += distance;
    }
    else if(axis == "y" || axis == 1) {
      this.y += distance;
    }
  }
  /**
   * A function that moves itself on the x-axis.
   * @param {number} distance - The distance to be moved.
   */
  moveX(distance) {
    this.x += distance;
  }
  /**
   * A function that moves itself on the y-axis.
   * @param {number} distance - The distance to be moved.
   */
  moveY(distance) {
    this.y += distance;
  }
  /**
   * A function to clamp the current position on a certain axis.
   * @param {number} min - The minimum possible value.
   * @param {number} max - The maximum possible value.
   * @param {number} axis - The axis to clamp.
   */
  clampPos(min, max, axis) {
    if(axis == "x" || axis == 0) this.x = Math.min(Math.max(this.x, min), max);
    else if(axis == "y" || axis == 1) this.y = Math.min(Math.max(this.y, min), max);
  }
  /**
   * A function to clamp the current x position.
   * @param {number} min - The minimum possible value.
   * @param {number} max - The maximum possible value.
   */
  clampPosX(min, max) {
    this.x = Math.min(Math.max(this.x, min), max);
  }
  /**
   * A function to the clamp the current y position.
   * @param {number} min - The minimum possible value.
   * @param {number} max - The maxmium possible value.
   */
  clampPosY(min, max) {
    this.y = Math.min(Math.max(this.y, min), max);
  }
  /**
   * A function to return the current position.
   * @returns {{ x: number, y: number }} The current position.
   */
  getPos() {
    return { x: this.x, y: this.y };
  }
  /**
   * A function to return the center coordinate of this entity.
   * @returns {{ x: number, y: number}} The center coordinate.
   */
  getCenter() {
    return { x: this.x + this.width / 2, y: this.y + this.height / 2 };
  }
  /**
   * A function that returns the current x position.
   * @returns {number} The x-position.
   */
  getPosX() {
    return this.x;
  }
  /**
   * A function that returns the current y position.
   * @returns {number} The y-position.
   */
  getPosY() {
    return this.y;
  }
  /**
   * A function to set the current x position.
   * @param {number} x - The new x-coordinate.
   */
  setPosX(x) {
    this.x = x;
  }
  /**
   * A function to set the current y position.
   * @param {number} y - The new y-coordinate.
   */
  setPosY(y) {
    this.y = y;
  }
  /**
   * A function that applies a random position.
   * @param {number} min - The minimum position.
   * @param {number} max - The maximum position.
   */
  setRanPos(min, max) {
    this.x = random(min, max + 1);
    this.y = random(min, max + 1);
  }
  /**
   * A function that generates a raycast from the entities center coordinate.
   * @param {{ angle: number, maxDist: number, filter?: function|undefined, scene: Scene }} settings - The settings to customize the raycast.
   * @returns {boolean} If the raycast hit or not.
   */
  raycast(settings) {
    if(!expect(settings, ["angle", "maxDist", "scene"])) throw new Error(`Missing properties in raycast settings. (missing: ${findMissing(settings, ["angle", "maxDist", "scene"]).join(", ")})`);
    return settings.scene.raycast(this.getCenter(), settings.angle, settings.maxDist, settings.filter ?? (() => true));
  }
  /**
   * A function that generates a debug ray.
   * @param {{ angle: number, dist: number, color: string, scene: Scene }} settings - The settings to customize the raycast.
   */
  debugRay(settings) {
    if(!expect(settings, ["angle", "dist", "color", "scene"])) throw new Error(`Missing properties in raycast settings. (missing: ${findMissing(settings, ["angle", "dist", "color", "scene"]).join(", ")})`);
    settings.scene.debugRay(this.getCenter(), settings.angle, settings.dist, settings.color);
  }
  /**
   * A function to measure the distance between two entities.
   * @param {Phantom2DEntity} object - The target entity.
   * @returns {number} The distance.
   */
  distTo(object) {
    return Math.hypot(object.x - this.x, object.y - this.y);
  }
  /**
   * A function that inverses the position on an axis.
   * @param {Scene} scene - The scene.
   * @param {string|number} axis - The axis to inverse on.
   */
  inverse(scene, axis) {
    if(axis == "x" || axis == 0) this.x = scene.width() - this.x;
    else if(axis == "y" || axis == 1) this.y = scene.height() - this.y;
  }
  /**
   * A function that inverses the x-coordinate.
   * @param {Scene} scene - The scene.
   */
  inverseX(scene) {
    this.x = scene.width() - this.x;
  }
  /**
   * A function that inverses the y-coordinate.
   * @param {Scene} scene - The scene.
   */
  inverseY(scene) {
    this.y = scene.height() - this.y;
  }
  /**
   * A function that reflects the current position on the axis on the line of reflection.
   * @param {string|number} axis - The axis to reflect on.
   * @param {number} rline - The line of reflection.
   */
  reflect(axis, rline) {
    if(axis == "x" || axis == 0) this.x = this.x > rline ? rline - this.x : rline + this.x;
    else if(axis == "y" || axis == 1) this.y = this.y > rline ? rline - this.y : rline + this.y;
  }
  /**
   * A function that reflects the x-coordinate on the line of reflection.
   * @param {number} rline - The line of reflection.
   */
  reflectX(rline) {
    this.x = this.x > rline ? rline - this.x : rline + this.x;
  }
  /**
   * A function that reflects the y-coordinate on the line of reflection.
   * @param {number} rline - The line of reflection.
   */
  reflectY(rline) {
    this.y = this.y > rline ? rline - this.y : rline + this.y;
  }
  /**
   * Applies a rightwards spin of the provided radians.
   * @param {number} deg - The radians to add.
   */
  rotRight(deg) {
    this.rot += deg;
    if(this.rot > 360) this.rot -= 360;
  }
  /**
   * Applies a leftward spin of the provided radians.
   * @param {number} deg - The radians to remove.
   */
  rotLeft(deg) {
    this.rot -= deg;
    if(this.rot < 0) this.rot += 360;
  }
  /**
   * Registers a new event.
   * @param {string} name - The event name.
   * @param {function} exec - The event execution.
   */
  #register(name, exec) {
    if(!this.#events[name]) this.#events[name] = [];
    if(!Array.isArray(this.#events[name])) this.#events[name] = [this.#events[name]];
    this.#events[name].push(exec);
  }
  /**
   * Removes an event.
   * @param {string} name - The event name.
   */
  #deregister(name) {
    delete this.#events[name];
  }
  /**
   * Adds a new event listener.
   * @param {string} name - The event name.
   * @param {function} exec - The event execution.
   */
  addEvent(name, exec) {
    this.#register(name, exec);
    this.addEventListener(name, exec);
  }
  /**
   * Removes an event listener, all associated listenrs if exec is null.
   * @param {string} name - The event name.
   * @param {function|null} exec - The event execution.
   */
  remEvent(name, exec = null) {
    this.#deregister(name);
    if(exec) {
      this.removeEventListener(name, exec);
    } else {
      this.#events[name].forEach(e => this.removeEventListener(name, e));
    }
  }
  /**
   * Returns the associated execution for an event.
   * @param {string} name - The event name.
   * @returns {function|undefined} The executor for an event.
   */
  getEvent(name) {
    return this.#events[name];
  }
  /**
   * Applies a linear Interpolation.
   * @param {number} start - The starting number.
   * @param {number} end - The ending number.
   * @param {number} alpha - The alpha value.
   * @returns {number} The resulting value for the next frame.
   */
  #lerp(start, end, alpha) {
    return start + (end - start) * alpha;
  }
  /**
   * Applies a lerp function.
   * @param {function} apply - The updater function.
   */
  #applyLerp(apply) {
    function anim() {
      this.#lerpProgress += 0.01;
      if(this.#lerpProgress > 1) this.#lerpProgress = 1;
      apply();
      if(this.#lerpProgress < 1) requestAnimationFrame(anim);
    }
    anim();
  }
  /**
   * Applies an x-axis lerp.
   * @param {number} target - The end position.
   */
  #applyXLerp(target) {
    this.#applyLerp(() => {
      this.x += this.#lerp(this.x, target, this.#lerpProgress);
    });
  }
  /**
   * Applies an y-axis lerp.
   * @param {number} target - The end position.
   */
  #applyYLerp(target) {
    this.#applyLerp(() => {
      this.y += this.#lerp(this.y, target, this.#lerpProgress);
    });
  }
  /**
   * Applies a lerp on x-axis and y-axis.
   * @param {{ x: number, y: number }} pos - The target position.
   */
  lerpPos(pos) {
    this.#applyXLerp(pos.x);
    this.#applyYLerp(pos.y);
  }
  /**
   * Applies a lerp on the x-axis.
   * @param {number} pos - THe target position.
   */
  lerpX(pos) {
    this.#applyXLerp(pos);
  }
  /**
   * Applies a lerp on the y-axis.
   * @param {number} pos - The target position.
   */
  lerpY(pos) {
    this.#applyYLerp(pos);
  }
  /**
   * Creates a timeout to remove this object from the scene.
   * @param {Scene} scene - The scene.
   * @param {number} time - The millisecond delay.
   */
  expire(scene, time) {
    setTimeout(() => scene.remove(this), time);
  }
}
/**
 * A class to define scenery.
 * @extends Phantom2DEntity
 */
class SceneObject extends Phantom2DEntity {
  /**
   * The constructor for scene objects.
   * @param {string[]} expects - Keys that are required within settings.
   * @param {string} objname - The name of the constructing class.
   * @param {{ id: string, shape: string, color: string, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity.
   */
  constructor(expects, objname, settings) {
    super(expects, `${objname} object`, settings);
  }
}
/**
 * A simple scenery object. Does not have any special attributes.
 * @extends SceneObject
 * @class
 */
class StaticObject extends SceneObject {
  /**
   * The constructor for static objects.
   * @param {{ id: string, shape: string, color: string, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity.
   */
  constructor(settings) {
    super([], "static", settings);
  }
  update() {}
}
/**
 * A scenery object that also has phyiscs.
 * @extends SceneObject
 * @class
 */
class PhysicsObject extends SceneObject {
  /**
   * The constructor for physics objects.
   * @param {{ id: string, shape: string, color: string, strength: number, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["strength"], "physics", settings);
    /**
     * The strength of the gravity applied.
     * @prop
     * @type {number}
     */
    this.strength = settings.strength;
    /**
     * The gravity speed of the object.
     * 
     * Gravity speed is a constant acceleration applied to an object in speed and direction.
     * @prop
     * @type {number}
     */
    this.gravspd = 0;
  }
  update() {
    this.gravspd += this.strength;
    this.y += this.gravspd;
  }
}
/**
 * A scenery object that moves.
 * @extends SceneObject
 * @class
 */
class MovingObject extends SceneObject {
  /**
   * The constructor for moving objects.
   * @param {{ id: string, shape: string, color: string, speed: number, dirX: number, dirY: number, extentLeft: number, extentRight: number, extentDown: number, extentUp: number, isBouncing?: boolean|undefined, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["speed", "dirX", "dirY", "extentLeft", "extentRight", "extentDown", "extentUp"], "moving", settings);
    /**
     * The speed at which to travel.
     * @prop
     * @type {number}
     */
    this.speed = settings.speed;
    /**
     * The x-direction it should begin traveling in.
     * 0 represents left, 1 represents right.
     * @prop
     * @type {number}
     */
    // 0 represents LEFT, 1 represents RIGHT
    this.directionX = settings.dirX;
    /**
     * The y-direction it should begin traveling in.
     * 0 represents down, 1 represents up.
     * @prop
     * @type {number}
     */
    // 0 represents DOWN, 1 represents UP
    this.directionY = settings.dirY;
    /**
     * Determines whether the object should have a "bouncy" behavior.
     * 
     * Is bouncing defines if:
     * 1. When an extent is reached, should stop.
     * 2. When an extent is reached, move in the opposite direction.
     * @prop
     * @type {number}
     */
    // isBouncing defines whether:
    // 1. when an extent is reached, should stop
    // 2. when an extent is reached, move in the opposite direction
    this.isBouncing = settings.isBouncing ?? true;
    /**
     * Determines the furthest x position in the left direction this object can be at.
     * @prop
     * @type {number}
     */
    // extentLeft shows the furthest x position it can be in the left direction
    this.extentLeft = settings.extentLeft;
    /**
     * Determines the furthest x position in the right direction this object can be at.
     * @prop
     * @type {number}
     */
    // extentRight shows the furthest x position it can be in the right direction
    this.extentRight = settings.extentRight;
    /**
     * Determines the furthest y position in the down direction this object can be at.
     * @prop
     * @type {number}
     */
    // extentDown shows the furthest y position it can be in the down direction
    this.extentDown = settings.extentDown;
    /**
     * Determines the furthest y position in the up direction this object can be at.
     * @prop
     * @type {number}
     */
    // extentUp shows the furthest y position it can be in the up direction
    this.extentUp = settings.extentUp;
  }
  update() {
    if(this.extentLeft != null && this.extentRight != null) {
      if(this.extentLeft >= this.x && this.isBouncing && this.directionX == 0) {
        this.x += this.speed;
        this.directionX = 1;
      } else if(this.extentRight <= this.x && this.isBouncing && this.directionX == 1) {
        this.x -= this.speed;
        this.directionX = 0;
      } else if(this.extentLeft < this.x && !this.isBouncing && this.directionX == 0) {
        this.x -= this.speed;
      } else if(this.extentRight > this.x && !this.isBouncing && this.directionX == 1) {
        this.x += this.speed;
      }
    }
    if(this.extentDown != null && this.extentUp != null) {
      if(this.extentDown >= this.y && this.isBouncing && this.directionY == 0) {
        this.y += this.speed;
        this.directionY = 1;
      } else if(this.extentDown <= this.y && this.isBouncing && this.directionY == 1) {
        this.y -= this.speed;
        this.directionY = 0;
      } else if(this.extentUp < this.y && !this.isBouncing && this.directionY == 0) {
        this.y -= this.speed;
      } else if(this.extentUp > this.y && !this.isBouncing && this.directionY == 1) {
        this.y += this.speed;
      }
    }
  }
}
/**
 * A scenery object that causes colliding objects to bounce.
 * @extends SceneObject
 * @class
 */
class BouncyObject extends SceneObject {
  // TODO:
  // Add passthrough/stop logic with ignore/target returns
  // Allow for existing colliding setting, mix with required colliding setting
  /**
   * The constructor for bouncy objects.
   * @param {{ id: string, shape: string, color: string, strength: number, ignore?: Phantom2DEntity[]|undefined, ignoreByType?: class[]|undefined, target?: Phantom2DEntity[]|undefined, targetByType?: class[]|undefined, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    settings.collide = null;
    super(["strength"], "bouncy", settings);
    /**
     * The force of bounce to be applied.
     * @prop
     * @type {number}
     */
    this.strength = settings.strength;
    /**
     * What items to ignore.
     * @prop
     * @type {Phantom2DEntity[]}
     */
    this.ignore = settings.ignore ?? [];
    /**
     * What classes to ignore.
     * @prop
     * @type {class[]}
     */
    this.ignoreByType = settings.ignoreByType ?? [];
    /**
     * What items to target.
     * @prop
     * @type {Phantom2DEntity[]}
     */
    this.target = settings.target ?? [];
    /**
     * What classes to target.
     * @prop
     * @type {class[]}
     */
    this.targetByType = settings.targetByType ?? [];
    /**
     * The function to be fired when this object collides with another.
     * @prop
     * @type {function}
     * @param {Phantom2DEntity} col - The colliding object.
     */
    this.collide = (col) => {
      // Exits prematurely if colliding object should be ignored
      if(this.ignore.includes(col) || this.ignoreByType.some(type => col instanceof type)) return;
      // Checks for match within targeted entities and types
      const matchesTarget = this.target.includes(col);
      const matchesTargetByType = this.targetByType.some(type => col instanceof type);
      if((this.target.length > 0 || this.targetByType.length > 0) && !(matchesTarget || matchesTargetByType)) return;
      if(col.velocity) {
        col.velocity.x *= -(this.strength);
        col.velocity.y *= -(this.strength);
      }
    }
  }
  update() {}
}
/**
 * A scene object that moves in a single direction and destroys itself upon reaching extent.
 * @extends SceneObject
 * @class
 */
class BulletObject extends SceneObject {
  /**
   * The constructor for bullet objects.
   * @param {{ id: string, shape: string, color: string, clampLeft: number, clampRight: number, clampUp: number, clampDown: number, speed: number, dir: number, scene: Scene, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["clampLeft", "clampRight", "clampUp", "clampDown", "speed", "dir", "scene"], "bullet", settings);
    /**
     * The furthest left direction this object can be at.
     * @prop
     * @type {number}
     */
    this.clampLeft = settings.clampLeft;
    /**
     * The furthest right direction this object can be at.
     * @prop
     * @type {number}
     */
    this.clampRight = settings.clampRight;
    /**
     * The furthest up direction this object can be at.
     * @prop
     * @type {number}
     */
    this.clampUp = settings.clampUp;
    /**
     * The furthest down direction this object can be at.
     * @prop
     * @type {number}
     */
    this.clampDown = settings.clampDown;
    /**
     * The speed to move at.
     * @prop
     * @type {number}
     */
    this.speed = settings.speed;
    /**
     * The direction to point at.
     * 
     * 0 represents north, 1 east, 2 south, 3 west; treated like radian degree if none of the above.
     * @prop
     * @type {number}
     */
    // 0 is NORTH, 1 is EAST, 2 is SOUTH, 3 is WEST
    this.dir = settings.dir;
    /**
     * A function to be fired when this object is destroyed.
     * @prop
     * @type {function}
     */
    this.onDestroyed = settings.onDestroyed ?? (() => {});
    /**
     * A reference to the scene.
     * @prop
     * @type {Scene}
     */
    // Needs a reference to the scene to be able to self-destruct
    this.scene = settings.scene;
  }
  update() {
    switch(this.dir) {
      case 0: this.y -= this.speed; break;
      case 1: this.x += this.speed; break;
      case 2: this.y += this.speed; break;
      case 3: this.x -= this.speed; break;
      default:
        // assumes dir is an angle and not a direction
        // to get the forward vector, we use (where theta is the angle):
        // (cos(theta), sin(theta))
        const dx = Math.cos(this.dir);
        const dy = Math.sin(this.dir);
        // Update the position by adding the scaled direction vector
        this.x += dx * this.speed;
        this.y += dy * this.speed;
        break;
    }
    if(this.x + this.width < this.clampLeft || this.x + this.width > this.clampRight || this.y + this.height < this.clampUp || this.y + this.height > this.clampDown) {
      this.onDestroyed();
      this.scene.remove(this);
    }
  }
}
/**
 * Homing bullet that chases something. Destroyed on reaching extent or hitting something.
 * @extends BulletObject
 * @class
 */
class HomingBulletObject extends BulletObject {
  /**
   * The constructor for homing bullet objects.
   * @param {{ id: string, shape: string, color: string, clampLeft: number, clampRight: number, clampUp: number, clampDown: number, speed: number, dir: number, scene: Scene, target: Phantom2DEntity, focus?: Phantom2DEntity[]|undefined, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    if(!expect(settings, ["target"])) throw new Error(`Missing key(s) in homing bullet object. (missing: ${findMissing(settings, ["target"]).join(", ")}`);
    super(settings);
    /**
     * The target to chase.
     * @prop
     * @type {Phantom2DEntity}
     */
    this.target = settings.target;
    /**
     * The items to target.
     * @prop
     * @type {Phantom2DEntity[]}
     */
    this.focus = settings.focus ?? [];
    /**
     * The function to fire when colliding.
     * @prop
     * @type {function}
     */
    this.collide = (col) => {
      if(this.focus.length && !this.focus.includes(col)) return;
      col.collide(this);
      this.scene.remove(this);
    }
  }
  update() {
    // face the target
    this.dir = this.scene.getRotTo(this, this.target);
    const { x, y } = this.target;
    if(this.x < x) this.x += this.speed;
    else if(this.x > x) this.x -= this.speed;
    if(this.y < y) this.y += this.speed;
    else if(this.y > y) this.y -= this.speed;
  }
}
/**
 * A simple object that pushes others upwards.
 * @extends SceneObject
 * @class
 * @deprecated Use WallObject instead.
 * @see {@link WallObject} See WallObject.
 */
class FloorObject extends SceneObject {
  /**
   * The constructor for floor objects.
   * @param {{ id: string, shape: string, color: string, x: number, y: number, width: number, height: number, collide?: function|undefined, rot?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["x", "y", "width", "height"], "floor", settings);
    /**
     * A simple object that will push colliding objects upwards (if specified).
     * 
     * Pushes all Character entities.
     * @param {Phantom2DEntity} comp - The colliding object.
     * @prop
     * @type {function}
     */
    this.collide = (comp) => {
      if((settings.target && settings.target.some(type => is(comp, type))) || is(comp, Character)) {
        if(comp.y + comp.height > this.y) comp.y = this.y - comp.height;
      }
    }
  }
  update() {}
}
/**
 * A simple object that blocks others movement.
 * @extends SceneObject
 * @class
 */
class WallObject extends SceneObject {
  /**
   * The constructor for wall objects.
   * @param {{ id: string, shape: string, color: string, x: number, y: number, width: number, height: number, collide?: function|undefined, rot?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["x", "y", "width", "height"], "wall", settings);
    /**
     * A simple object that will push colliding objects (if specified).
     * 
     * Pushes all Character entities.
     * @param {Phantom2DEntity} comp - The colliding object.
     * @prop
     * @type {function}
     */
    this.collide = (comp) => {
      if((settings.target && settings.target.some(type => is(comp, type))) || is(comp, Character)) {
        // left vs right penetration
        const ovrXL = comp.x + comp.width - this.x;
        const ovrXR = this.x + this.width - comp.x;
        const minOvrX = Math.min(ovrXL, ovrXR);
        // top vs bottom penetration
        const ovrYT = comp.y + comp.height - this.y;
        const ovrYB = this.y + this.height - comp.y;
        const minOvrY = Math.min(ovrYT, ovrYB);
        // push out on path of least resistence
        const compC = comp.getCenter();
        const wallC = this.getCenter();
        if(minOvrX < minOvrY) {
          if(compC.x < wallC.x) {
            // push left
            comp.x = this.x - comp.width;
          } else {
            // push right
            comp.x = this.x + this.width;
          }
        } else {
          if(compC.y < wallC.y) {
            // push up
            comp.y = this.y - comp.height;
          } else {
            // push down
            comp.y = this.y + this.height;
          }
        }
      }
    }
  }
  update() {}
}
class ButtonObject extends SceneObject {
  constructor(settings) {
    super(["action", "scene"], "button object", settings);
    this.action = settings.action;
    this.scene = settings.scene;
    this.onCanvasClick = (event) => {
      const rect = this.scene.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }
    this.exec = (e) => {
      if(!this.onCanvasClick(e)) return;
      this.action();
    }
    this.scene.addEvent("click", this.exec);
  }
  update() {}
}
class TextObject extends SceneObject {
  constructor(settings) {
    settings.shape = "text";
    super([], "text", settings);
    this.text = settings.text ?? "";
    this.font = settings.font ?? "serif";
    this.size = settings.size ?? "12px";
  }
  getText() {
    return this.text;
  }
  setText(txt) {
    this.text = txt;
  }
  getFont() {
    return this.font;
  }
  getSize() {
    return this.size;
  }
  setFont(f) {
    this.font = f;
  }
  setSize(s) {
    this.size = s;
  }
}
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
/**
 * A class used for entities that are used as game characters.
 * @extends Phantom2DEntity
 * @class
 */
class Character extends Phantom2DEntity {
  /**
   * The constructor for the character class.
   * @param {string[]} expects - Keys that are required within settings.
   * @param {string} objname - The name of the constructing class.
   * @param {{ id: string, shape: string, color: string, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined, pushOthers: boolean|undefined }} settings - The characteristics of the entity. 
   */
  constructor(expects, objname, settings) {
    super(expects, `${objname} character`, settings);
    /**
     * The gravity speed of the object.
     * 
     * Gravity speed is a constant acceleration applied to an object in speed and direction.
     * @prop
     * @type {number}
     */
    this.gravspd = 0;
    /**
     * The strength of the gravity applied.
     * @prop
     * @type {number}
     */
    this.strength = settings.strength ?? 0;
    /**
     * A boolean whether to push other characters out of the way.
     * @prop
     * @type {boolean}
     * @deprecated Saved for another version.
    */
    this.pushOthers = settings.pushOthers ?? true;
    this.onGround = false;
    // if(this.pushOthers) {
    //   const collide = this.collide;
    //   this.collide = (col) => {
    //     collide.call(this, col);
    //     this.pushCollide(col);
    //   };
    // }
  }
  /**
   * A function that applies a new gravity speed.
   * @param {number} newSpd - The new gravity speed.
   */
  setGravSpd(newSpd) {
    this.gravspd = newSpd;
  }
  /**
   * A function that applies a jump effect.
   * 
   * Reverses height to move upwards if height is positive.
   * @param {number} height - The height to jump.
   */
  jump(height) {
    this.gravspd = -(height);
  }
  /**
   * A function to push other characters.
   * @param {Phantom2DEntity} comp - The colliding entity.
   * @deprecated Part of an unfinished collection.
   */
  pushCollide(comp) {
    if(!is(comp, Character)) return;

    // if the other guy doesn't push others, treat him like a platform
    if (comp.pushOthers === false) {
      // only land if you're falling and near his top surface
      const topOverlap = (this.y + this.height) - comp.y;
      if (this.gravspd > 0 && this.y + this.height - this.gravspd <= comp.y) {
        this.y = comp.y - this.height; // lock onto his head
        this.gravspd = 0;
        this.onGround = true;
      }
      return; // skip rest of collision
    }

    // left vs right penetration
    const ovrXL = comp.x + comp.width - this.x;
    const ovrXR = this.x + this.width - comp.x;
    const minOvrX = Math.min(ovrXL, ovrXR);

    // top vs bottom penetration
    const ovrYT = comp.y + comp.height - this.y;
    const ovrYB = this.y + this.height - comp.y;
    const minOvrY = Math.min(ovrYT, ovrYB);

    // push out on path of least resistance
    if (minOvrY <= minOvrX) {
      if (this.y < comp.y) {
        // you're above → land
        this.y = comp.y - this.height;
        this.gravspd = 0;
        this.onGround = true;
      } else {
        // bumping head
        if (this.gravspd < 0) {
          this.y = comp.y + comp.height;
          this.gravspd = 0;
        }
      }
    } else {
      // horizontal
      if (this.x < comp.x) {
        this.x = comp.x - this.width;
      } else {
        this.x = comp.x + comp.width;
      }
    }
  }
}
/**
 * A class that creates a controllable character.
 * @extends Character
 * @class
 */
class PlayableCharacter extends Character {
  /**
   * The keybinds.
   * @prop
   * @type {Map<string, function>}
   */
  #binds;
  /**
   * The keys that were caught within the event listeners.
   * @prop
   * @type {Map<string, boolean>}
   */
  #keys;
  /**
   * The constructor for playable characters.
   * @param {{ id: string, shape: string, color: string, width: number, height: number, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, custom?: Map|undefined, pushOthers: boolean|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["width", "height"], "playable", settings);
    this.#binds = settings.binds ?? {};
    this.#keys = {};
    window.addEventListener("keydown", (event) => this.#keys[event.key] = true);
    window.addEventListener("keyup", (event) => this.#keys[event.key] = false);
  }
  /**
   * Returns the function binded to the key.
   * @param {string} key - The key to search for.
   * @returns {function|undefined} The function binded to the key.
   */
  getBind(key) {
    return this.#binds[key];
  }
  /**
   * Creates a new binding.
   * @param {string} key - The key to watch for.
   * @param {function} action - The action to be executed, if the key is pressed.
   */
  setBind(key, action) {
    this.#binds[key] = action;
  }
  /**
   * Removes a binding.
   * @param {string} key - The key pair to remove.
   */
  unbind(key) {
    delete this.#binds[key];
  }
  update() {
    this.gravspd += this.strength;
    this.y += this.gravspd;
    for(const [name, action] of Object.entries(this.#binds)) {
      if(this.#keys[name]) action();
    }
  }
}
/**
 * A class that creates a non-controllable character.
 * @extends Character
 * @class
 */
class NonPlayableCharacter extends Character {
  /**
   * The states this NPC can have applied.
   * @prop
   * @type {Map<string, function>}
   */
  #states;
  /**
   * Whether this NPC is chasing something or not.
   * @prop
   * @type {number|undefined}
   */
  #chasing;
  /**
   * The constructor for non-playable characters.
   * @param {{ id: string, shape: string, color: string, states: Map, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["states"], "non-playable", settings);
    this.#states = settings.states;
    /**
     * An interval to execute the state of this NPC.
     * @prop
     * @type {number|undefined}
     */
    this.interval = null;
    /**
     * An interval to move this NPC.
     * @prop
     * @type {number|undefined}
     */
    this.moveInterval = null;
    this.#chasing = null;
  }
  /**
   * Returns the binding for a state.
   * @param {string} name - The state name.
   * @returns {function|undefined} The binding for the state.
   */
  getState(name) {
    return this.#states[name];
  }
  /**
   * Creates a new state.
   * @param {string} name - The state name.
   * @param {function} action - The state executor.
   */
  setState(name, action) {
    this.#states[name] = action;
  }
  /**
   * Runs a state executor.
   * @param {string} name - The state name.
   */
  applyState(name) {
    this.#states[name]();
  }
  /**
   * Applies an interval to contionously execute a state.
   * @param {string} name - The state name.
   * @param {number} delay - The delay to make between executions.
   */
  useInterval(name, delay) {
    this.interval = setInterval(this.#states[name], delay);
  }
  /**
   * Applies a state to move this NPC.
   * @param {Phantom2DEntity} target - Where to move.
   * @param {number} step - The distance to move with each step.
   * @param {number} tick - The delay to make between executions.
   */
  moveTo(target, step, tick) {
    if(target.x == null || target.y == null) throw new Error(`Requires x and y values. (missing keys: ${findMissing(target, ["x", "y"]).join(", ")})`);
    this.moveInterval = setInterval(() => {
      if(isColliding(this, target)) {
        clearInterval(this.moveInterval);
        return;
      }
      if(target.x < this.x) this.x -= step;
      else if(target.x > this.x) this.x += step;
      if(target.y < this.y) this.y -= step;
      else if(target.y > this.y) this.y += step;
    }, tick);
  }
  /**
   * Stops an execution interval.
   */
  stopInterval() {
    clearInterval(this.interval);
  }
  /**
   * Stops the movement interval.
   */
  stopMoveInterval() {
    clearInterval(this.interval);
  }
  /**
   * Stops a chasing interval.
   */
  stopChasing() {
    clearInterval(this.#chasing);
  }
  /**
   * Causes this NPC to chase after someone.
   * @param {Phantom2DEntity} target - Whom to chase.
   * @param {number} spd - The speed to chase at.
   * @param {number} tick - The delay to make between executions.
   */
  chase(target, spd, tick) {
    this.#chasing = setInterval(() => {
      if(target.x < this.x) this.x -= spd;
      else if(target.x > this.x) this.x += spd;
      if(target.y < this.y) this.y -= spd;
      else if(target.y > this.y) this.y  += spd;
    }, tick);
  }
  update() {
    this.gravspd += this.strength;
    this.y += this.gravspd;
  }
}
// class Light extends Phantom2DEntity {
//   constructor(expects, objname, settings) {
//     super(expects, `${objname} light`, settings);
//     // candelas (cd) is the measurement of a light source in a specific direction
//     // lumens (lm) is the measurement of a light source in all directions
//     // attenuation is the decaying effect lights produce
//     // you can find the intensity of a light at a position
//     // using the inverse-square law
//     this.attenuation = settings.atten ?? 1;
//     this.reach = settings.reach ?? 0;
//   }
//   intensityAt(intensity, startDist, endDist) {
//     // inverse-square law
//     // (I1 / I2) = (D2^2) / (D1^2)
//     // I2 = I1 * (D1 / D2)^2
//     // where:
//     // I1 represents the starting intensity
//     // I2 represents the ending intensity
//     // D1 represents the starting distance
//     // D2 represents the ending distance
//     return intensity * (startDist * startDist) / (endDist * endDist);
//   }
// }
// class DirectionLight extends Light {
//   constructor(settings) {
//     super(["cd", "beamSize"], "direction", settings);
//     this.candelas = settings.cd;
//     this.beamSize = settings.beamSize;
//   }
// }
// class AreaLight extends Light {
//   constructor(settings) {
//     super(["lm"], "area", settings);
//     this.lumens = settings.lm;
//   }
// }
// class NavigationMesh extends Phantom2DEntity {
//   constructor(settings) {
//     super(["x", "y", "width", "height", "size"], "navigation mesh", settings);
//     this.nodes = [];
//   }
//   generate() {
//     this.nodes = [];
//   }
// }
/**
 * Used for generating audio.
 * @extends Phantom2DEntity
 * @class
 */
class Audio extends Phantom2DEntity {
  /**
   * An HTML audio element.
   * @prop
   * @type {HTMLAudioElement|undefined}
   */
  #audioElement
  /**
   * The constructor for audio.
   * @param {{ id: string, shape: string, color: string, volume: number, src: string, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["volume", "src"], "audio object", settings);
    /**
     * The source path for the audio.
     * @prop
     * @type {string}
     */
    this.src = settings.src;
    /**
     * The volume to apply.
     * @prop
     * @type {number}
     */
    this.volume = settings.volume;
    this.#audioElement = null;
  }
  /**
   * Creates the HTML audio element.
   */
  create() {
    this.#audioElement = document.createElement("audio");
    this.#audioElement.volume = this.volume;
    this.#audioElement.src = this.src;
  }
  /**
   * Applies a new position to the head position.
   * @param {number} headpos - The new position.
   */
  setHeadPos(headpos) {
    this.#audioElement.currentTime = headpos;
  }
  /**
   * Returns the head position.
   * @returns {number} The head position.
   */
  getHeadPos() {
    return this.#audioElement.currentTime;
  }
  /**
   * Plays the audio.
   */
  play() {
    this.#audioElement.play();
  }
  /**
   * Pauses the audio playback.
   */
  pause() {
    this.#audioElement.pause();
  }
  /**
   * Stops the audio playback and resets the head position.
   */
  stop() {
    this.#audioElement.pause();
    this.#audioElement.currentTime = 0;
  }
  /**
   * Sets the HTML audio element to null.
   */
  destroy() {
    this.#audioElement = null;
  }
  /**
   * Appends the HTML audio element.
   */
  add() {
    if(!this.#audioElement) throw new Error("Audio element has not been initalized yet.");
    document.body.appendChild(this.#audioElement);
  }
  /**
   * Removes the HTML audio element.
   */
  remove() {
    if(!this.#audioElement) throw new Error("Audio element has not been initalized yet.");
    document.body.removeChild(this.#audioElement);
  }
  /**
   * Returns the length of the audio.
   * @returns {number} The length of the audio.
   */
  len() {
    return this.#audioElement.duration;
  }
}
/**
 * A class to spawn multiple entities of the same type.
 * @extends Phantom2DEntity
 * @class
 */
class Spawner extends Phantom2DEntity {
  /**
   * The constructor for spawners.
   * @param {{ id: string, shape: string, color: string, spawns: Phantom2DEntity, cd: number, spawnargs: Map, scene: Scene, collide?: function|undefined, x?: number|undefined, y?: number|undefined, rot?: number|undefined, width?: number|undefined, height?: number|undefined, custom?: Map|undefined }} settings - The characteristics of the entity. 
   */
  constructor(settings) {
    super(["spawns", "cd", "spawnargs", "scene"], "spawner", settings);
    /**
     * The entity this spawns.
     * @prop
     * @type {Phantom2DEntity}
     */
    this.spawns = settings.spawns;
    /**
     * The args to pass to the summoned units.
     * @prop
     * @type {Map}
     */
    this.spawnargs = settings.spawnargs;
    /**
     * The cooldown between spawns.
     * @prop
     * @type {number}
     */
    this.cd = settings.cd;
    /**
     * The interval for summoning.
     * @prop
     * @type {number|undefined}
     */
    this.interval = null;
    /**
     * A reference to the scene.
     * 
     * Used to directly append summoned units to the scene's components.
     * @prop
     * @type {Scene}
     */
    this.scene = settings.scene;
  }
  /**
   * Starts the spawning process.
   */
  start() {
    this.interval = setInterval(() => {
      this.scene.add(new this.spawns({ ...this.spawnargs }));
    }, this.cd);
  }
  /**
   * Stops the spawning process.
   */
  stop() {
    clearInterval(this.interval);
  }
  update() {}
}
/**
 * The root canvas manager.
 * @class
 */
class Scene {
  /**
   * The entities to be used.
   * @prop
   * @type {Phantom2DEntity[]}
   */
  #components;
  /**
   * A cache for images.
   * @prop
   * @type {Map<string, HTMLImageElement>}
   */
  #imgCache;
  /**
   * The target to be focusing.
   * @prop
   * @type {Phantom2DEntity}
   */
  #focusTarget;
  /**
   * A set of animations.
   * 
   * @deprecated Unused - do not use.
   * @prop
   * @type {Map<string, HTMLImageElement[]>}
   */
  #anims;
  /**
   * A set of different objects stored as a level.
   * 
   * Levels can be loaded instead of having everything in the main cache.
   * @prop
   * @type {Map<string, Phantom2DEntity[]>}
   */
  #levels;
  /**
   * The constructor for the Scene.
   * @param {HTMLCanvasElement} canvas - The canvas to use.
   * @param {number} width - The literal width of the canvas.
   * @param {number} height - The literal height of the canvas.
   * @param {string} cssWidth - The display width of the canvas.
   * @param {string} cssHeight - The display height of the canvas.
   */
  constructor(canvas, width, height, cssWidth = "100vw", cssHeight = "100vh") {
    if(!(canvas instanceof HTMLCanvasElement)) throw new Error("Please provide a valid canvas.");
    /**
     * The literal HTML canvas.
     * @prop
     * @type {HTMLCanvasElement}
     */
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.width = cssWidth;
    this.canvas.style.height = cssHeight;
    /**
     * The 2d rendering context for this canvas.
     * @prop
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = this.canvas.getContext("2d");
    this.#components = [];
    /**
     * The current position of this mouse.
     * @prop
     * @type {{ x: number, y: number }}
     */
    this.mousePos = { x: 0, y: 0 };
    document.addEventListener("mousemove", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      this.mousePos = { x: (event.clientX - rect.left) * scaleX, y: (event.clientY - rect.top) * scaleY };
    });
    /**
     * A storage for events that could be triggered.
     * @prop
     * @type {Map<string, function>}
     */
    this._events = {};
    this.#imgCache = {};
    this.#focusTarget = null;
    // this.scaleFactor = 1;
    this.#anims = {};
    this.#levels = {};
  }
  /**
   * A function to add new components to this components.
   * @param {...Phantom2DEntity} comps - The components to add.
   */
  add(...comps) {
    for(const comp of comps) {
      if(!is(comp, Phantom2DEntity)) throw new Error("Cannot add invalid type object.");
    }
    this.#components.push(...comps);
  }
  /**
   * A function to remove components from this components.
   * @param {...Phantom2DEntity} comps - The components to remove.
   */
  remove(...comps) {
    for(let i = this.#components.length - 1; i >= 0; i--) {
      if(comps.includes(this.#components[i])) {
        this.#components.splice(i, 1);
      }
    }
  }
  /**
   * A ctx function to fill a rectangle.
   * @param {number} x - The x-position.
   * @param {number} y - The y-position.
   * @param {number} width - The width.
   * @param {number} height - The height.
   * @param {string} colour - The colour.
   */
  // ctx functions
  rect(x, y, width, height, colour) {
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(x, y, width, height);
  }
  /**
   * A function to clear the entire canvas.
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * A function to draw an image.
   * 
   * Gets an HTMLImageElement from the image cache.
   * 
   * Applies an onload
   * @param {number} x - The x-position.
   * @param {number} y - The y-position.
   * @param {number} w - The width.
   * @param {number} h - The height.
   * @param {string} path - The path to the image.
   */
  img(x, y, w, h, path) {
    const img = this.#imgCache[path];
    if(!img) throw new Error("Image not found in image cache.");
    if(img.complete) {
      this.ctx.drawImage(img, x, y, w, h);
    } else {
      img.onload = () => this.ctx.drawImage(img, x, y, w, h);
    }
  }
  /**
   * Loads an image, fetches the image cache for the path.
   * @param {string} path - The image path.
   * @returns {HTMLImageElement} The created image.
   */
  loadImg(path) {
    if(Object.hasOwn(this.#imgCache, path)) return this.#imgCache[path];
    const img = new Image();
    img.src = path;
    this.#imgCache[path] = img;
    return img;
  }
  /**
   * Renders every component.
   */
  render() {
    for(const comp of this.#components) {
      if(!is(comp, Phantom2DEntity)) throw new Error("Cannot render invalid type object.");
    }
    let offsetX = 0;
    let offsetY = 0;
    if(this.#focusTarget) {
      const focusCenterX = this.#focusTarget.x + this.#focusTarget.width / 2;
      const focusCenterY = this.#focusTarget.y + this.#focusTarget.height / 2;
      offsetX = this.width() / 2 - focusCenterX;
      offsetY = this.height() / 2 - focusCenterY;
    }
    this.#components.forEach(component => {
      this.ctx.fillStyle = component.color;
      // position relative to camera
      const drawX = component.x + offsetX;
      const drawY = component.y + offsetY;
      this.ctx.save();
      // this.ctx.scale(this.scaleFactor, this.scaleFactor);
      // move to the center of the object (after offset)
      this.ctx.translate(drawX + component.width / 2, drawY + component.height / 2);
      // Rotate the canvas
      this.ctx.rotate(component.rot);
      // Draw the rectangle at the new origin (its center)
      if(component.shape == "text") this.ctx.fillText(component.text, -component.width / 2, -component.height / 2);
      else this.ctx.fillRect(-component.width / 2, -component.height / 2, component.width, component.height);
      // Restore the canvas to its original state
      this.ctx.restore();
    });
  }
  /**
   * Runs the updater for each component.
   */
  update() {
    for(const comp of this.#components) {
      if(!is(comp, Phantom2DEntity)) throw new Error("Cannot update invalid type object.");
    }
    this.#components.forEach(component => {
      component.update();
    });
    this.#resolveCollisions();
  }
  /**
   * Finds a component with the id.
   * @param {string} id - The id to look for.
   * @returns {Phantom2DEntity|undefined} The found component.
   */
  getById(id) {
    return this.#components.find(component => component.id == id);
  }
  /**
   * Finds a component by an attribute.
   * @param {string} attr - The attribute to look for.
   * @param {Object} value - The value to match.
   * @returns {Phantom2DEntity|undefined} The found component.
   */
  getByAttr(attr, value) {
    return this.#components.find(component => component[attr] == value);
  }
  /**
   * Gets a component at an index.
   * @param {string} idx - The index.
   * @returns {Phantom2DEntity|undefined} The component.
   */
  getByIdx(idx) {
    return this.#components[idx];
  }
  /**
   * Sets an element by id.
   * @param {string} id - The id to look for.
   * @param {Phantom2DEntity} newItem - The replacement.
   */
  setById(id, newItem) {
    const comp = this.#components.find(component => component.id == id);
    const idx = this.#components.indexOf(comp);
    if(!comp || idx == -1) return;
    this.#components[idx] = newItem;
  }
  /**
   * Sets an element by an attribute.
   * @param {string} attr - The attribute to look for.
   * @param {Object} value - The value to match.
   * @param {Phantom2DEntity} newItem - The replacement.
   */
  setByAttr(attr, value, newItem) {
    const comp = this.#components.find(component => component[attr] == value);
    const idx = this.#components.indexOf(comp);
    if(!comp || idx == -1) return;
    this.#components[idx] = newItem;
  }
  /**
   * Sets an element by an index.
   * @param {number} idx - The index.
   * @param {Phantom2DEntity} newItem - The replacement.
   */
  setByIdx(idx, newItem) {
    this.#components[idx] = newItem;
  }
  /**
   * Checks if contains this item.
   * @param {Phantom2DEntity} item - The item to look for.
   * @returns {boolean} If it contains it.
   */
  hasItem(item) {
    return this.#components.includes(item);
  }
  /**
   * Checks for a component with an id.
   * @param {string} id - The id.
   * @returns {boolean} Whether it contains it or not.
   */
  hasItemWithId(id) {
    return this.#components.some(component => component.id == id);
  }
  /**
   * Checks for a component with an attribute.
   * @param {string} attr - The attribute.
   * @param {Object} value - The value to match.
   * @returns {boolean} Whether a component was found.
   */
  hasItemWithAttr(attr, value) {
    return this.#components.some(component => component[attr] == value);
  }
  /**
   * Returns the index of a component.
   * @param {Phantom2DEntity} component - The component to look for.
   * @returns {number} The index of the component.
   */
  idxOf(component) {
    return this.#components.indexOf(component);
  }
  /**
   * Returns the components length.
   * @returns {number} The length.
   */
  len() {
    return this.#components.length;
  }
  /**
   * Fills the background.
   * @param {string} colour - The colour to fill.
   */
  fillBg(colour) {
    this.ctx.fillStyle = colour;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  /**
   * A function to resolve collisions between components.
   */
  #resolveCollisions() {
    this.#components.forEach(component1 => {
      this.#components.forEach(component2 => {
        if(component1 == component2) return;
        if(isColliding(component1, component2)) {
          component1.collide(component2);
        }
      });
    });
  }
  /**
   * Converts world coordinates to screen coordinates.
   * @param {{ x: number, y: number }} pos - The coordinates to check.
   * @returns {{ x: number, y: number }} The screen coordinates.
   */
  worldToScreen(pos) {
    let offsetX = 0;
    let offsetY = 0;
    if(this.#focusTarget) {
      const focusCenterX = this.#focusTarget.x + this.#focusTarget.width / 2;
      const focusCenterY = this.#focusTarget.y + this.#focusTarget.height / 2;
      offsetX = this.width() / 2 - focusCenterX;
      offsetY = this.height() / 2 - focusCenterY;
    }
    return { x: pos.x + offsetX, y: pos.y + offsetY };
  }
  /**
   * Converts screen coordinates to world coordinates.
   * @param {{ x: number, y: number }} pos - The coordinates to check.
   * @returns {{ x: number, y: number }} The world coordinates.
   */
  screenToWorld(pos) {
    let offsetX = 0;
    let offsetY = 0;
    if(this.#focusTarget) {
      const focusCenterX = this.#focusTarget.x + this.#focusTarget.width / 2;
      const focusCenterY = this.#focusTarget.y + this.#focusTarget.height / 2;
      offsetX = this.width() / 2 - focusCenterX;
      offsetY = this.height() / 2 - focusCenterY;
    }
    return { x: pos.x - offsetX, y: pos.y - offsetY };
  }
  /**
   * Returns the mouse's rotation to the target.
   * @param {Phantom2DEntity} target 
   * @returns {number} The radian rotation.
   * @see {@link getRotToMouse} - The version for getting target rotation to the mouse.
   */
  getMouseRotTo(target) {
    if(target.x == null || target.y == null) throw new Error(`Requires x and y values. (missing keys: ${findMissing(target, ["x", "y"]).join(", ")})`);
    // get world screen position
    const targetScreen = this.worldToScreen(target);
    // Calculate difference vector
    const deltaX = this.mousePos.x - targetScreen.x;
    const deltaY = this.mousePos.y - targetScreen.y;
    // For utilizing rotation canvas items, it requires radians
    const radians = Math.atan2(deltaY, deltaX);
    return radians;
  }
  /**
   * Returns the rotation between two entities.
   * @param {Phantom2DEntity} source - The source entity.
   * @param {Phantom2DEntity} target - The target entity.
   * @returns {number} The radian rotation.
   */
  getRotTo(source, target) {
    if(source.x == null || source.y == null || target.x == null || target.y == null) throw new Error(`Requires x and y values. (missing keys: ${[findMissing(source, ["x", "y"]), findMissing(target, ["x", "y"])].flat(Infinity).join(", ")})`);
    const s = this.worldToScreen(source);
    const t = this.worldToScreen(target);
    const deltaX = t.x - s.x;
    const deltaY = t.y - s.y;
    const radians = Math.atan2(deltaY, deltaX);
    return radians;
  }
  /**
   * Returns the radian rotation from an entity to the mouse.
   * @param {Phantom2DEntity} source - The source.
   * @returns {number} The radian rotation.
   */
  getRotToMouse(source) {
    if(source.x == null || source.y == null) throw new Error(`Requires x and y values. (missing keys: ${findMissing(source, ["x", "y"]).join(", ")})`);
    const srcScreen = this.worldToScreen(source);
    const deltaX = this.mousePos.x - srcScreen.x;
    const deltaY = this.mousePos.y - srcScreen.y;
    const radians = Math.atan2(deltaY, deltaX);
    return radians;
  }
  /**
   * Applies an event listener to the canvas.
   * @param {string} name - The event name.
   * @param {function} exec - The event executor.
   */
  addEvent(name, exec) {
    this._events[name] = exec;
    this.canvas.addEventListener(name, exec);
  }
  /**
   * Removes an event listener from the canvas.
   * @param {string} name - The event name.
   */
  remEvent(name) {
    if(this._events[name]) {
      const exec = this._events[name];
      this.canvas.removeEventListener(name, exec);
      delete this._events[name];
    }
  }
  /**
   * Returns the width of the canvas.
   * @returns {number} The width of the canvas.
   */
  width() {
    return this.canvas.width;
  }
  /**
   * Returns the height of the canvas.
   * @returns {number} The height of the canvas.
   */
  height() {
    return this.canvas.height;
  }
  /**
   * Generates a raycast.
   * @param {{ x: number, y: number }} origin - The start position.
   * @param {number} angle - The radian.
   * @param {number} maxDist - The distance it can travel before being cut off.
   * @param {function} filter - A filter for components.
   * @returns {{ closestDist: number, closestHit: { object: Phantom2DEntity, point: { x: number, y: number }, distance: number|null } }} The result of the raycast.
   */
  raycast(origin, angle, maxDist = Infinity, filter = () => true) {
    const rayDir = { x: Math.cos(angle), y: Math.sin(angle) };
    let closestHit = null;
    let closestDist = maxDist;
    for(const comp of this.#components) {
      if(!filter(comp)) continue;
      const hit = rayIntersectsRect(origin, rayDir, comp);
      if(hit != null && hit < closestDist) {
        closestDist = hit;
        closestHit = {
          object: comp,
          point: {
            x: origin.x + rayDir.x * hit,
            y: origin.y + rayDir.y * hit
          },
          distance: hit
        };
      }
    }
    return closestHit;
  }
  /**
   * Draws a raycast.
   * @param {{ x: number, y: number }} origin - The start position.
   * @param {number} angle - The radian angle.
   * @param {number} dist - The max distance it can travel.
   * @param {number} colour - The colour to draw.
   */
  debugRay(origin, angle, dist, colour) {
    this.ctx.strokeStyle = colour;
    this.ctx.beginPath();
    this.ctx.moveTo(origin.x, origin.y);
    this.ctx.lineTo(origin.x + Math.cos(angle) * dist, origin.y + Math.sin(angle) * dist);
    this.ctx.stroke();
  }
  /**
   * Renders an image as the background.
   * @param {string} path - The image path.
   */
  imgBg(path) {
    this.img(0, 0, this.canvas.width, this.canvas.height, path);
  }
  // bake() {
  //   const lights = this.#components.slice(0).filter(component => is(component, Light));
  //   lights.forEach(light => {
  //     const { x, y, reach, color } = light;
  //     // Create a radial gradient for the light
  //     const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, reach);
  //     gradient.addColorStop(0, color); // Inner part of the light
  //     gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Fades to transparent at the edge
  //     // Set the composite operation to 'lighter' for additive blending
  //     this.ctx.globalCompositeOperation = "lighter";
  //     // Draw the light area using the gradient
  //     this.ctx.fillStyle = gradient;
  //     this.ctx.beginPath();
  //     this.ctx.arc(x, y, reach, 0, Math.PI * 2);
  //     this.ctx.fill(); 
  //   });
  //   // Reset composite operation to default
  //   this.ctx.globalCompositeOperation = "source-over";
  // }
  /**
   * Applies a focus effect to the target.
   * @param {Phantom2DEntity} target - The thing to focus.
   */
  focus(target) {
    if(target.x == null || target.y == null) throw new Error(`Requires x and y values. (missing keys: ${findMissing(target, ["x", "y"]).join(", ")})`);
    this.#focusTarget = target;
  }
  /**
   * Stops focusing.
   */
  unfocus() {
    this.#focusTarget = null;
  }
  // scale(scaleFactor) {
  //   this.scaleFactor = scaleFactor;
  // }
  /**
   * Stores a new animation.
   * @param {string} name - The name of this animation.
   * @param  {...string} frames - The frames for this animation.
   * @deprecated Do not use.
   */
  storeAnim(name, ...frames) {
    let animStore = [];
    for(const frame of frames) {
      const img = new Image();
      img.src = frame.src;
      animStore.push(img);
    }
    this.#anims[name] = animStore;
  }
  /**
   * Returns an animation.
   * @param {string} name - The name of the animation.
   * @returns {HTMLImageElement[]|undefined} The frames.
   * @deprecated Do not use.
   */
  getAnim(name) {
    return this.#anims[name];
  }
  /**
   * Removes an animation.
   * @param {string} name - The name of the animation.
   * @deprecated Do not use.
   */
  remAnim(name) {
    delete this.#anims[name];
  }
  /**
   * Applies an animation.
   * @param {{ target: Phantom2DEntity, width: number, height: number, spd: number, name: string }} settings - The settings to use.
   * @deprecated Do not use.
   */
  applyAnim(settings) {
    if(!expect(settings, ["target", "width", "height", "spd", "name"])) throw new Error(`Missing keys in settings. (missing: ${findMissing(settings, ["target", "width", "height", "spd", "name"].join(", "))})`);
    const { target, width, height, spd, name } = settings;
    const anim = this.#anims[name];
    let loopCount = 0;
    async function runAnim() {
      loopCount++;
      for(let i = 0; i < anim.length; i++) {
        this.img(target.x, target.y, width, height, anim[i]);
        await wait(spd);
      }
      if(settings.repeat == true) {
        if(settings.loop) {
          if(settings.loop > loopCount) runAnim();
        }
        else runAnim();
      }
    }
    runAnim();
  }
  /**
   * Downloads the components into a JSON file.
   * @param {string} name - The filename.
   */
  download(name) {
    const json = JSON.stringify(this.#components, null, 4);
    download(json, "application/json", name, "json");
  }
  /**
   * Saves a new level.
   * @param {string} name - The name of the level.
   * @param {Phantom2DEntity[]|undefined} content - The content to be saved. Defaults to the current components.
   */
  saveLevel(name, content = this.#components) {
    this.#levels[name] = content;
  }
  /**
   * Removes a saved level.
   * @param {string} name - The name of the level.
   */
  deleteLevel(name) {
    delete this.#levels[name];
  }
  /**
   * Returns whether a level with that name already exists.
   * @param {string} name - The name of the level.
   * @returns {boolean} If the level exists.
   */
  levelExists(name) {
    return this.#levels[name] != undefined;
  }
  /**
   * Returns the data associated with a level.
   * @param {string} name - The level to find.
   * @returns {Phantom2DEntity[]|undefined} The data of the level.
   */
  getLevel(name) {
    return this.#levels[name];
  }
  /**
   * Downloads the levels cache into a JSON file.
   * @param {string} name - The filename.
   */
  saveLevelCache(name) {
    const json = JSON.stringify(this.#levels, null, 4);
    download(json, "application/json", name, "json");
  }
  /**
   * Loads a level into the components cache.
   * 
   * Overwrites the current component cache.
   * @param {string} name - The level to load.
   */
  loadLevel(name) {
    this.#components = this.#levels[name];
  }
  getPixel(x, y) {
    const { data } = this.ctx.getImageData(x, y, 1, 1);
    return {
      r: data[0],
      g: data[1],
      b: data[2],
      a: data[3]
    };
  }
  setPixel(rgba, x, y) {
    if(!expect(rgba, "r", "g", "b", "a")) throw new Error(`Missing keys in set pixel rgba settings. (missing: ${findMissing(rgba, "r", "g", "b", "a").join(", ")})`);
    const { data } = this.ctx.getImageData(x, y, 1, 1);
    const { r, g, b, a } = rgba;
    data[0] = r;
    data[1] = g;
    data[2] = b;
    data[3] = a;
    this.ctx.putImageData(data, x, y);
  }
}
/**
 * A function to check if there is a collision between two entities.
 * @param {Phantom2DEntity} object1 
 * @param {Phantom2DEntity} object2 
 * @returns {boolean} Whether there is a collision or not.
 */
function isColliding(object1, object2) {
  const obj1W = object1.width;
  const obj1H = object1.height;
  const obj1X = object1.x;
  const obj1Y = object1.y;
  const obj2W = object2.width;
  const obj2H = object2.height;
  const obj2X = object2.x;
  const obj2Y = object2.y;
  return obj2X < obj1X + obj1W && obj2X + obj2W > obj1X && obj2Y < obj1Y + obj1H && obj2Y + obj2H > obj1Y;
}
/**
 * Returns whether an intersection occurs with a rectangle with a ray.
 * @param {{ x: number, y: number }} rayOrigin - The origin of the raycast.
 * @param {number} rayDir - The direction the ray is travelling in.
 * @param {{ x: number, y: number, width: number, height: number }} rect - The rectangle to check.
 * @returns {number|null} The hit distance.
 */
function rayIntersectsRect(rayOrigin, rayDir, rect) {
  const t1 = (rect.x - rayOrigin.x) / rayDir.x;
  const t2 = (rect.x + rect.width - rayOrigin.x) / rayDir.x;
  const t3 = (rect.y - rayOrigin.y) / rayDir.y;
  const t4 = (rect.y + rect.height - rayOrigin.y) / rayDir.y;

  const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
  const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

  if(tmax < 0 || tmin > tmax) return null; // No hit
  return tmin >= 0 ? tmin : tmax; // Nearest intersection distance
}

/**
 * Assorted game tools for development.
 */
const GameTools = {
  /**
   * Applies a WASD movement set to a playable character.
   * @param {PlayableCharacter} character - The character to apply to.
   * @param {number} speed - The speed to apply.
   */
  useWASD: (character, speed) => {
    if(!is(character, PlayableCharacter)) throw new Error("Cannot apply keybinds to non-playable character.");
    character.setBind("w", character.jump(speed));
    character.setBind("a", character.moveX(-speed));
    character.setBind("d", character.moveX(speed));
  },
  /**
   * Applies health values to an entity.
   * @param {Phantom2DEntity} ent - The entity to apply to.
   * @param {number} hp - The amount of health to start with.
   * @param {number} maxHP - The maximum amount of health point.
   * @param {function} onDeath - A function to run when the component dies.
   * @param {function} onHurt - A function to run when the component dies.
   */
  useHealth: (ent, hp, maxHP, onDeath, onHurt = () => {}) => {
    if(!is(ent, Phantom2DEntity)) throw new Error("Cannot apply health component to non-Phantom2DEntity.");
    /**
     * The entities health.
     * @prop
     * @type {number}
     */
    ent.hp = hp;
    /**
     * The maximum health the entity can have.
     * @prop
     * @type {number}
     */
    ent.maxHP = maxHP;
    /**
     * A function that returns the amount of health the entity currently has.
     * @returns {number} The current health points.
     */
    ent.getHP = () => ent.hp;
    /**
     * A function that sets the amount of health the entity currently has.
     * 
     * Does not trigger health update check.
     * @param {number} nhp - The new health points
     * @returns {number} The new health the entity has.
     */
    ent.setHP = (nhp) => ent.hp = nhp;
    /**
     * A function to return the maximum health points an entity has.
     * @returns {number} The maximum health the entity has.
     */
    ent.getMaxHP = () => ent.maxHP;
    /**
     * A function to set the maximum health the entity has.
     * 
     * Does not clamp health to within new range.
     * @param {number} nmhp - The new maximum health.
     * @returns {number} The new maximum health.
     */
    ent.setMaxHP = (nmhp) => ent.maxHP = nmhp;
    /**
     * The function to be called when the entity dies.
     * @prop
     * @type {function}
     */
    ent.onDeath = onDeath;
    /**
     * A function to be called when the entity is hurt.
     * @prop
     * @type {function}
     */
    ent.onHurt = onHurt;
    /**
     * A function that injures the entity, removing health.
     * 
     * If the entity's health falls below zero after being hurt, the entity is killed.
     * 
     * Runs the entity's onHurt.
     * @param {number} d - The injury health to apply.
     */
    ent.hurt = (d) => {
      ent.hp -= d;
      ent.onHurt();
      if(ent.hp <= 0) ent.die();
    }
    /**
     * A function that kills the entity.
     * 
     * Runs the entity's onDeath.
     */
    ent.die = () => {
      ent.onDeath();
    }
    /**
     * Applies healing to the entity.
     * 
     * Clamps health to maximum health points.
     * @param {number} h - The healing to add.
     */
    ent.heal = (h) => {
      ent.hp += h;
      ent.hp = Math.min(ent.hp, ent.maxHP);
    }
  },
  /**
   * Applies an inventory to a character.
   * @param {Character} character - The character to apply to.
   * @param {Map<string, Object>} items - The items to start with.
   */
  useInv: (character, items = {}) => {
    if(!is(character, PlayableCharacter)) throw new Error("Cannot apply inventory component to non-character.");
    /**
     * The character's inventory.
     * @prop
     * @type {Map<string, Object>}
     */
    character.inv = items;
    /**
     * Returns the value of an inventory item.
     * @param {string} key - The name of the item.
     * @returns {Object|undefined} The item.
     */
    character.invGet = (key) => character.inv[key];
    /**
     * Sets the value of an inventory item.
     * @param {string} key - The name of the item.
     * @param {Object} value - The item.
     * @returns {Object} The new value of the inventory slot.
     */
    character.invSet = (key, value) => character.inv[key] = value;
    /**
     * Returns whether the inventory already has the item slot.
     * @param {string} key - The name of the item.
     * @returns {boolean} Whether it is contained or not.
     */
    character.invHas = (key) => Object.hasOwn(character.inv, key);
    /**
     * Removes an inventory slot.
     * @param {string} key - The name of the item.
     * @returns {undefined} The now empty missing slot.
     */
    character.invRem = (key) => delete character.inv[key];
    /**
     * Reuturns the size of the inventory.
     * @returns {number} The size of the inventory.
     */
    character.invSize = () => Object.entries(character.inv).length;
  }
};

export { Scene, SceneObject, StaticObject, PhysicsObject, MovingObject, BouncyObject, BulletObject, WallObject, TextObject, Vector, PlayableCharacter, NonPlayableCharacter, Audio, Spawner, HomingBulletObject, ButtonObject, Phantom2DEntity, GameTools, random, isColliding, wait, getRemoteImg, getRemoteAudio, download, downloadJSON, is };
