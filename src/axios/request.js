import axios from 'axios'
// import $state from '@/store/index.js'

window.console.log(process.env.NODE_ENV)
window.console.log(process.env.VUE_APP_URL)
const service = axios.create({
	baseURL: 'http://localhost:9610',
	// baseURL: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_URL + '/api' : '/api',
	timeout: 60 * 1000, // Timeout
	withCredentials: false, // Check cross-site Access-Control
});

// axios.defaults.withCredentials = false;
// 添加请求拦截器
service.interceptors.request.use(function (config) {
	// console.log(config)
	// 在发送请求之前做些什么
	// config.headers.token = $state.state.token;
	return config;
}, function (error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
	// 对响应数据做点什么
	return response.data;
}, function (error) {
	// 对响应错误做点什么
	console.log(error)
	let originalRequest = error.config
	if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1 && !originalRequest._retry) {
		return Promise.reject('网络超时')
	}
	return Promise.reject(error);
});
// 最后暴露实例
export default service
