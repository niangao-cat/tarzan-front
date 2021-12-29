/*
 * @Description: 工艺质量
 * @Version: 0.0.1
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 * @LastEditTime: 2020-08-24 21:58:39
 */

import React, { Component } from 'react';
import { Table, Tooltip } from 'hzero-ui';
import uuidv4 from 'uuid/v4';

import Title from './Title';
import styles from '../index.less';

export default class ProcessQuality extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { dataSource = [], loading } = this.props;
    const titleProps = {
      titleValue: '工艺质量',
    };
    const columns = [
      {
        title: '序号',
        width: 30,
        dataIndex: 'lineNum',
        align: 'center',
      },
      {
        title: '项目',
        width: 150,
        dataIndex: 'tagDescription',
        align: 'center',
        render: (val) => (
          <Tooltip placement="topLeft" title={val}>{val ? (val.length >= 15 ? `${val.substring(0, 14)}...` : val) : ''}</Tooltip>
        ),
      },
      {
        title: '位置',
        width: 30,
        dataIndex: 'position',
        align: 'center',
      },
      {
        title: '设备',
        width: 50,
        dataIndex: 'equipment',
        align: 'center',
      },
      {
        title: '下限',
        width: 30,
        dataIndex: 'minimumValue',
        align: 'center',
      },
      {
        title: '标准值',
        width: 30,
        dataIndex: 'standardValue',
        align: 'center',
      },
      {
        title: '上限',
        width: 30,
        dataIndex: 'maximalValue',
        align: 'center',
      },
      {
        title: '结果',
        width: 30,
        dataIndex: 'result',
        align: 'center',
        onCell: record => {
          if (record.result === 'NG') {
            return {
              style: {
                backgroundColor: '#DC143C',
              },
            };
          } else if (parseFloat(record.result)) {
            if (!record.maximalValue && !record.minimumValue) {
              return {
                style: {
                  backgroundColor: '#fff',
                },
              };
            } else if (record.minimumValue && record.maximalValue && (parseFloat(record.result, 6) > parseFloat(record.maximalValue, 6) || parseFloat(record.result, 6) < parseFloat(record.minimumValue, 6))) {
              return {
                style: {
                  backgroundColor: '#DC143C',
                },
              };
            }
            // 如果有上限没下限,同时结果大于上线
            else if (record.maximalValue && !(record.minimumValue) && parseFloat(record.result, 6) > parseFloat(record.maximalValue, 6)) {
              return {
                style: {
                  backgroundColor: '#DC143C',
                },
              }; // 如果有下限没上限,同时结果小于下限
            } else if (record.minimumValue && !(record.maximalValue) && parseFloat(record.result, 6) < parseFloat(record.minimumValue, 6)) {
              return {
                style: {
                  backgroundColor: '#DC143C',
                },
              };
            }
          }
        },
        render: val => (
          <Tooltip title={val}>
            <span>{val}</span>
          </Tooltip>
        ),
      },
      {
        title: '单路状态',
        width: 30,
        dataIndex: 'cosStatusMeaning',
        align: 'center',
      },
      {
        title: '备注',
        width: 30,
        dataIndex: 'remark',
        align: 'center',
      },
    ];
    return (
      <div className={styles['data-content-product-traceability']}>
        <Title {...titleProps} />
        <Table
          bordered
          loading={loading}
          rowKey={uuidv4()}
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          scroll={{ y: 250 }}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}
