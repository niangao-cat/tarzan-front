import request from '@/utils/request';
import { Host } from '@/utils/config';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询库存日记账数据
 * @async
 * @function queryBillList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
// export async function queryBillList(params) {
//   const param = parseParameters(params);
//   return request(`${Host}/v1/${tenantId}/mt-inv-onhand-hold-journal/property/list/ui`, {
//     method: 'GET',
//     query: param,
//   });
// }
export async function queryBillList(params) {
  const queryParams = parseParameters({
    page: params.page,
  });
  const param = params;
  delete param.page;
  return request(`${Host}/v1/${tenantId}/mt-inv-onhand-hold-journal/property/list/ui`, {
    method: 'POST',
    query: queryParams,
    body: param,
  });
}

/**
 * 获取组织类型下拉列表
 * @async
 * @function fetchOrgType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchOrgType() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=INVENTORY&typeGroup=INV_ORGANIZATION_TYPE`,
    {
      method: 'GET',
    }
  );
}

/**
 * 获取所有者类型下拉列表
 * @async
 * @function fetchOwnerType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchOwnerType() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=INVENTORY&typeGroup=INVENTORY_OWNER_TYPE`,
    {
      method: 'GET',
    }
  );
}

/**
 * 获取预留类型下拉列表
 * @async
 * @function fetchHoldrType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchHoldrType() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=INVENTORY&typeGroup=HOLD_TYPE`,
    {
      method: 'GET',
    }
  );
}

/**
 * 获取预留指令类型下拉列表
 * @async
 * @function fetchHoldOrderType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchHoldOrderType() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=INVENTORY&typeGroup=RESERVE_ORDER_TYPE`,
    {
      method: 'GET',
    }
  );
}
