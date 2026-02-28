var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HealthComp_instances, _HealthComp_consume;
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
 * Thrown when `CanvasRenderingContext2D` cannot be gotten.
 * @since v0.0.0
 */
class NoContextError extends Error {
    constructor() {
        super("Cannot get context 2D.");
        this.name = "NoContextError";
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
class NoCanvasError extends Error {
    constructor() {
        super("Did not receive HTMLCanvasElement or HTMLElement in scene.");
        this.name = "NoCanvasError";
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
class ExistingProcessError extends Error {
    constructor() {
        super("A process already exists, cannot create new process.");
        this.name = "ExistingProcessError";
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
class NoProcessError extends Error {
    constructor() {
        super("A process does not exist.");
        this.name = "NoProcessError";
    }
}
/**
 * Thrown by trying to use a component that's already in use.
 * @since v0.0.0
 * @example
 * ```
 * const ent = new Phantom2dEntity({});
 * ent.use("health"); // use HealthComp
 * ent.use("health"); // cannot use again
 * ```
 */
class AlreadyUsingError extends Error {
    constructor() {
        super("Already using this component, cannot use again.");
        this.name = "AlreadyUsingError";
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
 * const ent = new Phantom2dEntity({});
 * ent.use("sprite", { frames: ["frame0.jpg"] }); // no scene property
 * scene.add(ent);
 * scene.start(); // cannot render without scene
 * ```
 */
class NoSceneAvailableError extends Error {
    constructor() {
        super("A component requires a scene reference, but none was provided.");
        this.name = "NoSceneAvailableError";
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
 * const ent = new Phantom2dEntity({});
 * ent.use("sprite", { scene: canvas }); // no frames property
 * scene.add(ent);
 * scene.start(); // throws error on first tick of ent
 * ```
 */
class OutOfBoundsError extends Error {
    constructor() {
        super("Index exceeds length; could not get crucial value.");
        this.name = "OutOfBoundsError";
    }
}
/**
 * A storage for items.
 * @since v0.0.0
 */
class Store {
    constructor() {
        this.store = new Map();
    }
    /**
     * Retrieves an entry.
     * @param key The key to get.
     * @returns {TO | undefined} The entry or nothing.
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
     * @returns {boolean} If this item is contained.
     * @since v0.0.0
     */
    has(key) {
        return this.store.has(key);
    }
    /**
     * Removes an entry from this storage.
     * @param key The key to delete.
     * @returns {boolean} If the key was deleted.
     * @since v0.0.0
     */
    del(key) {
        return this.store.delete(key);
    }
    /**
     * Returns an iterator for this keys.
     * @returns {Iter<TI>} The iterator.
     * @since v0.0.0
     */
    keys() {
        return this.store.keys();
    }
    /**
     * Returns an iterator for this values.
     * @returns {Iter<TI>} The iterator.
     * @since v0.0.0
     */
    values() {
        return this.store.values();
    }
    /**
     * Returns an iterator for this entries.
     * @returns {Iter<[TI, TO]>} The iterator.
     * @since v0.0.0
     */
    items() {
        return this.store.entries();
    }
}
/**
 * The synthetic event class.
 * @since v0.0.0
 */
class PhantomEvent {
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
/**
 * The component class.
 * @since v0.0.0
 */
class Comp {
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
    constructor(ent, opts) {
        var _a;
        super(ent);
        _HealthComp_instances.add(this);
        this.hp = (_a = opts.hp) !== null && _a !== void 0 ? _a : 0;
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
        __classPrivateFieldGet(this, _HealthComp_instances, "m", _HealthComp_consume).call(this, this.onHurt, "hurt", new PhantomHealthCompHurtEvent());
        if (this.hp <= 0)
            this.die();
    }
    /**
     * Kills this entity.
     * @since v0.0.0
     */
    die() {
        __classPrivateFieldGet(this, _HealthComp_instances, "m", _HealthComp_consume).call(this, this.onDie, "die", new PhantomHealthCompDieEvent());
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
        __classPrivateFieldGet(this, _HealthComp_instances, "m", _HealthComp_consume).call(this, this.onHeal, "heal", new PhantomHealthCompHealEvent());
    }
}
_HealthComp_instances = new WeakSet(), _HealthComp_consume = function _HealthComp_consume(fn, k, e) {
    if (fn)
        fn(e);
    else
        this.consume(k, e);
};
/**
 * A simple inventory system.
 * @since v0.0.0
 */
class InvComp extends Comp {
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
        for (let i = 0; i < items.length; i++) {
            if (this.size && this.inv.length >= this.size)
                continue;
            this.inv.push(items[i]);
        }
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
     * @returns {booelan} If it contains all the items.
     * @since v0.0.0
     */
    has(...items) {
        return ArrayUtil.has(this.inv, ...items);
    }
    /**
     * Returns the index of an item.
     * @param i The item.
     * @returns {number} The index.
     * @since v0.0.0
     */
    idxOf(i) {
        return this.inv.indexOf(i);
    }
    /**
     * Returns the length of the inventory.
     * @returns {number} The length.
     * @since v0.0.0
     */
    len() {
        return this.inv.length;
    }
    /**
     * Returns an item at the index.
     * @param i The index.
     * @returns {any} The item.
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
    constructor(ent, opts) {
        var _a;
        super(ent);
        this.frames = ((_a = opts.frames) !== null && _a !== void 0 ? _a : []).map(Img.from);
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
/**
 * The record used to create components.
 * @since v0.0.0
 */
const PhantomCompRecord = {
    health: HealthComp,
    inv: InvComp,
    sprite: SpriteComp
};
/**
 * The class used for creating components for the scene.
 * @since v0.0.0
 */
class SceneComp {
    constructor(scene) {
        this.scene = scene;
    }
}
/**
 * A simple tile display for the scene.
 * @since v0.0.0
 */
class SceneTilesComp extends SceneComp {
    constructor(scene, opts) {
        var _a;
        super(scene);
        this.size = (_a = opts.size) !== null && _a !== void 0 ? _a : 0;
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
class Phantom2dEntity {
    constructor(opts) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.collide = (_a = opts.collide) !== null && _a !== void 0 ? _a : ((o) => { });
        this.upd = (_b = opts.upd) !== null && _b !== void 0 ? _b : NoFunc;
        this.x = (_c = opts.x) !== null && _c !== void 0 ? _c : 0;
        this.y = (_d = opts.y) !== null && _d !== void 0 ? _d : 0;
        this.rot = (_e = opts.rot) !== null && _e !== void 0 ? _e : 0;
        this.width = (_f = opts.width) !== null && _f !== void 0 ? _f : 0;
        this.height = (_g = opts.height) !== null && _g !== void 0 ? _g : 0;
        this.evStore = new Store();
        this.color = (_h = opts.color) !== null && _h !== void 0 ? _h : "#fff";
        if (opts.custom)
            for (const [k, v] of Object.entries(opts.custom)) {
                this[k] = v;
            }
        this.comps = new Store();
    }
    /**
     * Sets the position.
     * @param x The new x pos (or `Vector`).
     * @param y The new y pos.
     * @since v0.0.0
     */
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
        this.evStore.set(event, handle);
    }
    /**
     * Removes a listener for an event.
     * @param event The event type.
     * @since v0.0.0
     */
    off(event) {
        this.evStore.del(event);
    }
    /**
     * Consumes an event.
     * @param title The event type.
     * @param event The actual event.
     * @since v0.0.0
     */
    consume(title, event) {
        const handle = this.evStore.get(title);
        if (handle) {
            handle(event);
        }
    }
    /**
     * Returns this width.
     * @returns {number} The width.
     * @since v0.0.0
     */
    getWidth() {
        return this.width;
    }
    /**
     * Returns this height.
     * @returns {number} The height.
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
     * @returns {string} This, as a string.
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
     * @returns {Preset} This, as a `Preset`.
     * @since v0.0.0
     */
    preset() {
        return new Preset(this);
    }
    /**
     * Returns the center coordinate.
     * @returns {Vector} The center coordinate.
     * @since v0.0.0
     */
    center() {
        return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    }
    /**
     * Returns the real screen position (accounting for width and height).
     * @returns {Vector} The screen position.
     * @since v0.0.0
     */
    scrPos() {
        return new Vector(this.x + this.width, this.y + this.height);
    }
    /**
     * Returns the real screen x (accounting for width).
     * @returns {number} The screen x.
     * @since v0.0.0
     */
    scrX() {
        return this.scrPos().x;
    }
    /**
     * Retunrs the real screen y (accounting for height).
     * @returns {number} The screen y.
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
     */
    use(c, opts = {}) {
        if (this.uses(c))
            throw new AlreadyUsingError();
        this.comps.set(c, new (PhantomCompRecord[c])(this, opts));
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
     * @returns {boolean} If it is in use.
     * @since v0.0.0
     */
    uses(c) {
        return this.comps.has(c);
    }
    /**
     * Returns a reference to this component.
     * @param c The component type.
     * @returns {Comp | undefined} The component (or nothing).
     * @since v0.0.0
     */
    comp(c) {
        return this.comps.get(c);
    }
    /**
     * Returns a new entity.
     * @param opts The options to use.
     * @returns {Phantom2dEntity} The new entity.
     * @since v0.0.0
     */
    static from(opts) {
        return new Phantom2dEntity(opts);
    }
}
/**
 * A simple object that is primarily used for scenery.
 *
 * This object has no special attributes.
 * @since v0.0.0
 */
class StaticObject extends Phantom2dEntity {
    constructor(opts) {
        super(opts);
    }
    static from(opts) {
        return new StaticObject(opts);
    }
}
/**
 * A simple object that uses physics.
 * @since v0.0.0
 */
class PhysicsObject extends Phantom2dEntity {
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
        return new PhysicsObject(opts);
    }
}
/**
 * An object that moves in both x and y directions.
 *
 * Optionally, it can bounce on extent reached.
 * @since v0.0.0
 */
class MovingObject extends Phantom2dEntity {
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
        return new MovingObject(opts);
    }
}
/**
 * Similar to a moving object, this will fly across the screen.
 *
 * Will automatically destroy itself when reaching an extent.
 * @since v0.0.0
 */
class BulletObject extends Phantom2dEntity {
    constructor(opts) {
        super(opts);
        this.rot = opts.rot;
        this.extLeft = opts.extLeft;
        this.extRight = opts.extRight;
        this.extBtm = opts.extBtm;
        this.extTop = opts.extTop;
        this.spd = opts.spd;
        this.scene = opts.scene;
    }
    update() {
        const fVec = this.getFVec();
        fVec.scale(this.spd);
        this.x += fVec.x;
        this.y += fVec.y;
        // test if its on-screen
        // tolerance of 15px
        const x = this.scrX();
        const y = this.scrY();
        const w = this.scene.width;
        const h = this.scene.height;
        if (x - 15 < w || x + 15 > w || y + 15 > h || y - 15 < h) {
            // self-destruct if its not
            this.scene.rm(this);
        }
    }
    static from(opts) {
        return new BulletObject(opts);
    }
}
/**
 * The root class for other character-like classes.
 *
 * Provides functionality for characters; uses physics.
 * @since v0.0.0
 */
class Character extends Phantom2dEntity {
    constructor(opts) {
        super(opts);
        this.gspd = 0;
    }
    setGSpd(spd) {
        this.gspd = spd;
    }
    getGSpd() {
        return this.gspd;
    }
    jump(h) {
        this.gspd = -(h);
    }
}
/**
 * A character that also has bindings.
 *
 * Automatically listens for `keydown` and `keyup` events.
 * @since v0.0.0
 */
class PlayableCharacter extends Character {
    constructor(opts) {
        var _a;
        super(opts);
        this.binds = (_a = opts.binds) !== null && _a !== void 0 ? _a : new Store();
        this.keys = new Store();
        window.addEventListener("keydown", (e) => {
            this.keys.set(e.code, true);
        });
        window.addEventListener("keyup", (e) => {
            this.keys.set(e.code, false);
        });
    }
    bind(code, exec) {
        this.binds.set(code, exec);
    }
    unbind(code) {
        this.binds.del(code);
    }
    isBind(code) {
        return this.binds.has(code);
    }
    bindOf(code) {
        return this.binds.get(code);
    }
    update() {
        for (const [k, v] of this.keys.items()) {
            if (v) {
                const exec = this.binds.get(KeyCodeMapReverse[k]);
                if (exec) {
                    exec();
                }
            }
        }
        super.update();
    }
}
/**
 * A 2D vector.
 *
 * Part of the broader vector ecosystem.
 * @since v0.0.0
 */
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    scale(factor) {
        this.x *= factor;
        this.y *= factor;
    }
}
/**
 * A pixel.
 * @since v0.0.0
 */
class Pixel {
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
/**
 * An audio source.
 *
 * Used to play long-lasting sounds, NOT SFX.
 * @since v0.0.0
 */
class Sound {
    constructor(opts) {
        this.src = opts.src;
        this.mime = opts.mime;
        this.aud = new Audio();
        const source = document.createElement("source");
        source.src = this.src;
        source.type = this.mime.startsWith("audio") ? this.mime : `audio/${this.mime}`;
        this.aud.appendChild(source);
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
}
/**
 * An image.
 *
 * Shorthand for `HTMLImageElement`.
 * @since v0.0.0
 */
class Img {
    constructor(src) {
        this.img = new Image();
        this.img.src = src;
    }
    static from(src) {
        return new Img(src);
    }
}
/**
 * A component to store various elements.
 * @since v0.0.0
 */
class Items {
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
        return items.every(i => this.items.includes(i));
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
}
/**
 * The root canvas to display content.
 * @since v0.0.0
 */
class Scene {
    constructor(opts) {
        var _a, _b, _c, _d;
        if (!opts.canvas)
            throw new NoCanvasError();
        this.canvas = opts.canvas instanceof HTMLCanvasElement ? opts.canvas : opts.canvas;
        this.canvas.width = (_a = opts.w) !== null && _a !== void 0 ? _a : 0;
        this.canvas.height = (_b = opts.h) !== null && _b !== void 0 ? _b : 0;
        this.canvas.style.width = (_c = opts.cssW) !== null && _c !== void 0 ? _c : "0px";
        this.canvas.style.height = (_d = opts.cssH) !== null && _d !== void 0 ? _d : "0px";
        const ctx = this.canvas.getContext("2d");
        if (!ctx)
            throw new NoContextError();
        this.ctx = ctx;
        this.items = new Items();
        this.evStore = new Store();
        this.lvlStore = new Store();
        this.mousePos = new Vector(0, 0);
        window.addEventListener("mousemove", (e) => {
            this.mousePos = new Vector(e.clientX, e.clientY);
        });
        this.runtime = new Runtime();
        this.comps = new Store();
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
    on(name, handle) {
        this.evStore.set(name, handle);
        this.canvas.addEventListener(name, handle);
    }
    off(name, handle) {
        if (handle)
            this.canvas.removeEventListener(name, handle !== null && handle !== void 0 ? handle : this.evStore.get(name));
        this.evStore.del(name);
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
    get color() {
        return this.ctx.fillStyle;
    }
    set color(color) {
        this.ctx.fillStyle = color;
    }
    img(img, x, y, w, h) {
        this.ctx.drawImage(img instanceof HTMLImageElement ? img : img.img, x, y, w, h);
    }
    rect(x, y, w, h, color) {
        this.color = color;
        this.ctx.fillRect(x, y, w, h);
    }
    bg(color) {
        this.rect(0, 0, this.width, this.height, color);
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    update() {
        this.forEach(i => i.update());
        this.testCols();
    }
    testCols() {
        this.forEach(a => {
            this.forEach(b => {
                if (a == b)
                    return;
                if (isCol(a, b)) {
                    a.collide(b);
                }
            });
        });
    }
    render() {
        this.items.forEach(i => {
            this.ctx.save();
            this.ctx.rotate(i.rot);
            this.rect(-i.width / 2, -i.height / 2, i.width, i.height, i.color);
            this.ctx.restore();
        });
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
    use(c, opts = {}) {
        if (this.uses(c))
            throw new AlreadyUsingError();
        this.comps.set(c, new (PhantomSceneCompRecord[c])(this, opts));
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
    clickAt(e) {
        const rect = this.bounds();
        return new Vector(e.clientX - rect.left, e.clientY - rect.top);
    }
}
/**
 * A collection of items.
 *
 * Can be used as a `Preset` for `Scene`.
 * @since v0.0.0
 */
class Level {
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
    constructor(opts) {
        this.file = opts.file;
        this.mime = opts.mime;
        this.ext = opts.ext;
    }
    save(cont) {
        const blob = new Blob([cont], { type: this.mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = `${this.file}.${this.ext}`;
        a.click();
        document.body.removeChild(a);
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
                if (res && hit < res.dist)
                    res = new RaycastIntersecton(hit, i, new Vector(this.origin.x + dir.x * hit, this.origin.y + dir.y * hit));
            }
        }
        return res;
    }
}
/**
 * The intersection returned by a `Raycast` collision.
 * @since v0.0.0
 */
class RaycastIntersecton {
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
    }
}
/**
 * The geometric object root class.
 * @since v0.0.0
 */
class Geom {
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
/**
 * Returns whether 2 objects are in collision.
 * @param a Object 1.
 * @param b Object 2.
 * @returns {boolean} If they collide.
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
 * @returns {number | null} The distance of intersection (if there was one).
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
 * @returns {Vector} A new UV `Vector`.
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
export { NoFunc, NoContextError, ExistingProcessError, NoCanvasError, NoProcessError, PhantomEvent, PhantomAliveEvent, PhantomAddedEvent, PhantomRemovedEvent, Phantom2dEntity, StaticObject, PhysicsObject, MovingObject, BulletObject, Scene, Character, PlayableCharacter, Save, SaveJSON, Sound, Preset, Level, Items, Store, Vector, Pixel, Raycast, RaycastIntersecton, isCol, rayInterRect, uvVec };
