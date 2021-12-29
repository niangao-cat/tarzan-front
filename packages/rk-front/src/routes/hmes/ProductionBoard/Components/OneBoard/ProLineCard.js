/*
 * @Description: 顶部
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-20 15:12:51
 * @LastEditTime: 2020-11-20 09:15:48
 */
import React, { PureComponent, Fragment } from 'react';
import {
  BorderBox13,
  BorderBox12,
  BorderBox7,
  BorderBox10,
} from '@jiaminghi/data-view-react';
import { Row, Carousel, Tooltip } from 'hzero-ui';
import styles from './index.less';
import PieCharts from './PieCharts';
import CategoryCharts from './CategoryCharts';
import { ModuleTitle } from '../globalStyledSet';

export default class ProLineCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    const { value } = this.props;
    const { dayAlis = [], dailyCompletedQtyList = [], attachmentUrlList=[] } = value;
    return (
      <Fragment>
        <BorderBox10 className={styles['production-baord-one-BorderBox10']}>
          <img
            src={attachmentUrlList.length > 0 && attachmentUrlList[0].fileUrl}
            alt=""
            style={{ width: '3.2rem', height: '2.9rem', cursor: 'pointer' }}
          />
          <Tooltip title={value.prodLineName}>
            <div style={{
              textAlign: 'center',
              fontSize: '0.3rem',
              fontWeight: 'blod',
              color: '#fff',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            >
              {value.prodLineName}
            </div>
          </Tooltip>
        </BorderBox10>
        <BorderBox13 className={styles['production-baord-one-BorderBox13']}>
          <ModuleTitle>
            <div style={{ backgroundColor: '#bcdcff', height: '0.3rem', width: '0.05rem', float: 'left', marginTop: '0.2rem' }} />
            <div className={styles['production-baord-one-div']}>生产本月累计达成</div>
            <BorderBox7 className={styles['production-baord-one-BorderBox7']}>
              {value.monthCompletedQty}
            </BorderBox7>
            <div className={styles['production-baord-one-div']}>台</div>
          </ModuleTitle>
          <div className={styles['production-baord-one-div-chart']}>
            <div
              style={{
                width: '1.75rem',
                height: '1.75rem',
                float: 'left',
              }}
            >
              <Carousel autoplay style={{height: '100%'}}>
                <PieCharts
                  title='当月'
                  completedQty={value.monthCompletedQty}
                  // completedQty={126}
                  dispatchQty={value.monthDispatchQty}
                  // dispatchQty={126}
                />
                <PieCharts
                  title='今日'
                  completedQty={value.dayCompletedQty}
                  // completedQty={127}
                  dispatchQty={value.dayDispatchQty}
                  // dispatchQty={243}
                />
              </Carousel>
            </div>
            <div style={{ float: 'left', marginLeft: '0.3rem' }}>
              <Row className={styles['production-baord-one-div-row']}>
                <div className={styles['production-baord-one-div-row-div-one']} />
                <div className={styles['production-baord-one-div-row-one-wz']}>本月累计派工</div>
                <div className={styles['production-baord-one-div-row-one-sl']}>{value.monthDispatchQty}</div>
              </Row>
              <Row className={styles['production-baord-one-div-row']}>
                <div className={styles['production-baord-one-div-row-div-two']} />
                <div className={styles['production-baord-one-div-row-one-wz']}>今日派工</div>
                <div className={styles['production-baord-one-div-row-one-sl']}>{value.dayDispatchQty}</div>
              </Row>
              <Row className={styles['production-baord-one-div-row']}>
                <div className={styles['production-baord-one-div-row-div-two']} />
                <div className={styles['production-baord-one-div-row-one-wz']}>今日已完成</div>
                <div className={styles['production-baord-one-div-row-one-sl']}>{value.dayCompletedQty}</div>
              </Row>
            </div>
          </div>
        </BorderBox13>
        <BorderBox12 className={styles['production-baord-one-BorderBox12']}>
          <ModuleTitle style={{ paddingTop: '0.2rem' }}>
            <div style={{ backgroundColor: '#bcdcff', height: '0.29rem', width: '0.05rem', float: 'left', marginTop: '0.08rem' }} />
            <div className={styles['production-baord-one-div']}>当月产量趋势图</div>
          </ModuleTitle>
          <div className={styles['production-baord-one-div-chart-yield']}>
            <CategoryCharts
              dayAlis={dayAlis}
              dailyCompletedQtyList={dailyCompletedQtyList}
            />
          </div>
        </BorderBox12>
      </Fragment>
    );
  }
}
