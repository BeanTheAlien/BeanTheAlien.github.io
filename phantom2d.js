var _a;
/**
 * Various utilities.
 * @since v0.0.0
 */
class Util {
    static str(o, space) {
        return JSON.stringify(o, null, space);
    }
    static clamp(n, min, max) {
        return Math.min(Math.max(n, min), max);
    }
    static strOf(o) {
        return typeof o == "string" ? o : Util.str(o);
    }
}
class ArrayUtil {
    static add(arr, ...items) {
        arr.push(...items);
    }
    static rm(arr, ...items) {
        for (const i of items) {
            if (ArrayUtil.has(arr, i)) {
                arr.splice(arr.indexOf(i), 1);
            }
        }
    }
    static has(arr, ...items) {
        return items.every(i => arr.includes(i));
    }
}
/**
 * A simple, no-exec function shorthand.
 * @since v0.0.0
 */
const NoFunc = (() => { });
/**
 * A simplified class for creating errors.
 * @since v1.0.5
 */
class ErrRoot extends Error {
    constructor(name, msg) {
        super(msg);
        this.name = name;
    }
}
/**
 * Thrown when `CanvasRenderingContext2D` cannot be gotten.
 * @since v0.0.0
 */
class NoContextError extends ErrRoot {
    constructor() {
        super("NoContextError", "Cannot get context 2D.");
    }
}
/**
 * Thrown when the `Scene` constructor does not receive an `HTMLCanvasElement` or `HTMLElement`.
 * @since v0.0.0
 * @example
 * ```
 * const el = document.getElementById("not-exists")
 * const scene = new Scene({ canvas: el }); // cannot convert undefined to HTMLCanvasElement
 * ```
 */
class NoCanvasError extends ErrRoot {
    constructor() {
        super("NoCanvasError", "Did not receive HTMLCanvasElement or HTMLElement in scene.");
    }
}
/**
 * Thrown when attempting to run a process while it's running.
 * @since v0.0.0
 * @example
 * ```
 * const rt = new Runtime();
 * rt.start(() => {}); // started process
 * rt.start(() => {}); // process already started
 * ```
 */
class ExistingProcessError extends ErrRoot {
    constructor() {
        super("ExistingProcessError", "A process already exists, cannot create new process.");
    }
}
/**
 * Thrown when attempting to stop a process that does not exist.
 * @since v0.0.0
 * @example
 * ```
 * const rt = new Runtime();
 * rt.stop(); // no process has been started
 * ```
 */
class NoProcessError extends ErrRoot {
    constructor() {
        super("NoProcessError", "A process does not exist.");
    }
}
/**
 * Thrown by trying to use a component that's already in use.
 * @since v0.0.0
 * @example
 * ```
 * const ent = new Entity({});
 * ent.use("health"); // use HealthComp
 * ent.use("health"); // cannot use again
 * ```
 */
class AlreadyUsingError extends ErrRoot {
    constructor() {
        super("AlreadyUsingError", "Already using this component, cannot use again.");
    }
}
/**
 * Thrown when a component requires a reference to the scene, but there is none.
 *
 * Only thrown during `Comp.protoype.update`.
 * @since v0.0.0
 * @example
 * ```
 * const canvas = document.getElementById("canvas");
 * const scene = new Scene({ canvas });
 * const ent = new Entity({});
 * ent.use("sprite", { frames: ["frame0.jpg"] }); // no scene property
 * scene.add(ent);
 * scene.start(); // cannot render without scene
 * ```
 */
class NoSceneAvailableError extends ErrRoot {
    constructor() {
        super("NoSceneAvailableError", "A component requires a scene reference, but none was provided.");
    }
}
/**
 * Thrown when attempting to get a crucial value and failed.
 *
 * Caused when an index exceeds the length of an array.
 * @since v0.0.0
 * @example
 * ```
 * const canvas = document.getElementById("canvas");
 * const scene = new Scene({ canvas });
 * const ent = new Entity({});
 * ent.use("sprite", { scene: canvas }); // no frames property (frames[0] is undefined)
 * scene.add(ent);
 * scene.start(); // throws error on first tick of ent
 * ```
 */
class OutOfBoundsError extends ErrRoot {
    constructor() {
        super("OutOfBoundsError", "Index exceeds length; could not get crucial value.");
    }
}
/**
 * A storage for items.
 * @since v0.0.0
 */
class Store {
    store;
    constructor() {
        this.store = new Map();
    }
    /**
     * Retrieves an entry.
     * @param key The key to get.
     * @returns The entry (or nothing).
     * @since v0.0.0
     */
    get(key) {
        return this.store.get(key);
    }
    /**
     * Sets an entry.
     * @param key The key to set.
     * @param value The value of the new entry.
     * @since v0.0.0
     */
    set(key, value) {
        this.store.set(key, value);
    }
    /**
     * Returns whether this store contains an item.
     * @param key The key to get.
     * @returns If this item is contained.
     * @since v0.0.0
     */
    has(key) {
        return this.store.has(key);
    }
    /**
     * Removes an entry from this storage.
     * @param key The key to delete.
     * @returns If the key was deleted.
     * @since v0.0.0
     */
    del(key) {
        return this.store.delete(key);
    }
    /**
     * Returns an iterator for this keys.
     * @returns The iterator.
     * @since v0.0.0
     */
    keys() {
        return this.store.keys();
    }
    /**
     * Returns an iterator for this values.
     * @returns The iterator.
     * @since v0.0.0
     */
    values() {
        return this.store.values();
    }
    /**
     * Returns an iterator for this entries.
     * @returns The iterator.
     * @since v0.0.0
     */
    items() {
        return this.store.entries();
    }
}
/**
 * A metaphorical "box" of items.
 *
 * Useful for array-based classes.
 * @since v1.0.8
 */
class ItemBox {
    stuff;
    constructor() {
        this.stuff = [];
    }
    add(...stuff) {
        ArrayUtil.add(this.stuff, ...stuff);
    }
    rm(...stuff) {
        ArrayUtil.rm(this.stuff, ...stuff);
    }
    forEach(cb) {
        this.stuff.forEach(cb);
    }
    has(...stuff) {
        return ArrayUtil.has(this.stuff, ...stuff);
    }
    find(cb) {
        return this.stuff.find(cb);
    }
    filter(cb) {
        return this.stuff.filter(cb);
    }
    some(cb) {
        return this.stuff.some(cb);
    }
}
/**
 * The synthetic event class.
 * @since v0.0.0
 */
class PhantomEvent {
    name;
    constructor(name) {
        this.name = name;
    }
}
/**
 * Fired when this first constructs.
 * @since v0.0.0
 */
class PhantomAliveEvent extends PhantomEvent {
    constructor() { super("alive"); }
}
/**
 * Fired when this ent is added to the scene.
 * @since v0.0.0
 */
class PhantomAddedEvent extends PhantomEvent {
    constructor() { super("added"); }
}
/**
 * Fired when this ent is removed from the scene.
 * @since v0.0.0
 */
class PhantomRemovedEvent extends PhantomEvent {
    constructor() { super("removed"); }
}
/**
 * Fired when this ent takes damage.
 * @since v0.0.0
 */
class PhantomHealthCompHurtEvent extends PhantomEvent {
    constructor() { super("hurt"); }
}
/**
 * Fired when this ent dies.
 * @since v0.0.0
 */
class PhantomHealthCompDieEvent extends PhantomEvent {
    constructor() { super("die"); }
}
/**
 * Fired when this ent heals.
 * @since v0.0.0
 */
class PhantomHealthCompHealEvent extends PhantomEvent {
    constructor() { super("heal"); }
}
class PhantomDestroyedEvent extends PhantomEvent {
    constructor() { super("destroyed"); }
}
/**
 * The component class.
 * @since v0.0.0
 */
class Comp {
    ent;
    constructor(ent) {
        this.ent = ent;
    }
    /**
     * Consumes an event.
     * @param k The event type.
     * @param e The event.
     * @since v0.0.0
     */
    consume(k, e) {
        this.ent.consume(k, e);
    }
    /**
     * The updater for this component.
     *
     * Called during `update`.
     * @since v0.0.0
     */
    upd() { }
}
/**
 * A simple health component.
 * @since v0.0.0
 */
class HealthComp extends Comp {
    hp;
    mhp;
    onHurt;
    onDie;
    onHeal;
    constructor(ent, opts) {
        super(ent);
        this.hp = opts.hp ?? 0;
        this.mhp = opts.mhp;
        this.onHurt = opts.onHurt;
        this.onDie = opts.onDie;
        this.onHeal = opts.onHeal;
    }
    /**
     * Hurts this entity.
     * @param dmg The damage to receive.
     * @since v0.0.0
     */
    hurt(dmg) {
        this.hp -= dmg;
        this.#consume(this.onHurt, "hurt", new PhantomHealthCompHurtEvent());
        if (this.hp <= 0)
            this.die();
    }
    /**
     * Kills this entity.
     * @since v0.0.0
     */
    die() {
        this.#consume(this.onDie, "die", new PhantomHealthCompDieEvent());
    }
    /**
     * Heals this entity.
     * @param hp The health to heal.
     * @since v0.0.0
     */
    heal(hp) {
        this.hp += hp;
        if (this.mhp)
            this.hp = Math.min(this.hp, this.mhp);
        this.#consume(this.onHeal, "heal", new PhantomHealthCompHealEvent());
    }
    /**
     * If the handle exists, use the handle.
     *
     * Else, consume the event.
     * @param fn The handle.
     * @param k The event type.
     * @param e The event.
     * @since v0.0.0
     */
    #consume(fn, k, e) {
        if (fn)
            fn(e);
        else
            this.consume(k, e);
    }
}
/**
 * A simple inventory system.
 * @since v0.0.0
 */
class InvComp extends Comp {
    size;
    inv;
    constructor(ent, opts) {
        super(ent);
        this.size = opts.size;
        this.inv = [];
    }
    /**
     * Adds new items.
     * @param items The items to add.
     * @since v0.0.0
     */
    add(...items) {
        ArrayUtil.add(this.inv, ...items);
        if (this.size && this.inv.length > this.size)
            this.inv.length = this.size;
    }
    /**
     * Removes items.
     * @param items The items to remove.
     * @since v0.0.0
     */
    rm(...items) {
        ArrayUtil.rm(this.inv, ...items);
    }
    /**
     * Tests if this inventory contains the items passed.
     * @param items The items to check.
     * @returns If it contains all the items.
     * @since v0.0.0
     */
    has(...items) {
        return ArrayUtil.has(this.inv, ...items);
    }
    /**
     * Returns the index of an item.
     * @param i The item.
     * @returns The index.
     * @since v0.0.0
     */
    idxOf(i) {
        return this.inv.indexOf(i);
    }
    /**
     * Returns the length of the inventory.
     * @returns The length.
     * @since v0.0.0
     */
    len() {
        return this.inv.length;
    }
    /**
     * Returns an item at the index.
     * @param i The index.
     * @returns The item.
     * @since v0.0.0
     */
    at(i) {
        return this.inv[i];
    }
}
/**
 * A displayable sprite, packages multiple image frames to use.
 * @since v0.0.0
 */
