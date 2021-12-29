// 引入依赖
import React from 'react';
import { Table, Spin } from 'hzero-ui';
import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class HeadListTable extends React.Component {
  // 直接渲染
  render() {
    // 护球上文参数
    const {
      loading,
      dataSource,
      pagination,
      fetchHeadPrintLoading,
      selectedHeadKeys,
      onSelectHead,
      onSearch,
      onRow,
      headPrint,
    } = this.props;

    // 列展示

    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.instructionDocNum`).d('库存调拨单'),
        dataIndex: 'instructionDocNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.siteCode`).d('工厂'),
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocStatus`).d('单据状态'),
        dataIndex: 'instructionDocStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionDocType`).d('单据类型'),
        width: 120,
        dataIndex: 'instructionDocTypeMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.createdBy`).d('制单人'),
        dataIndex: 'createdUserName',
      },
      {
        title: intl.get(`${commonModelPrompt}.creationDate`).d('创建时间'),
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
      },
      {
        title: intl.get(`${commonModelPrompt}.printFlagMeaning`).d('打印标识'),
        dataIndex: 'printFlagMeaning',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        fixed: 'right',
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            <a onClick={() => onRow(record)}>更新</a>&nbsp;
            <a onClick={() => headPrint(record, index)}>
              {intl.get('tarzan.acquisition.transformation.button.edit').d("打印")}
            </a>
          </span>
        ),
      },
    ];
    return (
      <Spin spinning={fetchHeadPrintLoading ||false}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          rowSelection={{
            selectedRowKeys: selectedHeadKeys,
            type: 'radio', // 单选
            onChange: onSelectHead,
          }}
          onChange={page => onSearch(page)}
          loading={loading}
        />
      </Spin>
    );
  }
}
