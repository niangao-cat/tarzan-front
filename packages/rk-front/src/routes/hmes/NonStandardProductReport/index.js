/*
 * @Description: 非标产品报表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-01 09:34:27
 * @LastEditorts: xinyu.wang02@hand-china.com
 * @LastEditTime: 2021-01-11 10:49:49
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId, filterNullValueObject, getDateTimeFormat } from 'utils/utils';
import moment from 'moment';
import Cookies from 'universal-cookie';
import { getSiteId } from '@/utils/utils';
import { ReportHost } from '@/utils/config';
import ExcelExport from 'components/ExcelExport';
import FilterForm from './FilterForm';
import HeadTable from './Component/HeadTable';
// import LineTable from './Component/LineTable';
import MakeNumDrawer from './Details/MakeNumDrawer';
import DefectsNumbDrawer from './Details/DefectsNumbDrawer';
import RepairNumDrawer from './Details/RepairNumDrawer';

const cookies = new Cookies();
@connect(({ nonStandardProductReport, loading }) => ({
  tenantId: getCurrentOrganizationId(),
  nonStandardProductReport,
  fetchHeadLoading: loading.effects['nonStandardProductReport/fetchHeadList'],
  fetchLineLoading: loading.effects['nonStandardProductReport/fetchLineList'],
}))
export default class NonStandardProductReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: {},
      selectRecord: {},
      siteId: '',
      makeNumDrawer: false,
      defectsNumbDrawer: false,
      repairNumDrawer: false,
      idList: [],
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;

    // 批量查询独立值集
    dispatch({
      type: 'nonStandardProductReport/batchLovData',
      payload: {
        tenantId,
      },
    });
    getSiteId();
    setTimeout(()=>{
      this.onSelectedSite(cookies.get('defaultSiteId'));
    }, 1000);
    this.handleSearch();
  }

  filterForm;

  @Bind()
  onMakeNumDetail(record, type){
    this.setState({idList: type === "makeNum"? record.workOrderId: record.inMakeJobIdList, makeNumDrawer: !this.state.makeNumDrawer});
    const { dispatch } = this.props;
    // 查询待上线
    dispatch({
      type: 'nonStandardProductReport/fetchmakeNumList',
      payload: {
        workOrderId: type === "makeNum"?record.workOrderId: record.inMakeJobIdList,
      },
    });
  }

  @Bind()
  onDefectsNumbDetail(record){
    this.setState({idList: record.workOrderId, defectsNumbDrawer: !this.state.defectsNumbDrawer});
    const { dispatch } = this.props;
    // 查询在线数量
    dispatch({
      type: 'nonStandardProductReport/fetchdefectsNumbList',
      payload: {
        workOrderId: record.workOrderId,
      },
    });
  }

  @Bind()
  onRepairNumDetail(record){
    this.setState({ idList: record.workOrderId, repairNumDrawer: !this.state.repairNumDrawer});
    const { dispatch } = this.props;
    // 查询完工数量
    dispatch({
      type: 'nonStandardProductReport/fetchrepairNumList',
      payload: {
        workOrderId: record.workOrderId,
      },
    });
  }

  @Bind
  onMakeNumSearch(page= {}){
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'nonStandardProductReport/fetchmakeNumList',
      payload: {
        workOrderId: this.state.idList,
        page,
      },
    });
  }

  @Bind
  onDefectsNumbSearch(page= {}){
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'nonStandardProductReport/fetchdefectsNumbList',
      payload: {
        workOrderId: this.state.idList,
        page,
      },
    });
  }

  @Bind
  onRepairNumSearch(page= {}){
    const { dispatch } = this.props;
    // 根据页数查询报表明细信息
    dispatch({
      type: 'nonStandardProductReport/fetchrepairNumList',
      payload: {
        workOrderId: this.state.idList,
        page,
      },
    });
  }

  @Bind
  onMakeNumCancel(){
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
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    return {
      ...filterNullValueObject({
        ...filterValue,
        creationStartDate: isEmpty(filterValue.creationStartDate)
          ? undefined
          : moment(filterValue.creationStartDate).format(getDateTimeFormat()),
        creationEndDate: isEmpty(filterValue.creationEndDate)
          ? undefined
          : moment(filterValue.creationEndDate).format(getDateTimeFormat()),
        releaseStartDate: isEmpty(filterValue.releaseStartDate)
          ? undefined
          : moment(filterValue.releaseStartDate).format(getDateTimeFormat()),
        releaseEndDate: isEmpty(filterValue.releaseEndDate)
          ? undefined
          : moment(filterValue.releaseEndDate).format(getDateTimeFormat()),
      }),
      siteId: this.state.siteId,
    };
  }

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  // 单击行事件
  @Bind()
  handleOnRow(record) {
    const { dispatch } = this.props;
    this.setState({ selectRecord: record });
    dispatch({
      type: 'nonStandardProductReport/fetchLineList',
      payload: {
        ...record,
        siteId: this.state.siteId,
      },
    });
  }

  // 条件查询头
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    this.setState({ search: {
      ...fields,
      creationStartDate: isEmpty(fields.creationStartDate)
      ? undefined
      : moment(fields.creationStartDate).format("YYYY-MM-DD HH:mm:ss"),
      creationEndDate: isEmpty(fields.creationEndDate)
      ? undefined
      : moment(fields.creationEndDate).format("YYYY-MM-DD HH:mm:ss"),
      releaseStartDate: isEmpty(fields.releaseStartDate)
      ? undefined
      : moment(fields.releaseStartDate).format("YYYY-MM-DD HH:mm:ss"),
      releaseEndDate: isEmpty(fields.releaseEndDate)
      ? undefined
      : moment(fields.releaseEndDate).format("YYYY-MM-DD HH:mm:ss"),
     } });
    dispatch({
      type: 'nonStandardProductReport/fetchHeadList',
      payload: {
        ...fields,
        siteId: cookies.get('defaultSiteId'), // this.state.siteId
        creationStartDate: isEmpty(fields.creationStartDate)
        ? undefined
        : moment(fields.creationStartDate).format("YYYY-MM-DD HH:mm:ss"),
        creationEndDate: isEmpty(fields.creationEndDate)
        ? undefined
        : moment(fields.creationEndDate).format("YYYY-MM-DD HH:mm:ss"),
        releaseStartDate: isEmpty(fields.releaseStartDate)
        ? undefined
        : moment(fields.releaseStartDate).format("YYYY-MM-DD HH:mm:ss"),
        releaseEndDate: isEmpty(fields.releaseEndDate)
        ? undefined
        : moment(fields.releaseEndDate).format("YYYY-MM-DD HH:mm:ss"),
      },
    });
  }

  // 头分页查询
  @Bind()
  onHeadSearch(page = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'nonStandardProductReport/fetchHeadList',
      payload: {
        ...this.state.search,
        siteId: this.state.siteId,
        page,
      },
    });
  }

   // 重置查询条件
   @Bind()
   onResetSearch() {
     this.setState({search: {}});
   }

  // 在选择站点时候触发
  @Bind()
  onSelectedSite(value){
    const { dispatch } = this.props;
    this.setState({siteId: value});
    dispatch({
      type: 'nonStandardProductReport/fetchDivisionList',
      payload: {
        siteId: value,
      },
    });
  }

  // 在选择事业部时候触发
  @Bind()
  onSelectedDivision(value){
    const { dispatch } = this.props;
    dispatch({
      type: 'nonStandardProductReport/fetchWorkcellList',
      payload: {
        siteId: this.state.siteId,
        departmentId: value,
      },
    });
  }

  // 行分页查询
  @Bind()
  onLineSearch(page = {}, fields = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'nonStandardProductReport/fetchLineList',
      payload: {
        ...this.state.selectRecord,
        siteId: this.state.siteId,
        page,
        ...fields,
      },
    });
  }

  render() {
    const {
      tenantId,
      nonStandardProductReport: {
        headList = [],
        headPagination = {},
        // lineList = [],
        // linePagination = {},
        siteMap = [],
        divisionMap = [],
        workcellMap = [],
        makeNumList = [],
        makeNumPagination = {},
        defectsNumbList = [],
        defectsNumbPagination = {},
        repairNumList = [],
        repairNumPagination ={},

        woStatus = [],
      },
      fetchHeadLoading,
      match: { path },
      // fetchLineLoading,
    } = this.props;

    const{ makeNumDrawer, defectsNumbDrawer, repairNumDrawer } = this.state;

    // 查询
    const filterFormProps = {
      siteMap,
      divisionMap,
      workcellMap,
      woStatus,
      path,
      siteId: cookies.get('defaultSiteId'),
      onSearch: this.handleSearch,
      resetForm: this.onResetSearch,
      onSelectedSite: this.onSelectedSite,
      onSelectedDivision: this.onSelectedDivision,
    };

    // 头表
    const headTableProps = {
      onRow: this.handleOnRow,
      onSearch: this.onHeadSearch,
      dataSource: headList,
      path,
      pagination: headPagination,
      loading: fetchHeadLoading,
      onMakeNumDetail: this.onMakeNumDetail,
      onDefectsNumbDetail: this.onDefectsNumbDetail,
      onRepairNumDetail: this.onRepairNumDetail,
    };

    // 行表
    // const liineTableProps = {
    //   onSearch: this.onLineSearch,
    //   dataSource: lineList,
    //   pagination: linePagination,
    //   loading: fetchLineLoading,
    //   onMakeNumDetail: this.onMakeNumDetail,
    //   onDefectsNumbDetail: this.onDefectsNumbDetail,
    //   onRepairNumDetail: this.onRepairNumDetail,
    // };

    // 产量
    const makeNumTableProps = {
      makeNumDrawer,
      dataSource: makeNumList,
      pagination: makeNumPagination,
      onMakeNumSearch: this.onMakeNumSearch,
      onMakeNumCancel: this.onMakeNumCancel,
    };

    // 不良数
    const defectsNumbTableProps = {
      defectsNumbDrawer,
      dataSource: defectsNumbList,
      pagination: defectsNumbPagination,
      onDefectsNumbSearch: this.onDefectsNumbSearch,
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
        <Header title="非标产品报表">
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/hme-common-report/non-standard-product-report-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
          <HeadTable {...headTableProps} />
          {/* <LineTable {...liineTableProps} /> */}
          {makeNumDrawer && <MakeNumDrawer {...makeNumTableProps} />}
          {defectsNumbDrawer && <DefectsNumbDrawer {...defectsNumbTableProps} />}
          {repairNumDrawer && <RepairNumDrawer {...onRepairNumTableProps} />}
        </Content>
      </Fragment>
    );
  }
}
