/*
 * @Description: 员工出勤报表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-01 09:34:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-01 16:24:07
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import moment from 'moment';

import { filterNullValueObject, getCurrentOrganizationId, getDateTimeFormat } from 'utils/utils';
import { Header, Content } from 'components/Page';
import ExcelExport from '@/components/ExcelExport';
import { ReportHost } from '@/utils/config';

import { isEmpty } from 'lodash';
import FilterForm from './FilterForm';
import HeadTable from './Component/HeadTable';
import LineTable from './Component/LineTable';
import MakeNumDrawer from './Details/MakeNumDrawer';
import DefectsNumbDrawer from './Details/DefectsNumbDrawer';
import RepairNumDrawer from './Details/RepairNumDrawer';


@connect(({ employeeAttendanceReport, loading }) => ({
  employeeAttendanceReport,
  tenantId: getCurrentOrganizationId(),
  fetchHeadLoading: loading.effects['employeeAttendanceReport/fetchHeadList'],
  fetchLineLoading: loading.effects['employeeAttendanceReport/fetchLineList'],
  fetchMakeNumListLoading: loading.effects['employeeAttendanceReport/fetchMakeNumList'],
  fetchSummaryListLoading: loading.effects['employeeAttendanceReport/fetchSummaryList'],
  fetchNcListLoading: loading.effects['employeeAttendanceReport/fetchNcList'],
  fetchDefectsNumbListLoading: loading.effects['employeeAttendanceReport/fetchDefectsNumbList'],
}))
export default class EmployeeAttendanceReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      selectRecord: {},
      makeNumDrawer: false,
      defectsNumbDrawer: false,
      repairNumDrawer: false,
      idList: [],
      record: {},
      type: null,
    };
  }

  componentDidMount() {
    // 查询站点下拉框
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeAttendanceReport/fetchSiteList',
    });

    dispatch({
      type: 'employeeAttendanceReport/fetchDefaultSite',
    }).then(res => {
      if(res) {
        this.handleSelectedSite(res.siteId);
      }
    });
  }

  filterForm;

  @Bind()
  handleFetchMakeNumDetail(page = {}) {
    const { dispatch } = this.props;
    const { type, record } = this.state;
    const value = this.handleGetFormValue();
    if(value) {
      const payload = type === "makeNum" ? {
        idList: record.jobIdList,
      } : type === 'summaryList' ? {
        wkcShiftId: record.wkcShiftId,
        shiftCode: record.shiftCode,
        date: record.date,
        workId: record.workId,
        ...value,
      } : { idList: record.inMakeJobIdList };
      const effects = type === 'summaryList' ? 'fetchSummaryList' : 'fetchMakeNumList';
      dispatch({
        type: `employeeAttendanceReport/${effects}`,
        payload: {
          ...payload,
          page,
        },
      });
    }
  }

  @Bind()
  handleOpenMakeNumDrawer(record, type) {
    this.setState(
      { type, record, makeNumDrawer: !this.state.makeNumDrawer },
      () => {
        this.handleFetchMakeNumDetail();
      }
    );
  }

  @Bind()
  handleFetchDefectsNumbDetail(page = {}) {
    const { dispatch } = this.props;
    const { type, record } = this.state;
    const value = this.handleGetFormValue();
    if(value) {
      const payload = type === "head" ? {
        ...value,
        wkcShiftId: record.wkcShiftId,
        shiftCode: record.shiftCode,
        date: record.date,
        shiftEndDate: record.shiftEndDate,
        shiftStartDate: record.shiftStartDate,
        workId: record.workId,
      } : { idList: record.ncRecordIdList };
      const effects = type === 'head' ? 'fetchNcList' : 'fetchDefectsNumbList';
      dispatch({
        type: `employeeAttendanceReport/${effects}`,
        payload: {
          ...payload,
          page,
        },
      });
    }
  }

  @Bind()
  handleOpenDefectsNumDrawer(record, type) {
    this.setState(
      { type, record, defectsNumbDrawer: !this.state.defectsNumbDrawer },
      () => {
        this.handleFetchDefectsNumbDetail();
      }
    );
  }

  @Bind()
  onRepairNumDetail(record){
    this.setState({ idList: record.repairJobIdList, repairNumDrawer: !this.state.repairNumDrawer});
    const { dispatch } = this.props;
    // 查询返修数量
    dispatch({
      type: 'employeeAttendanceReport/fetchRepairNumList',
      payload: {
        idList: record.repairJobIdList,
      },
    });
  }


  @Bind()
  onRepairNumSearch(page= {}){
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'employeeAttendanceReport/fetchRepairNumList',
      payload: {
        idList: this.state.idList,
        page,
      },
    });
  }

  @Bind
  handleChangeMakeNumVisible(){
    this.setState({ makeNumDrawer: !this.state.makeNumDrawer});
  }

  @Bind
  onDefectsNumbCancel(){
    this.setState({ defectsNumbDrawer: !this.state.defectsNumbDrawer});
  }

  @Bind
  onRequireNumCancel(){
    this.setState({repairNumDrawer: !this.state.repairNumDrawer});
  }

  @Bind()
  handleGetFormValue() {
    let queryParams = false;
    if(this.filterForm) {
      this.filterForm.validateFields((err, value) => {
        if(!err) {
          const { startTime, endTime } = value;
          queryParams = filterNullValueObject({
            ...value,
            startTime: isEmpty(startTime)
              ? null
              : moment(startTime).format(getDateTimeFormat()),
            endTime: isEmpty(endTime)
              ? null
              : moment(startTime).format(getDateTimeFormat()),
          });
        }
      });
    }
    return queryParams;
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  // 条件查询头
  @Bind()
  handleSearch(page = {}) {
    const { dispatch } = this.props;
    this.setState({ selectRowKeys: [] });
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'employeeAttendanceReport/fetchHeadList',
        payload: {
          page,
          ...value,
        },
      });
    }
  }

  // 头分页查询
  @Bind()
  onHeadSearch(page = {}) {
    const { dispatch } = this.props;
    this.setState({selectRowKeys: []});
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'employeeAttendanceReport/fetchHeadList',
        payload: {
          ...value,
          page,
        },
      });
    }
  }

  // 在选择站点时候触发
  @Bind()
  handleSelectedSite(value){
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeAttendanceReport/fetchDivisionList',
      payload: {
        siteId: value,
        areaCategory: 'SYB',
      },
    });
  }

  // 在选择事业部时候触发
  @Bind()
  handleSelectedArea(value){
    const { dispatch } = this.props;
    const siteId = this.filterForm ? this.filterForm.getFieldValue('siteId') : null;
    dispatch({
      type: 'employeeAttendanceReport/fetchWorkcellList',
      payload: {
        siteId,
        departmentId: value,
      },
    });
  }

  // 行分页查询
  @Bind()
  onLineSearch(page = {}, fields = {}) {
    const { dispatch } = this.props;
    const value = this.handleGetFormValue();
    if(value) {
      dispatch({
        type: 'employeeAttendanceReport/fetchLineList',
        payload: {
          ...this.state.selectRecord,
          ...value,
          page,
          ...fields,
        },
      });
    }
  }

  @Bind
  onChangeSelected(selectRowKeys, selectedRows){
    this.setState({
      selectedRows,
      selectRecord: selectedRows[0],
    });
    const value = this.handleGetFormValue();
    if(value) {
      // 查询数据
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeAttendanceReport/fetchLineList',
      payload: {
        ...selectedRows[0],
        ...value,
      },
    });
    }
  }

  render() {
    const {
      employeeAttendanceReport: {
        headList = [],
        headPagination = {},
        lineList = [],
        linePagination = {},
        siteMap = [],
        divisionMap = [],
        workcellMap = [],
        makeNumList = [],
        makeNumPagination = {},
        defectsNumbList = [],
        defectsNumbPagination = {},
        repairNumList = [],
        repairNumPagination = {},
        siteInfo = {},
      },
      fetchHeadLoading,
      fetchLineLoading,
      tenantId,
      fetchMakeNumListLoading,
      fetchSummaryListLoading,
      fetchDefectsNumbListLoading,
      fetchNcListLoading,
    } = this.props;

    const{ makeNumDrawer, defectsNumbDrawer, repairNumDrawer, selectedRows } = this.state;

    // 查询
    const filterFormProps = {
      siteInfo,
      siteMap,
      divisionMap,
      workcellMap,
      onSearch: this.handleSearch,
      onSelectedSite: this.handleSelectedSite,
      onSelectedArea: this.handleSelectedArea,
    };

    const rowsSelection = {
      selectedRowKeys: selectedRows.map(e => `${e.wkcShiftId}#${e.workId}`),
      type: 'radio', // 单选
      onChange: this.onChangeSelected,
    };

    // 头表
    const headTableProps = {
      onSearch: this.onHeadSearch,
      dataSource: headList,
      pagination: headPagination,
      loading: fetchHeadLoading,
      rowsSelection,
      onMakeNumDetail: this.handleOpenMakeNumDrawer,
      onDefectsNumbDetail: this.handleOpenDefectsNumDrawer,
    };

    // 行表
    const lineTableProps = {
      onSearch: this.onLineSearch,
      dataSource: lineList,
      pagination: linePagination,
      loading: fetchLineLoading,
      onMakeNumDetail: this.handleOpenMakeNumDrawer,
      onDefectsNumbDetail: this.handleOpenDefectsNumDrawer,
      onRepairNumDetail: this.onRepairNumDetail,
    };

    // 产量
    const makeNumTableProps = {
      makeNumDrawer,
      loading: fetchMakeNumListLoading || fetchSummaryListLoading,
      dataSource: makeNumList,
      pagination: makeNumPagination,
      onMakeNumSearch: this.handleFetchMakeNumDetail,
      onChangeMakeNumVisible: this.handleChangeMakeNumVisible,
    };

    // 不良数
    const defectsNumbTableProps = {
      defectsNumbDrawer,
      loading: fetchDefectsNumbListLoading || fetchNcListLoading,
      dataSource: defectsNumbList,
      pagination: defectsNumbPagination,
      onDefectsNumbSearch: this.handleFetchDefectsNumbDetail,
      onDefectsNumbCancel: this.onDefectsNumbCancel,
    };

     // 返修数量
     const onRepairNumTableProps = {
      repairNumDrawer,
      dataSource: repairNumList,
      pagination: repairNumPagination,
      onRepairNumSearch: this.onRepairNumSearch,
      onRequireNumCancel: this.onRequireNumCancel,
    };
    return (
      <Fragment>
        <Header title="工段产量报表">
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/hme-employee-export/line-workcell-product-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fileName="工段产量报表.xlsx"
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
          <HeadTable {...headTableProps} />
          <LineTable {...lineTableProps} />
          {makeNumDrawer && <MakeNumDrawer {...makeNumTableProps} />}
          {defectsNumbDrawer && <DefectsNumbDrawer {...defectsNumbTableProps} />}
          {repairNumDrawer && <RepairNumDrawer {...onRepairNumTableProps} />}
        </Content>
      </Fragment>
    );
  }
}
