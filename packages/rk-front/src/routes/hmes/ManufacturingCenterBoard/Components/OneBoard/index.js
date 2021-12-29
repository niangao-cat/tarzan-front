/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import React, { PureComponent, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Col, Row } from 'hzero-ui';
import { isEmpty } from 'lodash';
import {
  BorderBox12,
} from '@jiaminghi/data-view-react';
import { getCurrentOrganizationId } from 'utils/utils';

import styles from './index.less';
// import BadConditionTable from './badConditionTable';
import MonthPlanChart from './MonthPlanChart';
import InspectionNcTable from './InspectionNcTable';
import ProductionGroupChart from './ProductionGroupChart';
import DailyPlanTable from './DailyPlanTable';
import ProcessNcChart from './ProcessNcChart';
import ProdLineModal from './ProdLineModal';

@connect(({ manufacturingCenterBoard, loading }) => ({
  manufacturingCenterBoard,
  tenantId: getCurrentOrganizationId(),
  fetchProdLineListLoading: loading.effects['manufacturingCenterBoard/fetchProdLineList'],
}))
export default class ManufacturingCenterBoard extends PureComponent {

  constructor(props) {
    super(props);
    this.initData();
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/updateState',
      payload: {
        visible: true,
        monthPlanPage: 0,
        dailyPlanPage: 0,
        productionGroupList: [],
        allProductionGroupList: [],
        productionGroupPage: 0,
        dailyPlanList: [],
        allDailyPlanList: [],
        inspectionNcList: [],
        allInspectionNcList: [],
        inspectionNcPage: 0,
        processNcList: [],
        allProcessNcList: [],
        processNcPage: 0,
        monthPlanData: {
          productionList: [],
          planCompleteList: [],
          completedList: [],
          unCompletedList: [],
        },
        allMonthPlanData: {
          productionList: [],
          planCompleteList: [],
          completedList: [],
          unCompletedList: [],
        },
        ROLLING_FREQUENCY: 0,
        REFRESH_FREQUENCY: 0,
      },
    });
  }

  // 设置时间
  componentDidMount() {
    const { dispatch } = this.props;
    // 查询检验质量看板配置信息
    dispatch({
      type: 'manufacturingCenterBoard/init',
    });
    this.handleFetchProdLineList();
  }

  componentWillUnmount() {
    clearInterval(this.refreshComponent);
    clearInterval(this.rollingComponent);
  }

  @Bind()
  handleFetchProdLineInfo(prodLineId) {
    const { dispatch, manufacturingCenterBoard: { REFRESH_FREQUENCY, ROLLING_FREQUENCY } } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/updateState',
      payload: {
        visible: false,
      },
    });
    clearInterval(this.refreshComponent);
    clearInterval(this.rollingComponent);
    this.handleFetchMonthPlanChart(prodLineId);
    this.handleFetchDailyPlanChart(prodLineId);
    this.handleFetchProductionGroupList(prodLineId);
    this.handleFetchProcessNcList(prodLineId);
    this.handleFetchInspectionNcList(prodLineId);
    this.refreshComponent = setInterval(() => {
      this.handleFetchMonthPlanChart(prodLineId);
      this.handleFetchDailyPlanChart(prodLineId);
      this.handleFetchProductionGroupList(prodLineId);
      this.handleFetchProcessNcList(prodLineId);
      this.handleFetchInspectionNcList(prodLineId);
    }, REFRESH_FREQUENCY * 60 * 1000);
    this.rollingComponent = setInterval(() => {
      this.handleChangeMonthPlanChart();
      this.handleChangeDailyPlanChart();
      this.handleChangeProductionGroupList();
      this.handleChangeProcessNcList();
      this.handleChangeInspectionNcList();
    }, ROLLING_FREQUENCY * 1000);
  }

  @Bind()
  handleFetchMonthPlanChart(prodLineId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/fetchMonthPlanChart',
      payload: {
        prodLineId,
      },
    });
  }

  @Bind()
  handleChangeMonthPlanChart() {
    const { dispatch, manufacturingCenterBoard: { allMonthPlanData, monthPlanPage } } = this.props;
    const { productionList, planCompleteList, completedList, unCompletedList } = allMonthPlanData;
    if ((monthPlanPage + 1) * 6 < productionList.length) {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          monthPlanData: {
            productionList: productionList.slice((monthPlanPage + 1) * 6, (monthPlanPage + 2) * 6),
            planCompleteList: planCompleteList.slice((monthPlanPage + 1) * 6, (monthPlanPage + 2) * 6),
            completedList: completedList.slice((monthPlanPage + 1) * 6, (monthPlanPage + 2) * 6),
            unCompletedList: unCompletedList.slice((monthPlanPage + 1) * 6, (monthPlanPage + 2) * 6),
          },
          monthPlanPage: monthPlanPage + 1,
        },
      });
    } else {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          monthPlanData: {
            productionList: productionList.slice(0, 6),
            planCompleteList: planCompleteList.slice(0, 6),
            completedList: completedList.slice(0, 6),
            unCompletedList: unCompletedList.slice(0, 6),
          },
          monthPlanPage: 0,
        },
      });
    }
  }

  // 不良情况表格查询
  @Bind()
  handleFetchDailyPlanChart(prodLineId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/fetchDailyPlanChart',
      payload: {
        prodLineId,
      },
    });
  }

  @Bind()
  handleChangeDailyPlanChart() {
    const { dispatch, manufacturingCenterBoard: { allDailyPlanList = [], dailyPlanPage } } = this.props;
    if ((dailyPlanPage + 1) * 10 < allDailyPlanList.length) {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          dailyPlanList: allDailyPlanList.slice((dailyPlanPage + 1) * 10, (dailyPlanPage + 2) * 10),
          dailyPlanPage: dailyPlanPage + 1,
        },
      });
    } else {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          dailyPlanList: allDailyPlanList.slice(0, 10),
          dailyPlanPage: 0,
        },
      });
    }
  }

  // 不良情况表格查询
  @Bind()
  handleFetchProductionGroupList(prodLineId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/fetchProductionGroupList',
      payload: {
        prodLineId,
      },
    });
  }

  @Bind()
  handleChangeProductionGroupList() {
    const { dispatch, manufacturingCenterBoard: { allProductionGroupList = [], productionGroupPage } } = this.props;
    if ((productionGroupPage + 1) * 3 < allProductionGroupList.length) {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          productionGroupList: allProductionGroupList.slice((productionGroupPage + 1) * 3, (productionGroupPage + 2) * 3),
          productionGroupPage: productionGroupPage + 1,
        },
      });
    } else {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          productionGroupList: allProductionGroupList.slice(0, 3),
          productionGroupPage: 0,
        },
      });
    }
  }

  // 不良情况表格查询
  @Bind()
  handleFetchProcessNcList(prodLineId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/fetchProcessNcList',
      payload: {
        prodLineId,
      },
    });
  }


  @Bind()
  handleChangeProcessNcList() {
    const { dispatch, manufacturingCenterBoard: { allProcessNcList = [], processNcPage } } = this.props;
    if ((processNcPage + 1) * 2 < allProcessNcList.length) {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          processNcList: allProcessNcList.slice((processNcPage + 1) * 2, (processNcPage + 2) * 2),
          processNcPage: processNcPage + 1,
        },
      });
    } else {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          processNcList: allProcessNcList.slice(0, 2),
          processNcPage: 0,
        },
      });
    }
  }

  // 不良情况表格查询
  @Bind()
  handleFetchInspectionNcList(prodLineId) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/fetchInspectionNcList',
      payload: {
        prodLineId,
      },
    });
  }


  @Bind()
  handleChangeInspectionNcList() {
    const { dispatch, manufacturingCenterBoard: { allInspectionNcList = [], inspectionNcPage } } = this.props;
    if ((inspectionNcPage + 1) * 8 < allInspectionNcList.length) {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          inspectionNcList: allInspectionNcList.slice((inspectionNcPage + 1) * 8, (inspectionNcPage + 2) * 8),
          inspectionNcPage: inspectionNcPage + 1,
        },
      });
    } else {
      dispatch({
        type: 'manufacturingCenterBoard/updateState',
        payload: {
          inspectionNcList: allInspectionNcList.slice(0, 8),
          inspectionNcPage: 0,
        },
      });
    }
  }

  @Bind()
  handleCloseModal() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/updateState',
      payload: {
        visible: false,
      },
    });
  }

  @Bind()
  handleFetchProdLineList(page = {}, fields = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingCenterBoard/fetchProdLineList',
      payload: {
        ...fields,
        page,
      },
    });
  }


  render() {
    const {
      tenantId,
      fetchProdLineListLoading,
      manufacturingCenterBoard: {
        productionGroupList = [],
        dailyPlanList = [],
        inspectionNcList = [],
        processNcList = [],
        monthPlanData = {},
        inspectionNcRate,
        inspectionNcPage,
        visible,
        prodLineList,
        prodLinePagination,
      },
    } = this.props;
    const enterModalProps = {
      visible,
      tenantId,
      loading: fetchProdLineListLoading,
      dataSource: prodLineList,
      pagination: prodLinePagination,
      onSearch: this.handleFetchProdLineList,
      onCloseModal: this.handleCloseModal,
      onFetchProdLineInfo: this.handleFetchProdLineInfo,
    };
    return (
      <Fragment>
        <Row style={{ height: '100%' }}>
          <Col span={8}>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-board-one-div']}>月度计划</div>
                </div>
                <div className={styles['production-board-one-div-chart-yield']}>
                  {isEmpty(monthPlanData.productionList) ? (
                    <div className={styles['production-board-no-data']}>暂无数据</div>
                  ) : (
                    <MonthPlanChart
                      data={monthPlanData}
                    />
                  )}
                </div>
              </BorderBox12>
            </div>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-board-one-div']}>日计划达成率</div>
                </div>
                <div className={styles['production-board-one-div-table-yield']}>
                  <div className={styles.inspection}>
                    <DailyPlanTable
                      dataSource={dailyPlanList}
                    />
                  </div>
                </div>
              </BorderBox12>
            </div>
          </Col>
          <Col span={9}>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-board-one-div']}>直通率明细</div>
                </div>
                <div className={styles['production-board-one-div-line']}>
                  {isEmpty(productionGroupList) ? (
                    <div className={styles['production-board-no-data']}>暂无数据</div>
                  ) : productionGroupList.map(e => (
                    <div className={styles['production-board-one-div-line-yield']}>
                      <ProductionGroupChart data={e} />
                    </div>
                  ))}
                </div>
              </BorderBox12>
            </div>
          </Col>
          <Col span={7}>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-board-one-div']}>工序不良TOP5</div>
                </div>
                <Row className={styles['center-production-board-one-div-bar']}>
                  {isEmpty(processNcList) ? (
                    <div className={styles['production-board-no-data']}>暂无数据</div>
                  ) : processNcList.map(e => (
                    <Col span={24}>
                      <div className={styles['production-board-one-div-bar-yield']}>
                        <ProcessNcChart
                          data={e}
                        />
                      </div>
                    </Col>
                  ))}
                </Row>
              </BorderBox12>
            </div>
            <div className={styles['production-board-one']}>
              <BorderBox12 className={styles['production-board-one-BorderBox15']}>
                <div className={styles['production-board-title']}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-board-one-div']}>巡检不良</div>
                  <div className={styles['production-board-one-div-right']}>巡检不良率： {inspectionNcRate}</div>
                </div>
                <div className={styles['production-board-one-div-table-yield']}>
                  <div className={styles.inspection}>
                    <InspectionNcTable
                      dataSource={inspectionNcList}
                      page={inspectionNcPage}
                    />
                  </div>
                </div>
              </BorderBox12>
            </div>
          </Col>
        </Row>
        <ProdLineModal {...enterModalProps} />
      </Fragment>
    );
  }
}
