import request from '@/utils/request';
import { Host } from '@/utils/config';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 表格数据
 * @async
 * @function fetchAgeningDataList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchAgeningDataList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/aging-basics/list`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存
 * @async
 * @function saveAgeningData
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAgeningData(params) {
  return request(`${Host}/v1/${tenantId}/aging-basics/save`, {
    method: 'POST',
    body: params,
  });
}

