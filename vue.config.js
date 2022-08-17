const CompressionPlugin = require("compression-webpack-plugin")
const webpack = require('webpack')
module.exports = {
	//     devServer: { // 环境配置
	//         open: true, //配置自动启动浏览器
	//         port: '8081', // 设置端口号production
	//         https: false,  //是否使用https协议
	//         hotOnly: false, //是否开启热更新   
	//         proxy: {
	//             '/api': {
	//                 target: 'http://localhost:9610/api',
	//                 ws: true,
	//                 changeOrigin: true,
	//                 pathRewrite: {
	//                     '^/api': '',
	//                 },
	//             },
	//         }
	//     },
	// 打包路径
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	// gzip
	configureWebpack: config => {
	    if (process.env.NODE_ENV === 'production') {
	      return {
	        plugins: [
	          new CompressionPlugin({
	            algorithm: 'gzip',
	            test: /\.(js|css)$/,// 匹配文件名
	            threshold: 10240, // 对超过10k的数据压缩
	            deleteOriginalAssets: false, // 不删除源文件
	            minRatio: 0.8 // 压缩比
	          })
	        ]
	      }
	    }
	  },
	 chainWebpack: config => {
	        config.plugin('provide').use(webpack.ProvidePlugin, [{
	            $: 'jquery',
	            jquery: 'jquery',
	            jQuery: 'jquery',
	            'window.jQuery': 'jquery'
	        }])
	    }
}