class SpriteComp extends Comp {
    frames;
    scene;
    idx;
    constructor(ent, opts) {
        super(ent);
        this.frames = (opts.frames ?? []).map(Img.from);
        this.scene = opts.scene;
        this.idx = 0;
    }
    frame(idx) {
        this.idx = idx;
    }
    at(idx) {
        return this.frames[idx];
    }
    cur() {
        return this.at(this.idx);
    }
    add(...items) {
        ArrayUtil.add(this.frames, ...items);
    }
    rm(...items) {
        ArrayUtil.rm(this.frames, ...items);
    }
    upd() {
        if (!this.scene)
            throw new NoSceneAvailableError();
        const c = this.cur();
        if (!c)
            throw new OutOfBoundsError();
        this.scene.img(c, this.ent.x, this.ent.y, this.ent.width, this.ent.height);
    }
}
class PointAtCompBase extends Comp {
    scene;
    constructor(ent, opts) {
        super(ent);
        this.scene = opts.scene;
    }
}
class PointAtComp extends PointAtCompBase {
    point;
    constructor(ent, opts) {
        super(ent, opts);
        this.point = opts.point;
    }
    link(ent) {
        this.point = ent;
    }
    unlink() {
        this.point = undefined;
    }
    upd() {
        if (!this.scene)
            throw new NoSceneAvailableError();
        if (!this.point)
            return console.warn("No linked entity! Please add a link.");
        this.ent.setRot(this.scene.rotBtwn(this.ent, this.point));
    }
}
class PointAtMouseComp extends PointAtCompBase {
    constructor(ent, opts) {
        super(ent, opts);
    }
    upd() {
        if (!this.scene)
            throw new NoSceneAvailableError();
        this.ent.setRot(this.scene.rotToMouse(this.ent));
    }
}
class EnhancedPhysicsComp extends Comp {
    scene;
    vx;
    vy;
    ax;
    ay;
    fric;
    constructor(ent, opts) {
        super(ent);
        this.scene = opts.scene;
        // represent inital velocity and acceleration
        // recommended to remain at 0
        this.vx = opts.vx ?? 0;
        this.vy = opts.vy ?? 0;
        this.ax = opts.ax ?? 0;
        this.ay = opts.ay ?? 0;
        this.fric = opts.fric ?? 0.95;
    }
    addForce(fx, fy) {
        this.ax += fx;
        this.ay += fy;
    }
    addForceX(fx) {
        this.addForce(fx, 0);
    }
    addForceY(fy) {
        this.addForce(0, fy);
    }
    upd() {
        if (!this.scene)
            throw new NoSceneAvailableError();
        // add accl
        this.vx += this.ax;
        this.vy += this.ay;
        // dampen velocity with friction
        this.vx *= this.fric;
        this.vy *= this.fric;
        // add vel to pos
        this.ent.x += this.vx;
        this.ent.y += this.vy;
        // clear accl
        this.ax = 0;
        this.ay = 0;
    }
}
class GravityComp extends Comp {
    strength;
    gspd;
    constructor(ent, opts) {
        super(ent);
        this.strength = opts.strength ?? 0;
        this.gspd = opts.gspd ?? 0;
    }
    upd() {
        this.gspd += this.strength;
        const vec = Angle.toVector(Scene.config.get("gravdir") ?? Angle.rad(270));
        this.ent.x += vec.x * this.gspd;
        this.ent.y += vec.y * this.gspd;
    }
}
class ArcMoveOrbitComp extends Comp {
    origin;
    spd;
    angle;
    rad;
    constructor(ent, opts) {
        super(ent);
        this.origin = opts.origin ?? new Vector(0, 0);
        this.spd = opts.spd ?? 0;
        this.angle = opts.angle ?? 0;
        this.rad = opts.rad ?? 0;
    }
    upd() {
        // calculate angular velocity
        const ang = this.spd / this.rad;
        this.angle += ang;
        // update transform
        this.ent.x = this.origin.x + this.rad * Math.cos(this.angle);
        this.ent.y = this.origin.y + this.rad * Math.sin(this.angle);
    }
}
class ArcMoveSlingComp extends Comp {
    strength;
    vx;
    vy;
    constructor(ent, opts) {
        super(ent);
        this.strength = opts.strength ?? 0;
        this.vx = 0;
        this.vy = 0;
    }
    launch(spd, angle) {
        this.vx = spd * Math.cos(angle);
        this.vy = -spd * Math.sin(angle);
    }
    upd() {
        this.vy += this.strength;
        this.ent.x += this.vx;
        this.ent.y += this.vy;
    }
}
/**
 * The record used to create components.
 * @since v0.0.0
 */
const PhantomCompRecord = {
    health: HealthComp,
    inv: InvComp,
    sprite: SpriteComp,
    pointat: PointAtComp,
    pointatmouse: PointAtMouseComp,
    enhancedphys: EnhancedPhysicsComp,
    grav: GravityComp,
    arcmoveorbit: ArcMoveOrbitComp,
    arcmovesling: ArcMoveSlingComp
};
/**
 * The class used for creating components for the scene.
 * @since v0.0.0
 */
class SceneComp {
    scene;
    constructor(scene) {
        this.scene = scene;
    }
}
/**
 * A simple tile display for the scene.
 * @since v0.0.0
 */
class SceneTilesComp extends SceneComp {
    size;
    nth;
    constructor(scene, opts) {
        super(scene);
        this.size = opts.size ?? 0;
        this.nth = opts.nth;
    }
}
/**
 * The record used to create scene components.
 * @since v0.0.0
 */
const PhantomSceneCompRecord = {
    tiles: SceneTilesComp
};
/**
 * A map of shorthands to browser keys.
 * @since v0.0.0
 */
const KeyCodeMap = {
    "a": "KeyA", "b": "KeyB", "c": "KeyC", "d": "KeyD", "e": "KeyE", "f": "KeyF",
    "g": "KeyG", "h": "KeyH", "i": "KeyI", "j": "KeyJ", "k": "KeyK", "l": "KeyL",
    "m": "KeyM", "n": "KeyN", "o": "KeyO", "p": "KeyP", "q": "KeyQ", "r": "KeyR",
    "s": "KeyS", "t": "KeyT", "u": "KeyU", "v": "KeyV", "w": "KeyW", "x": "KeyX",
    "y": "KeyY", "z": "KeyZ",
    "1": "Digit1", "2": "Digit2", "3": "Digit3", "4": "Digit4", "5": "Digit5",
    "6": "Digit6", "7": "Digit7", "8": "Digit8", "9": "Digit9",
    "shift": ["ShiftLeft", "ShiftRight"], "lshift": "ShiftLeft", "rshift": "ShiftRight",
    "ctrl": ["ControlLeft", "ControlRight"], "lctrl": "ControlLeft", "rctrl": "ControlRight",
    "alt": ["AltLeft", "AltRight"], "lalt": "AltLeft", "ralt": "AltRight",
    "f1": "F1", "f2": "F2", "f3": "F3", "f4": "F4", "f5": "F5", "f6": "F6", "f7": "F7",
    "f8": "F8", "f9": "F9", "f10": "F10", "f11": "F11", "f12": "F12",
    "esc": "Escape", "tab": "Tab", "back": "Backspace", "bkquote": "Backquote", "quote": "Quote",
    "comma": "Comma", "dot": "Period", "fslash": "Slash", "bslash": "Backslash",
    "caps": "CapsLock", "ctx": "ContextMenu", "meta": ["MetaLeft", "MetaRight"],
    "lmeta": "MetaLeft", "rmeta": "MetaRight", "ent": "Enter", "ins": "Insert",
    "del": "Delete", "home": "Home", "pgu": "PageUp", "pgd": "PageDown", "numlk": "NumLock",
    "end": "End", "pause": "Pause", "scrlk": "ScrollLock", "ndiv": "NumpadDivide",
    "nmult": "NumpadMultiply", "nsub": "NumpadSubtract", "nadd": "NumpadAdd",
    "nent": "NumpadEnter", "ndel": "NumpadDecimal",
    "n7": "Numpad7", "n8": "Numpad8", "n9": "Numpad9", "n4": "Numpad4", "n5": "Numpad5",
    "n6": "Numpad6", "n1": "Numpad1", "n2": "Numpad2", "n3": "Numpad3", "n0": "Numpad0",
    "space": "Space", "arw": ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
    "arwl": "ArrowLeft", "arwr": "ArrowRight", "arwu": "ArrowUp", "arwd": "ArrowDown"
};
/**
 * The reverse map of browser keys to shorthands.
 * @since v0.0.0
 */
const KeyCodeMapReverse = {};
for (const [k, v] of Object.entries(KeyCodeMap)) {
    if (Array.isArray(v))
        continue;
    KeyCodeMapReverse[v] = k;
}
/**
 * The root class of all entities, providing base functionality.
 * @since v0.0.0
 */
