import axios from 'axios'
// import Qs from 'qs'
const service = axios.create({
	// baseURL: 'http://192.168.43.204:59165/', // api的base_url
	baseURL: 'http://111.33.104.18:6088',
	timeout: 1000000, // 请求超时时间
});
// 添加请求拦截器
service.interceptors.request.use(function(config) {
	// console.log(config)
	// 在发送请求之前做些什么
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function(response) {
	// 对响应数据做点什么
	// console.log(response)
	return response.data;
}, function(error) {
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
