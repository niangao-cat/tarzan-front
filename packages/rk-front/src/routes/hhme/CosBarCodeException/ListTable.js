/*
 * @Description: COS条码加工异常汇
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-26 09:01:34
 */

import React, { Component } from 'react';
import { Table, Spin } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';


class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const modelPrompt = 'hhme.cosBarCodeException.model.cosBarCodeException';
    const { loading, dataSource, pagination, onSearch, fetchHeadPrintLoading } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.workOrderNum`).d('工单'),
        dataIndex: 'workOrderNum',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.productionVersion`).d('工单版本'),
        dataIndex: 'productionVersion',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.productionVersion`).d('版本描述'),
        dataIndex: 'productionVersion',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('产品编码'),
        dataIndex: 'materialCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('产品描述'),
        dataIndex: 'materialName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.qty`).d('工单芯片数'),
        dataIndex: 'qty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.waferNum`).d('WAFER'),
        dataIndex: 'waferNum',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.cosType`).d('COS类型'),
        dataIndex: 'cosType',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.labCode`).d('实验代码'),
        dataIndex: 'labCode',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('条码'),
        dataIndex: 'materialLotCode',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.snQty`).d('COS数量'),
        dataIndex: 'snQty',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.location`).d('位置'),
        dataIndex: 'location',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.defectCountSum`).d('不良总数'),
        dataIndex: 'defectCountSum',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('不良代码'),
        dataIndex: 'description',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.hotSinkCode`).d('热沉编码'),
        dataIndex: 'hotSinkCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.heatSinkType`).d('热沉类型'),
        dataIndex: 'heatSinkType',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.heatSinkMaterialLot`).d('热沉条码'),
        dataIndex: 'heatSinkMaterialLot',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.heatSinkMaterialCode`).d('热沉物料编码'),
        dataIndex: 'heatSinkMaterialCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.heatSinkSupplierLot`).d('热沉供应商批次'),
        dataIndex: 'heatSinkSupplierLot',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.solderAusnRatio`).d('焊料金锡比'),
        dataIndex: 'solderAusnRatio',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.goldWireMaterialLot`).d('金线条码'),
        dataIndex: 'goldWireMaterialLot',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.goldWireMaterialCode`).d('金线物料编码'),
        dataIndex: 'goldWireMaterialCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.goldWireSupplierLot`).d('金线供应商批次'),
        dataIndex: 'goldWireSupplierLot',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.realName`).d('操作者'),
        dataIndex: 'realName',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('操作时间'),
        dataIndex: 'creationDate',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.workcellCode`).d('工位编码'),
        dataIndex: 'workcellCode',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.workcellName`).d('工位描述'),
        dataIndex: 'workcellName',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.processName`).d('工序描述'),
        dataIndex: 'processName',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.lineWorkcellName`).d('工段描述'),
        dataIndex: 'lineWorkcellName',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.prodLineName`).d('生产线描述'),
        dataIndex: 'prodLineName',
        width: 120,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.assetEncoding`).d('设备编码'),
        dataIndex: 'assetEncoding',
        width: 120,
      },
    ];
    return (
      <Spin spinning={fetchHeadPrintLoading ||false}>
        <Table
          bordered
          // rowKey="pqcHeaderId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={pagination}
          scroll={{ x: tableScrollWidth(columns) }}
          onChange={page => onSearch(page)}
        />
      </Spin>
    );
  }
}
export default ListTable;
