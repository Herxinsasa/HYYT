<template>
	<div id="exhibition">
		<div id="map" class="map"></div>
		<div class="exhibitionNav" v-if="navList">
			<template v-for="(item, index) in datas">
				<span :key="index" @click="funClick(item, index)">{{ item.name }}</span>
			</template>
		</div>
		<div class="exhibitionSelect">
			<div class="exhibitionSelect-title">车站</div>
			<div class="exhibitionSelect-nav">
				<el-select v-model="addressData" placeholder="请选择" @change="changeAddress" style="width: 47%;" :popper-append-to-body="false">
					<el-option v-for="(item, index) in addressAllData" :key="index" :label="item.CZNAME" :value="item.CZNAME"></el-option>
				</el-select>
				<el-select v-model="timeData" placeholder="请选择" @change="changeTime" style="width: 47%;" :popper-append-to-body="false">
					<el-option v-for="(times, indexs) in timeAllData" :key="indexs" :label="times" :value="times"></el-option>
				</el-select>
			</div>
		</div>
		<!-- 影像弹出框 start-->
		<popup :ifVisible="ifImages" title="影像" v-if="ifImages" @closePopup="closePopups"><imageMap :imageUrl="urls"></imageMap></popup>
		<!-- 影像弹出框 end-->
		<!-- 断面弹出框 start-->
		<popup :ifVisible="ifFM" :title="'断面-' + LC" v-if="ifFM" @closePopup="closePopups"><DM :dmData="dmDatas"></DM></popup>
		<!-- 断面弹出框 end-->
		<!-- 变化弹出框 start-->
		<popup :ifVisible="ifStatistics" title="变化" v-if="ifStatistics" @closePopup="closePopups"><statistics :statisticsData="statisticsDatas"></statistics></popup>
		<!-- 变化弹出框 end-->
		<!--加载提示框 start-->
		<dv-loading id="loading" v-if="ifloading">Loading...</dv-loading>
		<!--加载提示框 end-->
	</div>
</template>

