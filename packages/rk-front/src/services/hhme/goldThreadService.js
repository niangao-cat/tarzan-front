
// 贴片录入
import request from '@/utils/request';
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

// const Host = '/mes-20414';

const tenantId = getCurrentOrganizationId();

// 获取默认工厂
export async function getSiteList(params) {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
    query: params,
  });
}

// 输入工位
export async function enterSite(params) {
  return request(`/mes/v1/${tenantId}/hme-chip-transfer/workcell-scan`, {
    method: 'POST',
    body: params,
  });
}

// 查询设备
export async function getEquipmentList(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/list`, {
    method: 'GET',
    query: params,
  });
}

// 查询物料批
export async function getMaterialList(params) {
    return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/binding/material/query`, {
      method: 'GET',
      query: params,
    });
}

  // 查询设备
export async function checkMaterialCode(params) {
  return request(`${Host}/v1/${tenantId}/hme-chip-transfer/prod-line-verify`, {
    method: 'GET',
    query: params,
  });
}

// 扫描盒子号
export async function scanBox(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-wire_bond/scan/barcode`, {
    method: 'POST',
    body: params,
  });
}

// 查询盒子号
export async function queryBox(params) {
    return request(`${Host}/v1/${tenantId}/hme-cos-wire_bond/no/site/out/query`, {
      method: 'POST',
      body: params,
    });
  }


  // 查询贴片信息
export async function queryBoxNo(params) {
    return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/site/out/query`, {
      method: 'POST',
      body: params,
    });
  }

// 删除选中信息
export async function deleteBox(params) {
    return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/input/box/delete`, {
      method: 'POST',
      body: params,
    });
  }

// 保存出战信息
export async function setOutBox(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-wire_bond/site/out`, {
    method: 'POST',
    body: params,
  });
}

// 新建贴片信息
export async function createBarCode(params) {
    return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/site/out`, {
      method: 'POST',
      body: params,
    });
}

// 查询最大条码数
export async function queryQty(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/chip/qty/query`, {
    method: 'POST',
    body: params,
  });
}


// 出站
export async function setOut(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/site/out/print`, {
    method: 'POST',
    body: params,
  });
}

// 打印
export async function print(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/print`, {
    method: 'POST',
    body: params,
    responseType: 'blob',
  });
}

// 绑定物料批
export async function bindingMaterial(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/binding/workcell`, {
    method: 'POST',
    body: params,
  });
}

// 解绑物料批
export async function unbindingMaterial(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-patch-pda/unbinding/workcell`, {
    method: 'POST',
    body: params,
  });
}

export function fetchDefaultSite () {
  return request(`/mes/v1/${tenantId}/wms-warehouse-locator/site/property`, {
    method: 'GET',
  });
}

export function changeEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/replace`, {
    method: 'POST',
    body: params,
  });
}

export function deleteEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/unbinding`, {
    method: 'DELETE',
    body: params,
  });
}

export function bindingEq(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/binding`, {
    method: 'POST',
    body: params,
  });
}

export function fetchEqInfo(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/${params.eqCode}`, {
    method: 'GET',
    responseType: 'text',
  });
}


export function bindingEqConfirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/binding/confirm`, {
    method: 'POST',
    body: params,
  });
}

export function changeEqConfirm(params) {
  return request(`${Host}/v1/${tenantId}/hme-workcell-equipment-switch/replace/confirm`, {
    method: 'POST',
    body: params,
  });
}

export function deleteBoxData(params) {
  return request(`${Host}/v1/${tenantId}/hme-cos-wire_bond/batch/delete`, {
    method: 'POST',
    body: params,
  });
}
