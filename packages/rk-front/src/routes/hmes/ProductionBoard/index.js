/*
 * @Description: 不良信息处理
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Row } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import {
  FullScreenContainer,
} from '@jiaminghi/data-view-react';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import { IndexPageStyle, IndexPageContent } from './style';
import { IEVersion, launchFullscreen, exitFullscreen, fullScreenEnabled } from './util';
import TopPage from './Components/TopPage/TopPage';
import OneBoard from './Components/OneBoard/index';
import './Components/flexible';

/**
 * 消息维护
 * @extends {Component} - React.Component
 * @reactProps {Object} errorMessage - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ productionBoard }) => ({
  productionBoard,
  tenantId: getCurrentOrganizationId(),
}))
export default class ProductionBoard extends Component {
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
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: `productionBoard/getSiteList`,
      payload: {
        tenantId,
      },
    }).then(res => {
      if (res) {
        dispatch({
          type: `productionBoard/querySiteName`,
          payload: {
            siteId: res.siteId,
          },
        });
      }
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
    const {
      productionBoard: {
        siteNameBoard = {},
        defaultSite = {},
      },
    } = this.props;
    const { isFullFlag } = this.state;
    return (
      <div id='acceptedPuted'>
        <FullScreenContainer>
          <IndexPageStyle>
            <TopPage
              screenFull={this.screenFull}
              isFullFlag={isFullFlag}
              siteNameBoard={siteNameBoard}
            />
            <IndexPageContent>
              {/* 左侧内容 */}
              <Row>
                <OneBoard
                  defaultSite={defaultSite}
                />
              </Row>
              {/* <LeftPage /> */}
              {/* 中间内容 */}
              {/* <CenterPage className='center-page' /> */}
              {/* 右侧内容 */}
              {/* <RightPage /> */}
            </IndexPageContent>
          </IndexPageStyle>
        </FullScreenContainer>
      </div>
    );
  }
}
