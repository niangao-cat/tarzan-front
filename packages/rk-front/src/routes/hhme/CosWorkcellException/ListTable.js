/*
 * @Description: 工位加工异常列表
 * @version: 0.1.0
 * @Author: junfeng.chen@hand-china.com
 * @Date: 2021-01-13 09:01:34
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
    const modelPrompt = 'hhme.cosWorkcellException.model.cosWorkcellException';
    const { loading, dataSource, pagination, onSearch, fetchHeadPrintLoading } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.productionVersion`).d('工单版本'),
        dataIndex: 'productionVersion',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.productionVersionDescription`).d('版本描述'),
        dataIndex: 'productionVersionDescription',
        width: 120,
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
        title: intl.get(`${modelPrompt}.qty`).d('工单芯片数'),
        dataIndex: 'qty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.woProcessNcQty`).d('工单工序不良总数'),
        dataIndex: 'woProcessNcQty',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.ncTotalQuantity`).d('不良总数'),
        dataIndex: 'ncTotalQuantity',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.ncQuantity`).d('不良数量'),
        dataIndex: 'ncQuantity',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.ncCode`).d('不良代码'),
        dataIndex: 'ncCode',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.ncCodeDescription`).d('不良代码描述'),
        dataIndex: 'ncCodeDescription',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.realName`).d('操作者'),
        dataIndex: 'realName',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.creationDate`).d('日期'),
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
        title: intl.get(`${modelPrompt}.workcellProcessName`).d('工序描述'),
        dataIndex: 'workcellProcessName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.workcellLineName`).d('工段描述'),
        dataIndex: 'workcellLineName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.prodLineName`).d('生产线描述'),
        dataIndex: 'prodLineName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.assetEncoding`).d('设备编码'),
        dataIndex: 'assetEncoding',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.assetName`).d('设备描述'),
        dataIndex: 'assetName',
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
