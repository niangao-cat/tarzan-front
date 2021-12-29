
/**
 * ywj
 * des: IQC检验看板
 */
import React from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Card, Row, Col, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { getCurrentOrganizationId } from 'utils/utils';
import ExcelExport from 'components/ExcelExport';
import { ReportHost } from '@/utils/config';
import FilterForm from './FilterForm';
import MainTable from './MainTable';
import BinEcharts from './BinEcharts';
import FoldLineEharts from './FoldLineEharts';

// 连接model层
@connect(({ iqcInspectBoard, loading }) => ({
  iqcInspectBoard,
  tenantId: getCurrentOrganizationId(),
  fetchDataLoading: loading.effects['iqcInspectBoard/fetchList']||loading.effects['iqcInspectBoard/fetchPie']||loading.effects['iqcInspectBoard/fetchLine'],
}))

export default class iqcInspectionPlatform extends React.Component {
  // 构造函数
  constructor(props) {
    // 继承上文的属性
    super(props);

    // 设置状态
    this.state = {
      search: {}, // 查询条件暂存
    };
  }

  // 加载时，调用的方法
  componentDidMount() {

    // 默认下拉框列表查询
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcInspectBoard/init',
    });

    // 默认查询三个数据接口: 列表
    this.searchListByFields({});

    // ：饼状图
    this.searchBie({});

    // ：折线图
    this.searchLine({});
  }

  /**
   * 条件查询列表接口
   * @param {*} params
   */
  @Bind
  searchListByFields(params = {}){
    const { dispatch } = this.props;
    this.setState({ search: params }); // 暂存条件
    dispatch({
      type: 'iqcInspectBoard/fetchList',
      payload: {
        ...params,
      },
    });

    // ：饼状图
    this.searchBie(params);

    // ：折线图
    this.searchLine(params);
  }

  /**
   * 重置界面
   */
  @Bind()
  resetForm(){
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcInspectBoard/updateState',
      payload: {
        tableList: [],
        tablePagination: {},
        lineData: {},
        pieData: {},
      },
    });
  }

  /**
   * 分页查询列表接口
   * @param {*} params
   */
  @Bind
  searchListByPagination(page = {}){
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcInspectBoard/fetchList',
      payload: {
        ...this.state.search,
        page,
      },
    });
  }


  /**
   * 条件查询饼状图信息
   * @param {*} params
   */
  @Bind
  searchBie(params = {}){
    const { dispatch } = this.props;
    dispatch({
      type: 'iqcInspectBoard/fetchPie',
      payload: {
        ...params,
      },
    });
  }

  /**
   * 条件查询折线图信息
   * @param {*} params
   */
  @Bind
  searchLine(params = {}){
    const { dispatch } = this.props;

    // 判断查询的日期开始和结束是否都有值， 没有则直接设置为空
    if(params.inspectionFinishDateFromStr === ""||params.inspectionFinishDateFromStr === null||params.inspectionFinishDateFromStr === undefined||params.inspectionFinishDateToStr === ""||params.inspectionFinishDateToStr === null||params.inspectionFinishDateToStr === undefined){
      dispatch({
        type: 'iqcInspectBoard/updateState',
        payload: {
          lineData: {},
        },
      });
    }else{
      dispatch({
        type: 'iqcInspectBoard/fetchLine',
        payload: {
          ...params,
        },
      });
    }
  }

  @Bind()
  handleGetFormValue() {
    return this.state.search;
  }


  // 渲染
  render() {

    const { tenantId, iqcInspectBoard: { tableList= [], tablePagination= {}, pieData= {}, lineData= {}, inspectStatus= []}, fetchDataLoading } = this.props;

    // 查询条件渲染
    const filterProps = {
      inspectStatus,
      onSearch: this.searchListByFields,
      onResetForm: this.resetForm,
    };

    // 列表信息查询
    const tableProps = {
      dataSource: tableList,
      pagination: tablePagination,
      onSearch: this.searchListByPagination,
    };

    // 饼状图信息查询
    const pieProps = {
      dataSource: pieData,
    };

    // 折线图信息查询
    const lineProps = {
      dataSource: lineData,
    };

    // 界面返回
    return (
      <React.Fragment>
        <Header title='IQC检验报表'>
          <ExcelExport
            exportAsync
            requestUrl={`${ReportHost}/v1/${tenantId}/qms-iqc-examine-report/iqc-examine-report-export`} // 路径
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue()}
          />
        </Header>
        <Content>
          <Spin spinning={!!fetchDataLoading}>
            <FilterForm {...filterProps} />
            <MainTable {...tableProps} />
            <Card
              key="code-rule-liner"
              title="汇总"
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
            />
            <Row>
              <Col span="3" style={{fontSize: '16px', fontWeight: 'bold'}}>
                <div style={{textAlign: 'center', marginTop: '95%'}}>
                  <span>检验总数：{pieData.totalNum}</span>
                  <br />
                  <span>合格数据：{pieData.okNum}</span>
                  <br />
                  <span>不合格数：{pieData.ngNum}</span>
                </div>
              </Col>
              <Col span="9">
                <BinEcharts {...pieProps} />
              </Col>
              <Col span="12">
                <FoldLineEharts {...lineProps} />
              </Col>
            </Row>
          </Spin>
        </Content>
      </React.Fragment>
    );
  }
}
