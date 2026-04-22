/**
 * Various utilities.
 * @since v0.0.0
 */
class Util {
    static str(o: any, space?: number): string {
        return JSON.stringify(o, null, space);
    }
    static clamp(n: number, min: number, max: number): number {
        return Math.min(Math.max(n, min), max);
    }
    static strOf(o: any): string {
        return typeof o == "string" ? o : Util.str(o);
    }
}
class ArrayUtil {
    static add(arr: any[], ...items: any[]) {
        arr.push(...items);
    }
    static rm(arr: any[], ...items: any[]) {
        for(const i of items) {
            if(ArrayUtil.has(arr, i)) {
                arr.splice(arr.indexOf(i), 1);
            }
        }
    }
    static has(arr: any[], ...items: any[]): boolean {
        return items.every(i => arr.includes(i));
    }
}

/**
 * Represents custom properties to
 * be attached during creation.
 * @since v0.0.0
 */
type Custom = { [x: string]: any };
/**
 * Represents an axis.
 * 
 * Axis Map
 * 
 * --------
 * 
 * "x", 0 - x-axis
 * 
 * "y", 1 - y-axis
 * @since v0.0.0
 */
type Axis = "x" | "y" | 0 | 1;
/**
 * A simple direction.
 * 
 * 0 = x
 * 
 * 1 = y
 * @since v0.0.0
 */
type Dir = 0 | 1;
/**
 * A handle for an event.
 * 
 * Takes one argument, the event.
 * @since v0.0.0
 */
type EventHandle = (e: Event) => void;
/**
 * An event from `HTMLElementEventMap`.
 * @see {@link HTMLElementEventMap}
 * @since v0.0.0
 */
type EventType = Key<HTMLElementEventMap>;
/**
 * The base to all callbacks, such as the ones used in `Array.prototype.forEach` and `Array.prototype.filter`.
 * 
 * The type T represents the value/array type. The type R represents the return type.
 * @since v1.0.8
 */
type CallbackBase<T, R> = (value: T, index: number, array: T[]) => R;
/**
 * The `void` callback used in methods such as `Array.prototype.forEach`.
 * @since v0.0.0
 */
type Callback<T> = CallbackBase<T, void>;
/**
 * The common `Entity` callback.
 * @since v1.0.8
 */
type CallbackEntity = Callback<Entity>;
/**
 * The `unknown` callback used in methods such as `Array.prototype.filter`.
 * @since v1.0.8
 */
type Predicate<T> = CallbackBase<T, unknown>;
/**
 * The common `Entity` predicate.
 * @since v1.0.8
 */
type PredicateEntity = Predicate<Entity>;
/**
 * The predicate used in `Array.protoype.find`.
 * @since v1.0.15
 */
type FindPredicate<T> = (value: T, index: number, obj: T[]) => value is T;
type FindPredicateEntity = FindPredicate<Entity>;
/**
 * An event in the `PhantomEventMap`.
 * @see {@link PhantomEventMap}
 * @since v0.0.0
 */
type PhantomEventType = Key<PhantomEventMap>;
/**
 * A handler for a Phantom Event.
 * 
 * Takes one argument, the event.
 * @since v0.0.0
 */
type PhantomEventHandle = (e: PhantomEvent) => void;
/**
 * An audio MIME type. With or without the `audio/` prepension.
 * @since v0.0.0
 * @deprecated Since v1.0.4. No longer supported.
 */
type AudioMIME = "audio/wav" | "audio/mpeg" | "audio/mp4" | "audio/webm" | "audio/ogg" | "audio/aac" | "audio/aacp" | "audio/x-caf" | "audio/flac" |
                "wav" | "mpeg" | "mp4" | "webm" | "ogg" | "aac" | "aacp" | "x-caf" | "flac";
/**
 * A handle for collisions between entities.
 * 
 * Takes one argument, the colliding object.
 * @since v0.0.0
 */
type CollisionHandle = (o: Entity) => void;
/**
 * A shorthand for `MapIterator`.
 * @see {@link MapIterator}
 * @since v0.0.0
 */
type Iter<T> = MapIterator<T>;
/**
 * An element in the `PhantomCompMap`.
 * @see {@link PhantomCompMap}
 * @since v0.0.0
 */
type PhantomCompType = Key<PhantomCompMap>;
/**
 * An element in the `PhantomSceneCompMap`.
 * @see {@link PhantomSceneCompMap}
 * @since v0.0.0
 */
type PhantomSceneCompType = Key<PhantomSceneCompMap>;
/**
 * A factory for creating component records.
 * @since v0.0.0
 */
type CompRecord<A, B, C> = Record<string, new (ent: A, opts: B) => C>;
/**
 * An element from the `GeomMap`.
 * @see {@link GeomMap}
 * @since v0.0.0
 */
type GeomType = Key<GeomMap>;
/**
 * A keyof T.
 * @since v0.0.0
 */
type Key<T> = keyof T;
type Frame = Img | undefined;
type Frames = Img[];
/**
 * The movement allowed for an entity.
 * 
 * A move mode of `fixed` will not allow any movement.
 * 
 * A move mode of `move` will alow all movement.
 * @since v1.0.15
 */
type MoveMode = "fixed" | "move";
type Constructor<T> = new (...args: any[]) => T;
type AbstractConstructor<T> = abstract new (...args: any[]) => T;
type FillStyle = string | CanvasGradient | CanvasPattern;
type Pair<A, B> = [A, B];
type PCExecCDPair = Pair<Function, Cooldown>;
type Real<T> = Exclude<T, null | undefined>;
type Nullish<T> = T | null | undefined;
/**
 * A simple, no-exec function shorthand.
 * @since v0.0.0
 */
const NoFunc: Function = (() => {});

/**
 * A simplified class for creating errors.
 * @since v1.0.5
 */
