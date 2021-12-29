/**
 * @feature: VMI采购计划 - DataSet层
 * @author: iXiaoChuan <jianchuan.zhang@hand-china.com>
 * @time: 2020/2/28 2:59 下午
 * @version: 1.0.0
 * @copyright Copyright (c) 2020, Hand
 */
import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

/**
 * 请求前缀
 * 组织id
 * 用户id
 */
const prefixMCS = `${Host}/v1`;
const organizationId = getCurrentOrganizationId();

export { listDS, queryModalDS, adjustModalDS, batchAdjustModalDS };

/**
 * VMI采购计划平台 - 列表DS
 */
const listDS = () => ({
  autoQuery: false,
  autoCreate: false,
  modifiedCheck: true,
  autoLocateFirst: false,
  paging: false,
  dataToJSON: 'all',
  transport: {
    read: ({ data, params }) => {
      const { size, otherParams } = data;
      const { page } = params;
      return {
        url: `${prefixMCS}/${organizationId}/vmi-pos/query`,
        method: 'POST',
        data: {
          ...otherParams,
        },
        params: {
          size,
          page,
        },
      };
    },
  },
  fields: [
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'supplierName',
      type: 'string',
      label: '供应商',
    },
    {
      name: 'ratioQuery',
      type: 'string',
      label: '理论/实际配比',
    },
    {
      name: 'onhandQty',
      type: 'string',
      label: '库存现有量',
    },
    {
      name: 'demandRatioQty',
      type: 'string',
      label: '备货需求',
    },
    {
      name: 'qtyType',
      type: 'string',
      label: '类型',
    },
  ],
});

/**
 * VMI采购计划平台 - 查询弹框DS
 */
const queryModalDS = () => ({
  autoQuery: false,
  modifiedCheck: true,
  paging: false,
  dataToJSON: 'all',
  fields: [
    {
      name: 'site',
      type: 'object',
      label: '工厂',
      lovCode: 'MT.SITE',
      ignore: 'always',
      lovPara: { tenantId: organizationId },
    },
    {
      name: 'siteId',
      type: 'string',
      bind: 'site.siteId',
    },
    {
      name: 'productLine',
      type: 'object',
      label: '产线',
      lovCode: 'Z.PRODLINE',
      ignore: 'always',
      lovPara: { tenantId: organizationId },
    },
    {
      name: 'productLineId',
      type: 'string',
      bind: 'productLine.productLineId',
    },
    {
      name: 'material',
      type: 'object',
      label: '组件物料',
      ignore: 'always',
      lovCode: 'MT.MATERIAL',
    },
    {
      name: 'materialId',
      type: 'string',
      bind: 'material.materialId',
    },
    {
      name: 'materialCode',
      type: 'string',
      bind: 'material.materialCode',
    },
    {
      name: 'a',
      type: 'string',
      label: '主键物料',
    },
    {
      name: 'locator',
      type: 'object',
      label: '仓库',
      ignore: 'always',
      lovCode: 'WMS.WAREHOUSE',
    },
    {
      name: 'locatorCode',
      type: 'string',
      bind: 'locator.locatorCode',
      label: '仓库',
    },
    {
      name: 'psbc',
      type: 'string',
      label: '配送班次',
    },
    {
      name: 'line',
      type: 'object',
      label: '工段',
      lovCode: 'HME.WORKCELL',
    },
    {
      name: 'lineId',
      type: 'string',
      bind: 'line.lineId',
    },
    {
      name: 'distributionType',
      type: 'string',
      label: '配送策略',
    },
    {
      name: 'xpssj',
      type: 'string',
      label: '需配送数据',
    },
  ],
});

/**
 * VMI采购计划平台 - 调整弹框DS
 */
const adjustModalDS = () => ({
  autoQuery: false,
  pageSize: 20,
  paging: true,
  dataToJSON: 'dirty',
  transport: {
    read: ({ data, params }) => {
      const { record } = data;
      return {
        url: `${prefixMCS}/${organizationId}/vmi-pos/adjust-query`,
        method: 'POST',
        data: {
          ...record,
        },
        params: {
          ...params,
        },
      };
    },
    submit: () => {
      return {
        url: `${prefixMCS}/${organizationId}/vmi-pos/adjust-save`,
        method: 'POST',
      };
    },
  },
  // TODO: 多语言未配置,上线前请配置完毕
  fields: [
    {
      name: 'demandNumber',
      type: 'string',
      label: '需求单号',
    },
    {
      name: 'itemCode',
      type: 'string',
      label: '物料',
    },
    {
      name: 'itemDesc',
      type: 'string',
      label: '物料描述',
    },
    {
      name: 'contractNum',
      type: 'string',
      label: '合同号',
    },
    {
      name: 'planNumSeq',
      type: 'string',
      label: '计划项',
    },
    {
      name: 'receiveDate',
      type: 'string',
      label: '最晚到货日期',
    },
    {
      name: 'qty',
      type: 'string',
      label: '数量',
    },
    {
      name: 'supplier',
      type: 'object',
      ignore: 'always',
      label: '供应商',
      textField: 'supplierCode',
      valueField: 'supplierId',
      lovCode: 'HMCS.VMI_ITEM_SUPPLIER',
      cascadeMap: {
        plantId: 'plantId',
        itemId: 'itemId',
      },
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplier.supplierId',
    },
    {
      name: 'supplierCode',
      type: 'string',
      bind: 'supplier.supplierCode',
    },
    {
      name: 'supplierName',
      type: 'string',
      bind: 'supplier.supplierName',
      label: '供应商名称',
    },
    {
      name: 'inspectionFlag',
      type: 'boolean',
      label: '军检',
    },
    {
      name: 'specialFlag',
      type: 'boolean',
      label: '特殊车型指定',
    },
    {
      name: 'trialFlag',
      type: 'boolean',
      label: '试制跟单',
    },
    {
      name: 'suitName',
      type: 'string',
      label: '成套组合',
    },
    {
      name: 'editorFlag',
      type: 'string',
      lookupCode: 'SYS.YES_NO',
      label: '手工调整',
    },
    {
      name: 'demandApprovalStatusMeaning',
      type: 'string',
      label: '审批状态',
    },
    {
      name: 'approvalDate',
      type: 'string',
      label: '审批时间',
    },
    {
      name: 'approvalRemark',
      type: 'string',
      label: '审批备注',
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
  ],
});

/**
 * VMI采购计划平台 - 调整弹框DS
 */
const batchAdjustModalDS = (itemId, plantId) => ({
  autoCreate: true,
  fields: [
    {
      name: 'supplier',
      type: 'object',
      ignore: 'always',
      label: '供应商',
      textField: 'supplierName',
      valueField: 'supplierId',
      lovCode: 'HMCS.VMI_ITEM_SUPPLIER',
      lovPara: { itemId, plantId },
      required: true,
    },
    {
      name: 'supplierId',
      type: 'string',
      bind: 'supplier.supplierId',
    },
    {
      name: 'supplierCode',
      type: 'string',
      bind: 'supplier.supplierCode',
    },
    {
      name: 'supplierName',
      type: 'string',
      bind: 'supplier.supplierName',
    },
  ],
});
