# NiftyLayouts

Make Page Layouts for your Vue Single Page Apps easy.

## Install & Setup
```sh
yarn add @j0nz/nifty-layouts
# Or
npm install @j0nz/nifty-layouts
```

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router' // vue-router configuration
import NiftyLayouts from '@j0nz/nifty-layouts'

const layout = new NiftyLayouts({
    /**
     * currentLayout is the 'finder' to determine which
     * layout should be used
     */
    currentLayout() {
        // 'this' is the root vue instance.
        // this.$store (if you have vuex installed)
        // this.$route
        // etc

        // Write whatever logic you need to find
        // the right page layout. Here I'm using a little
        // lookup table to match the routeName to the layout component.
        // Just make sure to return a string with the name of
        // layout you wish to be using
        return {
            "HomePage": "MainLayout",
            "AboutPage": "MainLayout",
            "SingleArticle": "ArticleLayout"
        }[this.$route.name] ?? 'MainLayout' // optional fallback, 'default route'
    },

    layouts: {
        // import your layout view files.
        // these are just regular vue components.
        // put a <slot /> wherever you want the main page
        // to be inserted.
        // e.g.
        // BasicLayout: { template: `<div> <slot /> </div>` }
        MainLayout: () => import('./layouts/MainLayout'),
        ArticleLayout: () => import('./layouts/ArticleLayout')
    }
})

/**
 * Now setup your base vue instance with vue-router
 * passing the 'layout' we built above.
 */
new Vue({
    el: '#app',
    router,
    layout, // <-- Add this
    render: (h) => h(App),
});
```

```html
<template>
    <!-- App.vue -->
    <NiftyLayout />
</template>
```

And Viola! now you have super easy dynamic layouts in your SPA!

## Transitions

If you want page transitions these are broken down into two levels.
You can set 'route' level transitions for when you are transitioning
between two pages that are using the same layout (only the parts
that are actually changing will get animated, your e.g. persistent navbar
will remain intact), and 'layout' level transitions. These occur when the full
layout is swapped out. An example with these options could look something like this
```html
<template functional>
    <NiftyLayout
        layout-transition-name="layout-transition"
        layout-transition-mode="out-in"
        route-transition-name="route-transition"
        route-transition-mode="out-in" />
</template>

<style>
/* Layout Transitions */
.layout-transition-leave-active,
.layout-transition-enter-active {
  transition: .3s;
}

.layout-transition-enter,
.layout-transition-leave-to {
    filter: blur(25px);
    opacity: 0;
}

.route-transition-enter-active,
.route-transition-leave-active {
  transition: .15s;
}
.route-transition-enter,
.route-transition-leave-to {
  opacity: 0;
}
</style>