class Entity {
    static defaults;
    /**
     * Fired when this object collides with another.
     * @since v0.0.0
     */
    collide;
    /**
     * A special function that is called during `update`.
     * @since v0.0.0
     */
    upd;
    /**
     * The x-coordinate.
     * @since v0.0.0
     */
    x;
    /**
     * The y-coordinate.
     * @since v0.0.0
     */
    y;
    /**
     * The rotation, in radians.
     * @since v0.0.0
     */
    rot;
    /**
     * The displayed width, in pixels.
     * @since v0.0.0
     */
    width;
    /**
     * The displayed height, in pixels.
     * @since v0.0.0
     */
    height;
    /**
     * The display color.
     * @since v0.0.0
     */
    color;
    /**
     * The storage for listeners for events.
     * @since v0.0.0
     */
    evStore;
    comps;
    moveMode;
    evMng;
    initState;
    tags;
    child;
    constructor(opts) {
        this.collide = opts?.collide ?? ((o) => { });
        this.upd = opts?.upd ?? NoFunc;
        this.x = opts?.x ?? Entity.defaults.get("x") ?? 0;
        this.y = opts?.y ?? Entity.defaults.get("y") ?? 0;
        this.rot = opts?.rot ?? Entity.defaults.get("rot") ?? 0;
        this.width = opts?.width ?? Entity.defaults.get("width") ?? 0;
        this.height = opts?.height ?? Entity.defaults.get("height") ?? 0;
        this.evStore = new Store();
        this.color = opts?.color ?? Entity.defaults.get("color") ?? "#fff";
        if (opts?.custom)
            for (const [k, v] of Object.entries(opts.custom)) {
                this[k] = v;
            }
        this.comps = new Store();
        this.moveMode = opts?.moveMode ?? "move";
        this.evMng = new PhantomEventManager(this, this.evStore);
        this.tags = new TagList();
        this.initState = new SavedState(this, "The state this object was in, at the time of construction.");
        this.child = new ItemBox();
    }
    setPos(x, y) {
        if (typeof x == "number" && typeof y == "number") {
            this.x = x;
            this.y = y;
        }
        else if (x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
    }
    /**
     * Sets the rotation.
     * @param rad The new rotation.
     * @since v0.0.0
     */
    setRot(rad) {
        this.rot = rad;
    }
    /**
     * Sets the width.
     * @param w The new width.
     * @since v0.0.0
     */
    setWidth(w) {
        this.width = w;
    }
    /**
     * Sets the height.
     * @param h The new height.
     * @since v0.0.0
     */
    setHeight(h) {
        this.height = h;
    }
    /**
     * Returns a `Vector` object of the forward vector.
     * @returns {Vector} The forward vector.
     * @since v0.0.0
     */
    getFVec() {
        const dx = Math.cos(this.rot);
        const dy = Math.sin(this.rot);
        return new Vector(dx, dy);
    }
    /**
     * Moves a distance on an axis.
     * @param dist The distance to move.
     * @param axis The axis to move on.
     * @since v0.0.0
     */
    move(dist, axis) {
        if (this.moveMode == "fixed")
            return console.warn("Cannot move this entity, because it has a 'fixed' move mode.");
        if (axis == "x" || axis == 0)
            this.x += dist;
        else if (axis == "y" || axis == 1)
            this.y += dist;
    }
    /**
     * Moves a distance on the x-axis.
     * @param dist The distance to move.
     * @since v0.0.0
     */
    moveX(dist) {
        this.move(dist, "x");
    }
    /**
     * Moves a distance on the y-axis.
     * @param dist The distance to move.
     * @since v0.0.0
     */
    moveY(dist) {
        this.move(dist, "y");
    }
    /**
     * Clamps this position to a range.
     * @param min The min value.
     * @param max The max value.
     * @param axis The axis to clamp.
     * @since v0.0.0
     */
    clampPos(min, max, axis) {
        if (axis == "x" || axis == 0)
            this.x = Util.clamp(this.x, min, max);
        else if (axis == "y" || axis == 1)
            this.y = Util.clamp(this.y, min, max);
    }
    /**
     * Clamps this x position to a range.
     * @param min The min value.
     * @param max The max value.
     * @since v0.0.0
     */
    clampPosX(min, max) {
        this.clampPos(min, max, "x");
    }
    /**
     * Clamps this y position to a range.
     * @param min The min value.
     * @param max The max value.
     * @since v0.0.0
     */
    clampPosY(min, max) {
        this.clampPos(min, max, "y");
    }
    /**
     * Returns a `Vector` representing this position.
     * @returns {Vector} This position.
     * @since v0.0.0
     */
    getPos() {
        return new Vector(this.x, this.y);
    }
    /**
     * Returns the x-coordinate.
     * @returns {number} This x-coordinate.
     * @since v0.0.0
     */
    getPosX() {
        return this.x;
    }
    /**
     * Returns the y-coordinate.
     * @returns {number} The y-coordinate.
     * @since v0.0.0
     */
    getPosY() {
        return this.y;
    }
    /**
     * Sets this x-coordinate.
     * @param x The new x.
     * @since v0.0.0
     */
    setPosX(x) {
        this.x = x;
    }
    /**
     * Sets this y-coordinate.
     * @param y The new y.
     * @since v0.0.0
     */
    setPosY(y) {
        this.y = y;
    }
    /**
     * Applies a listener for an event.
     * @param event The event type.
     * @param handle The handle.
     * @since v0.0.0
     */
    on(event, handle) {
        this.evMng.on(event, handle);
    }
    /**
     * Removes a listener for an event.
     * @param event The event type.
     * @param handle The event handle (or nothing, to remove all handles).
     * @since v0.0.0
     */
    off(event, handle) {
        this.evMng.off(event, handle);
    }
    /**
     * Consumes an event.
     * @param title The event type.
     * @param event The actual event.
     * @since v0.0.0
     */
    consume(title, event) {
        const handles = this.evStore.get(title);
        if (handles) {
            handles.forEach(h => h(event));
        }
    }
    /**
     * Returns this width.
     * @returns The width.
     * @since v0.0.0
     */
    getWidth() {
        return this.width;
    }
    /**
     * Returns this height.
     * @returns The height.
     * @since v0.0.0
     */
    getHeight() {
        return this.height;
    }
    /**
     * Called every frame, calls the update function.
     *
     * Also calls `Comp.prototype.upd` for every component.
     * @since v0.0.0
     */
    update() {
        this.upd();
        for (const c of this.comps.values()) {
            c.upd();
        }
    }
    /**
     * Returns the string representation of this object.
     * @returns This, as a string.
     * @since v0.0.0
     */
    toString() {
        return Util.str(this);
    }
    /**
     * Applies a preset.
     * @param preset The preset to apply.
     * @since v0.0.0
     */
    apply(preset) {
        preset.apply(this);
    }
    /**
     * Returns a new `Preset` from this.
     * @returns This, as a `Preset`.
     * @since v0.0.0
     */
    preset() {
        return new Preset(this);
    }
    /**
     * Returns the center coordinate.
     * @returns The center coordinate.
     * @since v0.0.0
     */
    center() {
        return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    }
    /**
     * Returns the real screen position (accounting for width and height).
     * @returns The screen position.
     * @since v0.0.0
     */
    scrPos() {
        return new Vector(this.x + this.width, this.y + this.height);
    }
    /**
     * Returns the real screen x (accounting for width).
     * @returns The screen x.
     * @since v0.0.0
     */
    scrX() {
        return this.scrPos().x;
    }
    /**
     * Retunrs the real screen y (accounting for height).
     * @returns The screen y.
     * @since v0.0.0
     */
    scrY() {
        return this.scrPos().y;
    }
    /**
     * Uses a component.
     * @param c The component type.
     * @param opts The arguments for the component.
     * @see {@link PhantomCompMap}
     * @since v0.0.0
     * @throws {AlreadyUsingError} If this component is already in use.
     */
    use(c, opts) {
        if (this.uses(c))
            throw new AlreadyUsingError();
        const _opts = (opts ?? {});
        this.comps.set(c, new (PhantomCompRecord[c])(this, _opts));
    }
    /**
     * Removes a component.
     * @param c The component type.
     * @see {@link PhantomCompMap}
     * @since v0.0.0
     */
    unuse(c) {
        this.comps.del(c);
    }
    /**
     * Returns whether this uses a component or not.
     * @param c The component type.
     * @returns If it is in use.
     * @since v0.0.0
     */
    uses(c) {
        return this.comps.has(c);
    }
    /**
     * Returns a reference to this component.
     * @param c The component type.
     * @returns The component (or `undefined`, if it's not in use).
     * @since v0.0.0
     */
    comp(c) {
        return this.comps.get(c);
    }
    getMoveMode() {
        return this.moveMode;
    }
    setMoveMode(m) {
        this.moveMode = m;
    }
    /**
     * Restores a saved state to this entity.
     * @param state The state to be restored.
     * @since v1.0.16
     * @example
     * ```
     * const ent = new Entity({ ... });
     * const state = ent.saveState();
     * ent.setPos(random(), random()); // assume pos is needed to stay the same
     * ent.restoreState(state); // back to normal
     * // note: this example also works with restoreInitState
     * ```
     */
    restoreState(state) {
        state.restore(this);
    }
    /**
     * Restores this `Entity` to the state it was in at the time of construction.
     * @since v1.0.13
     * @example
     * ```
     * const ent = new Entity({ ... });
     * messUpEnt(ent); // assuming this would mess up the entity in some way
     * ent.restoreInitState(); // back to normal
     * ```
     */
    restoreInitState() {
        this.restoreState(this.initState);
    }
    /**
     * Creates a saved state of this entity, which can be later restored.
     * @param desc The extended, optional description.
     * @returns A saved state of this entity.
     * @since v1.0.16
     */
    saveState(desc) {
        return new SavedState(this, desc);
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new Entity({});
            opts.apply(ent);
            return ent;
        }
        return new Entity(opts);
    }
    /**
     * Returns whether the object passed is an `Entity`.
     * @param obj The object to test.
     * @returns Whether it is an entity.
     */
    static is(obj) {
        return objIs(obj, Entity);
    }
}
/**
 * A simple object that is primarily used for scenery.
 *
 * This object has no special attributes.
 * @since v0.0.0
 */
class StaticObject extends Entity {
    constructor(opts) {
        super(opts);
        // requires an enforced fixed move mode
        this.setMoveMode("fixed");
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new StaticObject({ shape: "geom" });
            opts.apply(ent);
            return ent;
        }
        return new StaticObject(opts);
    }
    static is(obj) {
        return objIs(obj, StaticObject);
    }
}
/**
 * A simple object that uses physics.
 * @since v0.0.0
 */
class PhysicsObject extends Entity {
    strength;
    gravspd;
    constructor(opts) {
        super(opts);
        this.strength = opts.strength;
        this.gravspd = 0;
    }
    update() {
        this.gravspd += this.strength;
        this.y += this.gravspd;
        super.update();
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new PhysicsObject({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new PhysicsObject(opts);
    }
    static is(obj) {
        return objIs(obj, PhysicsObject);
    }
}
/**
 * An object that moves in both x and y directions.
 *
 * Optionally, it can bounce on extent reached.
 * @since v0.0.0
 */
class MovingObject extends Entity {
    dirX;
    dirY;
    extLeft;
    extRight;
    extBtm;
    extTop;
    spd;
    bouncy;
    constructor(opts) {
        super(opts);
        this.dirX = opts.dirX;
        this.dirY = opts.dirY;
        this.extLeft = opts.extLeft;
        this.extRight = opts.extRight;
        this.extBtm = opts.extBtm;
        this.extTop = opts.extTop;
        this.spd = opts.spd;
        this.bouncy = opts.bouncy;
    }
    update() {
        if (this.extLeft >= this.x && this.bouncy && this.dirX == 0) {
            this.x += this.spd;
            this.dirX = 1;
        }
        else if (this.extRight <= this.x && this.bouncy && this.dirX == 1) {
            this.x -= this.spd;
            this.dirX = 0;
        }
        else if (this.extLeft < this.x && !this.bouncy && this.dirX == 0) {
            this.x -= this.spd;
        }
        else if (this.extRight > this.x && this.bouncy && this.dirX == 1) {
            this.x += this.spd;
        }
        if (this.extBtm >= this.y && this.bouncy && this.dirY == 0) {
            this.y += this.spd;
            this.dirY = 1;
        }
        else if (this.extBtm <= this.y && this.bouncy && this.dirY == 1) {
            this.y -= this.spd;
            this.dirY = 0;
        }
        else if (this.extTop < this.y && !this.bouncy && this.dirY == 0) {
            this.y -= this.spd;
        }
        else if (this.extTop > this.y && !this.bouncy && this.dirY == 1) {
            this.y += this.spd;
        }
        super.update();
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new MovingObject({ dirX: 0, dirY: 0, extBtm: 0, extLeft: 0, extRight: 0, extTop: 0, spd: 0, bouncy: false });
            opts.apply(ent);
            return ent;
        }
        return new MovingObject(opts);
    }
    static is(obj) {
        return objIs(obj, MovingObject);
    }
}
/**
 * Similar to a moving object, this will fly across the screen.
 *
 * Will automatically destroy itself when reaching an extent.
 * @since v0.0.0
 */
class BulletObject extends Entity {
    extLeft;
    extRight;
    extBtm;
    extTop;
    spd;
    scene;
    onDest;
    tol;
    decay;
    initSpd;
    constructor(opts) {
        super(opts);
        this.rot = opts.rot;
        this.extLeft = opts.extLeft;
        this.extRight = opts.extRight;
        this.extBtm = opts.extBtm;
        this.extTop = opts.extTop;
        this.spd = opts.spd;
        this.scene = opts.scene;
        this.onDest = opts.onDest;
        this.tol = opts.tol ?? 15;
        this.decay = opts.decay ?? 0;
        this.initSpd = this.spd;
    }
    update() {
        // decay the speed by using exponential decay formula
        // y = a(1-r)^t
        // a = inital; r = decay rate; t = time
        this.spd = this.initSpd * (Math.pow(1 - this.decay, this.scene.delta));
        const fVec = this.getFVec();
        fVec.scale(this.spd);
        this.x += fVec.x;
        this.y += fVec.y;
        // test if its on-screen
        // tolerance of 15px (or tol)
        const x = this.scrX();
        const y = this.scrY();
        const w = this.scene.width;
        const h = this.scene.height;
        if (x - this.tol < w || x + this.tol > w || y + this.tol > h || y - this.tol < h) {
            // self-destruct if its not
            this.scene.rm(this);
            if (this.onDest)
                this.onDest(new PhantomDestroyedEvent());
        }
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new BulletObject({ rot: 0, extBtm: 0, extLeft: 0, extRight: 0, extTop: 0, spd: 0, scene: shallow() });
            opts.apply(ent);
            return ent;
        }
        return new BulletObject(opts);
    }
    static is(obj) {
        return objIs(obj, BulletObject);
    }
}
/**
 * Acts as a barrier to other entities.
 * @since v1.0.12
 */
