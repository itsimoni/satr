function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function svg_element(name) {
    return document.createElementNS('http://www.w3.org/2000/svg', name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_style(node, key, value, important) {
    node.style.setProperty(key, value, important ? 'important' : '');
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

/* src/ChevronLeft.svelte generated by Svelte v3.25.0 */

function create_fragment(ctx) {
	let svg;
	let g;
	let path;
	let svg_class_value;

	return {
		c() {
			svg = svg_element("svg");
			g = svg_element("g");
			path = svg_element("path");
			attr(path, "d", "M15 18l-6-6l6-6");
			attr(g, "fill", "none");
			attr(g, "stroke-width", "2");
			attr(g, "stroke-linecap", "round");
			attr(g, "stroke-linejoin", "round");
			attr(svg, "class", svg_class_value = "" + (/*klass*/ ctx[0] + " stroke-current"));
			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			attr(svg, "aria-hidden", "true");
			attr(svg, "focusable", "false");
			attr(svg, "width", "1em");
			attr(svg, "height", "1em");
			set_style(svg, "-ms-transform", "rotate(360deg)");
			set_style(svg, "-webkit-transform", "rotate(360deg)");
			set_style(svg, "transform", "rotate(360deg)");
			attr(svg, "preserveAspectRatio", "xMidYMid meet");
			attr(svg, "viewBox", "0 0 24 24");
		},
		m(target, anchor) {
			insert(target, svg, anchor);
			append(svg, g);
			append(g, path);
		},
		p(ctx, [dirty]) {
			if (dirty & /*klass*/ 1 && svg_class_value !== (svg_class_value = "" + (/*klass*/ ctx[0] + " stroke-current"))) {
				attr(svg, "class", svg_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(svg);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { class: klass = "" } = $$props;

	$$self.$$set = $$props => {
		if ("class" in $$props) $$invalidate(0, klass = $$props.class);
	};

	return [klass];
}

class ChevronLeft extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { class: 0 });
	}
}

/* src/ChevronRight.svelte generated by Svelte v3.25.0 */

function create_fragment$1(ctx) {
	let svg;
	let g;
	let path;
	let svg_class_value;

	return {
		c() {
			svg = svg_element("svg");
			g = svg_element("g");
			path = svg_element("path");
			attr(path, "d", "M9 18l6-6l-6-6");
			attr(g, "fill", "none");
			attr(g, "stroke-width", "2");
			attr(g, "stroke-linecap", "round");
			attr(g, "stroke-linejoin", "round");
			attr(svg, "class", svg_class_value = "" + (/*klass*/ ctx[0] + " stroke-current"));
			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			attr(svg, "aria-hidden", "true");
			attr(svg, "focusable", "false");
			attr(svg, "width", "1em");
			attr(svg, "height", "1em");
			set_style(svg, "-ms-transform", "rotate(360deg)");
			set_style(svg, "-webkit-transform", "rotate(360deg)");
			set_style(svg, "transform", "rotate(360deg)");
			attr(svg, "preserveAspectRatio", "xMidYMid meet");
			attr(svg, "viewBox", "0 0 24 24");
		},
		m(target, anchor) {
			insert(target, svg, anchor);
			append(svg, g);
			append(g, path);
		},
		p(ctx, [dirty]) {
			if (dirty & /*klass*/ 1 && svg_class_value !== (svg_class_value = "" + (/*klass*/ ctx[0] + " stroke-current"))) {
				attr(svg, "class", svg_class_value);
			}
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(svg);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let { class: klass = "" } = $$props;

	$$self.$$set = $$props => {
		if ("class" in $$props) $$invalidate(0, klass = $$props.class);
	};

	return [klass];
}

class ChevronRight extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { class: 0 });
	}
}

/* src/Pagination.svelte generated by Svelte v3.25.0 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[15] = list[i];
	return child_ctx;
}

// (66:4) {#each arr_pages as i}
function create_each_block(ctx) {
	let div;
	let t_value = /*i*/ ctx[15] + "";
	let t;
	let div_class_value;
	let mounted;
	let dispose;

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[11](/*i*/ ctx[15], ...args);
	}

	return {
		c() {
			div = element("div");
			t = text(t_value);

			attr(div, "class", div_class_value = "w-" + /*s*/ ctx[5] + " sm:flex justify-center items-center hidden select-none\r\n        cursor-pointer leading-5 transition duration-150 ease-in " + (/*i*/ ctx[15] == /*current*/ ctx[0]
			? /*rounded*/ ctx[1]
				? `rounded-full bg-${/*color*/ ctx[3]}-600 text-white`
				: `border-t-2 border-${/*color*/ ctx[3]}-600 `
			: /*rounded*/ ctx[1]
				? "rounded-full "
				: "border-t-2 border-white") + "\r\n        ");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, t);

			if (!mounted) {
				dispose = listen(div, "click", click_handler_1);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*arr_pages*/ 16 && t_value !== (t_value = /*i*/ ctx[15] + "")) set_data(t, t_value);

			if (dirty & /*s, arr_pages, current, rounded, color*/ 59 && div_class_value !== (div_class_value = "w-" + /*s*/ ctx[5] + " sm:flex justify-center items-center hidden select-none\r\n        cursor-pointer leading-5 transition duration-150 ease-in " + (/*i*/ ctx[15] == /*current*/ ctx[0]
			? /*rounded*/ ctx[1]
				? `rounded-full bg-${/*color*/ ctx[3]}-600 text-white`
				: `border-t-2 border-${/*color*/ ctx[3]}-600 `
			: /*rounded*/ ctx[1]
				? "rounded-full "
				: "border-t-2 border-white") + "\r\n        ")) {
				attr(div, "class", div_class_value);
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

function create_fragment$2(ctx) {
	let div4;
	let div0;
	let chevronlefticon;
	let div0_class_value;
	let t0;
	let div2;
	let t1;
	let div1;
	let t2;
	let div1_class_value;
	let div2_class_value;
	let t3;
	let div3;
	let chevronrighticon;
	let div3_class_value;
	let div4_class_value;
	let current;
	let mounted;
	let dispose;

	chevronlefticon = new ChevronLeft({
			props: {
				class: "w-" + /*s*/ ctx[5] / 2 + " h-" + /*s*/ ctx[5] / 2
			}
		});

	let each_value = /*arr_pages*/ ctx[4];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	chevronrighticon = new ChevronRight({
			props: {
				class: "w-" + /*s*/ ctx[5] / 2 + " h-" + /*s*/ ctx[5] / 2
			}
		});

	return {
		c() {
			div4 = element("div");
			div0 = element("div");
			create_component(chevronlefticon.$$.fragment);
			t0 = space();
			div2 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t1 = space();
			div1 = element("div");
			t2 = text(/*current*/ ctx[0]);
			t3 = space();
			div3 = element("div");
			create_component(chevronrighticon.$$.fragment);

			attr(div0, "class", div0_class_value = "h-" + /*s*/ ctx[5] + " w-" + /*s*/ ctx[5] + " mr-1 flex justify-center items-center " + (/*rounded*/ ctx[1] ? "rounded-full bg-gray-200" : "") + "\r\n    " + (/*current*/ ctx[0] > 1
			? "cursor-pointer"
			: "text-gray-400"));

			attr(div1, "class", div1_class_value = "w-" + /*s*/ ctx[5] + " h-" + /*s*/ ctx[5] + " sm:hidden flex justify-center select-none items-center\r\n      cursor-pointer leading-5 transition duration-150 ease-in " + (/*rounded*/ ctx[1]
			? `rounded-full bg-${/*color*/ ctx[3]}-600 text-white`
			: `border-t-2 border-${/*color*/ ctx[3]}-600`));

			attr(div2, "class", div2_class_value = "flex h-" + /*s*/ ctx[5] + " font-medium " + (/*rounded*/ ctx[1] ? "rounded-full bg-gray-200" : ""));

			attr(div3, "class", div3_class_value = "h-" + /*s*/ ctx[5] + " w-" + /*s*/ ctx[5] + " ml-1 flex justify-center items-center " + (/*rounded*/ ctx[1] ? "rounded-full bg-gray-200" : "") + "\r\n    " + (/*current*/ ctx[0] < /*num_pages*/ ctx[6]
			? "cursor-pointer"
			: "text-gray-400"));

			attr(div4, "class", div4_class_value = "flex text-gray-700 text-" + (/*small*/ ctx[2] ? "base" : "lg"));
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div0);
			mount_component(chevronlefticon, div0, null);
			append(div4, t0);
			append(div4, div2);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div2, null);
			}

			append(div2, t1);
			append(div2, div1);
			append(div1, t2);
			append(div4, t3);
			append(div4, div3);
			mount_component(chevronrighticon, div3, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen(div0, "click", /*click_handler*/ ctx[10]),
					listen(div3, "click", /*click_handler_2*/ ctx[12])
				];

				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			const chevronlefticon_changes = {};
			if (dirty & /*s*/ 32) chevronlefticon_changes.class = "w-" + /*s*/ ctx[5] / 2 + " h-" + /*s*/ ctx[5] / 2;
			chevronlefticon.$set(chevronlefticon_changes);

			if (!current || dirty & /*s, rounded, current*/ 35 && div0_class_value !== (div0_class_value = "h-" + /*s*/ ctx[5] + " w-" + /*s*/ ctx[5] + " mr-1 flex justify-center items-center " + (/*rounded*/ ctx[1] ? "rounded-full bg-gray-200" : "") + "\r\n    " + (/*current*/ ctx[0] > 1
			? "cursor-pointer"
			: "text-gray-400"))) {
				attr(div0, "class", div0_class_value);
			}

			if (dirty & /*s, arr_pages, current, rounded, color, setCurrent*/ 187) {
				each_value = /*arr_pages*/ ctx[4];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div2, t1);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty & /*current*/ 1) set_data(t2, /*current*/ ctx[0]);

			if (!current || dirty & /*s, rounded, color*/ 42 && div1_class_value !== (div1_class_value = "w-" + /*s*/ ctx[5] + " h-" + /*s*/ ctx[5] + " sm:hidden flex justify-center select-none items-center\r\n      cursor-pointer leading-5 transition duration-150 ease-in " + (/*rounded*/ ctx[1]
			? `rounded-full bg-${/*color*/ ctx[3]}-600 text-white`
			: `border-t-2 border-${/*color*/ ctx[3]}-600`))) {
				attr(div1, "class", div1_class_value);
			}

			if (!current || dirty & /*s, rounded*/ 34 && div2_class_value !== (div2_class_value = "flex h-" + /*s*/ ctx[5] + " font-medium " + (/*rounded*/ ctx[1] ? "rounded-full bg-gray-200" : ""))) {
				attr(div2, "class", div2_class_value);
			}

			const chevronrighticon_changes = {};
			if (dirty & /*s*/ 32) chevronrighticon_changes.class = "w-" + /*s*/ ctx[5] / 2 + " h-" + /*s*/ ctx[5] / 2;
			chevronrighticon.$set(chevronrighticon_changes);

			if (!current || dirty & /*s, rounded, current, num_pages*/ 99 && div3_class_value !== (div3_class_value = "h-" + /*s*/ ctx[5] + " w-" + /*s*/ ctx[5] + " ml-1 flex justify-center items-center " + (/*rounded*/ ctx[1] ? "rounded-full bg-gray-200" : "") + "\r\n    " + (/*current*/ ctx[0] < /*num_pages*/ ctx[6]
			? "cursor-pointer"
			: "text-gray-400"))) {
				attr(div3, "class", div3_class_value);
			}

			if (!current || dirty & /*small*/ 4 && div4_class_value !== (div4_class_value = "flex text-gray-700 text-" + (/*small*/ ctx[2] ? "base" : "lg"))) {
				attr(div4, "class", div4_class_value);
			}
		},
		i(local) {
			if (current) return;
			transition_in(chevronlefticon.$$.fragment, local);
			transition_in(chevronrighticon.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(chevronlefticon.$$.fragment, local);
			transition_out(chevronrighticon.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div4);
			destroy_component(chevronlefticon);
			destroy_each(each_blocks, detaching);
			destroy_component(chevronrighticon);
			mounted = false;
			run_all(dispose);
		}
	};
}

function buildArr(c, n) {
	if (n <= 7) {
		return [...Array(n)].map((_, i) => i + 1);
	} else {
		if (c < 3 || c > n - 2) {
			return [1, 2, 3, "...", n - 2, n - 1, n];
		} else {
			return [1, "...", c - 1, c, c + 1, "...", n];
		}
	}
}

function instance$2($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	let { current = 1 } = $$props;
	let { num_items = 120 } = $$props;
	let { per_page = 5 } = $$props;
	let { rounded = false } = $$props;
	let { small = false } = $$props;
	let { color = "indigo" } = $$props;
	let arr_pages = [];

	function setArrPages() {
		$$invalidate(4, arr_pages = buildArr(current, num_pages));
	}

	function setCurrent(i) {
		if (isNaN(i)) return;
		$$invalidate(0, current = i);
		dispatch("navigate", current);
	}

	const click_handler = () => current > 1 && setCurrent(current - 1);
	const click_handler_1 = i => setCurrent(i);
	const click_handler_2 = () => current < num_pages && setCurrent(current + 1);

	$$self.$$set = $$props => {
		if ("current" in $$props) $$invalidate(0, current = $$props.current);
		if ("num_items" in $$props) $$invalidate(8, num_items = $$props.num_items);
		if ("per_page" in $$props) $$invalidate(9, per_page = $$props.per_page);
		if ("rounded" in $$props) $$invalidate(1, rounded = $$props.rounded);
		if ("small" in $$props) $$invalidate(2, small = $$props.small);
		if ("color" in $$props) $$invalidate(3, color = $$props.color);
	};

	let s;
	let num_pages;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*small*/ 4) {
			 $$invalidate(5, s = small ? 8 : 12);
		}

		if ($$self.$$.dirty & /*num_items, per_page*/ 768) {
			 $$invalidate(6, num_pages = Math.ceil(num_items / per_page));
		}

		if ($$self.$$.dirty & /*per_page*/ 512) {
			 if (per_page) {
				setArrPages();
				$$invalidate(0, current = 1);
			}
		}

		if ($$self.$$.dirty & /*num_items, per_page, current*/ 769) {
			 if (num_items) {
				$$invalidate(6, num_pages = Math.ceil(num_items / per_page));
				$$invalidate(0, current = current || 1);
			}
		}

		if ($$self.$$.dirty & /*current*/ 1) {
			 if (current) {
				setArrPages();
			}
		}
	};

	return [
		current,
		rounded,
		small,
		color,
		arr_pages,
		s,
		num_pages,
		setCurrent,
		num_items,
		per_page,
		click_handler,
		click_handler_1,
		click_handler_2
	];
}

class Pagination extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			current: 0,
			num_items: 8,
			per_page: 9,
			rounded: 1,
			small: 2,
			color: 3
		});
	}
}

export default Pagination;
