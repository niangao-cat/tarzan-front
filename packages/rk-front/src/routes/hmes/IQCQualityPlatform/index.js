/*
 * @Description: IQC检验平台
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-20 18:08:35
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-11-17 15:32:58
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Button, Table, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import FilterForm from './FilterForm';
import TopFormInfo from './TopFormInfo';
import ListTableRow from './ListTableRow';
import imgPath from '@/assets/JXblue.png';
import styles from './index.less';

@connect(({ iqcQualityPlatform }) => ({
  iqcQualityPlatform,
  tenantId: getCurrentOrganizationId(),
}))
export default class TicketManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  filterForm;

  componentDidMount() {}

  /**
   * 获取查询表单组件this对象
   * @param {object} ref - 查询表单组件this
   */
  @Bind
  handleBindRef(ref) {
    this.filterForm = (ref.props || {}).form;
  }

  render() {
    // 查询
    const filterFormProps = {
      onSearch: this.handleSearch,
      createHeadDataDrawer: this.createHeadDataDrawer,
    };

    const columns = [
      {
        title: '序号',
        width: 70,
        dataIndex: 'sequence',
        align: 'center',
      },
      {
        title: '结果值',
        width: 70,
        dataIndex: 'sequence',
        align: 'center',
      },
      {
        title: '备注',
        width: 70,
        dataIndex: 'sequence',
        align: 'center',
      },
    ];

    return (
      <Fragment>
        <Header title="IQC检验平台" />
        <Content>
          <FilterForm {...filterFormProps} onRef={this.handleBindRef} />
          <TopFormInfo />
          <Row>
            <Col span={18} style={{ marginRight: '20px' }}>
              <ListTableRow />
            </Col>
            <Col span={5}>
              <Table bordered rowKey="instructionId" columns={columns} />
              <Row style={{ marginTop: '10px' }}>
                <div>
                  <img src={imgPath} alt="" style={{ marginTop: '-4px', marginRight: '5px' }} />
                  <span style={{ fontSize: '14px' }}>图纸</span>
                </div>
                <Button style={{ backgroundColor: '#06B809', color: '#fff', marginTop: '10px' }}>
                  图纸
                </Button>
              </Row>
              <Row style={{ marginTop: '10px' }} className={styles.file}>
                <div>
                  <img src={imgPath} alt="" style={{ marginTop: '-4px', marginRight: '5px' }} />
                  <span style={{ fontSize: '14px' }}>附件</span>
                </div>
                <Button style={{ backgroundColor: '#06B809', color: '#fff', marginTop: '10px' }}>
                  浏览
                </Button>
                &nbsp;&nbsp;
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ borderBottom: '1px solid #29BECE' }}
                >
                  <span>DCAS21231231231.doc</span>&nbsp;&nbsp;
                  <Icon type="close-circle" />
                </a>
              </Row>
              <Row style={{ marginTop: '15px', textAlign: 'end' }}>
                <Button type="primary" style={{ marginRight: '10px' }}>
                  新建
                </Button>
                <Button style={{ marginRight: '10px' }}>保存</Button>
                <Button type="primary">提交</Button>
              </Row>
            </Col>
          </Row>
        </Content>
      </Fragment>
    );
  }
}
