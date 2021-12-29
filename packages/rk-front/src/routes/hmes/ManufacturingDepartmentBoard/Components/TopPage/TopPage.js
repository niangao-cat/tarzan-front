/*
 * @Description: 顶部
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-20 15:12:51
 * @LastEditTime: 2021-11-11 16:54:43
 */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Icon } from 'hzero-ui';
import { isArray, isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';

import { formatTime } from '@/utils/utils';
import {
  Decoration10,
  Decoration8,
} from '@jiaminghi/data-view-react';
import ruikeLogo from '@/assets/logo1.png';

import { TopBox, TimeBox, LogoBox } from './style';
import styles from '../../index.less';

@connect(({ manufacturingDepartmentBoard }) => ({
  manufacturingDepartmentBoard,
}))

export default class TopPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '制造中心综合看板',
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
      currentDepartment: {},
    };
  }

  // 设置时间
  componentDidMount() {
    this.setTimingFn();
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'manufacturingDepartmentBoard/init',
    }).then(res => {
      if (res) {
        this.setState({
          currentDepartment: isArray(res.warehouse) && !isEmpty(res.warehouse) ? res.warehouse[0] : null,
        });
      }
    });
  }

  setTimingFn() {
    this.timing = setInterval(() => {
      const dateYear = formatTime(new Date(), 'yyyy-MM-dd');
      const dateDay = formatTime(new Date(), 'HH: mm: ss');
      const dateWeek = this.state.weekday[new Date().getDay()];
      this.setState({
        timeStr: `${dateYear} ${dateWeek} ${dateDay} `,
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timing);
  }

  @Bind()
  handleClickOptions(currentDepartment) {
    const { onFetchInfo } = this.props;
    this.setState({ currentDepartment });
    onFetchInfo(currentDepartment.value);
  }

  render() {
    const { title, currentDepartment } = this.state;
    const { manufacturingDepartmentBoard: { warehouse = [] }, isFullFlag, screenFull } = this.props;
    return (
      <Fragment>
        <TopBox>
          <div className='top_box'>
            <Decoration10 className='top_decoration10' />
            <LogoBox>
              {/* <img src={ruikeLogo} alt="" />
               */}
              <h3 style={{ float: 'left', fontSize: '14px', marginRight: '8px', color: '#00FFFF' }}>{this.state.timeStr}</h3>
            </LogoBox>
            <div className='title-box'>
              <Decoration8
                className='top_decoration8'
                color={['#568aea', '#568aea']}
              />
              <div style={{ width: '5rem' }}>
                <div
                  style={{
                    textAlign: 'center',
                    color: '#00FFFF',
                    fontSize: '0.35rem',
                    fontWeight: 'blod',
                    marginTop: '8px',
                  }}
                >
                  {title}
                </div>
              </div>
              <Decoration8
                className='top_decoration8'
                color={['#568aea', '#568aea']}
                reverse
              />
            </div>
            <Decoration10 className='top_decoration10 top_decoration10_reverse' />
            <TimeBox>
              <div className={styles['production-center-board-button-box']}>
                <img src={ruikeLogo} alt="" />
                <Button
                  onClick={() => screenFull()}
                  style={{ float: 'right', background: '#203864', color: '#bcdcff', marginLeft: '16px', borderColor: '#bcdcff' }}
                  icon={isFullFlag ? 'shrink' : 'arrows-alt'}
                  size="small"
                />
                <div className={styles['manufacturingDepartmentBoard_select-content']}>
                  <div className={styles['manufacturingDepartmentBoard_select-current-value']} onClick={this.handleClickSelect}>
                    {currentDepartment.meaning}
                    <Icon type="down" />
                  </div>
                  <div className={styles['manufacturingDepartmentBoard_select-list']}>
                    {warehouse.map((item) => (
                      <div
                        key={item.value}
                        value={item.value}
                        onClick={() => this.handleClickOptions(item)}
                        className={styles['manufacturingDepartmentBoard_select-list-value']}
                      >
                        {item.meaning}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TimeBox>
          </div>
        </TopBox>
      </Fragment>
    );
  }
}

