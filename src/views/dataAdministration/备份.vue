<template>
	<div id="dataAdministration">
		<div class="container">
			<div class="row">
				<div class="header-title">
					<span>车站</span>
					<i class="el-icon-circle-plus-outline icon" title="添加" @click="alertCZ('addCZ', '')"></i>
				</div>
				<ul>
					<li v-for="(item, index) in stationData" :key="index" @click="funStationData(item, index)">
						<dv-border-box-10 style="position: relative;">
							<span :class="item.CZNAME == ind ? 'active' : ''">{{ item.CZNAME }}</span>
							<i
								class="el-icon-edit-outline"
								title="修改"
								@click="alertCZ('modifyCZ', item)"
								style="position: absolute;right: 0.2rem;top: 0.15rem;font-size: 0.18rem;"
							></i>
						</dv-border-box-10>
					</li>
				</ul>
			</div>
			<div class="row">
				<div class="header-title">
					<span>线路-{{ headerNameXL }}</span>
					<i class="el-icon-circle-plus-outline icon" title="添加" @click="alertCZ('addXL', '')"></i>
				</div>
				<ul>
					<template v-if="XLInfo != ''">
						<li v-for="(item, index) in XLInfo" :key="index" @click="funXL(item, index)">
							<dv-border-box-12>
								<span :class="index == indXL ? 'active' : ''">{{ item.XLNAME }}</span>
								<i class="el-icon-delete icon" title="删除" @click="alertCZ('delXL', item)" style="font-size: 0.18rem;right: 0.2rem;"></i>
							</dv-border-box-12>
						</li>
					</template>
					<template v-else>
						<li v-if="currentXLNAME != ''">{{ currentXLNAME }} 线路暂时没有数据 请添加~</li>
					</template>
				</ul>
			</div>
			<div class="row">
				<div class="header-title" style="position: relative;">
					<span>详细数据</span>
					<el-select v-model="timeDataOne" multiple collapse-tags placeholder="请选择" @change="changeTimeDataXL" style="position: absolute;right: 0;">
						<el-option v-for="item in XLtimeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</div>
				<template v-if="detailsDataNav != ''">
					<div class="header" style="background-color: rgb(0, 186, 255);display: flex;font-size: 15px;color: #fff;margin-top: 0.3rem;">
						<div align="center" class="header-item" style="height: 35px; line-height: 35px; width: 50px;padding: 0px 10px;">#</div>
						<div
							align="left"
							class="header-item"
							style="height: 35px; line-height: 35px; width: 334.333px;padding: 0px 10px;"
							v-for="(val, key, i) in detailsDataNav.data"
							:key="i"
						>
							{{ key }}
						</div>
					</div>
				</template>

				<ul>
					<div class="dv-scroll-board">
						<div class="rows" style="margin-bottom: 30vh;">
							<div class="row-item" v-for="(item, index) in detailsData" :key="index" style="height: 43.9px; line-height: 43.9px; background-color: rgb(0, 59, 81);">
								<div align="center" class="ceil" style="width: 50px;">
									<span class="index" style="background-color: #00BAFF;">{{ index }}</span>
								</div>
								<div align="left" class="ceil" style="width: 334.333px;" v-for="(val, key, i) in item.data" :key="i">{{ val }}</div>
							</div>
						</div>
					</div>
				</ul>
			</div>
		</div>
		<!-- 	车站弹窗 -->
		<selectionBox :ifVisible="ifVisibles" title="车站" v-if="ifVisibles" :size="sizes" @closePopup="closePopups">
			<div style="width: 80%;margin: 0px auto;">
				<div class="el-form-item">
					<label class="el-form-item__label" style="color: #fff;font-size: 0.2rem;margin-bottom: 0.1rem;">车站名称</label>
					<div class="el-form-item__content">
						<div class="el-input"><input type="text" autocomplete="off" class="el-input__inner" v-model="CZName" /></div>
					</div>
				</div>
				<div class="el-form-item">
					<div class="el-form-item__content">
						<button type="button" class="el-button el-button--primary" v-if="types == 'addCZ'" @click="subCZ()"><span>添加</span></button>
						<button type="button" class="el-button el-button--primary" v-if="types == 'modifyCZ'" @click="subCZ()"><span>修改</span></button>
						<button type="button" class="el-button el-button--default" v-if="types == 'addCZ'" @click="ifVisibles = false"><span>取消</span></button>
						<button type="button" class="el-button el-button--default" v-if="types == 'modifyCZ'" @click="delCZ()"><span>删除</span></button>
					</div>
				</div>
			</div>
		</selectionBox>
		<!-- 	车站弹窗 -->
		<!-- 	线路弹窗 -->
		<selectionBox :ifVisible="ifVisiblesXL" title="线路" v-if="ifVisiblesXL" :size="sizesXL" @closePopup="closePopups">
			<div style="width: 80%;margin: 0px auto;">
				<div class="el-form-item" style="display: flex;margin-top: 0.5rem;">
					<label class="el-form-item__label" style="text-align: left;color: #fff;font-size: 0.2rem;margin-bottom: 0.1rem;width: 1.5rem;">线路名称</label>
					<div class="el-form-item__content" style="flex: 1;">
						<div class="el-input"><input type="text" autocomplete="off" class="el-input__inner" v-model="XLName" /></div>
					</div>
				</div>
				<div class="el-form-item" style="display: flex;">
					<label class="el-form-item__label" style="text-align: left;color: #fff;font-size: 0.2rem;margin-bottom: 0.1rem;width: 1.5rem;">车站名称</label>
					<div class="el-form-item__content" style="flex: 1;">
						<el-select v-model="addressDataName" placeholder="请选择" @change="changeAddress" style="width: 100%;" :popper-append-to-body="false">
							<el-option v-for="(item, index) in stationData" :key="index" :label="item.CZNAME" :value="item.CZNAME"></el-option>
						</el-select>
					</div>
				</div>
				<div class="el-form-item" style="display: flex;">
					<label class="el-form-item__label" style="text-align: left;color: #fff;font-size: 0.2rem;margin-bottom: 0.1rem;width: 1.5rem;">日期</label>
					<div class="el-form-item__content" style="flex: 1;">
						<el-date-picker v-model="dateVal" type="date" placeholder="选择日期" @change="changeDate"></el-date-picker>
					</div>
				</div>
				<div class="el-form-item" style="display: flex;">
					<label class="el-form-item__label" style="text-align: left;color: #fff;font-size: 0.2rem;margin-bottom: 0.1rem;width: 1.5rem;">文件</label>
					<div class="el-form-item__content" style="flex: 1;">
						<el-upload
							class="upload-demo"
							action=""
							accept=".zip"
							:auto-upload="false"
							:on-remove="handleRemove"
							:before-remove="beforeRemove"
							:on-change="changeUpload"
							multiple
							:limit="1"
							:on-exceed="handleExceed"
							:file-list="fileList"
						>
							<el-button size="small" type="primary">点击上传</el-button>
						</el-upload>
					</div>
				</div>
				<div class="el-form-item">
					<div class="el-form-item__content" style="display: flex;justify-content: space-around;">
						<button type="button" class="el-button el-button--primary" v-if="types == 'addXL'" @click="subXL()"><span>添加</span></button>
						<button type="button" class="el-button el-button--default" v-if="types == 'addXL'" @click="ifVisiblesXL = false"><span>取消</span></button>
						<button type="button" class="el-button el-button--default" v-if="types == 'modifyXL'" @click="ifVisiblesXL = false"><span>删除</span></button>
					</div>
				</div>
			</div>
		</selectionBox>
		<!-- 线路弹窗 -->
		<!-- 删除线路弹窗 start -->
		<selectionBox :ifVisible="ifVisiblesXLDel" title="线路" v-if="ifVisiblesXLDel" :size="sizes" @closePopup="closePopups">
			<div style="width: 80%;margin: 0px auto;">
				<div class="el-form-item">
					<label class="el-form-item__label" style="color: #fff;font-size: 0.2rem;margin-bottom: 0.1rem;">删除日期</label>
					<div class="el-form-item__content">
						<div class="el-input">
							<el-select v-model="timeDataOne" multiple collapse-tags placeholder="请选择" @change="changeTimeDataXL" style="width: 100%;">
								<el-option v-for="item in XLtimeData" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</div>
					</div>
				</div>
				<div class="el-form-item">
					<div class="el-form-item__content">
						<button type="button" class="el-button el-button--primary" @click="delXL()"><span>删除</span></button>
						<button type="button" class="el-button el-button--default" @click="ifVisiblesXLDel = false"><span>取消</span></button>
					</div>
				</div>
			</div>
		</selectionBox>
		<!-- 删除线路弹窗 end -->
		<!--加载提示框 start-->
		<dv-loading id="loading" v-if="loading">上传中,进度{{ progressNum }}%</dv-loading>
		<!--加载提示框 end-->
	</div>
