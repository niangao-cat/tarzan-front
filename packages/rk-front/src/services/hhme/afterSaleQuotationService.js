import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const tenantId = getCurrentOrganizationId();

export async function fetchSnInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-after-sale-quotation-headers/scan-sn/${params}`, {
    method: 'GET',
  });
}

export async function create(params) {
  return request(`${Host}/v1/${tenantId}/hme-after-sale-quotation-headers/create-query/${params}`, {
    method: 'GET',
  });
}

export async function fetchSendDate(params) {
  return request(`${Host}/v1/${tenantId}/hme-after-sale-quotation-headers/send-date-query`, {
    method: 'GET',
    query: params,
    responseType: 'text',
  });
}

export async function cancel(params) {
  return request(`${Host}/v1/${tenantId}/hme-after-sale-quotation-headers/cancel`, {
    method: 'POST',
    body: params,
  });
}

export async function revise(params) {
  return request(`${Host}/v1/${tenantId}/hme-after-sale-quotation-headers/edit`, {
    method: 'POST',
    body: params,
  });
}

export async function save(params) {
  return request(`${Host}/v1/${tenantId}/hme-after-sale-quotation-headers/save`, {
    method: 'POST',
    body: params,
  });
}

export async function submit(params) {
  return request(`${Host}/v1/${tenantId}/hme-after-sale-quotation-headers/submit`, {
    method: 'POST',
    body: params,
  });
}

export function fetchDefaultSite() {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}