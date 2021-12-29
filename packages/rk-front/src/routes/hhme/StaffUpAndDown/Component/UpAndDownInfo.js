/*
 * @Description: 上下岗信息
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-05-28 16:41:05
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-05-28 18:41:21
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { PureComponent } from 'react';
import { Card, Radio, Row, Col } from 'hzero-ui';
import { getDateFormat } from 'utils/utils';
// 不是按需加载的话文件太大
// import echarts from 'echarts'
// 导入折线图
import 'echarts/lib/chart/pie'; // 折线图是line,饼图改为pie,柱形图改为bar
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';
import styles from '../index.less';
import calendar from '../../../../assets/stuffUpAndDown/calendar.png';
import time from '../../../../assets/stuffUpAndDown/time.png';
import startMin from '../../../../assets/stuffUpAndDown/startMin.png';
import Hourglass from '../../../../assets/stuffUpAndDown/Hourglass.png';
import endMin from '../../../../assets/stuffUpAndDown/endMin.png';
import endCheck from '../../../../assets/stuffUpAndDown/end-check.png';
import endUncheck from '../../../../assets/stuffUpAndDown/end-uncheck.png';
import startCheck from '../../../../assets/stuffUpAndDown/start-check.png';
import startUncheck from '../../../../assets/stuffUpAndDown/start-uncheck.png';
import stopCheck from '../../../../assets/stuffUpAndDown/stop-check.png';
import stopUnCheck from '../../../../assets/stuffUpAndDown/stop-uncheck.png';



export default class UpAndDownInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const dateFormat = getDateFormat();
    const { selectedDate, frequencyData, setUpAndDownInfo, defaultData, checkOpenModel, setDateForStaffClose, option} = this.props;
    return (
      <Card
        title="上下岗信息"
        style={{height: '289px'}}
      >
        <div className={styles["stuffUpAndDown_info-date"]}>
          <img src={calendar} alt="" />
          <span className={styles["stuffUpAndDown_info-label"]}>
            日期:
          </span>
          <span>
            {selectedDate.format(dateFormat)}
          </span>
        </div>
        <div>
          <Radio.Group defaultValue="0" buttonStyle="solid">
            {frequencyData.map((item, index)=>{
             return (<Radio.Button value={`${index}`} onClick={setUpAndDownInfo.bind(this, item)}>{item.shiftcode}</Radio.Button>);
            })
            }
          </Radio.Group>
        </div>
        <div className={styles["stuffUpAndDown_info-date"]} style={{ marginTop: '5px'}}>
          <img src={time} alt="" />
          <span className={styles["stuffUpAndDown_info-label"]}>
            时间:
          </span>
          <span>
            {defaultData.startAndEndTime}
          </span>
        </div>
        <Row>
          <Col span={8}>
            <div className={styles["stuffUpAndDown_info-content"]}>
              <Row>
                <Col span={16}>
                  <div>
                    <span>
                      <img src={startMin} alt="" />
                    </span>
                    <span style={{ verticalAlign: 'middle', marginLeft: '5px'}}>
                      {defaultData.startName}
                    </span>
                  </div>
                  <div style={{ textAlign: 'center', verticalAlign: 'middle', marginTop: '6px'}}>
                    {defaultData.startTime}
                  </div>
                </Col>
                <Col span={8}>
                  <img src={startCheck} onClick={checkOpenModel} alt="" style={{ display: ((defaultData.startName===null||defaultData.startName==="暂停")&&defaultData.startSwitch==="YES")?'inline-block':'none', width: '30px', marginTop: '6px'}} />
                  <img src={startUncheck} onClick={checkOpenModel} alt="" style={{ display: ((defaultData.startName===null||defaultData.startName==="暂停")&&defaultData.startSwitch!=="YES")?'inline-block':'none', width: '30px', marginTop: '6px'}} />
                  <img src={stopCheck} onClick={checkOpenModel} alt="" style={{ display: ((defaultData.startName==="继续"||defaultData.startName==="开始")&&defaultData.startSwitch==="YES")?'inline-block':'none', width: '30px', marginTop: '6px'}} />
                  <img src={stopUnCheck} onClick={checkOpenModel} alt="" style={{ display: ((defaultData.startName==="继续"||defaultData.startName==="开始")&&defaultData.startSwitch!=="YES")?'inline-block':'none', width: '30px', marginTop: '6px'}} />
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles["stuffUpAndDown_info-content"]}>
              <Row>
                <Col span={16}>
                  <div>
                    <span>
                      <img src={Hourglass} alt="" />
                    </span>
                    <span style={{ verticalAlign: 'middle', marginLeft: '5px'}}>
                      累计
                    </span>
                  </div>
                  <div style={{ textAlign: 'center', verticalAlign: 'middle', marginTop: '6px'}}>
                    {defaultData.duration}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8}>
            <div className={styles["stuffUpAndDown_info-content"]}>
              <Row>
                <Col span={16}>
                  <div>
                    <span>
                      <img src={endMin} alt="" />
                    </span>
                    <span style={{ verticalAlign: 'middle', marginLeft: '5px'}}>
                      结束
                    </span>
                  </div>
                  <div style={{ textAlign: 'center', verticalAlign: 'middle', marginTop: '6px'}}>
                    {defaultData.closeTime}
                  </div>
                </Col>
                <Col span={8}>
                  <img src={endCheck} onClick={setDateForStaffClose} alt="" style={{ display: defaultData.closeSwitch==="YES"?'inline-block':'none', width: '30px', marginTop: '6px'}} />
                  <img src={endUncheck} onClick={setDateForStaffClose} alt="" style={{ display: defaultData.closeSwitch!=="YES"?'inline-block':'none', width: '30px', marginTop: '6px'}} />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row>
          <ReactEcharts
            option={option}
            theme="Imooc"
            style={{height: "4vw", width: "48vw", position: "absolute", top: "-1vw", marginLeft: "-4.4vw"}}
          />
        </Row>
      </Card>
    );
  }
}
