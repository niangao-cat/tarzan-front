/**
 * @Author:ywj
 * @email:wenjie.yang01@hand-china.com
 * @description: 设备监控看板
 */

import React, { Component, Fragment } from 'react';
import { Row, Col, Spin, Button } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import ruikeLogo from '@/assets/logo.png';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import yg from '../../../assets/stuffUpAndDown/yg.png';
import { launchFullscreen, exitFullscreen, fullScreenEnabled } from './util';
import styles from './index.less';
import FiterForm from './FiterForm';
import EquipmentStatus from './EquipmentStatus';
import GeneralSituation from './GeneralSituation';
import GeneralSituationProcess from './GeneralSituationProcess';
import UnusualTable from './UnusualTable';
import StopForm from './StopForm';
import StopMidTable from './StopMidTable';
import StopBottomTable from './StopBottomTable';

export default class ExceptionHandlingPlatform extends Component {

  // 构造函数
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      isFullFlag: false,
    };
  }

  // 加载时调用
  componentDidMount() {
  }

  @Bind()
  screenFull() {
    if (fullScreenEnabled !== undefined && !fullScreenEnabled) {
      notification.warning({
        message: "暂不支持全屏",
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

  // 渲染
  render() {
    const { spinning, isFullFlag } = this.state;
    return (
      <Fragment>
        <div
          style={{
          width: isFullFlag ? '100%' : `calc(100%)`,
          backgroundColor: isFullFlag ? 'rgba(255,255,255,0.9)' : null,
        }}
          height="100%"
          className="monitorBoard"
          id="acceptedPuted"
        >
          <Header>
            <Row style={{width: '100%', height: '2.5vw'}}>
              <Col span={3} style={{marginLeft: '1vw'}}>
                <img src={ruikeLogo} alt="" style={{width: '14vw', height: '4vw'}} />
              </Col>
              <Col span={5} style={{marginLeft: '3.5vw', marginTop: '1.8vw', fontSize: '1.5vw', fontFamily: 'STXingkai'}}>
                <span>锐意进取, 科技创新</span>
              </Col>
              <Col span={5} style={{marginLeft: '5.6vw', marginTop: '0.8vw', fontSize: '2vw', fontWeight: 'bold'}}>
                <span>设备监控平台</span>
                <div style={{ marginLeft: '-0.5vw', marginTop: '0.8vw'}}>
                  <Row>
                    <Col span={5}>
                      <div className={styles.titleClassLeft} />
                    </Col>
                  </Row>
                </div>

              </Col>
              <Col style={{marginLeft: '5.5vw', marginTop: '1.2vw', fontSize: '0.5vw'}}>
                <span style={{ marginLeft: '20vw', top: '-1vw' }}>
                  <img src={yg} alt="" className={styles.staffUpAndDown_img} />
                        pfang 20025
                </span>
                <Button
                  onClick={this.screenFull}
                  style={{ marginLeft: '1vw', top: '-0.5vw' }}
                  icon={isFullFlag ? 'shrink' : 'arrows-alt'}
                >
                  {isFullFlag
                ? '关闭看板'
                : '全屏'}
                </Button>
              </Col>
            </Row>
            <Row style={{width: '100%', height: '2.5vw'}}>
              <Col span={24} style={{marginLeft: '4.5vw', marginTop: '-1.5vw', fontSize: '1vw', fontFamily: 'STKaiti'}}>
                <span>股票代码: 300747</span>
              </Col>
            </Row>
            <hr style={{ border: '0.1vw solid #0F56AA ', color: '#0F56AA', width: '100.7%'}} />
          </Header>

          <Content style={{ padding: '0px', margin: '7px 7px 0px', backgroundColor: 'rgba(244,245,247)' }}>
            <Spin spinning={spinning}>
              <FiterForm />
              <Row style={{backgroundColor: 'rgba(244,245,247)'}}>
                <Col span={12} style={{marginLeft: '0.8vw'}}>
                  <div className="windowLeft">
                    <br />
                    <span style={{marginLeft: '1vw', marginTop: '0.2vw', fontSize: '1vw', fontWeight: 'bold'}}>设备状态一览</span>
                    <hr style={{marginTop: '0.5vw'}} />
                    <div>
                      <EquipmentStatus />
                    </div>
                  </div>
                </Col>
                <Col span={6} style={{marginLeft: '1vw'}}>
                  <div className="windowCenterTop">
                    <br />
                    <span style={{marginLeft: '1vw', marginTop: '0.2vw', fontSize: '1vw', fontWeight: 'bold'}}>总体概况</span>
                    <hr style={{marginTop: '0.5vw'}} />
                    <div>
                      <Row>
                        <Col span={12}>
                          <div style={{marginTop: '2.5vw'}}>
                            <GeneralSituation />
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{marginTop: '2.5vw'}}>
                            <GeneralSituationProcess />
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  <div className="windowCenterBottom" style={{marginTop: '1.1vw'}}>
                    <br />
                    <span style={{marginLeft: '1vw', marginTop: '0.2vw', fontSize: '1vw', fontWeight: 'bold'}}>异常停机TOP10</span>
                    <hr style={{marginTop: '0.5vw'}} />
                    <div className="unsualTable" style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw'}}>
                      <UnusualTable />
                    </div>
                  </div>
                </Col>
                <Col span={5} style={{marginLeft: '1vw'}}>
                  <div className="windowRight">
                    <br />
                    <span style={{marginLeft: '1vw', marginTop: '0.2vw', fontSize: '1vw', fontWeight: 'bold'}}>停机设备详情</span>
                    <hr style={{marginTop: '0.5vw', color: 'rgba(83,107,215)', border: 'none', borderBottom: '1px solid rgba(83,107,215)'}} />
                    <div>
                      <StopForm />
                    </div>
                    <div className="stopTable" style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw'}}>
                      <StopMidTable />
                    </div>
                    <div className="stopTable" style={{ paddingLeft: '0.5vw', paddingRight: '0.5vw', marginTop: '1vw'}}>
                      <StopBottomTable />
                    </div>
                  </div>
                </Col>
              </Row>
            </Spin>
          </Content>
        </div>
      </Fragment>
    );
  }
}
