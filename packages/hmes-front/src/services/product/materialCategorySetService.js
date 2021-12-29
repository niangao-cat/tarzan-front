import request from '@/utils/request';
import { Host } from '@/utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询物料类别集数据
 * @async
 * @function fetchMaterialCategorySetList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchMaterialCategorySetList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-material-category-set/list/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 物料类别集保存
 * @async
 * @function saveMaterialCategorySet
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveMaterialCategorySet(params) {
  return request(`${Host}/v1/${tenantId}/mt-material-category-set/save/ui`, {
    method: 'POST',
    body: params,
  });
}