</template>

<script>
import * as ajax from '../../axios/api.js';
import Utils from '../../assets/js/util.js';
export default {
	name: 'dataAdministration',
	data() {
		return {
			msg: '数据管理',
			stationData: '',
			XLInfo: '',
			ifVisibles: false,
			ifVisiblesXL: false,
			ifVisiblesXLDel: false,
			sizes: { width: '30vw', height: '35vh', left: '35vw', top: '15vh' },
			sizesXL: { width: '30vw', height: '48vh', left: '35vw', top: '15vh' },
			CZName: '',
			types: '',
			CZVal: '',
			fileList: [],
			dateVal: '',
			XLName: '',
			fileData: '',
			addressDataId: '',
			addressDataName: '',
			progressNum: 0,
			loading: false,
			currentXLNAME: '',
			headerNameXL: '',
			ind: '',
			indXL: 0,
			detailsData: '',
			detailsDataNav: '',
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
			XLtimeData: [],
			timeDataOne: [],
			changeTimeDataArr: '',
			selectTime: '',
			delXlVal: '',
			obtainXLVal: ''
		};
	},
	mounted() {
		this.GetStationInfo();
		// this.GetXLInfoById();
	},
	methods: {
		//文件删除成功之后的方法
		handleRemove() {
			// console.log(file,fileList)
			this.fileData = [];
		},
		//文件超出个数限制时的钩子
		handleExceed(files, fileList) {
			// console.log(file,fileList)
			this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		},
		//确认删除执行的方法
		beforeRemove(file) {
			// console.log(file,fileList)
			return this.$confirm(`确定移除 ${file.name}？`);
		},
		// 上传文件发生变化
		changeUpload(fileList) {
			// console.log(file,fileList)
			this.fileData = fileList;
		},
		//获取当前选中日期的值并且转换时分秒
		changeDate(val) {
			var month_ = val.getMonth() + 1;
			var date_ = val.getDate();
			var time = val.getFullYear() + '-' + (month_ < 10 ? '0' + month_ : month_) + '-' + (date_ < 10 ? '0' + date_ : date_);
			this.dateVal = time;
		},
		//获取车站接口
		GetStationInfo() {
			var _this = this;
			ajax.ajax_GetStationInfo()
				.then(res => {
					if (res.data != 'null') {
						console.log(res);
						_this.stationData = res.data;
						//获取默认选择的车站的名字
						_this.addressDataName = res.data[0].CZNAME;
						_this.ind = _this.addressDataName;
						//获取默认选择的车站的id
						_this.addressDataId = res.data[0].CZID;
						//获取线路数据的方法
						_this.GetXLInfoById(res.data[0]);
					} else if (res.data != 'success') {
						var obg = { CZNAME: '' };
						//获取线路数据的方法
						_this.GetXLInfoById(obg);
						_this.stationData = [];
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		//车站信息发生变化执行的方法
		changeAddress(val) {
			this.stationData.forEach(v => {
				if (v.CZNAME == val) {
					this.addressDataId = v.CZID;
					this.addressDataName = v.CZNAME;
				}
			});
		},
		//通过车站id获取线路
		funStationData(val, index) {
			console.log(index);
			// this.ind = index
			this.ind = val.CZNAME;
			console.log(val);
			this.GetXLInfoById(val);
		},
		//获取线路接口
		GetXLInfoById(val) {
			var _this = this;
			_this.indXL = 0;
			_this.ind = val.CZNAME;
			_this.obtainXLVal = val;
			ajax.ajax_GetXLInfoById(val.CZID)
				.then(res => {
					if (res.data != 'null') {
						_this.XLInfo = res.data;
						_this.headerNameXL = val.CZNAME; //线路头部显示的名字
						_this.detailsDataFun(res.data[0]);
						_this.changeTimeDataArr = res.data[0];
					} else {
						_this.XLInfo = '';
						_this.currentXLNAME = val.CZNAME;
						_this.headerNameXL = val.CZNAME;
						_this.detailsData = [];
						_this.detailsDataNav = [];
						_this.XLtimeData = [];
						_this.timeDataOne = '';
					}
				})
				.catch(err => {
					console.log(err);
				});
		},
		closePopups(val) {
			this.ifVisibles = val;
			this.ifVisiblesXL = val;
			this.ifVisiblesXLDel = val;
		},
		//弹窗
		alertCZ(type, val) {
			if (type == 'addCZ') {
				this.CZName = ''; //input表单的值
				this.types = type; //当前点击弹窗的类型
				this.ifVisibles = true; //打开车站输入框
			} else if (type == 'modifyCZ') {
				this.CZName = val.CZNAME; //input表单的值
				this.types = type; //当前点击弹窗的类型
				this.CZVal = val; //获取当前点击数据的值
				this.ifVisibles = true; //打开车站输入框
			} else if (type == 'addXL') {
				this.types = type; //当前点击弹窗的类型
				this.ifVisiblesXL = true;
				this.fileData = []; //清空文件
			} else if (type == 'delXL') {
				this.ifVisiblesXLDel = true;
				this.delXlVal = val;
			}
		},
		//提交车站
		subCZ() {
			if (this.types == 'addCZ') {
				this.AddCZ();
			} else if (this.types == 'modifyCZ') {
				this.modifyCZ();
			}
		},
		//添加车站
		AddCZ() {
			var _this = this;
			if (this.CZName == '') {
				this.$message.error('请输出车站名称');
			} else {
				//添加车站的接口
				ajax.ajax_AddStation(this.CZName)
					.then(res => {
						console.log(res);
						if (res.errorMessage == 'hasExist') {
							_this.$message({ message: '当前车站已存在', type: 'warning' });
						} else if (res.errorMessage == 'null') {
							_this.$message({ message: '添加成功', type: 'success' }); //添加成功的提示
							_this.ifVisibles = false; //关闭弹框
							_this.GetStationInfo(); //调用车站数据的接口  实现刷新
							Utils.$emit('demo', 'msg'); //跨页面执行的方法
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		//修改车站
		modifyCZ() {
			var _this = this;
			if (this.CZName == '') {
				this.$message.error('请输入车站名称');
			} else {
				//修改车站数据的接口
				ajax.ajax_UpdateStation(_this.CZName, _this.CZVal.CZID)
					.then(res => {
						console.log(res);
						if (res.errorMessage == 'hasExist') {
							_this.$message({ message: '当前车站已存在', type: 'warning' });
						} else if (res.errorMessage == 'null') {
							_this.$message({ message: '修改成功', type: 'success' }); //修改成功的提示
							_this.ifVisibles = false; //关闭弹框
							_this.GetStationInfo(); //调用车站数据的接口  实现刷新
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		//删除车站
		delCZ() {
			var _this = this;
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					//删除车站接口的方法
					ajax.ajax_DeleteStation(_this.CZVal.CZID)
						.then(res => {
							console.log(res);
							_this.$message({ type: 'success', message: '删除成功!' });
							_this.ifVisibles = false; //关闭弹框
							_this.GetStationInfo(); //调用车站数据的接口  实现刷新
							Utils.$emit('demo', 'msg'); //跨页面执行的方法
						})
						.catch(err => {
							console.log(err);
						});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
		},
		//提交线路
		subXL() {
			var _this = this;
			var trus = true;
			if (this.XLName == '') {
				this.$message.error('请输入车站名称');
				trus = false;
				return;
			}
			if (this.dateVal == '') {
				this.$message.error('请输入日期');
				trus = false;
				return;
			}
			if (this.fileData == '') {
				this.$message.error('请上传文件');
				trus = false;
				return;
			}
			if (trus) {
				//检查线路是否存在
				console.log(this.addressDataId, this.XLName, this.dateVal);
				ajax.ajax_CheckXL(this.addressDataId, this.XLName, this.dateVal)
					.then(res => {
						console.log(res);
						if (res.errorMessage == 'null') {
							//显示上传动画
							_this.loading = true;
							//上传文件的接口
							ajax.ajax_AddXL(_this.addressDataId, _this.XLName, _this.dateVal, _this.fileData.raw, _this)
								.then(res => {
									console.log(res);
									if (res.errorMessage == '已添加了具有相同键的项。') {
										_this.$message.error(res.errorMessage);
									} else {
										var obg = { CZID: _this.addressDataId, CZNAME: _this.addressDataName };
										//刷新线路数据的方法
										_this.GetXLInfoById(obg);
									}
									_this.loading = false;
									_this.ifVisiblesXL = false;
								})
								.catch(err => {
									if (err == '网络超时') {
										_this.$message.error('上传超时,请重新上传');
										_this.loading = false;
										_this.ifVisiblesXL = false;
									}
									console.log(err);
								});
						} else if (res.errorMessage == 'hasExist') {
							_this.$message.error('当前线路已存在,请修改参数');
						}
					})
					.catch(err => {
						console.log(err);
					});
			}
		},
		//删除线路的方法
		delXL() {
			var _this = this;
			console.log(_this.selectTime.join());
			console.log(_this.delXlVal);
			this.$confirm('此操作将永久删除, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
				.then(() => {
					//删除线路的方法
					ajax.ajax_DeleteXL(_this.delXlVal.XLID, _this.selectTime.join())
						.then(res => {
							console.log(res);
							// var obg = { CZID: _this.delXlVal.XLID, CZNAME: _this.delXlVal.CZNAME };
							// _this.GetXLInfoById(obg); //刷新线路接口的数据
							_this.GetXLInfoById(_this.obtainXLVal); //刷新线路接口
							_this.$message({ type: 'success', message: '删除成功!' });
							_this.ifVisiblesXLDel = false;
						})
						.catch(err => {
							console.log(err);
						});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
		},
		//点击线路的方法
		funXL(val, index) {
			this.indXL = index;
			this.detailstimeDataScreen(val); //筛选时间数据
			this.detailsDataFun(val); //获取详细数据
			this.changeTimeDataArr = val;
		},
		//详细数据
		detailsDataFun(val) {
			console.log(val);
			var _this = this;
			_this.detailstimeDataScreen(val); //筛选时间数据
			//根据线路获取的所有扫描成果
			ajax.ajax_GetSMCGInfobyXLID(val.XLID, _this.timeDataOne.join())
				.then(res => {
					console.log(res);
					_this.detailsData = [];
					res.data.forEach(v => {
						let obg = {};
						obg.time = v.SMDATE;
						obg.data = {};
						for (const item in v) {
							_this.navData.forEach(items => {
								if (items.data == item) {
									obg.data[items.name] = v[item];
								}
							});
						}
						_this.detailsData.push(obg);
					});
					_this.detailsDataNav = _this.detailsData[0];
				})
				.catch(err => {
					console.log(err);
				});
		},
		//获取当前选中时间的值
		changeTimeDataXL(val) {
			if (val == '') {
				val = ['9999-12-31'];
			}
			var _this = this;
			// _this.detailstimeDataScreen(val); //筛选时间数据
			// console.log(_this.changeTimeDataArr.XLID)
			// console.log(val.join())
			this.selectTime = val;
			//根据线路获取的所有扫描成果
			ajax.ajax_GetSMCGInfobyXLID(_this.changeTimeDataArr.XLID, val.join())
				.then(res => {
					console.log(res);
					_this.detailsData = [];
					res.data.forEach(v => {
						let obg = {};
						obg.time = v.SMDATE;
						obg.data = {};
						for (const item in v) {
							_this.navData.forEach(items => {
								if (items.data == item) {
									obg.data[items.name] = v[item];
								}
							});
						}
						_this.detailsData.push(obg);
					});
					_this.detailsDataNav = _this.detailsData[0];
				})
				.catch(err => {
					console.log(err);
				});
		},
		//筛选时间数据的方法
		detailstimeDataScreen(val) {
			this.XLtimeData = []; //初始化全部时间
			this.timeDataOne = []; //获取默认选择的时间
			//获取时间数据
			for (const item in JSON.parse(val.YXPATH)) {
				var timeData = {};
				timeData.value = item;
				timeData.label = item;
				//获取全部的时间
				this.XLtimeData.push(timeData);
				//获取默认选择的时间
				this.timeDataOne.push(item);
				this.selectTime = this.timeDataOne;
			}
		}
	}
};
</script>

<style>
#dataAdministration {
	width: 100%;
	height: 100%;
	background: #28384f;
	background-size: 100%;
}
.container {
	width: 100%;
	height: 100%;
	background: url(../../assets/image/dataAdministration-back1.png);
	background-size: 100%;
	padding-top: 0.5rem;
	box-sizing: border-box;
}
.container .row {
	border: 1px solid #28384f;
	float: left;
	height: 100%;
	box-shadow: 0px 0px 20px #28384f;
	padding: 0px 0.4rem;
}
.container .row .header-title {
	width: 100%;
	height: 0.6rem;
	line-height: 0.6rem;
	text-align: center;
	font-size: 0.2rem;
	border: 1px solid #00c2ff;
	box-shadow: 0px 0px 20px #00c2ff;
	position: relative;
	transition: all 0.12s ease-in 0.1s;
}
.container .row .icon {
	font-size: 0.25rem;
	position: absolute;
	top: 0.16rem;
	right: 0.1rem;
	transition: all 0.12s ease-in 0.1s;
}
.container .row .header-title:hover {
	/* 	border: 1px solid #fff;
	box-shadow: 0px 0px 20px #fff;
	cursor: pointer; */
}
.container .row .icon:hover {
	cursor: pointer;
}
.container .row ul {
	width: 100%;
	height: 100%;
	overflow-y: auto;
	/* IE 10+ 滚动但是不显示滚动条*/
	-ms-overflow-style: none;
	/* Firefox 滚动但是不显示滚动条*/
	overflow: -moz-scrollbars-none;
}
/* chrome 和Safari 滚动但是不显示滚动条*/
.container .row ul::-webkit-scrollbar {
	width: 0 !important;
}
.container .row ul li {
	height: 0.5rem;
	width: 100%;
	margin-top: 0.3rem;
	text-align: center;
	line-height: 0.5rem;
	overflow: hidden;
}
.container .row ul li:hover {
	cursor: pointer;
}
.container .row ul li span.active {
	color: rgb(0, 186, 255);
}
.container .row:nth-child(1) {
	width: 15%;
}
.container .row:nth-child(2) {
	width: 15%;
}
.container .row:nth-child(3) {
	width: 70%;
}
#dataAdministration .el-input__inner {
	border: 1px solid #00c2ff !important;
	box-shadow: 0px 0px 20px #00c2ff;
	background: #28384f;
	color: #fff;
}
#dataAdministration .el-button--primary {
	background-color: #00c2ff;
	border-color: #00c2ff;
	/* 	box-shadow: 0px 0px 20px #00c2ff; */
}
#dataAdministration .el-button + .el-button {
	background-color: #28384f;
	border-color: #00c2ff;
	/* 	box-shadow: 0px 0px 20px #00c2ff; */
	color: #fff;
}
.el-message-box {
	background: #28384f !important;
	border-color: #00c2ff !important;
	box-shadow: 0px 0px 20px #00c2ff;
}
.el-message-box__status + .el-message-box__message {
	color: #fff;
}
.el-message-box__title {
	color: #fff;
}
.el-message-box__btns .el-button {
	background-color: #28384f;
	border-color: #00c2ff;
	/* 	box-shadow: 0px 0px 20px #00c2ff; */
	color: #fff;
}
.el-message-box__btns .el-button--primary {
	background-color: #00c2ff;
	border-color: #00c2ff;
}
.el-message-box__headerbtn .el-message-box__close {
	color: #fff !important;
}
.el-message-box {
	margin-bottom: 1.8rem;
}
.el-upload-list__item-name {
	color: #fff !important;
}
.el-icon-document {
	color: #fff !important;
}
.el-upload-list__item.is-success .el-upload-list__item-name:hover {
	background: #28384f !important;
}
.el-upload-list__item .el-icon-close:hover {
	color: #fff !important;
}
.el-upload-list__item:hover {
	background: #28384f !important;
}
.el-message-box__message p {
	color: #fff;
}
.el-input__prefix {
	color: #fff !important;
}
.el-date-editor {
	width: 100% !important;
}
.el-tag.el-tag--info {
	background-color: #28384f;
	border-color: #28384f;
	color: #fff;
}
.el-tag.el-tag--info .el-tag__close {
	color: #28384f;
}
.el-select .el-tag__close.el-icon-close {
	background-color: #fff;
}
.el-tag .el-tag__close:hover {
	color: #fff;
	background-color: #28384f;
}
#loading {
	position: fixed;
	top: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.7);
	z-index: 9999999999999;
}
input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
	color: #fff !important;
}

input:-moz-placeholder,
textarea:-moz-placeholder {
	color: #fff !important;
}

input::-moz-placeholder,
textarea::-moz-placeholder {
	color: #fff !important;
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
	color: #fff !important;
}
</style>
<template>
	<div id="container3">
		<el-table :data="tableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}">
			<el-table-column prop="date" label="日期" sortable width="180">
			</el-table-column>
			<el-table-column prop="name" label="姓名" sortable width="180">
			</el-table-column>
			<el-table-column prop="address" label="地址" :formatter="formatter">
			</el-table-column>
		</el-table>
		<el-pagination background layout="prev, pager, next" :total="20">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}]
			}
		},
		methods: {
			// formatter(row, column) {
			// 	return row.address;
			// }
		}
	}
</script>

<style scoped>
	#container3 {
		background-color: #081832;
		height: 100%;
		width: 100%;
	}
</style>
