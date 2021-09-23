<template>
	<div id="statistics">
		<div class="statistics">
			<div class="switchNav">
				<span v-for="(item,index) in switchNavList" :key="index" @click="funSwitchNav(item,index)" :class="index === indNav ? 'active' : ''">{{item}}</span>
			</div>
			<!-- Swiper -->
			<div class="nav">
				<div class="swiper-container-nav">
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for="(item, index) in navData" :class="index === ind ? 'active' : ''" :key="index" @click="swipeData(item.data, index)">
							{{ item.name }}
						</div>
					</div>
				</div>
			</div>
			<!-- Swiper JS -->
			<dataDisplay class="dataDisplay" v-if="ifDataDisplay" :datas="allData"></dataDisplay>
			<div class="dataDetails" v-show="!ifDataDisplay" style="overflow: scroll;">
				<dv-border-box-12 class="dataDetails-row" v-for="(items,indexs) in dataList" :key="indexs">
					<div class="dataDetails-title">{{items.time}}</div>
					<div class="dataDetails-container">
						<span v-for="(val,key,i) in items.data" :key="i">{{key}}：{{val}}</span>
					</div>
				</dv-border-box-12>
			</div>
		</div>
	</div>
</template>

<script>
// Swiper 引入js
import Swiper from 'swiper';
// Swiper 引入css
import 'swiper/swiper-bundle.css';
import dataDisplay from '../echart/statistics/statistics';
export default {
	props: {
		statisticsData: [Object, Array]
	},
	components: {
		dataDisplay
	},
	data() {
		return {
			navData: [
				{ name: '里程', data: 'LC' },
				{ name: '站台限界', data: 'ZTXJ' },
				{ name: '站台高度', data: 'ZTGD' },
				{ name: '接触网导高', data: 'JCWDG' },
				{ name: '接触网拉出值', data: 'JCWLCZ' },
				{ name: '雨棚高度', data: 'YPGD' },
				{ name: '雨棚顶位置', data: 'YPDWZ' },
				{ name: '轨道板间距', data: 'GDBJJ' }
			],
			ind: 0,
			time: '',
			allData: '',
			mySwiper: '',
			ifDataDisplay: false,
			switchNavList:['数据展示','数据列表'],
			indNav:0,
			dataList:[],
		};
	},
	mounted() {
		this.Swipe();
		this.swipeData('LC', 0);
		this.init()
	},
	methods: {
		funSwitchNav(val,index){
			this.indNav = index
			if(val == '数据展示'){
				this.ifDataDisplay = true
				document.getElementsByClassName('nav')[0].style.height = '0.5rem'
			}else if(val == '数据列表'){
				this.ifDataDisplay = false
				document.getElementsByClassName('nav')[0].style.height = 0
			}
		},
		Swipe() {
			this.mySwiper = new Swiper('.swiper-container-nav', {
				slidesPerView: 5.7,
				spaceBetween: 30,
				freeMode: true,
			});
		},
		// 数据列表数据处理
		init(){
			var mapVue = this;
			console.log(mapVue.statisticsData)
			mapVue.statisticsData.forEach(v => {
				let obg = {}
					obg.time = v.SMDATE
					obg.data = {}
				for(const item in v){
					mapVue.navData.forEach((items) => {
						if(items.data == item){
							console.log(v[item])
							obg.data[items.name] = v[item]
						}
					})
				}
				mapVue.dataList.push(obg)
				//模拟数据
				mapVue.dataList.push(obg)
				mapVue.dataList.push(obg)
				mapVue.dataList.push(obg)
				mapVue.dataList.push(obg)
				//模拟数据
			});
		},
		// 数据展示数据处理
		swipeData(val, index) {
			var mapVue = this;
			mapVue.ind = index;
			mapVue.allData = [];
			mapVue.statisticsData.forEach(v => {
				var obg = {};
				obg.time = v.SMDATE;
				mapVue.navData.forEach(item => {
					if (item.data == val) {
						obg.data = v[val];
					}
				});
				mapVue.allData.push(obg);
				//模拟数据
				mapVue.allData.push(obg);
				var aaa = {
					time: '2020-10-30',
					data: '3000'
				};
				var bbb = {
					time: '2020-10-29',
					data: '9000'
				};
				mapVue.allData.push(aaa);
				mapVue.allData.push(bbb);
				//模拟数据
			});
			this.ifDataDisplay = false;
			this.$nextTick(() => {
				this.ifDataDisplay = true;
			});
		}
	}
};
</script>

<style lang="scss" scoped>
#statistics {
	width: 100%;
	height: 100%;
}
.statistics {
	width: 100%;
	height: 100%;
	background-color: rgba(40, 56, 79, 1);
	// background: red;
}
.statistics .nav {
	width: 94%;
	height: 0.5rem;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 0.5rem;
	overflow: hidden;
	margin: 0px auto;
	margin-top: 2.5%;
}
.statistics .swiper-container-nav {
	width: 94%;
	height: 100%;
	margin: 0px auto;
	overflow: hidden;
}
.statistics .swiper-slide {
	text-align: center;
	font-size: 0.18rem;
	background: rgba(0, 0, 0, 0);
	color: #00c2ff;
	/* Center slide text vertically */
	display: -webkit-box;
	display: -ms-flexbox;
	display: -webkit-flex;
	display: flex;
	-webkit-box-pack: center;
	-ms-flex-pack: center;
	-webkit-justify-content: center;
	justify-content: center;
	-webkit-box-align: center;
	-ms-flex-align: center;
	-webkit-align-items: center;
	align-items: center;
}
.statistics .swiper-slide:hover {
	cursor: pointer;
}
.statistics .swiper-slide.active {
	color: #fff;
}
.dataDisplay {
	width: 100%;
	height: 80%;
}
.switchNav {
	width: 100%;
	// height: 5%;
	display: flex;
	justify-content: center;
}
.switchNav span {
	padding: 0.1rem 0.2rem;
	font-size: 0.18rem;
	color: #00c2ff;
	border: 1px solid #00c2ff;
	transition: all 0.12s ease-in 0.1s;
}
.switchNav span.active {
	color: #fff;
	border-color: #fff;
}
.switchNav span:hover {
	cursor: pointer;
	color: #fff;
	border-color: #fff;
}
.switchNav span:nth-child(1){
	margin-right: 0.2rem;
}
.switchNav span:nth-child(2){
	margin-left: 0.2rem;
}
.dataDetails {
	width: 100%;
	height: 80%;
	margin-top: 3%;
}
.dataDetails .dataDetails-row {
	width: 22%;
	height: 3rem;
	overflow: hidden;
	padding: 0.15rem;
	box-sizing: border-box;
	border-radius: 0.2rem;
	border: 1px solid #00c2ff;
	overflow: hidden;
	margin-bottom: 0.5rem;
	float: left;
	margin-left: 2.4%;
}
.dataDetails .dataDetails-title {
	width: 100%;
	height: 0.4rem;
	line-height: 0.4rem;
	border-radius: 0.05rem;
	box-sizing: border-box;
	background: #252F3F;
	text-align: center;
	font-size: 0.2rem;
	color: #fff;
}
.dataDetails .dataDetails-container span {
	display: block;
	color:#00c2ff ;
	font-size: 0.16rem;
	margin-top: 0.04rem;
}
@media screen and (max-width: 1650px) {
    .dataDetails .dataDetails-row{
		height: 4rem;
		width: 25%;
		margin-left: 4.9%;
	}
}
::-webkit-scrollbar {
	/*隐藏滚轮*/
	display: none;
}
</style>
