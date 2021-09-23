<template>
	<div id="selectionBox">
		<div class="selectionBox" v-if="ifselectionBox" v-bind:style="size">
			<dv-border-box-12>
				<div class="selectionBox-title">
					<span>{{ title }}</span>
					<i class="close el-icon-close" @click="close()"></i>
				</div>
				<div class="selectionBox-container"><slot></slot></div>
			</dv-border-box-12>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: String,
		ifVisible: Boolean,
		size:Object
	},
	data() {
		return {
			ifselectionBox: '',
		};
	},
	mounted() {
		this.ifselectionBox = this.ifVisible;
	},
	methods: {
		close() {
			// this.ifselectionBox = false
			this.$emit('closePopup', false);
		}
	},
	watch: {}
};
</script>

<style lang="scss" scoped>
.selectionBox {
	background: rgba(40, 56, 79, 1);
	position: fixed;
	z-index: 99999;
}
.selectionBox .selectionBox-title {
	width: 100%;
	height: 15%;
	position: relative;
}
.selectionBox .selectionBox-title span {
	color: #fff;
	font-size: 0.25rem;
	display: block;
	width: 100%;
	height: 100%;
	text-align: center;
	line-height: 0.8rem;
}
.selectionBox .selectionBox-title .close {
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
.selectionBox .selectionBox-title .close:hover {
	cursor: pointer;
}
.selectionBox-container {
	position: absolute;
	top: 0.7rem;
	left: 3%;
	width: 94%;
	height: 85%;
}
</style>
