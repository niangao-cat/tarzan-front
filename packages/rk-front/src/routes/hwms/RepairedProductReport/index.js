/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 产品直通率报表
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Form, Table } from 'hzero-ui';
import moment from 'moment';
import { isEmpty } from 'lodash';

import {
  DEFAULT_DATETIME_FORMAT,
} from 'utils/constants';
import { getCurrentOrganizationId, tableScrollWidth, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import ExcelExport from '@/components/ExcelExport';
import { ReportHost } from '@/utils/config';
import styles from './index.less';
import ExpandDrawer from './ExpandDrawer';
import TableList from './TableList';
import FilterForm from './FilterForm';

const tenantId = getCurrentOrganizationId();

const commonModelPrompt = 'tarzan.hwms.repairedProductReport';

@connect(({ repairedProductReport, loading }) => ({
  repairedProductReport,
  fetchListLoading: loading.effects['repairedProductReport/queryDataList'],
  getExportLoading: loading.effects['repairedProductReport/getExport'],
}))
@Form.create({ fieldNameProp: null })
export default class RepairedProductReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableForm: false,
      expandDrawer: false,
      detailList: [],
    };
    this.init();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairedProductReport/init',
    });
    dispatch({
      type: 'repairedProductReport/fetchDepartment',
    });
  }

  @Bind()
  init() {
    const { dispatch } = this.props;
    dispatch({
      type: 'repairedProductReport/updateState',
      payload: {
        headList: [],
        headPagination: {},
        colData: [],
        expandDrawer: false, // 弹出创建层
        sumData: '',
        searchForDetail: {}, // 查询明细的数据
        exportData: {},
      },
    });
  }

  @Bind
  handleSearch() {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if (value) {
      dispatch({
        type: 'repairedProductReport/queryDataList',
        payload: {
          ...value,
        },
      });
    }
  }

  @Bind()
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

  @Bind()
  onCloseDetail() {
    this.setState({ tableForm: false, expandDrawer: false });
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, values) => {
        if (!err) {
          const { dateFrom, dateTo, one, two, three, four, areaId, prodLineId, lineWorkCellId, processId } = values;
          if (areaId || prodLineId || lineWorkCellId || processId) {
            queryParams = filterNullValueObject({
              ...values,
              dateFrom: isEmpty(dateFrom) ? null : moment(dateFrom).format(DEFAULT_DATETIME_FORMAT),
              dateTo: isEmpty(dateTo) ? null : moment(dateTo).format(DEFAULT_DATETIME_FORMAT),
              productType: `${!one ? '_' : one}${!two ? '_' : two}${!three ? '_' : three}${!four ? '_' : four}`,
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
      repairedProductReport: { headList = [], colData = [], areaMap = [], defaultDepartment },
    } = this.props;

    // 设置显示数据
    let columns = [
      {
        title: intl.get(`${commonModelPrompt}.prodLineName`).d('序号'),
        dataIndex: 'prodLineName',
        align: 'center',
        width: 80,
        // fixed: 'left',
        render: (val, record, index) => index + 1,
      },
      {
        title: intl.get(`${commonModelPrompt}.dateSlot`).d('时间段'),
        dataIndex: 'dateSlot',
        align: 'center',
        width: 160,
        // fixed: 'left',
        render: (val, record, index) => {
          const dateSlot = headList.map(e => e.dateSlot);
          const first = dateSlot.indexOf(record.dateSlot);
          const all = headList.filter(e => e.dateSlot === record.dateSlot).length;
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
        width: 80,
        // fixed: 'left',
      },
      {
        title: intl.get(`${commonModelPrompt}.processName`).d('工序'),
        dataIndex: 'processName',
        align: 'center',
        width: 80,
        // fixed: 'left',
      },
    ];
    if (colData.length > 2) {
      columns = columns.map(e => ({ ...e, fixed: 'left' }));
    }
    const newColumns = columns.concat(colData.map(v => {
      return {
        title: `${v.materialName}`,
        width: 310,
        children: [
          {
            title: '合格数',
            dataIndex: `${v.materialName}passNum`,
            className: styles['data-one'],
            width: 80,
            align: 'center',
            render: (val, record, index) => {
              if (val === '-' || index === headList.length - 1) {
                return <span>{val}</span>;
              } else {
                return (
                  <a
                    onClick={() =>
                      this.onDetail('Y', record[`${v.materialName}identificationList`])
                    }
                  >
                    {val}
                  </a>
                );
              }
            },
          },
          {
            title: '不良数',
            dataIndex: `${v.materialName}ncNum`,
            className: styles['data-two'],
            width: 80,
            align: 'center',
            render: (val, record, index) => {
              if (val === '-' || index === headList.length - 1) {
                return <span>{val}</span>;
              } else {
                return (
                  <a onClick={() => this.onDetail('N', record[`${v.materialName}ncDataList`])}>
                    {val}
                  </a>
                );
              }
            },
          },
          {
            title: '投产数',
            dataIndex: `${v.materialName}productionNum`,
            className: styles['data-two'],
            width: 80,
            align: 'center',
          },
          {
            title: '良率',
            dataIndex: `${v.materialName}rate`,
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
        <Header title={intl.get(`${commonModelPrompt}.view.title`).d('返修产品直通率报表')}>
          <ExcelExport
            exportAsync
            exportUrl={`${ReportHost}/v1/${tenantId}/hme-repair-product-pass-rate/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/hme-repair-product-pass-rate/async-export`}
            createTaskUrl={`${ReportHost}/v1/${tenantId}/hme-repair-product-pass-rate/create-task`}
            otherButtonProps={{ type: 'primary' }}
            method="POST"
            queryParams={this.handleGetFormValue}
            fileName="返修产品直通率报表.xls"
          />

        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <div className="tableProductPassThroughRateReportClass">
            <Table
              bordered
              dataSource={headList}
              columns={newColumns}
              loading={fetchListLoading}
              pagination={false}
              scroll={{ x: tableScrollWidth(newColumns, 200), y: 500 }}
              bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
            />
            <ModalContainer ref={registerContainer} />
          </div>
        </Content>
        {this.state.expandDrawer && <ExpandDrawer {...expandDataProps} />}
        {this.state.tableForm && <TableList {...tableDataProps} />}
      </Fragment>
    );
  }
}
