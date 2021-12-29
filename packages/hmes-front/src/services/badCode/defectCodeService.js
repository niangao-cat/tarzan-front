import request from 'utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 不良代码列表查询
 * @async
 * @function fetchDefectCodeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchDefectCodeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-nc-code/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 不良代码列表新增
 * @async
 * @function saveDefectCodeList
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveDefectCodeList(params) {
  return request(`${Host}/v1/${tenantId}/mt-nc-code/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 不良代码单条数据详情
 * @async
 * @function fetchSingleCode
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchSingleCode(params) {
  return request(`${Host}/v1/${tenantId}/mt-nc-code/detail/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 次级不良代码删除
 * @async
 * @function deleteSecCode
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function deleteSecCode(params) {
  return request(`${Host}/v1/${tenantId}/mt-nc-secondary-code/remove/ui`, {
    method: 'POST',
    body: Number(params),
  });
}
/**
 * 工艺分配删除
 * @async
 * @function deleteProcessDispatch
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function deleteProcessDispatch(params) {
  return request(`${Host}/v1/${tenantId}/mt-nc-valid-oper/remove/ui`, {
    method: 'POST',
    body: Number(params),
  });
}
/**
 * 查询扩展字段列表数据
 * @async
 * @function featchAttrList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function featchAttrList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-locator-group/attr/query/ui`, {
    method: 'GET',
    query: param,
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
  const param = parseParameters(params);
  return request(
    `${Host}/v1/${tenantId}/mt-mod-locator-group/attr/save/ui?locatorGroupId=${param.locatorGroupId}`,
    {
      method: 'POST',
      body: param.locatorGroupAttrs,
    }
  );
}
