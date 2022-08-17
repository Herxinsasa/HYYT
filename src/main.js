import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import dataV from "@jiaminghi/data-view";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueCesium from 'vue-cesium';
import cesiumMeasure from 'cesium-measure';
import VueiClientWebgl from '@supermap/vue-iclient3d-webgl';
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(cesiumMeasure);
Vue.use(dataV);
Vue.use(ElementUI);
Vue.use(VueiClientWebgl);
// 引入vue-awesome
import Icon from "vue-awesome/components/Icon";
import "vue-awesome/icons/index.js";
// 全局注册图标
Vue.component("icon", Icon);
// 适配flex
import "./common/flexible.js";
// 引入全局css
import "./assets/scss/style.scss";
Vue.config.productionTip = false;
//自定义弹窗
import popup from './components/public/popup/popup.js'
Vue.use(popup)
//自定义选择框
import selectionBox from './components/public/selectionBox/selectionBox.js'
Vue.use(selectionBox)

Vue.use(VueCesium)


// 判断路由
router.beforeEach(function(to, from, next) {
	if (to.meta.needLogin) {
		//页面是否登录
		if (localStorage.getItem("token")) {
			//本地存储中是否有token(uid)数据
			next(); //表示已经登录
		} else {
			//next可以传递一个路由对象作为参数 表示需要跳转到的页面
			next({
				name: "login"
			});
		}
	} else {
		//表示不需要登录
		next(); //继续往后走
	}
});



new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
