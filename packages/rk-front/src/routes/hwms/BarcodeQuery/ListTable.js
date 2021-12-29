import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, Dropdown, Menu, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { dateRender } from 'utils/renderer';
import formatterCollections from 'utils/intl/formatterCollections';

import EditableTable from '@/components/FilterTable';

const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';

@formatterCollections({ code: 'hwms.barcodeQuery' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterColum: [
        {
          fieldName: intl.get(`${modelPrompt}.materialLotCode`).d('条码号'),
          fieldKey: 'materialLotCode',
          hidden: 0,
          fixedLeft: 0,
          fixedRight: 0,
          orderSeq: 0,
        },
        {
          fieldName: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
          fieldKey: 'materialCode',
          hidden: 0,
          orderSeq: 1,
        },
        {
          fieldName: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
          fieldKey: 'materialName',
          hidden: 0,
          orderSeq: 2,
        },
        {
          fieldName: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
          fieldKey: 'materialVersion',
          hidden: 0,
          orderSeq: 3,
        },
        {
          fieldName: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
          fieldKey: 'enableFlagMeaning',
          hidden: 0,
          orderSeq: 4,
        },
        {
          fieldName: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
          fieldKey: 'primaryUomQty',
          hidden: 0,
          orderSeq: 5,
        },
        {
          fieldName: intl.get(`${modelPrompt}.primaryUomName`).d('单位'),
          fieldKey: 'primaryUomName',
          hidden: 0,
          orderSeq: 6,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lot`).d('批次'),
          fieldKey: 'lot',
          hidden: 0,
          orderSeq: 7,
        },
        {
          fieldName: intl.get(`${modelPrompt}.supplierLot`).d('供应商批次'),
          fieldKey: 'supplierLot',
          hidden: 0,
          orderSeq: 8,
        },
        {
          fieldName: intl.get(`${modelPrompt}.statusMeaning`).d('状态'),
          fieldKey: 'statusMeaning',
          hidden: 0,
          orderSeq: 9,
        },
        {
          fieldName: intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态'),
          fieldKey: 'qualityStatusMeaning',
          hidden: 0,
          orderSeq: 10,
        },
        {
          fieldName: intl.get(`${modelPrompt}.performanceLevelMeaning`).d('性能等级'),
          fieldKey: 'performanceLevelMeaning',
          hidden: 0,
          orderSeq: 11,
        },
        {
          fieldName: intl.get(`${modelPrompt}.siteName`).d('工厂'),
          fieldKey: 'siteName',
          hidden: 0,
          orderSeq: 12,
        },
        {
          fieldName: intl.get(`${modelPrompt}.wareHouseCode`).d('仓库'),
          fieldKey: 'wareHouseCode',
          hidden: 0,
          orderSeq: 13,
        },
        {
          fieldName: intl.get(`${modelPrompt}.locatorCode`).d('货位'),
          fieldKey: 'locatorCode',
          hidden: 0,
          orderSeq: 14,
        },
        {
          fieldName: intl.get(`${modelPrompt}.actualLocatorCode`).d('实际存储货位'),
          fieldKey: 'actualLocatorCode',
          hidden: 0,
          orderSeq: 15,
        },
        {
          fieldName: intl.get(`${modelPrompt}.soNum`).d('销售订单号'),
          fieldKey: 'soNum',
          hidden: 0,
          orderSeq: 16,
        },
        {
          fieldName: intl.get(`${modelPrompt}.soLineNum`).d('销售订单行号'),
          fieldKey: 'soLineNum',
          hidden: 0,
          orderSeq: 17,
        },
        {
          fieldName: intl.get(`${modelPrompt}.poNum`).d('采购订单号'),
          fieldKey: 'poNum',
          hidden: 0,
          orderSeq: 18,
        },
        {
          fieldName: intl.get(`${modelPrompt}.poLineNum`).d('采购订单行号'),
          fieldKey: 'poLineNum',
          hidden: 0,
          orderSeq: 19,
        },
        {
          fieldName: intl.get(`${modelPrompt}.deliveryNum`).d('送货单号'),
          fieldKey: 'deliveryNum',
          hidden: 0,
          orderSeq: 20,
        },
        {
          fieldName: intl.get(`${modelPrompt}.deliveryLineNum`).d('送货单行号'),
          fieldKey: 'deliveryLineNum',
          hidden: 0,
          orderSeq: 21,
        },
        {
          fieldName: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
          fieldKey: 'supplierCode',
          hidden: 0,
          orderSeq: 22,
        },
        {
          fieldName: intl.get(`${modelPrompt}.supplierName`).d('供应商描述'),
          fieldKey: 'supplierName',
          hidden: 0,
          orderSeq: 23,
        },
        {
          fieldName: intl.get(`${modelPrompt}.productDate`).d('生产日期'),
          fieldKey: 'productDate',
          hidden: 0,
          orderSeq: 24,
        },
        {
          fieldName: intl.get(`${modelPrompt}.effectiveDate`).d('有效日期'),
          fieldKey: 'effectiveDate',
          hidden: 0,
          orderSeq: 25,
        },
        {
          fieldName: intl.get(`${modelPrompt}.enableDate`).d('启用时间'),
          fieldKey: 'enableDate',
          hidden: 0,
          orderSeq: 26,
        },
        {
          fieldName: intl.get(`${modelPrompt}.deadlineDate`).d('截止时间'),
          fieldKey: 'deadlineDate',
          hidden: 0,
          orderSeq: 27,
        },
        {
          fieldName: intl.get(`${modelPrompt}.inLocatorTime`).d('入库时间'),
          fieldKey: 'inLocatorTime',
          hidden: 0,
          orderSeq: 28,
        },
        {
          fieldName: intl.get(`${modelPrompt}.enableDate`).d('外箱条码'),
          fieldKey: 'outMaterialLotCode',
          hidden: 0,
          orderSeq: 29,
        },
        {
          fieldName: intl.get(`${modelPrompt}.originalCode`).d('原始条码'),
          fieldKey: 'originalCode',
          hidden: 0,
          orderSeq: 30,
        },
        {
          fieldName: intl.get(`${modelPrompt}.containerCode`).d('容器条码'),
          fieldKey: 'containerCode',
          hidden: 0,
          orderSeq: 31,
        },
        {
          fieldName: intl.get(`${modelPrompt}.eoNum`).d('EO编码'),
          fieldKey: 'eoNum',
          hidden: 0,
          orderSeq: 32,
        },
        {
          fieldName: intl.get(`${modelPrompt}.currentWck`).d('当前WKC'),
          fieldKey: 'currentWck',
          hidden: 0,
          orderSeq: 33,
        },
        {
          fieldName: intl.get(`${modelPrompt}.finalProcessWck`).d('最后加工WKC'),
          fieldKey: 'finalProcessWck',
          hidden: 0,
          orderSeq: 34,
        },
        {
          fieldName: intl.get(`${modelPrompt}.finalProcessWck`).d('实验代码'),
          fieldKey: 'labCode',
          hidden: 0,
          orderSeq: 35,
        },
        {
          fieldName: intl.get(`${modelPrompt}.reworkFlag`).d('返修标识'),
          fieldKey: 'reworkFlag',
          hidden: 0,
          orderSeq: 36,
        },
        {
          fieldName: intl.get(`${modelPrompt}.designedReworkFlagMeaning`).d('指定工艺路线返修标识'),
          fieldKey: 'designedReworkFlagMeaning',
          hidden: 0,
          orderSeq: 37,
        },
        {
          fieldName: intl.get(`${modelPrompt}.reworkRouterName`).d('指定返修工艺路线'),
          fieldKey: 'reworkRouterName',
          hidden: 0,
          orderSeq: 38,
        },
        {
          fieldName: intl.get(`${modelPrompt}.mfFlagMeaning`).d('在制品标识'),
          fieldKey: 'mfFlagMeaning',
          hidden: 0,
          orderSeq: 39,
        },
        {
          fieldName: intl.get(`${modelPrompt}.freezeFlagMeaning`).d('冻结标识'),
          fieldKey: 'freezeFlagMeaning',
          hidden: 0,
          orderSeq: 40,
        },
        {
          fieldName: intl.get(`${modelPrompt}.replacementFlagMeaning`).d('料废调换标识'),
          fieldKey: 'replacementFlagMeaning',
          hidden: 0,
          orderSeq: 41,
        },
        {
          fieldName: intl.get(`${modelPrompt}.stocktakeFlagMeaning`).d('盘点停用标识'),
          fieldKey: 'stocktakeFlagMeaning',
          hidden: 0,
          orderSeq: 42,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lastUpdateBy`).d('SAP账务处理标识'),
          fieldKey: 'sapAccountFlagMeaning',
          hidden: 0,
          orderSeq: 43,
        },
        {
          fieldName: intl.get(`${modelPrompt}.createBy`).d('创建人'),
          fieldKey: 'createBy',
          hidden: 0,
          orderSeq: 44,
        },
        {
          fieldName: intl.get(`${modelPrompt}.createDate`).d('创建时间'),
          fieldKey: 'createDate',
          hidden: 0,
          orderSeq: 45,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lastUpdateBy`).d('最后更新人'),
          fieldKey: 'lastUpdateBy',
          hidden: 0,
          orderSeq: 46,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lastUpdateDate`).d('最后更新时间'),
          fieldKey: 'lastUpdateDate',
          hidden: 0,
          orderSeq: 47,
        },
      ],
      customColumns: [
        {
          fieldName: intl.get(`${modelPrompt}.materialLotCode`).d('条码号'),
          fieldKey: 'materialLotCode',
          hidden: 0,
          fixedLeft: 0,
          fixedRight: 0,
          orderSeq: 0,
        },
        {
          fieldName: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
          fieldKey: 'materialCode',
          hidden: 0,
          orderSeq: 1,
        },
        {
          fieldName: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
          fieldKey: 'materialName',
          hidden: 0,
          orderSeq: 2,
        },
        {
          fieldName: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
          fieldKey: 'materialVersion',
          hidden: 0,
          orderSeq: 3,
        },
        {
          fieldName: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
          fieldKey: 'enableFlagMeaning',
          hidden: 0,
          orderSeq: 4,
        },
        {
          fieldName: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
          fieldKey: 'primaryUomQty',
          hidden: 0,
          orderSeq: 5,
        },
        {
          fieldName: intl.get(`${modelPrompt}.primaryUomName`).d('单位'),
          fieldKey: 'primaryUomName',
          hidden: 0,
          orderSeq: 6,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lot`).d('批次'),
          fieldKey: 'lot',
          hidden: 0,
          orderSeq: 7,
        },
        {
          fieldName: intl.get(`${modelPrompt}.supplierLot`).d('供应商批次'),
          fieldKey: 'supplierLot',
          hidden: 0,
          orderSeq: 8,
        },
        {
          fieldName: intl.get(`${modelPrompt}.statusMeaning`).d('状态'),
          fieldKey: 'statusMeaning',
          hidden: 0,
          orderSeq: 9,
        },
        {
          fieldName: intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态'),
          fieldKey: 'qualityStatusMeaning',
          hidden: 0,
          orderSeq: 10,
        },
        {
          fieldName: intl.get(`${modelPrompt}.performanceLevelMeaning`).d('性能等级'),
          fieldKey: 'performanceLevelMeaning',
          hidden: 0,
          orderSeq: 11,
        },
        {
          fieldName: intl.get(`${modelPrompt}.siteName`).d('工厂'),
          fieldKey: 'siteName',
          hidden: 0,
          orderSeq: 12,
        },
        {
          fieldName: intl.get(`${modelPrompt}.wareHouseCode`).d('仓库'),
          fieldKey: 'wareHouseCode',
          hidden: 0,
          orderSeq: 13,
        },
        {
          fieldName: intl.get(`${modelPrompt}.locatorCode`).d('货位'),
          fieldKey: 'locatorCode',
          hidden: 0,
          orderSeq: 14,
        },
        {
          fieldName: intl.get(`${modelPrompt}.actualLocatorCode`).d('实际存储货位'),
          fieldKey: 'actualLocatorCode',
          hidden: 0,
          orderSeq: 15,
        },
        {
          fieldName: intl.get(`${modelPrompt}.soNum`).d('销售订单号'),
          fieldKey: 'soNum',
          hidden: 0,
          orderSeq: 16,
        },
        {
          fieldName: intl.get(`${modelPrompt}.soLineNum`).d('销售订单行号'),
          fieldKey: 'soLineNum',
          hidden: 0,
          orderSeq: 17,
        },
        {
          fieldName: intl.get(`${modelPrompt}.poNum`).d('采购订单号'),
          fieldKey: 'poNum',
          hidden: 0,
          orderSeq: 18,
        },
        {
          fieldName: intl.get(`${modelPrompt}.poLineNum`).d('采购订单行号'),
          fieldKey: 'poLineNum',
          hidden: 0,
          orderSeq: 19,
        },
        {
          fieldName: intl.get(`${modelPrompt}.deliveryNum`).d('送货单号'),
          fieldKey: 'deliveryNum',
          hidden: 0,
          orderSeq: 20,
        },
        {
          fieldName: intl.get(`${modelPrompt}.deliveryLineNum`).d('送货单行号'),
          fieldKey: 'deliveryLineNum',
          hidden: 0,
          orderSeq: 21,
        },
        {
          fieldName: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
          fieldKey: 'supplierCode',
          hidden: 0,
          orderSeq: 22,
        },
        {
          fieldName: intl.get(`${modelPrompt}.supplierName`).d('供应商描述'),
          fieldKey: 'supplierName',
          hidden: 0,
          orderSeq: 23,
        },
        {
          fieldName: intl.get(`${modelPrompt}.productDate`).d('生产日期'),
          fieldKey: 'productDate',
          hidden: 0,
          orderSeq: 24,
        },
        {
          fieldName: intl.get(`${modelPrompt}.effectiveDate`).d('有效日期'),
          fieldKey: 'effectiveDate',
          hidden: 0,
          orderSeq: 25,
        },
        {
          fieldName: intl.get(`${modelPrompt}.enableDate`).d('启用时间'),
          fieldKey: 'enableDate',
          hidden: 0,
          orderSeq: 26,
        },
        {
          fieldName: intl.get(`${modelPrompt}.deadlineDate`).d('截止时间'),
          fieldKey: 'deadlineDate',
          hidden: 0,
          orderSeq: 27,
        },
        {
          fieldName: intl.get(`${modelPrompt}.inLocatorTime`).d('入库时间'),
          fieldKey: 'inLocatorTime',
          hidden: 0,
          orderSeq: 28,
        },
        {
          fieldName: intl.get(`${modelPrompt}.enableDate`).d('外箱条码'),
          fieldKey: 'outMaterialLotCode',
          hidden: 0,
          orderSeq: 29,
        },
        {
          fieldName: intl.get(`${modelPrompt}.originalCode`).d('原始条码'),
          fieldKey: 'originalCode',
          hidden: 0,
          orderSeq: 30,
        },
        {
          fieldName: intl.get(`${modelPrompt}.containerCode`).d('容器条码'),
          fieldKey: 'containerCode',
          hidden: 0,
          orderSeq: 31,
        },
        {
          fieldName: intl.get(`${modelPrompt}.eoNum`).d('EO编码'),
          fieldKey: 'eoNum',
          hidden: 0,
          orderSeq: 32,
        },
        {
          fieldName: intl.get(`${modelPrompt}.currentWck`).d('当前WKC'),
          fieldKey: 'currentWck',
          hidden: 0,
          orderSeq: 33,
        },
        {
          fieldName: intl.get(`${modelPrompt}.finalProcessWck`).d('最后加工WKC'),
          fieldKey: 'finalProcessWck',
          hidden: 0,
          orderSeq: 34,
        },
        {
          fieldName: intl.get(`${modelPrompt}.finalProcessWck`).d('实验代码'),
          fieldKey: 'labCode',
          hidden: 0,
          orderSeq: 35,
        },
        {
          fieldName: intl.get(`${modelPrompt}.reworkFlag`).d('返修标识'),
          fieldKey: 'reworkFlag',
          hidden: 0,
          orderSeq: 36,
        },
        {
          fieldName: intl.get(`${modelPrompt}.designedReworkFlagMeaning`).d('指定工艺路线返修标识'),
          fieldKey: 'designedReworkFlagMeaning',
          hidden: 0,
          orderSeq: 37,
        },
        {
          fieldName: intl.get(`${modelPrompt}.reworkRouterName`).d('指定返修工艺路线'),
          fieldKey: 'reworkRouterName',
          hidden: 0,
          orderSeq: 38,
        },
        {
          fieldName: intl.get(`${modelPrompt}.mfFlagMeaning`).d('在制品标识'),
          fieldKey: 'mfFlagMeaning',
          hidden: 0,
          orderSeq: 39,
        },
        {
          fieldName: intl.get(`${modelPrompt}.freezeFlagMeaning`).d('冻结标识'),
          fieldKey: 'freezeFlagMeaning',
          hidden: 0,
          orderSeq: 40,
        },
        {
          fieldName: intl.get(`${modelPrompt}.replacementFlagMeaning`).d('料废调换标识'),
          fieldKey: 'replacementFlagMeaning',
          hidden: 0,
          orderSeq: 41,
        },
        {
          fieldName: intl.get(`${modelPrompt}.stocktakeFlagMeaning`).d('盘点停用标识'),
          fieldKey: 'stocktakeFlagMeaning',
          hidden: 0,
          orderSeq: 42,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lastUpdateBy`).d('SAP账务处理标识'),
          fieldKey: 'sapAccountFlagMeaning',
          hidden: 0,
          orderSeq: 43,
        },
        {
          fieldName: intl.get(`${modelPrompt}.createBy`).d('创建人'),
          fieldKey: 'createBy',
          hidden: 0,
          orderSeq: 44,
        },
        {
          fieldName: intl.get(`${modelPrompt}.createDate`).d('创建时间'),
          fieldKey: 'createDate',
          hidden: 0,
          orderSeq: 45,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lastUpdateBy`).d('最后更新人'),
          fieldKey: 'lastUpdateBy',
          hidden: 0,
          orderSeq: 46,
        },
        {
          fieldName: intl.get(`${modelPrompt}.lastUpdateDate`).d('最后更新时间'),
          fieldKey: 'lastUpdateDate',
          hidden: 0,
          orderSeq: 47,
        },
      ],
      filterVisible: false,
    };
  }

  /**
   *  关闭筛选框
   */
  filterClose = () => {
    this.setState({
      filterVisible: false,
    });
  };

  /**
   * 打开筛选框
   */
  filterOpen = () => {
    if (this.state.filterVisible === false) {
      this.setState({
        filterVisible: true,
      });
    } else {
      this.setState({
        filterVisible: false,
      });
    }
  };

  /**
   *  table实时显示动态列
   * @param filterColumns
   */
  getfilterData = filterColumns => {
    this.setState({
      customColumns: [...filterColumns],
    });
  };

  /**
   * 列筛选框点击事件
   * @param customColumns
   */
  handleCustomColumnFilter = customColumns => {
    this.setState({
      customColumns,
    });
  };

  /**
   * tableScrollWidth - 计算滚动表格的宽度
   * 如果 fixWidth 不传或者为0, 会将没有设置宽度的列 宽度假设为 200
   * @param {array} columns - 表格列
   * @param {number} fixWidth - 不固定宽度列需要补充的宽度
   * @return {number} - 返回计算过的 x 值
   */
  tableScrollWidth(columns = [], fixWidth = 0) {
    let fillFixWidthCount = 0;
    let columnsObject = [];
    columnsObject = columns;
    this.state.customColumns.forEach(e => {
      if (e.hidden === 1) {
        columns.forEach((x, index) => {
          if (e.fieldKey === x.dataIndex) {
            columnsObject[index] = { ...x, ...{ width: 0 } };
          }
        });
      }
    });
    const total = columnsObject.reduce((prev, current) => {
      if (current.width) {
        return prev + current.width;
      }
      fillFixWidthCount += 1;
      return prev;
    }, 0);
    if (fixWidth) {
      return total + fixWidth + 1;
    }
    return total + fillFixWidthCount * 200 + 1;
  }

  // 跳转至工艺路线
  @Bind()
  jumpProcessList(record) {
    const id = record ? record.reworkRouterId : 'create';
    this.props.history.push(`/hmes/process/routes/dist/${id}`);
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const { filterVisible, filterColum, customColumns } = this.state;
    const { loading, dataSource, pagination, selectedRowKeys, onSelectRow, onSearch, updateMaterialVersion } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('条码号'),
        dataIndex: 'materialLotCode',
        width: 200,
        render: (val, record) => (
          <a className="action-link" onClick={() => updateMaterialVersion(record)}>
            {val}
          </a>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        dataIndex: 'materialName',
        width: 200,
        render: (val, record) => (
          <Tooltip title={record.materialName}>
            <div
              style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            >
              {record.materialName}
            </div>
          </Tooltip>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.materialVersion`).d('物料版本'),
        dataIndex: 'materialVersion',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('是否有效'),
        dataIndex: 'enableFlagMeaning',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomQty`).d('数量'),
        dataIndex: 'primaryUomQty',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.primaryUomName`).d('单位'),
        dataIndex: 'primaryUomName',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.lot`).d('批次'),
        dataIndex: 'lot',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.supplierLot`).d('供应商批次'),
        dataIndex: 'supplierLot',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.statusMeaning`).d('状态'),
        dataIndex: 'statusMeaning',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.qualityStatusMeaning`).d('质量状态'),
        dataIndex: 'qualityStatusMeaning',
        width: 100,
      },
      {
        title: '性能等级',
        dataIndex: 'performanceLevelMeaning',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('工厂'),
        dataIndex: 'siteName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.wareHouseCode`).d('仓库'),
        dataIndex: 'wareHouseCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('货位'),
        dataIndex: 'locatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.actualLocatorName`).d('实际存储货位'),
        dataIndex: 'actualLocatorCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.soNum`).d('销售订单号'),
        dataIndex: 'soNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.soLineNum`).d('销售订单行号'),
        dataIndex: 'soLineNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.poNum`).d('采购订单号'),
        dataIndex: 'poNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.poLineNum`).d('采购订单行号'),
        dataIndex: 'poLineNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.deliveryNum`).d('送货单号'),
        dataIndex: 'deliveryNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.deliveryLineNum`).d('送货单行号'),
        dataIndex: 'deliveryLineNum',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.supplierCode`).d('供应商编码'),
        dataIndex: 'supplierCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.supplierName`).d('供应商描述'),
        dataIndex: 'supplierName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.productDate`).d('生产日期'),
        dataIndex: 'productDate',
        width: 120,
        render: dateRender,
      },
      {
        title: '有效期',
        dataIndex: 'effectiveDate',
        width: 120,
        render: dateRender,
      },
      {
        title: intl.get(`${modelPrompt}.enableDate`).d('启用时间'),
        dataIndex: 'enableDate',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.deadlineDate`).d('截止时间'),
        dataIndex: 'deadlineDate',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.inLocatorTime`).d('入库时间'),
        dataIndex: 'inLocatorTime',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.outMaterialLotCode`).d('外箱条码'),
        dataIndex: 'outMaterialLotCode',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.originalCode`).d('原始条码'),
        dataIndex: 'originalCode',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.containerCode`).d('容器条码'),
        dataIndex: 'containerCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.eoNum`).d('EO编码'),
        dataIndex: 'eoNum',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.currentWck`).d('当前WKC'),
        dataIndex: 'currentWck',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.finalProcessWck`).d('最后加工WKC'),
        dataIndex: 'finalProcessWck',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.labCode`).d('实验代码'),
        dataIndex: 'labCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.reworkFlag`).d('返修标识'),
        dataIndex: 'reworkFlag',
        width: 120,
        render: val => val === 'Y' ? '是' : val === 'N' ? '否' : '',
      },
      {
        title: intl.get(`${modelPrompt}.designedReworkFlagMeaning`).d('指定工艺路线返修标识'),
        dataIndex: 'designedReworkFlagMeaning',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.reworkRouterName`).d('指定返修工艺路线'),
        dataIndex: 'reworkRouterName',
        width: 140,
        render: (val, record) => (
          <a onClick={() => this.jumpProcessList(record)}>
            {val}
          </a>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.mfFlagMeaning`).d('在制品标识'),
        dataIndex: 'mfFlagMeaning',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.freezeFlagMeaning`).d('冻结标识'),
        dataIndex: 'freezeFlagMeaning',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.replacementFlagMeaning`).d('料废调换标识'),
        dataIndex: 'replacementFlagMeaning',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.stocktakeFlagMeaning`).d('盘点停用标识'),
        dataIndex: 'stocktakeFlagMeaning',
        width: 140,
      },
      {
        title: 'SAP账务标识',
        dataIndex: 'sapAccountFlagMeaning',
        width: 140,
      },
      {
        title: intl.get(`${modelPrompt}.createBy`).d('创建人'),
        dataIndex: 'createBy',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.createDate`).d('创建时间'),
        dataIndex: 'createDate',
        width: 160,
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateBy`).d('最后更新人'),
        dataIndex: 'lastUpdateBy',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateDate`).d('最后更新时间'),
        dataIndex: 'lastUpdateDate',
        width: 160,
      },
    ];
    const filterTableProps = {
      modelPrompt,
      record: customColumns,
      colums: filterColum,
      filterClose: this.filterClose.bind(this),
      getfilterData: this.getfilterData.bind(this),
    };
    const menu1 = (
      <Menu style={{ width: 280, height: 360 }}>
        <Menu.Item>
          <EditableTable {...filterTableProps} />
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Dropdown
          overlay={menu1}
          placement="bottomLeft"
          trigger={['click']}
          visible={filterVisible}
        >
          <a
            onClick={() => this.filterOpen()}
            href="#"
            style={{ marginLeft: '98%', marginBottom: 5 }}
          >
            <svg
              t="1565754298719"
              className="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="3212"
              width="16"
              height="16"
            >
              <path
                d="M877.714286 665.6V36.571429c0-21.942857-14.628571-36.571429-36.571429-36.571429s-36.571429 14.628571-36.571428 36.571429v629.028571c-43.885714 14.628571-73.142857 58.514286-73.142858 102.4 0 43.885714 29.257143 87.771429 73.142858 102.4v117.028571c0 21.942857 14.628571 36.571429 36.571428 36.571429s36.571429-14.628571 36.571429-36.571429v-117.028571c43.885714-14.628571 73.142857-58.514286 73.142857-102.4 0-51.2-29.257143-87.771429-73.142857-102.4z m-36.571429 138.971429c-21.942857 0-36.571429-14.628571-36.571428-36.571429s14.628571-36.571429 36.571428-36.571429 36.571429 14.628571 36.571429 36.571429-14.628571 36.571429-36.571429 36.571429zM146.285714 665.6V36.571429c0-21.942857-14.628571-36.571429-36.571428-36.571429S73.142857 14.628571 73.142857 36.571429v629.028571c-43.885714 14.628571-73.142857 51.2-73.142857 102.4 0 43.885714 29.257143 87.771429 73.142857 102.4v117.028571c0 21.942857 14.628571 36.571429 36.571429 36.571429s36.571429-14.628571 36.571428-36.571429v-117.028571c43.885714-14.628571 73.142857-58.514286 73.142857-102.4 0-51.2-29.257143-87.771429-73.142857-102.4zM109.714286 804.571429c-21.942857 0-36.571429-14.628571-36.571429-36.571429s14.628571-36.571429 36.571429-36.571429 36.571429 14.628571 36.571428 36.571429-14.628571 36.571429-36.571428 36.571429zM512 153.6V36.571429c0-21.942857-14.628571-36.571429-36.571429-36.571429S438.857143 14.628571 438.857143 36.571429v117.028571c-43.885714 14.628571-73.142857 58.514286-73.142857 102.4s29.257143 87.771429 73.142857 102.4v629.028571c0 21.942857 14.628571 36.571429 36.571428 36.571429s36.571429-14.628571 36.571429-36.571429V358.4c43.885714-14.628571 73.142857-58.514286 73.142857-102.4s-29.257143-87.771429-73.142857-102.4zM475.428571 292.571429c-21.942857 0-36.571429-14.628571-36.571428-36.571429s14.628571-36.571429 36.571428-36.571429 36.571429 14.628571 36.571429 36.571429-14.628571 36.571429-36.571429 36.571429z"
                p-id="3213"
                fill="#8a8a8a"
              />
            </svg>
          </a>
        </Dropdown>
        <Table
          bordered
          rowKey="materialLotId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={{ ...pagination, pageSizeOptions: ['10', '50', '100', '200', '500', '1000'] }}
          scroll={{ x: this.tableScrollWidth(columns, 50) }}
          rowSelection={{
            fixed: true,
            columnWidth: 50,
            selectedRowKeys,
            onChange: onSelectRow,
          }}
          onChange={page => onSearch(page)}
          customCode="customTable"
          customColumns={customColumns}
          onCustomColumnFilter={this.handleCustomColumnFilter.bind(this)}
        />
      </div>
    );
  }
}
export default withRouter(ListTable);
