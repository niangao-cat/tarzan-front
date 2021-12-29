import request from '@/utils/request';
import { Host } from '@/utils/config';
import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询区域表格数据
 * @async
 * @function fetchAreaList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchAreaList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-area/limit-property/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 查询区域详细数据
 * @async
 * @function fetchAreaDetailedInfo
 * @param {object} params - 查询条件
 * @returns {object} fetch Promise
 */
export async function fetchAreaDetailedInfo(params) {
  // const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-mod-area/property/ui`, {
    method: 'GET',
    query: params,
  });
}

/**
 * 区域保存
 * @async
 * @function saveArea
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveArea(params) {
  return request(`${HZERO_PLATFORM}/v1/mt-bom-reference-point/${tenantId}/save/ui}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 扩展字段保存
 * @async
 * @function saveAttribute
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAttribute(params) {
  return request(`${HZERO_PLATFORM}/v1/mt-bom-reference-point/${tenantId}/save/ui}`, {
    method: 'POST',
    body: params,
  });
}

/**
 * 基础排程算法
 * @async
 * @function fetchColumnType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchBasicAlgorithm() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=MODELING&typeGroup=BASIC_ALGORITHM`,
    {
      method: 'GET',
    }
  );
}

/**
 * 选线规则
 * @async
 * @function fetchColumnType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchProdLineRule() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=MODELING&typeGroup=PROD_LINE_RULE`,
    {
      method: 'GET',
    }
  );
}

/**
 * 区间类型
 * @async
 * @function fetchColumnType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchPlanningPhaseTime() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=MODELING&typeGroup=PLANNING_PHASE_TIME`,
    {
      method: 'GET',
    }
  );
}

/**
 * 排程类型
 * @async
 * @function fetchColumnType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchPlanningBase() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=MODELING&typeGroup=PLANNING_BASE`,
    {
      method: 'GET',
    }
  );
}
/**
 * 关联下达策略
 * @async
 * @function fetchColumnType
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function fetchReleaseConcurrentRule() {
  return request(
    `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=MODELING&typeGroup=RELEASE_CONCURRENT_RULE`,
    {
      method: 'GET',
    }
  );
}

/**
 * 区域保存
 * @async
 * @function saveAreaDetailedInfo
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveAreaDetailedInfo(params) {
  return request(`${Host}/v1/${tenantId}/mt-mod-area/save/ui`, {
    method: 'POST',
    body: params,
  });
}
