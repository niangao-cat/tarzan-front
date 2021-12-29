import _, { isUndefined } from 'lodash';
import { getEditTableData, getCurrentOrganizationId } from 'utils/utils';

import request from '@/utils/requestSite';
import { Host } from '@/utils/config';

import qs from 'querystring';
import Cookies from 'universal-cookie';

export const ACCESS_TOKEN = 'access_token';
const cookies = new Cookies();
const tenantId = getCurrentOrganizationId();

// import { isUndefined, isObject, isArray, isNull } from 'lodash';

/**
 * 用于改变表格数据行的编辑状态
 * @param {Object} record -表格选中的行数据record
 * @param {Array} tableList -表格数据
 * @param {string} key -对象的key值
 */
export function changeTableRowEditState(record, tableList, key) {
  const newList = tableList.map(item => {
    if (record[key] === item[key]) {
      return { ...item, _status: ['create', 'update'].includes(item._status) ? '' : 'update' };
    } else {
      return item;
    }
  });
  return newList;
}

/**
 * 行保存时，获取保存行的数据   ----return Object/'' || 行数据/未找到该行数据
 * @param {Object} record -表格选中的行数据record
 * @param {Array} tableList -表格数据
 * @param {string} key -对象的key值
 * @param {Array} flags -需要由true/false改为Y/N的flag
 */
export function getEditRecord(record, tableList, key, flags) {
  const EditList = getEditTableData(tableList, [key]);
  const index = _.findIndex(EditList, o => {
    return o[key] === record[key];
  });
  const params = EditList[index];
  if (flags && flags.length > 0) {
    flags.forEach(flag => {
      params[flag] = params[flag] ? 'Y' : 'N';
    });
  }
  return params;
}

/**
 * 用保存后返回的行数据，替换原表格保存行数据
 * @param {Object} record -保存成功返回的行数据record
 * @param {Array} tableList -表格数据
 * @param {string} key -对象的key值
 */
export function updateTableRowData(record, tableList, key) {
  let index = _.findIndex(tableList, o => {
    return o[key] === record[key];
  });
  const newList = tableList;
  index = index === -1 ? 0 : index;
  Object.keys(record).forEach(objKey => {
    newList[index][objKey] = record[objKey];
    newList[index]._status = '';
  });
  return newList;
}

/**
 *@functionName: ergodicData
 *@description 遍历对象
 *@author: 唐加旭
 *@date: 2019-08-30 14:24:49
 *@version: V0.0.1
 * */
export function ergodicData(origin) {
  // 判断是不是数组
  let item = origin;
  if (_.isArray(origin)) {
    for (let i = 0; i < origin.length; i++) {
      item[i] = ergodicData(origin[i]);
    }
  } else if (_.isObject(origin)) {
    // 判断是不是对象
    const keys = Object.keys(origin);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] !== '_tls') {
        item[keys[i]] = ergodicData(origin[keys[i]]);
      } else {
        item[keys[i]] = origin[keys[i]];
      }
    }
    // for (let key in origin) {
    //   item[key] = ergodicData(origin[key]);
    // }
  } else if (_.isUndefined(origin)) {
    item = '';
  } else if (_.isNull(origin)) {
    item = '';
  }
  return item;
}

/** ************************************************************************* */

/**
 * 生成带Get参数的URL
 * @param {String} url      原来的url
 * @param {Object} params   get 参数
 */
export function generateUrlWithGetParam(url, params) {
  let newUrl = url;
  if (params && Object.keys(params).length >= 1) {
    const newParams = params; // filterNullValueObject
    if (Object.keys(newParams).length >= 1) {
      newUrl += `${url.indexOf('?') >= 0 ? '&' : '?'}${qs.stringify(newParams)}`;
    }
  }
  return newUrl;
}

export function getAccessToken() {
  return cookies.get(ACCESS_TOKEN, {
    path: '/',
  });
}

export function removeAccessToken() {
  cookies.remove(ACCESS_TOKEN, {
    path: '/',
  });
}

export function removeAllCookie() {
  _.forIn(cookies.getAll(), (value, key) => {
    cookies.remove(key);
  });
}

/**
 * 过滤掉对象值为 undefined 和 空字符串 和 空数组 的属性
 * @author WH <heng.wei@hand-china.com>
 * @param {Object} obj
 * @returns {Object} 过滤后的查询参数
 */
export function filterNullValueObject(obj) {
  const result = {};
  if (obj && Object.keys(obj).length >= 1) {
    Object.keys(obj).forEach(key => {
      if (key && obj[key] !== undefined && obj[key] !== '' && obj[key] !== null) {
        // 如果查询的条件不为空
        if (_.isArray(obj[key]) && obj[key].length === 0) {
          return;
        }
        result[key] = obj[key];
      }
    });
  }
  return result; // 返回查询条件
}

export async function getDefaultSite() {
  const accessToken = getAccessToken();
  const defaultOptions = {
    credentials: 'include',
    Authorization: `bearer ${accessToken}`,
    headers: {
      Accept: 'application/json',
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `bearer ${accessToken}`,
    },
  };
  if (isUndefined(cookies.get('defaultSiteId')) || cookies.get('defaultSiteId') === 'undefined') {
    await request(
      `${Host}/v1/${tenantId}/wms-warehouse-locator/site/property`,
      defaultOptions
    ).then(res => {
      cookies.set('defaultSiteId', res.siteId);
      cookies.set('defaultSiteCode', res.siteCode);
      cookies.set('defaultSiteName', res.siteName);
    });
  }
}

export function getSiteId() {
  getDefaultSite();
  return cookies.get('defaultSiteId');
}

export function getSiteCode() {
  getDefaultSite();
  return cookies.get('defaultSiteCode');
}

export function getSiteName() {
  getDefaultSite();
  return cookies.get('defaultSiteName');
}
