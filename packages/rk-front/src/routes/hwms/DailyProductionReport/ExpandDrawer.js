/*
 * @Description: 送货单抽屉
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-18 17:50:26
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-06-12 16:41:35
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Modal, Form } from 'hzero-ui';
import { connect } from 'dva';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';

const commonModelPrompt = 'tarzan.hwms.dailyProductionReport';
@connect(({ dailyProductionReport, loading }) => ({
  dailyProductionReport,
  detailLoading: loading.effects['dailyProductionReport/queryDetailDataList'],
}))
@Form.create({ fieldNameProp: null })
export default class DetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const { expandDrawer, onCancel, onSearch, detailList, detailPagination, detailLoading } = this.props;
    const columns = [
      {
        title: intl.get(`${commonModelPrompt}.production`).d('时间'),
        dataIndex: 'shiftDate',
        align: 'center',
        render: (val, record, index) => {
          const productionList = detailList.map(e => e.shiftDate);
          const first = productionList.indexOf(record.shiftDate);
          const all = detailList.filter(e => e.shiftDate === record.shiftDate).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('班次'),
        dataIndex: 'shiftCode',
        align: 'center',
        render: (val, record, index) => {
          const productionList = detailList.filter(e => e.shiftDate === record.shiftDate).map(e => e.shiftCode);
          const first = detailList.map(e => e.shiftCode+e.shiftDate).indexOf(val+record.shiftDate);
          const all = productionList.filter(e =>e === record.shiftCode).length;
          const obj = {
            children: record.shiftCode,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('开班时间'),
        dataIndex: 'shiftStartTime',
        align: 'center',
        render: (val, record, index) => {
          const productionList = detailList.filter(e => e.shiftDate === record.shiftDate&&e.shiftCode === record.shiftCode).map(e => e.shiftStartTime);
          const first = detailList.map(e => e.shiftStartTime+e.shiftCode+e.shiftDate).indexOf(val+record.shiftCode+record.shiftDate);
          const all = productionList.filter(e =>e === record.shiftStartTime).length;
          const obj = {
            children: record.shiftStartTime,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('结班时间'),
        dataIndex: 'shiftEndTime',
        align: 'center',
        render: (val, record, index) => {
          const productionList = detailList.filter(e => e.shiftDate === record.shiftDate&&e.shiftCode === record.shiftCode&&e.shiftStartTime === record.shiftStartTime).map(e => e.shiftEndTime);
          const first = detailList.map(e => e.shiftEndTime+e.shiftStartTime+e.shiftCode+e.shiftDate).indexOf(val+record.shiftStartTime+record.shiftCode+record.shiftDate);
          const all = productionList.filter(e =>e === record.shiftEndTime).length;
          const obj = {
            children: record.shiftEndTime,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('车间'),
        dataIndex: 'workshopName',
        align: 'center',
        render: (val, record, index) => {
          const productionList = detailList.filter(e => e.shiftDate === record.shiftDate&&e.shiftCode === record.shiftCode&&e.shiftStartTime === record.shiftStartTime&&e.shiftEndTime === record.shiftEndTime).map(e => e.workshopName);
          const first = detailList.map(e => e.workshopName+e.shiftEndTime+e.shiftStartTime+e.shiftCode+e.shiftDate).indexOf(val+record.shiftEndTime+record.shiftStartTime+record.shiftCode+record.shiftDate);
          const all = productionList.filter(e =>e === record.workshopName).length;
          const obj = {
            children: record.workshopName,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('生产线'),
        dataIndex: 'production',
        align: 'center',
        render: (val, record, index) => {
          const productionList = detailList.filter(e => e.shiftDate === record.shiftDate&&e.shiftCode === record.shiftCode&&e.shiftStartTime === record.shiftStartTime&&e.shiftEndTime === record.shiftEndTime&&e.workshopName === record.workshopName).map(e => e.production);
          const first = detailList.map(e => e.production+e.workshopName+e.shiftEndTime+e.shiftStartTime+e.shiftCode+e.shiftDate).indexOf(val+record.workshopName+record.shiftEndTime+record.shiftStartTime+record.shiftCode+record.shiftDate);
          const all = productionList.filter(e =>e === record.production).length;
          const obj = {
            children: record.production,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.production`).d('工段'),
        dataIndex: 'lineWorkcellName',
        align: 'center',
        render: (val, record, index) => {
          const productionList = detailList.filter(e => e.shiftDate === record.shiftDate&&e.shiftCode === record.shiftCode&&e.shiftStartTime === record.shiftStartTime&&e.shiftEndTime === record.shiftEndTime&&e.workshopName === record.workshopName&&e.production === record.production).map(e => e.lineWorkcellName);
          const first = detailList.map(e => e.lineWorkcellName+e.production+e.workshopName+e.shiftEndTime+e.shiftStartTime+e.shiftCode+e.shiftDate).indexOf(val+record.production+record.workshopName+record.shiftEndTime+record.shiftStartTime+record.shiftCode+record.shiftDate);
          const all = productionList.filter(e =>e === record.lineWorkcellName).length;
          const obj = {
            children: record.lineWorkcellName,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.productionNum`).d('产品料号'),
        dataIndex: 'productionNum',
        align: 'center',
        render: (val, record, index) => {
          const productionList = detailList.filter(e => e.shiftDate === record.shiftDate&&e.shiftCode === record.shiftCode&&e.shiftStartTime === record.shiftStartTime&&e.shiftEndTime === record.shiftEndTime&&e.workshopName === record.workshopName&&e.production === record.production&&e.lineWorkcellName === record.lineWorkcellName).map(e => e.productionNum);
          const first = detailList.map(e => e.productionNum+e.lineWorkcellName+e.production+e.workshopName+e.shiftEndTime+e.shiftStartTime+e.shiftCode+e.shiftDate).indexOf(val+record.lineWorkcellName+record.production+record.workshopName+record.shiftEndTime+record.shiftStartTime+record.shiftCode+record.shiftDate);
          const all = productionList.filter(e =>e === record.productionNum).length;
          const obj = {
            children: record.productionNum,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.productionDes`).d('产品描述'),
        dataIndex: 'productionDes',
        align: 'left',
        render: (val, record, index) => {
          const productionList = detailList.filter(e => e.shiftDate === record.shiftDate&&e.shiftCode === record.shiftCode&&e.shiftStartTime === record.shiftStartTime&&e.shiftEndTime === record.shiftEndTime&&e.workshopName === record.workshopName&&e.production === record.production&&e.lineWorkcellName === record.lineWorkcellName&&e.productionNum === record.productionNum).map(e => e.productionDes);
          const first = detailList.map(e => e.productionDes+e.productionNum+e.lineWorkcellName+e.production+e.workshopName+e.shiftEndTime+e.shiftStartTime+e.shiftCode+e.shiftDate).indexOf(val+record.productionNum+record.lineWorkcellName+record.production+record.workshopName+record.shiftEndTime+record.shiftStartTime+record.shiftCode+record.shiftDate);
          const all = productionList.filter(e =>e === record.productionDes).length;
          const obj = {
            children: record.productionDes,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: intl.get(`${commonModelPrompt}.gongXu`).d('投产（首道）'),
        dataIndex: 'putData',
        align: 'right',
      },
      {
        title: intl.get(`${commonModelPrompt}.gongWei`).d('完工（末道）'),
        dataIndex: 'finishedData',
        align: 'right',
      },
    ];

    return (
      <Modal
        confirmLoading={false}
        width={1000}
        visible={expandDrawer}
        onCancel={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={null}
      >
        <br />
        <EditTable
          loading={detailLoading}
          rowKey="instructionId"
          dataSource={detailList}
          columns={columns}
          pagination={detailPagination}
          onChange={page => onSearch(page)}
          footer={null}
          bordered
        />
      </Modal>
    );
  }
}
