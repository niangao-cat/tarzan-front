/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Table, Button, Row, Col } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import Title from './Title';
import styles from '../index.less';

export default class ProcessTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: {},
    };
  }

  @Bind()
  handleClickSelectedRows(record) {
    const { onFetchWorkcellDetail } = this.props;
    return {
      onClick: () => {
        this.setState({ selectedRows: record });
        onFetchWorkcellDetail(record);
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRows } = this.state;
    if (record.isAbnormalOutSite === 'Y') {
      if (selectedRows.jobId === record.jobId) {
        return styles['data-click-abnormal'];
      } else if(record.colorFlag){
          return styles['data-one-abnormal'];
        }else{
          return styles['data-two-abnormal'];
        }
    } else if (selectedRows.jobId === record.jobId) {
      return styles['data-click'];
    } else if(record.colorFlag){
      return styles['data-one'];
    }else{
      return styles['data-two'];
    }
    // if (selectedRows.jobId === record.jobId) {
    //   return styles['data-click'];
    // } else if(record.colorFlag){
    //     return styles['data-one'];
    //   }else{
    //     return styles['data-two'];
    //   }

  }

  render() {
    const {
      dataSource = [],
      loading,
      fetchBadInfo,
    } = this.props;
    const titleProps = {
      titleValue: '工序流转',
    };
    const { selectedRows = {} } = this.state;
    const columns = [
      {
        title: '序号',
        width: 30,
        dataIndex: 'lineNum',
        align: 'center',
      },
      {
        title: '工艺步骤',
        width: 40,
        dataIndex: 'parentWorkcellName',
        align: 'center',
      },
      {
        title: '作业平台类型',
        width: 40,
        dataIndex: 'jobTypeMeaning',
        align: 'center',
      },
      {
        title: '工位',
        width: 50,
        dataIndex: 'workcellName',
        align: 'center',
      },
      {
        title: '加工开始时间',
        width: 50,
        dataIndex: 'siteInDate',
        align: 'center',
      },
      {
        title: '加工结束时间',
        width: 50,
        dataIndex: 'siteOutDate',
        align: 'center',
      },
      {
        title: '加工时长(分)',
        width: 40,
        dataIndex: 'processTime',
        align: 'center',
      },
      {
        title: '加工人员',
        width: 30,
        dataIndex: 'createUserName',
        align: 'center',
      },
      {
        title: '不良',
        width: 30,
        dataIndex: 'ncInfoFlag',
        align: 'center',
        render: val => val ? '是' : '否',
      },
      {
        title: '是否返修',
        width: 30,
        dataIndex: 'isRework',
        align: 'center',
      },
      // {
      //   title: '是否异常出站',
      //   width: 30,
      //   dataIndex: 'isAbnormalOutSite',
      //   align: 'center',
      //   render: val => val ? '是' : '否',
      // },
    ];
    return (
      <div className={styles['data-content-product-traceability']}>
        <Row>
          <Col span={12}>
            <Title {...titleProps} />
          </Col>
          <Col span={12}>
            <div className={styles['data-button']}>
              <Button
                type="primary"
                onClick={() => fetchBadInfo()}
                disabled={!selectedRows.ncInfoFlag}
              >
                不良信息
              </Button>
            </div>
          </Col>
        </Row>
        <Table
          bordered
          loading={loading}
          rowKey="jobId"
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          onChange={this.handleTableChange}
          onRow={this.handleClickSelectedRows}
          scroll={{ y: 250 }}
          rowClassName={this.handleClickRow}
          // rowClassName={(record, _index)=>{
          //   if(record.isAbnormalOutSite === 'Y') {
          //     return styles['table-abnormal']
          //   }
          // }
          // }
        />
      </div>
    );
  }
}
