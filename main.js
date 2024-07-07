import App from './App'

import uView from '@/uni_modules/uview-ui'
import store from '@/store/index.js'
import getNetwork from '@/getNetwork/getNetwork.js'

import FontAwesome from '@/components/Am-FontAwesome/index.vue'

// #ifndef VUE3
import Vue from 'vue'

Vue.use(uView)
Vue.component('FontAwesome', FontAwesome)
import './uni.promisify.adaptor'

Vue.prototype.$store = store
Vue.prototype.$getNetwork = getNetwork

Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'


export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif