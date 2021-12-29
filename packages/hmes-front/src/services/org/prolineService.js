import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 生产线维护界面查询
 * @async
 * @function fetchProLineList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchProLineList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-production-line/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询单条数据详情
 * @async
 * @function fetchRecordDetail
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchRecordDetail(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-production-line/record/query/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 *@functionName: fetchProLineType
 *@async
 *@param {object} params - 查询条件
 *@description: 获取生产线类型
 *@author: 唐加旭
 *@date: 2019-08-16 15:06:50
 *@version: V0.0.1
 * */
export async function fetchProLineType(params) {
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 库存组列表保存
 * @async
 * @function saveAttrList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAttrList(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-locator-group/attr/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 *@functionName:featchDispatchList
 *@async
 *@param {object} params - 请求参数
 *@description: 获取指定得调度工艺
 *@author: 唐加旭
 *@date: 2019-08-19 14:09:27
 *@version: V0.8.6
 * */
export async function featchDispatchList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-prod-line-dispatch-oper/limit-dispatch/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 *@functionName: deleteDispatchMethods
 *@async
 *@param {object} params - 请求参数
 *@description: 删除指定工艺
 *@author: 唐加旭
 *@date: 2019-08-19 14:12:19
 *@version: V0.8.6
 * */
export async function deleteDispatchMethods(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-prod-line-dispatch-oper/remove/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 *@functionName: saveDispatchMethods
 *@async
 *@param {object} params - 请求参数
 *@description: 保存指定得调度工艺
 *@author: 唐加旭
 *@date: 2019-08-19 14:12:41
 *@version: V0.8.6
 * */
export async function saveDispatchMethods(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-prod-line-dispatch-oper/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 *@functionName: saveProLine
 *@async
 *@description:保存生产线编辑/新增
 *@author: 唐加旭
 *@date: 2019-08-19 17:22:07
 *@version: V0.0.1
 * */
export async function saveProLine(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-production-line/save/ui`, {
    method: 'POST',
    body: params,
  });
}

// mt-mod-prod-line-dispatch-oper/save/ui
