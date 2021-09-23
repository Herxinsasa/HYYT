const CompressionPlugin = require("compression-webpack-plugin")
const webpack = require('webpack')
module.exports = {
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