<template>
	<div id="popup">
		<div class="popup" v-if="ifImg">
			<dv-border-box-12 style="width: 50vw;height: 70vh;">
				<div class="popup-title">
					<span>{{ title }}</span>
					<i class="close el-icon-close" @click="close()"></i>
				</div>
				<div class="popup-container"><slot></slot></div>
			</dv-border-box-12>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: String,
		ifVisible: Boolean
	},
	data() {
		return {
			ifImg: '',
			aaa:'11111'
		};
	},
	mounted() {
		this.ifImg = this.ifVisible
	},
	methods: {
		close() {
			// this.ifImg = false
			this.$emit('closePopup',false)
		}
	},
	watch: {

	}
};
</script>

<style lang="scss" scoped>
.popup {
	width: 50vw;
	height: 70vh;
	background: rgba(40, 56, 79, 1);
	position: fixed;
	left: 25vw;
	top: 15vh;
	z-index: 99999;
}
.popup .popup-title {
	width: 100%;
	height: 6vh;
	position: relative;
}
.popup .popup-title span {
	color: #fff;
	font-size: 0.25rem;
	display: block;
	width: 100%;
	height: 100%;
	text-align: center;
	line-height: 7vh;
}
.popup .popup-title .close {
	display: block;
	position: absolute;
	right: 0.2rem;
	top: 0.2rem;
	font-size: 0.2rem;
	width: 0.3rem;
	height: 0.3rem;
	background: #000;
	border-radius: 0.3rem;
	border: 1px solid #00c2ff;
	line-height: 0.3rem;
	text-align: center;
	color: #fff;
}
.popup .popup-title .close:hover {
	cursor: pointer;
}
.popup-container {
	position: absolute;
	top: 6vh;
	left: 1vw;
	width: 48vw;
	height: 63.5vh;
}
</style>
