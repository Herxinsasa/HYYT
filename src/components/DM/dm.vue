<template>
	<div id="dm">
		<div id="dmMap" class="dmMap"></div>
		<div class="nav">
			<div class="left"><span @click="fullScreen()">全图</span></div>
			<div class="right">
				<span v-for="(item, index) in navList" :key="index" :class="ind === index ? 'active' : ''" @click="switchs(index)">{{ item }}</span>
			</div>
		</div>
		<div class="bottomNav" v-if="ifBottomNav">
			<div class="bottomNav-container">
				<span>横偏: {{valX}}</span>
				<span>纵偏: {{valY}}</span>
				<span>反射率: {{valR}}</span>
			</div>
		</div>
	</div>
</template>

<script>
//新建线数据源
import 'ol/ol.css';
import Map from 'ol/Map';
import * as Source from 'ol/source';
import View from 'ol/View';
import Feature from 'ol/Feature';
import * as Style from 'ol/style';
import Point from 'ol/geom/Point';
import { defaults as defaultControls } from 'ol/control';
import WebGLPointsLayer from 'ol/layer/WebGLPoints';
import * as Interaction from 'ol/interaction';
import * as Condition from 'ol/events/condition';
import * as Geom from 'ol/geom';
import * as Layer from 'ol/layer';
export default {
	props: {
		dmData: [Object, Array],
		// lc:String
	},
	data() {
		return {
			map: '',
			xmin: '',
			ymin: '',
			xmax: '',
			ymax: '',
			select_: '',
			selectedFeatures: '',
			navList: ['建', '铁', '地', '无'],
			ind: 0,
			linelayerAllArr: [
				[
					[2.44, 4],
					[2.44, 1.25],
					[1.7, 0.025],
					[-1.75, 0.025],
					[-1.75, 1.25],
					[-2.44, 1.25],
					[-2.44, 4],
					[-1.7, 5.5],
					[-0.65, 7.05],
					[0, 7.05],
					[0.65, 7.05],
					[1.7, 5.5],
					[2.44, 4]
				],
				[
					[6.44, 4],
					[2.44, 1.25],
					[1.7, 0.025],
					[-1.75, 0.025],
					[-1.75, 1.25],
					[-2.44, 1.25],
					[-2.44, 4],
					[-1.7, 5.5],
					[-0.65, 7.05],
					[0, 7.05],
					[0.65, 7.05],
					[1.7, 5.5],
					[2.44, 4]
				],
				[
					[8.44, 4],
					[2.44, 1.25],
					[1.7, 0.025],
					[-1.75, 0.025],
					[-1.75, 1.25],
					[-2.44, 1.25],
					[-2.44, 4],
					[-1.7, 5.5],
					[-0.65, 7.05],
					[0, 7.05],
					[0.65, 7.05],
					[1.7, 5.5],
					[2.44, 4]
				],
				[]
			],
			linelayer: new Layer.Vector({
				source: new Source.Vector()
			}),
			valX:'',
			valY:'',
			valR:'',
			ifBottomNav:false
		};
	},
	mounted() {
		this.initMap();
		this.InitLayer();
		this.linelayers();
	},
	methods: {
		//初始化地图
		initMap() {
			let mapVue = this;
			mapVue.map = new Map({
				layers: [],
				target: 'dmMap',
				controls: defaultControls({
					attribution: false,
					zoom: false,
					rotate: false
				}),
				view: new View({
					center: [0, 0],
					zoom: 6,
					enableRotation: false,
					projection: 'EPSG:3857'
				})
			});

			//新建选择工具 定义
			mapVue.select_ = new Interaction.Select({
				hitTolerance: 10,
				multi: false,
				layers: function(v) {
					return v.get('canbeselect');
				},
				condition: Condition.singleClick
			});
			//新建选择工具 添加到地图
			mapVue.map.addInteraction(mapVue.select_);
			//获取选择的图形（要素）
			mapVue.selectedFeatures = mapVue.select_.getFeatures();

			// 图形发生变化 监听
			mapVue.selectedFeatures.on('add', function(evt) {
				var feature = evt.element;
				console.log(feature);
				mapVue.valX = feature.get('x')
				mapVue.valY = feature.get('y')
				mapVue.valR = feature.get('r')
				mapVue.ifBottomNav = true
				// alert('横偏：' + feature.get('x') + '\n纵偏：' + feature.get('y') + '\n反射率：' + feature.get('r'));
			});
			//选中要素被移除选中
			mapVue.selectedFeatures.on('remove', function(evt) {
				var feature = evt.element;
				mapVue.ifBottomNav = false
				console.log(feature);
			});
		},
		InitLayer() {
			var mapVue = this;
			//新建数据源
			var dmSource = new Source.Vector();
			// 循环遍历数据
			mapVue.dmData.forEach(v => {
				//设置矢量样式
				var style = {
					symbol: {
						symbolType: 'circle',
						size: ['interpolate', ['exponential', 2.5], ['zoom'], 6, 1, 12, 3, 16, 6],
						color: ['interpolate', ['linear'], ['get', 'r'], 0, '#DF0101', 70000, '#A5DF00'],
						rotateWithView: false,
						offset: [0, 0]
					}
				};
				//新建点要素
				var feature = new Feature({
					geometry: new Point([v.x * 1000, v.y * 1000])
				});
				//循环遍历添加要素属性
				for (const item in v) {
					feature.set(item, v[item]);
				}
				//添加到数据源中
				dmSource.addFeature(feature);
				//已webgl方式加载要素
				mapVue.dmlayer = new WebGLPointsLayer({
					source: dmSource,
					style: style,
					disableHitDetection: false,
					canbeselect: true
				});
			});
			//添加到图层中
			mapVue.map.addLayer(mapVue.dmlayer);
			mapVue.xmin = Math.min.apply(
				Math,
				mapVue.dmData.map(item => {
					return item.x;
				})
			);
			mapVue.ymin = Math.min.apply(
				Math,
				mapVue.dmData.map(item => {
					return item.y;
				})
			);
			mapVue.xmax = Math.max.apply(
				Math,
				mapVue.dmData.map(item => {
					return item.x;
				})
			);
			mapVue.ymax = Math.max.apply(
				Math,
				mapVue.dmData.map(item => {
					return item.y;
				})
			);
			mapVue.linelayersBorder();
			mapVue.map.getView().fit([mapVue.xmin * 1000, mapVue.ymin * 1000, mapVue.xmax * 1000, mapVue.ymax * 1000], {
				padding: [30, 60, 30, 60]
			});
		},
		//新建线图层边框得方法
		linelayersBorder() {
			var mapVue = this;
			// 新建线图层边框 **********************************************
			var linelayerBorder = new Layer.Vector({
				source: new Source.Vector()
			});
			var leftBottomBorder = [mapVue.xmin * 1000 - 1000, mapVue.ymin * 1000 - 1000];
			var leftTopBorder = [mapVue.xmin * 1000 - 1000, mapVue.ymax * 1000 + 1000];
			var rightTopBorder = [mapVue.xmax * 1000 + 1000, mapVue.ymax * 1000 + 1000];
			var rightBottomBorder = [mapVue.xmax * 1000 + 1000, mapVue.ymin * 1000 - 1000];
			// 新建线要素
			var linefeatureBorder = new Feature({
				geometry: new Geom.LineString([leftBottomBorder, leftTopBorder, rightTopBorder, rightBottomBorder, leftBottomBorder])
			});
			//设置线要素的样式
			linefeatureBorder.setStyle(
				new Style.Style({
					stroke: new Style.Stroke({
						color: 'rgb(255,255,255)',
						width: 1,
						lineDash: [3, 3]
					})
				})
			);
			//把新建线的要素添加到线的数据源中
			linelayerBorder.getSource().addFeature(linefeatureBorder);
			// 把线要素添加到线图层数据源中
			mapVue.map.addLayer(linelayerBorder);
		},
		//全图显示
		fullScreen() {
			var mapVue = this;
			mapVue.map.getView().fit([mapVue.xmin * 1000, mapVue.ymin * 1000, mapVue.xmax * 1000, mapVue.ymax * 1000], {
				padding: [30, 60, 30, 60]
			});
		},
		switchs(index) {
			this.ind = index;
			this.linelayerArr = this.linelayerAllArr[index];
			this.linelayers();
		},
		//添加线图层
		linelayers() {
			var mapVue = this;
			//刷新数据  satrt
			try {
				mapVue.map.removeLayer(mapVue.linelayer);
			} catch (ex) {
				console.log(ex);
			}
			mapVue.linelayer = new Layer.Vector({
				source: new Source.Vector()
			});
			//获取所有经纬度得数组
			var linefeatureArr = [];
			mapVue.linelayerAllArr[mapVue.ind].forEach(v => {
				//把所有数据添加到自定义线得数组种
				linefeatureArr.push([v[0] * 1000, v[1] * 1000]);
			});
			// 新建线要素
			var linefeature = new Feature({
				geometry: new Geom.LineString(linefeatureArr)
			});
			//设置线要素的样式
			linefeature.setStyle(
				new Style.Style({
					stroke: new Style.Stroke({
						color: '#fff',
						width: 1
					})
				})
			);
			//把新建线的要素添加到线的数据源中
			mapVue.linelayer.getSource().addFeature(linefeature);
			// 把线要素添加到线图层数据源中
			mapVue.map.addLayer(mapVue.linelayer);
		}
	}
};
</script>

