import React from 'react';
import { Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class HeadTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectRows: [],
    };
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectRows) {
    const { onFetchLineList } = this.props;
    this.setState({ selectRows });
    const record = selectRows[0];
    if (onFetchLineList) {
      onFetchLineList({}, record);
    }
  }

  render() {
    const { loading, dataSource, pagination, onSearch } = this.props;
    const { selectRows } = this.state;
    const rowSelection = {
      selectedRowKeys: selectRows.map(e => e.instructionDocId),
      type: 'radio', // 单选
      onChange: this.handleChangeSelectRows,
    };
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.siteName`).d('工厂'),
        width: 100,
        dataIndex: 'siteName',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('单号'),
        width: 100,
        dataIndex: 'instructionDocNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocStatus`).d('单据状态'),
        width: 120,
        dataIndex: 'instructionDocStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.supplierName`).d('供应商'),
        width: 80,
        dataIndex: 'supplierName',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdByName`).d('申请人'),
        width: 80,
        dataIndex: 'createdByName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        width: 120,
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        width: 80,
        dataIndex: 'remark',
      },
    ];

    return (
      <Table
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        scroll={{ y: 180 }}
        rowSelection={rowSelection}
        onChange={page => onSearch(page)}
        loading={loading}
        rowKey="instructionDocId"
        bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
      />
    );
  }
}
