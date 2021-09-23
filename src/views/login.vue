<template>
	<div id="login">
		<div class="login-header-title">限界云系统登录</div>
		<div class="login-container">
			<el-input placeholder="请输入用户名" type="text" prefix-icon="el-icon-user" v-model="userName"></el-input>
			<el-input placeholder="请输入密码" type="password" prefix-icon="el-icon-goods" v-model="passWord"></el-input>
			<el-button type="primary" @click="submitForm">登录</el-button>
		</div>
		<!--加载提示框 start-->
		<dv-loading id="loading" v-if="ifloading" style="color: #fff">Loading...</dv-loading>
		<!--加载提示框 end-->
	</div>
</template>

<script>
import * as verification from '../common/verification.js';
import * as ajax from '../axios/api.js';
export default {
	data() {
		return {
			userName: '',
			passWord: '',
			ifloading: false
		};
	},
	methods: {
		submitForm() {
			var mapVue = this;
			var trus = true;
			if (!verification.vEmpty(this.userName)) {
				this.$message.error('账号格式错误');
				trus = false;
				return;
			}
			if (!verification.vEmpty(this.passWord)) {
				this.$message.error('密码格式错误');
				trus = false;
				return;
			}
			if (trus) {
				var _this = this;
				_this.ifloading = true;
				setTimeout(() => {
					ajax.ajax_login(this.userName, this.passWord)
						.then(res => {
							console.log(res);
							if (res.res == 'LoginFalse') {
								mapVue.$message.error('账号或密码错误');
							} else {
								localStorage.setItem('token', res.data);
								mapVue.$router.push({ path: '/exhibition' });
								_this.ifloading = false;
							}
						})
						.catch(err => {
							console.log(err);
						});
				}, 300);
			}
		}
	}
};
</script>

<style>
html,
body {
	width: 100vw;
	height: 100vh;
}
body {
	background: url(../assets/image/login-back.png);
	background-size: 100% 100%;
}
.login-header-title {
	width: 100%;
	height: 20%;
	font-size: 0.5rem;
	color: #fff;
	text-align: center;
	padding-top: 15vh;
}
.login-container {
	width: 25vw;
	height: 35vh;
	margin: 0px auto;
	margin-top: 5vh;
	background: url(../assets/image/login-border.png);
	background-size: 100% 100%;
	box-sizing: border-box;
	padding-top: 0.8rem;
}
.login-container .el-input {
	width: 70%;
	display: block;
	margin: 0px auto !important;
	margin-bottom: 0.25rem !important;
}
.login-container .el-input--prefix .el-input__inner {
	margin: 0px auto;
	background: rgba(0, 0, 0, 0);
	border: 1px solid #02ffff;
	color: #fff;
	height: 45px !important;
	line-height: 45px !important;
}
.login-container .el-input__icon {
	color: #02ffff;
	font-size: 0.25rem;
}
.el-button--primary {
	width: 70%;
	display: block;
	margin: 0px auto !important;
	margin-top: 0.25rem !important;
	background-color: #0384ea !important;
	border-color: #0384ea !important;
	font-size: 0.25rem;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
	color: #eee !important;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
	color: #eee !important;
}

input::-moz-placeholder,
textarea::-moz-placeholder {
	color: #eee !important;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
	color: #eee !important;
}
</style>