class WallObject extends Entity {
    constructor(opts) {
        super(opts);
        this.collide = (e) => {
            // left vs right pen
            const xl = e.x + e.width - this.x;
            const xr = this.x + this.width - e.x;
            const mx = Math.min(xl, xr);
            // top vs btm pen
            const yt = e.y + e.height - this.y;
            const yb = this.y + this.height - e.y;
            const my = Math.min(yt, yb);
            const ec = e.center();
            const wc = this.center();
            // is a floor
            const isf = this.tags.some(t => t.test("floor"));
            if (mx < my) {
                if (ec.x < wc.x) {
                    // push left
                    e.x = this.x - e.width;
                }
                else {
                    // push right
                    e.x = this.x + this.width;
                }
                if (e instanceof Character) {
                    // if its colliding on the left,
                    // then its not on ground
                    // (not on the top of object)
                    e.onGround = false;
                }
            }
            else {
                if (ec.y < wc.y) {
                    // push up
                    e.y = this.y - e.height;
                    // test if its a character
                    // and has "floor" tag
                    if (isf && e instanceof Character) {
                        // ...then we set onGround to true
                        e.onGround = true;
                    }
                }
                else {
                    // push down
                    e.y = this.y + this.height;
                    if (e instanceof Character) {
                        // not on ground (on bottom)
                        e.onGround = false;
                    }
                }
            }
        };
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new WallObject({});
            opts.apply(ent);
            return ent;
        }
        return new WallObject(opts);
    }
    static is(obj) {
        return objIs(obj, WallObject);
    }
}
/**
 * Simple `WallObject` extension.
 *
 * Auto-adds "floor" tag.
 * @since v1.0.20
 */
class FloorObject extends WallObject {
    constructor(opts) {
        super(opts);
        this.tags.add(new Tag("floor"));
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new FloorObject({});
            opts.apply(ent);
            return ent;
        }
        return new WallObject(opts);
    }
    static is(obj) {
        return objIs(obj, FloorObject);
    }
}
/**
 * The root class for other character-like classes.
 *
 * Provides functionality for characters; uses physics.
 * @since v0.0.0
 */
