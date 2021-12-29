/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 芯片性能表
 */

import request from 'utils/request';
import { getCurrentOrganizationId, parseParameters, filterNullValueObject } from 'utils/utils';
import { Host } from '@/utils/config';

const prefix = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

/**
 *  查询头信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryHeadData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosrule/query`, {
    method: 'GET',
    query,
  });
}

/**
 *  保存头信息
 * @param params
 * @returns {Promise<void>}
 */
export async function saveHeadData(params) {
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosrule/addandupdate`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  删除头信息
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteHeadData(params) {
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosRule/delete`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  查询行信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosrulelogic/query`, {
    method: 'GET',
    query,
  });
}

/**
 *  保存行信息
 * @param params
 * @returns {Promise<void>}
 */
export async function saveLineData(params) {
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosrulelogic/addandupdate`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  删除行信息
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteLineData(params) {
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosruleLogic/delete`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  查询次级行信息
 * @param params
 * @returns {Promise<void>}
 */
export async function queryLineSecData(params) {
  const query = filterNullValueObject(parseParameters(params));
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosruletype/query`, {
    method: 'GET',
    query,
  });
}

/**
 *  保存次级行信息
 * @param params
 * @returns {Promise<void>}
 */
export async function saveLineSecData(params) {
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosrulerype/addandupdate`, {
    method: 'POST',
    body: params,
  });
}

/**
 *  删除次级行信息
 * @param params
 * @returns {Promise<void>}
 */
export async function deleteLineSecData(params) {
  return request(`${prefix}/${organizationId}/hme-cos-rule-heads/cosruletype/delete`, {
    method: 'POST',
    body: params,
  });
}
