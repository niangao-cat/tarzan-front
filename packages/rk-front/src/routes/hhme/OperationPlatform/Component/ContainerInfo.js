/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Button, Table, Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isArray } from 'lodash';

import styles from './index.less';
@Form.create({ fieldNameProp: null })
export default class ContainerInfo extends Component {
  @Bind()
  handleEnterClick(e) {
    const { onUpdateContainer } = this.props;
    if (onUpdateContainer) {
      onUpdateContainer(e.target.value);
    }
  }

  @Bind()
  handleComplete() {
    const { onUninstallContainer, form } = this.props;
    if (onUninstallContainer) {
      onUninstallContainer().then(() => {
        form.resetFields(['containerCode']);
      });
    }
  }

  render() {
    const {
      addContainerLoading,
      dataSource,
      containerInfo,
      workCellInfo,
      form: { getFieldDecorator },
    } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        align: 'center',
        width: 30,
        render: (val, record, index) => index + 1,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        align: 'center',
        width: 80,
      },
      // {
      //   title: '位置',
      //   dataIndex: 'position',
      //   align: 'center',
      //   width: 30,
      // },
    ];
    return (
      <div className={styles['container-item']}>
        <div className={styles['item-title']}>
          <span style={{ color: '#fff' }}>容器</span>
          <Form.Item>
            {getFieldDecorator('containerCode', {
                initialValue: workCellInfo.containerCode,
              })(
                <Input
                  onPressEnter={this.handleEnterClick}
                  disabled={!workCellInfo.isContainerOut}
                />
              )}
          </Form.Item>
          <span style={{ float: 'right' }}>{`${isArray(dataSource) ? dataSource.length : 0} / ${containerInfo.maxLoadQty || 0}`}</span>
        </div>
        <div className={styles['container-item-content']}>
          <Table
            bordered
            loading={addContainerLoading}
            rowKey="id"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            scroll={{ y: 180 }}
            onChange={this.handleTableChange}
          />
        </div>
        {workCellInfo.containerCode && (
          <div className={styles['container-button']}>
            <Button onClick={this.handleComplete}>卸载</Button>
          </div>
        )}
      </div>
    );
  }
}
