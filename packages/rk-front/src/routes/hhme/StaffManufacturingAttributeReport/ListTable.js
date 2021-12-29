import React from 'react';
import { Table } from 'hzero-ui';

import intl from 'utils/intl';
import styles from './index.less';

const commonModelPrompt = 'tarzan.hmes.purchaseOrder';

export default class ListTable extends React.Component {

  render () {

    const { loading, dataSource, pagination, onSearch } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.employeeNum`).d('员工编码'),
        dataIndex: 'employeeNum',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.name`).d('员工姓名'),
        dataIndex: 'name',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.qualityCode`).d('资质编码'),
        dataIndex: 'qualityCode',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.qualityTypeMeaning`).d('资质类型'),
        dataIndex: 'qualityTypeMeaning',
        width: 140,
      },
      {
        title: intl.get(`${commonModelPrompt}.qualityName`).d('资质名称'),
        dataIndex: 'qualityName',
        width: 180,
      },
      {
        title: intl.get(`${commonModelPrompt}.remark`).d('资质备注'),
        dataIndex: 'remark',
        width: 200,
      },
      {
        title: intl.get(`${commonModelPrompt}.proficiencyMeaning`).d('资质熟练度'),
        dataIndex: 'proficiencyMeaning',
        width: 120,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料编码'),
        dataIndex: 'materialCode',
        width: 140,
      },
      {
        title: intl.get(`${commonModelPrompt}.materialName'`).d('物料名称'),
        dataIndex: 'materialName',
        width: 200,
      },
      {
        title: intl.get(`${commonModelPrompt}.dateFrom`).d('有效期起'),
        dataIndex: 'dateFrom',
        width: 200,
      },
      {
        title: intl.get(`${commonModelPrompt}.dateTo`).d('有效期止'),
        dataIndex: 'dateTo',
        width: 200,
      },
    ];

    return (
      <div className={styles['head-table']}>
        <Table
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          onChange={page => onSearch(page)}
          loading={loading}
          rowKey="employeeId"
          bodyStyle={{ fontSize: '13px', lineHeight: '30px' }}
        />
      </div>
    );
  }
}