class Character extends Entity {
    gspd;
    strength;
    onGround;
    constructor(opts) {
        super(opts);
        this.gspd = 0;
        this.strength = opts.strength;
        this.onGround = false;
    }
    setGSpd(spd) {
        this.gspd = spd;
    }
    getGSpd() {
        return this.gspd;
    }
    jump(h) {
        this.gspd = -(h);
        this.onGround = false;
    }
    update() {
        if (!this.onGround) {
            this.gspd += this.strength;
            this.y += this.gspd;
        }
        else {
            this.gspd = 0;
        }
        super.update();
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new Character({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new Character(opts);
    }
    static is(obj) {
        return objIs(obj, Character);
    }
}
/**
 * A character that also has bindings.
 *
 * Automatically listens for `keydown` and `keyup` events.
 * @since v0.0.0
 */
class PlayableCharacter extends Character {
    binds;
    keys;
    bindCD;
    constructor(opts) {
        super(opts);
        this.binds = opts.binds ?? new Store();
        this.keys = new Store();
        this.bindCD = new Store();
        window.addEventListener("keydown", (e) => {
            this.keys.set(e.code, true);
        });
        window.addEventListener("keyup", (e) => {
            this.keys.set(e.code, false);
        });
    }
    bind(code, exec, cd) {
        if (cd == undefined) {
            this.binds.set(code, exec);
        }
        else {
            this.bindCD.set(code, [exec, new Cooldown(cd)]);
        }
    }
    unbind(code) {
        this.binds.del(code);
        this.bindCD.del(code);
    }
    isBind(code) {
        return this.binds.has(code);
    }
    isBindCD(code) {
        return this.bindCD.has(code);
    }
    bindOf(code) {
        return this.binds.get(code);
    }
    bindCDOf(code) {
        return this.bindCD.get(code);
    }
    update() {
        for (const [k, v] of this.keys.items()) {
            if (v) {
                const _k = KeyCodeMapReverse[k];
                const exec = this.binds.get(_k);
                const cdExec = this.bindCD.get(_k);
                if (exec) {
                    exec();
                }
                else if (cdExec) {
                    if (cdExec[1].ready) {
                        cdExec[0]();
                        cdExec[1].consume();
                    }
                }
            }
        }
        super.update();
    }
    static from(opts) {
        if (opts instanceof Preset) {
            const ent = new PlayableCharacter({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new PlayableCharacter(opts);
    }
    static is(obj) {
        return objIs(obj, PlayableCharacter);
    }
}
class Aircraft extends Entity {
    thrust;
    drag;
    lift;
    scene;
    vx;
    vy;
    wing;
    grav;
    stall;
    air;
    mass;
    constructor(opts) {
        super(opts);
        this.thrust = opts.thrust ?? 0;
        this.drag = opts.drag;
        this.lift = 0;
        this.scene = opts.scene;
        this.vx = 0;
        this.vy = 0;
        this.wing = opts.wing;
        this.grav = opts.grav;
        this.stall = opts.stall ?? 0.3;
        this.air = opts.air;
        this.mass = opts.mass;
    }
    update() {
        const d = Math.min(this.scene.delta / 1000, 0.05);
        const fvec = this.getFVec();
        fvec.scale(this.thrust);
        fvec.scale(d);
        // apply thrust based on forward vector
        this.vx += fvec.x / this.mass;
        this.vy += fvec.y / this.mass;
        const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const velocityAngle = Math.atan2(this.vy, this.vx);
        let aoa = this.rot - velocityAngle; // Difference between nose and path
        aoa = Math.atan2(Math.sin(aoa), Math.cos(aoa));
        // Lift is perpendicular to velocity
        this.lift = this.liftCoefficent(aoa) * 0.5 * this.air * spd * spd * this.wing * 0.0001;
        //this.lift = Math.min(this.lift, this.mass * this.grav * 2);
        this.vx += Math.cos(velocityAngle + Math.PI / 2) * (this.lift / this.mass) * d;
        this.vy += Math.sin(velocityAngle + Math.PI / 2) * (this.lift / this.mass) * d;
        this.vy += this.grav * d;
        const dragOut = 1 / (1 + this.drag * d);
        this.vx *= dragOut;
        this.vy *= dragOut;
        this.x += this.vx * d;
        this.y += this.vy * d;
        super.update();
    }
    liftCoefficent(aoa) {
        let CL = 2 * Math.PI * aoa;
        if (Math.abs(aoa) > this.stall) {
            CL *= 0.5;
        }
        return Math.max(-1.5, Math.min(1.5, CL));
    }
    angleOfAttack() {
        const velocityAngle = Math.atan2(this.vy, this.vx);
        let aoa = this.rot - velocityAngle; // Difference between nose and path
        aoa = Math.atan2(Math.sin(aoa), Math.cos(aoa));
        return aoa;
    }
    addThrust(thrust) {
        this.thrust += thrust;
    }
}
/**
 * A 2D vector.
 *
 * Part of the broader vector ecosystem.
 * @since v0.0.0
 */
class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    scale(fx, fy) {
        this.x *= fx;
        this.y *= fy ?? fx;
    }
    static rotBtwn(a, b) {
        const a1 = Math.atan2(a.y, a.x);
        const a2 = Math.atan2(b.y, b.x);
        let dif = a2 - a1;
        const pi2 = 2 * Math.PI;
        if (dif > Math.PI)
            dif -= pi2;
        else if (dif < -Math.PI)
            dif += pi2;
        return dif;
    }
    rotate(rad) {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const nx = this.x * cos - this.y * sin;
        const ny = this.x * sin + this.y * cos;
        this.x = nx;
        this.y = ny;
    }
    static dist(a, b) {
        return Math.hypot(b.x - a.x, b.y - a.y);
    }
    static inRect(source, rectPos, rectW, rectH) {
        const sx = source.x;
        const sy = source.y;
        const rx = rectPos.x;
        const ry = rectPos.y;
        const w = rectW;
        const h = rectH;
        return sx >= rx && sx <= rx + w && sy >= ry && sy <= ry + h;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
/**
 * A pixel.
 * @since v0.0.0
 */
class Pixel {
    r;
    g;
    b;
    a;
    constructor(pxl) {
        this.r = pxl.r;
        this.g = pxl.g;
        this.b = pxl.b;
        this.a = pxl.a;
    }
    static from(data) {
        if (data instanceof ImageData) {
            return Pixel.from(data.data);
        }
        else {
            return new Pixel({ r: data[0], g: data[1], b: data[2], a: data[3] });
        }
    }
}
function SoundOptionsIsSOD(o) {
    return "mime" in o;
}
/**
 * An audio source.
 *
 * Used to play a variety of sounds.
 * @since v0.0.0
 */
class Sound {
    src;
    mime;
    aud;
    constructor(opts) {
        this.src = opts.src;
        this.aud = new Audio();
        if (SoundOptionsIsSOD(opts)) {
            this.mime = opts.mime;
            const source = document.createElement("source");
            source.src = this.src;
            source.type = this.mime.startsWith("audio") ? this.mime : `audio/${this.mime}`;
            this.aud.appendChild(source);
        }
        else {
            this.aud.src = this.src;
        }
    }
    play() {
        this.aud.play();
    }
    pause() {
        this.aud.pause();
    }
    get time() {
        return this.aud.currentTime;
    }
    set time(t) {
        this.aud.currentTime = t;
    }
    get len() {
        return this.aud.duration;
    }
    static from(opts) {
        return new Sound(opts);
    }
    get vol() {
        return this.aud.volume;
    }
    set vol(vol) {
        this.aud.volume = vol;
    }
}
/**
 * An image.
 *
 * Shorthand for `HTMLImageElement`.
 * @since v0.0.0
 */
class Img {
    static config;
    img;
    constructor(src) {
        this.img = new Image();
        this.rebuild(src);
    }
    rebuild(src) {
        this.img.src = this.#realSrc(src);
    }
    #realSrc(src) {
        const root = _a.config.get("root");
        if (!root || root.length == 0)
            return src;
        return `${root}${root.endsWith("/") ? "" : "/"}${src}`;
    }
    static from(src) {
        return new _a(src);
    }
}
_a = Img;
/**
 * A component to store various elements.
 * @since v0.0.0
 */
class Items {
    items;
    constructor() {
        this.items = [];
    }
    add(...items) {
        this.items.push(...items);
        items.forEach(i => i.consume("added", new PhantomAddedEvent()));
    }
    rm(...items) {
        for (const item of items) {
            if (this.has(item)) {
                this.items.splice(this.idxOf(item), 1);
                item.consume("removed", new PhantomRemovedEvent());
            }
        }
    }
    has(...items) {
        return ArrayUtil.has(this.items, ...items);
    }
    idxOf(item) {
        return this.items.indexOf(item);
    }
    filter(cb) {
        return this.items.filter(cb);
    }
    forEach(cb) {
        this.items.forEach(cb);
    }
    at(i) {
        return this.items[i];
    }
    find(cb) {
        return this.items.find(cb);
    }
    some(cb) {
        return this.items.some(cb);
    }
}
/**
 * The root canvas to display content.
 * @since v0.0.0
 */
class Scene {
    static config;
    /**
     * This was used in v1.0.18.2 briefly.
     *
     * It was used to determine whether an unload listener already existed.
     *
     * It has been since replaced.
     * @since v1.0.18.2
     * @deprecated Since v1.0.19. Opted to using `Config.get` instead.
     */
    static unloadListenerCreated = false;
    canvas;
    ctx;
    items;
    evStore;
    lvlStore;
    mousePos;
    runtime;
    comps;
    evMng;
    fol;
    ui;
    fontControl;
    misc;
    constructor(opts) {
        if (typeof opts.canvas == "string") {
            opts.canvas = document.getElementById(opts.canvas);
        }
        if (!opts.canvas)
            throw new NoCanvasError();
        this.canvas = opts.canvas instanceof HTMLCanvasElement ? opts.canvas : opts.canvas;
        if (opts.w)
            this.canvas.width = opts.w;
        if (opts.h)
            this.canvas.height = opts.h;
        if (opts.cssW)
            this.canvas.style.width = opts.cssW;
        if (opts.cssH)
            this.canvas.style.height = opts.cssH;
        if (opts.border)
            this.canvas.style.border = opts.border;
        const ctx = this.canvas.getContext("2d");
        if (!ctx)
            throw new NoContextError();
        this.ctx = ctx;
        this.items = new Items();
        this.evStore = new Store();
        this.lvlStore = new Store();
        this.mousePos = new Vector(0, 0);
        window.addEventListener("mousemove", (e) => {
            this.mousePos = this.mouseAt(e);
        });
        this.runtime = new Runtime();
        this.comps = new Store();
        this.evMng = new SceneEventManager(this, this.evStore);
        this.ui = new ItemBox();
        this.fontControl = {
            size: 10,
            family: "sans-serif"
        };
        this.misc = new ItemBox();
    }
    get width() {
        return this.canvas.width;
    }
    set width(w) {
        this.canvas.width = w;
    }
    get cssWidth() {
        return this.canvas.style.width;
    }
    set cssWidth(w) {
        this.canvas.style.width = w;
    }
    get height() {
        return this.canvas.height;
    }
    set height(h) {
        this.canvas.height = h;
    }
    get cssHeight() {
        return this.canvas.style.height;
    }
    set cssHeight(h) {
        this.canvas.style.height = h;
    }
    add(...items) {
        this.items.add(...items);
    }
    addUI(...items) {
        this.ui.add(...items);
    }
    rm(...items) {
        this.items.rm(...items);
    }
    rmUI(...items) {
        this.ui.rm(...items);
    }
    has(...items) {
        return this.items.has(...items);
    }
    hasUI(...items) {
        return this.ui.has(...items);
    }
    idxOf(item) {
        return this.items.idxOf(item);
    }
    idxOfUI(item) {
        return this.ui.stuff.indexOf(item);
    }
    filter(cb) {
        return this.items.filter(cb);
    }
    filterUI(cb) {
        return this.ui.filter(cb);
    }
    on(name, handle) {
        this.evMng.on(name, handle);
    }
    off(name, handle) {
        this.evMng.off(name, handle);
    }
    getImgData(pos) {
        return this.ctx.getImageData(pos.x, pos.y, 1, 1);
    }
    setImgData(pos, data) {
        this.ctx.putImageData(data, pos.x, pos.y);
    }
    getPixel(pos) {
        return Pixel.from(this.getImgData(pos));
    }
    setPixel(pos, rgba) {
        const d = this.getImgData(pos);
        d.data[0] = rgba.r;
        d.data[1] = rgba.g;
        d.data[2] = rgba.b;
        d.data[3] = rgba.a;
        this.setImgData(pos, d);
    }
    forEach(cb) {
        this.items.forEach(cb);
    }
    forEachUI(cb) {
        this.ui.forEach(cb);
    }
    getLvl(lvlName) {
        return this.lvlStore.get(lvlName);
    }
    setLvl(lvlName, lvl) {
        this.lvlStore.set(lvlName, lvl);
    }
    hasLvl(lvlName) {
        return this.lvlStore.has(lvlName);
    }
    delLvl(lvlName) {
        this.lvlStore.del(lvlName);
    }
    loadLvl(lvlName) {
        const lvl = this.lvlStore.get(lvlName);
        if (lvl)
            this.items = lvl.items;
    }
    lvl() {
        const lvl = new Level();
        lvl.items = this.items;
        return lvl;
    }
    get color() {
        return this.ctx.fillStyle;
    }
    set color(color) {
        this.ctx.fillStyle = color;
    }
    get alpha() {
        return this.ctx.globalAlpha;
    }
    set alpha(alpha) {
        this.ctx.globalAlpha = alpha;
    }
    img(img, x, y, w, h) {
        this.ctx.drawImage(objIs(img, HTMLImageElement) ? img : img.img, x, y, w, h);
    }
    rect(x, y, w, h, color) {
        this.color = color;
        this.ctx.fillRect(x, y, w, h);
    }
    bg(color) {
        this.rect(0, 0, this.width, this.height, color);
    }
    ray(origin, angle, dist, color) {
        this.ctx.strokeStyle = color;
        this.ctx.beginPath();
        this.ctx.moveTo(origin.x, origin.y);
        this.ctx.lineTo(origin.x + Math.cos(angle) * dist, origin.y + Math.sin(angle) * dist);
        this.ctx.stroke();
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    update() {
        this.forEach(i => i.update());
        this.forEachUI(u => u.update());
        this.misc.forEach(m => m.update());
        this.testCols();
    }
    testCols() {
        const len = this.items.items.length;
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < len; j++) {
                if (i == j)
                    continue;
                const a = this.items.at(i);
                const b = this.items.at(j);
                if (a && b)
                    if (isCol(a, b))
                        a.collide(b);
            }
        }
    }
    render() {
        this.items.forEach(i => {
            this.rectRotd(i.x, i.y, i.width, i.height, i.rot, i.color);
            i.child.forEach(c => {
                this.rectRotd(c.x, c.y, c.width, c.height, c.rot, c.color, i.x, i.y);
            });
        });
        // UI will be rendered in a fixed position
        this.ui.forEach(u => {
            this.ctx.save();
            const w2 = u.width / 2;
            const h2 = u.height / 2;
            this.ctx.translate(u.x + w2, u.y + h2);
            this.ctx.rotate(u.rot);
            this.rect(-w2, -h2, u.width, u.height, u.color);
            this.ctx.restore();
            // for other rendering (other than a core rectangle)
            // call the UI's render method
            u.render();
        });
        // render misc items
        this.misc.forEach(m => m.render());
    }
    rectRotd(ex, ey, w, h, rot, color, offX = 0, offY = 0) {
        let ox = 0;
        let oy = 0;
        if (this.fol) {
            const fcx = this.fol.x + this.fol.width / 2;
            const fcy = this.fol.y + this.fol.height / 2;
            ox = this.width / 2 - fcx;
            oy = this.height / 2 - fcy;
        }
        const dx = ex + ox + offX;
        const dy = ey + oy + offY;
        this.ctx.save();
        const w2 = w / 2;
        const h2 = h / 2;
        this.ctx.translate(dx + w2, dy + h2);
        this.ctx.rotate(rot);
        const nx = -w2;
        const ny = -h2;
        const xw = nx + w;
        const yh = ny + h;
        // off-screen no draw check
        // if the x-coord is less than 0 or more than width
        // or the y-coord is less than 0 or more than height
        // then it is not on the canvas
        if (Scene.config.get("osnd") == true && (xw < 0 || this.width < xw || yh < 0 || this.height < yh))
            return this.ctx.restore();
        this.rect(nx, ny, w, h, color);
        this.ctx.restore();
    }
    start(postUpd = NoFunc) {
        this.runtime.start(() => {
            this.update();
            this.clear();
            postUpd();
            this.render();
        });
    }
    stop() {
        this.runtime.stop();
    }
    save(file) {
        const s = new SaveJSON(file);
        s.save(this, 4);
    }
    saveLvl(lvlName, file) {
        const s = new SaveJSON(file);
        s.save(this.getLvl(lvlName), 4);
    }
    fScrOn() {
        this.canvas.requestFullscreen();
    }
    fScrOff() {
        document.exitFullscreen();
    }
    pLockOn() {
        this.canvas.requestPointerLock();
    }
    pLockOff() {
        document.exitPointerLock();
    }
    get delta() {
        return this.runtime.delta;
    }
    use(c, opts) {
        if (this.uses(c))
            throw new AlreadyUsingError();
        const _opts = opts ?? {};
        this.comps.set(c, new (PhantomSceneCompRecord[c])(this, _opts));
    }
    unuse(c) {
        this.comps.del(c);
    }
    uses(c) {
        return this.comps.has(c);
    }
    comp(c) {
        return this.comps.get(c);
    }
    bounds() {
        return this.canvas.getBoundingClientRect();
    }
    mouseAt(e) {
        const rect = this.bounds();
        const sx = this.width / rect.width;
        const sy = this.height / rect.height;
        return new Vector((e.clientX - rect.left) * sx, (e.clientY - rect.top) * sy);
    }
    clickFScrOn() {
        this.on("click", () => this.fScrOn());
    }
    clickFScrOff() {
        this.off("click", () => this.fScrOn());
    }
    clickPLockOn() {
        this.on("click", () => this.pLockOn());
    }
    clickPLockOff() {
        this.off("click", () => this.pLockOn());
    }
    __listenOn(e, h) {
        this.canvas.addEventListener(e, h);
    }
    __listenOff(e, h) {
        this.canvas.removeEventListener(e, h);
    }
    toDataURL(format = "image/png", quality = 1) {
        return this.canvas.toDataURL(format, quality);
    }
    /**
     * Creates a screenshot of the canvas.
     *
     * Uses the canvas's content as the image content.
     * @param file The file name.
     * @param format The image format to use.
     * @param quality The quality (if avaliable) to use.
     */
    screenshot(file, format = "image/png", quality = 1) {
        const save = new Save({
            mime: format,
            file,
            ext: format.split("/")[1]
        });
        save.trigger(this.toDataURL(format, quality));
    }
    find(cb) {
        return this.items.find(cb);
    }
    #tagTest(ent, tagName) {
        if (objIs(tagName, Tag)) {
            return ent.tags.has(tagName);
        }
        else {
            return ent.tags.some((t) => t.test(tagName));
        }
    }
    findByTag(tagName) {
        return this.find((e) => this.#tagTest(e, tagName));
    }
    hasByTag(tagName) {
        return this.some((e) => this.#tagTest(e, tagName));
    }
    some(cb) {
        return this.items.some(cb);
    }
    /**
     * Returns the rotation between two entites.
     *
     * Utilizes `Vector.rotBtwn` to calculate.
     * @param a The first entity.
     * @param b The second entity.
     * @returns The rotation between the two.
     * @since v1.0.16
     */
    rotBtwn(a, b) {
        return Vector.rotBtwn(a.getPos(), b.getPos());
    }
    /**
     * Returns the rotation between the specified entity and the mouse.
     * @param ent The entity to test.
     * @returns The rotation from the entity to the mouse.
     */
    rotToMouse(ent) {
        return Vector.rotBtwn(ent.getPos(), this.mousePos);
    }
    style(styles) {
        Object.assign(this.canvas.style, styles);
    }
    center() {
        return new Vector(this.width / 2, this.height / 2);
    }
    clientCenter() {
        return new Vector(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
    }
    onScrn(vec, w, h) {
        const x = vec.x + w;
        const y = vec.y + h;
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }
    follow(ent) {
        this.fol = ent;
    }
    unfollow() {
        this.fol = undefined;
    }
    text(text, x, y, maxWidth) {
        this.ctx.fillText(text, x, y, maxWidth);
    }
    get align() {
        return this.ctx.textAlign;
    }
    set align(align) {
        this.ctx.textAlign = align;
    }
    get font() {
        return this.ctx.font;
    }
    set font(font) {
        if (typeof font == "string") {
            this.ctx.font = font;
        }
        else {
            this.ctx.font = `${font.style ?? "normal"} ${font.variant ?? "normal"} ${font.weight ?? "normal"} ${font.stretch ?? "normal"} ${font.size} ${font.lineHeight ?? "normal"} ${font.family}`;
        }
    }
    // useFont(size: FontSize): void;
    // useFont(size: FontSize, family: FontFamily): void;
    // useFont(style: Real<FontStyle>, size: FontSize, family: FontFamily): void;
    // useFont(style: Real<FontStyle>, variant: Real<FontVariant>, size: FontSize, family: FontFamily): void;
    // useFont(style: Real<FontStyle>, weight: Real<FontWeight>, size: FontSize, family: FontFamily): void;
    // useFont(style: Real<FontStyle>, stretch: Real<FontStretch>, size: FontSize, family: FontFamily): void;
    // useFont(variant: Real<FontVariant>, size: FontSize, family: FontFamily): void;
    // useFont(weight: Real<FontWeight>, size: FontSize, family: FontFamily): void;
    // useFont(stretch: Real<FontStretch>, size: FontSize, family: FontFamily): void;
    // useFont(lineHeight: Real<FontLineHeight>, size: FontSize, family: FontFamily): void;
    // useFont(): void;
    // useFont() {}
    get fontSize() {
        return this.fontControl.size;
    }
    set fontSize(size) {
        this.fontControl.size = size;
        this.#buildFont();
    }
    get fontFamily() {
        return this.fontControl.family;
    }
    set fontFamily(family) {
        this.fontControl.family = family;
        this.#buildFont();
    }
    get baseline() {
        return this.ctx.textBaseline;
    }
    set baseline(baseline) {
        this.ctx.textBaseline = baseline;
    }
    get fontStyle() {
        return this.fontControl.style;
    }
    set fontStyle(style) {
        this.fontControl.style = style;
        this.#buildFont();
    }
    get fontVariant() {
        return this.fontControl.variant;
    }
    set fontVariant(variant) {
        this.fontControl.variant = variant;
        this.#buildFont();
    }
    get fontWeight() {
        return this.fontControl.weight;
    }
    set fontWeight(weight) {
        this.fontControl.weight = weight;
        this.#buildFont();
    }
    get fontStretch() {
        return this.fontControl.stretch;
    }
    set fontStretch(stretch) {
        this.fontControl.stretch = stretch;
        this.#buildFont();
    }
    get fontLineHeight() {
        return this.fontControl.lineHeight;
    }
    set fontLineHeight(lineHeight) {
        this.fontControl.lineHeight = lineHeight;
        this.#buildFont();
    }
    #buildFont() {
        this.font = this.fontControl;
    }
    mouseInRect(rectPos, rectW, rectH) {
        return Vector.inRect(this.mousePos, rectPos, rectW, rectH);
    }
    frustum(x, y, r0, r1, h, fillColor, strokeColor, lineWidth) {
        const topY = y - h;
        this.ctx.beginPath();
        // 1. Draw Bottom Base (flat line in side view)
        this.ctx.moveTo(x - r0, y);
        this.ctx.lineTo(x + r0, y);
        // 2. Draw Side Slope Right
        this.ctx.lineTo(x + r1, topY);
        // 3. Draw Top Base (flat line)
        this.ctx.lineTo(x - r1, topY);
        // 4. Close path (Side Slope Left)
        this.ctx.closePath();
        // Style the frustum
        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
        this.ctx.strokeStyle = strokeColor ?? fillColor;
        this.ctx.lineWidth = lineWidth ?? 2;
        this.ctx.stroke();
    }
    triangle(p0, p1, p2, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.closePath();
        this.color = color;
        this.ctx.fill();
    }
    cone(p0, p1, rad, color) {
        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.ellipse(p0.x, p1.y, rad.x, rad.y, 0, Math.PI, 0, true);
        this.ctx.lineTo(p0.x, p0.y);
        this.ctx.closePath();
        this.color = color;
        this.ctx.fill();
    }
}
/**
 * A collection of items.
 *
 * Can be used as a `Preset` for `Scene`.
 * @since v0.0.0
 */
class Level {
    items;
    constructor() {
        this.items = new Items();
    }
    add(...items) {
        this.items.add(...items);
    }
    rm(...items) {
        this.items.rm(...items);
    }
    has(...items) {
        return this.items.has(...items);
    }
    idxOf(item) {
        return this.items.idxOf(item);
    }
    filter(cb) {
        return this.items.filter(cb);
    }
    forEach(cb) {
        this.items.forEach(cb);
    }
    find(cb) {
        return this.items.find(cb);
    }
    save(file) {
        const s = new SaveJSON(file);
        s.save(this, 4);
    }
}
/**
 * A class for saving content.
 * @since v0.0.0
 */
class Save {
    file;
    mime;
    ext;
    constructor(opts) {
        this.file = opts.file;
        this.mime = opts.mime;
        this.ext = opts.ext;
    }
    /**
     * Triggers the actual download process, provided a URL.
     * @param url The source URL.
     * @since v1.0.17
     */
    trigger(url) {
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = `${this.file}.${this.ext}`;
        a.click();
        document.body.removeChild(a);
    }
    /**
     * Saves a set of content.
     *
     * Creates a URL.
     * @param cont The file's content.
     * @since v0.0.0
     */
    save(cont) {
        const blob = new Blob([cont], { type: this.mime });
        const url = URL.createObjectURL(blob);
        this.trigger(url);
        URL.revokeObjectURL(url);
    }
}
/**
 * An extension class of `Save`.
 *
 * Used for saving specifically JSON files.
 * @since v0.0.0
 */
class SaveJSON extends Save {
    constructor(file) {
        super({ file, mime: "application/json", ext: "json" });
    }
    save(cont, indent = 4) {
        super.save(Util.str(cont, indent));
    }
}
/**
 * A saved set of attributes for an entity.
 *
 * Can be applied to an entity later.
 * @since v0.0.0
 */
class Preset {
    atts;
    constructor(ent) {
        this.atts = {};
        Object.assign(this.atts, ent);
    }
    save(out) {
        const s = new SaveJSON(out);
        s.save(this, 4);
    }
    apply(ent) {
        Object.assign(ent, this.atts);
    }
}
/**
 * A ray in the scene space.
 * @since v0.0.0
 */
class Raycast {
    origin;
    angle;
    dist;
    scene;
    constructor(opts) {
        this.origin = opts.origin;
        this.angle = opts.angle;
        this.dist = opts.dist;
        this.scene = opts.scene;
    }
    cast() {
        let res = null;
        const dir = new Vector(Math.cos(this.angle), Math.sin(this.angle));
        for (const i of this.scene.items.items) {
            const hit = rayInterRect(this.origin, dir, i, this.scene);
            if (hit) {
                if ((res && hit < res.dist) || (res == null))
                    res = new RaycastIntersecton(hit, i, new Vector(this.origin.x + dir.x * hit, this.origin.y + dir.y * hit));
            }
        }
        return res;
    }
}
class DebugRay extends Raycast {
    color;
    life;
    constructor(opts) {
        super(opts);
        this.color = opts.color;
        this.life = opts.life ?? Infinity;
        this.scene.misc.add(this);
        if (Number.isFinite(this.life)) {
            setTimeout(() => this.scene.misc.rm(this), this.life);
        }
    }
    update() { }
    render() {
        this.scene.ray(this.origin, this.angle, this.dist, this.color);
    }
}
/**
 * The intersection returned by a `Raycast` collision.
 * @since v0.0.0
 */
class RaycastIntersecton {
    dist;
    obj;
    point;
    constructor(dist, obj, point) {
        this.dist = dist;
        this.obj = obj;
        this.point = point;
    }
}
/**
 * Handler for the `Scene` runtime.
 *
 * Controls the state of the `Scene` rendering.
 * @since v0.0.0
 */
class Runtime {
    processId;
    delta;
    constructor() {
        this.processId = -1;
        this.delta = 0;
    }
    start(fn) {
        if (this.processId != -1)
            throw new ExistingProcessError();
        const out = () => {
            fn();
            this.delta++;
            this.processId = requestAnimationFrame(out);
        };
        out();
    }
    stop() {
        if (this.processId == -1)
            throw new NoProcessError();
        cancelAnimationFrame(this.processId);
        this.delta = 0;
        this.processId = -1;
    }
}
/**
 * The geometric object root class.
 * @since v0.0.0
 */
class Geom {
    name;
    constructor(name) {
        this.name = name;
    }
}
/**
 * Represents a rectangle.
 * @since v0.0.0
 */
class GeomRect extends Geom {
    constructor() { super("rect"); }
}
/**
 * Represents a circle.
 * @since v0.0.0
 */
class GeomCircle extends Geom {
    constructor() { super("circle"); }
}
class StorageRoot {
    storage;
    constructor(obj) {
        this.storage = obj;
    }
    get(k) {
        return this.storage.getItem(k);
    }
    set(k, v) {
        this.storage.setItem(k, Util.strOf(v));
    }
    has(k) {
        return !!this.get(k);
    }
    get len() {
        return this.storage.length;
    }
    del(k) {
        this.storage.removeItem(k);
    }
    clear() {
        this.storage.clear();
    }
}
const Local = new StorageRoot(localStorage);
const Session = new StorageRoot(sessionStorage);
/**
 * An implementation of `localStorage`.
 * @since v1.0.2
 * @deprecated Replaced by new `Local` object.
 */
class LocalDeprecated {
    /**
     * Sets a value in `localStorage`.
     * @param k The key.
     * @param v The value.
     * @since v1.0.2
     */
    static set(k, v) {
        const val = typeof v == "string" ? v : Util.str(v);
        localStorage.setItem(k, val);
    }
    /**
     * Gets a value from `localStorage`.
     * @param k The key.
     * @returns The value (or none, if it does not exist).
     * @since v1.0.2
     */
    static get(k) {
        return localStorage.getItem(k);
    }
    /**
     * Returns whether an entry with this key exists.
     * @param k The key.
     * @returns Whether this entry exists.
     * @since v1.0.2
     */
    static has(k) {
        return !!this.get(k);
    }
    /**
     * Returns the length of `localStorage`.
     * @since v1.0.2
     */
    static get len() {
        return localStorage.length;
    }
    /**
     * Deletes an item.
     * @param k The key.
     * @since v1.0.2
     */
    static del(k) {
        localStorage.removeItem(k);
    }
}
/**
 * An implementation of `cookieStore`.
 * @since v1.0.6
 */
class Cookies {
    /**
     * Returns a cookie value.
     * @param k The key to get.
     * @returns The associated cookie (or nothing).
     * @since v1.0.6
     */
    static get(k) {
        return cookieStore.get(k);
    }
    /**
     * Sets a cookie value.
     * @param k The key.
     * @param v The value.
     * @since v1.0.6
     */
    static set(k, v) {
        cookieStore.set(k, Util.strOf(v));
    }
    /**
     * Returns a list of associated cookie values.
     * @param k The key to get.
     * @returns The values.
     * @since v1.0.6
     */
    static getAll(k) {
        return cookieStore.getAll(k);
    }
    /**
     * Deletes a cookie pair.
     * @param k The key.
     * @since v1.0.6
     */
    static del(k) {
        cookieStore.delete(k);
    }
}
/**
 * A simple cooldown timer.
 * @since v1.0.5
 */
class Cooldown {
    id;
    ready;
    ms;
    constructor(msOrState, msOrState2) {
        this.id = -1;
        this.ready = false;
        if (msOrState && typeof msOrState == "number" && msOrState2 == undefined) {
            this.on(msOrState);
        }
        else if (msOrState && typeof msOrState == "boolean" && msOrState2 == undefined) {
            this.ready = msOrState;
        }
        else if (msOrState && typeof msOrState == "number" && msOrState2 && typeof msOrState2 == "boolean") {
            this.on(msOrState);
            this.ready = msOrState2;
        }
    }
    on(ms) {
        if (this.id != -1)
            throw new ExistingProcessError();
        this.ms = ms;
        this.id = setInterval(() => this.#handle(), ms);
    }
    off() {
        if (this.id == -1)
            throw new NoProcessError();
        clearInterval(this.id);
        this.id = -1;
    }
    consume() {
        this.ready = false;
    }
    #handle() {
        this.ready = true;
    }
}
class Angle {
    static deg(rad) {
        return rad * 180 / Math.PI;
    }
    static rad(deg) {
        return deg * Math.PI / 180;
    }
    static toVector(rad) {
        return new Vector(Math.cos(rad), Math.sin(rad));
    }
}
class Config {
    config;
    /**
     * Fired when a value of this config is changed.
     * @since v1.0.19
     */
    onValueSet;
    constructor() {
        this.config = new Store();
    }
    get(k) {
        return this.config.get(k);
    }
    set(k, v) {
        this.config.set(k, v);
        if (this.onValueSet) {
            this.onValueSet(k, v);
        }
    }
    has(k) {
        return this.config.has(k);
    }
    del(k) {
        this.config.del(k);
    }
}
function option(vals) {
    return { vals };
}
function prim(type) {
    return { type };
}
function primNum() {
    return prim(Number);
}
function primString() {
    return prim(String);
}
function primBool() {
    return prim(Boolean);
}
function primFn() {
    return prim(Function);
}
const SceneConfigMap = {
    /**
     * Controls the displayed resolution (outputted textures width and height).
     *
     * Resolution is basically a texture's "sharpness" prior application.
     *
     * Textures (including basic colors) are stretched to fill an entities `width` and `height`.
     * @since v1.0.7
     */
    resolution: option(["1920x1080", "2560x1440", "1280x720", "640x360"]),
    /**
     * Controls the master volume of all audio in this project.
     *
     * Accepts a value from 0 - 1.
     *
     * Part of the sound volume control collection.
     * @since v1.0.7
     */
    master: primNum(),
    /**
     * Controls the volume of all music audio in this project.
     *
     * Any `Sound` with the tag "music" is controlled by this.
     *
     * Accepts a value from 0 - 1.
     *
     * Part of the sound volume control collection.
     * @since v1.0.7
     */
    music: primNum(),
    /**
     * Controls the volume of all sound effect audio in this project.
     *
     * Any `Sound` with the tag "sfx" is controlled by this.
     *
     * Accepts a value from 0 - 1.
     *
     * Part of the sound volume control collection.
     * @since v1.0.7
     */
    sfx: primNum(),
    /**
     * Off-screen no draw is useful for preventing overloading of the browser.
     *
     * When an entity to be drawn will not show up on the canvas, it will not be drawn.
     *
     * It is highly recommended to leave this enabled.
     * @since v1.0.18
     */
    osnd: primBool(),
    /**
     * This is the handler that is called before the unload of the window.
     *
     * Assuming it is a value other than `null`, there will be a listener created.
     *
     * Listener utilizes `BeforeUnloadEvent.returnValue` to display a confirmation popup.
     * @since v1.0.18.2
     */
    unload: primFn(),
    /**
     * Handler for uncaught `ErrorEvent`s.
     * @since v1.0.19
     */
    error: primFn(),
    /**
     * The direction gravity should be facing in (in radians).
     * @since v1.0.27
     */
    gravdir: primNum()
};
class SceneConfig extends Config {
    constructor() {
        super();
        this.onValueSet = (k, v) => {
            if (k == "unload" || k == "error") {
                if (typeof v != "function")
                    return console.warn("Invalid type passed as handle.");
                if (k == "unload") {
                    if (Scene.config.get("unload"))
                        return console.warn("There is already an unload listener!");
                    window.addEventListener("beforeunload", (e) => {
                        e.preventDefault();
                        e.returnValue = "";
                        v();
                    });
                }
                else if (k == "error") {
                    if (Scene.config.get("error"))
                        return console.warn("There is already an error listener!");
                    window.addEventListener("error", (e) => {
                        v(e);
                    });
                }
            }
        };
    }
}
Scene.config = new SceneConfig();
Scene.config.set("resolution", "1920x1080");
Scene.config.set("master", 1);
Scene.config.set("music", 1);
Scene.config.set("sfx", 1);
Scene.config.set("osnd", true);
Scene.config.set("gravdir", Angle.rad(270));
const ImgConfigMap = {
    /**
     * Controls the beginning (pre-pended) folder path to all `src` properties.
     * @since v1.0.7
     * @example
     * ```
     * Img.config.set("root", "assets"); // assuming there was an 'assets/' folder
     * const img = new Img("cool.png"); // this would be transformed to be 'assets/cool.png'
     * ```
     */
    root: primString()
};
class ImgConfig extends Config {
}
Img.config = new ImgConfig();
Img.config.set("root", "");
const EntityDefaultsMap = {
    /**
     * Controls the x-coordinate.
     * @since v1.0.11
     */
    x: primNum(),
    /**
     * Controls the y-coordinate.
     * @since v1.0.11
     */
    y: primNum(),
    /**
     * Controls the rotation, in radians.
     * @since v1.0.11
     */
    rot: primNum(),
    /**
     * Controls the width.
     * @since v1.0.11
     */
    width: primNum(),
    /**
     * Controls the height.
     * @since v1.0.11
     */
    height: primNum(),
    /**
     * Controls the color.
     * @since v1.0.11
     */
    color: primString()
};
class EntityDefaults extends Config {
}
Entity.defaults = new EntityDefaults();
class Picker {
    clean(opts) {
        return { id: opts.id, startIn: opts.start };
    }
}
class FilePickerBase extends Picker {
    cleanOpts(opts) {
        return {
            ...this.clean(opts),
            excludeAcceptAllOption: opts.all,
            types: opts.accept?.map(a => { return { description: a.desc, accept: a.accept }; })
        };
    }
}
/**
 * Shows a file picker.
 *
 * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker)
 * @since v1.0.7
 */
class FilePicker extends FilePickerBase {
    async pick(opts) {
        const [...handles] = await this.handle(opts);
        if (handles.length == 1) {
            const file = await handles[0].getFile();
            return await file.text();
        }
        const files = [];
        for (const handle of handles) {
            files.push(await handle.getFile());
        }
        const out = await Promise.all(files.map(async (o) => o.text()));
        return out;
    }
    async handle(opts) {
        const [...handles] = await window.showOpenFilePicker({ ...this.cleanOpts(opts), multiple: opts.mult });
        return handles;
    }
}
class SaveFilePicker extends FilePickerBase {
    async pick(opts) {
        return await this.handle(opts);
    }
    async handle(opts) {
        const handle = await window.showOpenSaveFilePicker({ ...this.cleanOpts(opts), suggestedName: opts.suggest });
        return handle;
    }
}
/**
 * Shows a directory picker.
 *
 * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker)
 * @since v1.0.7
 */
class DirPicker extends Picker {
    async pick(opts) {
        try {
            const handle = await window.showDirectoryPicker(this.cleanOpts(opts));
            return handle;
        }
        catch (e) {
            throw e;
        }
    }
    async handle(opts) {
        return this.pick(opts);
    }
    cleanOpts(opts) {
        return {
            ...this.clean(opts),
            mode: opts.mode ? { "r": "read", "rw": "readwrite" }[opts.mode] : undefined
        };
    }
}
class EventManager {
    store;
    self;
    constructor(self, store) {
        this.self = self;
        this.store = store;
    }
    on(e, h, thenExec = NoFunc) {
        const a = this.store.get(e) ?? [];
        ArrayUtil.add(a, h);
        this.store.set(e, a);
        thenExec();
    }
    off(e, h, hExist = NoFunc, notHExist = NoFunc) {
        if (h) {
            const a = this.store.get(e) ?? [];
            ArrayUtil.rm(a, h);
            this.store.set(e, a);
            hExist();
        }
        else {
            notHExist();
            this.store.del(e);
        }
    }
}
class SceneEventManager extends EventManager {
    on(e, h) {
        super.on(e, h, () => {
            this.self.__listenOn(e, h);
        });
    }
    off(e, h) {
        super.off(e, h, () => {
            if (h)
                this.self.__listenOff(e, h);
        }, () => {
            for (const [_e, _h] of this.self.evStore.items()) {
                for (const __h of _h)
                    this.self.__listenOff(_e, __h);
            }
        });
    }
}
class PhantomEventManager extends EventManager {
}
class Clipboard {
    static read() {
        return navigator.clipboard.read();
    }
    static reads() {
        return navigator.clipboard.readText();
    }
    static write(data) {
        navigator.clipboard.write(data);
    }
    static writes(data) {
        navigator.clipboard.writeText(data);
    }
}
class Tag {
    val;
    constructor(val) {
        this.val = val ?? "";
    }
    get() {
        return this.val;
    }
    set(v) {
        this.val = v;
    }
    test(valOrTag) {
        if (valOrTag instanceof Tag) {
            return this.val == valOrTag.get();
        }
        else {
            return this.val == valOrTag;
        }
    }
}
class TagList extends ItemBox {
}
class SavedState {
    atts;
    timestamp;
    desc;
    constructor(o, desc) {
        this.atts = {};
        Object.assign(this.atts, o);
        this.desc = desc;
        this.timestamp = (new Date()).toISOString();
    }
    restore(o) {
        Object.assign(o, this.atts);
    }
}
class Trigger {
    x;
    y;
    w;
    h;
    trig;
    active;
    constructor(opts) {
        this.x = opts.x;
        this.y = opts.y;
        this.w = opts.w;
        this.h = opts.h;
        this.trig = opts.trig;
        this.active = opts.active ?? true;
    }
    activate() {
        this.active = true;
    }
    deactivate() {
        this.active = false;
    }
}
class Material {
    fric;
    color;
    constructor(opts) {
        this.fric = opts.fric ?? 1;
        this.color = opts.color ?? "#fff";
    }
}
class Camera {
    x;
    y;
    mode;
    fol;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.mode = "fixed";
    }
    follow(follow) {
        this.mode = "follow";
        this.fol = follow;
    }
    unfollow() {
        this.mode = "fixed";
        this.fol = undefined;
    }
    render(scene) { }
}
/**
 * The core class for UI elements.
 * @since v1.0.30
 */
class SceneUI {
    scene;
    x;
    y;
    width;
    height;
    rot;
    color;
    rend;
    upd;
    /**
     * A list of the children to this UI element.
     *
     * Childrens' positions are set relative to their parent's position.
     * @since v1.1.0
     */
    child;
    constructor(opts) {
        this.scene = opts.scene;
        this.x = opts.x ?? 0;
        this.y = opts.y ?? 0;
        this.width = opts.w ?? 0;
        this.height = opts.h ?? 0;
        this.rot = opts.rot ?? 0;
        this.color = opts.color ?? "#fff";
        this.rend = opts.rend ?? NoFunc;
        this.upd = opts.upd ?? NoFunc;
        this.child = new ChildUI();
    }
    render() {
        this.rend();
        this.child.forEach((c) => {
            // to avoid overwriting original pos
            // in the case of detachment at later stage
            // store the original position
            // then set it back following rendering
            const cx = c.x;
            const cy = c.y;
            // apply position relative
            // to this position
            c.x = this.x + cx;
            c.y = this.y + cy;
            c.render();
            // restore original position
            c.x = cx;
            c.y = cy;
        });
    }
    update() {
        this.upd();
        this.child.forEach((c) => {
            c.update();
        });
    }
    addChild(child) {
        this.child.add(child);
    }
    addChilds(...childs) {
        this.child.add(...childs);
    }
    rmChild(child) {
        this.child.rm(child);
    }
    rmChilds(...childs) {
        this.child.rm(...childs);
    }
    hasChild(child) {
        return this.child.has(child);
    }
    hasChilds(...childs) {
        return this.child.has(...childs);
    }
}
class ChildUI extends ItemBox {
}
class ButtonUI extends SceneUI {
    click;
    styles;
    resetCD;
    cdTime;
    disabled;
    clickCD;
    constructor(opts) {
        super(opts);
        this.click = opts.click ?? NoFunc;
        this.styles = opts.styles ?? {};
        this.#colorIdle();
        this.resetCD = new Cooldown();
        this.cdTime = 250;
        this.disabled = false;
        this.scene.on("click", () => {
            if (this.#boundsTest()) {
                if (!this.disabled) {
                    if (this.clickCD && !this.clickCD.ready)
                        return;
                    this.click();
                }
                this.resetCD.on(this.styles.reset ?? this.cdTime);
            }
        });
        if (opts.clickCD) {
            this.clickCD = new Cooldown(opts.clickCD);
        }
    }
    #boundsTest() {
        return this.scene.mouseInRect(new Vector(this.x, this.y), this.width, this.height);
    }
    #applyColor(k) {
        if (this.styles[k]) {
            this.color = this.styles[k];
        }
    }
    #colorIdle() {
        this.#applyColor("idle");
    }
    #colorHover() {
        this.#applyColor("hover");
    }
    #colorClick() {
        this.#applyColor("click");
    }
    update() {
        if (this.#boundsTest()) {
            if (this.resetCD.id == -1) {
                this.#colorHover();
            }
        }
        else {
            if (this.resetCD.id == -1) {
                this.#colorIdle();
            }
        }
        if (this.resetCD.id != -1) {
            if (this.resetCD.ready) {
                this.#colorIdle();
                this.resetCD.consume();
                this.resetCD.off();
            }
            else {
                this.#colorClick();
            }
        }
    }
}
/**
 * Primitive text component for UI.
 * @since v1.1.0
 */
