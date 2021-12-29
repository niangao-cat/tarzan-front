/*
 * @Description: sn替换
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-04 10:21:47
 * @LastEditTime: 2020-11-04 17:29:30
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();
const prefix = `${Host}`;

export async function snReplace(params) {
  return request(`${prefix}/v1/${tenantId}/hme-sn-replace/sn-replace`, {
    method: 'POST',
    body: params,
  });
}