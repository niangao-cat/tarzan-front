/**
 * @Description: IQC检验平台Service层
 * @author: ywj
 * @date 2020/5/15 9:52
 * @version 1.0
 */

// 引入必要的依赖包
import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

// 获取组织Id
const organizationId = getCurrentOrganizationId();
const prefix = `${Host}/v1`;

// 数据查询
export async function queryBaseData(params) {
  // 转为JSON数据
  const data = filterNullValueObject(parseParameters(params));
  // 调用接口返回数据
  return request(`${prefix}/${organizationId}/queryBaseData`, {
    method: 'GET',
    data,
  });
}