class ErrRoot extends Error {
    constructor(name: string, msg: string) {
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
class Store<TI, TO> {
    store: Map<TI, TO>;
    constructor() {
        this.store = new Map();
    }
    /**
     * Retrieves an entry.
     * @param key The key to get.
     * @returns The entry (or nothing).
     * @since v0.0.0
     */
    get(key: TI): TO | undefined {
        return this.store.get(key);
    }
    /**
     * Sets an entry.
     * @param key The key to set.
     * @param value The value of the new entry.
     * @since v0.0.0
     */
    set(key: TI, value: TO) {
        this.store.set(key, value);
    }
    /**
     * Returns whether this store contains an item.
     * @param key The key to get.
     * @returns If this item is contained.
     * @since v0.0.0
     */
    has(key: TI): boolean {
        return this.store.has(key);
    }
    /**
     * Removes an entry from this storage.
     * @param key The key to delete.
     * @returns If the key was deleted.
     * @since v0.0.0
     */
    del(key: TI): boolean {
        return this.store.delete(key);
    }
    /**
     * Returns an iterator for this keys.
     * @returns The iterator.
     * @since v0.0.0
     */
    keys(): Iter<TI> {
        return this.store.keys();
    }
    /**
     * Returns an iterator for this values.
     * @returns The iterator.
     * @since v0.0.0
     */
    values(): Iter<TO> {
        return this.store.values();
    }
    /**
     * Returns an iterator for this entries.
     * @returns The iterator.
     * @since v0.0.0
     */
    items(): Iter<[TI, TO]> {
        return this.store.entries();
    }
}
/**
 * A metaphorical "box" of items.
 * 
 * Useful for array-based classes.
 * @since v1.0.8
 */
class ItemBox<T> {
    stuff: T[];
    constructor() {
        this.stuff = [];
    }
    add(...stuff: T[]) {
        ArrayUtil.add(this.stuff, ...stuff);
    }
    rm(...stuff: T[]) {
        ArrayUtil.rm(this.stuff, ...stuff);
    }
    forEach(cb: Callback<T>) {
        this.stuff.forEach(cb);
    }
    has(...stuff: T[]): boolean {
        return ArrayUtil.has(this.stuff, ...stuff);
    }
    find(cb: FindPredicate<T>): T | undefined {
        return this.stuff.find(cb);
    }
    filter(cb: Predicate<T>): T[] {
        return this.stuff.filter(cb);
    }
    some(cb: Predicate<T>): boolean {
        return this.stuff.some(cb);
    }
}

/**
 * The general options for a `Entity`.
 * @since v0.0.0
 */
interface EntityOptions {
    /**
     * The handler for a collision.
     * @since v0.0.0
     */
    collide?: CollisionHandle;
    /**
     * The x-coordinate.
     * @since v0.0.0
     */
    x?: number;
    /**
     * The y-coordinate.
     * @since v0.0.0
     */
    y?: number;
    /**
     * The rotation (in radians).
     * @since v0.0.0
     */
    rot?: number;
    /**
     * The width.
     * @since v0.0.0
     */
    width?: number;
    /**
     * The height.
     * @since v0.0.0
     */
    height?: number;
    /**
     * Custom properties.
     * @since v0.0.0
     */
    custom?: Custom;
    /**
     * An update to be ran during this update.
     * @since v0.0.0
     */
    upd?: Function;
    /**
     * The display color.
     * @since v0.0.0
     */
    color?: string;
    /**
     * The movement mode.
     * @since v1.0.4
     */
    moveMode?: MoveMode;
}
/**
 * The options for a `StaticObject`.
 * @since v0.0.0
 */
interface StaticObjectOptions extends EntityOptions {
    /**
     * The display shape.
     * @since v0.0.0
     */
    shape: GeomType;
}
/**
 * The options for a `PhysicsObject`.
 * @since v0.0.0
 */
interface PhysicsObjectOptions extends EntityOptions {
    /**
     * The strength of gravity.
     * @since v0.0.0
     */
    strength: number;
}
/**
 * Requires extent values for left, right, top and bottom.
 * @since v0.0.0
 */
interface Extent {
    /**
     * The min x value.
     * @since v0.0.0
     */
    extLeft: number;
    /**
     * The max x value.
     * @since v0.0.0
     */
    extRight: number;
    /**
     * The max y value.
     * @since v0.0.0
     */
    extBtm: number;
    /**
     * The min y value.
     * @since v0.0.0
     */
    extTop: number;
}
/**
 * The options for a `MovingObject`.
 * @since v0.0.0
 */
interface MovingObjectOptions extends EntityOptions, Extent {
    /**
     * The direction to start in. (for x)
     * @since v0.0.0
     */
    dirX: Dir;
    /**
     * The direction to start in. (for y)
     * @since v0.0.0
     */
    dirY: Dir;
    /**
     * If this should bounce on the event of the extent being reached.
     * @since v0.0.0
     */
    bouncy: boolean;
    /**
     * The movement speed.
     * @since v0.0.0
     */
    spd: number;
}
/**
 * The options for a `BulletObject`.
 * @since v0.0.0
 */
interface BulletObjectOptions extends EntityOptions, Extent {
    /**
     * The movement speed.
     * @since v0.0.0
     */
    spd: number;
    rot: number;
    /**
     * A reference to the `Scene`.
     * @since v0.0.0
     */
    scene: Scene;
    onDest?: PhantomEventHandle;
    tol?: number;
    /**
     * The rate of decay (to simulate a bullet's loss of speed over time).
     * 
     * A decay rate of 0 would never decay.
     * @since v1.0.27
     */
    decay?: number;
}
/**
 * The options for a `Scene`.
 * @since v0.0.0
 */
interface SceneOptions {
    /**
     * The actual canvas.
     * 
     * Or, the element id (>=v1.0.5).
     * @since v0.0.0
     */
    canvas: HTMLCanvasElement | HTMLElement | string | null;
    /**
     * The px width.
     * @since v0.0.0
     */
    w?: number;
    /**
     * The px height.
     * @since v0.0.0
     */
    h?: number;
    /**
     * The display width.
     * @since v0.0.0
     */
    cssW?: string;
    /**
     * The display height.
     * @since v0.0.0
     */
    cssH?: string;
    /**
     * A border to be applied.
     * 
     * It's good practice to add a border to prevent canvas collapse on load.
     * @since v1.0.20
     */
    border?: CSSStyleDeclaration["border"];
}
interface WallObjectOptions extends EntityOptions {}
/**
 * Synthetic events.
 * @since v0.0.0
 */
interface PhantomEventMap {
    /**
     * The `PhantomAliveEvent`.
     * @see {@link PhantomAliveEvent}
     * @since v0.0.0
     */
    alive: PhantomAliveEvent;
    /**
     * The `PhantomAddedEvent`.
     * @see {@link PhantomAddedEvent}
     * @since v0.0.0
     */
    added: PhantomAddedEvent;
    /**
     * The `PhantomRemovedEvent`.
     * @see {@link PhantomRemovedEvent}
     * @since v0.0.0
     */
    removed: PhantomRemovedEvent;
    /**
     * The `HealthComp`'s `HurtEvent`.
     * @see {@link PhantomHealthCompHurtEvent}
     * @since v0.0.0
     */
    hurt: PhantomHealthCompHurtEvent;
    /**
     * The `HealthComp`'s `DieEvent`.
     * @see {@link PhantomHealthCompDieEvent}
     * @since v0.0.0
     */
    die: PhantomHealthCompDieEvent;
    /**
     * The `HealthComp`'s `HealEvent`.
     * @see {@link PhantomHealthCompHealEvent}
     * @since v0.0.0
     */
    heal: PhantomHealthCompHealEvent;
    /**
     * The `DestroyedEvent`.
     * @see {@link PhantomDestroyedEvent}
     * @since v1.0.21
     */
    destroyed: PhantomDestroyedEvent;
}
/**
 * The options for a `Save`.
 * @since v0.0.0
 */
interface SaveOptions {
    /**
     * The filename.
     * @since v0.0.0
     */
    file: string;
    /**
     * The MIME type.
     * @since v0.0.0
     */
    mime: string;
    /**
     * The file extension.
     * @since v0.0.0
     */
    ext: string;
}
/**
 * The options for a `Sound`.
 * @since v0.0.0
 */
interface SoundOptions {
    /**
     * The source of the sound.
     * @since v0.0.0
     */
    src: string;
}
/**
 * The older options for `Sound`.
 * @since v1.0.4
 */
interface SoundOptionsDeprecated extends SoundOptions {
    /**
     * The MIME type of the sound.
     * @since v0.0.0
     * @deprecated Since v1.0.4. No longer supported.
     */
    mime: AudioMIME;
}
/**
 * The options for a `Character`.
 * @since v0.0.0
 */
interface CharacterOptions extends PhysicsObjectOptions {}
/**
 * The options for a `PlayableCharacter`.
 * @since v0.0.0
 */
interface PlayableCharacterOptions extends CharacterOptions {
    /**
     * The keybinds.
     * @since v0.0.0
     */
    binds?: Store<KeyCode, Function>;
}
/**
 * The options for a `Raycast`.
 * @since v0.0.0
 */
interface RaycastOptions {
    /**
     * The origin position of the ray.
     * @since v0.0.0
     */
    origin: Vector;
    /**
     * The angle to travel at.
     * @since v0.0.0
     */
    angle: number;
    /**
     * The maximum distance the ray can travel.
     * @since v0.0.0
     */
    dist: number;
    /**
     * The `Scene`.
     * @since v0.0.0
     */
    scene: Scene;
}
/**
 * The map for `Comp`.
 * @since v0.0.0
 */
interface PhantomCompMap {
    /**
     * The `HealthComp`.
     * @see {@link HealthComp}
     * @since v0.0.0
     */
    health: HealthComp;
    /**
     * The `InvComp`.
     * @see {@link InvComp}
     * @since v0.0.0
     */
    inv: InvComp;
    /**
     * The `SpriteComp`.
     * @see {@link SpriteComp}
     * @since v0.0.0
     */
    sprite: SpriteComp;
    /**
     * The `PointAtComp`.
     * @see {@link PointAtComp}
     * @since v1.0.17
     */
    pointat: PointAtComp;
    /**
     * The `PointAtMouseComp`.
     * @see {@link PointAtMouseComp}
     * @since v1.0.17
     */
    pointatmouse: PointAtMouseComp;
    /**
     * The `EnhancedPhysicsComp`.
     * @see {@link EnhancedPhysicsComp}
     * @since v1.0.23
     */
    enhancedphys: EnhancedPhysicsComp;
    /**
     * The `GravityComp`.
     * @see {@link GravityComp}
     * @since v1.0.28
     */
    grav: GravityComp;
    arcmoveorbit: ArcMoveOrbitComp;
    arcmovesling: ArcMoveSlingComp;
}
/**
 * The map for `SceneComp`.
 * @since v0.0.0
 */
interface PhantomSceneCompMap {
    /**
     * The `SceneTilesComp`.
     * @see {@link SceneTilesComp}
     * @since v0.0.0
     */
    tiles: SceneTilesComp;
}
/**
 * The options for a `Comp`.
 * @since v0.0.0
 */
interface CompOptions {}
interface CompUseScene {
    scene?: Scene;
}
/**
 * The options for a `HealthComp`.
 * @since v0.0.0
 */
interface HealthCompOptions extends CompOptions {
    /**
     * The health points.
     * @since v0.0.0
     */
    hp?: number;
    /**
     * The maximum health points.
     * @since v0.0.0
     */
    mhp?: number;
    /**
     * A handle for the hurt event.
     * 
     * Default to consuming the `PhantomHealthCompHurtEvent`.
     * @since v0.0.0
     */
    onHurt?: PhantomEventHandle;
    /**
     * A handle for the die event.
     * 
     * Default to consuming the `PhantomHealthCompDieEvent`.
     * @since v0.0.0
     */
    onDie?: PhantomEventHandle;
    /**
     * A handle for the heal event.
     * 
     * Default to consuming the `PhantomHealthCompHealEvent`.
     * @since v0.0.0
     */
    onHeal?: PhantomEventHandle;
}
/**
 * The options for a `InvComp`.
 * @since v0.0.0
 */
interface InvCompOptions extends CompOptions {
    /**
     * The max size of the inv.
     * @since v0.0.0
     */
    size?: number;
}
interface SpriteCompOptions extends CompOptions, CompUseScene {
    frames?: string[];
}
interface PointAtCompBaseOptions extends CompOptions, CompUseScene {}
interface PointAtCompOptions extends PointAtCompBaseOptions {
    point?: Entity;
}
interface PointAtMouseCompOptions extends PointAtCompBaseOptions {}
interface EnhancedPhysicsOptions extends CompOptions, CompUseScene {
    vx?: number;
    vy?: number;
    ax?: number;
    ay?: number;
    fric?: number;
}
interface GravityCompOptions extends CompOptions {
    strength?: number;
    gspd?: number;
}
interface ArcMoveOptions extends CompOptions {}
interface ArcMoveOrbitOptions extends ArcMoveOptions {
    origin?: Entity | Vector;
    spd?: number;
    angle?: number;
    rad?: number;
}
interface ArcMoveSlingOptions extends ArcMoveOptions {
    strength?: number;
}
/**
 * The options for a `SceneComp`.
 * @since v0.0.0
 */
interface SceneCompOptions {}
/**
 * The options for a `SceneTilesComp`.
 * @since v0.0.0
 */
interface SceneTilesCompOptions extends SceneCompOptions {
    /**
     * The size (WxH) of the tile.
     * @since v0.0.0
     */
    size?: number;
    /**
     * The nth tile's color.
     * @since v0.0.0
     */
    nth?: { [x: number]: string };
}
/**
 * The map for `Geom`.
 * @since v0.0.0
 */
interface GeomMap {
    /**
     * The basic `Geom`.
     * @see {@link Geom}
     * @since v0.0.0
     */
    geom: Geom;
    /**
     * The `GeomRect`.
     * @see {@link GeomRect}
     * @since v0.0.0
     */
    rect: GeomRect;
    /**
     * The `GeomCircle`.
     * @see {@link GeomCircle}
     * @since v0.0.0
     */
    circle: GeomCircle;
}
/**
 * The synthetic event class.
 * @since v0.0.0
 */
class PhantomEvent {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
/**
 * Fired when this first constructs.
 * @since v0.0.0
 */
class PhantomAliveEvent extends PhantomEvent { constructor() { super("alive"); } }
/**
 * Fired when this ent is added to the scene.
 * @since v0.0.0
 */
class PhantomAddedEvent extends PhantomEvent { constructor() { super("added"); } }
/**
 * Fired when this ent is removed from the scene.
 * @since v0.0.0
 */
class PhantomRemovedEvent extends PhantomEvent { constructor() { super("removed"); } }
/**
 * Fired when this ent takes damage.
 * @since v0.0.0
 */
class PhantomHealthCompHurtEvent extends PhantomEvent { constructor() { super("hurt"); } }
/**
 * Fired when this ent dies.
 * @since v0.0.0
 */
class PhantomHealthCompDieEvent extends PhantomEvent { constructor() { super("die"); } }
/**
 * Fired when this ent heals.
 * @since v0.0.0
 */
class PhantomHealthCompHealEvent extends PhantomEvent { constructor() { super("heal"); } }
class PhantomDestroyedEvent extends PhantomEvent { constructor() { super("destroyed"); } }
/**
 * The component class.
 * @since v0.0.0
 */
class Comp {
    ent: Entity;
    constructor(ent: Entity) {
        this.ent = ent;
    }
    /**
     * Consumes an event.
     * @param k The event type.
     * @param e The event.
     * @since v0.0.0
     */
    consume(k: PhantomEventType, e: PhantomEvent) {
        this.ent.consume(k, e);
    }
    /**
     * The updater for this component.
     * 
     * Called during `update`.
     * @since v0.0.0
     */
    upd() {}
}
/**
 * A simple health component.
 * @since v0.0.0
 */
class HealthComp extends Comp {
    hp: number; mhp?: number;
    onHurt?: PhantomEventHandle;
    onDie?: PhantomEventHandle;
    onHeal?: PhantomEventHandle;
    constructor(ent: Entity, opts: HealthCompOptions) {
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
    hurt(dmg: number) {
        this.hp -= dmg;
        this.#consume(this.onHurt, "hurt", new PhantomHealthCompHurtEvent());
        if(this.hp <= 0) this.die();
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
    heal(hp: number) {
        this.hp += hp;
        if(this.mhp) this.hp = Math.min(this.hp, this.mhp);
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
    #consume(fn: PhantomEventHandle | undefined, k: PhantomEventType, e: PhantomEvent) {
        if(fn) fn(e);
        else this.consume(k, e);
    }
}
/**
 * A simple inventory system.
 * @since v0.0.0
 */
class InvComp extends Comp {
    size?: number;
    inv: any[];
    constructor(ent: Entity, opts: InvCompOptions) {
        super(ent);
        this.size = opts.size;
        this.inv = [];
    }
    /**
     * Adds new items.
     * @param items The items to add.
     * @since v0.0.0
     */
    add(...items: any[]) {
        ArrayUtil.add(this.inv, ...items);
        if(this.size && this.inv.length > this.size) this.inv.length = this.size;
    }
    /**
     * Removes items.
     * @param items The items to remove.
     * @since v0.0.0
     */
    rm(...items: any[]) {
        ArrayUtil.rm(this.inv, ...items);
    }
    /**
     * Tests if this inventory contains the items passed.
     * @param items The items to check.
     * @returns If it contains all the items.
     * @since v0.0.0
     */
    has(...items: any[]): boolean {
        return ArrayUtil.has(this.inv, ...items);
    }
    /**
     * Returns the index of an item.
     * @param i The item.
     * @returns The index.
     * @since v0.0.0
     */
    idxOf(i: any): number {
        return this.inv.indexOf(i);
    }
    /**
     * Returns the length of the inventory.
     * @returns The length.
     * @since v0.0.0
     */
    len(): number {
        return this.inv.length;
    }
    /**
     * Returns an item at the index.
     * @param i The index.
     * @returns The item.
     * @since v0.0.0
     */
    at(i: number): any {
        return this.inv[i];
    }
}
/**
 * A displayable sprite, packages multiple image frames to use.
 * @since v0.0.0
 */
class SpriteComp extends Comp {
    frames: Frames;
    scene?: Scene;
    idx: number;
    constructor(ent: Entity, opts: SpriteCompOptions) {
        super(ent);
        this.frames = (opts.frames ?? []).map(Img.from);
        this.scene = opts.scene;
        this.idx = 0;
    }
    frame(idx: number) {
        this.idx = idx;
    }
    at(idx: number): Frame {
        return this.frames[idx];
    }
    cur(): Frame {
        return this.at(this.idx);
    }
    add(...items: Frames) {
        ArrayUtil.add(this.frames, ...items);
    }
    rm(...items: Frames) {
        ArrayUtil.rm(this.frames, ...items);
    }
    upd() {
        if(!this.scene) throw new NoSceneAvailableError();
        const c = this.cur();
        if(!c) throw new OutOfBoundsError();
        this.scene.img(c, this.ent.x, this.ent.y, this.ent.width, this.ent.height);
    }
}
class PointAtCompBase extends Comp {
    scene?: Scene;
    constructor(ent: Entity, opts: PointAtCompBaseOptions) {
        super(ent);
        this.scene = opts.scene;
    }
}
class PointAtComp extends PointAtCompBase {
    point?: Entity;
    constructor(ent: Entity, opts: PointAtCompOptions) {
        super(ent, opts);
        this.point = opts.point;
    }
    link(ent: Entity) {
        this.point = ent;
    }
    unlink() {
        this.point = undefined;
    }
    upd() {
        if(!this.scene) throw new NoSceneAvailableError();
        if(!this.point) return console.warn("No linked entity! Please add a link.");
        this.ent.setRot(this.scene.rotBtwn(this.ent, this.point));
    }
}
class PointAtMouseComp extends PointAtCompBase {
    constructor(ent: Entity, opts: PointAtMouseCompOptions) {
        super(ent, opts);
    }
    upd() {
        if(!this.scene) throw new NoSceneAvailableError();
        this.ent.setRot(this.scene.rotToMouse(this.ent));
    }
}
class EnhancedPhysicsComp extends Comp {
    scene?: Scene;
    vx: number; vy: number;
    ax: number; ay: number;
    fric: number;
    constructor(ent: Entity, opts: EnhancedPhysicsOptions) {
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
    addForce(fx: number, fy: number) {
        this.ax += fx;
        this.ay += fy;
    }
    addForceX(fx: number) {
        this.addForce(fx, 0);
    }
    addForceY(fy: number) {
        this.addForce(0, fy);
    }
    upd() {
        if(!this.scene) throw new NoSceneAvailableError();
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
    strength: number;
    gspd: number;
    constructor(ent: Entity, opts: GravityCompOptions) {
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
    origin: Entity | Vector;
    spd: number;
    angle: number;
    rad: number;
    constructor(ent: Entity, opts: ArcMoveOrbitOptions) {
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
    strength: number;
    vx: number;
    vy: number;
    constructor(ent: Entity, opts: ArcMoveSlingOptions) {
        super(ent);
        this.strength = opts.strength ?? 0;
        this.vx = 0;
        this.vy = 0;
    }
    launch(spd: number, angle: number) {
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
const PhantomCompRecord: CompRecord<Entity, CompOptions, Comp> = {
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
 * Maps components to their respective option interface.
 * @since v1.0.23
 */
interface PhantomCompOptionsMap {
    health: HealthCompOptions;
    inv: InvCompOptions;
    sprite: SpriteCompOptions;
    pointat: PointAtCompOptions;
    pointatmouse: PointAtMouseCompOptions;
    enhancedphys: EnhancedPhysicsOptions;
    grav: GravityCompOptions;
    arcmoveorbit: ArcMoveOrbitOptions;
    arcmovesling: ArcMoveSlingOptions;
}
/**
 * The class used for creating components for the scene.
 * @since v0.0.0
 */
class SceneComp {
    scene: Scene;
    constructor(scene: Scene) {
        this.scene = scene;
    }
}
/**
 * A simple tile display for the scene.
 * @since v0.0.0
 */
class SceneTilesComp extends SceneComp {
    size: number;
    nth?: { [x: number]: string }
    constructor(scene: Scene, opts: SceneTilesCompOptions) {
        super(scene);
        this.size = opts.size ?? 0;
        this.nth = opts.nth;
    }
}
interface PhantomSceneCompOptionsMap {
    tiles: SceneTilesCompOptions;
}
/**
 * The record used to create scene components.
 * @since v0.0.0
 */
const PhantomSceneCompRecord: CompRecord<Scene, SceneCompOptions, SceneComp> = {
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
const KeyCodeMapReverse: { [k: string]: string } = {};
for(const [k, v] of Object.entries(KeyCodeMap)) {
    if(Array.isArray(v)) continue;
    KeyCodeMapReverse[v] = k;
}
/**
 * A shorthand key.
 * @since v0.0.0
 */
type KeyCode = keyof typeof KeyCodeMap;

/**
 * The root class of all entities, providing base functionality.
 * @since v0.0.0
 */
class Entity {
    static defaults: EntityDefaults;
    /**
     * Fired when this object collides with another.
     * @since v0.0.0
     */
    collide: CollisionHandle;
    /**
     * A special function that is called during `update`.
     * @since v0.0.0
     */
    upd: Function;
    /**
     * The x-coordinate.
     * @since v0.0.0
     */
    x: number;
    /**
     * The y-coordinate.
     * @since v0.0.0
     */
    y: number;
    /**
     * The rotation, in radians.
     * @since v0.0.0
     */
    rot: number;
    /**
     * The displayed width, in pixels.
     * @since v0.0.0
     */
    width: number;
    /**
     * The displayed height, in pixels.
     * @since v0.0.0
     */
    height: number;
    /**
     * The display color.
     * @since v0.0.0
     */
    color: string;
    /**
     * The storage for listeners for events.
     * @since v0.0.0
     */
    evStore: Store<PhantomEventType, PhantomEventHandle[]>;
    [x: string]: any;
    comps: Store<PhantomCompType, Comp>;
    moveMode: MoveMode;
    evMng: PhantomEventManager;
    initState: SavedState;
    tags: TagList;
    child: ItemBox<Entity>;
    constructor();
    constructor(opts: EntityOptions);
    constructor(opts?: EntityOptions) {
        this.collide = opts?.collide ?? ((o: Entity) => {});
        this.upd = opts?.upd ?? NoFunc;
        this.x = opts?.x ?? Entity.defaults.get("x") ?? 0;
        this.y = opts?.y ?? Entity.defaults.get("y") ?? 0;
        this.rot = opts?.rot ?? Entity.defaults.get("rot") ?? 0;
        this.width = opts?.width ?? Entity.defaults.get("width") ?? 0;
        this.height = opts?.height ?? Entity.defaults.get("height") ?? 0;
        this.evStore = new Store();
        this.color = opts?.color ?? Entity.defaults.get("color") ?? "#fff";
        if(opts?.custom) for(const [k, v] of Object.entries(opts.custom)) {
            this[k] = v;
        }
        this.comps = new Store();
        this.moveMode = opts?.moveMode ?? "move";
        this.evMng = new PhantomEventManager(this, this.evStore);
        this.tags = new TagList();
        this.initState = new SavedState(this, "The state this object was in, at the time of construction.");
        this.child = new ItemBox();
    }
    /**
     * Sets the position, based on a `Vector`.
     * @param vec The `Vector` position.
     * @since v0.0.0
     */
    setPos(vec: Vector): void;
    /**
     * Sets the position, based on x and y coordinates.
     * @param x The x-coord.
     * @param y The y-coord.
     * @since v0.0.0
     */
    setPos(x: number, y: number): void;
    setPos(x: number | Vector, y?: number) {
        if(typeof x == "number" && typeof y == "number") {
            this.x = x;
            this.y = y;
        } else if(x instanceof Vector) {
            this.x = x.x;
            this.y = x.y;
        }
    }
    /**
     * Sets the rotation.
     * @param rad The new rotation.
     * @since v0.0.0
     */
    setRot(rad: number) {
        this.rot = rad;
    }
    /**
     * Sets the width.
     * @param w The new width.
     * @since v0.0.0
     */
    setWidth(w: number) {
        this.width = w;
    }
    /**
     * Sets the height.
     * @param h The new height.
     * @since v0.0.0
     */
    setHeight(h: number) {
        this.height = h;
    }
    /**
     * Returns a `Vector` object of the forward vector.
     * @returns {Vector} The forward vector.
     * @since v0.0.0
     */
    getFVec(): Vector {
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
    move(dist: number, axis: Axis) {
        if(this.moveMode == "fixed") return console.warn("Cannot move this entity, because it has a 'fixed' move mode.");
        if(axis == "x" || axis == 0) this.x += dist;
        else if(axis == "y" || axis == 1) this.y += dist;
    }
    /**
     * Moves a distance on the x-axis.
     * @param dist The distance to move.
     * @since v0.0.0
     */
    moveX(dist: number) {
        this.move(dist, "x");
    }
    /**
     * Moves a distance on the y-axis.
     * @param dist The distance to move.
     * @since v0.0.0
     */
    moveY(dist: number) {
        this.move(dist, "y");
    }
    /**
     * Clamps this position to a range.
     * @param min The min value.
     * @param max The max value.
     * @param axis The axis to clamp.
     * @since v0.0.0
     */
    clampPos(min: number, max: number, axis: Axis) {
        if(axis == "x" || axis == 0) this.x = Util.clamp(this.x, min, max);
        else if(axis == "y" || axis == 1) this.y = Util.clamp(this.y, min, max);
    }
    /**
     * Clamps this x position to a range.
     * @param min The min value.
     * @param max The max value.
     * @since v0.0.0
     */
    clampPosX(min: number, max: number) {
        this.clampPos(min, max, "x");
    }
    /**
     * Clamps this y position to a range.
     * @param min The min value.
     * @param max The max value.
     * @since v0.0.0
     */
    clampPosY(min: number, max: number) {
        this.clampPos(min, max, "y");
    }
    /**
     * Returns a `Vector` representing this position.
     * @returns {Vector} This position.
     * @since v0.0.0
     */
    getPos(): Vector {
        return new Vector(this.x, this.y);
    }
    /**
     * Returns the x-coordinate.
     * @returns {number} This x-coordinate.
     * @since v0.0.0
     */
    getPosX(): number {
        return this.x;
    }
    /**
     * Returns the y-coordinate.
     * @returns {number} The y-coordinate.
     * @since v0.0.0
     */
    getPosY(): number {
        return this.y;
    }
    /**
     * Sets this x-coordinate.
     * @param x The new x.
     * @since v0.0.0
     */
    setPosX(x: number) {
        this.x = x;
    }
    /**
     * Sets this y-coordinate.
     * @param y The new y.
     * @since v0.0.0
     */
    setPosY(y: number) {
        this.y = y;
    }
    /**
     * Applies a listener for an event.
     * @param event The event type.
     * @param handle The handle.
     * @since v0.0.0
     */
    on(event: PhantomEventType, handle: PhantomEventHandle) {
        this.evMng.on(event, handle);
    }
    /**
     * Removes a listener for an event.
     * @param event The event type.
     * @param handle The event handle (or nothing, to remove all handles).
     * @since v0.0.0
     */
    off(event: PhantomEventType, handle?: PhantomEventHandle) {
        this.evMng.off(event, handle);
    }
    /**
     * Consumes an event.
     * @param title The event type.
     * @param event The actual event.
     * @since v0.0.0
     */
    consume(title: PhantomEventType, event: PhantomEvent) {
        const handles = this.evStore.get(title);
        if(handles) {
            handles.forEach(h => h(event));
        }
    }
    /**
     * Returns this width.
     * @returns The width.
     * @since v0.0.0
     */
    getWidth(): number {
        return this.width;
    }
    /**
     * Returns this height.
     * @returns The height.
     * @since v0.0.0
     */
    getHeight(): number {
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
        for(const c of this.comps.values()) {
            c.upd();
        }
    }
    /**
     * Returns the string representation of this object.
     * @returns This, as a string.
     * @since v0.0.0
     */
    toString(): string {
        return Util.str(this);
    }
    /**
     * Applies a preset.
     * @param preset The preset to apply.
     * @since v0.0.0
     */
    apply(preset: Preset) {
        preset.apply(this);
    }
    /**
     * Returns a new `Preset` from this.
     * @returns This, as a `Preset`.
     * @since v0.0.0
     */
    preset(): Preset {
        return new Preset(this);
    }
    /**
     * Returns the center coordinate.
     * @returns The center coordinate.
     * @since v0.0.0
     */
    center(): Vector {
        return new Vector(this.x + this.width / 2, this.y + this.height / 2);
    }
    /**
     * Returns the real screen position (accounting for width and height).
     * @returns The screen position.
     * @since v0.0.0
     */
    scrPos(): Vector {
        return new Vector(this.x + this.width, this.y + this.height);
    }
    /**
     * Returns the real screen x (accounting for width).
     * @returns The screen x.
     * @since v0.0.0
     */
    scrX(): number {
        return this.scrPos().x;
    }
    /**
     * Retunrs the real screen y (accounting for height).
     * @returns The screen y.
     * @since v0.0.0
     */
    scrY(): number {
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
    use<K extends PhantomCompType>(c: K, opts?: PhantomCompOptionsMap[K]) {
        if(this.uses(c)) throw new AlreadyUsingError();
        const _opts = (opts ?? {}) as CompOptions;
        this.comps.set(c, new (PhantomCompRecord[c])(this, _opts));
    }
    /**
     * Removes a component.
     * @param c The component type.
     * @see {@link PhantomCompMap}
     * @since v0.0.0
     */
    unuse(c: PhantomCompType) {
        this.comps.del(c);
    }
    /**
     * Returns whether this uses a component or not.
     * @param c The component type.
     * @returns If it is in use.
     * @since v0.0.0
     */
    uses(c: PhantomCompType): boolean {
        return this.comps.has(c);
    }
    /**
     * Returns a reference to this component.
     * @param c The component type.
     * @returns The component (or `undefined`, if it's not in use).
     * @since v0.0.0
     */
    comp<K extends PhantomCompType, T extends PhantomCompMap[K]>(c: K): T {
        return this.comps.get(c) as T;
    }
    getMoveMode(): MoveMode {
        return this.moveMode;
    }
    setMoveMode(m: MoveMode) {
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
    restoreState(state: SavedState) {
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
    saveState(desc?: string): SavedState {
        return new SavedState(this, desc);
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: EntityOptions): Entity;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): Entity;
    static from(opts: EntityOptions | Preset): Entity {
        if(opts instanceof Preset) {
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
    static is(obj: any): obj is Entity {
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
    constructor(opts: StaticObjectOptions) {
        super(opts);
        // requires an enforced fixed move mode
        this.setMoveMode("fixed");
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: StaticObjectOptions): StaticObject;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): StaticObject;
    static from(opts: StaticObjectOptions | Preset): StaticObject {
        if(opts instanceof Preset) {
            const ent = new StaticObject({ shape: "geom" });
            opts.apply(ent);
            return ent;
        }
        return new StaticObject(opts);
    }
    static is(obj: any): obj is StaticObject {
        return objIs(obj, StaticObject);
    }
}
/**
 * A simple object that uses physics.
 * @since v0.0.0
 */
class PhysicsObject extends Entity {
    strength: number; gravspd: number;
    constructor(opts: PhysicsObjectOptions) {
        super(opts);
        this.strength = opts.strength;
        this.gravspd = 0;
    }
    update() {
        this.gravspd += this.strength;
        this.y += this.gravspd;
        super.update();
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: PhysicsObjectOptions): PhysicsObject;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): PhysicsObject;
    static from(opts: PhysicsObjectOptions | Preset): PhysicsObject {
        if(opts instanceof Preset) {
            const ent = new PhysicsObject({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new PhysicsObject(opts);
    }
    static is(obj: any): obj is PhysicsObject {
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
    dirX: Dir; dirY: Dir;
    extLeft: number; extRight: number; extBtm: number; extTop: number;
    spd: number;
    bouncy: boolean;
    constructor(opts: MovingObjectOptions) {
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
        if(this.extLeft >= this.x && this.bouncy && this.dirX == 0) {
            this.x += this.spd;
            this.dirX = 1;
        } else if(this.extRight <= this.x && this.bouncy && this.dirX == 1) {
            this.x -= this.spd;
            this.dirX = 0;
        } else if(this.extLeft < this.x && !this.bouncy && this.dirX == 0) {
            this.x -= this.spd;
        } else if(this.extRight > this.x && this.bouncy && this.dirX == 1) {
            this.x += this.spd;
        }
        if(this.extBtm >= this.y && this.bouncy && this.dirY == 0) {
            this.y += this.spd;
            this.dirY = 1;
        } else if(this.extBtm <= this.y && this.bouncy && this.dirY == 1) {
            this.y -= this.spd;
            this.dirY = 0;
        } else if(this.extTop < this.y && !this.bouncy && this.dirY == 0) {
            this.y -= this.spd;
        } else if(this.extTop > this.y && !this.bouncy && this.dirY == 1) {
            this.y += this.spd;
        }
        super.update();
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: MovingObjectOptions): MovingObject;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): MovingObject;
    static from(opts: MovingObjectOptions | Preset): MovingObject {
        if(opts instanceof Preset) {
            const ent = new MovingObject({ dirX: 0, dirY: 0, extBtm: 0, extLeft: 0, extRight: 0, extTop: 0, spd: 0, bouncy: false });
            opts.apply(ent);
            return ent;
        }
        return new MovingObject(opts);
    }
    static is(obj: any): obj is MovingObject {
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
    extLeft: number; extRight: number; extBtm: number; extTop: number;
    spd: number;
    scene: Scene;
    onDest?: PhantomEventHandle;
    tol: number;
    decay: number;
    initSpd: number;
    constructor(opts: BulletObjectOptions) {
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
        if(x - this.tol < w || x + this.tol > w || y + this.tol > h || y - this.tol < h) {
            // self-destruct if its not
            this.scene.rm(this);
            if(this.onDest) this.onDest(new PhantomDestroyedEvent());
        }
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: BulletObjectOptions): BulletObject;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): BulletObject;
    static from(opts: BulletObjectOptions | Preset): BulletObject {
        if(opts instanceof Preset) {
            const ent = new BulletObject({ rot: 0, extBtm: 0, extLeft: 0, extRight: 0, extTop: 0, spd: 0, scene: shallow<Scene>() });
            opts.apply(ent);
            return ent;
        }
        return new BulletObject(opts);
    }
    static is(obj: any): obj is BulletObject {
        return objIs(obj, BulletObject);
    }
}
/**
 * Acts as a barrier to other entities.
 * @since v1.0.12
 */
class WallObject extends Entity {
    constructor(opts: WallObjectOptions) {
        super(opts);
        this.collide = (e: Entity) => {
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
            if(mx < my) {
                if(ec.x < wc.x) {
                    // push left
                    e.x = this.x - e.width;
                } else {
                    // push right
                    e.x = this.x + this.width;
                }
                if(e instanceof Character) {
                    // if its colliding on the left,
                    // then its not on ground
                    // (not on the top of object)
                    e.onGround = false;
                }
            } else {
                if(ec.y < wc.y) {
                    // push up
                    e.y = this.y - e.height;
                    // test if its a character
                    // and has "floor" tag
                    if(isf && e instanceof Character) {
                        // ...then we set onGround to true
                        e.onGround = true;
                    }
                } else {
                    // push down
                    e.y = this.y + this.height;
                    if(e instanceof Character) {
                        // not on ground (on bottom)
                        e.onGround = false;
                    }
                }
            }
        }
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: WallObjectOptions): WallObject;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): WallObject;
    static from(opts: WallObjectOptions | Preset): WallObject {
        if(opts instanceof Preset) {
            const ent = new WallObject({});
            opts.apply(ent);
            return ent;
        }
        return new WallObject(opts);
    }
    static is(obj: any): obj is WallObject {
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
    constructor(opts: WallObjectOptions) {
        super(opts);
        this.tags.add(new Tag("floor"));
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: WallObjectOptions): FloorObject;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): FloorObject;
    static from(opts: WallObjectOptions | Preset): FloorObject {
        if(opts instanceof Preset) {
            const ent = new FloorObject({});
            opts.apply(ent);
            return ent;
        }
        return new WallObject(opts);
    }
    static is(obj: any): obj is FloorObject {
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
    gspd: number;
    strength: number;
    onGround: boolean;
    constructor(opts: CharacterOptions) {
        super(opts);
        this.gspd = 0;
        this.strength = opts.strength;
        this.onGround = false;
    }
    setGSpd(spd: number) {
        this.gspd = spd;
    }
    getGSpd(): number {
        return this.gspd;
    }
    jump(h: number) {
        this.gspd = -(h);
        this.onGround = false;
    }
    update() {
        if(!this.onGround) {
            this.gspd += this.strength;
            this.y += this.gspd;
        } else {
            this.gspd = 0;
        }
        super.update();
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: CharacterOptions): Character;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): Character;
    static from(opts: CharacterOptions | Preset): Character {
        if(opts instanceof Preset) {
            const ent = new Character({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new Character(opts);
    }
    static is(obj: any): obj is Character {
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
    binds: Store<KeyCode, Function>;
    keys: Store<string, boolean>;
    bindCD: Store<KeyCode, PCExecCDPair>;
    constructor(opts: PlayableCharacterOptions) {
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
    bind(code: KeyCode, exec: Function): void;
    bind(code: KeyCode, exec: Function, cd: number): void;
    bind(code: KeyCode, exec: Function, cd?: number) {
        if(cd == undefined) {
            this.binds.set(code, exec);
        } else {
            this.bindCD.set(code, [exec, new Cooldown(cd)]);
        }
    }
    unbind(code: KeyCode) {
        this.binds.del(code);
        this.bindCD.del(code);
    }
    isBind(code: KeyCode): boolean {
        return this.binds.has(code);
    }
    isBindCD(code: KeyCode): boolean {
        return this.bindCD.has(code);
    }
    bindOf(code: KeyCode): Function | undefined {
        return this.binds.get(code);
    }
    bindCDOf(code: KeyCode): PCExecCDPair | undefined {
        return this.bindCD.get(code);
    }
    update() {
        for(const [k, v] of this.keys.items()) {
            if(v) {
                const _k = KeyCodeMapReverse[k] as KeyCode;
                const exec = this.binds.get(_k);
                const cdExec = this.bindCD.get(_k);
                if(exec) {
                    exec();
                } else if(cdExec) {
                    if(cdExec[1].ready) {
                        cdExec[0]();
                        cdExec[1].consume();
                    }
                }
            }
        }
        super.update();
    }
    /**
     * Returns a new entity, based on options.
     * @param opts The options to use.
     * @returns The new entity.
     * @since v0.0.0
     */
    static from(opts: PlayableCharacterOptions): PlayableCharacter;
    /**
     * Returns a new entity, based on a preset.
     * @param preset The preset to use.
     * @returns The new entity.
     * @since v1.0.5
     */
    static from(preset: Preset): PlayableCharacter;
    static from(opts: PlayableCharacterOptions | Preset): PlayableCharacter {
        if(opts instanceof Preset) {
            const ent = new PlayableCharacter({ strength: 0 });
            opts.apply(ent);
            return ent;
        }
        return new PlayableCharacter(opts);
    }
    static is(obj: any): obj is PlayableCharacter {
        return objIs(obj, PlayableCharacter);
    }
}
interface AircraftOptions extends EntityOptions {
    scene: Scene;
    wing: number;
    grav: number;
    drag: number;
    stall?: number;
    air: number;
    mass: number;
    thrust?: number;
}
class Aircraft extends Entity {
    thrust: number;
    drag: number;
    lift: number;
    scene: Scene;
    vx: number;
    vy: number;
    wing: number;
    grav: number;
    stall: number;
    air: number;
    mass: number;
    constructor(opts: AircraftOptions) {
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
    liftCoefficent(aoa: number): number {
        let CL = 2 * Math.PI * aoa;
        if(Math.abs(aoa) > this.stall) {
            CL *= 0.5;
        }
        return Math.max(-1.5, Math.min(1.5, CL));
    }
    angleOfAttack(): number {
        const velocityAngle = Math.atan2(this.vy, this.vx);
        let aoa = this.rot - velocityAngle; // Difference between nose and path
        aoa = Math.atan2(Math.sin(aoa), Math.cos(aoa));
        return aoa;
    }
    addThrust(thrust: number) {
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
    x: number; y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    scale(fx: number, fy: number): void;
    scale(factor: number): void;
    scale(fx: number, fy?: number) {
        this.x *= fx;
        this.y *= fy ?? fx;
    }
    static rotBtwn(a: Vector, b: Vector): number {
        const a1 = Math.atan2(a.y, a.x);
        const a2 = Math.atan2(b.y, b.x);
        let dif = a2 - a1;
        const pi2 = 2 * Math.PI;
        if(dif > Math.PI) dif -= pi2;
        else if(dif < -Math.PI) dif += pi2;
        return dif;
    }
    rotate(rad: number) {
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);
        const nx = this.x * cos - this.y * sin;
        const ny = this.x * sin + this.y * cos;
        this.x = nx; this.y = ny;
    }
    static dist(a: Vector, b: Vector): number {
        return Math.hypot(b.x - a.x, b.y - a.y);
    }
    static inRect(source: Vector, rectPos: Vector, rectW: number, rectH: number): boolean {
        const sx = source.x; const sy = source.y; const rx = rectPos.x; const ry = rectPos.y;
        const w = rectW; const h = rectH;
        return sx >= rx && sx <= rx + w && sy >= ry && sy <= ry + h;
    }
    mag(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}
/**
 * A pixel.
 * @since v0.0.0
 */
class Pixel {
    r: number; g: number; b: number; a: number;
    constructor(pxl: { r: number, g: number, b: number, a: number }) {
        this.r = pxl.r;
        this.g = pxl.g;
        this.b = pxl.b;
        this.a = pxl.a;
    }
    static from(data: ImageData | ImageDataArray): Pixel {
        if(data instanceof ImageData) {
            return Pixel.from(data.data);
        } else {
            return new Pixel({ r: data[0], g: data[1], b: data[2], a: data[3] });
        }
    }
}
function SoundOptionsIsSOD(o: SoundOptions): o is SoundOptionsDeprecated {
    return "mime" in o;
}
/**
 * An audio source.
 * 
 * Used to play a variety of sounds.
 * @since v0.0.0
 */
class Sound {
    src: string; mime?: AudioMIME; aud: HTMLAudioElement;
    /**
     * The constructor for sounds.
     * 
     * This is the newer constructor (>=v1.0.4).
     * @param opts The options for this `Sound`.
     */
    constructor(opts: SoundOptions);
    /**
     * The constructor for sounds.
     * 
     * This is the older constructor (<=v1.0.3).
     * @param opts The options for this `Sound`.
     * @deprecated Since v1.0.4. No longer supported.
     */
    constructor(opts: SoundOptionsDeprecated);
    constructor(opts: SoundOptions) {
        this.src = opts.src;
        this.aud = new Audio();
        if(SoundOptionsIsSOD(opts)) {
            this.mime = opts.mime;
            const source = document.createElement("source");
            source.src = this.src;
            source.type = this.mime.startsWith("audio") ? this.mime : `audio/${this.mime}`;
            this.aud.appendChild(source);
        } else {
            this.aud.src = this.src;
        }
    }
    play() {
        this.aud.play();
    }
    pause() {
        this.aud.pause();
    }
    get time(): number {
        return this.aud.currentTime;
    }
    set time(t: number) {
        this.aud.currentTime = t;
    }
    get len(): number {
        return this.aud.duration;
    }
    static from(opts: SoundOptions): Sound {
        return new Sound(opts);
    }
    get vol(): number {
        return this.aud.volume;
    }
    set vol(vol: number) {
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
    static config: ImgConfig;
    img: HTMLImageElement;
    constructor(src: string) {
        this.img = new Image();
        this.rebuild(src);
    }
    rebuild(src: string) {
        this.img.src = this.#realSrc(src);
    }
    #realSrc(src: string): string {
        const root = Img.config.get("root");
        if(!root || root.length == 0) return src;
        return `${root}${root.endsWith("/") ? "" : "/"}${src}`;
    }
    static from(src: string): Img {
        return new Img(src);
    }
}
/**
 * A component to store various elements.
 * @since v0.0.0
 */
class Items {
    items: Entity[];
    constructor() {
        this.items = [];
    }
    add(...items: Entity[]) {
        this.items.push(...items);
        items.forEach(i => i.consume("added", new PhantomAddedEvent()));
    }
    rm(...items: Entity[]) {
        for(const item of items) {
            if(this.has(item)) {
                this.items.splice(this.idxOf(item), 1);
                item.consume("removed", new PhantomRemovedEvent());
            }
        }
    }
    has(...items: Entity[]): boolean {
        return ArrayUtil.has(this.items, ...items);
    }
    idxOf(item: Entity): number {
        return this.items.indexOf(item);
    }
    filter(cb: PredicateEntity): Entity[] {
        return this.items.filter(cb);
    }
    forEach(cb: CallbackEntity) {
        this.items.forEach(cb);
    }
    at(i: number): Entity | undefined {
        return this.items[i];
    }
    find(cb: FindPredicateEntity): Entity | undefined {
        return this.items.find(cb);
    }
    some(cb: PredicateEntity): boolean {
        return this.items.some(cb);
    }
}
type FontSizeAbsolute = "xx-small" | "x-small" | "small" | "medium" | "large" | "x-large" | "xx-large" | "xxx-large";
type FontSizeRelative = "larger" | "smaller";
interface SceneFont {
    style?: "normal" | "italic" | "oblique";
    variant?: CanvasFontVariantCaps;
    weight?: "normal" | "bold" | "lighter" | "bolder" | number;
    stretch?: CanvasFontStretch;
    /**
     * The size of the font. (in pixels)
     * 
     * A number will be converted to Npx.
     * @since v1.2.0
     */
    size: FontSizeAbsolute | FontSizeRelative | number;
    lineHeight?: "normal" | number;
    family: string;
}
type FontStyle = SceneFont["style"];
type FontVariant = SceneFont["variant"];
type FontWeight = SceneFont["weight"];
type FontStretch = SceneFont["stretch"];
type FontSize = SceneFont["size"];
type FontLineHeight = SceneFont["lineHeight"];
type FontFamily = SceneFont["family"];
/**
 * The root canvas to display content.
 * @since v0.0.0
 */
class Scene {
    static config: SceneConfig;
    /**
     * This was used in v1.0.18.2 briefly.
     * 
     * It was used to determine whether an unload listener already existed.
     * 
     * It has been since replaced.
     * @since v1.0.18.2
     * @deprecated Since v1.0.19. Opted to using `Config.get` instead.
     */
    static unloadListenerCreated: boolean = false;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    items: Items;
    evStore: Store<EventType, EventHandle[]>;
    lvlStore: Store<string, Level>;
    mousePos: Vector;
    runtime: Runtime;
    comps: Store<PhantomSceneCompType, SceneComp>;
    evMng: SceneEventManager;
    fol?: Entity;
    ui: ItemBox<SceneUI>;
    fontControl: SceneFont;
    misc: ItemBox<Renderable>;
    constructor(opts: SceneOptions) {
        if(typeof opts.canvas == "string") {
            opts.canvas = document.getElementById(opts.canvas);
        }
        if(!opts.canvas) throw new NoCanvasError();
        this.canvas = opts.canvas instanceof HTMLCanvasElement ? opts.canvas : opts.canvas as HTMLCanvasElement;
        if(opts.w) this.canvas.width = opts.w;
        if(opts.h) this.canvas.height = opts.h;
        if(opts.cssW) this.canvas.style.width = opts.cssW;
        if(opts.cssH) this.canvas.style.height = opts.cssH;
        if(opts.border) this.canvas.style.border = opts.border;
        const ctx = this.canvas.getContext("2d");
        if(!ctx) throw new NoContextError();
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
    get width(): number {
        return this.canvas.width;
    }
    set width(w: number) {
        this.canvas.width = w;
    }
    get cssWidth(): string {
        return this.canvas.style.width;
    }
    set cssWidth(w: string) {
        this.canvas.style.width = w;
    }
    get height(): number {
        return this.canvas.height;
    }
    set height(h: number) {
        this.canvas.height = h;
    }
    get cssHeight(): string {
        return this.canvas.style.height;
    }
    set cssHeight(h: string) {
        this.canvas.style.height = h;
    }
    add(...items: Entity[]) {
        this.items.add(...items);
    }
    addUI(...items: SceneUI[]) {
        this.ui.add(...items);
    }
    rm(...items: Entity[]) {
        this.items.rm(...items);
    }
    rmUI(...items: SceneUI[]) {
        this.ui.rm(...items);
    }
    has(...items: Entity[]): boolean {
        return this.items.has(...items);
    }
    hasUI(...items: SceneUI[]): boolean {
        return this.ui.has(...items);
    }
    idxOf(item: Entity): number {
        return this.items.idxOf(item);
    }
    idxOfUI(item: SceneUI): number {
        return this.ui.stuff.indexOf(item);
    }
    filter(cb: PredicateEntity): Entity[] {
        return this.items.filter(cb);
    }
    filterUI(cb: Predicate<SceneUI>): SceneUI[] {
        return this.ui.filter(cb);
    }
    on(name: EventType, handle: EventHandle) {
        this.evMng.on(name, handle);
    }
    off(name: EventType, handle?: EventHandle) {
        this.evMng.off(name, handle);
    }
    getImgData(pos: Vector): ImageData {
        return this.ctx.getImageData(pos.x, pos.y, 1, 1);
    }
    setImgData(pos: Vector, data: ImageData) {
        this.ctx.putImageData(data, pos.x, pos.y);
    }
    getPixel(pos: Vector): Pixel {
        return Pixel.from(this.getImgData(pos));
    }
    setPixel(pos: Vector, rgba: Pixel) {
        const d = this.getImgData(pos);
        d.data[0] = rgba.r;
        d.data[1] = rgba.g;
        d.data[2] = rgba.b;
        d.data[3] = rgba.a;
        this.setImgData(pos, d);
    }
    forEach(cb: CallbackEntity) {
        this.items.forEach(cb);
    }
    forEachUI(cb: Callback<SceneUI>) {
        this.ui.forEach(cb);
    }
    getLvl(lvlName: string): Level | undefined {
        return this.lvlStore.get(lvlName);
    }
    setLvl(lvlName: string, lvl: Level) {
        this.lvlStore.set(lvlName, lvl);
    }
    hasLvl(lvlName: string): boolean {
        return this.lvlStore.has(lvlName);
    }
    delLvl(lvlName: string) {
        this.lvlStore.del(lvlName);
    }
    loadLvl(lvlName: string) {
        const lvl = this.lvlStore.get(lvlName);
        if(lvl) this.items = lvl.items;
    }
    lvl(): Level {
        const lvl = new Level();
        lvl.items = this.items;
        return lvl;
    }
    get color(): FillStyle {
        return this.ctx.fillStyle;
    }
    set color(color: FillStyle) {
        this.ctx.fillStyle = color;
    }
    get alpha(): number {
        return this.ctx.globalAlpha;
    }
    set alpha(alpha: number) {
        this.ctx.globalAlpha = alpha;
    }
    img(img: HTMLImageElement | Img, x: number, y: number, w: number, h: number) {
        this.ctx.drawImage(objIs(img, HTMLImageElement) ? img : img.img, x, y, w, h);
    }
    rect(x: number, y: number, w: number, h: number, color: string) {
        this.color = color;
        this.ctx.fillRect(x, y, w, h);
    }
    bg(color: string) {
        this.rect(0, 0, this.width, this.height, color);
    }
    ray(origin: Vector, angle: number, dist: number, color: string) {
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
        for(let i = 0; i < len; i++) {
            for(let j = 0; j < len; j++) {
                if(i == j) continue;
                const a = this.items.at(i);
                const b = this.items.at(j);
                if(a && b) if(isCol(a, b)) a.collide(b);
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
    rectRotd(ex: number, ey: number, w: number, h: number, rot: number, color: string, offX: number = 0, offY: number = 0) {
        let ox = 0;
        let oy = 0;
        if(this.fol) {
            const fcx = this.fol.x + this.fol.width / 2;
            const fcy = this.fol.y + this.fol.height / 2;
            ox = this.width / 2 - fcx;
            oy = this.height / 2 - fcy;
        }
        const dx = ex + ox + offX;
        const dy = ey + oy + offY;
        this.ctx.save();
        const w2 = w/2;
        const h2 = h/2;
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
        if(Scene.config.get("osnd") == true && (xw < 0 || this.width < xw || yh < 0 || this.height < yh)) return this.ctx.restore();
        this.rect(nx, ny, w, h, color);
        this.ctx.restore();
    }
    start(postUpd: Function = NoFunc) {
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
    save(file: string) {
        const s = new SaveJSON(file);
        s.save(this, 4);
    }
    saveLvl(lvlName: string, file: string) {
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
    get delta(): number {
        return this.runtime.delta;
    }
    use<K extends PhantomSceneCompType, T extends PhantomSceneCompOptionsMap[K]>(c: K, opts?: T) {
        if(this.uses(c)) throw new AlreadyUsingError();
        const _opts = opts ?? {};
        this.comps.set(c, new (PhantomSceneCompRecord[c])(this, _opts));
    }
    unuse(c: PhantomSceneCompType) {
        this.comps.del(c);
    }
    uses(c: PhantomSceneCompType): boolean {
        return this.comps.has(c);
    }
    comp<K extends PhantomSceneCompType, T extends PhantomSceneCompMap[K]>(c: K): T {
        return this.comps.get(c) as T;
    }
    bounds(): DOMRect {
        return this.canvas.getBoundingClientRect();
    }
    mouseAt(e: MouseEvent): Vector {
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
    __listenOn(e: EventType, h: EventHandle) {
        this.canvas.addEventListener(e, h);
    }
    __listenOff(e: EventType, h: EventHandle) {
        this.canvas.removeEventListener(e, h);
    }
    toDataURL(format: string = "image/png", quality: number = 1): string {
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
    screenshot(file: string, format: string = "image/png", quality: number = 1) {
        const save = new Save({
            mime: format,
            file,
            ext: format.split("/")[1]
        });
        save.trigger(this.toDataURL(format, quality));
    }
    find(cb: FindPredicateEntity): Entity | undefined {
        return this.items.find(cb);
    }
    #tagTest(ent: Entity, tagName: Tag | string): boolean {
        if(objIs(tagName, Tag)) {
            return ent.tags.has(tagName);
        } else {
            return ent.tags.some((t) => t.test(tagName));
        }
    }
    findByTag(tagName: Tag | string): Entity | undefined {
        return this.find((e): e is Entity => this.#tagTest(e, tagName));
    }
    hasByTag(tagName: Tag | string): boolean {
        return this.some((e) => this.#tagTest(e, tagName));
    }
    some(cb: PredicateEntity) {
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
    rotBtwn(a: Entity, b: Entity): number {
        return Vector.rotBtwn(a.getPos(), b.getPos());
    }
    /**
     * Returns the rotation between the specified entity and the mouse.
     * @param ent The entity to test.
     * @returns The rotation from the entity to the mouse.
     */
    rotToMouse(ent: Entity): number {
        return Vector.rotBtwn(ent.getPos(), this.mousePos);
    }
    style(styles: CSSStyleDeclaration) {
        Object.assign(this.canvas.style, styles);
    }
    center(): Vector {
        return new Vector(this.width / 2, this.height / 2);
    }
    clientCenter(): Vector {
        return new Vector(this.canvas.clientWidth / 2, this.canvas.clientHeight / 2);
    }
    onScrn(vec: Vector, w: number, h: number) {
        const x = vec.x + w;
        const y = vec.y + h;
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }
    follow(ent: Entity) {
        this.fol = ent;
    }
    unfollow() {
        this.fol = undefined;
    }
    text(text: string, x: number, y: number, maxWidth?: number) {
        this.ctx.fillText(text, x, y, maxWidth);
    }
    get align(): CanvasTextAlign {
        return this.ctx.textAlign;
    }
    set align(align: CanvasTextAlign) {
        this.ctx.textAlign = align;
    }
    get font(): string {
        return this.ctx.font;
    }
    set font(font: string | SceneFont) {
        if(typeof font == "string") {
            this.ctx.font = font;
        } else {
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
    get fontSize(): FontSize {
        return this.fontControl.size;
    }
    set fontSize(size: FontSize) {
        this.fontControl.size = size;
        this.#buildFont();
    }
    get fontFamily(): FontFamily {
        return this.fontControl.family;
    }
    set fontFamily(family: FontFamily) {
        this.fontControl.family = family;
        this.#buildFont();
    }
    get baseline(): CanvasTextBaseline {
        return this.ctx.textBaseline;
    }
    set baseline(baseline: CanvasTextBaseline) {
        this.ctx.textBaseline = baseline;
    }
    get fontStyle(): FontStyle {
        return this.fontControl.style;
    }
    set fontStyle(style: Real<FontStyle>) {
        this.fontControl.style = style;
        this.#buildFont();
    }
    get fontVariant(): FontVariant {
        return this.fontControl.variant;
    }
    set fontVariant(variant: Real<FontVariant>) {
        this.fontControl.variant = variant;
        this.#buildFont();
    }
    get fontWeight(): FontWeight {
        return this.fontControl.weight;
    }
    set fontWeight(weight: Real<FontWeight>) {
        this.fontControl.weight = weight;
        this.#buildFont();
    }
    get fontStretch(): FontStretch {
        return this.fontControl.stretch;
    }
    set fontStretch(stretch: Real<FontStretch>) {
        this.fontControl.stretch = stretch;
        this.#buildFont();
    }
    get fontLineHeight(): FontLineHeight {
        return this.fontControl.lineHeight;
    }
    set fontLineHeight(lineHeight: Real<FontLineHeight>) {
        this.fontControl.lineHeight = lineHeight;
        this.#buildFont();
    }
    #buildFont() {
        this.font = this.fontControl;
    }
    mouseInRect(rectPos: Vector, rectW: number, rectH: number): boolean {
        return Vector.inRect(this.mousePos, rectPos, rectW, rectH);
    }
    frustum(x: number, y: number, r0: number, r1: number, h: number, fillColor: string, strokeColor?: string, lineWidth?: number) {
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
    triangle(p0: Vector, p1: Vector, p2: Vector, color: string) {
        this.ctx.beginPath();
        this.ctx.moveTo(p0.x, p0.y);
        this.ctx.lineTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.closePath();
        this.color = color;
        this.ctx.fill();
    }
    cone(p0: Vector, p1: Vector, rad: Vector, color: string) {
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
    items: Items;
    constructor() {
        this.items = new Items();
    }
    add(...items: Entity[]) {
        this.items.add(...items);
    }
    rm(...items: Entity[]) {
        this.items.rm(...items);
    }
    has(...items: Entity[]): boolean {
        return this.items.has(...items);
    }
    idxOf(item: Entity): number {
        return this.items.idxOf(item);
    }
    filter(cb: Callback<unknown>): Entity[] {
        return this.items.filter(cb);
    }
    forEach(cb: CallbackEntity) {
        this.items.forEach(cb);
    }
    find(cb: FindPredicateEntity): Entity | undefined {
        return this.items.find(cb);
    }
    save(file: string) {
        const s = new SaveJSON(file);
        s.save(this, 4);
    }
}
/**
 * A class for saving content.
 * @since v0.0.0
 */
class Save {
    file: string; mime: string; ext: string;
    constructor(opts: SaveOptions) {
        this.file = opts.file;
        this.mime = opts.mime;
        this.ext = opts.ext;
    }
    /**
     * Triggers the actual download process, provided a URL.
     * @param url The source URL.
     * @since v1.0.17
     */
    trigger(url: string) {
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
    save(cont: string) {
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
    constructor(file: string) {
        super({ file, mime: "application/json", ext: "json" });
    }
    save(cont: any, indent: number = 4) {
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
    atts: { any?: any };
    constructor(ent: Entity) {
        this.atts = {};
        Object.assign(this.atts, ent);
    }
    save(out: string) {
        const s = new SaveJSON(out);
        s.save(this, 4);
    }
    apply(ent: Entity) {
        Object.assign(ent, this.atts);
    }
}
/**
 * A ray in the scene space.
 * @since v0.0.0
 */
class Raycast {
    origin: Vector; angle: number; dist: number; scene: Scene;
    constructor(opts: RaycastOptions) {
        this.origin = opts.origin;
        this.angle = opts.angle;
        this.dist = opts.dist;
        this.scene = opts.scene;
    }
    cast(): RaycastIntersecton | null {
        let res: RaycastIntersecton | null = null;
        const dir = new Vector(Math.cos(this.angle), Math.sin(this.angle));
        for(const i of this.scene.items.items) {
            const hit = rayInterRect(this.origin, dir, i, this.scene);
            if(hit) {
                if((res && hit < res.dist) || (res == null)) res = new RaycastIntersecton(hit, i, new Vector(this.origin.x + dir.x * hit, this.origin.y + dir.y * hit));
            }
        }
        return res;
    }
}
interface DebugRayOptions extends RaycastOptions {
    color: string;
    life?: number;
}
class DebugRay extends Raycast implements Renderable {
    color: string;
    life: number;
    constructor(opts: DebugRayOptions) {
        super(opts);
        this.color = opts.color;
        this.life = opts.life ?? Infinity;
        this.scene.misc.add(this);
        if(Number.isFinite(this.life)) {
            setTimeout(() => this.scene.misc.rm(this), this.life);
        }
    }
    update() {}
    render() {
        this.scene.ray(this.origin, this.angle, this.dist, this.color);
    }
}
/**
 * The intersection returned by a `Raycast` collision.
 * @since v0.0.0
 */
class RaycastIntersecton {
    dist: number;
    obj: Entity;
    point: Vector;
    constructor(dist: number, obj: Entity, point: Vector) {
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
    processId: number; delta: number;
    constructor() {
        this.processId = -1;
        this.delta = 0;
    }
    start(fn: Function) {
        if(this.processId != -1) throw new ExistingProcessError();
        const out = () => {
            fn();
            this.delta++;
            this.processId = requestAnimationFrame(out);
        }
        out();
    }
    stop() {
        if(this.processId == -1) throw new NoProcessError();
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
    name: string;
    constructor(name: string) {
        this.name = name;
    }
}
/**
 * Represents a rectangle.
 * @since v0.0.0
 */
class GeomRect extends Geom { constructor() { super("rect"); } }
/**
 * Represents a circle.
 * @since v0.0.0
 */
class GeomCircle extends Geom { constructor() { super("circle"); } }
class StorageRoot {
    storage: Storage;
    constructor(obj: Storage) {
        this.storage = obj;
    }
    get(k: string): string | null {
        return this.storage.getItem(k);
    }
    set(k: string, v: any) {
        this.storage.setItem(k, Util.strOf(v));
    }
    has(k: string): boolean {
        return !!this.get(k);
    }
    get len(): number {
        return this.storage.length;
    }
    del(k: string) {
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
    static set(k: string, v: any) {
        const val = typeof v == "string" ? v : Util.str(v);
        localStorage.setItem(k, val);
    }
    /**
     * Gets a value from `localStorage`.
     * @param k The key.
     * @returns The value (or none, if it does not exist).
     * @since v1.0.2
     */
    static get(k: string): string | null {
        return localStorage.getItem(k);
    }
    /**
     * Returns whether an entry with this key exists.
     * @param k The key.
     * @returns Whether this entry exists.
     * @since v1.0.2
     */
    static has(k: string): boolean {
        return !!this.get(k);
    }
    /**
     * Returns the length of `localStorage`.
     * @since v1.0.2
     */
    static get len(): number {
        return localStorage.length;
    }
    /**
     * Deletes an item.
     * @param k The key.
     * @since v1.0.2
     */
    static del(k: string) {
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
    static get(k: string): Promise<CookieListItem | null> {
        return cookieStore.get(k);
    }
    /**
     * Sets a cookie value.
     * @param k The key.
     * @param v The value.
     * @since v1.0.6
     */
    static set(k: string, v: any) {
        cookieStore.set(k, Util.strOf(v));
    }
    /**
     * Returns a list of associated cookie values.
     * @param k The key to get.
     * @returns The values.
     * @since v1.0.6
     */
    static getAll(k: string): Promise<CookieList> {
        return cookieStore.getAll(k);
    }
    /**
     * Deletes a cookie pair.
     * @param k The key.
     * @since v1.0.6
     */
    static del(k: string) {
        cookieStore.delete(k);
    }
}
/**
 * A simple cooldown timer.
 * @since v1.0.5
 */
class Cooldown {
    id: number;
    ready: boolean;
    ms?: number;
    /**
     * A constructor that won't start the cooldown.
     * @since v1.0.6
     */
    constructor();
    /**
     * A constructor that will start the cooldown.
     * @param ms The time to use.
     * @since v1.0.6
     */
    constructor(ms: number);
    /**
     * A constructor that won't start the cooldown, but will set the inital value of the `ready` attribute.
     * @param initalState The inital state of the `ready` attribute.
     * @since v1.0.6
     */
    constructor(initalState: boolean);
    /**
     * A constructor that will start the cooldown and will set the inital value of the `ready` attribute.
     * @param ms The time to use.
     * @param initalState The inital state of the `ready` attribute.
     * @since v1.0.6
     */
    constructor(ms: number, initalState: boolean);
    constructor(msOrState?: number | boolean, msOrState2?: number | boolean) {
        this.id = -1;
        this.ready = false;
        if(msOrState && typeof msOrState == "number" && msOrState2 == undefined) {
            this.on(msOrState);
        } else if(msOrState && typeof msOrState == "boolean" && msOrState2 == undefined) {
            this.ready = msOrState;
        } else if(msOrState && typeof msOrState == "number" && msOrState2 && typeof msOrState2 == "boolean") {
            this.on(msOrState);
            this.ready = msOrState2;
        }
    }
    on(ms: number) {
        if(this.id != -1) throw new ExistingProcessError();
        this.ms = ms;
        this.id = setInterval(() => this.#handle(), ms);
    }
    off() {
        if(this.id == -1) throw new NoProcessError();
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
    static deg(rad: number): number {
        return rad * 180 / Math.PI;
    }
    static rad(deg: number): number {
        return deg * Math.PI / 180;
    }
    static toVector(rad: number): Vector {
        return new Vector(Math.cos(rad), Math.sin(rad));
    }
}
type ConfigOnValueSetHandler<T> = (k: keyof T, v: T[keyof T]) => void;
class Config<T extends Record<string, any>> {
    config: Store<keyof T, T[keyof T]>;
    /**
     * Fired when a value of this config is changed.
     * @since v1.0.19
     */
    onValueSet?: ConfigOnValueSetHandler<T>;
    constructor() {
        this.config = new Store();
    }

    get<K extends keyof T>(k: K): T[K] | undefined {
        return this.config.get(k);
    }

    set<K extends keyof T>(k: K, v: T[K]) {
        this.config.set(k, v);
        if(this.onValueSet) {
            this.onValueSet(k, v);
        }
    }

    has<K extends keyof T>(k: K): boolean {
        return this.config.has(k);
    }

    del<K extends keyof T>(k: K) {
        this.config.del(k);
    }
}
type ConfigTypeExtract<T> = T extends { vals: readonly any[]} ?
    T["vals"][number] : T extends { type: NumberConstructor} ?
    number : T extends { type: StringConstructor } ?
    string : T extends { type: BooleanConstructor } ?
    boolean : T extends { type: FunctionConstructor } ?
    Function : T extends { type: AbstractConstructor<any> } ? InstanceType<T["type"]> : never;
type ConfigType<T extends Record<string, any>> = {
    [K in keyof T]: ConfigTypeExtract<T[K]>
};
function option<const T extends readonly any[]>(vals: T): { vals: T } {
    return { vals };
}
function prim<T>(type: T): { type: T } {
    return { type };
}
function primNum(): { type: NumberConstructor } {
    return prim(Number);
}
function primString(): { type: StringConstructor } {
    return prim(String);
}
function primBool(): { type: BooleanConstructor } {
    return prim(Boolean);
}
function primFn(): { type: FunctionConstructor } {
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
} as const;
type SceneConfigType = ConfigType<typeof SceneConfigMap>;
class SceneConfig extends Config<SceneConfigType> {
    constructor() {
        super();
        this.onValueSet = (k, v) => {
            if(k == "unload" || k == "error") {
                if(typeof v != "function") return console.warn("Invalid type passed as handle.");
                if(k == "unload") {
                    if(Scene.config.get("unload")) return console.warn("There is already an unload listener!");
                    window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
                        e.preventDefault();
                        e.returnValue = "";
                        v();
                    });
                } else if(k == "error") {
                    if(Scene.config.get("error")) return console.warn("There is already an error listener!");
                    window.addEventListener("error", (e: ErrorEvent) => {
                        v(e);
                    });
                }
            }
        }
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
} as const;
type ImgConfigType = ConfigType<typeof ImgConfigMap>;
class ImgConfig extends Config<ImgConfigType> {}
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
} as const;
type EntityDefaultsType = ConfigType<typeof EntityDefaultsMap>;
class EntityDefaults extends Config<EntityDefaultsType> {}
Entity.defaults = new EntityDefaults();
/**
 * The options for pickers.
 * 
 * Includes `id` and `start` properties.
 * @since v1.0.7
 */
interface PickerOptions {
    /**
     * By specifying an ID, the browser can remember different directories for different IDs.
     * 
     * If the same ID is used for another picker, the picker opens in the same directory.
     * 
     * As specified by MDN Web Docs.
     * @since v1.0.7
     */
    id?: string;
    /**
     * A `FileSystemHandle` or a well known directory ("desktop", "documents", "downloads", "music", "pictures", or "videos") to open the dialog in.
     * 
     * As specified by MDN Web Docs.
     * @since v1.0.7
     */
    start?: FileSystemStartPosition;
}
type WellKnownDir = "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos";
type AcceptBase = { accept: { [x: string]: string[] } };
type Accepted = { desc?: string } & AcceptBase;
type OpenDirectoryAccessMode = "r" | "rw";
type OpenDirectoryFinalAccessMode = "read" | "readwrite";
type FileSystemStartPosition = FileSystemHandle | WellKnownDir;
type AcceptedFinal = { description?: string } & AcceptBase;
interface FilePickerBaseOptions extends PickerOptions {
    all?: boolean;
    accept?: Accepted[];
}
interface FilePickerBaseFinalOptions extends PickerCleanedOptions {
    excludeAcceptAllOption?: boolean;
    types?: AcceptedFinal[];
}
interface FilePickerOptions extends FilePickerBaseOptions {
    mult?: boolean;
}
interface FilePickerFinalOptions extends FilePickerBaseFinalOptions {
    multiple?: boolean;
}
interface FilePickerSaveOptions extends FilePickerBaseOptions {
    suggest?: string;
}
interface FilePickerSaveFinalOptions extends FilePickerBaseFinalOptions {
    suggestedName?: string;
}
interface DirPickerOptions extends PickerOptions {
    mode?: OpenDirectoryAccessMode;
}
interface DirPickerFinalOptions extends PickerCleanedOptions {
    mode?: OpenDirectoryFinalAccessMode;
}
type PickerCleanedOptions = { id?: string, startIn?: FileSystemStartPosition };
abstract class Picker<P, H> {
    abstract pick(opts: PickerOptions): Promise<P>;
    abstract handle(opts: PickerOptions): Promise<H>;
    abstract cleanOpts(opts: PickerOptions): PickerOptions;
    clean(opts: PickerOptions): PickerCleanedOptions {
        return { id: opts.id, startIn: opts.start };
    }
}
abstract class FilePickerBase<T, H, R extends FilePickerBaseOptions, P extends FilePickerBaseFinalOptions> extends Picker<T, H> {
    cleanOpts(opts: R): P {
        return {
            ...this.clean(opts),
            excludeAcceptAllOption: opts.all,
            types: opts.accept?.map(a => { return { description: a.desc, accept: a.accept } })
        } as P;
    }
}
type FilePickerPickType = string | string[];
type FilePickerHandleType = FileSystemFileHandle[];
/**
 * Shows a file picker.
 * 
 * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker)
 * @since v1.0.7
 */
class FilePicker extends FilePickerBase<FilePickerPickType, FilePickerHandleType, FilePickerOptions, FilePickerFinalOptions> {
    async pick(opts: FilePickerOptions): Promise<FilePickerPickType> {
        const [...handles]: FilePickerHandleType = await this.handle(opts);
        if(handles.length == 1) {
            const file = await handles[0].getFile();
            return await file.text();
        }
        const files: File[] = [];
        for(const handle of handles) {
            files.push(await handle.getFile());
        }
        const out = await Promise.all(files.map(async o => o.text()));
        return out;
    }
    async handle(opts: FilePickerOptions): Promise<FilePickerHandleType> {
        const [...handles]: FilePickerHandleType = await (window as any).showOpenFilePicker({ ...this.cleanOpts(opts), multiple: opts.mult });
        return handles;
    }
}
class SaveFilePicker extends FilePickerBase<FileSystemHandle, FileSystemHandle, FilePickerSaveOptions, FilePickerSaveFinalOptions> {
    async pick(opts: FilePickerSaveOptions): Promise<FileSystemHandle> {
        return await this.handle(opts);
    }
    async handle(opts: FilePickerSaveOptions): Promise<FileSystemHandle> {
        const handle = await (window as any).showOpenSaveFilePicker({ ...this.cleanOpts(opts), suggestedName: opts.suggest });
        return handle;
    }
}
/**
 * Shows a directory picker.
 * 
 * [MDN reference](https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker)
 * @since v1.0.7
 */
class DirPicker extends Picker<FileSystemDirectoryHandle, FileSystemDirectoryHandle> {
    async pick(opts: DirPickerOptions): Promise<FileSystemDirectoryHandle> {
        try {
            const handle: FileSystemDirectoryHandle = await (window as any).showDirectoryPicker(this.cleanOpts(opts));
            return handle;
        } catch(e) {
            throw e;
        }
    }
    async handle(opts: DirPickerOptions): Promise<FileSystemDirectoryHandle> {
        return this.pick(opts);
    }
    cleanOpts(opts: DirPickerOptions): DirPickerFinalOptions {
        return {
            ...this.clean(opts),
            mode: opts.mode ? ({ "r": "read", "rw": "readwrite" } as const)[opts.mode] : undefined
        }
    }
}
class EventManager<T, E, H> {
    store: Store<E, H[]>;
    self: T;
    constructor(self: T, store: Store<E, H[]>) {
        this.self = self;
        this.store = store;
    }
    on(e: E, h: H, thenExec: Function = NoFunc) {
        const a = this.store.get(e) ?? [];
        ArrayUtil.add(a, h);
        this.store.set(e, a);
        thenExec();
    }
    off(e: E, h?: H, hExist: Function = NoFunc, notHExist: Function = NoFunc) {
        if(h) {
            const a = this.store.get(e) ?? [];
            ArrayUtil.rm(a, h);
            this.store.set(e, a);
            hExist();
        } else {
            notHExist();
            this.store.del(e);
        }
    }
}
class SceneEventManager extends EventManager<Scene, EventType, EventHandle> {
    on(e: EventType, h: EventHandle) {
        super.on(e, h, () => {
            this.self.__listenOn(e, h);
        });
    }
    off(e: EventType, h?: EventHandle) {
        super.off(e, h, () => {
            if(h) this.self.__listenOff(e, h);
        }, () => {
            for(const [_e, _h] of this.self.evStore.items()) {
                for(const __h of _h) this.self.__listenOff(_e, __h);
            }
        });
    }
}
class PhantomEventManager extends EventManager<Entity, PhantomEventType, PhantomEventHandle> {}
class Clipboard {
    static read(): Promise<ClipboardItems> {
        return navigator.clipboard.read();
    }
    static reads(): Promise<string> {
        return navigator.clipboard.readText();
    }
    static write(data: ClipboardItems) {
        navigator.clipboard.write(data);
    }
    static writes(data: string) {
        navigator.clipboard.writeText(data);
    }
}
class Tag {
    val: string;
    constructor();
    constructor(val: string);
    constructor(val?: string) {
        this.val = val ?? "";
    }
    get(): string {
        return this.val;
    }
    set(v: string) {
        this.val = v;
    }
    test(val: string): boolean;
    test(tag: Tag): boolean;
    test(valOrTag: string | Tag): boolean {
        if(valOrTag instanceof Tag) {
            return this.val == valOrTag.get();
        } else {
            return this.val == valOrTag;
        }
    }
}
class TagList extends ItemBox<Tag> {}
class SavedState {
    atts: { any?: any };
    timestamp: string;
    desc?: string;
    constructor(o: any, desc?: string) {
        this.atts = {};
        Object.assign(this.atts, o);
        this.desc = desc;
        this.timestamp = (new Date()).toISOString();
    }
    restore(o: any) {
        Object.assign(o, this.atts);
    }
}
interface TriggerOptions {
    x: number;
    y: number;
    w: number;
    h: number;
    trig: Function;
    active?: boolean;
}
class Trigger {
    x: number; y: number;
    w: number; h: number;
    trig: Function;
    active: boolean;
    constructor(opts: TriggerOptions) {
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
interface MaterialOptions {
    fric?: number;
    color?: string;
}
class Material {
    fric: number;
    color: string;
    constructor(opts: MaterialOptions) {
        this.fric = opts.fric ?? 1;
        this.color = opts.color ?? "#fff";
    }
}
type CameraMode = "fixed" | "follow";
class Camera {
    x: number;
    y: number;
    mode: CameraMode;
    fol?: Entity;
    constructor() {
        this.x = 0;
        this.y = 0;
        this.mode = "fixed";
    }
    follow(follow: Entity) {
        this.mode = "follow";
        this.fol = follow;
    }
    unfollow() {
        this.mode = "fixed";
        this.fol = undefined;
    }
    render(scene: Scene) {}
}
interface SceneUIOptions {
    scene: Scene;
    x?: number;
    y?: number;
    w?: number;
    h?: number;
    rot?: number;
    color?: string;
    rend?: Function;
    upd?: Function;
}
/**
 * The core class for UI elements.
 * @since v1.0.30
 */
class SceneUI {
    scene: Scene;
    x: number;
    y: number;
    width: number;
    height: number;
    rot: number;
    color: string;
    rend: Function;
    upd: Function;
    /**
     * A list of the children to this UI element.
     * 
     * Childrens' positions are set relative to their parent's position.
     * @since v1.1.0
     */
    child: ChildUI;
    constructor(opts: SceneUIOptions) {
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
    addChild(child: SceneUI) {
        this.child.add(child);
    }
    addChilds(...childs: SceneUI[]) {
        this.child.add(...childs);
    }
    rmChild(child: SceneUI) {
        this.child.rm(child);
    }
    rmChilds(...childs: SceneUI[]) {
        this.child.rm(...childs);
    }
    hasChild(child: SceneUI): boolean {
        return this.child.has(child);
    }
    hasChilds(...childs: SceneUI[]): boolean {
        return this.child.has(...childs);
    }
}
class ChildUI extends ItemBox<SceneUI> {}
interface ButtonUIMouseInteractionStyling {
    /**
     * Applied when there is no interactions from the mouse.
     * 
     * This is the color to revert to after an event.
     * @since v1.0.30
     */
    idle?: string;
    hover?: string;
    click?: string;
    reset?: number;
}
interface ButtonUIOptions extends SceneUIOptions {
    click?: Function;
    styles?: ButtonUIMouseInteractionStyling;
    clickCD?: number;
}
class ButtonUI extends SceneUI {
    click: Function;
    styles: ButtonUIMouseInteractionStyling;
    resetCD: Cooldown;
    cdTime: number;
    disabled: boolean;
    clickCD?: Cooldown;
    constructor(opts: ButtonUIOptions) {
        super(opts);
        this.click = opts.click ?? NoFunc;
        this.styles = opts.styles ?? {};
        this.#colorIdle();
        this.resetCD = new Cooldown();
        this.cdTime = 250;
        this.disabled = false;
        this.scene.on("click", () => {
            if(this.#boundsTest()) {
                if(!this.disabled) {
                    if(this.clickCD && !this.clickCD.ready) return;
                    this.click();
                }
                this.resetCD.on(this.styles.reset ?? this.cdTime);
            }
        });
        if(opts.clickCD) {
            this.clickCD = new Cooldown(opts.clickCD);
        }
    }
    #boundsTest(): boolean {
        return this.scene.mouseInRect(new Vector(this.x, this.y), this.width, this.height);
    }
    #applyColor<T extends Exclude<keyof ButtonUIMouseInteractionStyling, "reset">>(k: T) {
        if(this.styles[k]) {
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
        if(this.#boundsTest()) {
            if(this.resetCD.id == -1) {
                this.#colorHover();
            }
        } else {
            if(this.resetCD.id == -1) {
                this.#colorIdle();
            }
        }
        if(this.resetCD.id != -1) {
            if(this.resetCD.ready) {
                this.#colorIdle();
                this.resetCD.consume();
                this.resetCD.off();
            } else {
                this.#colorClick();
            }
        }
    }
}
interface TextUIOptions extends SceneUIOptions {
    tx?: string;
    font?: string;
    mw?: number;
}
/**
 * Primitive text component for UI.
 * @since v1.1.0
 */
class TextUI extends SceneUI {
    tx: string;
    font?: string;
    mw?: number;
    constructor(opts: TextUIOptions) {
        super(opts);
        this.tx = opts.tx ?? "";
        this.font = opts.font;
        this.mw = opts.mw;
    }
    render() {
        this.scene.color = this.color;
        if(this.font) this.scene.font = this.font;
        this.scene.text(this.tx, this.x, this.y, this.mw);
        super.render();
    }
}

class Itvl {
    id: number;
    constructor() {
        this.id = -1;
    }
    start(cb: TimerHandler, ms: number) {
        if(this.id != -1) throw new ExistingProcessError();
        this.id = setInterval(cb, ms);
    }
    stop() {
        if(this.id == -1) throw new NoProcessError();
        clearInterval(this.id);
        this.id = -1;
    }
}
class FixedItvl extends Itvl {
    cb: TimerHandler;
    ms: number;
    constructor(cb: TimerHandler, ms: number) {
        super();
        this.cb = cb;
        this.ms = ms;
    }
    start() {
        super.start(this.cb, this.ms);
    }
}
class Params {
    params: URLSearchParams;
    constructor() {
        this.params = new URLSearchParams(window.location.search);
    }
    get(k: string): Nullish<string> {
        return this.params.get(k);
    }
    getAll(k: string): string[] {
        return this.params.getAll(k);
    }
    has(k: string): boolean;
    has(k: string, v: any): boolean;
    has(k: string, v?: any): boolean {
        if(v) return this.params.has(k, Util.strOf(v));
        else return this.params.has(k);
    }
}
interface Renderable {
    render: () => void;
    update: () => void;
}
type OpeningMode = "_self" | "_blank" | "_parent" | "_top" | "_unfencedTop";
type OpeningModeShorthands = "self" | "blank" | "parent" | "top" | "unfencedTop";
type GeneralOpeningMode = OpeningMode | OpeningModeShorthands;
const FinalizeOpeningMode = (mode: GeneralOpeningMode): OpeningMode => (mode.startsWith("_") ? mode : `_${mode}`) as OpeningMode;
class OpeningFailedError extends ErrRoot { constructor(url: string) { super("OpeningFailedError", `Failed to open url '${url}'.`); } }
class NoRootExistsOnExternalDocumentError extends ErrRoot { constructor() { super("NoRootExistsOnExternalDocumentError", "A 'root' element was expected on an external document, but none was found."); } }
type WritingMode = "esm" | "def";
class External {
    app: Window;
    constructor() {
        this.app = window;
    }
    open(): void;
    open(url: string | URL): void;
    open<M extends GeneralOpeningMode>(url: string | URL, target: M): void;
    open<M extends GeneralOpeningMode>(url: string | URL, target: M, features: string): void;
    open<M extends GeneralOpeningMode>(url?: string | URL, target?: M, features?: string) {
        const _url = url ?? "about:blank"; const _tg = FinalizeOpeningMode(target ?? "_blank");
        const out = window.open(_url, _tg, features);
        if(!out) throw new OpeningFailedError(objIs(_url, String) ? _url : _url.toString());
        this.app = out;
    }
    write(content: string, mode?: WritingMode) {
        this.mkRoot();
        const root = this.getRoot();
        if(!root) throw new NoRootExistsOnExternalDocumentError();
        root.innerHTML = mode == "esm" ? this.esmScriptTag() : this.defImportScript();
        root.innerHTML += content;
    }
    mkRoot() {
        this.app.document.body.innerHTML = `<div id="root"></div>`;
    }
    getRoot(): HTMLElement | null {
        return this.app.document.getElementById("root");
    }
    baseUrl(): string {
        return "https://cdn.jsdelivr.net/npm/@beanthealien/phantomjs@latest/";
    }
    esmScriptTag(): string {
        return `<script src="${this.baseUrl()}phantom2d.min.js"></script>`
    }
    defImportScript(): string {
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
function isCol(a: Entity, b: Entity): boolean {
    const w1 = a.width; const h1 = a.height; const x1 = a.x; const y1 = a.y;
    const w2 = b.width; const h2 = b.height; const x2 = b.x; const y2 = b.y;
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
function rayInterRect(origin: Vector, dir: Vector, rect: Entity, scene: Scene): number | null {
    const uv = uvVec(dir, scene.width, scene.height);
    const t1 = (rect.x - origin.x) / uv.x;
    const t2 = (rect.scrX() - origin.x) / uv.x;
    const t3 = (rect.y - origin.y) / uv.y;
    const t4 = (rect.scrY() - origin.y) / uv.y;
    const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
    const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));
    if(tmax < 0 || tmin > tmax) return null;
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
function uvVec(p: Vector, w: number, h: number): Vector {
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
function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
/**
 * Returns a random number from [0, 100].
 * @returns The random number.
 * @since v1.0.5
 */
function random(): number;
/**
 * Returns a random number from [0, `max`).
 * @returns The random number.
 * @since v1.0.5
 */
function random(max: number): number;
/**
 * Returns a random number from (`min`, `max`).
 * 
 * Automatically swaps `min` and `max` if `min` > `max`.
 * @returns The random number.
 * @since v1.0.5
 */
function random(min: number, max: number): number;
function random(a?: number, b?: number): number {
    let min = 0; let max = 0;
    if(a == undefined && b == undefined) {
        min = 0; max = 101;
    } else if(a && b == undefined) {
        min = 0; max = a;
    } else if(a && b) {
        min = a; max = b;
    }
    if(min > max) {
        [min, max] = [max, min];
    }
    return Math.floor(Math.random() * (max - min)) + min;
}
/**
 * Returns a `boolean` of whether a randomly-generated number is less-equal `max`.
 * 
 * Uses random(101).
 * @param max The cutoff point.
 * @returns If the number generated is in the cutoff point.
 * @since v1.0.10
 */
function chance(max: number): boolean;
/**
 * Returns a `boolean` of whether a randomly-generated number is less-equal `max`.
 * 
 * Uses random(`upperBound` + 1).
 * @param max The cutoff point.
 * @param upperBound The maximum bound to use.
 * @returns If the number generated is in the cutoff point.
 * @since v1.0.10
 */
function chance(max: number, upperBound: number): boolean;
function chance(max: number, upperBound?: number): boolean {
    return max <= random((upperBound ?? 100) + 1);
}
function objIs<T>(obj: any, ctor: Constructor<T>): obj is T {
    return obj != undefined && obj instanceof ctor;
}
/**
 * Returns a shallow, null value of the type provided.
 * @returns A shallow, null value.
 */
function shallow<T>(): T {
    return null as unknown as T;
}
/**
 * Returns a random item from an array.
 * @param arr The array.
 * @returns A random item.
 */
function randItem<T>(arr: T[]): T {
    return arr[random(0, arr.length)];
}
function lerp(start: number, end: number, amount: number): number {
    return start + (end - start) * amount;
}

export {
    Entity, StaticObject, PhysicsObject, MovingObject, BulletObject,
    Scene, Character, PlayableCharacter, WallObject, FloorObject,
    Aircraft,

    SceneUI, ButtonUI, TextUI,
    
    Save, SaveJSON, Sound, Preset, Level, Items, Store, Vector, Pixel, Raycast, DebugRay,
    Cooldown, FilePicker, DirPicker, SaveFilePicker, Img, Angle, Tag, External,

    Config, SceneConfig, ImgConfig,

    isCol, rayInterRect, uvVec, wait, random, chance, shallow, objIs, randItem,
    lerp,

    Local, LocalDeprecated, Session, Clipboard, Cookies, Params,

    Comp, HealthComp, InvComp, EnhancedPhysicsComp, GravityComp,

    Trigger,

    Itvl, FixedItvl
};
export type { Renderable };