class TextUI extends SceneUI {
    tx;
    font;
    mw;
    constructor(opts) {
        super(opts);
        this.tx = opts.tx ?? "";
        this.font = opts.font;
        this.mw = opts.mw;
    }
    render() {
        this.scene.color = this.color;
        if (this.font)
            this.scene.font = this.font;
        this.scene.text(this.tx, this.x, this.y, this.mw);
        super.render();
    }
}
class Itvl {
    id;
    constructor() {
        this.id = -1;
    }
    start(cb, ms) {
        if (this.id != -1)
            throw new ExistingProcessError();
        this.id = setInterval(cb, ms);
    }
    stop() {
        if (this.id == -1)
            throw new NoProcessError();
        clearInterval(this.id);
        this.id = -1;
    }
}
class FixedItvl extends Itvl {
    cb;
    ms;
    constructor(cb, ms) {
        super();
        this.cb = cb;
        this.ms = ms;
    }
    start() {
        super.start(this.cb, this.ms);
    }
}
class Params {
    params;
    constructor() {
        this.params = new URLSearchParams(window.location.search);
    }
    get(k) {
        return this.params.get(k);
    }
    getAll(k) {
        return this.params.getAll(k);
    }
    has(k, v) {
        if (v)
            return this.params.has(k, Util.strOf(v));
        else
            return this.params.has(k);
    }
}
const FinalizeOpeningMode = (mode) => (mode.startsWith("_") ? mode : `_${mode}`);
class OpeningFailedError extends ErrRoot {
    constructor(url) { super("OpeningFailedError", `Failed to open url '${url}'.`); }
}
class NoRootExistsOnExternalDocumentError extends ErrRoot {
    constructor() { super("NoRootExistsOnExternalDocumentError", "A 'root' element was expected on an external document, but none was found."); }
}
class External {
    app;
    constructor() {
        this.app = window;
    }
    open(url, target, features) {
        const _url = url ?? "about:blank";
        const _tg = FinalizeOpeningMode(target ?? "_blank");
        const out = window.open(_url, _tg, features);
        if (!out)
            throw new OpeningFailedError(objIs(_url, String) ? _url : _url.toString());
        this.app = out;
    }
    write(content, mode) {
        this.mkRoot();
        const root = this.getRoot();
        if (!root)
            throw new NoRootExistsOnExternalDocumentError();
        root.innerHTML = mode == "esm" ? this.esmScriptTag() : this.defImportScript();
        root.innerHTML += content;
    }
    mkRoot() {
        this.app.document.body.innerHTML = `<div id="root"></div>`;
    }
    getRoot() {
        return this.app.document.getElementById("root");
    }
    baseUrl() {
        return "https://cdn.jsdelivr.net/npm/@beanthealien/phantomjs@latest/";
    }
    esmScriptTag() {
        return `<script src="${this.baseUrl()}phantom2d.min.js"></script>`;
    }
    defImportScript() {
        return `import * as p2d from "${this.baseUrl()}+esm";`;
    }
}
/**
 * Returns whether 2 objects are in collision.
 * @param a Object 1.
 * @param b Object 2.
 * @returns If they collide.
 * @since v0.0.0
 */
