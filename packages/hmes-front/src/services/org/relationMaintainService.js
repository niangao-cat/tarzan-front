import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
// const Host = '/mes-4279';

/**
 * 获取树渲染title所用的组织类型
 * @async
 * @function fetchTreeOrgType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchTreeOrgType() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=MODELING&typeGroup=ORGANIZATION_ASSIGNABLE`,
    {
      method: 'GET',
    }
  );
}

/**
 * 获取组织类型下拉框选项数据
 * @async
 * @function fetchOrgType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchOrgType(params) {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=MODELING&typeGroup=${params.typeGroup}`,
    {
      method: 'GET',
    }
  );
}

/**
 * 获取组织关系树
 * @async
 * @function fetchOrgTree
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchOrgTree() {
  return request(`${Host}/v1/${tenantId}/mt-mod-organization-rel/tree/ui`, {
    method: 'GET',
  });
}

/**
 * 获取调整顺序表格的数据
 * @async
 * @function fetchAdjustOrderList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchAdjustOrderList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-organization-rel/node/order/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 保存调整顺序表格的数据
 * @async
 * @function saveAdjustOrderList
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function saveAdjustOrderList(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-organization-rel/node/order/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 粘贴组织关系树节点(组织节点)
 * @async
 * @function pasteOrgNode
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function pasteOrgNode(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-organization-rel/copy/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 删除组织关系树节点(组织节点)
 * @async
 * @function deleteOrgNode
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function deleteOrgNode(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-organization-rel/delete/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 分配组织保存
 * @async
 * @function assignOrg
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function assignOrg(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-organization-rel/assign/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 异步获取树节点
 * @async
 * @function queryTreeData
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function queryTreeData(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-organization-rel/tree/single/ui`, {
    method: 'POST',
    body: params,
  });
}


/**
 * 默认站点信息
 *
 * @export
 * @returns
 */
export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

/**
 * 异步获取树节点
 * @async
 * @function queryTreeData
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function querySearchTreeData(params) {
  return request(`${Host}/v1/${tenantId}/mdm-organization-rel/tree/full/ui`, {
    method: 'POST',
    body: params,
  });
}
