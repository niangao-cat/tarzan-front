/**
 * @description 条码库存现有量查询
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/13
 * @time 11:17
 * @version 0.0.1
 * @return
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';


// const Host = '/mes-29730';
// const prefix = '/mes-29730';

const tenantId = getCurrentOrganizationId();

// 查询头数据
export async function fetchList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/barcode-inventory-on-hand-query/list`, {
    method: 'GET',
    query,
  });
}


// 明细查询
export async function fetchDetailList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${tenantId}/barcode-inventory-on-hand-query/listDetail`, {
    method: 'GET',
    query,
  });
}
