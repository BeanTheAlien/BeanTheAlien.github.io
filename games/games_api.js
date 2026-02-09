/**
 * A simple runtime.
 * @class
 */
class Runtime {
    /**
     * The constructor for runtimes.
     * @param {function} fn - The callback function.
     * @param {int} rate - The tick rate.
     */
    constructor(fn, rate) {
        /**
         * The callback function.
         * @prop
         * @type {function}
         */
        this.fn = fn;
        /**
         * The tick speed.
         * @prop
         * @type {int}
         */
        this.rate = rate;
        /**
         * The actual runtime interval.
         * @prop
         * @type {number}
         */
        this.runtime = setInterval(fn, rate);
        /**
         * The delta time of this runtime.
         * @prop
         * @type {int}
         */
        this.delta = 0;
    }
    /**
     * Destroys the interval runtime.
     */
    kill() {
        clearInterval(this.runtime);
    }
    /**
     * Recreates the runtime interval, optionally with new arguments.
     * @param {function | null} nfn - The new callback, default to old.
     * @param {int | null} nr - The new rate, default to old.
     */
    rebuild(nfn = null, nr = null) {
        this.runtime = setInterval(nfn ?? this.fn, nr ?? this.rate);
    }
    /**
     * Applies a new callback function.
     * @param {Function} nfn - The new callback to be applied.
     */
    useFn(nfn) {
        this.fn = nfn;
        this.kill();
        this.rebuild();
    }
    /**
     * Applies a new tick rate.
     * @param {int} nr - The new rate to be applied.
     */
    useRate(nr) {
        this.rate = nr;
        this.kill();
        this.rebuild();
    }
    /**
     * Ticks the runtime delta.
     */
    tick() {
        this.delta++;
    }
}
class Game {
    constructor(fn, rate) {
        this.runtime = new Runtime(fn, rate);
    }
}