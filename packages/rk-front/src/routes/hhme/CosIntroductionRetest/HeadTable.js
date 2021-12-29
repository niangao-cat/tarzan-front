/*
 * @Description: 头
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2021-01-25 18:07:32
 * @LastEditTime: 2021-01-26 10:18:41
 */
import React from 'react';
import { Bind } from 'lodash-decorators';
import { Table } from 'hzero-ui';
import styles from './index.less';

export default class HeadTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  @Bind()
  handleClickRow(record) {
    const { headRecord } = this.props;
    if (headRecord.retestImportDataId === record.retestImportDataId) {
      return styles['cos-introduction-retest-data-click'];
    } else {
      return '';
    }
  }


  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      selectedRowKeys,
      onSelectRow,
      handleFetchLine,
    } = this.props;
    const columns = [
      {
        title: '是否打印',
        width: 100,
        dataIndex: 'printFlagMeaning',
      },
      {
        title: '目标条码',
        width: 120,
        dataIndex: 'targetBarcode',
        render: (val, record) => (
          <a className="action-link" onClick={() => handleFetchLine(record)}>
            {val}
          </a>
        ),
      },
      {
        title: '来料条码',
        width: 100,
        dataIndex: 'sourceBarcode',
      },
      {
        title: '工单',
        width: 100,
        dataIndex: 'workNum',
      },
      {
        title: '工位',
        width: 100,
        dataIndex: 'workcell',
      },
      {
        title: 'cos类型',
        width: 100,
        dataIndex: 'cosTypeMeaning',
      },
      {
        title: '导入批次',
        dataIndex: 'importLot',
        width: 100,
      },
      {
        title: '盒号',
        dataIndex: 'foxNum',
        width: 100,
      },
      {
        title: '操作人',
        dataIndex: 'operatorName',
        width: 100,
      },
      {
        title: '导入人',
        dataIndex: 'createByName',
        width: 100,
      },
      {
        title: '导入时间',
        dataIndex: 'creationDate',
        width: 100,
      },
    ];
    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectRow,
        }}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="retestImportDataId"
        rowClassName={this.handleClickRow}
      />
    );
  }
}
