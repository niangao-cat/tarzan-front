/*
 * @Description: 合格芯片列表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 16:47:48
 * @LastEditTime: 2020-10-27 15:44:44
 */

import React, { Component } from 'react';
import { Table, Row, Col, Button } from 'hzero-ui';
import Title from '@/components/Title';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from '../index.less';

@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class QualifiedTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
      // onSearch,
      // handleAddData,
      // pagination,
      siteOutPrintLoading,
      siteOutPrintListLoading,
      addBarCode,
      siteOutPrint,
      printType,
      qualifiedTableSelection,
      containerInfo = {},
      qualifiedTableSelect = [],
    } = this.props;
    const { cosRecord } = containerInfo;
    const qualifiedTableSelectflag = qualifiedTableSelect === null ? [] : qualifiedTableSelect;
    const columns = [
      {
        title: '序号',
        dataIndex: 'sequence',
        render: (value, record, index) => index + 1,
        width: 60,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
        width: 60,
      },
      {
        title: '状态',
        dataIndex: 'status',
        width: 60,
        render: (value, record) => {
          if (record.printFlag === 'N') {
            return <span>新建</span>;
          }
          if (record.printFlag === 'Y') {
            return <span>已打印</span>;
          }
        },
      },
      {
        title: '实验代码',
        dataIndex: 'labCode',
        width: 60,
      },
    ];
    return (
      <React.Fragment>
        <Row style={{ marginBottom: '8px' }}>
          <Col span={12}><Title titleValue="合格芯片装盒" /></Col>
          <Col span={12} style={{ textAlign: 'end' }}>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => addBarCode('OK', true)}
              disabled={!cosRecord}
            >
              新增
            </Button>
            <Button
              type="primary"
              onClick={() => siteOutPrint('OK')}
              loading={printType === 'OK' && siteOutPrintLoading || printType === 'OK' && siteOutPrintListLoading}
              disabled={qualifiedTableSelectflag.length === 0}
            >
              打印
            </Button>
          </Col>
        </Row>
        <Table
          className={styles['select-row']}
          bordered
          rowKey="materialLotId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 250 }}
          rowSelection={qualifiedTableSelection}
        // onChange={page => onSearch(page)}
        // onRow={record => {
        //   return {
        //     onClick: () => handleAddData(record), // 点击行
        //   };
        // }}
        />
      </React.Fragment>
    );
  }
}
