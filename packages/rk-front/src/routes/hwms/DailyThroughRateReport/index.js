/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 产品直通率报表
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Table } from 'hzero-ui';
import moment from 'moment';
import { isEmpty } from 'lodash';

import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId, tableScrollWidth, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import notification from 'utils/notification';
import ExcelExport from '@/components/ExcelExport';
import { ReportHost } from '@/utils/config';

import styles from './index.less';
import ExpandDrawer from './ExpandDrawer';
import TableList from './TableList';
import FilterForm from './FilterForm';

const tenantId = getCurrentOrganizationId();
const commonModelPrompt = 'tarzan.hwms.dailyThroughRateReport';

@connect(({ dailyThroughRateReport, loading }) => ({
  dailyThroughRateReport,
  fetchListLoading: loading.effects['dailyThroughRateReport/queryDataList'],
  getExportLoading: loading.effects['dailyThroughRateReport/getExport'],
}))
export default class DailyThroughRateReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableForm: false,
      tableShowFlag: true,
      expandDrawer: false,
      detailList: [],
    };
    this.init();
  }


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dailyThroughRateReport/init',
    });
    dispatch({
      type: 'dailyThroughRateReport/fetchDepartment',
    });
  }

  @Bind()
  init() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dailyThroughRateReport/updateState',
      payload: {
        headList: [],
        headPagination: {},
        colData: [],
        expandDrawer: false, // 弹出创建层
        sumData: '',
        searchForDetail: {}, // 查询明细的数据
      },
    });
  }

  @Bind
  handleSearch() {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if (value) {
      dispatch({
        type: 'dailyThroughRateReport/queryDataList',
        payload: {
          ...value,
        },
      });
    }
  }

  @Bind
  onDetail(flag, detailList) {
    if (flag === 'Y') {
      this.setState({
        detailList:
          detailList && detailList.length > 0
            ? detailList.map(item => {
              return { code: item };
            })
            : [],
        expandDrawer: true,
      });
    } else {
      this.setState({ detailList, tableForm: true });
    }
  }

  @Bind
  onCloseDetail() {
    this.setState({ tableForm: false, expandDrawer: false });
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, value) => {
        if (!err) {
          const { dateFrom, dateTo, one, two, three, four, areaId, prodLineId, lineWorkCellId, processId } = value;
          if (areaId || prodLineId || lineWorkCellId || processId) {
            queryParams = filterNullValueObject({
              ...value,
              dateFrom: isEmpty(dateFrom) ? null : moment(dateFrom).format(DEFAULT_DATETIME_FORMAT),
              dateTo: isEmpty(dateTo) ? null : moment(dateTo).format(DEFAULT_DATETIME_FORMAT),
              productType: `${!one ? '_' : one}${!two ? '_' : two}${!three ? '_' : three
                }${!four ? '_' : four}`,
            });
          } else {
            notification.warning({ description: '查询条件部门，产线，工段，工序必输其一' });
          }
        }
      });
    }
    return queryParams;
  }


  // 渲染 界面布局
  render() {
    // 获取默认数据
    const {
      fetchListLoading,
      dailyThroughRateReport: { headList = [], colData = [], areaMap = [], defaultDepartment },
    } = this.props;
    // 设置显示数据
    let columns = [
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('序号'),
        dataIndex: 'prodLineName',
        align: 'center',
        width: 50,
        fixed: 'left',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.date`).d('时间'),
        dataIndex: 'date',
        width: 160,
        fixed: 'left',
        align: 'center',
        render: (val, record, index) => {
          const date = headList.map(e => e.date);
          const first = date.indexOf(record.date);
          const all = headList.filter(e => e.date === record.date).length;
          const obj = {
            children: val,
            props: {},
          };
          obj.props.rowSpan = index === first ? all : 0;
          return obj;
        },
      },
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('产线'),
        dataIndex: 'prodLineName',
        align: 'left',
        fixed: 'left',
        width: 100,
      },
      {
        title: intl.get(`${commonModelPrompt}.processName`).d('工序'),
        dataIndex: 'processName',
        align: 'center',
        fixed: 'left',
        width: 100,
      },
    ];
    if (colData.length > 2) {
      columns = columns.map(e => ({ ...e, fixed: 'left' }));
    }

    columns = columns.concat(colData.map(v => {
      return {
        title: `${v.shiftName}`,
        width: 320,
        children: [
          {
            title: '合格数',
            dataIndex: `${v.shiftName}passNum`,
            className: styles['data-one'],
            width: 80,
            align: 'center',
            render: (val, record, index) => {
              if (val === '-' || index === headList.length - 1) {
                return <span>{val}</span>;
              } else {
                return (
                  <a
                    onClick={() => this.onDetail('Y', record[`${v.shiftName}identificationList`])}
                  >
                    {val}
                  </a>
                );
              }
            },
          },
          {
            title: '不良数',
            dataIndex: `${v.shiftName}ncNum`,
            className: styles['data-two'],
            align: 'center',
            width: 80,
            render: (val, record, index) => {
              if (val === '-' || index === headList.length - 1) {
                return <span>{val}</span>;
              } else {
                return (
                  <a onClick={() => this.onDetail('N', record[`${v.shiftName}ncDataList`])}>
                    {val}
                  </a>
                );
              }
            },
          },
          {
            title: '投产数',
            dataIndex: `${v.shiftName}productionNum`,
            className: styles['data-two'],
            width: 80,
            align: 'center',
          },
          {
            title: '良率',
            dataIndex: `${v.shiftName}rate`,
            className: styles['data-two'],
            width: 80,
            align: 'center',
          },
        ],
      };
    }));


    const filterFormProps = {
      areaMap,
      tenantId,
      defaultDepartment,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.handleSearch,
    };

    const expandDataProps = {
      expandDrawer: this.state.expandDrawer,
      onCancel: this.onCloseDetail,
      detailList: this.state.detailList,
    };
    const tableDataProps = {
      expandDrawer: this.state.tableForm,
      onCancel: this.onCloseDetail,
      detailList: this.state.detailList,
    };
    //  返回默认界面数据
    return (
      <Fragment>
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('日直通率报表')}>
          <ExcelExport
            exportAsync
            exportUrl={`${ReportHost}/v1/${tenantId}/hme-prod-line-pass-rate/day/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-prod-line-pass-rate/async-day-export`}
            createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-prod-line-pass-rate/create-day-task`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="日直通率报表.xlsx"
          />

        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <div className="tableDailyThroughRateReportClass">
            {this.state.tableShowFlag && (
              <Table
                bordered
                dataSource={headList}
                columns={columns}
                loading={fetchListLoading}
                pagination={false}
                scroll={{ x: tableScrollWidth(columns, 50), y: 500 }}
                bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
              />
            )}
            <ModalContainer ref={registerContainer} />
          </div>
        </Content>
        {this.state.expandDrawer && <ExpandDrawer {...expandDataProps} />}
        {this.state.tableForm && <TableList {...tableDataProps} />}
      </Fragment>
    );
  }
}
