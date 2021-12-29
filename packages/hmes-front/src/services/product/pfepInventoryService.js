import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { isNull, isUndefined } from 'lodash';

const tenantId = getCurrentOrganizationId();

/**
 * 查询PFEP数据
 * @async
 * @function fetchPfepInventoryList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchPfepInventoryList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-pfep-inventory/limit-detial/property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询PFEP详细数据
 * @async
 * @function fetchPfepInventoryLineList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchPfepInventoryLineList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-pfep-inventory/limit-detial/property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * PFEP保存
 * @async
 * @function savePfepInventory
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function savePfepInventory(params) {
  const param = filterNull(params);
  return request(`${Host}/v1/${tenantId}/mt-pfep-inventory/save/ui`, {
    method: 'POST',
    body: param,
  });
}

/**
 * 复制保存
 * @async
 * @function copyPfepInventory
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function copyPfepInventory(params) {
  return request(`${Host}/v1/${tenantId}/mt-pfep-inventory/copy/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询下拉框数据
 * @async
 * @function fetchSelectList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchSelectList(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 遍历参数把为null或undefined的转换成""
 * @async
 * @function filterNull
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
function filterNull(params) {
  const arr = params;
  for (const x in arr) {
    if (isNull(arr[x]) || isUndefined(arr[x])) {
      // 如果是null或者undefined 则转为 ''
      arr[x] = '';
    } else if (typeof arr[x] === 'object') {
      // 是对象继续递归
      arr[x] = filterNull(arr[x]);
    }
  }
  return params;
}
