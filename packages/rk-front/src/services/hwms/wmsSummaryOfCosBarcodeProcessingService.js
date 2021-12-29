/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： COS条码加工汇总表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { ReportHost } from '@/utils/config';

const prefix = `${ReportHost}/v1`;
// const prefix = '/mes-19563/v1';
const organizationId = getCurrentOrganizationId();

/**
 *  查询报表数据
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDataList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/wms-summary-of-cos-barcode-processing-repository/list`, {
    method: 'GET',
    query,
  });
}
