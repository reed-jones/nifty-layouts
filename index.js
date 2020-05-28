// LayoutComponent
const Layout = {
    functional: true,
    render(_, { parent, data, props, ...rest }) {
        const layout = parent.$layout
        const h = parent.$createElement
        const {
            layoutTransitionName,
            layoutTransitionMode,
            routeTransitionName,
            routeTransitionMode
        } = props

        if (!layout.component) {
            layout.name = 'default-component'
        }

        // Start at the inside, and 'wrap' each level outwards
        let page = h('RouterView')

        if (routeTransitionName) { // an not layout change?... idk
            // Wrap in Route Transition if needed
            page = h('transition', { attrs: { name: routeTransitionName, ...routeTransitionMode && { mode: routeTransitionMode }}}, [page])
        }

        // Wrap in 'layout' component (div/slot as fallback)
        page = layout.component ? h(layout.component, {}, [page]) : h('div', {}, [h('slot', {}, [page])])

        if (layoutTransitionName) {
            page = h('transition', { attrs: { name: layoutTransitionName, ...layoutTransitionMode && { mode: layoutTransitionMode }}}, [page])
        }

        // Apply wrapper div so we can add things like classes, etc
        return h("div", { attrs: data.attrs, class: data.staticClass }, [page])
    }
};

// 'Automatic requirer'
export function layoutRequire(req) {
    return req.keys().reduce((acc, cur) => {
        const component = req(cur);
        return {
            // merge previous
            ...acc,
            // add new
            [cur.replace(/(^\.\/|\.vue$)/g, '')]: component.default ?? component
        }
    }, { })
}

// NiftyLayout constructor class
class NiftyLayouts {
    constructor(opts) {
        const { layouts = {}, currentLayout = () => { } } = opts

        // this._layouts = Object.fromEntries(Object.entries(layouts).map(([name, mod]) => {
        //     return [name, mod]
        // }))
        this._layouts = layouts

        this._layoutFinder = currentLayout
    }

    init(app) {
        this.app = this.app ?? app
    }

    get active() {
        const name = this._layoutFinder.bind(this.app.$root)(this.app.$route, this.app.$store)
        return { component: this._layouts[name], name }
    }
}

const isDef = v => v !== undefined

// Vue.use(NiftyLayout)
NiftyLayouts.install = function (Vue, options) {
    // Thanks Vue Router
    // https://github.com/vuejs/vue-router/blob/7e2b9aa6ce4e9f0ac976a3fc06c7705225a7f2c2/src/install.js#L21
    Vue.mixin({
        beforeCreate() {
            if (isDef(this.$options.layout)) {
            this._layoutRoot = this
            this._layout = this.$options.layout
            this._layout.init(this)
            // Vue.util.defineReactive(this, '_layout', this._layout)
            } else {
            this._layoutRoot = (this.$parent && this.$parent._layout) || this
          }
        },
    })

    Object.defineProperty(Vue.prototype, '$layout', {
        get() { return this._layoutRoot._layout.active }
    })

    Vue.component('NiftyLayout', Layout)
}

export default NiftyLayouts
