/* eslint-disable no-unused-vars */
/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { Component } from 'react';
import { Row, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import { isArray, isEmpty, cloneDeep } from 'lodash';
import {
  FullScreenContainer,
} from '@jiaminghi/data-view-react';
import { IndexPageStyle, IndexPageContent } from './style';
import { IEVersion, launchFullscreen, exitFullscreen, fullScreenEnabled } from './util';
import TopPage from './Components/TopPage/TopPage';
import OneBoard from './Components/OneBoard/index';
import './Components/flexible';

import styles from './index.less';

@connect(({ manufacturingDepartmentBoard, loading }) => ({
  manufacturingDepartmentBoard,
  fetchCardDataLoading: loading.effects['manufacturingDepartmentBoard/fetchRefreshFrequencytop'],
}))
export default class ManufacturingDepartmentBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullFlag: false,
      areaId: null,
      dailyList: [],
      pullList: [],
      topList: [],
      moonList: [],
      minute: '',
      second: '',
      value: '',
    };
    this.initData();
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingDepartmentBoard/init',
    }).then(res => {
      if (res) {
        const {
          manufacturingDepartmentBoard: { warehouse = [], times = [] },
        } = this.props;
        this.setState({
          minute: Number(times[0].meaning),
          second: Number(times[1].meaning),
          value: warehouse[0].value,
        });
        // 刷新请求
        if (warehouse && warehouse.length > 0) {
          dispatch({
            type: 'manufacturingDepartmentBoard/fetchRefreshFrequencymoon',
            payload: {
              areaCode: warehouse && warehouse.length > 0 ? warehouse[0].value : '',
            },
          });
          // 工序不良TOP5
          dispatch({
            type: 'manufacturingDepartmentBoard/fetchRefreshFrequencytop',
            payload: {
              areaCode: warehouse && warehouse.length > 0 ? warehouse[0].value : '',
            },
          }).then((ok) => {
            const {
              manufacturingDepartmentBoard: { topList = [] },
            } = this.props;
            this.setState({
              topList,
            });
          });
          //  日计划达成率
          dispatch({
            type: 'manufacturingDepartmentBoard/fetchRefreshFrequencymoon',
            payload: {
              areaCode: warehouse && warehouse.length > 0 ? warehouse[0].value : '',
            },
          }).then((ok) => {
            const {
              manufacturingDepartmentBoard: { dailyList = [] },
            } = this.props;
            this.setState({
              dailyList,
            });
          });
          // 达成率统计汇总 月度计划
          dispatch({
            type: 'manufacturingDepartmentBoard/fetchRefreshrequencyget',
            payload: {
              areaCode: warehouse && warehouse.length > 0 ? warehouse[0].value : '',
            },
          }).then((ok) => {
            const {
              manufacturingDepartmentBoard: { moonList = [] },
            } = this.props;
            this.setState({
              moonList,
            });
          });
        }
      }
      const time = (this.state.minute) * 1000 * 60;
      // 每过一段时间刷新一次
      this.interval = setInterval(() => {
        this.tick();
      }, time);
    });
  }

  componentWillMount() {
    // 判断浏览器是否为ie
    this.ieFlag = IEVersion();
  }

  @Bind()
  screenFull() {
    if (fullScreenEnabled !== undefined && !fullScreenEnabled) {
      notification.warning({
        message: '暂不支持全屏',
      });
      return;
    }
    const chartDom = document.getElementById('acceptedPuted');
    this.setState(
      {
        isFullFlag: !this.state.isFullFlag,
      },
      () => {
        if (this.state.isFullFlag) {
          launchFullscreen(chartDom);
        } else {
          exitFullscreen();
        }
      }
    );
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingDepartmentBoard/updateState',
      payload: {
        monthPlanPage: 0,
        dailyPlanPage: 0,
        productionGroupList: [],
        allProductionGroupList: [],
        productionGroupPage: 0,
        dailyPlanList: [],
        allDailyPlanList: [],
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
    clearInterval(this.refreshComponent);
    clearInterval(this.rollingComponent);
  }

  componentWillUnmount() {
    clearInterval(this.refreshComponent);
    clearInterval(this.rollingComponent);
  }

  @Bind()
  // 此函数作为页面刷新频率的使用函数
  tick() {
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingDepartmentBoard/fetchRefreshFrequencymoon',
      payload: {
        areaCode: this.state.value,
      },
    });

    // 工序不良TOP5
    dispatch({
      type: 'manufacturingDepartmentBoard/fetchRefreshFrequencytop',
      payload: {
        areaCode: this.state.value,
      },
    }).then((ok) => {
      const {
        manufacturingDepartmentBoard: { topList = [] },
      } = this.props;
      this.setState({
        topList,
      });
    });
    //  日计划达成率
    dispatch({
      type: 'manufacturingDepartmentBoard/fetchRefreshFrequencymoon',
      payload: {
        areaCode: this.state.value,
      },
    }).then((ok) => {
      const {
        manufacturingDepartmentBoard: { dailyList = [] },
      } = this.props;
      this.setState({
        dailyList,
      });
    });
    // 达成率统计汇总 月度计划
    dispatch({
      type: 'manufacturingDepartmentBoard/fetchRefreshrequencyget',
      payload: {
        areaCode: this.state.value,
      },
    }).then((ok) => {
      const {
        manufacturingDepartmentBoard: { moonList = [] },
      } = this.props;
      this.setState({
        moonList,
      });
    });
  }

  @Bind()
  handleFetchInfo(value) {
    this.setState({
      value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'manufacturingDepartmentBoard/fetchRefreshFrequencymoon',
      payload: {
        areaCode: value,
      },
    });

    // 工序不良TOP5
    dispatch({
      type: 'manufacturingDepartmentBoard/fetchRefreshFrequencytop',
      payload: {
        areaCode: value,
      },
    }).then((ok) => {
      const {
        manufacturingDepartmentBoard: { topList = [] },
      } = this.props;
      this.setState({
        topList,
      });
    });
    //  日计划达成率
    dispatch({
      type: 'manufacturingDepartmentBoard/fetchRefreshFrequencymoon',
      payload: {
        areaCode: value,
      },
    }).then((ok) => {
      const {
        manufacturingDepartmentBoard: { dailyList = [] },
      } = this.props;
      this.setState({
        dailyList,
      });
    });
    // 达成率统计汇总 月度计划
    dispatch({
      type: 'manufacturingDepartmentBoard/fetchRefreshrequencyget',
      payload: {
        areaCode: value,
      },
    }).then((ok) => {
      const {
        manufacturingDepartmentBoard: { moonList = [] },
      } = this.props;
      this.setState({
        moonList,
      });
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { isFullFlag, areaId, dailyList, pullList, topList, moonList, minute, second } = this.state;
    const { fetchCardDataLoading } = this.props;
    return (
      <div id='acceptedPuted'>
        <FullScreenContainer>
          <IndexPageStyle>
            <TopPage
              screenFull={this.screenFull}
              isFullFlag={isFullFlag}
              areaId={areaId}
              onFetchInfo={this.handleFetchInfo}
            />
            <IndexPageContent>
              <Row>
                <div className={styles['production-center-board-spinning']}>
                  <Spin
                    // spinning={loading || false}
                    spinning={fetchCardDataLoading}
                  >
                    <OneBoard
                      pullList={pullList}
                      topList={topList}
                      dailyList={dailyList}
                      moonList={moonList}
                      minute={minute}
                      second={second}
                    />
                  </Spin>
                </div>
              </Row>
            </IndexPageContent>
          </IndexPageStyle>
        </FullScreenContainer>
      </div>
    );
  }
}
