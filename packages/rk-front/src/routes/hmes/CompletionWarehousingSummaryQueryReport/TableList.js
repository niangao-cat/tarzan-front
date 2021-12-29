/**
 * @Author:lly
 * @email: liyuan.liu@hand-china.com
 * @description： 完工及入库汇总查询报表
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';
import { tableScrollWidth } from 'utils/utils';

class TableList extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const commonModelPrompt = 'tarzan.hwms.completionWarehousingSummaryQueryReport';
    const { loading, dataSource, pagination, onSearch } = this.props;
    // 设置显示数据
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.siteCode`).d('站点'),
        dataIndex: 'siteCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.areaCode`).d('制造部'),
        dataIndex: 'areaCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.areaName`).d('制造部名称'),
        dataIndex: 'areaName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('生产线'),
        dataIndex: 'prodLineName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('产品编码'),
        dataIndex: 'materialCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName`).d('产品描述'),
        dataIndex: 'materialName',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.productionVersion`).d('版本号'),
        dataIndex: 'productionVersion',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.finishQty`).d('完工数量'),
        dataIndex: 'finishQty',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.warehousingQty`).d('入库数量'),
        dataIndex: 'warehousingQty',
        width: '100',
        align: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.locatorCode`).d('库存地点'),
        dataIndex: 'locatorCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.itemGroupCode`).d('物料组'),
        dataIndex: 'itemGroupCode',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.itemGroupDescription`).d('物料组描述'),
        dataIndex: 'itemGroupDescription',
        width: '100',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCategoryMeaning`).d('物料分类'),
        dataIndex: 'materialCategoryMeaning',
        width: '100',
        align: 'center',
      },
    ];
    return (
      <Table
        bordered
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        scroll={{ x: tableScrollWidth(columns) }}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default TableList;
