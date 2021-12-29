import React, { PureComponent } from 'react';
import classNames from 'classnames';
import EditTable from 'components/EditTable';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import styles from './index.less';

export default class ListTable extends PureComponent {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      loading,
      dataSource,
      pagination,
      onSearch,
      onEdit,
    } = this.props;
    const columns = [
      {
        title: intl.get('entity.employee.code').d('员工编码'),
        dataIndex: 'employeeNum',
        width: 200,
      },
      {
        title: intl.get('entity.employee.name').d('员工姓名'),
        dataIndex: 'name',
        width: 200,
      },
      {
        title: intl.get('hpfm.employee.model.employee.quickIndex').d('快速索引'),
        dataIndex: 'quickIndex',
        width: 200,
      },
      {
        title: intl.get('hpfm.employee.model.employee.phoneticize').d('拼音'),
        dataIndex: 'phoneticize',
        width: 200,
      },
      {
        title: intl.get('hzero.common.email').d('邮箱'),
        dataIndex: 'email',
      },
      {
        title: intl.get('hzero.common.cellphone').d('手机号'),
        dataIndex: 'mobile',
        width: 200,
      },
      {
        title: intl.get('hpfm.employee.model.employee.entryDate').d('入职日期'),
        dataIndex: 'entryDate',
        width: 200,
      },
      {
        title: intl.get('hpfm.employee.model.employee.status').d('员工状态'),
        dataIndex: 'status',
        width: 150,
      },
      {
        title: intl.get('hzero.common.status').d('状态'),
        dataIndex: 'enabledFlag',
        width: 100,
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 90,
        fixed: 'right',
        align: 'center',
        render: (val, record) => {
          return (
            <a onClick={() => onEdit(record.employeeId, record.employeeNum)}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </a>
          );
        },
      },
    ];
    return (
      <EditTable
        bordered
        scroll={{ x: tableScrollWidth(columns, 200) }}
        rowKey="employeeId"
        loading={loading}
        className={classNames(styles['hpfm-hr-list'])}
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={page => onSearch(page)}
      />
    );
  }
}
