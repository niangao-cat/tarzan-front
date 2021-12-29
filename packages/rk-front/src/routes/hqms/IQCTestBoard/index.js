/*
 * @Description: 成品检验质量看板
 * @Version: 0.0.1
 * @Autor: 张晨 <chen.zhang03@hand-china.com>
 * @Date: 2021-05-17 18:10:19
 */

import React, { Component } from 'react';
import { Row } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import {
  FullScreenContainer,
} from '@jiaminghi/data-view-react';
import { IndexPageStyle, IndexPageContent } from './style';
import { IEVersion, launchFullscreen, exitFullscreen, fullScreenEnabled } from './util';
import TopPage from './Components/TopPage/TopPage';
import OneBoard from './Components/OneBoard/index';
import './Components/flexible';

export default class ManufacturingCenterBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFullFlag: false,
    };
  }

  componentDidMount() {
    document.addEventListener('fullscreenchange', () => {
      this.setState({
        isFullFlag: document.fullscreenElement,
      });
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

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { isFullFlag } = this.state;
    return (
      <div id='acceptedPuted'>
        <FullScreenContainer>
          <IndexPageStyle>
            <TopPage
              screenFull={this.screenFull}
              isFullFlag={isFullFlag}
            />
            <IndexPageContent>
              <Row>
                <OneBoard />
              </Row>
            </IndexPageContent>
          </IndexPageStyle>
        </FullScreenContainer>
      </div>
    );
  }
}
