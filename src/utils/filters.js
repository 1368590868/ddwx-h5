// import parseTime, formatTime and set to filter
import { parseTime, formatTime } from '@/utils/index.js'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time, cFormat, isDay) {
	if (!time) {
		return "not-time";
	}
	if ((typeof time) === 'string') {
		time = time.replace(/-/g, "/");
	}
	
	let filterTime = parseTime(time, cFormat);
	if (isDay && (parseTime(new Date(), cFormat) === filterTime)) {
		return "今天"
	}
	return filterTime;
}

export function timeFormat (time, option) {
	if ((typeof time) === 'string') {
		time = time.replace(/-/g, "/");
	}
	return formatTime(time, option);
}

export function nReasonGo (code) {
	const ReqReason = {
		1: "会议",
		2: "接站/机",
		3: "送站/机",
		4: "公务"
	};
	return ReqReason[code];
}
export function nReasonGoIndex (code) {
	const ReqReason = {
		1: 0,
		2: 1,
		3: 2,
		4: 3
	};
	return ReqReason[code];
}


export function nRangeGo (code) {
	const ReqRange = {
		1: "接",
		2: "送",
		3: "全程"
	};
	return ReqRange[code];
}

export function nRangeGoIndex (code) {
	const ReqRange = {
		1: 0,
		2: 1,
		3: 2
	};
	return ReqRange[code];
}


export function cartypeGo  (code) {
	const ModelType = {
		1: "轿车",
		2: "越野车/SUV",
		3: "6-9座小型客车",
		4: "10-19座中型客车",
		5: "20座以上大型客车",
		6: "货车",
		7: "专用车"
	};
	return ModelType[code];
}

export function cartypeGoIndex  (code) {
	const ModelType = {
		1: 0,
		2: 1,
		3: 2,
		4: 3,
		5: 4,
		6: 5,
		7: 6
	};
	return ModelType[code];
}

export function isLong  (code) {
	// var res = /^[/u4e00-/u9fa5]+$/;
	let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
	if (reg.test(code)) {
		return code;
	}
	const isLongData = {
		'Y': "是",
		'N': "否",
	};
	return isLongData[code];
}

export function longIs (name) {
	let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
	if (!reg.test(name)) {
		return name;
	}
	const isLongData = {
		"是": 'Y',
		"否": 'N'
	};
	return isLongData[name];
}


export function sliceName (name, len) {
	return (name && name.slice((name.length -( len || 2)), name.length) || '');
}


export function readState (state) {
	return state == '0'? '未读': '已读';
} 


export function colors (state) {
	let colorString = "";
	switch (state) {
		case "b": colorString = "#ffb22c";break;
		case "9": colorString = "#c0c0c0";break;
		default :colorString = "#2893ff";
	}
	return colorString;
}