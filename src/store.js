import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		baseURL: location.hostname.match(/localhost/)?'':'', 
		baseApiURL: 'https://www.ebi.ac.uk/pride/multiomics/ws/',
	},
	mutations: {
		set(state, data){
			Vue.set(state, data.key, data.value)
		},
		unset(state, key){
			Vue.set(state, key, null)
		},
	},
})