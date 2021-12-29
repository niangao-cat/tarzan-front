/**
 * @Description: 立库出库平台
 * @author: lly
 * @date 2021/07/06 11:11
 * @version 1.0
 */

import React from 'react';
import { Row, Col, Table, Card } from 'hzero-ui';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import SunriseLibraryTaskSummary from './SunriseLibraryTaskSummary';
// import styles from '../index.less';


const commonModelPrompt = 'hwms.tarzan.state-and-out-library-platform';
export default class OutLibrarySpecifyQuery extends React.Component {

  // 直接渲染
  render() {
    // 护球上文参数
    const {
      taskList,
      pieChartData,
      OutTableList,
      OutTableListPagination,
      fetchOutLibraryTableLoading,
      onSearch,
      onCancel,
    } = this.props;

    // 列展示
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.orderSeq`).d('序号'),
        width: 80,
        dataIndex: 'orderSeq',
        render: (text, data, index) => {
          return index + 1;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.taskNum`).d('任务号'),
        width: 120,
        dataIndex: 'taskNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.instructionLineNum`).d('单据'),
        width: 100,
        dataIndex: 'instructionLineNum',
      },
      {
        title: intl.get(`${commonModelPrompt}.materialCode`).d('物料'),
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.taskStatusMeaning`).d('状态'),
        width: 80,
        dataIndex: 'taskStatusMeaning',
      },
      {
        title: intl.get(`${commonModelPrompt}.exitNum`).d('出口'),
        dataIndex: 'exitNum',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 100,
        fixed: 'right',
        align: 'center',
        render: (val, record, index) => (
          <a
            onClick={() => onCancel(record)}
          >
            {intl.get('hzero.common.button.cancel').d('取消')}
          </a>
        ),
      },
    ];


    return (
      <div>
        <Row>
          <Col span={12} style={{ height: '300px', border: 'ridge' }}>
            <Card
              title={intl.get(`${commonModelPrompt}.currentTask`).d('当前任务')}
              style={{ fontWeight: '800' }}
              bordered={false}
            >
              <p>{intl.get(`${commonModelPrompt}.currentTask`).d('任务号：')}{`${!isEmpty(taskList) ? taskList.taskNum : ''}`}</p>
              <p>{intl.get(`${commonModelPrompt}.currentTask`).d('任务发起时间：')}{`${!isEmpty(taskList) ? taskList.creationDate : ''}`}</p>
              <p>{intl.get(`${commonModelPrompt}.currentTask`).d('等待时长：')}{`${!isEmpty(taskList) ? taskList.lastCreationDate : ''}`}</p>
              <p>{intl.get(`${commonModelPrompt}.currentTask`).d('任务响应时间：')}{`${!isEmpty(taskList) ? taskList.lastUpdateDate : ''}`}</p>
              <p>{intl.get(`${commonModelPrompt}.currentTask`).d('执行时长：')}{`${!isEmpty(taskList) ? taskList.executeTime : ''}`}</p>
            </Card>
          </Col>
          <Col span={12} style={{ height: '300px', border: 'ridge' }}>
            <SunriseLibraryTaskSummary dataSource={pieChartData} />
          </Col>
        </Row>
        <Row>
          <Table
            bordered
            dataSource={OutTableList}
            columns={columns}
            pagination={OutTableListPagination}
            onChange={page => onSearch(page)}
            loading={fetchOutLibraryTableLoading}
            // rowKey='stocktakeId'
          />
        </Row>
      </div>
    );
  }
}
