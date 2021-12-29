/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Tooltip, Table, Button, Input, Icon, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import classNames from 'classnames';
import moment from 'moment';

import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

import styles from '../../Component/index.less';

@Form.create({ fieldNameProp: null })
export default class SnList extends Component {

  @Bind()
  handleClickRow(record) {
    if(record.index % 2 === 0) {
      return styles['data-click-ticket-management'];
    }
  }

  @Bind()
  handleCloseModal() {
    const { onCloseModal } = this.props;
    if(onCloseModal) {
      onCloseModal();
    }
  }

  @Bind()
  handleScanSn(e) {
    const snNum = e.target.value;
    const { onScanAndCheckSn } = this.props;
    if(onScanAndCheckSn) {
      onScanAndCheckSn(snNum);
    }
  }

  @Bind()
  handleFilterDataSource(info = {}) {
    const {onSearchSnList} = this.props;
    if(onSearchSnList) {
      onSearchSnList(info);
    }
  }

  @Bind()
  handleClickBom(record) {
    const { onClickBom } = this.props;
    if(onClickBom) {
      onClickBom(record);
    }
  }

  getColumnSearchProps(dataIndex) {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return {
      filterDropdown: ({ selectedKeys }) => (
        <div
          style={{ padding: 8 }}
          className={styles.dropDown}
        >
          <Form.Item>
            {getFieldDecorator(dataIndex)(
              <Input
                ref={node => {
                  this.searchInput = node;
                }}
                value={selectedKeys[0]}
                onPressEnter={e => {
                  this.handleFilterDataSource({ [dataIndex]: e.target.value });
                }}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
            )}
          </Form.Item>
          <Button
            type="primary"
            onClick={() => {
              const fieldValue = getFieldValue(dataIndex);
              this.handleFilterDataSource({ [dataIndex]: fieldValue });
            }}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button
            onClick={() => this.handleFilterDataSource()}
            size="small"
            style={{ width: 90 }}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.focus());
        }
      },
    };
  }

  render() {
    const { dataSource = [], rowSelection, isModal = false, loading } = this.props;
    const columns = [
      {
        title: '条码',
        width: 60,
        dataIndex: 'snNum',
        align: 'center',
        render: (val, record) => (
          <Tooltip title={val}>
            <span style={{color: record.qualityStatus==="NG"?'red':'black'}}>{val}</span>
          </Tooltip>
        ),
      },
      {
        title: '工单号',
        width: 30,
        dataIndex: 'workOrderNum',
        align: 'center',
        render: (val) => (
          <Tooltip title={val}>
            {val}
          </Tooltip>
        ),
        ...this.getColumnSearchProps('workOrderNum'),
      },
      {
        title: '进站时间',
        width: 30,
        dataIndex: 'siteInDate',
        align: 'center',
        render: (val) => (
          <Tooltip title={val}>
            {moment(val).format('hh:mm:ss')}
          </Tooltip>
        ),
      },
      {
        title: 'BOM',
        width: 60,
        dataIndex: 'bomName',
        align: 'center',
        render: (val, record) => (
          <Tooltip title={val}>
            <a onClick={() => this.handleClickBom(record)}>{val}</a>
          </Tooltip>
        ),
        ...this.getColumnSearchProps('bomName'),
      },
    ];
    if(isModal) {
      columns.splice(4, {
        title: '投料器具',
        width: 50,
        dataIndex: 'sourceContainerCode',
        align: 'center',
      });
    }
    return (
      <div className={classNames(styles['head-table'], styles['operationPlatform_sn-list'])}>
        <Table
          bordered
          loading={loading}
          rowKey="jobId"
          dataSource={dataSource}
          rowSelection={rowSelection}
          columns={columns}
          pagination={false}
          rowClassName={this.handleClickRow}
          scroll={{ x: tableScrollWidth(columns), y: 300 }}
        />
      </div>
    );
  }
}
