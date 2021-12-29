import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询号码段分配表格数据
 * @async
 * @function fetchNumberRangeDistributionList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchNumberRangeDistributionList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-numrange-assign/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 号码段分配保存
 * @async
 * @function saveNumberRangeDistribution
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveNumberRangeDistribution(params) {
  return request(`${Host}/v1/${tenantId}/mt-numrange-assign/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 号码段分配删除
 * @async
 * @function deleteNumberRangeDistribution
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteNumberRangeDistribution(params) {
  return request(`${Host}/v1/${tenantId}/mt-numrange-assign/batch/remove/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询修改历史数据
 * @async
 * @function fetchHistoryList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchHistoryList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-numrange-assign-his/list/ui`, {
    method: 'GET',
    query: param,
  });
}
