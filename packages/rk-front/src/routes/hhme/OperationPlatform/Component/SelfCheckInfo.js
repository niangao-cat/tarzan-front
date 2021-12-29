/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Button, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import Title from './Title';
import styles from './index.less';

export default class SelfCheckInfo extends Component {
  @Bind()
  handleClickJustice(value, record) {
    const { onEnterClick } = this.props;
    if (onEnterClick && value) {
      onEnterClick(value, record, 'selfCheckList');
    }
  }

  @Bind()
  cellRender() {
    return {
      style: {
        overflow: 'hidden',
        maxWidth: 60,
        minWidth: 50,
        textOverflow: 'ellipsis',
        whiteSpace: 'normal',
      },
    };
  }

  render() {
    const { dataSource, baseInfo, modelName } = this.props;
    const titleProps = {
      titleValue: '自检',
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'orderSeq',
        align: 'center',
        width: 30,
        render: (val, record, index) => index + 1,
      },
      {
        title: '数据项',
        dataIndex: 'tagDescription',
        align: 'center',
        width: 80,
        onCell: this.cellRender,
      },
      {
        title: '结果',
        dataIndex: 'result',
        align: 'center',
        width: 30,
      },
      {
        title: '操作',
        dataIndex: 'position',
        width: 50,
        render: (val, record) => (
          <div>
            {!(['firstProcessPlatform', 'singleOperationPlatform'].includes(modelName) && baseInfo.siteOutDate) && (
              <Fragment>
                <Button
                  className={styles['self-button-ok']}
                  onClick={() => this.handleClickJustice('OK', record)}
                >
                  OK
                </Button>
                <Button
                  className={styles['self-button-ng']}
                  onClick={() => this.handleClickJustice('NG', record)}
                >
                  NG
                </Button>
              </Fragment>
            )}
          </div>
        ),
      },
    ];
    return (
      <div className={styles['self-item']}>
        <Title {...titleProps} />
        <div className={styles['self-item-content']}>
          <Table
            bordered
            loading={false}
            rowKey="jobRecordId"
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            onChange={this.handleTableChange}
            scroll={{ y: 180 }}
          />
        </div>
      </div>
    );
  }
}
