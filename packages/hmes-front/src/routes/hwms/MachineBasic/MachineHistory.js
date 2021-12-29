/**
 * 机台数据维护历史
 *@date：2019/11/1
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */

import React, { Component } from 'react';
import { Table, Badge } from 'hzero-ui';
import intl from 'utils/intl';
import { connect } from 'dva';
import { Content, Header } from 'components/Page';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';

@connect(({ machineBasic, loading }) => ({
  machineBasic,
  loading: {
    fetchLoading: loading.effects['machineBasic/queryHistoryList'],
  },
}))
@formatterCollections({
  code: ['hwms.machineBasic', 'hwms.barcodeQuery'],
})
class MachineHistory extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      // parentItem: props.location.params.parentItem || {},
    };
  }

  componentDidMount() {
    // 初始化数据
    this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch({
      type: 'machineBasic/queryHistoryList',
      payload: {
        machinePlatformId: id,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  render() {
    const {
      loading: { fetchLoading },
      machineBasic: { hisList = [], hisPagination = [] },
    } = this.props;
    const commonModelPrompt = 'hwms.machineBasic.model.machineBasic';
    const modelPrompt = 'hwms.barcodeQuery.model.barcodeQuery';
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.machineCode`).d('机器编号'),
        width: 120,
        dataIndex: 'machineCode',
      },
      {
        title: intl.get(`${commonModelPrompt}.machineName`).d('机器名'),
        width: 120,
        dataIndex: 'machineName',
      },
      {
        title: intl.get(`${commonModelPrompt}.machinePlatformCode`).d('机台编码'),
        width: 120,
        dataIndex: 'machinePlatformCode1',
      },
      {
        title: intl.get(`${commonModelPrompt}.machinePlatformName`).d('机台名'),
        width: 120,
        dataIndex: 'machinePlatformName',
      },
      {
        title: intl.get(`${commonModelPrompt}.machinePlatformType`).d('机台类型'),
        width: 120,
        dataIndex: 'machinePlatformTypeMeaning',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('有效性'),
        width: 120,
        align: 'center',
        dataIndex: 'enableFlag',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`hzero.common.view.yes`).d('是')
                : intl.get(`hzero.common.view.no`).d('否')
            }
          />
        ),
      },
      {
        title: intl.get(`${commonModelPrompt}.correspondingMachineB`).d('对应的B机台'),
        width: 120,
        dataIndex: 'machinePlatformCode2',
      },
      {
        title: intl.get(`${commonModelPrompt}.eventType`).d('事件类型'),
        width: 120,
        dataIndex: 'description',
      },
      {
        title: intl.get(`${modelPrompt}.eventBy`).d('事件人'),
        width: 120,
        dataIndex: 'eventBy',
      },
      {
        title: intl.get(`${modelPrompt}.eventTime`).d('事件时间'),
        dataIndex: 'eventTime',
        align: 'center',
      },
    ];
    return (
      <React.Fragment>
        <Header
          title={intl.get('hwms.machineBasic.view.message.hisTitle').d('机台基础数据维护历史')}
          backPath="/hwms/machine-basic/query"
        />
        <Content>
          <Table
            bordered
            rowKey="hisKid"
            loading={fetchLoading}
            dataSource={hisList}
            columns={columns}
            pagination={hisPagination}
            scroll={{ x: tableScrollWidth(columns) }}
            onChange={page => this.handleSearch(page)}
          />
        </Content>
      </React.Fragment>
    );
  }
}

export default MachineHistory;
