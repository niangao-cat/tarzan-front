import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Table } from 'hzero-ui';
// import { isEmpty, map } from 'lodash';
// import { Bind } from 'lodash-decorators';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

const modelPrompt = 'tarzan.mes.numR.model.numR';
/**
 * 历史次表格
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */
@connect(({ numberRange, loading }) => ({
  numberRange,
  loading: loading.effects['numberRange/fetchHistoryItemList'],
}))
@Form.create({ fieldNameProp: null })
export default class HistoryItemTable extends PureComponent {
  render() {
    const {
      numberRange: {
        historyItemList = [],
        historyItemPagination = {},
        numResetTypeList = [],
        numRadixList = [],
        numAlertTypeList = [],
      },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.numrangeRuleId`).d('组合规则表主键'),
        width: 120,
        dataIndex: 'numrangeRuleId',
      },
      {
        title: intl.get(`${modelPrompt}.numRule`).d('序列号组合规则选项'),
        dataIndex: 'numRule',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.fixInput`).d('固定输入值'),
        dataIndex: 'fixInput',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.numLowerLimit`).d('序列号下限'),
        dataIndex: 'numLowerLimit',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.numUpperLimit`).d('序列号上限'),
        dataIndex: 'numUpperLimit',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.numAlert`).d('序列号预警值'),
        dataIndex: 'numAlert',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.numAlertType`).d('序列号预警类型'),
        dataIndex: 'numAlertType',
        width: 130,
        render: val => (numAlertTypeList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.numRadix`).d('序列号进制'),
        dataIndex: 'numRadix',
        width: 100,
        render: val => (numRadixList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.numIncrement`).d('序列号增量'),
        dataIndex: 'numIncrement',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.numCurrent`).d('当前序列号'),
        dataIndex: 'numCurrent',
        width: 110,
      },
      {
        title: intl.get(`${modelPrompt}.numResetType`).d('序列号重置类型'),
        dataIndex: 'numResetType',
        width: 140,
        render: val => (numResetTypeList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.numResetPeriod`).d('序列号重置周期'),
        dataIndex: 'numResetPeriod',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.numResetLastdate`).d('序列号上一次重置日期'),
        dataIndex: 'numResetLastdate',
        width: 170,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.dateFormat`).d('日期格式'),
        dataIndex: 'dateFormat',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.timeFormat`).d('时间格式'),
        dataIndex: 'timeFormat',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.callStandardObject`).d('标准对象编码'),
        dataIndex: 'callStandardObject',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.incomeValueLength`).d('传入值长度'),
        dataIndex: 'incomeValueLength',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.eventId`).d('事件ID'),
        dataIndex: 'eventId',
        width: 100,
      },
    ];
    return (
      <Table
        bordered
        rowKey="numrangeRuleHisId"
        columns={columns}
        dataSource={historyItemList}
        pagination={historyItemPagination}
        scroll={{ x: tableScrollWidth(columns) + 100, y: 250 }}
        // onChange={this.handleTableChange}
        loading={loading}
      />
    );
  }
}
