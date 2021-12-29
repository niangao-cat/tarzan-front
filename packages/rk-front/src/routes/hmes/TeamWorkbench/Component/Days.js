/*
 * @Description: 几号
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-30 14:40:02
 * @LastEditTime: 2020-08-14 15:48:26
 */

import React, { Component } from 'react';

export default class Days extends Component {
  constructor(props) {
    super(props);
    this.state = {
      day: '',
      bcgcolor: '',
    };
  }

  componentDidMount() {
    const { children } = this.props;
    this.setState({ day: children });
  }

  componentWillReceiveProps(nextProps) {
    const { daySecurity } = nextProps;
    const { exceptionNumber = 0 } = daySecurity;
    let color = '';
    if (exceptionNumber > 0 && exceptionNumber <= 3) {
      color = '#92d46c';
    } else if (exceptionNumber > 3 && exceptionNumber <= 5) {
      color = '#d9c284';
    } else if (exceptionNumber > 5 && exceptionNumber <= 7) {
      color = '#d84949';
    } else if (exceptionNumber > 7) {
      color = '#c55305';
    } else if (exceptionNumber === 0) {
      color = '#00a093';
    }
    this.setState({ bcgcolor: color });
  }


  render() {
    const { dayNowParam, children, clickDay } = this.props;
    const { bcgcolor } = this.state;
    return (
      <React.Fragment>
        <div
          style={{
            width: '20px',
            height: '20px',
            padding: '0px 3px',
            color: dayNowParam ? '#fff' : '#333',
            backgroundColor: dayNowParam ? bcgcolor : 'none',
            cursor: 'pointer',
          }}
          onClick={() => clickDay(this.state.day)}
        >
          {children}
        </div>
      </React.Fragment>
    );
  }
}
