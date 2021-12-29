/*
 * @Description: 不良情况说明
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import React, { PureComponent, Fragment } from 'react';
// import {
//   BorderBox12,
// } from '@jiaminghi/data-view-react';
import { Table } from 'hzero-ui';
import styles from './index.less';
// import CategoryCharts from './CategoryCharts';
// import { ModuleTitle } from '../globalStyledSet';

export default class ProLineCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getRowClassName = (record, index) => {
    let className = '';
    className = index % 2 === 0 ? "oddRow" : "evenRow";
    return className;
  }

  render() {
    const columns = [
      {
        title: '序号',
        width: 80,
        render: (value, record, index) => {
          const { page, pageSize } = this.props;
          return ( page * pageSize) + index + 1;
        },
      },
      {
        title: '型号',
        dataIndex: 'itemGroupDescription',
        width: 200,
      },
      {
        title: 'sn编码',
        dataIndex: 'identification',
        width: 200,
      },
      {
        title: '检验人员',
        dataIndex: 'realName',
        width: 120,
      },
      {
        title: '不良分类',
        dataIndex: 'description',
        width: 200,
      },
      {
        title: '不良描述',
        dataIndex: 'comments',
        width: 200,
      },
      {
        title: '不良发起时间',
        dataIndex: 'creationDate',
        width: 200,
      },
    ];

    const { badConditionList } = this.props;
    return (
      <Fragment>
        <div className={styles['production-baord-one-BorderBox14']}>
          <div className={styles.inspection}>
            <div className={styles['production-board-title']}>
              <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '3px', float: 'left', marginTop: '0.08rem' }} />
              <div className={styles['production-baord-one-div']}>不良情况说明</div>
            </div>
            <Table
              dataSource={badConditionList}
              columns={columns}
              style={{ width: '100%', padding: '10px' }}
              rowClassName={this.getRowClassName}
              pagination={false}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}