function isCol(a, b) {
    const w1 = a.width;
    const h1 = a.height;
    const x1 = a.x;
    const y1 = a.y;
    const w2 = b.width;
    const h2 = b.height;
    const x2 = b.x;
    const y2 = b.y;
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
}
/**
 * Returns an intersection distance between a ray and a rect.
 * @param origin The beginning point.
 * @param dir The angle to travel at (in vector-angle).
 * @param rect The rectangle to test.
 * @param scene The scene.
 * @returns The distance of intersection (if there was one).
 */
function rayInterRect(origin, dir, rect, scene) {
    const uv = uvVec(dir, scene.width, scene.height);
    const t1 = (rect.x - origin.x) / uv.x;
    const t2 = (rect.scrX() - origin.x) / uv.x;
    const t3 = (rect.y - origin.y) / uv.y;
    const t4 = (rect.scrY() - origin.y) / uv.y;
    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
    if (tmax < 0 || tmin > tmax)
        return null;
    return tmin >= 0 ? tmin : tmax;
}
/**
 * Returns a `Vector` relative to screen space.
 *
 * Uses UV vector conversion math to map coords to [-1, 1].
 * @param p The vector.
 * @param w The scene-space width.
 * @param h The scene-space height.
 * @returns A new UV `Vector`.
 */
