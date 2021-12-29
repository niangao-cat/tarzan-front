/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（头表）
 */
// 引入依赖
import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';

const modelPrompt = 'tarzan.selectionRuleMaintenance';

export default class HeadListTable extends React.Component {
  render() {
    const { loading, dataSource, pagination, selectedHeadKeys, onSearch, onClickHeadRadio } = this.props;

    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('芯片料号'),
        dataIndex: 'materialCode',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.cosTypeMeaning`).d('芯片类型'),
        dataIndex: 'cosType',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.loadSequence`).d('芯片序列号'),
        dataIndex: 'loadSequence',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.materialLotCode`).d('条码号'),
        dataIndex: 'materialLotCode',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.wafer`).d('WAFER'),
        dataIndex: 'wafer',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.rowCloumn`).d('盒内位置'),
        dataIndex: 'rowCloumn',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.hotSinkCode`).d('热沉'),
        dataIndex: 'hotSinkCode',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.locatorCode`).d('库位'),
        dataIndex: 'locatorCode',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.states`).d('状态'),
        dataIndex: 'states',
        align: 'center',
      },
    ];

    return (
      <div className="tableClass">
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          rowKey="loadSequence"
          pagination={pagination}
          rowSelection={{
            selectedRowKeys: selectedHeadKeys,
            type: 'radio', // 单选
            onChange: onClickHeadRadio,
          }}
          onChange={page => onSearch(page)}
          loading={loading}
        />
      </div>
    );
  }
}