<script>
import * as ajax from '../../axios/api.js';
import 'ol/ol.css';
import * as Layer from 'ol/layer';
import Map from 'ol/Map';
import * as Source from 'ol/source';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { defaults as defaultControls } from 'ol/control';
import * as Style from 'ol/style';
import * as Geom from 'ol/geom';
import * as Interaction from 'ol/interaction';
import * as Condition from 'ol/events/condition';
import imageMap from '../../components/imageMap/imageMap.vue'; //影像组件
import DM from '../../components/DM/dm.vue'; //断面组件
import statistics from '../../components/statistics/statistics.vue'; //变化组件
import Utils from '../../assets/js/util.js';
export default {
	name: 'exhibition',
	components: {
		imageMap,
		DM,
		statistics
	},
	data() {
		return {
			msg: '首页',
			map: '',
			navList: false,
			pointlayer: new Layer.Vector({
				source: new Source.Vector(),
				displayInLayerSwitcher: true
			}),
			lineLayer: new Layer.Vector({
				source: new Source.Vector(),
				displayInLayerSwitcher: true
			}),
			datas: [{ name: '影像' }, { name: '断面' }, { name: '变化' }],
			currentSize: 0,
			select_: '',
			addressData: '',
			addressDataId: '',
			addressAllData: '',
			timeData: '',
			timeAllData: '',
			ifImages: false,
			XLID: '',
			urls: '',
			ifFM: false,
			CGID: '',
			LC: '',
			dmDatas: '',
			ifloading: false,
			ifStatistics: false,
			statisticsDatas: ''
		};
	},
	mounted() {
		var _this = this
		_this.stationInfo();
		_this.initMap(); //初始化加载地图
		//跨页面执行的方法
		Utils.$on('demo', function (msg) {
			console.log(msg);
			_this.stationInfo();
		})
	},
	methods: {
		closePopups(val) {
			this.ifImages = val;
			this.ifFM = val;
			this.ifStatistics = val;
		},
		//车站信息发生变化执行的方法
		changeAddress(val) {
			this.addressAllData.forEach(v => {
				if (v.CZNAME.indexOf(val) != '-1') {
					this.addressDataId = v.CZID;
					this.InitLayer(); //获取当前车站下所有坐标的方法
				}
			});
		},
		//时间发生变化执行的方法
		changeTime(val) {
			this.timeData = val;
			this.InitLayer(); //获取当前车站下所有坐标的方法
		},
		//获取全部车站数据方法
		stationInfo() {
			var mapVue = this;
			ajax.ajax_GetStationInfo()
				.then(res => {
					const data = res.data;
					mapVue.addressAllData = [];
					data.forEach(v => {
						//遍历车站所有的数据
						mapVue.addressAllData.push(v);
					});
					//获取默认选择的车站
					mapVue.addressData = data[0].CZNAME;
					//获取默认选择的车站id
					mapVue.addressDataId = data[0].CZID;
					//获取所有扫描时间数据方法
					ajax.ajax_GetAllSMSS(mapVue.addressDataId)
						.then(res => {
							const datas = res.data;
							mapVue.timeAllData = [];
							datas.forEach(v => {
								//遍历所有时间
								mapVue.timeAllData.push(v);
							});
							//获取默认选择的时间
							mapVue.timeData = datas[0];
							// mapVue.timeAllData.push('2020-10-15');
							mapVue.InitLayer(); //获取当前车站下所有坐标的方法
						})
						.catch(err => {
							console.log(err);
						});
				})
				.catch(err => {
					console.log(err);
				});
		},
		//获取所有扫描时间数据方法
		AllSMSS() {
			// mapVue = this;
			ajax.ajax_GetAllSMSS()
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		},
		//初始化加载地图
		initMap() {
			let mapVue = this;
			mapVue.map = new Map({
				layers: [
					new Layer.Tile({
						source: new Source.XYZ({
							url: 'https://t' + Math.round(Math.random() * 7) + '.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=eeb0c5db6bc780fd3cfadfd5c46c61d5',
							maxZoom: 18
						})
					}),
					new Layer.Tile({
						source: new Source.XYZ({
							url: 'https://t' + Math.round(Math.random() * 7) + '.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=eeb0c5db6bc780fd3cfadfd5c46c61d5',
							maxZoom: 18
						})
					})
				],
				target: 'map',
				controls: defaultControls({
					attribution: false,
					zoom: false,
					rotate: false
				}),
				view: new View({
					center: [114, 38],
					zoom: 6,
					enableRotation: false,
					projection: 'EPSG:4326'
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
				mapVue.navList = true;
				mapVue.XLID = feature.get('XLID');
				mapVue.CGID = feature.get('CGID');
				mapVue.LC = feature.get('LC');
			});
			//选中要素被移除选中
			mapVue.selectedFeatures.on('remove', function(evt) {
				var feature = evt.element;
				console.log(feature);
				mapVue.navList = false;
				mapVue.ifImages = false;
				mapVue.ifFM = false;
				mapVue.ifStatistics = false;
			});
			//地图伸缩获取数据得方法
			mapVue.map.getView().on('change:resolution', function() {
				var newz = mapVue.map.getView().getZoom();
				if (mapVue.getcurrnetSize(newz) != mapVue.currentSize) {
					mapVue.currentSize = mapVue.getcurrnetSize(newz);
					//地图伸缩加载矢量得方法
					mapVue.pointlayer
						.getSource()
						.getFeatures()
						.forEach(function(v) {
							mapVue.setStyle(v);
						});
				}
			});
		},
		//加载数据的方法
		InitLayer() {
			let mapVue = this;
			mapVue.navList = false;
			ajax.ajax_GetSMCGInfo(mapVue.addressDataId, mapVue.timeData)
				.then(res => {
					// 刷新数据得方法 satrt
					try {
						mapVue.map.removeLayer(mapVue.pointlayer);
						mapVue.map.removeLayer(mapVue.linelayer);
					} catch (ex) {
						console.log(ex);
					}
					//判断当前车站是否有数据 satrt
					if (res.data == 'fail') {
						mapVue.$message({ message: '此车站暂时没有数据', type: 'error', offset: 70, duration: 3000 });
						return false;
					}

					const data = res.data;
					// 新建点图层
					mapVue.pointlayer = new Layer.Vector({
						source: new Source.Vector(),
						canbeselect: true
					});
					// 新建线图层
					mapVue.linelayer = new Layer.Vector({
						source: new Source.Vector(),
						canbeselect: true
					});
					//获取所有经纬度得数组
					var xyArr = [];
					if (data.length > 0) {
						data.forEach(function(v) {
							//声明线的数组
							var linefeatureArr = [];
							let point = JSON.parse(v.point);
							let xlid = v.xlid;
							point.forEach(function(value) {
								//循环添加所有数据
								xyArr.push(value);
								//新建点要素
								var feature_ = new Feature({
									geometry: new Point([value.X, value.Y])
								});
								for (const item in value) {
									//遍历给点要素添加属性
									feature_.set(item, value[item]);
								}
								var newz = mapVue.map.getView().getZoom();
								mapVue.currentSize = mapVue.getcurrnetSize(newz);
								mapVue.setStyle(feature_);

								//给点要素添加唯一属性 用来判断点击的某个图层
								feature_.set('layername', 'pointlayer');
								//给点要素添加唯一属性 当前点要素得唯一id
								feature_.set('xlid', xlid);
								//把新建点的要素添加到点的数据源中
								mapVue.pointlayer.getSource().addFeature(feature_);
								//把所有的经纬度添加到线图层的数组中
								linefeatureArr.push([value.X, value.Y]);
							});
							// 新建线要素
							var linefeature = new Feature({
								geometry: new Geom.LineString(linefeatureArr)
							});
							//给线要素添加唯一属性 用来判断点击的某个图层
							linefeature.set('layername', 'linelayer');
							linefeature.set('XLID', point[0].XLID);
							linefeature.set('SMDATE', point[0].SMDATE);
							//设置线要素的样式
							linefeature.setStyle(
								new Style.Style({
									stroke: new Style.Stroke({
										color: 'rgba(255,255,250)',
										width: 5,
										lineDash: [8, 8]
									})
								})
							);
							//把新建线的要素添加到线的数据源中
							mapVue.linelayer.getSource().addFeature(linefeature);
						});
						// 把线要素添加到线图层数据源中
						mapVue.map.addLayer(mapVue.linelayer);
						// 把点要素添加到点图层中
						mapVue.map.addLayer(mapVue.pointlayer);
						//默认缩放得位置 satrt
						var xmin = Math.min.apply(
							Math,
							xyArr.map(item => {
								return item.X;
							})
						);
						var ymin = Math.min.apply(
							Math,
							xyArr.map(item => {
								return item.Y;
							})
						);
						var xmax = Math.max.apply(
							Math,
							xyArr.map(item => {
								return item.X;
							})
						);
						var ymax = Math.max.apply(
							Math,
							xyArr.map(item => {
								return item.Y;
							})
						);
						mapVue.map.getView().fit([xmin, ymin, xmax, ymax], {
							padding: [30, 60, 30, 60]
						});
						//默认缩放得位置 end
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		//设置是否显示标注
		getcurrnetSize(zoom) {
			if (zoom >= 20) {
				return 0;
			} else {
				return 1;
			}
		},
		//设置样式的方法
		setStyle(feature_) {
			var mapVue = this;
			var style_;
			var styleImage;
			var styleText;
			var co = 'green';
			styleImage = {
				anchor: [0.0, 0.0],
				anchorXUnits: 'fraction',
				anchorYUnits: 'pixels',
				src: require('../../assets/image/icon_low.png'),
				scale: 0.8
			};
			if (feature_.get('ZTXJ') < 1750) {
				styleImage = {
					anchor: [0.0, 0.0],
					anchorXUnits: 'fraction',
					anchorYUnits: 'pixels',
					src: require('../../assets/image/icon_high.png'),
					scale: 0.8
				};
				co = 'red';
			}
			if (mapVue.currentSize == 0) {
				styleText = {
					textAlign: 'center',
					textBaseline: 'middle',
					font: 'verdana',
					text: feature_.get('LC'),
					fill: new Style.Fill({
						color: co
					}),
					stroke: new Style.Stroke({
						color: '#ffffff',
						width: 3
					}),
					padding: [2, 0, 2, 0],
					backgroundFill: new Style.Fill({
						color: 'rgba(0,0,0,0.5)'
					}),
					offsetX: parseInt(-55, 10),
					offsetY: parseInt(25, 10),
					placement: 'point', //point 则自动计算面的中心点然后标注  line 则根据面要素的边进行标注
					overflow: false //超出面的部分不显示
				};
			}

			style_ = new Style.Style({
				image: new Style.Icon(styleImage),
				text: new Style.Text(styleText)
			});

			feature_.setStyle(style_);
		},
		funClick(val) {
			var mapVue = this;
			if (val.name == '影像') {
				mapVue.ifloading = true;
				mapVue.ifFM = false; //断面组件
				mapVue.ifStatistics = false; //变化组件
				setTimeout(() => {
					ajax.ajax_GetXLPic_QP(mapVue.XLID, mapVue.timeData)
						.then(res => {
							if (res.data == 'NoQPIndex') {
								mapVue.$message({ message: '此线路暂时没有数据', type: 'error', offset: 70, duration: 3000 });
								mapVue.ifloading = false;
							} else {
								//强制刷新组件
								mapVue.ifImages = false;
								mapVue.$nextTick(() => {
									mapVue.ifImages = true; //影像组件
									mapVue.urls = res.data; //获取数据
									mapVue.ifloading = false; //关闭加载动画
								});
								//强制刷新组件
							}
						})
						.catch(err => {
							console.log(err);
						});
				}, 300);
			} else if (val.name == '断面') {
				mapVue.ifloading = true;
				mapVue.ifImages = false; //影像组件
				mapVue.ifStatistics = false; //变化组件
				setTimeout(() => {
					ajax.ajax_getDMPoints(mapVue.CGID)
						.then(res => {
							if (res.data == 'error') {
								mapVue.$message({ message: '此线路暂时没有数据', type: 'error', offset: 70, duration: 3000 });
								mapVue.ifloading = false;
							} else {
								mapVue.ifFM = false;
								mapVue.$nextTick(() => {
									mapVue.ifFM = true; //断面组件
									mapVue.dmDatas = res;
									mapVue.ifloading = false;
								});
							}
						})
						.catch(err => {
							console.log(err);
						});
				}, 300);
			} else if (val.name == '变化') {
				mapVue.ifloading = true;
				mapVue.ifImages = false; //影像组件
				mapVue.ifFM = false; //断面组件
				setTimeout(() => {
					ajax.ajax_GetSMCGChangeInfo(mapVue.XLID, mapVue.LC)
						.then(res => {
							mapVue.ifStatistics = false;
							mapVue.$nextTick(() => {
								mapVue.ifStatistics = true; //变化组件
								mapVue.statisticsDatas = res.data;
								mapVue.ifloading = false;
							});
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
.map {
	width: 100%;
	height: 100%;
}
.exhibitionNav {
	position: fixed;
	left: 0.18rem;
	top: 2rem;
	box-sizing: border-box;
}
.exhibitionNav span {
	background-color: rgba(40, 56, 79, 0.75);
	display: block;
	padding: 0.1rem 0.5rem;
	display: block;
	text-align: center;
	font-size: 0.18rem;
	color: #00c2ff;
	border: 1px solid #00c2ff;
	margin-bottom: 0.25rem;
	transition: all 0.12s ease-in 0.1s;
	position: relative;
}
.exhibitionNav span:after {
	content: '';
	width: 0;
	height: 0;
	border-color: #00c2ff transparent;
	border-width: 0 0 0.2rem 0.2rem;
	border-style: solid;
	position: absolute;
	bottom: 0.04rem;
	right: 0.04rem;
	transition: all 0.12s ease-in 0.1s;
}
.exhibitionNav span:hover {
	cursor: pointer;
	color: #fff;
	border-color: #fff;
}
.exhibitionNav span:hover:after {
	border-color: #fff transparent;
}
.exhibitionSelect {
	position: fixed;
	right: 0.1rem;
	top: 0.89rem;
	box-sizing: border-box;
	width: 4.5rem;
	/* 	height: 1.5rem; */
	background-color: rgba(40, 56, 79, 0.75);
}
.exhibitionSelect .exhibitionSelect-title {
	width: 100%;
	height: 0.5rem;
	line-height: 0.5rem;
	border-bottom: 1px solid #00c2ff;
	color: #00c2ff;
	font-size: 16px;
	text-align: center;
	box-sizing: border-box;
}
.exhibitionSelect .exhibitionSelect-nav {
	width: 100%;
	padding: 0.1rem 0.2rem;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
}
.exhibitionSelect .exhibitionSelect-nav .el-input__inner {
	background: rgba(0, 0, 0, 0) !important;
	border-color: #00c2ff !important;
	color: #00c2ff !important;
	font-size: 0.1rem !important;
}
.exhibitionSelect .exhibitionSelect-nav .el-select .el-input .el-select__caret {
	color: #00c2ff !important;
}
.exhibitionSelect .exhibitionSelect-nav .el-select-dropdown {
	background-color: rgba(40, 56, 79, 0.75) !important;
	border: none !important;
}
.exhibitionSelect .exhibitionSelect-nav .el-select-dropdown__item.selected {
	color: #00c2ff !important;
}
.exhibitionSelect .exhibitionSelect-nav .el-select-dropdown__item.hover {
	background: rgba(40, 56, 79, 0) !important;
}
.exhibitionSelect .exhibitionSelect-nav .el-select-dropdown__item {
	color: #fff !important;
}
.exhibitionSelect .exhibitionSelect-nav .popper__arrow {
	display: none;
}
#exhibition .el-dialog {
	background: rgba(40, 56, 79, 1) !important;
}
#exhibition .el-dialog__title {
	color: #fff;
}
#loading {
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.7);
}
</style>