function uvVec(p, w, h) {
    let u = p.x / (w - 1);
    let v = p.y / (h - 1);
    u = u * 2 - 1;
    v = v * 2 - 1;
    let aspect = w / h;
    u *= aspect;
    return new Vector(u, v);
}
/**
 * Returns a `Promise` to wait for a specified amount of time.
 * @param ms The time to wait.
 * @returns A `Promise` to wait for.
 */
function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function random(a, b) {
    let min = 0;
    let max = 0;
    if (a == undefined && b == undefined) {
        min = 0;
        max = 101;
    }
    else if (a && b == undefined) {
        min = 0;
        max = a;
    }
    else if (a && b) {
        min = a;
        max = b;
    }
    if (min > max) {
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min)) + min;
}
function chance(max, upperBound) {
    return max <= random((upperBound ?? 100) + 1);
}
function objIs(obj, ctor) {
    return obj != undefined && obj instanceof ctor;
}
/**
 * Returns a shallow, null value of the type provided.
 * @returns A shallow, null value.
 */
function shallow() {
    return null;
}
/**
 * Returns a random item from an array.
 * @param arr The array.
 * @returns A random item.
 */
function randItem(arr) {
    return arr[random(0, arr.length)];
}
function lerp(start, end, amount) {
    return start + (end - start) * amount;
}
export { Entity, StaticObject, PhysicsObject, MovingObject, BulletObject, Scene, Character, PlayableCharacter, WallObject, FloorObject, Aircraft, SceneUI, ButtonUI, TextUI, Save, SaveJSON, Sound, Preset, Level, Items, Store, Vector, Pixel, Raycast, DebugRay, Cooldown, FilePicker, DirPicker, SaveFilePicker, Img, Angle, Tag, External, Config, SceneConfig, ImgConfig, isCol, rayInterRect, uvVec, wait, random, chance, shallow, objIs, randItem, lerp, Local, LocalDeprecated, Session, Clipboard, Cookies, Params, Comp, HealthComp, InvComp, EnhancedPhysicsComp, GravityComp, Trigger, Itvl, FixedItvl };
