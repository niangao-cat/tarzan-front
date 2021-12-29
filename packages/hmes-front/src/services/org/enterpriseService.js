import request from '@/utils/request';
import { Host } from '@/utils/config';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询企业表格数据
 * @async
 * @function fetchEnterpriseList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchEnterpriseList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-enterprise/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 企业保存
 * @async
 * @function saveEnterprise
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveEnterprise(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-enterprise/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询企业详细信息
 * @async
 * @function fetchEnterpriseDetails
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchEnterpriseDetails(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-enterprise/one/ui`, {
    method: 'GET',
    query: params,
  });
}
