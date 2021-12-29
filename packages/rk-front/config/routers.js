module.exports = [
  // 异常收集组维护
  {
    path: '/hmes/abnormal-collection',
    components: [
      {
        path: "/hmes/abnormal-collection/list",
        component: "hhme/AbnormalCollection/List",
        models: ['hhme/abnormalCollection'],
      },
      {
        path: "/hmes/abnormal-collection/detail/:id",
        component: "hhme/AbnormalCollection/Detail",
        models: ['hhme/abnormalCollection'],
      },
    ],
  },

  {
    path: '/hhme/incoming-import/:code',
    component: 'himp/CommentImport',
    authorized: true,
  },
  //异常信息维护
  {
    path: '/hmes/abnormal-info',
    models: ['hhme/abnormalInfo'],
    component: 'hhme/AbnormalInfo',
  },

  // 物料转移
  {
    path: '/hhme/material-transfer',
    models: ['hhme/materialTransfer'],
    component: 'hhme/MaterialTransfer',
  },

  // 物料转移-增强版
  {
    path: '/hhme/material-transfer-plus',
    models: ['hhme/materialTransfer'],
    component: 'hhme/MaterialTransferPlus',
  },

  // 工序在制查询
  {
    path: '/hhme/process-in-process',
    models: ['hhme/processInProcess'],
    component: 'hhme/ProcessInProcess',
  },

  // 产品溯源查询
  {
    path: '/hhme/product-traceability',
    component: 'hhme/ProductTraceability',
    models: ['hhme/productTraceability'],
  },

  // 工单管理平台
  {
    path: '/hhme/ticket-management',
    components: [
      {
        path: "/hhme/ticket-management/list",
        models: ['hhme/ticketManagement', 'hhme/workshop/productionOrderMgt'],
        component: 'hhme/TicketManagement',
      },
      {
        path: "/hhme/ticket-management/production-order-mgt/detail/:id",
        components: [
          {
            path: "/hhme/ticket-management/production-order-mgt/detail/:id",
            component: "hhme/TicketManagement/ProductionOrderMgtDetail",
            models: ['hhme/workshop/productionOrderMgt'],
          },
          {
            path: "/hhme/ticket-management/production-order-mgt/execute-detail/:id/:workOrderId",
            component: "hhme/TicketManagement/ProductionOrderMgtDetail/ExecuteDetail",
            models: ['hhme/execute/execute'],
          },
        ],
      },
      {
        path: "/hhme/ticket-management/assembly-dist/detail/:id",
        component: "hhme/TicketManagement/AssemblyDist",
        models: ['hhme/product/assemblyList'],
      },
      {
        path: "/hhme/ticket-management/routes/detail/:id",
        component: "hhme/TicketManagement/RoutesDist",
        models: ['hhme/process/routes'],
      },
    ],
  },

  // 工单派工平台
  {
    path: '/hmes/work-order',
    component: 'hhme/WorkOrder',
    models: ['hhme/workOrder'],
  },


  // 工序作业平台
  {
    path: '/hhme/operation-platform',
    component: 'hhme/OperationPlatform',
    models: ['hhme/operationPlatform'],
  },

  // 单件工序作业平台
  {
    path: '/hhme/single-operation-platform',
    component: 'hhme/OperationPlatform/Single',
    models: ['hhme/singleOperationPlatform'],
  },

  // 批量工序作业平台
  {
    path: '/hhme/lot-operation-platform',
    component: 'hhme/OperationPlatform/Lot',
    models: ['hhme/lotOperationPlatform'],
  },

  // 已收待验看板
  {
    path: '/hqms/accepted-tested-board',
    models: ['hqms/acceptedTestedBoard'],
    component: 'hqms/AcceptedTestedBoard',
  },

  // IQC免检设置
  {
    path: '/hqms/iqc-inspection-free',
    models: ['hqms/iqcInspectionFree'],
    component: 'hqms/IQCInspectionFree',
  },

  // IQC检验看板
  {
    path: '/public/hqms/iqc-tested-board',
    key: '/public/hqms/iqc-tested-board',
    models: ['hqms/iqcTestedBoard'],
    component: 'hqms/IQCTestedBoard',
    authorized: true,
  },

  // 样本量字码维护
  {
    path: '/hqms/sample-code',
    models: ['hqms/sampleCode'],
    component: 'hqms/SampleCode',
  },

  // 抽样方案定义
  {
    path: '/hqms/sampling-plan-definition',
    models: ['hqms/samplingPlanDefinition'],
    component: 'hqms/SamplingPlanDefinition',
  },

  // 抽样类型管理
  {
    path: '/hqms/sampling-type-management',
    models: ['hqms/samplingTypeManagement'],
    component: 'hqms/SamplingTypeManagement',
  },

  // IQC检验审核
  {
    path: '/hqms/iqc-inspection-audit',
    components: [
      {
        path: '/hqms/iqc-inspection-audit/list',
        component: 'hqms/IQCInspectionAudit',
        models: ['hqms/iqcInspectionAudit'],
      },
      {
        path: "/hqms/iqc-inspection-audit/auditDetail/:iqcHeaderId/:objectVersionNumber",
        component: 'hqms/IQCInspectionAudit/AuditDetail',
        models: ['hqms/iqcInspectionAudit'],
      },
    ],
  },

  // 加严放宽基础设置
  {
    path: '/hqms/tighten-and-elax',
    models: ['hqms/iqcTightenAndRelax'],
    component: 'hqms/IQCTightenAndRelax',
  },

  // 物料检验计划
  {
    path: '/hqms/material-inspection-plan',
    components: [
      {
        path: "/hqms/material-inspection-plan/list",
        component: "hqms/MaterialInspectionPlan",
        models: ['hqms/materialInspectionPlan'],
      },
      {
        path: "/hqms/material-inspection-plan/quality-inspection/:inspectionSchemeId",
        component: "hqms/MaterialInspectionPlan/Component/QualityInspection",
        models: ['hqms/materialInspectionPlan'],
      },
    ],
  },


  // 条码查询
  {
    path: '/hwms/barcode',
    models: ['hwms/barcodeQuery'],
    components: [
      // 条码查询列表
      {
        path: '/hwms/barcode/list',
        models: ['hwms/barcodeQuery'],
        component: 'hwms/BarcodeQuery',
      },
      // 条码历史
      {
        path: '/hwms/barcode/history-list',
        models: ['hwms/barcodeQuery'],
        component: 'hwms/BarcodeQuery/BarcodeHistory',
      },
      // 导入
      {
        path: '/hwms/barcode/import/:code',
        component: 'himp/CommentImport',
        authorized: true,
      },
      {
        path: '/hwms/barcode/labCode',
        component: 'hwms/BarcodeQuery/LabCode',
        models: ['hwms/barcodeQuery'],
      },
    ],
  },

  // 出入库动态报表
  {
    path: '/hwms/receipt-dynamic-report',
    component: 'hwms/ReceiptDynamicReport',
    models: ['hwms/receiptDynamicReport'],
  },

  // 物料周转报表
  {
    path: '/hwms/material-turnover-report',
    component: 'hwms/MaterialturnoverReport',
    models: ['hwms/materialturnoverReport'],
  },

  // 送货单查询
  {
    path: '/hwms/delivernode/query',
    component: 'hwms/DeliverQuery',
    models: ['hwms/deliverQuery'],
  },

  // 冻结解冻
  {
    path: '/hwms/freeze-thaw',
    models: ['hwms/freezeThaw'],
    component: 'hwms/FreezeThaw',
  },

  // 库存调拨平台
  {
    path: '/hwms/inventory-allocation',
    models: ['hwms/inventoryAllocation'],
    components: [
      {
        path: '/hwms/inventory-allocation/list',
        component: 'hwms/InventoryAllocation',
        models: ['hwms/inventoryAllocation'],
      },
      {
        path: '/hwms/inventory-allocation/create',
        component: 'hwms/InventoryAllocation/Create',
        models: ['hwms/inventoryAllocation'],
      },
      {
        path: '/hwms/inventory-allocation/update',
        component: 'hwms/InventoryAllocation/Update',
        models: ['hwms/inventoryAllocation'],
      },
    ],
  },


  // 领退料平台
  {
    path: '/hwms/requisition-return',
    models: ['hwms/requisitionAndReturn'],
    components: [
      {
        path: '/hwms/requisition-return/query',
        component: 'hwms/RequisitionAndReturn',
        models: ['hwms/requisitionAndReturn'],
      },
      {
        path: '/hwms/requisition-return/create',
        component: 'hwms/RequisitionAndReturn/Create',
        models: ['hwms/requisitionAndReturn'],
      },
      {
        path: '/hwms/requisition-return/detail/:instructionDocId',
        component: 'hwms/RequisitionAndReturn/Create',
        models: ['hwms/requisitionAndReturn'],
      },
    ],
  },

  // 料废调换查询
  {
    path: '/hwms/material-replacement',
    models: ['hwms/materialReplacement'],
    component: 'hwms/MaterialReplacement',
  },

  // 采购订单查询
  {
    path: '/hwms/purchase-order',
    component: 'hwms/PurchaseOrder',
    models: ['hwms/purchaseOrder'],
  },


  // 已收待上架看板
  {
    path: '/hwms/accepted-puted',
    models: ['hwms/acceptedPuted'],
    component: 'hwms/AcceptedPuted',
  },

  // 不良申请单审核
  {
    path: '/hmes/bad-application-review',
    models: ['hmes/badApplicationReview'],
    component: 'hmes/BadApplicationReview',
  },

  // 不良处理平台
  {
    path: '/hmes/bad-handling',
    component: 'hmes/BadHandling',
    models: ['hmes/badHandling'],
  },

  // 员工出勤报表
  {
    path: '/hmes/employee-attendance-report',
    models: ['hmes/employeeAttendanceReport'],
    component: 'hmes/EmployeeAttendanceReport',
  },

  // 设备点检平台
  {
    path: '/hhme/equipment-check',
    component: 'hhme/EquipmentCheck',
    models: ['hhme/equipmentCheck'],
  },

  // 异常处理平台
  {
    path: '/hmes/exception-handling-platform/:workcellId',
    models: ['hmes/exceptionHandlingPlatform'],
    component: 'hmes/ExceptionHandlingPlatform',
  },

  // 入库单工作台
  {
    path: '/hmes/inbound-workbench',
    models: ['hmes/inboundWorkbench'],
    component: 'hmes/InboundWorkbench',
  },

  // 巡检平台
  {
    path: '/hmes/inspection-platform',
    models: ['hmes/inspectionPlatform'],
    component: 'hmes/InspectionPlatform',
  },

  // IQC质检平台
  {
    path: '/hmes/iqc-quality-platform',
    models: ['hmes/iqcQualityPlatform'],
    component: 'hmes/IQCQualityPlatform',
  },

  // 班组工作台
  {
    path: '/hmes/team-workbench',
    models: ['hmes/teamWorkbench'],
    component: 'hmes/TeamWorkbench',
  },

  // 时效管理平台
  {
    path: '/hmes/time-management',
    components: [
      {
        path: "/hmes/time-management/list",
        models: ['hmes/timeManagement'],
        component: 'hmes/TimeManagement',
      },
      {
        path: "/hmes/time-management/data/collection",
        models: ['hmes/timeManagement'],
        component: 'hmes/TimeManagement/TimeDataCollection',
      },
    ],
  },

  // IQC 检验平台
  {
    path: '/hwms/iqc-inspection-platform',
    models: ['hwms/iqcInspectionPlatform'],
    components: [
      {
        path: "/hwms/iqc-inspection-platform/list",
        component: "hwms/IqcInspectionPlatform",
        models: ['hwms/iqcInspectionPlatform'],
      },
      {
        path: "/hwms/iqc-inspection-platform/detail/:iqcNumber/:iqcHeaderId",
        models: ['hwms/iqcInspectionPlatform'],
        component: "hwms/IqcInspectionPlatform/IQCQualityPlatform",
      },
    ],
  },

  // 员工上下岗
  {
    path: '/hhme/staff-upAndDown',
    models: ['hhme/staffUpAndDown'],
    component: 'hhme/StaffUpAndDown',
  },

  // 设备台账管理
  {
    path: '/hhme/equipment-LedgerManagement',
    components: [
      {
        path: "/hhme/equipment-LedgerManagement/list",
        component: "hhme/EquipmentLedgerManagement",
        models: ['hhme/equipmentLedgerManagement'],
      },
      {
        path: "/hhme/equipment-LedgerManagement/detail/:equipmentId",
        component: "hhme/EquipmentLedgerManagement/Detail",
        models: ['hhme/equipmentLedgerManagement'],
      },
      {
        path: '/hhme/equipment-LedgerManagement/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 设备工位关系维护
  {
    path: '/hhme/equipment-station-relation',
    models: ['hhme/equipmentStationRelation'],
    component: 'hhme/EquipmentStationRelation',
  },

  // 设备点检&保养项目维护
  {
    path: '/hhme/equipment-inspection-maintenance',
    models: ['hhme/equipmentInspectionMaintenance'],
    component: 'hhme/EquipmentInspectionMaintenance',
  },

  // 设备点检&保养项目维护导入
  {
    path: '/hhme/equipment-inspection-maintenance/data-import/:code',
    component: 'himp/CommentImport',
    models: [],
  },

  // 资质基础信息维护
  {
    path: '/hhme/qualification-baseInfo',
    models: ['hhme/qualificationBaseInfo'],
    component: 'hhme/QualificationBaseInfo',
  },

  // 外协管理平台
  {
    path: '/hqms/outsource-manage-platform',
    models: ['hqms/outsourceManagePlatform'],
    component: 'hqms/OutsourceManagePlatform',
  },

  // 设备点检&保养任务查询
  {
    path: '/hhme/manage-task',
    models: ['hhme/eqManageTaskDoc'],
    component: 'hhme/EqManageTaskDoc',
  },

  // 采购接收过账
  {
    path: '/hwms/material-post',
    models: ['hwms/purchaseAcceptancePosting'],
    component: 'hwms/PurchaseAcceptancePosting',
  },

  // 处置方法维护
  {
    path: '/hhme/disposal-methods-maintenance',
    models: ['hhme/disposalMethodsMaintenance'],
    component: 'hhme/DisposalMethodsMaintenance',
  },

  // 处置组功能维护
  {
    path: '/hhme/disposal-group-maintenance',
    components: [
      {
        path: "/hhme/disposal-group-maintenance/list",
        component: "hhme/DisposalGroupMaintenance/List",
        models: ['hhme/disposalGroupMaintenance'],
      },
      {
        path: "/hhme/disposal-group-maintenance/detail/:id",
        component: "hhme/DisposalGroupMaintenance/Detail",
        models: ['hhme/disposalGroupMaintenance'],
      },
    ],
  },

  // 物料预装平台
  {
    path: '/hhme/pre-installed-platform',
    models: ['hhme/preInstalledPlatform'],
    component: 'hhme/OperationPlatform/PreInstalled',
  },

  // 工序不良明细
  {
    path: '/hwms/process-defect-report',
    models: ['hwms/processDefectReport'],
    component: 'hwms/ProcessDefectReport',
  },

  // 产量日明细报表
  {
    path: '/hwms/daily-production-report',
    models: ['hwms/dailyProductionReport'],
    component: 'hwms/DailyProductionReport',
  },

  // 工位产量明细查询
  {
    path: '/hwms/station-output-details-query',
    models: ['hwms/stationOutputDetailsQuery'],
    component: 'hwms/StationOutputDetailsQuery',
  },
  // 员工制造属性维护
  {
    path: '/hhme/hr/staff',
    models: [],
    components: [
      {
        path: '/hhme/hr/staff/list',
        component: 'hhme/Employee/List',
        models: ['hhme/employee'],
      },
      {
        path: '/hhme/hr/staff/detail/:employeeId/:employeeNum',
        component: 'hhme/Employee/Detail',
        models: ['hhme/employee'],
      },
    ],
  },

  // 工序采集项报表
  {
    path: '/hhme/process-collection-item-report',
    models: ['hhme/processCollectionItemReport'],
    component: 'hhme/ProcessCollectionItemReport',
  },

  // 在制查询报表
  {
    path: '/hwms/in-process-query-report',
    models: ['hwms/inProcessQueryReport'],
    component: 'hwms/InProcessQueryReport',
  },

  // 异常信息查看报表
  {
    path: '/hhme/abnormal-report',
    models: ['hhme/abnormalReport'],
    component: 'hhme/AbnormalReport',
  },

  // 生产数据采集
  {
    path: '/hhme/production-data-collection',
    models: ['hhme/productionDataCollection'],
    component: 'hhme/ProductionDataCollection',
  },

  // 设备监控平台
  {
    path: '/hwms/equipment-monitoring-board',
    component: 'hwms/EquipmentMonitoringBoard',
  },

  // 配送基础数据维护
  {
    path: '/hhme/basic-data-maintenance-of-distribution',
    component: 'hhme/BasicDataMaintenDistri',
    models: ['hhme/basicDataMaintenDistri'],
    components: [
      // 查询列表
      {
        path: '/hhme/basic-data-maintenance-of-distribution/list',
        models: ['hhme/basicDataMaintenDistri'],
        component: 'hhme/BasicDataMaintenDistri',
      },
      // 导入物流器具
      {
        path: '/hhme/basic-data-maintenance-of-distribution/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
        authorized: true,
      },
    ],
  },

  // 配送平台
  {
    path: '/hwms/distribution-demand-platform',
    component: 'hwms/DistributionDemandPlatform',
    models: ['hwms/distributionDemandPlatform'],
  },

  // 来料录入
  {
    path: '/hhme/incoming-material-entry',
    component: 'hhme/IncomingMaterialEntry',
    models: ['hhme/incomingMaterialEntry'],
  },

  {
    path: '/hhme/incoming-material-entry-plus',
    components: [
      // 查询列表
      {
        path: '/hhme/incoming-material-entry-plus/list',
        component: 'hhme/IncomingMaterialEntryPlus',
        models: ['hhme/incomingMaterialEntryPlus'],
      },
      // 创建
      {
        path: '/hhme/incoming-material-entry-plus/:operationRecordId',
        component: 'hhme/IncomingMaterialEntryPlus/Create',
        models: ['hhme/incomingMaterialEntryPlus'],
      },
      // 创建Wafer
      {
        path: '/hhme/incoming-material-entry-plus/wafer/:operationRecordId',
        component: 'hhme/IncomingMaterialEntryPlus/CreateWafer',
        models: ['hhme/incomingMaterialEntryPlus'],
      },
      // 六级芯片导入
      {
        path: '/hhme/incoming-material-entry-plus/six/import',
        component: 'hhme/IncomingMaterialEntryPlus/SixImport',
        models: ['hhme/incomingMaterialEntryPlus'],
      },
      // 导入
      {
        path: '/hhme/incoming-material-entry-plus/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 库存调拨审核设置
  {
    path: '/hwms/allocation-audit-settings',
    component: 'hwms/AllocationAuditSettings',
    models: ['hwms/allocationAuditSettings'],
  },

  // 芯片不良记录
  {
    path: '/hhme/chip-nc-record-platform',
    component: 'hhme/ChipNCRecordPlatform',
    models: ['hhme/chipNCRecordPlatform', 'globalMes'],
    components: [
      // 查询列表
      {
        path: '/hhme/chip-nc-record-platform/list',
        component: 'hhme/ChipNCRecordPlatform',
        models: ['hhme/chipNCRecordPlatform', 'globalMes'],
      },
      // 导入物流器具
      {
        path: '/hhme/chip-nc-record-platform/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 取片平台
  {
    path: '/hhme/fetching-platform',
    component: 'hhme/FetchingPlatform',
    models: ['hhme/fetchingPlatform'],
  },

  // 贴片平台
  {
    path: '/hhme/paste-chip-platform',
    component: 'hhme/PasteChipPlatform',
    models: ['hhme/pasteChipPlatform'],
  },

  // 挑选规则维护
  {
    path: '/hwms/selection-rule-maintenance',
    component: 'hwms/SelectionRuleMaintenance',
    models: ['hwms/selectionRuleMaintenance'],
  },

  // 芯片性能表
  {
    path: '/hwms/chip-performance-table',
    component: 'hwms/ChipPerformanceTable',
    models: ['hwms/chipPerformanceTable'],
    components: [
      // 查询列表
      {
        path: '/hwms/chip-performance-table/list',
        component: 'hwms/ChipPerformanceTable',
        models: ['hwms/chipPerformanceTable'],
      },
      // 导入物流器具
      {
        path: '/hwms/chip-performance-table/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
        authorized: true,
      },
    ],
  },

  // 芯片预挑选
  {
    path: '/hwms/chip-pre-selection',
    component: 'hwms/ChipPreSelection',
    models: ['hwms/chipPreSelection'],
  },

  // cos检验平台
  {
    path: '/hhme/cos-inspection-platform',
    component: 'hhme/CosInspectionPlatform',
    models: ['hhme/cosInspectionPlatform'],
  },

  // cos芯片贴合
  {
    path: '/hhme/cos-chip-paste',
    component: 'hhme/CosChipPaste',
    models: ['hhme/cosChipPaste'],
  },

  // 巡检检验计划
  {
    path: '/hqms/inspection-plan',
    components: [
      {
        path: "/hqms/inspection-plan/list",
        component: "hqms/InspectionPlan",
        models: ['hqms/inspectionPlan'],
      },
      {
        path: "/hqms/inspection-plan/qualityInspection/:inspectionSchemeId",
        component: "hqms/InspectionPlan/Component/QualityInspection",
        models: ['hqms/inspectionPlan'],
      },
    ],
  },

  // 巡检单查询
  {
    path: '/hqms/pqc-doc-query',
    component: 'hqms/PqcDocQuery',
    models: ['hqms/pqcDocQuery'],
    authorized: true,
  },

  // cos芯片转移
  {
    path: '/hhme/cos-chip-move',
    component: 'hhme/CosChipMove',
    models: ['hhme/cosChipMove', 'globalMes'],
  },

  // 时效工艺时长维护
  {
    path: '/hhme/time-process',
    component: 'hhme/TimeProcess',
    models: ['hhme/timeProcess'],
  },

  // 交期试算
  {
    path: '/hhme/delivery-trial',
    component: 'hhme/DeliveryTrial',
    models: ['hhme/deliveryTrial'],
  },

  // OQC检验平台
  {
    path: '/hwms/oqc-inspection-platform',
    component: 'hwms/OqcInspectPlat',
    models: ['hwms/oqcInspectPlat'],
  },

  // 首序工序作业平台
  {
    path: '/hhme/first-process-platform',
    component: 'hhme/OperationPlatform/FirstProcess',
    models: ['hhme/firstProcessPlatform'],
  },

  // 配送单查询
  {
    path: '/hwms/delivery-order-query',
    component: 'hwms/DeliveryOrderQuery',
    models: ['hwms/deliveryOrderQuery'],
  },

  {
    path: '/hhme/after-sale-return-confirm',
    component: 'hhme/AfterSaleReturnConfirm',
    models: ['hhme/afterSaleReturnConfirm'],
  },

  // 时效物料封装
  {
    path: '/hhme/aging-material-packaging',
    component: 'hhme/AgingMaterialPackaging',
    models: ['hhme/agingMaterialPackaging'],
  },


  // 售后拆机平台
  {
    path: '/hhme/service-split-platform',
    component: 'hhme/ServiceSplitPlatform',
    models: ['hhme/serviceSplitPlatform'],
  },

  // 入库单查询
  {
    path: '/hwms/inbound-order-query',
    components: [
      {
        path: "/hwms/inbound-order-query/list",
        component: 'hwms/InboundOrderQuery/List',
        models: ['hwms/inboundOrderQuery'],
      },
      {
        path: '/hwms/inbound-order-query/detail',
        component: 'hwms/InboundOrderQuery/Detail',
        models: ['hwms/inboundOrderQuery'],
      },
    ],
  },

  // 现有量查询
  {
    path: '/hwms/onhand-quantity-query',
    component: 'hwms/OnhandQuantityQuery',
    models: ['hwms/onhandQuery', 'hwms/requisitionAndReturn'],
  },

  // 条码修改
  {
    path: '/hwms/barcode-modify',
    component: 'hwms/BarcodeModify',
    models: ['hwms/barcodeModify', 'hwms/requisitionAndReturn', 'hwms/barcodeQuery'],
  },

  // 锁定对象解锁
  {
    path: '/hwms/lock-object-unlock',
    component: 'hwms/LockObjectUnlock',
    models: ['hwms/lockObjectUnlock'],
  },

  // 数据项计算公式维护
  {
    path: '/hhme/data-item-formula',
    models: ['hhme/dataItemFormula'],
    components: [
      {
        path: "/hhme/data-item-formula",
        component: "hhme/DataItemFormula",
        models: ['hhme/dataItemFormula'],
      },
      {
        authorized: true,
        path: '/hhme/data-item-formula/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 金线打线
  {
    path: '/hhme/gold-thread',
    component: 'hhme/GoldThread',
    models: ['hhme/goldThread'],
  },

  // 销售订单变更
  {
    path: '/hwms/sales-order-changes',
    component: 'hwms/SalesOrderChanges',
    models: ['hwms/salesOrderChanges'],
  },

  // 数据项不良类型维护
  {
    path: '/hhme/data-item-nc-type',
    component: 'hhme/DataItemNcType',
    models: ['hhme/dataItemNcType'],
  },

  // cos出站查询
  {
    path: '/hwms/cos-outbound-query',
    models: ['hwms/cosOutboundQuery'],
    component: 'hwms/CosOutboundQuery',
  },

  // COS 投料报废
  {
    path: '/hhme/cos-feeding-scrap',
    component: 'hhme/CosFeedingScrap',
    models: ['hhme/cosFeedingScrap'],
  },

  // 表查询
  {
    path: '/hwms/table-query',
    models: ['hwms/tableQuery'],
    component: 'hwms/TableQuery',
  },

  // IQC 检验平台 PAD
  {
    path: '/hwms/iqc-inspection-platform-pad',
    models: ['hwms/iqcInspectionPlatform'],
    components: [
      {
        path: "/hwms/iqc-inspection-platform-pad/list",
        component: "hwms/IqcInspectionPlatformPad",
        models: ['hwms/iqcInspectionPlatform'],
      },
      {
        path: "/hwms/iqc-inspection-platform-pad/detail/:iqcNumber/:iqcHeaderId",
        models: ['hwms/iqcInspectionPlatform'],
        component: "hwms/IqcInspectionPlatformPad/IQCQualityPlatform",
      },
    ],
  },

  // 巡检平台Pad
  {
    path: '/hmes/inspection-platform-pad',
    models: ['hmes/inspectionPlatform'],
    component: 'hmes/InspectionPlatformPad',
  },
  // sn替换
  {
    path: '/hhme/sn-replace',
    models: ['hhme/snReplace'],
    component: 'hhme/SnReplace',
  },

  {
    path: '/hhme/sn-replace/:code',
    component: 'himp/CommentImport',
    authorized: true,
  },
  {
    path: "/pub/hmes/production-board",
    key: '/pub/hmes/production-board',
    models: ['hmes/productionBoard'],
    component: 'hmes/ProductionBoard',
  },

  // 成品检验质量看板
  {
    path: "/public/hmes/finished-product-inspection-board",
    key: '/public/hmes/finished-product-inspection-board',
    models: ['hmes/finishedProductInspectionBoard'],
    component: 'hmes/FinishedProductInspectionBoard',
    authorized: true,
  },

  {
    path: '/hmes/production-board-base-data',
    models: ['hmes/productionBoardBaseData'],
    component: 'hmes/ProductionBoardBaseData',
  },

  {
    path: '/hhme/feed-work-order-material',
    models: ['hhme/feedWorkOrderMaterial'],
    component: 'hhme/FeedWorkOrderMaterial',
  },

  // 条码现有量查询
  {
    path: '/hwms/barcode-inventory-on-hand-query',
    models: ['hwms/wmsBarcodeInventoryOnHandQuery'],
    component: 'hwms/WmsBarcodeInventoryOnHandQuery',
  },

  // SAP与MES库存核对报表
  {
    path: '/hwms/sap-and-mes-inventory-reconciliation-report',
    models: ['hwms/sapAndMESInventoryReconciliationReport'],
    component: 'hwms/SapAndMESInventoryReconciliationReport',
  },

  // SAP与MES凭证核对报表
  {
    path: '/hwms/sap-and-mes-voucher-verification-report',
    models: ['hwms/sapAndMESVoucherVerificationReport'],
    component: 'hwms/SapAndMESVoucherVerificationReport',
  },

  {
    path: '/hwms/stock-take-platform',
    models: ['hwms/stockTakePlatform'],
    components: [
      {
        path: "/hwms/stock-take-platform/list",
        component: "hwms/StocktakePlatform",
        models: ['hwms/stockTakePlatform'],
      },
      {
        path: "/hwms/stock-take-platform/material-detail/:stocktakeIds",
        component: "hwms/StocktakePlatform/MaterialDetail",
        models: ['hwms/stockTakePlatform'],
      },
      {
        path: "/hwms/stock-take-platform/barcode-detail/:stocktakeIds",
        component: "hwms/StocktakePlatform/BarcodeDetail",
        models: ['hwms/stockTakePlatform'],
      },
    ],
  },

  // 库龄报表
  {
    path: '/hwms/stock-age-report',
    components: [
      {
        path: "/hwms/stock-age-report/list",
        component: "hwms/StockAgeReport",
        models: ['hwms/stockAgeReport'],
      },
      {
        path: "/hwms/stock-age-report/stock/agequery",
        models: ['hwms/stockAgeReport'],
        component: "hwms/StockAgeReport/StockAgeQuery",
      },
    ],
  },

  // 采购退货平台
  {
    path: '/hwms/purchase-return-platform',
    component: 'hwms/PurchaseReturnPlatform',
    models: ['hwms/purchaseReturnPlatform'],
  },

  {
    path: '/hmes/work-order-process-details-report',
    models: ['hmes/workOrderProcessDetailsReport'],
    component: 'hmes/WorkOrderProcessDetailsReport',
  },

  // 接口监控平台
  {
    path: '/hwms/itf-object-transaction-ifaces',
    models: ['hwms/itfObjectTransactionIface'],
    component: 'hwms/ItfObjectTransactionIface',
  },

  // 仓库物料进销存
  {
    path: '/hwms/material-pdos-report',
    models: ['hwms/materialPdosReport'],
    component: 'hwms/MaterialPdosReport',
  },

  // 计划达成率报表
  {
    path: '/hwms/plan-achievement-rate-report',
    models: ['hwms/planAchievementRateReport'],
    component: 'hwms/PlanAchievementRateReport',
  },

  // IQC 检验看板
  {
    path: '/hwms/iqc-inspect-board',
    component: 'hwms/IqcInspectBoard',
    models: ['hwms/iqcInspectBoard'],
  },

  // 巡检报表
  {
    path: '/hwms/inspection-borad',
    models: ['hwms/inspectionBorad'],
    component: 'hwms/InspectionBorad',
  },

  // 芯片性能表
  {
    path: '/hwms/chip-performance-table-board',
    models: ['hwms/chipPerformanceTableBoard'],
    component: 'hwms/ChipPerformanceTableBoard',
  },

  // 派工明细报表
  {
    path: '/hmes/dispatch-details-report',
    models: ['hmes/dispatchDetailsReport'],
    component: 'hmes/DispatchDetailsReport',
  },
  // 非标产品报表
  {
    path: '/hmes/non-standard-product-report',
    models: ['hmes/nonStandardProductReport'],
    component: 'hmes/NonStandardProductReport',
  },

  // 芯片预挑选迭代
  {
    path: '/hwms/chip-pre-selection-iteration',
    component: 'hwms/ChipPreSelectionIter',
    models: ['hwms/chipPreSelection'],
  },

  // 返修作业平台
  {
    path: '/hhme/operation-platform-repair',
    component: 'hhme/OperationPlatform/Repair',
    models: ['hhme/repairPlatform'],
  },

  // 销售发货平台
  {
    path: '/hwms/so-delivery-platform',
    components: [
      {
        path: "/hwms/so-delivery-platform/list",
        models: ['hwms/soDeliveryPlatform'],
        component: 'hwms/SoDeliveryPlatform',
      },
      {
        path: "/hwms/so-delivery-platform/create/:id",
        models: ['hwms/soDeliveryPlatform'],
        component: "hwms/SoDeliveryPlatform/Create",
      },
    ],
  },
  {
    path: '/hmes/prod-application-inspection-machine',
    models: ['hmes/prodApplicationInspectionMachine'],
    component: 'hmes/ProdApplicationInspectionMachine',
  },


  // 工单配送综合查询报表
  {
    path: '/hmes/wo-distribution-comprehensive-report',
    models: ['hmes/woDistributionComprehensiveReport'],
    component: 'hmes/WoDistributionComprehensiveReport',
  },


  // 调拨单汇总报表
  {
    path: '/hmes/transfer-ordersummary-report',
    component: 'hmes/TransferOrderSummaryReport',
    models: ['hmes/transferOrderSummaryReport'],

  },
  // 供应商来料在线质量
  {
    path: '/hqms/supplier-incoming-quality-report',
    models: ['hqms/supplierIncomingQualityReport'],
    component: 'hqms/SupplierIncomingQualityReport',
  },

  // IQC日常工作计划报表
  {
    path: '/hqms/iqc-daily-work-plan',
    models: ['hqms/iqcDailyWorkPlan'],
    component: 'hqms/IQCDailyWorkPlan',
  },

  // COS条码加工汇总表
  {
    path: '/hwms/wms-summary-of-cos-barcode-processing-repository',
    models: ['hwms/wmsSummaryOfCosBarcodeProcessing'],
    component: 'hwms/WmsSummaryOfCosBarcodeProcessing',
  },

  //cos目检条码表
  {
    path: '/hmes/cos-check-barcodes',
    models: ['hmes/cosCheckBarcodes'],
    component: "hmes/CosCheckBarcodes",
  },
  //cos工位加工汇总表
  {
    path: '/hmes/cos-workcell',
    models: ['hmes/cosWorkcell'],
    component: "hmes/CosWorkcell",
  },

  // COS工位加工异常汇总查询
  {
    path: '/hhme/cos-workcell-exception',
    component: 'hhme/CosWorkcellException',
    models: ['hhme/cosWorkcellException'],
  },

  // 目检完工
  {
    path: '/hhme/visual-inspection',
    component: 'hhme/VisualInspection',
    models: ['hhme/visualInspection'],
  },
  // COS复测导入
  {
    path: '/hhme/cos-introduction-retest',
    models: ['hhme/cosIntroductionRetest'],
    component: 'hhme/CosIntroductionRetest',
  },

  // 自制件返修
  {
    path: '/hwms/repair-of-self-made-parts',
    component: 'hwms/RepairOfSelfMadeParts',
    models: ['hwms/repairOfSelfMadeParts'],
  },

  // 质量文件解析
  {
    path: '/hwms/analysis-of-quality-documents',
    models: ['hwms/qualityFileAnalysisBackEnd'],
    components: [
      {
        path: '/hwms/analysis-of-quality-documents/list',
        component: 'hwms/QualityFileAnalysisBackEnd',
        models: ['hwms/qualityFileAnalysisBackEnd'],
      },
      // 导入模板
      {
        path: '/hwms/analysis-of-quality-documents/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
    authorized: true,
  },
  // COS条码加工异常汇总查询
  {
    path: '/hhme/cos-barcode-exception',
    component: 'hhme/CosBarCodeException',
    models: ['hhme/cosBarCodeException'],
  },

  // 筛选结果
  {
    path: '/hwms/screening/result',
    models: ['hwms/screeningResult'],
    component: 'hwms/ScreeningResult',
  },

  {
    path: '/hmes/transfer-order-detail',
    models: ['hmes/transferOrderDetail'],
    component: 'hmes/TransferOrderDetail',
  },

  //cos在制报表
  {
    path: '/hmes/cos-prodction',
    models: ['hmes/cosProduction'],
    component: "hmes/CosProduction",
  },
  // 来料转移
  {
    path: '/hhme/incoming-move',
    models: ['hhme/incomingMove', 'globalMes'],
    component: 'hhme/IncomingMove',
  },

  // 标准件检验标准维护
  {
    path: '/hmes/ssn-inspect',
    component: 'hmes/SsnInspect',
    models: ['hmes/ssnInspect'],
  },
  // 标准件检验标准导入
  {
    path: '/hmes/ssn-inspect/data-import/:code',
    component: 'himp/CommentImport',
    models: [],
  },

  // 返修时效工序作业平台
  {
    path: '/hmes/time-management-return',
    components: [
      {
        path: "/hmes/time-management-return/list",
        models: ['hmes/timeManagementReturn'],
        component: 'hmes/TimeManagementReturn',
      },
      {
        path: "/hmes/time-management-return/data/collection",
        models: ['hmes/timeManagementReturn'],
        component: 'hmes/TimeManagementReturn/TimeDataCollection',
      },
    ],
  },

  // 作业指导书平台
  {
    path: '/hhme/work-instructions',
    // models: ['hmes/productionBoardBaseData'],
    components: [
      {
        path: "/hhme/work-instructions/list",
        component: 'hhme/WorkInstructions',
        // models: ['hwms/iqcInspectionPlatform'],
      },
      {
        path: "/hhme/work-instructions/detail/:headId",
        models: ['hhme/workInstructions'],
        component: "hhme/WorkInstructions/Detail",
      },
    ],
  },

  // FAC-Y宽判定标准维护
  {
    path: '/hmes/fac-yk',
    component: 'hmes/FacYkDetermine',
    models: ['hmes/facYkDetermine'],
  },
  // 导入
  {
    path: '/hmes/fac-yk/data-import/:code',
    component: 'himp/CommentImport',
    models: [],
  },

  // COS报废撤回
  {
    path: '/hwms/cos-scrap-with-drawal',
    models: ['hwms/cosScrapWithdrawal'],
    component: 'hwms/CosScrapWithdrawal',
  },

  // 冻结解冻平台
  {
    path: '/hqms/freeze-unfreeze-platform',
    components: [
      {
        path: '/hqms/freeze-unfreeze-platform/list',
        models: ['hqms/freezeUnfreezePlatform'],
        component: 'hqms/FreezeUnfreezePlatform',
      },
      {
        path: '/hqms/freeze-unfreeze-platform/create',
        models: ['hqms/freezeUnfreezePlatform'],
        component: "hqms/FreezeUnfreezePlatform/FreezeUnfreezePlatformCreate",
      },
    ],
  },

  // 单据汇总查询报表
  {
    path: '/hmes/bill-summary-reprot',
    models: ['hmes/billSummaryReprot'],
    component: 'hmes/BillSummaryReprot',
  },
  // 工装维护
  {
    path: '/hmes/tool',
    models: ['hmes/tool'],
    component: 'hmes/Tool',
  },
  //设备运行情况表
  {
    path: '/hmes/equipment-working',
    models: ['hmes/equipmentWorking'],
    component: "hmes/EquipmentWorking",
  },


  // 工装管理
  {
    path: '/hhme/tool-management',
    models: ['hhme/toolingManagement'],
    component: 'hhme/ToolingManagement',
  },
  // COS筛选滞留表
  {
    path: '/hwms/cos-screening-retention-table',
    models: ['hwms/cosScreeningRetentionTable'],
    component: 'hwms/CosScreeningRetentionTable',
  },

  // 生产流转查询报表
  {
    path: '/hwms/production-flow-query-report',
    models: ['hwms/productionFlowQueryReport'],
    component: 'hwms/ProductionFlowQueryReport',
  },

  // 工序不良判定标准维护
  {
    path: '/hmes/process-nc',
    component: 'hmes/ProcessNc',
    models: ['hmes/processNc'],
  },
  //工序不良判定标准维护导入
  {
    path: '/hmes/process-nc/data-import/:code',
    component: 'himp/CommentImport',
    models: [],
  },

  // 材料不良明细报表
  {
    path: '/hmes/material-nc-report',
    models: ['hmes/materialNcReport'],
    component: 'hmes/MaterialNcReport',
  },

  // 生产执行全过程监控报表
  {
    path: '/hwms/production-execution-whole-process-monitoring-report',
    models: ['hwms/processMonitoringReport'],
    component: 'hwms/ProcessMonitoringReport',
  },

  // 物料配送空缺滚动报表
  {
    path: '/hwms/material-distribution-report',
    models: ['hwms/materialDistributionReport'],
    component: 'hwms/MaterialDistributionReport',
  },
  // 投料汇总报表
  {
    path: '/hhme/feed-material-report',
    models: ['hhme/feedMaterialReport'],
    component: 'hhme/FeedMaterialReport',
  },

  //老化标准维护
  {
    path: '/hhme/agening-data',
    models: ['hhme/ageningData'],
    component: "hhme/AgeningData",
  },

  // 标准件检验结果查询
  {
    path: '/hhme/standard-parts-inspection-query',
    models: ['hhme/standardPartsInspectionQuery'],
    component: 'hhme/StandardPartsInspectionQuery',
  },

  // 标准件检验
  {
    path: '/hhme/standard-parts-inspection',
    models: ['hhme/standardPartsInspection'],
    component: 'hhme/StandardPartsInspection',
  },

  // 产品直通率报表
  {
    path: '/hwms/product-pass-through-rate-report',
    models: ['hwms/productPassThroughRateReport'],
    component: 'hwms/ProductPassThroughRateReport',
  },

  // 日直通率报表
  {
    path: '/hwms/daily-through-rate-report',
    models: ['hwms/dailyThroughRateReport'],
    component: 'hwms/DailyThroughRateReport',
  },

  // 入库明细查询报表
  {
    path: '/hmes/warehousing-detail-report',
    models: ['hmes/warehousingDetailReport'],
    component: 'hmes/WarehousingDetailReport',
  },

  // COS芯片作业记录
  {
    path: '/hwms/cos-chip-operation-record',
    models: ['hwms/cosChipOperationRecord'],
    component: 'hwms/CosChipOperationRecord',
  },

  //老化标准维护
  {
    path: '/hmes/monthly-plan-achievement-rate-report',
    models: ['hmes/monthlyPlanAchievementRateReport'],
    component: "hmes/MonthlyPlanAchievementRateReport",
  },

  // cos芯片退料
  {
    path: '/hhme/cos-chip-material-return',
    component: "hhme/CosChipMaterialReturn",
    models: ['hhme/cosChipMaterialReturn'],
  },

  // COS冻结转移
  {
    path: '/hhme/cos-freeze-move',
    component: "hhme/CosFreezeMove",
    models: ['hhme/cosFreezeMove'],
  },

  // 设备故障监控
  {
    path: '/hwms/equipment-fault-monitoring',
    models: ['hwms/equipmentFaultMonitoring'],
    component: 'hwms/EquipmentFaultMonitoring',
  },

  // cos过期库存复测投料
  {
    path: '/hhme/cos-overdue-inventory-retest',
    models: ['hhme/cosOverdueInventoryRetest'],
    component: 'hhme/CosOverdueInventoryRetest',
  },

  // COS报废复测投料
  {
    path: '/hhme/cos-scrap-retest',
    models: ['hhme/cosScrapRetest'],
    component: 'hhme/CosScrapRetest',
  },
  // cos返厂复测投料
  {
    path: '/hhme/cos-return-factory-retest',
    models: ['hhme/cosReturnFactoryRetest'],
    component: 'hhme/CosReturnFactoryRetest',
  },

  // 员工出勤报表
  {
    path: '/hhme/sign-in-out',
    models: ['hhme/signInOut'],
    component: 'hhme/SignInOut',
  },

  // 售后退库检测查询报表
  {
    path: '/hwms/after-sales-return-ins-query-report',
    models: ['hwms/afterSalesReturnInsQueryReport'],
    component: 'hwms/AfterSalesReturnInsQueryReport',
  },


  // 翻新SN生成
  {
    path: '/hwms/renovation-sn-generation',
    models: ['hwms/renovationSnGeneration'],
    component: 'hwms/RenovationSnGeneration',
  },

  // 员工产量汇总报表
  {
    path: '/hwms/employee-output-summary-report',
    models: ['hwms/employeeOutputSummaryReport'],
    component: 'hwms/EmployeeOutputSummaryReport',
  },

  // 工单损耗报表
  {
    path: '/hhme/work-order-loss-report',
    models: ['hhme/workOrderLossReport'],
    component: "hhme/WorkOrderLossReport",
  },

  // 在制品盘点执行
  {
    path: '/hhme/inventory-platform',
    // models: ['hmes/productionBoardBaseData'],
    components: [
      {
        path: "/hhme/inventory-platform/list",
        component: 'hhme/InventoryPlatform',
        models: ['hhme/inventoryPlatform'],
      },
      {
        path: "/hhme/inventory-platform/detail/:stocktakeIds",
        models: ['hhme/inventoryPlatform'],
        component: "hhme/InventoryPlatform/InventoryDetail",
      },
      {
        path: "/hhme/inventory-platform/summary/:stocktakeIds",
        models: ['hhme/inventoryPlatform'],
        component: "hhme/InventoryPlatform/InventorySummary",
      },
      {
        path: "/hhme/inventory-platform/material-summary/:stocktakeIds",
        models: ['hhme/inventoryPlatform'],
        component: "hhme/InventoryPlatform/MaterialSummary",
      },
    ],
  },

  // 售后登记查询报表
  {
    path: '/hwms/after-sales-regis-query-report',
    models: ['hwms/afterSalesRegisQueryReport'],
    component: 'hwms/AfterSalesRegisQueryReport',
  },

  // 工序采集结果报表
  {
    path: '/hhme/process-collection-result-report',
    models: ['hhme/processCollectionResultReport'],
    component: "hhme/ProcessCollectionResultReport",
  },

  // 权限以及消息推送设置
  {
    path: '/hqms/permissions-message-push-settings',
    components: [
      {
        path: "/hqms/permissions-message-push-settings/list",
        component: 'hqms/PermissionsMessagePushSettings',
        models: ['hqms/permissionsMessagePushSettings'],
      },
      {
        path: "/hqms/permissions-message-push-settings/:operation",
        component: "hqms/PermissionsMessagePushSettings/Create",
        models: ['hqms/permissionsMessagePushSettings'],
      },
    ],
  },

  // 售后在制品盘点-半成品-报表
  {
    path: '/hmes/inventory-semi-manufactures',
    models: ['hmes/inventorySemiManufactures'],
    component: 'hmes/InventorySemiManufactures',
  },
  // 质检员与物料组关系维护
  {
    path: '/rel-maintenance-group',
    models: ['hwms/relMaintenanceGroup'],
    components: [
      // 查询列表
      {
        path: '/rel-maintenance-group/list',
        models: ['hwms/relMaintenanceGroup'],
        component: 'hwms/RelMaintenanceGroup',
      },
      // 导入物流器具
      {
        path: '/rel-maintenance-group/data-import/:code',
        component: 'himp/CommentImport',
        models: [],
      },
    ],
  },

  // 售后在制品盘点-成品-报表
  {
    path: '/hmes/inventory-finished-product',
    models: ['hmes/inventoryFinishedProduct'],
    component: 'hmes/InventoryFinishedProduct',
  },

  // 不良代码指定工艺路线维护
  {
    path: '/process-route-mainten-design',
    models: ['hwms/processRouteMaintenDesign'],
    component: 'hwms/ProcessRouteMaintenDesign',
  },

  // 设备盘点平台
  {
    path: '/equipment-inventory-platform',
    models: ['hwms/equipmentInventoryPlatform'],
    component: 'hwms/EquipmentInventoryPlatform',
  },

  // COS筛选剩余芯片统计报表
  {
    path: '/hwms/cos-Filter-Remaining-Chips-Statistics',
    models: ['hwms/cosFilterRemainingChipsStatistics'],
    component: 'hwms/CosFilterRemainingChipsStatistics',
  },

  // COS员工产量汇总报表
  {
    path: '/hwms/cos-Employee-Output-Summary-Report',
    models: ['hwms/cosEmployeeOutputSummaryReport'],
    component: 'hwms/CosEmployeeOutputSummaryReport',
  },

  // 维修订单查看报表
  {
    path: '/hqms/repair-order-report',
    models: ['hqms/repairOrderReport'],
    component: 'hqms/RepairOrderReport',
  },

  // 售后退库查看报表
  {
    path: '/hqms/after-sale-return-report',
    models: ['hqms/afterSaleReturnReport'],
    component: 'hqms/AfterSaleReturnReport',
  },

  // 产品降级维护
  {
    path: '/hhme/product-downgrade',
    models: ['hhme/productDowngrade'],
    component: 'hhme/ProductDowngrade',
  },
  // 产品组维护
  {
    path: '/hhme/production-group',
    models: ['hhme/productionGroup'],
    component: 'hhme/ProductionGroup',
  },

  // 完工及入库汇总查询报表
  {
    path: '/hmes/completion-warehousing-summary-query-report',
    models: ['hmes/completionWarehousingSummaryQueryReport'],
    component: 'hmes/CompletionWarehousingSummaryQueryReport',
  },
  // 物流综合监控看板
  {
    path: '/public/hwms/logistics-monitoring-board',
    key: '/public/hwms/logistics-monitoring-board',
    models: ['hwms/logisticsMonitoringBoard', 'hqms/acceptedTestedBoardNew', 'hwms/acceptedPutedNew'],
    component: 'hwms/LogisticsMonitoringBoard',
    authorized: true,
  },

  // 物料配送缺口看板
  {
    path: '/public/hwms/material-distribution-gap-board',
    key: '/public/hwms/material-distribution-gap-board',
    models: ['hwms/materialDistributionGapBoard'],
    component: 'hwms/MaterialDistributionGapBoard',
    authorized: true,
  },

  // 返修产品直通率报表
  {
    path: '/hwms/repaired-product-report',
    models: ['hwms/repairedProductReport'],
    component: 'hwms/RepairedProductReport',
  },
  // 返修直通率报表
  {
    path: '/hwms/repair-daily-through-rate-report',
    models: ['hwms/repairDailyThroughRateReport'],
    component: 'hwms/RepairDailyThroughRateReport',
  },

  // 制造中心综合看板
  {
    path: "/public/hmes/manufacturing-center-board",
    key: '/public/hmes/manufacturing-center-board',
    models: ['hmes/manufacturingCenterBoard'],
    component: 'hmes/ManufacturingCenterBoard',
    authorized: true,
  },

  // 制造中心看板信息维护
  {
    path: '/hhme/make-center-kanban-info',
    models: ['hhme/makeCenterKanbanInfo'],
    component: 'hhme/MakeCenterKanbanInfo',
  },

  // 制造中心综合看板 - 制造部
  {
    path: "/public/hmes/manufacturing-department-board",
    key: '/public/hmes/manufacturing-department-board',
    models: ['hmes/manufacturingDepartmentBoard'],
    component: 'hmes/ManufacturingDepartmentBoard',
    authorized: true,
  },

  // 质量文件解析查询
  {
    path: '/hwms/quality-file-anal-and-query',
    models: ['hwms/qualityFileAnalAndQuery'],
    component: 'hwms/QualityFileAnalAndQuery',
  },
  // 生产领退料平台
  {
    path: '/hwms/production-pick-return',
    models: ['hwms/productionPickReturn'],
    component: 'hwms/ProductionPickReturn',
  },
  // 立库出库平台
  {
    path: '/hwms/state-and-out-library-platform',
    models: ['hwms/stateAndOutLibraryPlatform'],
    component: 'hwms/StateAndOutLibraryPlatform',
  },
  // 自制件返修统计报表
  {
    path: '/hhme/self-repair-report',
    models: ['hhme/selfRepairReport'],
    component: 'hhme/SelfRepairReport',
  },
  {
    path: '/hwms/shipment-notificate',
    models: ['hwms/soDeliveryPlatform'],
    component: 'hwms/shipmentNotificate',
  },

  {
    path: '/hhme/hr/staff/import/:code',
    component: 'himp/CommentImport',
    authorized: true,
  },

  //员工制造属性报表
  {
    path: '/hhme/staff-manufacturing-attribute-report',
    models: ['hhme/staffManufacturingAttributeReport'],
    component: 'hhme/StaffManufacturingAttributeReport',
  },

  // 工单损耗报表
  {
    path: '/hhme/cos-work-order-loss-report',
    models: ['hhme/cosWorkOrderLossReport'],
    component: "hhme/CosWorkOrderLossReport",
  },

  // 泵浦源组合挑选规则维护
  {
    path: '/hhme/pump-filter-rule',
    models: ['hhme/pumpFilterRule'],
    component: "hhme/PumpFilterRule",
  },

  // COS筛选电流点维护
  {
    path: '/hhme/cos-electric-filter',
    models: ['hhme/cosElectricFilter'],
    component: "hhme/CosElectricFilter",
  },

  // 泵浦源工序作业平台
  {
    path: '/hhme/pump-platform',
    component: 'hhme/OperationPlatform/Pump',
    models: ['hhme/pumpPlatform'],
    authorized: true,
  },

  // cos测试良率维护
  {
    path: '/hhme/cos-test-yield',
    component: 'hhme/CosTestYield',
    models: ['hhme/cosTestYield'],
  },

  // 返修进站次数维护
  {
    path: '/hhme/repair-limit-count',
    models: ['hhme/repairLimitCount'],
    component: 'hhme/RepairLimitCount',
  },

  // 导入返修进站次数限制
  {
    path: '/hhme/repair-limit-count/import/:code',
    component: 'himp/CommentImport',
    authorized: true,
  },

  //返修放行判定
  {
    path: '/hhme/repair-permit-judge',
    models: ['hhme/repairPermitJudge'],
    component: 'hhme/RepairPermitJudge',
  },

  // 采购订单接收检验统计报表
  {
    path: '/hwms/purchase-order-accept-check-report',
    models: ['hwms/purchaseOrderAcceptCheckReport'],
    component: 'hwms/PurchaseOrderAcceptCheckReport',
  },

  // IQC检验明细报表
  {
    path: '/hwms/iqc-check-detail-report',
    models: ['hwms/iqcCheckDetailReport'],
    component: 'hwms/IqcCheckDetailReport',
  },

  // 单据执行统计报表
  {
    path: '/hwms/documents-perform-statistical-report',
    models: ['hwms/documentsPerformStatisticalReport'],
    component: 'hwms/DocumentsPerformStatisticalReport',
  },

  // 数据项展示维护
  {
    path: '/hhme/data-item-display',
    models: ['hhme/dataItemDisplay'],
    component: "hhme/DataItemDisplay",
  },

  {
    path: '/hhme/data-item-display',
    components: [
      {
        path: "/hhme/data-item-display/list",
        component: "hhme/DataItemDisplay",
        models: ['hhme/dataItemDisplay'],
      },
      {
        path: "/hhme/data-item-display/import/:code",
        component: 'himp/CommentImport',
        authorized: true,
      },
    ],
  },

  // 工序采集项报表
  {
    path: '/hhme/process-collection-item-gp-report',
    models: ['hhme/processCollectionItemGPReport'],
    component: 'hhme/ProcessCollectionItemGPReport',
  },
  // 数据项展示报表
  {
    path: '/hhme/data-item-display-report',
    component: 'hhme/DataItemDisplayReport',
    models: ['hhme/dataItemDisplayReport'],
  },
  {
    path: '/hhme/pump-filter',
    models: ['hhme/pumpFilter'],
    component: 'hhme/PumpFilter',
  },

  // cos测试良率管理平台
  {
    path: '/hhme/cos-test-yield-platform',
    component: 'hhme/CosTestYieldPlatform',
    models: ['hhme/cosTestYieldPlatform'],
  },

  // 偏振度 & 发散角良率维护
  {
    path: '/hhme/polarization-divergence-yield',
    component: 'hhme/PolarizationDivergenceYield',
    models: ['hhme/polarizationDivergenceYield'],
  },
  // 泵浦源拦截管理
  {
    path: '/hhme/pump-intercept',
    component: 'hhme/PumpIntercept',
    models: ['hhme/pumpIntercept'],
  },

  // 铭牌打印
  {
    path: '/hhme/nameplate-printing',
    component: 'hhme/NameplatePrinting',
    models: ['hhme/nameplatePrinting'],
  },

  // 售后报价单报表
  {
    path: '/hhme/after-sale-quotation-report',
    component: 'hhme/AfterSaleQuotationReport',
    models: ['hhme/afterSaleQuotationReport'],
  },

  // 售后报价单
  {
    path: '/hhme/after-sale-quotation',
    models: ['hhme/afterSaleQuotation'],
    component: "hhme/AfterSaleQuotation",
  },

  // 泵浦源筛选报表
  {
    path: '/hhme/pump-filter-report',
    models: ['hhme/pumpFilterReport'],
    component: "hhme/PumpFilterReport",
  },

  // COS退料表
  {
    path: '/hwms/cos-return-material-report',
    models: ['hwms/cosReturnMaterialReport'],
    component: "hwms/CosReturnMaterialReport",
  },

  {
    path: '/hwms/lab-code-input',
    components: [
      {
        path: "/hwms/lab-code-input/list",
        component: 'hwms/LabCodeInput',
        models: ['hwms/labCodeInput'],
      },
      {
        path: "/hwms/lab-code-input/import/:code",
        component: 'himp/CommentImport',
        authorized: true,
      },
    ],
  },
  // 芯片实验代码录入
  {
    path: '/hhme/chip-lab-code-input',
    component: 'hhme/ChipLabCodeInput',
    models: ['hhme/chipLabCodeInput'],
  },

  // COS退料表
  {
    path: '/hhme/cos-yield-report',
    models: ['hhme/cosYieldReport'],
    component: "hhme/CosYieldReport",
  },
];
