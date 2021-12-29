import request from '@/utils/request';
import { Host } from '@/utils/config';
// import { HZERO_PLATFORM } from 'utils/config';
import { parseParameters, getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

/**
 * 查询扩展字段数据
 * @async
 * @function fetchExtendFieldList
 * @param {object} params - 查询条件
 * @param {!number} [params.page = 0] - 数据页码
 * @param {!number} [params.size = 10] - 分页大小
 * @returns {object} fetch Promise
 */
export async function fetchExtendFieldList(params) {
  const param = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/mt-extend-setting/limit-table/ui`, {
    method: 'GET',
    query: param,
  });
}

/**
 * 扩展字段保存
 * @async
 * @function saveExtendField
 * @param {object} params - 请求参数
 * @returns {object} fetch Promise
 */
export async function saveExtendField(params) {
  return request(`${Host}/v1//${tenantId}/mt-extend-setting/save/property/ui`, {
    method: 'POST',
    body: params,
  });
}

// /**
//  * 获取服务包类型
//  * @async
//  * @function fetchColumnType
//  * @param {object} params - 查询条件
//  * @returns {object} fetch Promise
//  */
// export async function fetchServicePackage() {
//   return request(
//     `${Host}/v1/${tenantId}/mt-gen-type/combo-box/ui?module=GENERAL&typeGroup=SERVICE_PACKAGE`,
//     {
//       method: 'GET',
//     }
//   );
// }
