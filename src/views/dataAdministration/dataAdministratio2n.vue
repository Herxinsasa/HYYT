<template>
	<div id="container3">
		<div class="div_tab">
			<div class="left div_tab_box">
				<div class="div_any">
					<div class="div_title">详细信息</div>
					<div class="tab_p">
						<table>
							<thead>
								<tr>
									<th>序号</th>
									<th>变化类型</th>
									<th>变化等级</th>
									<th>变化面积</th>
									<th>车牌号</th>
									<th>里程数（km）</th>
									<th>排名</th>
									<th>车牌号</th>
									<th>里程数（km）</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
								<tr>
									<td>1</td>
									<td>京A12345</td>
									<td>134.2</td>
								</tr>
							</tbody>
						</table>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		mounted() {},
		methods: {},
	}
</script>

<style scoped>
	@import url("../../assets/css/base.css");

	#container3 {
		background-color: #081832;
		height: 100%;
		width: 100%;
	}

	.div_any {
		width: 100%;
		height: 600px;
		box-shadow: -10px 0px 15px #034c6a inset,
			0px -10px 15px #034c6a inset,
			10px 0px 15px #034c6a inset,
			0px 10px 15px #034c6a inset;
		border: 1px solid #034c6a;
		box-sizing: border-box;
		position: relative;
		margin-top: 8px;
	}

	.tab_p {
		height: 93%;
		margin-top: 2%;
		position: relative;


	}

	.tab_p01 {
		height: auto !important;
		margin-top: 0 !important;
		position: relative;


	}

	.tab_p01 table td {
		padding: 6px 0;
	}

	.tab_p table {
		width: 100%;
		height: 100%;
		border-collapse: collapse;

		position: absolute;
		text-align: center;
	}

	.tab_p table thead th {
		color: #61d2f7;
		font-size: 14px;
		font-weight: 600;
		padding-top: 5px;
		padding-bottom: 5px;
	}

	.tab_p table tbody {
		color: #ffffff;
		font-size: 13px;
	}

	.tab_p table tbody tr:nth-child(2n+1) {
		background-color: #072951;
		box-shadow: -10px 0px 15px #034c6a inset,
			10px 0px 15px #034c6a inset;
	}

	.div_tab {
		width: 98%;
		margin-left: 1%;
		margin-bottom: 25px;
		height: 280px;
	}

	.div_tab_box {
		margin-top: 20px;
		height: 750px;
		width: 90%;
		margin-left: 5%;
		margin-right: 5%;
	}

	.div_title {
		background-color: #034c6a;
		border-radius: 18px;
		position: absolute;
		height: 25px;
		width: 60%;
		top: -15px;
		color: #ffffff;
		font-weight: bold;
		font-size: 10px;
		left: 20%;
		line-height: 30px;
		text-align: center;
		margin-top: 8px;
	}

	.div_title img {
		width: 14px;
		height: 14px;
		position: relative;
		top: 2px;
		margin-right: 5px;
	}
</style>
