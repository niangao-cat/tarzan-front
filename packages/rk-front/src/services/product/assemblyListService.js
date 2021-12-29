import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询数据源列表数据
 * @async
 * @function fetchQueryBomList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchQueryBomList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-bom/list/ui`, {
    method: 'GET',
    query: param,
  });
}

// 查询筛选条件的类型
export async function fetchAssemblyTypes(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui`, {
    method: 'GET',
    query: param,
  });
}

// 查询筛选条件的状态
export async function fetchAssemblyStatus(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-gen-status/combo-box/ui`, {
    method: 'GET',
    query: param,
  });
}

// 保存装配清单
export async function saveAssemblyDetail(params) {
  return request(`${Host}/v1/${tenantId}/mt-bom/save/ui`, {
    method: 'POST',
    body: params,
  });
}

// 保存装配清单前进行验证
export async function confirmAssembly(params) {
  return request(`${Host}/v1/${tenantId}/mt-bom/confirm/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 查询组件行单行数据
 * @async
 * @function fetchComponentLineRowList
 * @param {object} params - 查询条件
 * @param {!number} params.bomComponentId - 主键
 * @returns {object} fetch Promise
 */
export async function fetchComponentLineRowList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-bom-component/one/ui`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询替代组表数据
 * @async
 * @function fetchSubstituteGroupList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSubstituteGroupList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-bom-substitute-group/list/by/component/ui`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询替代项表数据
 * @async
 * @function fetchSubstituteItemList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSubstituteItemList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-bom-substitute/list/by/group/ui`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询参考点表数据
 * @async
 * @function fetchReferencePointList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchReferencePointList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-bom-reference-point/list/by/component/ui`, {
    method: 'GET',
    query: param,
  });
}
/**
 * 查询站点分配表数据
 * @async
 * @function fetchSiteList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchSiteList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-bom-site-assign/list/by/bom/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询扩展属性表数据
 * @async
 * @function fetchExtendedAttributeList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchExtendedAttributeList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-extend-setting/attr/ui`, {
    method: 'GET',
    query: param,
  });
}

// 查询bom的详情
export async function fetchBomDetail(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-bom/one/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 复制
 * @async
 * @function copyBom
 * @param {object} params - 请求参数
 * @param {!string} params.bomId - 原主键ID
 * @param {!string} params.bomNameNew - 名称
 * @param {!string} params.revisionNew - 版本
 * @param {!string} params.bomTypeNew - 类型
 * @returns {object} fetch Promise
 */
export async function copyBom(params) {
  return request(`${Host}/v1/${tenantId}/mt-bom/copy/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 分配站点站点保存
 * @async
 * @function saveSite
 * @param {object} params - 请求参数
 * @param {!string} params.bomId - 原主键ID
 * @param {!string} params.siteId - 站点主键
 * @param {!string} params.enableFlag - 是否有效
 * @returns {object} fetch Promise
 */
export async function saveSite(params) {
  return request(`${Host}/v1/${tenantId}/mt-bom-site-assign/save/ui`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 扩展字段保存
 * @async
 * @function saveSite
 * @param {object} params - 请求参数
 * @param {!string} params.kid - 主键ID
 * @param {!string} params.tableName - 表名
 * @param {!string} params.attrs - 表格行数据
 * @returns {object} fetch Promise
 */
export async function saveExtendedField(params) {
  return request(`${Host}/v1/${tenantId}/mt-extend-setting/save/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 组件行保存
 * @async
 * @function saveComponentLineRow
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveComponentLineRow(params) {
  return request(`${Host}/v1/${tenantId}/mt-bom-component/save/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 替代项保存
 * @async
 * @function saveSubstituteItem
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveSubstituteItem(params) {
  return request(`${Host}/v1/${tenantId}/mt-bom-substitute/save/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 替代组保存
 * @async
 * @function saveSubstituteGroup
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveSubstituteGroup(params) {
  return request(`${Host}/v1/${tenantId}/mt-bom-substitute-group/save/ui`, {
    method: 'POST',
    body: params,
  });
}
/**
 * 参考点保存
 * @async
 * @function saveReferencePoint
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveReferencePoint(params) {
  return request(`${Host}/v1/${tenantId}/mt-bom-reference-point/save/ui`, {
    method: 'POST',
    body: params,
  });
}
