import { Host } from '@/utils/config';
import { getCurrentOrganizationId } from 'utils/utils';

const organizationId = getCurrentOrganizationId();
// const Host = '/mes-8736';

const headTableDS = {
  selection: false,
  dataKey: 'content',
  autoQuery: true,
  queryFields: [
    { name: 'attachmentCode', type: 'string', label: '工艺文件编码' },
    { name: 'attachmentName', type: 'string', label: '工艺文件名称' },
  ],
  fields: [
    {
      name: 'siteCode',
      type: 'string',
      label: '工厂',
    },
    {
      name: 'attachmentCode',
      type: 'string',
      label: '工艺文件编码',
    },
    {
      name: 'attachmentName',
      type: 'string',
      label: '工艺文件名称',
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
    {
      name: 'startDate',
      type: 'string',
      label: '生效时间',
    },
    {
      name: 'endDate',
      type: 'string',
      label: '失效时间',
    },
    {
      name: 'creationDate',
      type: 'string',
      label: '创建时间',
    },
    {
      name: 'lastUpdatedByName',
      type: 'string',
      label: '最后更新人',
    },
    {
      name: 'lastUpdateDate',
      type: 'string',
      label: '更新时间',
    },
  ],
  transport: {
    read: (config) => {
      const { params } = config;
      const url = `${Host}/v1/${organizationId}/hme-operation-ins-heads`;
      return {
        params,
        url,
        method: 'GET',
      };
    },
  },
};

const lineTableDS = {
  selection: false,
  dataKey: 'content',
  fields: [
    {
      name: 'number',
      type: 'string',
      label: '顺序',
    },
    {
      name: 'operationId',
      type: 'object',
      lovCode: 'MT.OPERATION',
      label: '工艺编码',
      lovPara: {
        tenantId: organizationId,
      },
    },
    {
      name: 'operationName',
      type: 'string',
      label: '工艺描述',
    },
    {
      name: 'materialId',
      type: 'string',
      label: '物料编码',
    },
    {
      name: 'materialVersion',
      type: 'object',
      lovCode: 'HME.SITE_MATERIAL',
      label: '物料版本',
      lovPara: {
        tenantId: organizationId,
      },
    },
    {
      name: 'materialCategoryCode',
      type: 'object',
      lovCode: 'WMS.ITEM_GROUP',
      label: '物料类别',
      lovPara: {
        tenantId: organizationId,
      },
    },
    {
      name: 'enableFlag',
      type: 'boolean',
      trueValue: '1',
      falseValue: '0',
      label: '是否启用',
    },
    {
      name: 'creationBy',
      type: 'string',
      label: '创建人',
    },
    {
      name: 'creationDate',
      type: 'string',
      label: '创建时间',
    },
    {
      name: 'lastUpdateBy',
      type: 'string',
      label: '最后更新人',
    },
    {
      name: 'updateDate',
      type: 'string',
      label: '更新时间',
    },
  ],
  transport: {
    read: (config) => {
      const { params } = config;
      const url = `${Host}/v1/${organizationId}/hme-operation-ins-heads`;
      return {
        params,
        url,
        method: 'GET',
      };
    },
  },
};

const formDS = {
  // autoQuery: true,
  fields: [
    {
      name: 'siteName',
      type: 'string',
      label: '站点',
    },
    {
      name: 'siteId',
      type: 'string',
    },
    {
      name: 'attachmentCode',
      type: 'string',
      label: '工艺文件编码',
    },
    {
      name: 'attachmentName',
      type: 'string',
      label: '工艺文件名称',
    },
    {
      name: 'startDate',
      type: 'date',
      label: '生效时间从',
    },
    {
      name: 'endDate',
      type: 'date',
      label: '生效时间至',
    },
    {
      name: 'remark',
      type: 'string',
      label: '备注',
    },
    {
      name: 'attachmentUuid',
      type: 'string',
      label: '文件上传',
    },
  ],
  transport: {
    read: (config) => {
      const { params } = config;
      const url = `/mes/v1/${organizationId}/wms-warehouse-locator/site/property`;
      return {
        params,
        url,
        method: 'GET',
      };
    },
    create: (config) => {
      const { data, dataSet } = config;
      const {
        queryParameter: { attachmentUuid },
      } = dataSet;
      const url = `${Host}/v1/${organizationId}/hme-operation-ins-heads/save`;
      return {
        data: {
          ...data[0],
          attachmentUuid,
          tenantId: organizationId,
        },
        url,
        method: 'POST',
      };
    },
  },
};

export { headTableDS, lineTableDS, formDS };
