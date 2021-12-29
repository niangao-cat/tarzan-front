/**
 * EventDetailsDrawer 对象详细信息抽屉
 * @date: 2019-7-30
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Input, Modal, Row, Col } from 'hzero-ui';
import intl from 'utils/intl';
import { SEARCH_FORM_ROW_LAYOUT, FORM_COL_2_LAYOUT } from '@/utils/constants';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from './index.less';

const modelPrompt = 'tarzan.inventory.query.model.query';

@formatterCollections({
  code: ['tarzan.inventory.query'], // code 为 [服务].[功能]的字符串数组
})
@connect(({ query, loading }) => ({
  query,
  fetchLoading: loading.effects['query/queryBillList'],
}))
export default class ReserveDetailsDrawer extends React.PureComponent {
  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  handleTableChange = pagination => {
    const { dispatch, initData } = this.props;
    dispatch({
      type: 'query/getReserveTableList',
      payload: {
        ...initData,
        page: pagination,
      },
    });
  };

  render() {
    const {
      query: { reserveDetailsInfoList, reserveDetailsPagination, holdTypeList },
      initData,
      visible,
      onCancel,
      fetchLoading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.holdType`).d('预留类型'),
        width: 150,
        dataIndex: 'holdType',
        render: val => {
          return (
            <span>
              {holdTypeList.map(item => (item.typeCode === val ? item.description : null))}
            </span>
          );
        },
      },
      {
        title: intl.get(`${modelPrompt}.orderType`).d('预留指令类型'),
        dataIndex: 'orderType',
        width: 150,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.orderId`).d('预留指令编码'),
        width: 120,
        align: 'center',
        dataIndex: 'orderId',
      },
      {
        title: intl.get(`${modelPrompt}.holdQuantity`).d('预留数量'),
        width: 120,
        align: 'center',
        dataIndex: 'holdQuantity',
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.inventory.query.title.details').d('预留详细信息')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row} gutter={40}>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.siteCode`).d('站点')}</span>
            <Input disabled defaultValue={initData.siteCode} />
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row} gutter={40}>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.materialCode`).d('物料编码')}</span>
            <Input disabled defaultValue={initData.materialCode} />
          </Col>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.materialDesc`).d('物料描述')}</span>
            <Input disabled defaultValue={initData.materialDesc} />
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row} gutter={40}>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.locatorCode`).d('库位编码')}</span>
            <Input disabled defaultValue={initData.locatorCode} />
          </Col>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.locatorDesc`).d('库位描述')}</span>
            <Input disabled defaultValue={initData.locatorDesc} />
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row} gutter={40}>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.ownerType`).d('所有者类型')}</span>
            <Input disabled defaultValue={initData.ownerType} />
          </Col>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.ownerCode`).d('所有者')}</span>
            <Input disabled defaultValue={initData.ownerCode} />
          </Col>
        </Row>
        <Row {...SEARCH_FORM_ROW_LAYOUT} className={styles.row} gutter={40}>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.lotCode`).d('批次')}</span>
            <Input disabled defaultValue={initData.lotCode} />
          </Col>
          <Col {...FORM_COL_2_LAYOUT} className={styles.col}>
            <span>{intl.get(`${modelPrompt}.holdQtyTotal`).d('预留总量')}</span>
            <Input disabled defaultValue={initData.holdQty} />
          </Col>
        </Row>
        <Table
          loading={fetchLoading}
          // rowKey="userRightsDescId"
          dataSource={reserveDetailsInfoList}
          columns={columns}
          pagination={reserveDetailsPagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
      </Modal>
    );
  }
}
