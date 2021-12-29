/**
 * @author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 外协管理平台 视图层（创建表）
 */
// 引入依赖
import React from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';

// 默认输出
export default class LineTable extends React.Component {
  // 直接渲染
  render() {
    // 护球上文参数
    const { dataSource, pagination, onSearch, loading, lineMap = [] } = this.props;

    // 列展示

    const columns = [
      {
        title: intl.get(`loadSequence`).d('芯片序列号'),
        dataIndex: 'loadSequence',
        align: 'center',
      },
      {
        title: intl.get(`current`).d('电流'),
        dataIndex: 'current',
        align: 'center',
      },
      ...lineMap.map(v => {
        return {
          title: `${v.meaning}`,
          dataIndex: `${(v.value).toLowerCase()}`,
          align: 'center',
        };
      }),
    ];

    return (
      <div className="tableClass">
        <Table
          bordered
          dataSource={dataSource}
          loading={loading}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          rowKey="cosFunctionId"
        />
      </div>
    );
  }
}
