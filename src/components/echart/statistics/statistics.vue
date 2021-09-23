<template>
	<div><div id="bottomLeftChart" style="width: 100%;height: 100%;"></div></div>
</template>

<script>
const echarts = require('echarts');
export default {
	props: {
		datas: [Object, Array]
	},
	data() {
		return {
			time:[],
			data:[]
		};
	},
	mounted() {
		var mapVue = this
		this.datas.forEach((v) => {
			mapVue.time.push(v.time)
			mapVue.data.push(v.data)
		})
		this.drawPie();
	},
	methods: {
		drawPie() {
			// 基于准备好的dom，初始化echarts实例
			let myChartPieLeft = echarts.init(document.getElementById('bottomLeftChart'));
			//  ----------------------------------------------------------------
			let mapVue = this
			// let lineData = [50061, 32677, 49521, 32808];
			// var time = ['2020-14-21', '2020-14-22', '2020-14-23', '2020-14-24'];
			let option = {
				title: {
					text: '',
					x: 'center',
					y: 0,
					textStyle: {
						color: '#B4B4B4',
						fontSize: 16,
						fontWeight: 'normal'
					}
				},
				tooltip: {
					trigger: 'axis',
					backgroundColor: 'rgba(255,255,255,0.1)',
					axisPointer: {
						type: 'shadow',
						label: {
							show: true,
							backgroundColor: '#00c2ff'
						}
					}
				},
				grid: {
					x: '10%',
					width: '88%',
					y: '4%'
				},
				xAxis: {
					data: mapVue.time,
					axisLine: {
						lineStyle: {
							color: '#B4B4B4'
						}
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: true
					}
				},
				yAxis: [
					{
						position: 'right',
						splitLine: { show: false },
						axisLine: {
							lineStyle: {
								color: '#B4B4B4'
							}
						},
						axisLabel: {
							formatter: '{value}'
						}
					},
					{
						position: 'left',
						splitLine: { show: false },
						axisLine: {
							lineStyle: {
								color: '#B4B4B4'
							}
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							formatter: '{value} ',
							show: true
						}
					}
				],
				series: [
					{
						type: 'line',
						smooth: false,
						symbolSize: 8,
						yAxisIndex: 1,
						itemStyle: {
							normal: {
								color: '#00c2ff'
							}
						},
						data: mapVue.data
					}
					// {
					// 	type: 'bar',
					// 	barWidth: 10,
					// 	itemStyle: {
					// 		normal: {
					// 			barBorderRadius: 5,
					// 			color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#00c2ff' }, { offset: 1, color: '#28384f' }])
					// 		}
					// 	},
					// 	data: lineData
					// }
				]
			};
			myChartPieLeft.setOption(option);
			// -----------------------------------------------------------------
			// 响应式变化
			window.addEventListener('resize', () => myChartPieLeft.resize(), false);
		}
	},
	destroyed() {
		window.onresize = null;
	}
};
</script>

<style lang="scss" scoped></style>
