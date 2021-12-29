/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */
import React, { PureComponent, Fragment } from 'react';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Col, Row } from 'hzero-ui';
import {
  BorderBox12,
} from '@jiaminghi/data-view-react';
import styles from './index.less';
import BadConditionTable from './badConditionTable';
import InspectorInspectionCharts from './inspectorInspectionCharts';
import TypeInspectionCharts from './typeInspectionCharts';
import { ModuleTitle } from '../globalStyledSet';

@connect(({ finishedProductInspectionBoard }) => ({
  finishedProductInspectionBoard,
  organizationId: getCurrentOrganizationId(),
}))
export default class FinishedProductInspectionBoard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  // 设置时间
  componentDidMount() {
    this.queryInspectionCharts();
    const { dispatch, organizationId } = this.props;
    // 查询检验质量看板配置信息
    dispatch({
      type: 'finishedProductInspectionBoard/init',
      payload: {
        organizationId,
      },
    }).then(res => {
      if (res && res.inspectionBoardConfig) {
        const { finishedProductInspectionBoard: { ROLLING_FREQUENCY, REFRESH_FREQUENCY } } = this.props;
        this.handleSearch();
        // inspectionBoardConfig[3].meaning 不良内容行数
        // inspectionBoardConfig[4].meaning 不良内容滚动频率(秒)
        // inspectionBoardConfig[5].meaning 刷新频率
        this.intervalTable = setInterval(() => {
          this.queryInspectionCharts();
        }, (REFRESH_FREQUENCY * 60 * 1000));
        this.intervalCharts = setInterval(() => {
          this.handleChangePage();
        }, (ROLLING_FREQUENCY * 1000));
        this.interval = setInterval(() => {
          this.handleSearch();
        }, (REFRESH_FREQUENCY * 60 * 1000));
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.intervalTable);
    clearInterval(this.intervalCharts);
    clearInterval(this.interval);
  }

  // 不良情况表格查询
  @Bind()
  handleSearch() {
    const { dispatch, finishedProductInspectionBoard: { NC_ROWS_NUM } } = this.props;
    dispatch({
      type: 'finishedProductInspectionBoard/querybadConditionTable',
      payload: {
        pageSize: NC_ROWS_NUM,
        page: this.state.page,
      },
    })
    // .then(res => {
    //   if (res && res.number + 1 === res.totalPages) {
    //     this.setState({ page: 0 });
    //   } else if (res) {
    //     this.setState({ page: res.number + 1 });
    //   }
    // })
    ;
  }

  @Bind()
  handleChangePage() {
    const { dispatch, finishedProductInspectionBoard: { allList = [], NC_ROWS_NUM = [] } } = this.props;
    const { page } = this.state;
    // const pageSize = 1;
    const pageSize = NC_ROWS_NUM;
    if ((page + 1) * pageSize < allList.length) {
      dispatch({
        type: 'finishedProductInspectionBoard/updateState',
        payload: {
          list: allList.slice((page + 1) * pageSize, (page + 2) * pageSize),
        },
      });
      this.setState({ page: page + 1 });
    } else {
      dispatch({
        type: 'finishedProductInspectionBoard/updateState',
        payload: {
          list: allList.slice(0, pageSize),
        },
      });
      this.setState({ page: 0 });
    }
  }

  // 检验情况看板查询
  @Bind()
  queryInspectionCharts() {
    const { dispatch, organizationId } = this.props;
    dispatch({
      type: 'finishedProductInspectionBoard/queryInspectionCharts',
      payload: {
        organizationId,
      },
    });
  }

  render() {
    const {
      finishedProductInspectionBoard: {
        inspectionChartsData = {},
        list = [],
        NC_ROWS_NUM,
      },
    } = this.props;
    const { productQualityInspectionUserVO = {}, qmsProductQualityInspectionTypeVO = {} } = inspectionChartsData;
    const { page } = this.state;
    return (
      <Fragment>
        <Row style={{ height: '100%' }}>
          <Col span={12}>
            <div className={styles['production-baord-one']}>
              <BorderBox12 className={styles['production-baord-one-BorderBox15']}>
                <ModuleTitle style={{ paddingTop: '0.2rem' }}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-baord-one-div']}>检验员检验情况</div>
                </ModuleTitle>
                <div className={styles['production-baord-one-div-chart-yield']}>
                  <InspectorInspectionCharts
                    inspectorInspectionData={productQualityInspectionUserVO}
                  />
                </div>
              </BorderBox12>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles['production-baord-one']}>
              <BorderBox12 className={styles['production-baord-one-BorderBox15']}>
                <ModuleTitle style={{ paddingTop: '0.2rem' }}>
                  <div style={{ backgroundColor: '#bcdcff', height: '0.33rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
                  <div className={styles['production-baord-one-div']}>各型号检验情况</div>
                </ModuleTitle>
                <div className={styles['production-baord-one-div-chart-yield']}>
                  <TypeInspectionCharts
                    typeInspectionData={qmsProductQualityInspectionTypeVO}
                  />
                </div>
              </BorderBox12>
            </div>
          </Col>
        </Row>
        <Row style={{ height: '100%' }}>
          <div className={styles['production-baord-one']}>
            <BadConditionTable badConditionList={list} page={page} pageSize={NC_ROWS_NUM} />
          </div>
        </Row>
      </Fragment>
    );
  }
}