<style lang="scss" scoped>
#dm {
	width: 100%;
	height: 100%;
	position: relative;
}
.dmMap {
	width: 100%;
	height: 100%;
	background-color: rgba(40, 56, 79, 1);
}
.nav {
	position: absolute;
	width: 100%;
	height: 0.5rem;
	left: 0;
	top: 0;
}
.nav .left {
	float: left;
}
.nav .right {
	float: right;
}
.nav span {
	padding: 0.05rem 0.25rem;
	display: block;
	float: left;
	margin-left: 0.2rem;
	text-align: center;
	border: 1px solid #00c2ff;
	color: #00c2ff;
	transition: all 0.12s ease-in 0.1s;
}
.nav span:nth-child(1) {
	margin-left: 0rem;
}
.nav span.active {
	border-color: #fff !important;
	color: #fff !important;
}
.nav span:hover {
	cursor: pointer;
	color: #fff;
	border-color: #fff;
}
.bottomNav {
	position: absolute;
	width: 100%;
	height: 0.5rem;
	left: 0;
	bottom: 0.2rem;
	background: rgba(225,225,225,0.1);
	border-radius: 0.5rem;
	overflow: hidden;
	padding: 0 0.5rem;
	box-sizing: border-box;
	line-height: 0.55rem;
}
.bottomNav .bottomNav-container {
	width: 100%;
	height: 100%;
}
.bottomNav .bottomNav-container span{
	margin-right: 0.4rem;
	font-size: 0.2rem;
	color: #00c2ff;
}
</style>
