import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询事件请求类型列表数据
 * @async
 * @function fetchEventRequestTypeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchEventRequestTypeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-event-request-type/query/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 事件请求类型保存
 * @async
 * @function saveEventRequestType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveEventRequestType(params) {
  return request(`${Host}/v1/${tenantId}/mt-event-request-type/save/ui`, {
    method: 'POST',
    body: params,
  });
}
