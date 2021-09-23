import request from './request.js'
import Qs from 'qs'
//登录接口
export function ajax_login(_username, _password) {
	return request({
		url: '/Handlers/LoginHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'PCLogin',
			username: _username,
			password: _password
		},
	});
}
// 获取主题列表数据
export function ajax_GetSMCGInfo(_stationid, _time) {
	return request({
		url: 'Handlers/SMPointsHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'GetSMCGInfo',
			stationid: _stationid,
			Time: _time,
		},
	});
}
//获取全部车站数据接口
export function ajax_GetStationInfo() {
	return request({
		url: 'Handlers/StationHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'GetStationInfo',
		},
	});
}
//获取所有扫描时间数据接口
export function ajax_GetAllSMSS(_xlid) {
	return request({
		url: 'Handlers/SMPointsHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'GetAllSMSS',
			xlid: _xlid,
		},
	});
}
//获取影像数据接口
export function ajax_GetXLPic_QP(_xlid, _time) {
	return request({
		url: 'Handlers/RailHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'GetXLPic_QP',
			xlid: _xlid,
			time: _time
		},
	});
}

//获取断面数据接口
export function ajax_getDMPoints(_smcgId) {
	return request({
		url: '/Handlers/SMPointsHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'getDMPoints',
			smcgId: _smcgId,
		},
	});
}
//扫描成功的差异信息
export function ajax_GetSMCGChangeInfo(_xlid, _lc) {
	return request({
		url: '/Handlers/SMPointsHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'GetSMCGChangeInfo',
			xlid: _xlid,
			lc: _lc
		},
	});
}

//获取线路信息
export function ajax_GetXLInfoById(_IDS) {
	return request({
		url: '/Handlers/RailHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'GetXLInfoById',
			IDS: _IDS
		},
	});
}

//添加车站
export function ajax_AddStation(_stationName) {
	return request({
		url: '/Handlers/StationHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'AddStation',
			stationName: _stationName
		},
	});
}
//修改车站
export function ajax_UpdateStation(_stationName, _stationId) {
	return request({
		url: '/Handlers/StationHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'UpdateStation',
			stationName: _stationName,
			stationId: _stationId
		},
	});
}
//删除车站
export function ajax_DeleteStation(_stationId) {
	return request({
		url: '/Handlers/StationHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'DeleteStation',
			stationId: _stationId
		},
	});
}

//检查线路是否存在
export function ajax_CheckXL(_CZID, _XLName, _SMDATE) {
	return request({
		url: '/Handlers/RailHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'CheckXL',
			CZID: _CZID,
			XLName: _XLName,
			SMDATE: _SMDATE
		},
	});
}
//上传线路
export function ajax_AddXL(_CZID, _XLName, _SMDATE, _file,_this) {
	const fileform = new FormData()
	fileform.append('Method', 'AddXL')
	fileform.append('CZID', _CZID)
	fileform.append('XLName', _XLName)
	fileform.append('SMDATE', _SMDATE)
	fileform.append('file', _file)
	return request({
		url: '/Handlers/RailHandler.ashx',
		onUploadProgress: progressEvent => {
			var complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0
			_this.progressNum = complete
		},
		method: 'post',
		data: fileform
	});
}
//删除线路
export function ajax_DeleteXL(_XLID,_time) {
	return request({
		url: '/Handlers/RailHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'DeleteXL',
			XLID: _XLID,
			time: _time
		},
	});
}
//根据线路获取的所有扫描成果
export function ajax_GetSMCGInfobyXLID(_xlid,_time) {
	return request({
		url: '/Handlers/SMPointsHandler.ashx',
		method: 'post',
		transformRequest: [function(data) {
			data = Qs.stringify(data);
			return data
		}],
		data: {
			Method: 'GetSMCGInfobyXLID',
			xlid: _xlid,
			time: _time
		},
	});
}