/**
 * date转化为hh:mm
 */
export function dateToStr(date) {
  if (typeof date !== "number") {
    return "";
  }
  date = new Date(date);
  let hh = date.getHours();
  let mm = date.getMinutes();
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  return hh + ":" + mm;
}
function simpPYStr() {
  return "啊啊啊";
}
function ftPYStr() {
  return "啊啊啊";
}
function qqPYStr() {
  return "啊啊啊";
}
export function traditionalized(cc) {
  var str = "";
  if (cc) {
    for (var i = 0; i < cc.length; i++) {
      if (simpPYStr().indexOf(cc.charAt(i)) != -1)
        str += ftPYStr().charAt(simpPYStr().indexOf(cc.charAt(i)));
      else if (qqPYStr().indexOf(cc.charAt(i)) != -1)
        str += ftPYStr().charAt(qqPYStr().indexOf(cc.charAt(i)));
      else str += cc.charAt(i);
    }
  }
  return str;
}
export function simplized(cc) {
  var str = "";
  if (cc) {
    for (var i = 0; i < cc.length; i++) {
      if (ftPYStr().indexOf(cc.charAt(i)) != -1)
        str += simpPYStr().charAt(ftPYStr().indexOf(cc.charAt(i)));
      else if (qqPYStr().indexOf(cc.charAt(i)) != -1)
        str += simpPYStr().charAt(qqPYStr().indexOf(cc.charAt(i)));
      else str += cc.charAt(i);
    }
  }
  return str;
}
function qqlized(cc) {
  var str = "";
  for (var i = 0; i < cc.length; i++) {
    if (ftPYStr().indexOf(cc.charAt(i)) != -1)
      str += qqPYStr().charAt(ftPYStr().indexOf(cc.charAt(i)));
    else if (simpPYStr().indexOf(cc.charAt(i)) != -1)
      str += qqPYStr().charAt(simpPYStr().indexOf(cc.charAt(i)));
    else str += cc.charAt(i);
  }
  return str;
}

/**
 * 清除文本中连续重复超过指定次数的字符。
 * 
 * @param {string} text - 需要处理的文本字符串。
 * @param {number} maxRepeat - 允许的最大连续重复字符数。
 * @returns {string} 处理后的文本字符串，其中连续重复超过maxRepeat次的字符被替换为单个字符重复maxRepeat次。
 * 
 */
export function clearExcessiveRepeats(text, maxRepeat) {
	return text.replace(new RegExp(`(.)\\1{${maxRepeat},}`, 'g'), '$1'.repeat(maxRepeat));
  }
  
