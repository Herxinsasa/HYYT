<template>
	<div id="image">
		<div id="imageMap" class="imageMap"></div>
	</div>
</template>

<script>
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { Image as ImageLayer } from 'ol/layer';
import Static from 'ol/source/ImageStatic';
export default {
	props: {
		imageUrl: Object
	},
	data() {
		return {
			map: '',
			imageLayer: ''
		};
	},
	mounted() {
		this.initMap();
		// console.log(this.imageUrl)
	},
	methods: {
		initMap() {
			let mapVue = this;
			mapVue.map = new Map({
				layers: [],
				target: 'imageMap',
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
			//遍历影像
			mapVue.imageUrl.pics.forEach(v => {
				var imageLayer = new ImageLayer();
				var source_ = new Static({
					url: v.picpath.replace('~','http://111.33.104.18:6088'),
					crossOrigin: '',
					imageExtent: JSON.parse(v.imageExtent)
				});
				imageLayer.setSource(source_);
				mapVue.map.addLayer(imageLayer);
			});
			mapVue.map.getView().fit([0, 0, mapVue.imageUrl.width, mapVue.imageUrl.height]);
		}
	}
};
</script>

<style lang="scss" scoped>
#image {
	width: 100%;
	height: 100%;
}
.imageMap {
	width: 100%;
	height: 100%;
	background-color: rgba(40, 56, 79, 1);
}
</style>
