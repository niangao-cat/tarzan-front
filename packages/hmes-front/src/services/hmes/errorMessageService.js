import request from '@/utils/request';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';
import { Host } from '@/utils/config';

const tenantId = getCurrentOrganizationId();

/**
 * 查询消息列表数据
 * @async
 * @function fetchMessageList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchMessageList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-error-message/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 消息保存
 * @async
 * @function saveMessage
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveMessage(params) {
  return request(`${Host}/v1/${tenantId}/mt-error-message/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 消息删除
 * @async
 * @function deleteMessage
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteMessage(params) {
  return request(`${Host}/v1/${tenantId}/mt-error-message/remove/ui`, {
    method: 'POST',
    body: params,
  });
}
