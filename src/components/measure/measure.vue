<template>
	<div id="measure">
		<div class="measure" v-if="ifswitchs">
			<div class="measure-title">{{smeasureName}}</div>
			<div class="measure-nav">
				<template v-for="(item, index) in datas">
					<span :key="index" @click="funClick(item,index)" :class="ind === index ? 'active' : ''">{{ item }}</span>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		datas: Array,
		ifswitchs: Boolean,
		smeasureName:String
	},
	data() {
		return {
			ind:''
		};
	},
	mounted() {

	},
	methods: {
		funClick(val,index){
			this.ind = index
			this.$emit('measure', val)
		}
	}
};
</script>

<style lang="scss" scoped>
.measure {
	position: fixed;
	right: 0rem;
	top: 0.82rem;
	// width: 100%;
	background-color: rgba(40,56,79, 0.75);
}
.measure .measure-title {
	width: 100%;
	height: 0.5rem;
	line-height: 0.5rem;
	border-bottom: 1px solid #00C2FF;
	color: #00C2FF;
	font-size: 0.21rem;
	text-align: center;
	box-sizing: border-box;
}
.measure .measure-nav {
	width: 100%;
	height: 0.6rem;
	line-height: 0.6rem;
	padding: 0px 0.2rem;
	box-sizing: border-box;
}
.measure .measure-nav span {
	display: block;
	width: 0.5rem;
	height: 100%;
	margin-right: 0.2rem;
	float: left;
	text-align: center;
	font-size: 0.2rem;
	color: #00C2FF;
	transition: all 0.12s ease-in 0.1s;
}
.measure .measure-nav span:hover {
	cursor: pointer;
	color: #fff;
}
.active {
	color: #fff!important;
}
</style>
