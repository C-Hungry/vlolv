/**
 * 存储用户信息
 */
export const saveUserInfo = (content) => {
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem("userInfo", content);
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return JSON.parse(window.sessionStorage.getItem("userInfo"));
}

/**
 * 删除用户信息
 */
export const removeUserInfo = () => {
  window.sessionStorage.removeItem("userInfo");
}

/**
 * 获取用户信息中的token
 */
export const getToken = () => {
  var userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
  return userInfo ? userInfo.token : "";
}

/**
 * 存储企业信息
 */
export const saveCompanyInfo = (content) => {
  if (typeof content !== 'string') {
    content = JSON.stringify(content);
  }
  window.sessionStorage.setItem("companyInfo", content);
}

/**
 * 获取企业信息
 */
export const getCompanyInfo = () => {
  let companyInfo = JSON.parse(window.sessionStorage.getItem("companyInfo"));
  return companyInfo;
}
/**
 * 删除企业信息
 */
export const removeCompanyInfo = () => {
    window.sessionStorage.removeItem("companyInfo");
  }
/**
 * 将当前时间转换为字符串日期
 */
export const dateToString = (now) => {

  if(!now) return "";

  var year = now.getFullYear();
  var month = (now.getMonth() + 1).toString();
  var day = (now.getDate()).toString();
  var hour = (now.getHours()).toString();
  var minute = (now.getMinutes()).toString();
  var second = (now.getSeconds()).toString();
  if (month.length == 1) {
    month = "0" + month;
  }
  if (day.length == 1) {
    day = "0" + day;
  }
  if (hour.length == 1) {
    hour = "0" + hour;
  }
  if (minute.length == 1) {
    minute = "0" + minute;
  }
  if (second.length == 1) {
    second = "0" + second;
  }
  var dateTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  return dateTime;
} 


/**
* 获取本周、本季度、本月、上月的开始日期、结束日期
*/
export const DateManager = new function () {
  var now = new Date(); //当前日期 
  var nowDayOfWeek = now.getDay(); //今天本周的第几天 
  var nowDay = now.getDate(); //当前日 
  var nowMonth = now.getMonth(); //当前月 
  var nowYear = now.getYear(); //当前年 
  nowYear += (nowYear < 2000) ? 1900 : 0; //

  var lastMonthDate = new Date(); //上月日期
  lastMonthDate.setDate(1);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  var lastYear = lastMonthDate.getYear();
  var lastMonth = lastMonthDate.getMonth();

  //格式化日期：yyyy-MM-dd 
  this.formatDate = function (date) {
      var myyear = date.getFullYear();
      var mymonth = date.getMonth() + 1;
      var myweekday = date.getDate();

      if (mymonth < 10) {
          mymonth = "0" + mymonth;
      }
      if (myweekday < 10) {
          myweekday = "0" + myweekday;
      }
      return (myyear + "-" + mymonth + "-" + myweekday);
  }

  //格式化日期时间: yyyy-MM-dd HH-mm
  this.formatTime = function (date) {
    date = new Date(date);
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    var myHour = date.getHours();
    var myMinute = date.getMinutes();
    if (mymonth < 10) {
        mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
        myweekday = "0" + myweekday;
    }
    if (myMinute < 10) {
        myMinute = "0" + myMinute;
    }
    return (myyear + "-" + mymonth + "-" + myweekday + " " + myHour + ":" + myMinute);
  }

  //获得某月的天数 
  this.getMonthDays = function (myMonth) {
      var monthStartDate = new Date(nowYear, myMonth, 1);
      var monthEndDate = new Date(nowYear, myMonth + 1, 1);
      var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
      return days;
  }

  //获得本季度的开始月份 
  this.getQuarterStartMonth = function () {
      var quarterStartMonth = 0;
      if (nowMonth < 3) {
          quarterStartMonth = 0;
      }
      if (2 < nowMonth && nowMonth < 6) {
          quarterStartMonth = 3;
      }
      if (5 < nowMonth && nowMonth < 9) {
          quarterStartMonth = 6;
      }
      if (nowMonth > 8) {
          quarterStartMonth = 9;
      }
      return quarterStartMonth;
  }

  //获得本周的开始日期 
  this.getWeekStartDate = function () {
      var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
      return this.formatDate(weekStartDate);
  }

  //获得本周的结束日期 
  this.getWeekEndDate = function () {
      var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
      return this.formatDate(weekEndDate);
  }

  //获得本月的开始日期 
  this.getMonthStartDate = function () {
      var monthStartDate = new Date(nowYear, nowMonth, 1);
      return this.formatDate(monthStartDate);
  }

  //获得本月的结束日期 
  this.getMonthEndDate = function () {
      var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
      return this.formatDate(monthEndDate);
  }

  //获得上月开始时间
  this.getLastMonthStartDate = function () {
      var lastMonthStartDate = new Date(nowYear, lastMonth, 1);
      return this.formatDate(lastMonthStartDate);
  }

  //获得上月结束时间
  this.getLastMonthEndDate = function () {
      var lastMonthEndDate = new Date(nowYear, lastMonth, this.getMonthDays(lastMonth));
      return this.formatDate(lastMonthEndDate);
  }

  //获得本季度的开始日期 
  this.getQuarterStartDate = function () {
      var quarterStartDate = new Date(nowYear, this.getQuarterStartMonth(), 1);
      return this.formatDate(quarterStartDate);
  }

  //或的本季度的结束日期 
  this.getQuarterEndDate = function () {
      var quarterEndMonth = this.getQuarterStartMonth() + 2;
      var quarterStartDate = new Date(nowYear, quarterEndMonth, this.getMonthDays(quarterEndMonth));
      return this.formatDate(quarterStartDate);
  }
}();