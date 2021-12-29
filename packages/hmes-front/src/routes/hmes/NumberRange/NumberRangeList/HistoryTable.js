import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Badge, Table } from 'hzero-ui';
// import { isEmpty, map } from 'lodash';
// import { Bind } from 'lodash-decorators';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.mes.numR.model.numR';
/**
 * 历史主表格
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */
@connect(({ numberRange, loading }) => ({
  numberRange,
  loading: loading.effects['numberRange/fetchHistoryList'],
}))
@Form.create({ fieldNameProp: null })
export default class HistoryTable extends PureComponent {
  onSelectRow = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'numberRange/fetchHistoryItemList',
      payload: {
        eventId: record.eventId,
      },
    });
  };

  render() {
    const {
      numberRange: { historyList = [], historyPagination = {} },
      loading,
      handleTableChange,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.object`).d('编码对象'),
        width: 180,
        dataIndex: 'objectCode',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.numrangeGroup`).d('号段组号'),
        dataIndex: 'numrangeGroup',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.numDescription`).d('号段描述'),
        dataIndex: 'numDescription',
        width: 250,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.eventTime`).d('变更时间'),
        dataIndex: 'eventTime',
        width: 250,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.eventByName`).d('用户ID'),
        dataIndex: 'eventBy',
        width: 250,
      },
      {
        title: intl.get(`${modelPrompt}.inputBox1`).d('组合输入框1'),
        dataIndex: 'inputBox1',
        width: 110,
      },
      {
        title: intl.get(`${modelPrompt}.inputBox2`).d('组合输入框2'),
        dataIndex: 'inputBox2',
        width: 110,
      },
      {
        title: intl.get(`${modelPrompt}.inputBox3`).d('组合输入框3'),
        dataIndex: 'inputBox3',
        width: 110,
      },
      {
        title: intl.get(`${modelPrompt}.inputBox4`).d('组合输入框4'),
        dataIndex: 'inputBox4',
        width: 110,
      },
      {
        title: intl.get(`${modelPrompt}.inputBox5`).d('组合输入框5'),
        dataIndex: 'inputBox5',
        width: 110,
      },
      {
        title: intl.get(`${modelPrompt}.numExample`).d('号段示例'),
        dataIndex: 'numExample',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.outsideNumFlag`).d('外部输入编码'),
        dataIndex: 'outsideNumFlag',
        width: 150,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.outsideNumFlag === 'Y' ? 'success' : 'error'}
            text={
              record.outsideNumFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        // width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];
    const historyRowSelection = {
      type: 'radio',
      onSelect: this.onSelectRow,
      columnWidth: 56,
    };
    return (
      <Table
        bordered
        rowSelection={historyRowSelection}
        rowKey="numrangeHisId"
        columns={columns}
        dataSource={historyList}
        pagination={historyPagination}
        scroll={{ x: tableScrollWidth(columns), y: 250 }}
        onChange={handleTableChange}
        loading={loading}
      />
    );
  }
}
