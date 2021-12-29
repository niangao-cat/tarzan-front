/*
 * @Description: 首页
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-09 22:17:01
 * @LastEditTime: 2020-11-10 20:15:26
 */
import React, { Fragment } from 'react';
import { Content, Header } from 'components/Page';
import { Row, Col } from 'choerodon-ui';
import {
  DataSet,
  Table,
  Form,
  Button,
} from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import {
  headTableDS,
} from './stores/workInstructionsDS';

export default class Company extends React.Component {

  constructor(props) {
    super(props);
    this.headTableDS = new DataSet(headTableDS);
    this.state = {};
  }

  @Bind()
  handleFetchList() {
    this.headTableDS.query();
  }

  @Bind()
  renderBar({ queryFields, buttons, dataSet, queryDataSet }) {
    if (queryDataSet) {
      return (
        <Row className="c7n-form-line-with-btn" gutter={24}>
          <Col span={10}>
            <Form
              columns={2}
              dataSet={queryDataSet}
              labelWidth={120}
            >
              {queryFields}
            </Form>
          </Col>
          <Col span={6} className="c7n-form-btn">
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                marginTop: '7px',
              }}
            >
              <Button
                onClick={() => {
                  queryDataSet.current.reset();
                  dataSet.fireEvent('queryBarReset', {
                    dataSet,
                    queryFields,
                  });
                }}
              >
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button
                dataSet={null}
                onClick={() => {
                  this.handleFetchList();
                }}
                color="primary"
              >
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
              {buttons}
            </div>
          </Col>
        </Row>
      );
    }
    return null;
  }

  // 查询头行明细
  @Bind()
  fetchDetail(record) {
    const { history } = this.props;
    let headId;
    if (record === 'create') {
      headId = 'create';
    } else {
      headId = record.get('insHeaderId');
    }
    history.push(`/hhme/work-instructions/detail/${headId}`);
  }

  render() {
    const columns = [
      { name: 'siteCode' },
      {
        name: 'attachmentCode',
        renderer: ({ value, record }) => (
          <span className="action-link">
            <a onClick={() => this.fetchDetail(record)}>
              {value}
            </a>
          </span>
        ),
      },
      { name: 'attachmentName' },
      { name: 'remark' },
      { name: 'startDate' },
      { name: 'endDate' },
      { name: 'creationDate' },
      { name: 'lastUpdatedByName' },
      { name: 'lastUpdateDate' },
    ];
    return (
      <Fragment>
        <Header title='作业指导书管理平台'>
          <Button
            color="primary"
            icon="add"
            onClick={()=>this.fetchDetail('create')}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Table
            key="user"
            dataSet={this.headTableDS}
            queryFieldsLimit={2}
            columns={columns}
            queryBar={this.renderBar}
          />
        </Content>
      </Fragment>
    );
  }
}
