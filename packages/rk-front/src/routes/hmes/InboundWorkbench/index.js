/*
 * @Description: 入库单工作台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-13 16:30:50
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-14 15:52:09
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Card, Button, Icon, Row, Col } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Content, Header } from 'components/Page';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import FilterForm from './FilterForm';
import ListTableHead from './ListTableHead';
import ListTableRow from './ListTableRow';
import DetailDrawer from './Drawer/DetailDrawer';
import styles from './index.less';

@connect(({ inboundWorkbench }) => ({
  inboundWorkbench,
}))
// fetchLoading和saveLoadding实现加载效果,自定义写法
export default class InboundWorkbench extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFlag: true, // 入库单查询默认展开
      headTableFlag: true, // 入库单头明细默认展开
      showVisible: false,
      selectedRowKeys: [],
      selectedRow: [],
    };
  }

  // 入库单查询-展开或收起
  @Bind()
  openSearch(flag) {
    this.setState({ searchFlag: flag });
  }

  // 入库单查询-展开或收起
  @Bind()
  openHeadTable(flag) {
    this.setState({ headTableFlag: flag });
  }

  @Bind()
  renderSearchTitle() {
    return (
      <span>
        入库单查询
        {this.state.searchFlag ? (
          <a style={{ marginLeft: '10px' }} onClick={() => this.openSearch(false)}>
            收起&nbsp;
            <Icon type="up-circle" />
          </a>
        ) : (
          <a onClick={() => this.openSearch(true)} style={{ marginLeft: '10px' }}>
            展开&nbsp;
            <Icon type="right-circle" />
          </a>
        )}
      </span>
    );
  }

  @Bind()
  renderHeadTitle() {
    return (
      <span>
        入库单头明细
        {this.state.headTableFlag ? (
          <a style={{ marginLeft: '10px' }} onClick={() => this.openHeadTable(false)}>
            收起&nbsp;
            <Icon type="up-circle" />
          </a>
        ) : (
          <a onClick={() => this.openHeadTable(true)} style={{ marginLeft: '10px' }}>
            展开&nbsp;
            <Icon type="right-circle" />
          </a>
        )}
      </span>
    );
  }

  // 打开明细
  @Bind()
  openDetail(flag) {
    this.setState({ showVisible: flag });
  }

  /**
   * 送货单行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow }); // 选中
  }

  render() {
    const rowList = [
      {
        materialCode: '100101',
        materialName: '泵浦沅1',
        targetLocator: 'C-A001',
        inLocatorQuantity: '10',
      },
      {
        materialCode: '100102',
        materialName: '泵浦沅2',
        targetLocator: 'C-A001',
        inLocatorQuantity: '10',
      },
      {
        materialCode: '100103',
        materialName: '泵浦沅3',
        targetLocator: 'C-A001',
        inLocatorQuantity: '10',
      },
      {
        materialCode: '100104',
        materialName: '泵浦沅4',
        targetLocator: 'C-A001',
        inLocatorQuantity: '10',
      },
    ];
    return (
      <React.Fragment>
        <Header title="入库工作台" />
        <Content>
          <div className={styles['inbound-workbench']}>
            <Card
              key="code-rule-header"
              title={this.renderSearchTitle()}
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              extra={
                this.state.searchFlag && (
                  <div>
                    <Button type="primary" icon="search" style={{ marginLeft: '8px' }}>
                      查询
                    </Button>
                    <Button type="primary" icon="close" style={{ marginLeft: '8px' }}>
                      取消
                    </Button>
                    <Button type="primary" icon="printer" style={{ marginLeft: '8px' }}>
                      打印
                    </Button>
                  </div>
                )
              }
            >
              {this.state.searchFlag && <FilterForm />}
            </Card>
            <div className={styles['inbound-workbench_table']}>
              <Card
                key="code-rule-header"
                title={this.renderHeadTitle()}
                bordered={false}
                className={DETAIL_CARD_TABLE_CLASSNAME}
              >
                {this.state.headTableFlag && <ListTableHead />}
              </Card>
              <Card
                key="code-rule-row"
                title={
                  <span>
                    入库单头明细
                    <Button
                      size="small"
                      style={{ marginLeft: '10px' }}
                      onClick={() => this.openDetail(true)}
                    >
                      明细&gt;&gt;
                    </Button>
                  </span>
                }
                bordered={false}
                className={DETAIL_CARD_TABLE_CLASSNAME}
              >
                <Row>
                  <Col span={16}>
                    <ListTableRow
                      dataSource={rowList}
                      selectedRowKeys={this.state.selectedRowKeys}
                      onSelectRow={this.handleSelectRow}
                    />
                  </Col>
                </Row>
                {this.state.showVisible && (
                  <DetailDrawer
                    detail={this.state.selectedRow[0]}
                    showVisible={this.state.showVisible}
                    onCancel={this.openDetail}
                  />
                )}
              </Card>
            </div>
          </div>
        </Content>
      </React.Fragment>
    );
  }
}
