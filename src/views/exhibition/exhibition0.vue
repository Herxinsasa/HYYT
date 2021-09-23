<template>
	<div class="cesiumContainer">
		<div id="viewer0">
			<vc-viewer  @ready="ready">
			<!-- <vc-provider-terrain-arcgis-tiled-elevation :url="terrainUrl"></vc-provider-terrain-arcgis-tiled-elevation> -->
			</vc-viewer>
		</div>
		<dv-border-box-8 :reverse="true" class="sidebar" v-if="showSliders">
			<div class="gcontent">
				<div id="viewer1" class="row" :style="{height:heights}">
					<vc-viewer @ready="ready2019">
					</vc-viewer>
					<dv-decoration-10 style="width:95%;height:5px;position: absolute;left: 2.5%;bottom: 0;" />
				</div>
				<div id="viewer2" class="row" :style="{height:heights}">
					<vc-viewer @ready="ready2020">
					</vc-viewer>
					<dv-decoration-10 style="width:95%;height:5px;position: absolute;left: 2.5%;bottom: 0;" />
				</div>
			</div>
		</dv-border-box-8>
	</div>
</template>
<script src="../../../public/Cesium/Cesium.js"></script>
<script>
	import $ from 'jquery'
	export default {
		name: "HelloWorld",
		
		//父组件的数据需要通过 prop 才能下发到子组件中,props是子组件访问父组件数据的唯一接口
		props: {
			msg: String
		},
		
		//声明变量
		data() {
			return {
				terrainUrl: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer', //加载三维地形
				lengths: 2,
				heights: '25%',
				showSliders: true,
				cviewer_1: '',
				cviewer_2: '',
			};
		},
		//同时加载，缓存显示
		mounted() {
			this.changeHeight(this.lengths)
		}, //mounted中括号

		//事件函数调用
		methods: {
			changeHeight(ind) {
				if (ind == 0) {
					this.heights = '0';
				} else if (ind == 1) {
					this.heights = '100%';
				} else if (ind == 2) {
					this.heights = '50%';
				} else if (ind == 3) {
					this.heights = '33.33%';
				} else {
					this.heights = '25%';
				}
			},

			//蓟县变化
			ready(cesiumInstance) {
				const {
					Cesium, // eslint-disable-line no-unused-vars
					viewer
				} = cesiumInstance;
				
				this.ciewer = viewer;
				this.addRasterLayers_1(Cesium, viewer, this.url)

				viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

				//设置homebutton的位置
				Cesium.Camera.DEFAULT_VIEW_RECTANGLE =
					Cesium.Rectangle.fromDegrees(117.15, 39.73, 117.84, 40.38);

				//设置相机初始位置
				viewer.camera.setView({
					destination: Cesium.Cartesian3.fromDegrees(117.37279, 37.08234, 300000),
					orientation: {
						heading: Cesium.Math.toRadians(10), // 指向
						pitch: Cesium.Math.toRadians(-40), // 视角
						roll: 0.0
					}
				});

				//蓟县变化矢量信息
				var shpData = require("../../assets/localdata/json/BH.json")
				shpData.features.forEach(function(v) {
					var pbag = new Cesium.PropertyBag();
					for (var aa in v.attributes) {
						pbag.addProperty(aa, v.attributes[aa]);
					}
					var fentitie = new Cesium.Entity({
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(JSON.parse("[" + v.geometry.rings.toString() + "]")), //有序化，attribute的值只能是string类型的，而property的值可以为任何类型；
							material: Cesium.Color.RED,
						},
						properties: pbag
					});
					viewer.entities.add(fentitie); //加载到地图

				});

				var content;
				var scene = viewer.scene;
				var movePositionEventListener; //位置跟随的事件监听
				var autoInfoWindow;
				var infoDiv = '<div id="trackPopUp" style="display:none;" >' +
					'<div id="trackPopUpContent" class="leaflet-popup" style="top:5px;left:0;">' +
					'<a class="leaflet-popup-close-button" href="#">×</a>' +
					'<div class="leaflet-popup-content-wrapper">' +
					'<div id="trackPopUpLink" class="leaflet-popup-content" style="max-width: 300px;"></div>' +
					'</div>' +
					'<div class="leaflet-popup-tip-container">' +
					'<div class="leaflet-popup-tip"></div>' +
					'</div>' +
					'</div>' +
					'</div>';
				$("#cesiumContainer").append(infoDiv);

				var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				handler.setInputAction(function(event) {
						var pick = viewer.scene.pick(event.position); //pick选中的对象
						//判断是否点击到模型
						if (pick && pick.id) {
							var position = viewer.scene.pickPosition(event.position);
							console.log("笛卡尔坐标:" + position);
							console.log(pick.id);
							$('#trackPopUp').show(); //显示弹窗
							var cartographic = Cesium.Cartographic.fromCartesian(position); //将弧度坐标转换为经纬度坐标 
							var longitude = Cesium.Math.toDegrees(cartographic.longitude); //经度
							var latitude = Cesium.Math.toDegrees(cartographic.latitude); //纬度
							var height = cartographic.height; //高度
							var point = [longitude, latitude];
							var destination = Cesium.Cartesian3.fromDegrees(point[0], point[1], 3000.0);
							console.log("经纬度:" + longitude, latitude, height);
							var id = pick.id._id.replace(/[^0-9]/ig, "");
							var content =
								'<tr><th style="color:white;">TB_ID:</th><td><input class="dtInput" " value=' + pick.id._properties
								.TB_ID +
								'></td></tr>' +
								'<tr><th style="color:white;">PRE_ID:</th><td><input class="dtInput" " value=' + pick.id._properties
								.PRE_ID +
								'></td></tr>' +
								'<tr><th style="color:white;">POST_ID:</th><td><input class="dtInput" " value=' + pick.id._properties
								.POST_ID +
								'></td></tr>' +
								'<tr><th style="color:white;">类型:</th><td><input class="dtInput" " value=' + pick.id._properties
								.BHLX +
								'></td></tr>' +
								'<tr><th style="color:white;">变化:</th><td><input class="dtInput" " value=' + pick.id._properties
								.Change_Per +
								'></td></tr>'
							var obj = {
								position: event.position,
								destination: destination,
								content: content
							};
							infoWindow(obj);

							function infoWindow(obj) {
								var picked = scene.pick(obj.position);
								if (Cesium.defined(picked)) {
									var id = picked.id;
									if (id instanceof Cesium.Entity) {
										$(".cesium-selection-wrapper").show();
										$('#trackPopUpLink').empty();
										$('#trackPopUpLink').append(obj.content);

										// PopUp close button event handler
										$('.leaflet-popup-close-button').click(function() {
											$('#trackPopUp').hide();
											$('#trackPopUpLink').empty();
											$(".cesium-selection-wrapper").hide();
											if (!handler) { // 如果无handler3D操作，移除当前的trackPopUp
												$("#trackPopUp").remove();
											}
										});
										return id;
									}
								}
							}
						} else {
							$('#trackPopUp').hide();
						}
					},
					Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},

			//蓟县现状2019
			ready2019(cesiumInstance) {
				const {
					Cesium,
					viewer
				} = cesiumInstance;
				this.cviewer = viewer;
				this.addRasterLayers_1(Cesium, viewer, this.url);
				viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

				//设置相机初始位置
				viewer.camera.setView({
					destination: Cesium.Cartesian3.fromDegrees(117.37279, 37.08234, 300000),
					orientation: {
						heading: Cesium.Math.toRadians(10), // 指向
						pitch: Cesium.Math.toRadians(-40), // 视角
						roll: 0.0
					}
				});

				//加载现状矢量图
				var shpData = require("../../assets/localdata/json/XZ_2019.json")
				shpData.features.forEach(function(v) {
					var pbag = new Cesium.PropertyBag();
					for (var aa in v.attributes) {
						pbag.addProperty(aa, v.attributes[aa]);
					}
					var fentitie = new Cesium.Entity({
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(JSON.parse("[" + v.geometry.rings.toString() + "]")), //有序化，attribute的值只能是string类型的，而property的值可以为任何类型；
							material: Cesium.Color.RED.withAlpha(0.01),
							height: 1,
							outline: true,
							outlineColor: Cesium.Color.RED,
							outlineWidth: 15,
						},
						properties: pbag
					});
					viewer.entities.add(fentitie);
				});

				var content;
				var scene = viewer.scene;
				var movePositionEventListener; //位置跟随的事件监听
				var autoInfoWindow;
				var infoDiv = '<div id="trackPopUp1" style="display:none;" >' +
					'<div id="trackPopUpContent1" class="leaflet-popup1" style="top:5px;left:0;">' +
					'<a class="leaflet-popup-close-button1" href="#">×</a>' +
					'<div class="leaflet-popup-content-wrapper1">' +
					'<div id="trackPopUpLink1" class="leaflet-popup-content1" style="max-width: 300px;"></div>' +
					'</div>' +
					'<div class="leaflet-popup-tip-container1">' +
					'<div class="leaflet-popup-tip1"></div>' +
					'</div>' +
					'</div>' +
					'</div>';
				$("#cesiumContainer").append(infoDiv);

				var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				handler.setInputAction(function(event) {
						var pick = viewer.scene.pick(event.position); //pick选中的对象
						//判断是否点击到模型
						if (pick && pick.id) {
							var position = viewer.scene.pickPosition(event.position);
							console.log("笛卡尔坐标:" + position);
							console.log(pick.id);
							$('#trackPopUp1').show(); //显示弹窗
							var cartographic = Cesium.Cartographic.fromCartesian(position); //将弧度坐标转换为经纬度坐标 
							var longitude = Cesium.Math.toDegrees(cartographic.longitude); //经度
							var latitude = Cesium.Math.toDegrees(cartographic.latitude); //纬度
							var height = cartographic.height; //高度
							var point = [longitude, latitude];
							var destination = Cesium.Cartesian3.fromDegrees(point[0], point[1], 3000.0);
							console.log("经纬度:" + longitude, latitude, height);
							var id = pick.id._id.replace(/[^0-9]/ig, "");
							var content =
								'<tr><th style="color:white;">序号:</th><td><input class="dtInput" " value=' + pick.id._properties
								.OBJECTID +
								'></td></tr>' +
								'<tr><th style="color:white;">名称:</th><td><input class="dtInput" " value=' + pick.id._properties
								.TB_ID +
								'></td></tr>' +
								'<tr><th style="color:white;">类型:</th><td><input class="dtInput" " value=' + pick.id._properties
								.XZINFO +
								'></td></tr>' +
								'<tr><th style="color:white;">面积:</th><td><input class="dtInput" " value=' + pick.id._properties
								.MJ +
								'></td></tr>'
							var obj = {
								position: event.position,
								destination: destination,
								content: content
							};
							infoWindow(obj);

							function infoWindow(obj) {
								var picked = scene.pick(obj.position);
								if (Cesium.defined(picked)) {
									var id = picked.id;
									if (id instanceof Cesium.Entity) {
										$(".cesium-selection-wrapper1").show();
										$('#trackPopUpLink1').empty();
										$('#trackPopUpLink1').append(obj.content);

										// function positionPopUp(c) {
										// 	var x = c.x - ($('#trackPopUpContent').width()) / 2;
										// 	var y = c.y - ($('#trackPopUpContent').height());
										// 	$('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
										// }

										// var c = new Cesium.Cartesian3(obj.position.x, obj.position.y);
										// $('#trackPopUp').show();
										// positionPopUp(c); // Initial position

										// // 每一帧渲染结束后，对位置进行更新
										// movePositionEventListener = viewer.scene.postRender.addEventListener(function() {
										// 	var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);
										// 	if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
										// 		positionPopUp(changedC);
										// 		c = changedC;
										// 	}
										// });

										// PopUp close button event handler
										$('.leaflet-popup-close-button1').click(function() {
											$('#trackPopUp1').hide();
											$('#trackPopUpLink1').empty();
											$(".cesium-selection-wrapper1").hide();
											// movePositionEventListener.call();
											// return false;
											if (!handler) { // 如果无handler3D操作，移除当前的trackPopUp
												$("#trackPopUp1").remove();
											}
										});
										// if (movePositionEventListener) {
										// 	movePositionEventListener = movePositionEventListener && movePositionEventListener();
										// }
										return id;
									}
								}
							}
						} else {
							$('#trackPopUp1').hide();
						}
					},
					Cesium.ScreenSpaceEventType.LEFT_CLICK);

			},

			//蓟县现状2020
			ready2020(cesiumInstance) {
				const {
					Cesium, // eslint-disable-line no-unused-vars
					viewer
				} = cesiumInstance;
				this.cviewer = viewer;
				this.addRasterLayers_2(Cesium, viewer, this.url);
				viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

				//设置相机初始位置
				viewer.camera.setView({
					destination: Cesium.Cartesian3.fromDegrees(117.37279, 37.08234, 300000),
					orientation: {
						heading: Cesium.Math.toRadians(10), // 指向
						pitch: Cesium.Math.toRadians(-40), // 视角
						roll: 0.0
					}
				});

				//加载现状矢量图
				var shpData = require("../../assets/localdata/json/XZ_2020.json")
				shpData.features.forEach(function(v) {
					var pbag = new Cesium.PropertyBag();
					for (var aa in v.attributes) {
						pbag.addProperty(aa, v.attributes[aa]);
					}
					var fentitie = new Cesium.Entity({
						polygon: {
							hierarchy: Cesium.Cartesian3.fromDegreesArray(JSON.parse("[" + v.geometry.rings.toString() + "]")), //有序化，attribute的值只能是string类型的，而property的值可以为任何类型；
							material: Cesium.Color.RED.withAlpha(0.01),
							height: 1,
							outline: true,
							outlineColor: Cesium.Color.RED,
							outlineWidth: 15,
						},
						properties: pbag
					});
					viewer.entities.add(fentitie);
				});

				var content;
				var scene = viewer.scene;
				var movePositionEventListener; //位置跟随的事件监听
				var autoInfoWindow;
				var infoDiv = '<div id="trackPopUp2" style="display:none;" >' +
					'<div id="trackPopUpContent2" class="leaflet-popup2" style="top:5px;left:0;">' +
					'<a class="leaflet-popup-close-button2" href="#">×</a>' +
					'<div class="leaflet-popup-content-wrapper2">' +
					'<div id="trackPopUpLink2" class="leaflet-popup-content2" style="max-width: 300px;"></div>' +
					'</div>' +
					// '<div class="leaflet-popup-tip-container">' +
					// '<div class="leaflet-popup-tip"></div>' +
					// '</div>' +
					'</div>' +
					'</div>';
				$("#cesiumContainer").append(infoDiv);

				var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
				handler.setInputAction(function(event) {
						var pick = viewer.scene.pick(event.position); //pick选中的对象
						//判断是否点击到模型
						if (pick && pick.id) {
							var position = viewer.scene.pickPosition(event.position);
							console.log("笛卡尔坐标:" + position);
							console.log(pick.id);
							$('#trackPopUp2').show(); //显示弹窗
							var cartographic = Cesium.Cartographic.fromCartesian(position); //将弧度坐标转换为经纬度坐标 
							var longitude = Cesium.Math.toDegrees(cartographic.longitude); //经度
							var latitude = Cesium.Math.toDegrees(cartographic.latitude); //纬度
							var height = cartographic.height; //高度
							var point = [longitude, latitude];
							var destination = Cesium.Cartesian3.fromDegrees(point[0], point[1], 3000.0);
							console.log("经纬度:" + longitude, latitude, height);
							var id = pick.id._id.replace(/[^0-9]/ig, "");
							var content =
								'<tr><th style="color:white;">序号:</th><td><input class="dtInput" " value=' + pick.id._properties
								.OBJECTID +
								'></td></tr>' +
								'<tr><th style="color:white;">名称:</th><td><input class="dtInput" " value=' + pick.id._properties
								.TB_ID +
								'></td></tr>' +
								'<tr><th style="color:white;">类型:</th><td><input class="dtInput" " value=' + pick.id._properties
								.XZINFO +
								'></td></tr>' +
								'<tr><th style="color:white;">面积:</th><td><input class="dtInput" " value=' + pick.id._properties
								.MJ +
								'></td></tr>'
							var obj = {
								position: event.position,
								destination: destination,
								content: content
							};
							infoWindow(obj);

							function infoWindow(obj) {
								var picked = scene.pick(obj.position);
								if (Cesium.defined(picked)) {
									var id = picked.id;
									if (id instanceof Cesium.Entity) {
										$(".cesium-selection-wrapper2").show();
										$('#trackPopUpLink2').empty();
										$('#trackPopUpLink2').append(obj.content);

										// function positionPopUp(c) {
										// 	var x = c.x - ($('#trackPopUpContent').width()) / 2;
										// 	var y = c.y - ($('#trackPopUpContent').height());
										// 	$('#trackPopUpContent').css('transform', 'translate3d(' + x + 'px, ' + y + 'px, 0)');
										// }

										// var c = new Cesium.Cartesian3(obj.position.x, obj.position.y);
										// $('#trackPopUp').show();
										// positionPopUp(c); // Initial position

										// // 每一帧渲染结束后，对位置进行更新
										// movePositionEventListener = viewer.scene.postRender.addEventListener(function() {
										// 	var changedC = Cesium.SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position);
										// 	if ((c.x !== changedC.x) || (c.y !== changedC.y)) {
										// 		positionPopUp(changedC);
										// 		c = changedC;
										// 	}
										// });

										// PopUp close button event handler
										$('.leaflet-popup-close-button2').click(function() {
											$('#trackPopUp2').hide();
											$('#trackPopUpLink2').empty();
											$(".cesium-selection-wrapper2").hide();
											// movePositionEventListener.call();
											// return false;
											if (!handler) { // 如果无handler3D操作，移除当前的trackPopUp
												$("#trackPopUp2").remove();
											}
										});
										// if (movePositionEventListener) {
										// 	movePositionEventListener = movePositionEventListener && movePositionEventListener();
										// }
										return id;
									}
								}
							}
						} else {
							$('#trackPopUp2').hide();
						}
					},
					Cesium.ScreenSpaceEventType.LEFT_CLICK);
			},
			
			
			//加载2019现状影像图层
			addRasterLayers_1(Cesium, cviewer, url) {
				var esri = new Cesium.ArcGisMapServerImageryProvider({
					url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
					enablePickFeatures: true
				});
				var jixian = new Cesium.ArcGisMapServerImageryProvider({
					url: "https://localhost:6443/arcgis/rest/services/蓟县/jixian2019/MapServer/WMTS?service=WMTS&request=GetTile&layer=wzmap&style=default&tilematriX={TileMatrix}&tilerow={TileRow}&tilecoL={TileCol}r",
				})
				cviewer.imageryLayers.addImageryProvider(esri);
				cviewer.imageryLayers.addImageryProvider(jixian);
			},

			//加载2020现状影像图层
			addRasterLayers_2(Cesium, cviewer, url) {
				var esri = new Cesium.ArcGisMapServerImageryProvider({
					url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
					enablePickFeatures: true
				});
				var jixian = new Cesium.ArcGisMapServerImageryProvider({
					url: "https://localhost:6443/arcgis/rest/services/蓟县/jixian2020/MapServer/WMTS?service=WMTS&request=GetTile&layer=wzmap&style=default&tilematriX={TileMatrix}&tilerow={TileRow}&tilecoL={TileCol}r",
				})
				cviewer.imageryLayers.addImageryProvider(esri);
				cviewer.imageryLayers.addImageryProvider(jixian);
			},
			},
		}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
	/* 主界面 */
	.cesiumContainer {
		height: 100%;
	}

	/* leaflet风格气泡窗口样式 */
	.leaflet-popup {
		margin-top: 50px;
		position: absolute;
		text-align: center;
	}

	.leaflet-popup-close-button {
		margin-right: 5px;
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 4px 0 0;
		text-align: center;
		width: 18px;
		height: 14px;
		font: 16px/14px Tahoma, Verdana, sans-serif;
		color: #c3c3c3;
		text-decoration: none;
		font-weight: bold;
		background: transparent;
	}

	.leaflet-popup-content-wrapper {
		max-height: 250px;
		width: 300px;
		overflow-y: auto;
		height: 150px;
		padding: 1px;
		text-align: right;
		border-radius: 0px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		-moz-background-size: 100% 100%;
		background: "";
		background-image: url(../../assets/image/login-border.png);
	}

	.leaflet-popup-content {
		margin: 14px 19px;
		line-height: 1.4;
	}



	/* 窗口1 */
	.leaflet-popup1 {
		/* float: left; */
		z-index: 1;
		margin-left: 1010px;
		margin-top: 50px;
		position: fixed;
		text-align: center;
	}

	.leaflet-popup-close-button1 {
		margin-right: 5px;
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 4px 0 0;
		text-align: center;
		width: 18px;
		height: 14px;
		font: 16px/14px Tahoma, Verdana, sans-serif;
		color: #c3c3c3;
		text-decoration: none;
		font-weight: bold;
		background: transparent;
	}

	.leaflet-popup-content-wrapper1 {
		max-height: 250px;
		overflow-y: auto;
		height: 150px;
		padding: 1px;
		text-align: right;
		border-radius: 0px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		-moz-background-size: 100% 100%;
		background: "";
		background-image: url(../../assets/image/login-border.png);
	}

	.leaflet-popup-content1 {
		margin: 25px 19px;
		line-height: 1.4;
	}

	/* 窗口2 */
	.leaflet-popup2 {
		z-index: 1;
		margin-left: 1010px;
		margin-top: 387px;
		position: fixed;
		text-align: center;
	}

	.leaflet-popup-close-button2 {
		margin-right: 5px;
		position: absolute;
		top: 0;
		right: 0;
		padding: 8px 4px 0 0;
		text-align: center;
		width: 18px;
		height: 14px;
		font: 16px/14px Tahoma, Verdana, sans-serif;
		color: #c3c3c3;
		text-decoration: none;
		font-weight: bold;
		background: transparent;
	}

	.leaflet-popup-content-wrapper2 {
		max-height: 250px;
		overflow-y: auto;
		height: 150px;
		padding: 1px;
		text-align: right;
		border-radius: 0px;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		-moz-background-size: 100% 100%;
		background: "";
		background-image: url(../../assets/image/login-border.png);
	}

	.leaflet-popup-content2 {
		margin: 25px 19px;
		line-height: 1.4;
	}



	/* 箭头 */


	/* 输入框 */
	.dtInput {
		margin-top: 6px;
		/* margin: auto; */
		border-radius: 6vh;
		background-color: transparent;
		color: white;
		text-align: center;
		border: 0.1vh solid white;
		font-size: small;
		width: 95%;
	}

	.sidebar {
		width: 35%;
		height: 100%;
		position: absolute;
		top: 0;
		right: 0;
		background-color: #000;
		scroll-y: auto;
	}

	.gcontent {
		overflow-x: hidden;
		overflow-y: auto;
		color: #000;
		font-size: 0.7rem;
		font-family: '\5FAE\8F6F\96C5\9ED1', Helvetica, '黑体', Arial, Tahoma;
		height: 100%;
	}

	/*滚动条样式*/
	.gcontent::-webkit-scrollbar {
		width: 8px;
		/*height: 4px;*/
	}

	.gcontent::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgb(0, 194, 255);
		background: rgb(0, 194, 255);
	}

	.gcontent::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgb(0, 194, 255);
		border-radius: 0;
		background: rgba(0, 0, 0, 0.1);
	}

	.sidebar .row {
		width: 100%;
		height: 25%;
		padding: 0.2rem;
		box-sizing: border-box;
		position: relative;
	}
</style>
