/*
 * @Description: 顶部
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-20 15:12:51
 * @LastEditTime: 2020-11-05 21:58:09
 */
import React, { PureComponent, Fragment } from 'react';
import {
  getCurrentOrganizationId,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Col, Row } from 'hzero-ui';
import styles from './index.less';
import ProLineCard from './ProLineCard';

@connect(({ productionBoard }) => ({
  productionBoard,
  tenantId: getCurrentOrganizationId(),
}))
export default class TopPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
    };
  }

  // 设置时间
  componentDidMount() {
    this.handleSearch();
    this.interval = setInterval(() => {
      const { page } = this.state;
      this.handleSearch(page);
    }, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  @Bind()
  handleSearch(fields) {
    const { dispatch, defaultSite = {} } = this.props;
    dispatch({
      type: 'productionBoard/queryProLine',
      payload: {
        siteId: defaultSite.siteId,
        size: 3,
        page: fields || 0,
      },
    }).then(res => {
      if (res) {
        if (res.number + 1 === res.totalPages) {
          this.setState({ page: 0 });
        } else {
          this.setState({ page: res.number + 1 });
        }
      }
    });
  }


  render() {
    const {
      productionBoard: {
        proLineList = [],
        fileList = [],
      },
    } = this.props;
    return (
      <Fragment>
        <Row>
          {proLineList.map(ele => {
            return (
              <Col span={24}>
                <div className={styles['production-baord-one']}>
                  <ProLineCard
                    value={ele}
                    fileList={fileList}
                  />
                </div>
              </Col>
            );
          })}
        </Row>
      </Fragment>
    );
  }
}
