import { routes } from '@/router'
const state = {
	routes: routes,
	addRoutes: [],

	menuList: []
}

const mutations = {
	SET_ROUTES: (state, routes) => {
		state.addRoutes = routes
		state.routes = constantRoutes.concat(routes)
	},

	SET_MENULIST: (state, list) => {
		state.menuList = list
	}
}

const actions = {
	
}

export default {
	namespaced: true,
	state,
	mutations,
	actions
}
