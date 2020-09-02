import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
	state:{
		baseURL: location.hostname.match(/localhost/)?'':'', 
		baseApiURL: 'https://www.ebi.ac.uk/pride/multiomics/ws/',
	},
});