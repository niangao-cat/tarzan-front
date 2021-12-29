import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Row, Col } from 'hzero-ui';
import notification from 'utils/notification';
import {
  FullScreenContainer,
} from '@jiaminghi/data-view-react';
import { IndexPageStyle, IndexPageContent } from './style';

import AcceptedTestedBoard from './AcceptedTestedBoard';
import AcceptedPuted from './AcceptedPuted';
import DistributionDailyDistributionTasks from './DistributionDailyDistributionTasks';
import MonthlyDistributionTaskStatistics from './MonthlyDistributionTaskStatistics';
import DeliveryScheduleNissanLineTable from './DeliveryScheduleNissanLineTable';
import './index.less';
import './flexible';
import { exitFullscreen, fullScreenEnabled, launchFullscreen } from './util';


const LogisticsMonitoringBoard = props => {
  const [isFullFlag, setIsFullFlag] = useState(false);
  const [dailyData, setDailyData] = useState([]); // 饼图数据源
  const [proLineData, setProLineData] = useState([]); // 表格数据源
  const [monthData, setMonthData] = useState([]); // 柱形图数据源
  const [proLineDataPage, setProLineDataPage] = useState(0); // 表格分页存储
  const [time, setTime] = useState(moment(new Date()).format('YYYY-MM-DD HH:mm:ss'));

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setIsFullFlag(document.fullscreenElement);
    });
    // setInterval(() => {
    //   setTime(() => {
    //     return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    //   });
    // }, 1000);
    // setInterval(() => {
    //   queryDailyDataQuery();
    // }, 60000);
    // setInterval(() => {
    //   mouthDataQuery();
    // }, 60000);
    setInterval(() => {
      // proLineDataQuery();
      setProLineDataPage(n => {
        return n === 0 ? 1 : 0;
      });
    }, 30000);
    // 查询日配送任务分布
    queryDailyDataQuery();
    // 查询日产线配送任务进度
    proLineDataQuery();
    // 查询每月配送任务进度
    mouthDataQuery();
  }, []);

  useEffect(() => {
    const timer =setInterval(() => {
      setTime(() => {
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const queryDailyDataTimer = setInterval(() => {
      queryDailyDataQuery();
    }, 60000);
    return () => clearTimeout(queryDailyDataTimer);
  }, []);

  useEffect(() => {
    const mouthDataQueryTimer = setInterval(() => {
      mouthDataQuery();
    }, 60000);
    return () => clearTimeout(mouthDataQueryTimer);
  }, []);

  useEffect(() => {
    proLineDataQuery();
  }, [proLineDataPage]);

  // 查询日配送任务分布
  const queryDailyDataQuery = () => {
    const { dispatch } = props;
    dispatch({
      type: 'logisticsMonitoringBoard/queryDailyDataQuery',
      payload: {},
    }).then(res => {
      if (res) {
        const newData = [];
        res.map(item => {
          newData.push({
            value: item.quantity,
            name: item.insDocStatusMeaning,
            label: {
              formatter: '{d}%',
              color: 'white',
            },
            itemStyle: {
              color: item.color,
            },
          });
          return newData;
        });
        setDailyData(newData);
      }
    });
  };

  // 查询日产线配送任务进度
  const proLineDataQuery = () => {
    const { dispatch } = props;
    dispatch({
      type: 'logisticsMonitoringBoard/proLineDataQuery',
      payload: {
        page: proLineDataPage,
        size: 8,
      },
    }).then(res => {
      if (res) {
        if (res.content.length > 1) {
          setProLineData(res.content);
        }
      }
    });
  };

  // 查询每月配送任务进度
  const mouthDataQuery = () => {
    const { dispatch } = props;
    dispatch({
      type: 'logisticsMonitoringBoard/mouthDataQuery',
      payload: {},
    }).then(res => {
      if (res) {
        const data = Object.values(res);
        if (data.length > 0) {
          setMonthData(data);
        }
      }
    });
  };

  /**
   * 全屏
   */
  const screenFull = () => {
    if (fullScreenEnabled !== undefined && !fullScreenEnabled) {
      notification.warning({
        message: '暂不支持全屏',
      });
      return;
    }
    setIsFullFlag(!isFullFlag);
    if (!isFullFlag) {
      const chartDom = document.getElementById('logistics-monitoring-board');
      launchFullscreen(chartDom);
    } else {
      exitFullscreen();
    }
  };

  return (
    <div id='acceptedPuted'>
      <FullScreenContainer>
        <IndexPageStyle>
          <IndexPageContent>
            <div>
              <div className="logistics-monitoring-board" id="logistics-monitoring-board">
                <div className="title-box">
                  <div className="title-time">{time}</div>
                  <div className="title-board">物流综合监控看板</div>
                  <div style={{ marginLeft: '28%' }}>
                    <Button onClick={screenFull} icon={isFullFlag ? 'shrink' : 'arrows-alt'}>
                      {isFullFlag ? '取消全屏' : '全屏'}
                    </Button>
                  </div>
                </div>
                <div className="content-box">
                  <div id="contentBoxA">
                    <div className="content-box-A-title">已收待验看板</div>
                    <AcceptedTestedBoard />
                  </div>
                  <div id="contentBoxB">
                    <div className="content-box-A-title">已验待上架看板</div>
                    <AcceptedPuted />
                  </div>
                </div>
                {/* <div className="foot-box"> */}
                {/*  <div id="footBoxA"> */}
                {/*    <DistributionDailyDistributionTasks dataSource={dailyData} /> */}
                {/*  </div> */}
                {/*  <div id="footBoxB"> */}
                {/*    <div className="footBoxB-title">日产线配送任务进度表</div> */}
                {/*    <div style={{ marginTop: '3%' }}> */}
                {/*      <DeliveryScheduleNissanLineTable dataSource={proLineData} /> */}
                {/*    </div> */}
                {/*  </div> */}
                {/*  <div id="footBoxC"> */}
                {/*    <MonthlyDistributionTaskStatistics dataSource={monthData} /> */}
                {/*  </div> */}
                {/* </div> */}
                <Row style={{ backgroundColor: '#203864' }}>
                  <Col span={8}>
                    <DistributionDailyDistributionTasks dataSource={dailyData} />
                  </Col>
                  <Col span={8} style={{ color: 'white' }}>
                    <div className="footBoxB-title">日产线配送任务进度表</div>
                    <DeliveryScheduleNissanLineTable dataSource={proLineData} />
                  </Col>
                  <Col span={8}>
                    <MonthlyDistributionTaskStatistics dataSource={monthData} />
                  </Col>
                </Row>
              </div>
            </div>
          </IndexPageContent>
        </IndexPageStyle>
      </FullScreenContainer>
    </div>
  );
};

export default connect(({ logisticsMonitoringBoard }) => ({
  logisticsMonitoringBoard,
}))(LogisticsMonitoringBoard);