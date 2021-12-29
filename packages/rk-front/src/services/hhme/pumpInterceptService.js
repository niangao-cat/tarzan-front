import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId, parseParameters } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-intercept-informations/query-Intercept-information`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveCurrentData(params) {
  return request(`${Host}/v1/${tenantId}/hme-intercept-informations/save-intercept-information`, {
    method: 'POST',
    body: params,
  });
}

export async function fetchDetailList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-intercept-informations/query-popup-window`, {
    method: 'GET',
    query: newParams,
  });
}

export async function fetchObjectList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-intercept-objects/query-intercept-object`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveObjectList(params) {
  return request(`${Host}/v1/${tenantId}/hme-intercept-objects/save-intercept-object`, {
    method: 'POST',
    body: params.list,
    query: { interceptId: params.interceptId },
  });
}

export async function passObjectList(params) {
  return request(`${Host}/v1/${tenantId}/hme-intercept-objects/pass-intercept-object`, {
    method: 'POST',
    body: params.list,
    query: { interceptId: params.interceptId },
  });
}

export async function fetchProcessList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-intercept-workcells/query-Intercept-workcell`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveProcessList(params) {
  return request(`${Host}/v1/${tenantId}/hme-intercept-workcells/save-intercept-workcell`, {
    method: 'POST',
    body: params.list,
    query: { interceptId: params.interceptId },
  });
}

export async function passProcessList(params) {
  return request(`${Host}/v1/${tenantId}/hme-intercept-workcells/pass-intercept-workcell`, {
    method: 'POST',
    body: params.list,
    query: { interceptId: params.interceptId },
  });
}

export async function fetchSnList(params) {
  const newParams = parseParameters(params);
  return request(`${Host}/v1/${tenantId}/hme-intercept-releases/query-intercept-release`, {
    method: 'GET',
    query: newParams,
  });
}

export async function saveSnList(params) {
  return request(`${Host}/v1/${tenantId}/hme-intercept-releases/save-intercept-release`, {
    method: 'POST',
    body: params.list,
    query: { interceptId: params.interceptId },
  });
}