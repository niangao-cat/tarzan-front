/*
 * @Description: 顶部
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-20 15:12:51
 * @LastEditTime: 2021-01-29 16:31:28
 */
import React, { PureComponent, Fragment } from 'react';
import { formatTime } from '@/utils/utils';
import {
  Decoration10,
  Decoration8,
} from '@jiaminghi/data-view-react';
import { Button } from 'hzero-ui';

import { TopBox, TimeBox } from './style';

class TopPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '数字可视化监控系统',
      timeStr: '',
      weekday: [
        '星期天',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六',
      ],
    };
  }

  // 设置时间
  componentDidMount() {
    this.setTimingFn();
  }

  setTimingFn() {
    this.timing = setInterval(() => {
      const dateYear = formatTime(new Date(), 'yyyy-MM-dd');
      const dateDay = formatTime(new Date(), 'HH: mm: ss');
      const dateWeek = this.state.weekday[new Date().getDay()];
      this.setState({
        timeStr: `${dateYear} | ${dateDay} ${dateWeek}`,
      });
    }, 1000);
  }

  componentWillUnmount(){
    clearInterval(this.timing);
  }

  render() {
    const { title } = this.state;
    const { isFullFlag, screenFull, siteNameBoard={} } = this.props;
    return (
      <Fragment>
        <TopBox>
          <div className='top_box'>
            <Decoration10 className='top_decoration10' />
            <div className='title-box'>
              <Decoration8
                className='top_decoration8'
                color={['#568aea', '#568aea']}
              />
              <div style={{ width: '5rem' }}>
                <div
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontSize: '0.28rem',
                    fontWeight: 'blod',
                  }}
                >
                  {siteNameBoard.zhSiteName}{title}
                </div>
                <div style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>
                  DIGITAL VISUAL MONITORING SYSTEM OF {siteNameBoard.enSiteName}
                </div>
                {/* <Decoration6
                  className='title-bototm top_decoration6'
                  reverse
                  color={['#50e3c2', '#67a1e5']}
                /> */}
              </div>

              <Decoration8
                className='top_decoration8'
                color={['#568aea', '#568aea']}
                reverse
              />
            </div>
            <Decoration10 className='top_decoration10 top_decoration10_reverse' />
            <TimeBox>
              <h3 style={{ float: 'left', marginRight: '8px' }}>{this.state.timeStr}</h3>
              <Button
                onClick={() => screenFull()}
                style={{ float: 'left' }}
                icon={isFullFlag ? 'shrink' : 'arrows-alt'}
              />
            </TimeBox>
          </div>
        </TopBox>
      </Fragment>
    );
  }
}

export default TopPage;
