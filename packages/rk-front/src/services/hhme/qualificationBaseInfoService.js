/*
 * @Description: 资质基础信息维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-15 09:42:18
 */
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-24520';

// 获取资质数据
export async function fetchQualificationList(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${Host}/v1/${organizationId}/hme-qualifications`, {
    method: 'GET',
    query,
  });
}

// 保存数据
export async function saveData(params) {
  return request(`${Host}/v1/${organizationId}/hme-qualifications/createOrUpdate`, {
    method: 'POST',
    body: params.arr,
  });
}