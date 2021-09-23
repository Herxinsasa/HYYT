import Vue from 'vue'
import VueRouter from 'vue-router'
// import achievementDisplay from '../views/achievementDisplay/achievementDisplay.vue'
Vue.use(VueRouter)

// 路由 meta 参数说明
// hidden    是否显示当前导航 boolean
// title     导航的名字 string
// clickOne  是否可以点击一级导航 注意当前参数只能在一级菜单使用 boolean
// keepAlive 切换页面时候是否缓存当前页面 boolean

const routes = [
	{
		path: '/',
		component: () => import('../views/index.vue'),
		name: 'homepage',
		redirect: "/homepage",
		meta: {
			hidden: false,
			clickOne: true,
			title: '首页'
		},
		children: [{
			path: '/homepage',
			component: () => import('../views/homepage/homepage.vue'),
			name: 'homepage',
			meta: {
				needLogin: false,
				hidden: false,
				title: '首页',
				keepAlive: true,
			},
		}, ]
	},
	{
			path: '/exhibition',
			component: () => import('../views/index.vue'),
			name: 'exhibition',
			redirect: "/exhibition",
			meta: {
				hidden: false,
				clickOne: true,
				title: '地图界面'
			},
			children: [{
				path: '/exhibition',
				component: () => import('../views/exhibition/exhibition.vue'),
				name: 'exhibition',
				meta: {
					needLogin: false,
					hidden: false,
					keepAlive: true,
					title: '地图界面'
				},
			}, ]
		},
	// {
	// 	path: '/achievementDisplay',
	// 	component: () => import('../views/index.vue'),
	// 	name: 'achievementDisplay',
	// 	redirect: "/achievementDisplay",
	// 	meta: {
	// 		hidden: false,
	// 		clickOne: true,
	// 		title: '成果展示'
	// 	},
	// 	children: [{
	// 		path: '/achievementDisplay',
	// 		// component: () => import('../views/achievementDisplay/achievementDisplay.vue'),
	// 		component:achievementDisplay,
	// 		name: 'achievementDisplay',
	// 		meta: {
	// 			needLogin: true,
	// 			hidden: false,
	// 			title: '成果展示',
	// 			keepAlive: true,
	// 		},
	// 	}, ]
	// },
	{
		path: '/dataAdministration',
		component: () => import('../views/index.vue'),
		name: 'dataAdministration',
		redirect: "/dataAdministration",
		meta: {
			hidden: false,
			clickOne: true,
			title: '数据管理'
		},
		children: [{
			path: '/dataAdministration',
			component: () => import('../views/dataAdministration/dataAdministration.vue'),
			name: 'dataAdministration',
			meta: {
				needLogin: false,
				hidden: false,
				title: '数据管理',
				keepAlive: true,
			},
		}, ]
	},
	{
		path: '/user',
		component: () => import('../views/index.vue'),
		name: 'user',
		redirect: "/user",
		meta: {
			hidden: false,
			clickOne: false,
			title: '用户管理'
		},
		children: [{
			path: '/user',
			component: () => import('../views/user/user.vue'),
			name: 'user',
			meta: {
				needLogin: false,
				hidden: false,
				title: '退出登录',
				keepAlive: false,
			},
		}, ]
	},
	{
		path: '/login',
		component: () => import('../views/login.vue'),
		name: 'login',
		meta: {
			hidden: true,
			title: '登录'
		},
	}
]

Vue.use(VueRouter)
const router = new VueRouter({
	// mode: "history",
	mode: "hash",
	routes
})


const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

export default router
