/**
 * relationMaintain - 组织关系维护
 * @date: 2019-8-26
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Row, Col } from 'hzero-ui';
import { connect } from 'dva';

import { Content } from 'components/Page';
import styles from './index.less';
import FilterForm from './FilterForm';
import SelectTree from './SelectTree';
import AdjustOrderDrawer from './AdjustOrderDrawer';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 库存查询
 * @extends {Component} - React.Component
 * @reactProps {Object} relationMaintain - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ relationMaintain }) => ({
  relationMaintain,
}))
export default class RelationMaintain extends React.Component {
  listTable;

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationMaintain/queryInitInfo',
    });
    dispatch({
      type: 'relationMaintain/queryTreeData',
      payload: {
        expandedKeys: [],
      },
    });
    dispatch({
      type: 'relationMaintain/init',
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    return (
      <React.Fragment>
        <Content>
          <div className={styles.content}>
            <Row>
              <Col span={6}>
                <div className={styles.leftDiv}>
                  <SelectTree />
                </div>
              </Col>
              <Col span={18}>
                <div className={styles.rightDiv}>
                  <FilterForm />
                </div>
              </Col>
            </Row>
          </div>
        </Content>
        <AdjustOrderDrawer />
      </React.Fragment>
    );
  }
}
