/*
 * @Description: 全屏效果
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-22 14:45:02
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-23 19:35:00
 * @Copyright: Copyright (c) 2019 Hand
 */
export function IEVersion() {
  // eslint-disable-next-line
  const userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; // 判断是否IE<11浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  return isIE || isIE11;
}

// 全屏
export function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen();
  }
}

// 退出全屏
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }
}

export const fullScreenEnabled =
  document.fullScreenEnabled ||
  document.webkitFullScreenEnabled ||
  document.mozFullScreenEnabled ||
  document.msFullScreenEnabled;
