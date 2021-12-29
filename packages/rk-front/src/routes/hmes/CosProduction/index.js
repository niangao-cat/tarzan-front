/*
 * @Description:cos在制报表
 * @Version: 0.0.1
 * @Autor: li.zhang13@hand-china.com
 * @Date: 2021-01-27 10:25:46
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Table } from 'hzero-ui';
import moment from 'moment';
import { isEmpty } from 'lodash';

import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { Header, Content } from 'components/Page';
import ModalContainer, { registerContainer } from '@/components/Modal/ModalContainer';
import { ReportHost } from '@/utils/config';
import ExcelExport from '@/components/ExcelExport';

import FilterForm from './FilterForm';
import NcFlagTable from './Drawer/NcFlagTable';

@connect(({ cosProduction, loading }) => ({
  cosProduction,
  tenantId: getCurrentOrganizationId(),
  fetchCosProductionLoading: loading.effects['cosProduction/fetchCosProduction'],
  handleExportLoading: loading.effects['cosProduction/handleExport'],
  getNcFlagDataLoading: loading.effects['cosProduction/getNcFlagData'],
}))
export default class CosProduction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      ncFlagParams: {},
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    // 查询独立值集
    dispatch({
      type: 'cosProduction/init',
      payload: {
        tenantId,
      },
    });
  }

  @Bind
  fetchCosProduction(fields = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if (value) {
      dispatch({
        type: 'cosProduction/fetchCosProduction',
        payload: {
          ...value,
          page: isEmpty(fields) ? {} : fields,
        },
      });
    }
  }

  // 数据导出
  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if (this.formDom) {
      this.formDom.validateFields((err, values) => {
        const { creationDateFrom, creationDateTo } = values;
        queryParams = filterNullValueObject({
          ...values,
          creationDateFrom: isEmpty(creationDateFrom)
            ? null
            : moment(creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
          creationDateTo: isEmpty(creationDateTo)
            ? null
            : moment(creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        });
      });
    }
    return queryParams;
  }

  // 打开抽屉
  @Bind()
  handleNcFlagData(record, page = {}) {
    // console.log('record==', record);
    const { dispatch } = this.props;
    this.setState({ visible: true });
    this.setState({ ncFlagParams: record });
    dispatch({
      type: 'cosProduction/getNcFlagData',
      payload: {
        materialLotId: record.materialLotId,
        workcellId: record.workcellId,
        page,
      },
    });
  }

  // // 打开抽屉
  // @Bind()
  // handlePageNcFlagData(page = {}) {
  //   const { dispatch } = this.props;
  //   this.setState({ visible: true });
  //   dispatch({
  //     type: 'cosProduction/getNcFlagData',
  //     payload: {
  //       materialLotId: record.materialLotId,
  //       workcellId: record.workcellId,
  //       page,
  //     },
  //   });
  // }

  // 关闭抽屉
  @Bind()
  hideNcFlagModal() {
    this.setState({ visible: false });
  }

  // 渲染 界面布局
  render() {
    const {
      fetchCosProductionLoading,
      tenantId,
      getNcFlagDataLoading,
      cosProduction: {
        reportData = [],
        reportDataPagination = {},
        cosTypeMap = [],
        defaultDate = [],
        workOrderTypeList,
        ncFlagData = [],
        ncFlagDataPagination = {},
      },
    } = this.props;
    const { visible, ncFlagParams } = this.state;
    const filterFormProps = {
      defaultDate,
      cosTypeMap,
      tenantId,
      workOrderTypeList,
      onRef: node => {
        this.formDom = node.props.form;
      },
      onSearch: this.fetchCosProduction,
    };
    const ncFlagTableProps = {
      loading: getNcFlagDataLoading,
      dataSource: ncFlagData,
      pagination: ncFlagDataPagination,
      visible,
      ncFlagParams,
      onCancel: this.hideNcFlagModal,
      onSearch: this.handleNcFlagData,
    };
    const columns = [
      {
        title: '工单',
        dataIndex: 'workOrderNum',
        width: 150,
      },
      {
        title: '工单版本',
        dataIndex: 'productionVersion',
        width: 150,
      },
      {
        title: '版本描述',
        dataIndex: 'productionVersionDesc',
        width: 150,
      },
      {
        title: '产品编码',
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: '产品描述',
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: '产品组',
        dataIndex: 'productGroup',
        width: 150,
      },
      {
        title: '产品组描述',
        dataIndex: 'productGroupMeaning',
        width: 150,
      },
      {
        title: '工单类型',
        dataIndex: 'workOrderTypeMeaning',
        width: 150,
      },
      {
        title: '工单状态',
        dataIndex: 'statusMeaning',
        width: 150,
      },
      {
        title: '工单数量',
        dataIndex: 'workOrderQty',
        width: 150,
      },
      {
        title: '工单投料数量（来料）',
        dataIndex: 'cosNum',
        width: 150,
      },
      {
        title: '完工数量',
        dataIndex: 'completedQty',
        width: 150,
      },
      {
        title: 'WAFER',
        dataIndex: 'wafer',
        width: 150,
      },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 150,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 150,
      },
      {
        title: '数量',
        dataIndex: 'qty',
        width: 150,
      },
      {
        title: '实验代码',
        dataIndex: 'labCode',
        width: 150,
      },
      {
        title: '工位描述',
        dataIndex: 'workcellName',
        width: 150,
      },
      {
        title: '工位编码',
        dataIndex: 'workcellCode',
        width: 150,
      },
      {
        title: '工序描述',
        dataIndex: 'processName',
        width: 150,
      },
      {
        title: '工段描述',
        dataIndex: 'lineWorkcellName',
        width: 150,
      },
      {
        title: '生产线描述',
        dataIndex: 'prodLineName',
        width: 150,
      },
      {
        title: '加工人员',
        dataIndex: 'createdByName',
        width: 150,
      },
      {
        title: '加工开始时间',
        dataIndex: 'siteInDate',
        width: 150,
      },
      {
        title: '加工结束时间',
        dataIndex: 'siteOutDate',
        width: 150,
      },
      {
        title: '当前工序',
        dataIndex: 'currentProcessName',
        width: 150,
      },
      {
        title: '呆滞时间',
        dataIndex: 'sluggishTime',
        width: 150,
      },
      {
        title: '呆滞标准',
        dataIndex: 'sluggishStandard',
        width: 150,
      },
      {
        title: '呆滞标识',
        dataIndex: 'sluggishFlagMeaning',
        width: 150,
      },
      {
        title: '是否不良',
        dataIndex: 'ncFlagMeaning',
        width: 150,
        render: (text, record) => <a onClick={() => this.handleNcFlagData(record)}>{text}</a>,
      },
      {
        title: '是否冻结',
        dataIndex: 'freezeFlagMeaning',
        width: 150,
      },
    ];
    return (
      <React.Fragment>
        <Header title='cos在制报表'>
          {/* <Button
            type="primary"
            icon="export"
            onClick={() => this.handleExport()}
            loading={handleExportLoading}
          >
            导出
          </Button> */}
          <ExcelExport
            exportAsync
            exportUrl={`${ReportHost}/v1/${tenantId}/cos-in-production/export`} // 路径
            exportAsyncUrl={`${ReportHost}/v1/${tenantId}/cos-in-production/async-export`}
            createTaskUrl={`${ReportHost}/v1/${tenantId}/cos-in-production/create-task`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="cos在制报表.xls"
          />

        </Header>
        <Content>
          <FilterForm {...filterFormProps} />
          <Table
            bordered
            dataSource={reportData}
            columns={columns}
            loading={fetchCosProductionLoading}
            pagination={reportDataPagination}
            onChange={page => this.fetchCosProduction(page)}
          />
          <NcFlagTable {...ncFlagTableProps} />
          <ModalContainer ref={registerContainer} />
        </Content>
      </React.Fragment>
    );
  }
}
