module.exports = [
  // api转换
  {
    path: '/hmes/acquisition/transformation',
    component: 'acquisition/Transformation',
    models: ['acquisition/transformation'],
  },
  /**
   * 数据项维护
   */
  {
    path: '/hmes/acquisition/data-item',
    models: ['acquisition/dataItem'],
    components: [
      {
        path: '/hmes/acquisition/data-item/list',
        component: 'acquisition/DataItem/DataItemList',
        models: ['acquisition/dataItem'],
      },
      {
        path: '/hmes/acquisition/data-item/dist/:id',
        component: 'acquisition/DataItem/DataItemDist',
        models: ['acquisition/dataItem'],
      },
      // 导入
      {
        path: '/hmes/acquisition/data-item/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 数据手机组维护
  {
    path: '/hmes/acquisition/data-collection',
    models: ['acquisition/collection'],
    components: [
      {
        path: '/hmes/acquisition/data-collection/list',
        component: 'acquisition/Collection/CollectionList',
        models: ['acquisition/collection'],
      },
      {
        path: '/hmes/acquisition/data-collection/dist/:id',
        component: 'acquisition/Collection/CollectionDist',
        models: ['acquisition/collection'],
      },
      // 导入模板
      {
        path: '/hmes/acquisition/data-collection/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 不良代码维护
  {
    path: '/hmes/badcode/defect-code',
    components: [
      {
        path: '/hmes/badcode/defect-code/list',
        component: 'badCode/DefectCode/DefectCodeList',
        models: ['badCode/defectCode'],
      },
      {
        path: '/hmes/badcode/defect-code/dist/:id',
        component: 'badCode/DefectCode/DefectCodeDist',
        models: ['badCode/defectCode'],
      },
    ],
    models: ['badCode/defectCode'],
  },

  // 不良代码组维护
  {
    path: '/hmes/badcode/defect-group',
    components: [
      {
        path: '/hmes/badcode/defect-group/list',
        component: 'badCode/DefectGroup/DefectGroupList',
        models: ['badCode/defectGroup'],
      },
      {
        path: '/hmes/badcode/defect-group/dist/:id',
        component: 'badCode/DefectGroup/DefectGroupDist',
        models: ['badCode/defectGroup'],
      },
    ],
    models: ['badCode/defectGroup'],
  },

  // 班次模板
  {
    path: '/hmes/calendar/schedule',
    component: 'calendar/Schedule',
    models: ['calendar/schedule'],
  },

  // 工作日历
  {
    path: '/hmes/calendar/working',
    models: ['calendar/working'],
    components: [
      {
        path: '/hmes/calendar/working/list',
        component: 'calendar/Working/WorkingList',
        models: ['calendar/working'],
      },
      {
        path: '/hmes/calendar/working/calendar-shift/:id',
        component: 'calendar/Working/WorkingCalendar',
        models: ['calendar/working'],
      },
      {
        path: '/hmes/calendar/working/shift-list',
        component: 'calendar/Working/WorkingShift',
        models: ['calendar/working'],
      },
      {
        path: '/hmes/calendar/working/calendar-organization',
        component: 'calendar/Working/WorkingOrganization',
        models: ['calendar/working'],
      },
    ],
  },

  // 组织所属日历
  {
    path: '/hmes/calendar/organization',
    models: ['calendar/organization'],
    component: 'calendar/Organization',
  },

  // 事件类型维护
  {
    path: '/event/event-type',
    component: 'event/EventType',
    models: ['event/eventType'],
  },

  // 事件请求类型维护
  {
    path: '/event/event-request-type',
    component: 'event/EventRequestType',
    models: ['event/eventRequestType'],
  },

  // 对象类型维护
  {
    path: '/event/object-type',
    component: 'event/ObjectType',
    models: ['event/objectType'],
  },

  // 事件查询
  {
    path: '/event/query',
    component: 'event/EventQuery',
    models: ['event/eventQuery'],
  },


  // 容器类型维护
  {
    path: '/hmes/hagd/container-type',
    models: ['hagd/containerType'],
    components: [
      {
        path: '/hmes/hagd/container-type/list',
        component: 'hagd/Container/ContainerList',
        models: ['hagd/containerType'],
      },
      {
        path: '/hmes/hagd/container-type/type/:id',
        component: 'hagd/Container/ContainerDetail',
        models: ['hagd/containerType'],
      },
    ],
  },

  // 库存查询
  {
    path: '/inventory/query',
    component: 'inventory/Query',
    models: ['inventory/query'],
  },

  // 库存日记账查询
  {
    path: '/inventory/journal/query',
    component: 'inventory/JournalQuery',
    models: ['inventory/journalQuery'],
  },

  // 库存预留日记账
  {
    path: '/inventory/reserve/query',
    component: 'inventory/ReserveQuery',
    models: ['inventory/reserveQuery'],
  },

  // 站点维护
  {
    path: '/organization-modeling/site',
    models: ['org/site'],
    components: [
      {
        path: '/organization-modeling/site/list',
        component: 'org/Site/SiteList',
        models: ['org/site'],
      },
      {
        path: '/organization-modeling/site/dist/:id',
        component: 'org/Site/SiteDist',
        models: ['org/site'],
      },
    ],
  },

  // 区域维护
  {
    path: '/organization-modeling/area',
    models: ['org/area'],
    components: [
      {
        path: '/organization-modeling/area/list',
        component: 'org/Area/AreaList',
        models: ['org/area'],
      },
      {
        path: '/organization-modeling/area/dist/:id',
        component: 'org/Area/AreaDist',
        models: ['org/area'],
      },
    ],
  },

  // 工作单元维护
  {
    path: '/organization-modeling/work-cell',
    models: ['org/workcell'],
    components: [
      {
        path: '/organization-modeling/work-cell/list',
        component: 'org/WorkCell/WorkcellList',
        models: ['org/workcell'],
      },
      {
        path: '/organization-modeling/work-cell/dist/:id',
        component: 'org/WorkCell/WorkcellDist',
        models: ['org/workcell'],
      },
    ],
  },

  // 库位组维护
  {
    path: '/organization-modeling/locator-group',
    component: 'org/LocatorGroup',
    models: ['org/locatorGroup'],
  },

  // 生产线维护
  {
    path: '/organization-modeling/pro-line',
    models: ['org/proline'],
    components: [
      {
        path: '/organization-modeling/pro-line/list',
        component: 'org/ProLine/ProLineList',
        models: ['org/workcell'],
      },
      {
        path: '/organization-modeling/pro-line/dist/:id',
        component: 'org/ProLine/ProLineDist',
        models: ['org/workcell'],
      },
    ],
  },

  // 企业维护
  {
    path: '/organization-modeling/enterprise',
    component: 'org/Enterprise',
    models: ['org/enterprise'],
  },

  // 组织维护
  {
    path: '/organization-modeling/relation-maintenance',
    component: 'org/RelationMaintain',
    models: ['org/relationMaintain', 'org/relationMaintainDrawer'],
  },

  // 库位维护
  {
    path: '/organization-modeling/locator',
    models: ['org/locator'],
    components: [
      {
        path: '/organization-modeling/locator/list',
        component: 'org/Locator/LocatorList',
        models: ['org/locator'],
      },
      {
        path: '/organization-modeling/locator/dist/:id',
        component: 'org/Locator/LocatorDist',
        models: ['org/locator'],
      },
    ],
  },

  // 艺路线维护
  {
    path: '/hmes/process/routes',
    models: ['process/routes'],
    components: [
      {
        path: '/hmes/process/routes/list',
        component: 'process/routesManager/RoutesList',
        models: ['process/routes'],
      },
      {
        path: '/hmes/process/routes/dist/:id',
        component: 'process/routesManager/RoutesDist',
        models: ['process/routes'],
      },
      // 导入模板
      {
        path: '/hmes/process/routes/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 子步骤维护
  {
    path: '/hmes/process/child-steps',
    component: 'process/childSteps',
    models: ['process/childSteps'],
  },

  // 工艺路线图形优化
  {
    path: '/hmes/process/flow',
    component: 'process/Flow',
    models: ['process/flow'],
  },

  // 工艺维护
  {
    path: '/hmes/process/technology',
    components: [
      {
        path: '/hmes/process/technology/list',
        component: 'process/Technology/TechnologyList',
        models: ['process/technology'],
      },
      {
        path: '/hmes/process/technology/dist/:id',
        component: 'process/Technology/TechnologyDist',
        models: ['process/technology'],
      },
    ],
    models: ['process/technology'],
  },

  // 工艺与工作单元维护
  {
    path: '/hmes/process/unit-work',
    component: 'process/UnitWork',
    models: ['process/unitWork'],
  },

  // 装配清单维护
  {
    path: '/product/assembly-list',
    models: ['product/assemblyList'],
    components: [
      {
        path: '/product/assembly-list/list',
        component: 'product/Assembly/AssemblyList',
        models: ['product/assemblyList'],
      },
      {
        path: '/product/assembly-list/dist/:id',
        component: 'product/Assembly/AssemblyDist',
        models: ['product/assemblyList'],
      },
    ],
  },

  {
    path: '/pub/assembly-list',
    component: 'product/AssemblyList',
    models: ['product/assemblyList'],
    key: '/pub/assembly-list',
    title: '帮助手册',
    authorized: true,
  },

  // 物料维护
  {
    path: '/product/material-manager',
    models: ['product/materialManager'],
    components: [
      {
        path: '/product/material-manager/list',
        component: 'product/Material/MaterialList',
        models: ['product/materialManager'],
      },
      {
        path: '/product/material-manager/dist/:id',
        component: 'product/Material/MaterialDist',
        models: ['product/materialManager'],
      },
    ],
  },

  // 单位维护
  {
    path: '/product/uom',
    component: 'product/Uom',
    models: ['product/uom'],
  },

  // 物料类别集维护
  {
    path: '/product/material-category-set',
    component: 'product/MaterialCategorySet',
    models: ['product/materialCategorySet'],
  },

  // 物料类别维护
  {
    path: '/product/material-category',
    component: 'product/MaterialCategory',
    models: ['product/materialCategory'],
  },

  // 物料生产属性维护
  {
    path: '/product/produce',
    models: ['product/produce'],
    components: [
      {
        path: '/product/produce/list',
        component: 'product/Produce/ProduceList',
        models: ['product/produce'],
      },
      {
        path: '/product/produce/dist/:type/:id',
        component: 'product/Produce/ProduceDist',
        models: ['product/produce'],
      },
    ],
  },

  // 物料存储属性维护
  {
    path: '/product/pfep-inventory',
    models: ['product/pfepInventory'],
    components: [
      {
        path: '/product/pfep-inventory/list',
        component: 'product/PfepInventory/PfepInventoryList',
        models: ['product/pfepInventory'],
      },
      {
        path: '/product/pfep-inventory/dist/:type/:id',
        component: 'product/PfepInventory/PfepInventoryDist',
        models: ['product/pfepInventory'],
      },
      {
        path: '/hmes/mes/number-range',
        models: ['hmes/numberRange'],
        components: [
          {
            path: '/hmes/mes/number-range/list',
            component: 'hmes/NumberRange/NumberRangeList',
            models: ['hmes/numberRange'],
          },
          {
            path: '/hmes/mes/number-range/dist/:id',
            component: 'hmes/NumberRange/NumberRangeDist',
            models: ['hmes/numberRange'],
          },
        ],
      },
    ],
  },

  // 生产指令维护
  {
    path: '/hmes/workshop/production-order-mgt',
    models: ['workshop/productionOrderMgt'],
    components: [
      {
        path: '/hmes/workshop/production-order-mgt/list',
        component: 'workshop/ProductionOrderMgt/ProductionOrderMgtList',
        models: ['workshop/productionOrderMgt'],
      },
      {
        path: '/hmes/workshop/production-order-mgt/detail/:id',
        components: [
          {
            path: '/hmes/workshop/production-order-mgt/detail/:id',
            component: 'workshop/ProductionOrderMgt/ProductionOrderMgtDetail',
            models: ['workshop/productionOrderMgt'],
          },
          {
            path: '/hmes/workshop/production-order-mgt/execute-operation-management/detail/:id/:workOrderId',
            component: 'workshop/ProductionOrderMgt/ProductionOrderMgtDetail/ExecuteDetail',
            models: ['workshop/execute/execute'],
          },
        ],

      },
    ],
  },

  // 执行作业管理
  {
    path: '/hmes/workshop/execute-operation-management',
    models: ['workshop/execute'],
    components: [
      {
        path: '/hmes/workshop/execute-operation-management/list',
        component: 'workshop/Execute/ExecuteList',
        models: ['workshop/execute'],
      },
      {
        path: '/hmes/workshop/execute-operation-management/detail/:id',
        component: 'workshop/Execute/ExecuteDetail',
        models: ['workshop/execute'],
      },
      // 导入
      {
        path: '/hmes/workshop/execute-operation-management/data-import/:code',
        component: 'himp/CommentImport',
      },
    ],
  },

  // 调度平台
  {
    path: '/hmes/workshop/dispatch-platform',
    models: ['workshop/dispatchPlatform'],
    component: 'workshop/DispatchPlatform',
  },

  // 业务类型与移动类型关系维护
  {
    path: '/hmes/business-type',
    models: ['hmes/businessType'],
    component: 'hmes/BusinessType',
  },

  // 编码对象维护
  {
    path: '/mes/coding-object',
    component: 'hmes/CodingObject',
    models: ['hmes/codingObject', 'hmes/generalType'],
  },

  // 消息维护
  {
    path: '/mes/mt_error_message',
    component: 'hmes/ErrorMessage',
    models: ['hmes/errorMessage'],
  },

  // 扩展字段维护
  {
    path: '/mes/extend-field',
    component: 'hmes/ExtendField',
    models: ['hmes/extendField'],
  },

  // 扩展表维护
  {
    path: '/mes/extend-table',
    component: 'hmes/ExtendTable',
    models: ['hmes/extendTable'],
  },

  // 状态维护
  {
    path: '/mes/general-status',
    component: 'hmes/GeneralStatus',
    models: ['hmes/generalStatus'],
  },

  // 类型维护
  {
    path: '/mes/general-type',
    component: 'hmes/GeneralType',
    models: ['hmes/generalType'],
  },

  // 号码段分配
  {
    path: '/mes/number-range-distribution',
    component: 'hmes/NumberRangeDistribution',
    models: ['hmes/numberRangeDistribution'],
  },

  // 站点切换
  {
    path: '/hmes/mes/site-switch',
    component: 'hmes/SiteSwitch',
    models: ['hmes/siteSwitch'],
  },

  // 用户权限维护s
  {
    path: '/mes/user-rights',
    component: 'hmes/UserRights',
    models: ['hmes/userRights'],
  },

  // 物流器具创建
  {
    path: '/hwms/appliance',
    models: ['hwms/applianceCreation'],
    components: [
      // 查询列表
      {
        path: '/hwms/appliance/list',
        models: ['hwms/applianceCreation'],
        component: 'hwms/Appliance',
      },
      // 物流器具历史
      {
        path: '/hwms/appliance/history-list',
        models: ['hwms/applianceCreation'],
        component: 'hwms/Appliance/ApplianceCreationHistory',
      },
      // 导入物流器具
      {
        authorized: true,
        path: '/hwms/appliance/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 配送基础数据维护
  {
    path: '/hwms/basic-data-maintain',
    models: ['hwms/basicDataMaintain'],
    components: [
      {
        path: '/hwms/basic-data-maintain/query',
        component: 'hwms/BasicDataMaintain',
        models: ['hwms/basicDataMaintain'],
      },
      // 导入
      {
        authorized: true,
        path: '/hwms/basic-data-maintain/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 盘装料退料
  {
    path: '/hwms/charging-return',
    component: 'hwms/ChargingReturning',
    models: ['hwms/chargingReturning'],
  },

  // 呆滞物料报表
  {
    path: '/hwms/dull-material-report',
    models: ['hwms/dullMaterialReport'],
    components: [
      {
        path: '/hwms/dull-material-report/query',
        component: 'hwms/DullMaterialReport',
        models: ['hwms/dullMaterialReport'],
      },
      {
        path: '/hwms/dull-material-report/import',
        component: 'hwms/DullMaterialReport/Import',
        models: ['hwms/dullMaterialReport'],
      },
    ],
  },

  // 货柜检查表维护
  {
    path: '/hwms/inspection-maintain',
    component: 'hwms/InspectionMaintain',
    models: ['hwms/inspectionMaintain'],
  },

  // 机台基础数据维护
  {
    path: '/hwms/machine-basic',
    models: ['hwms/machineBasic'],
    components: [
      {
        path: '/hwms/machine-basic/query',
        component: 'hwms/MachineBasic',
        models: ['hwms/machineBasic'],
      },
      // 导入
      {
        authorized: true,
        path: '/hwms/machine-basic/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
      // 历史记录
      {
        path: '/hwms/machine-basic/history/:id',
        component: 'hwms/MachineBasic/MachineHistory',
        models: ['hwms/machineBasic'],
      },
    ],
  },

  // 料站表基础数据维护
  {
    path: '/hwms/material-station',
    models: ['hwms/materialStation'],
    components: [
      {
        path: '/hwms/material-station/query',
        component: 'hwms/MaterialStation',
        models: ['hwms/materialStation'],
      },
      // 导入
      {
        authorized: true,
        path: '/hwms/material-station/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
      // 明细
      {
        path: '/hwms/material-station/detail',
        component: 'hwms/MaterialStation/Detail',
        models: ['hwms/materialStation'],
      },
    ],
  },

  // 采购退货单查询
  {
    path: '/hwms/purchase-return',
    models: ['hwms/purchaseReturn'],
    components: [
      {
        path: '/hwms/purchase-return/query',
        component: 'hwms/PurchaseReturn',
        models: ['hwms/purchaseReturn'],
      },
    ],
  },

  // 销售退货单查询
  {
    path: '/hwms/sales-return-doc/query',
    component: 'hwms/SalesReturnDoc',
    models: ['hwms/salesReturnDocQuery'],
  },

  // 待报废报表
  {
    path: '/hwms/scrap-report',
    models: ['hwms/scrapReport'],
    components: [
      {
        path: '/hwms/scrap-report/query',
        component: 'hwms/ScrapReport',
        models: ['hwms/scrapReport'],
      },
    ],
  },

  // 出货单查询
  {
    path: '/hwms/so-delivery',
    models: ['hwms/soDeliveryQuery'],
    components: [
      {
        path: '/hwms/so-delivery/query',
        component: 'hwms/SoDeliveryQuery',
        models: ['hwms/soDeliveryQuery'],
      },
    ],
  },

  // 锡膏/红胶管理
  {
    path: '/hwms/solder-glue',
    models: ['hwms/solderGlueManage'],
    components: [
      {
        path: '/hwms/solder-glue/query',
        component: 'hwms/SolderGlueManage',
        models: ['hwms/solderGlueManage'],
      },
    ],
  },

  // 事务类型维护
  {
    path: '/hwms/transaction-type',
    models: ['hwms/transactionType'],
    components: [
      {
        path: '/hwms/transaction-type/query',
        component: 'hwms/TransactionType',
        models: ['hwms/transactionType'],
      },
    ],
  },

  // 工单发料平台
  {
    path: '/hwms/wo-platform',
    models: ['hwms/woPlatform'],
    components: [
      {
        path: '/hwms/wo-platform/query',
        component: 'hwms/WoPlatform',
        models: ['hwms/woPlatform'],
      },
    ],
  },
];
