/*
 * @Description: 处置方法维护
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com wenjie.yang01@hand-china.com
 * @Date: 2020-11-25 22:08:32
 * @LastEditTime: 2020-11-25 22:10:25
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import formatterCollections from 'utils/intl/formatterCollections';

@formatterCollections({ code: 'hwms.disposalMethodsMaintenance' })
class ListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const { loading, dataSource, onSearch, handleAddData, pagination, rowsSelection } = this.props;
    const columns = [
      {
        title: '处置方法编码',
        dataIndex: 'dispositionFunction',
        width: 200,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                handleAddData(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: '处置方法描述',
        dataIndex: 'description',
        width: 150,
      },
      {
        title: '处置方法类型',
        dataIndex: 'functionTypeDescription',
        width: 200,
      },
      {
        title: '站点编码',
        dataIndex: 'siteCode',
        width: 150,
      },
      {
        title: '站点描述',
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: '工艺类型编码',
        dataIndex: 'routerName',
        width: 150,
      },
      {
        title: '工艺类型描述',
        dataIndex: 'routerDescription',
        width: 100,
      },
    ];
    return (
      <Table
        bordered
        rowKey="dispositionFunctionId"
        columns={columns}
        loading={loading}
        dataSource={dataSource}
        pagination={pagination}
        rowSelection={rowsSelection}
        onChange={page => onSearch(page)}
      />
    );
  }
}
export default ListTable;
