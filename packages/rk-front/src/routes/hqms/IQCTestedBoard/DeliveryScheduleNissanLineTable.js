import React from 'react';
import { Table } from 'hzero-ui';

import styles from './index.less';

const DeliveryScheduleNissanLineTable = React.memo(props => {
  const columns = [
    {
      title: '单据号',
      width: 60,
      dataIndex: 'iqcNumber',
      align: 'center',
    },
    {
      title: '物料',
      width: 60,
      dataIndex: 'materialCode',
      align: 'center',
    },
    {
      title: '物料描述',
      width: 60,
      dataIndex: 'materialName',
      align: 'center',
    },
    {
      title: '供应商编码',
      width: 60,
      dataIndex: 'supplierName',
      align: 'center',
    },
    {
      title: '送检数量',
      width: 60,
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: '不良明细',
      width: 60,
      align: 'center',
      dataIndex: 'remark',
    },
  ];
  return (
    <div className={styles['iqc-test-border-table']}>
      <Table
        bordered
        dataSource={props.dataSource}
        columns={columns}
        pagination={false}
        size="small"
      />
    </div>
  );
});

export default DeliveryScheduleNissanLineTable;
