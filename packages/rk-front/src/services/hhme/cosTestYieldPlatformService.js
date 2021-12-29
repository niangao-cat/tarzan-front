import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-cos-test-monitor-headers/query-cos-monitor-header`, {
    method: 'GET',
    query: newParams,
  });
}

export async function waferPass(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-test-monitor-headers/pass-cos-monitor-header`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchHistoryList(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-test-monitor-records/query-cos-monitor-record`, {
    method: 'GET',
    query: params,
  });
}

export async function fetchLineList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-cos-test-monitor-lines/query-monitor-line`, {
    method: 'GET',
    query: newParams,
  });
}

export async function addLineList(params) {
  const { list, ...otherParams } = params;
  return request(`${Host}/v1/${tenantId}/hme-cos-test-monitor-lines/save-cos-monitor-line`, {
    method: 'POST',
    body: list,
    query: otherParams,
  });
}

export async function passLine(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-test-monitor-lines/pass-cos-monitor-line`, {
    method: 'POST',
    body: params.list,
    query: {
      cosMonitorHeaderId: params.cosMonitorHeaderId,
    },
  });
}
