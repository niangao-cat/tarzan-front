/*
 * @Description: 不良芯片列表
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-06 16:49:52
 * @LastEditTime: 2020-10-27 15:45:09
 */

import React, { Component } from 'react';
import { Table, Row, Col, Button } from 'hzero-ui';
import Title from '@/components/Title';
import formatterCollections from 'utils/intl/formatterCollections';
import styles from '../index.less';

@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class NCTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * nc页面渲染
   * @returns {*}
   */
  render() {
    const {
      loading,
      dataSource,
      // onSearch,
      // handleAddData,
      // pagination,
      addBarCode,
      siteOutPrint,
      siteOutPrintLoading,
      siteOutPrintListLoading,
      printType,
      ncTableSelection,
      containerInfo,
      ncTableSelect = [],
    } = this.props;
    const { cosRecord } = containerInfo;
    const ncTableSelectSelectflag = ncTableSelect === null ? [] : ncTableSelect;
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
        title: '不良类型',
        dataIndex: 'ncDesc',
        width: 120,
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
          <Col span={12}><Title titleValue="不良芯片装盒" /></Col>
          <Col span={12} style={{ textAlign: 'end' }}>
            <Button
              style={{ marginRight: '10px' }}
              onClick={() => addBarCode('NG', true)}
              disabled={!cosRecord}
            >
              新增
            </Button>
            <Button
              type="primary"
              onClick={() => siteOutPrint('NG')}
              loading={printType === 'NG' && siteOutPrintLoading || printType === 'NG' && siteOutPrintListLoading}
              disabled={ncTableSelectSelectflag.length === 0}
            >
              打印
            </Button>
          </Col>
        </Row>
        <Table
          className={styles['fetching-platform-bottom-left-nctable']}
          bordered
          rowKey="materialLotId"
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
          scroll={{ y: 250 }}
          rowSelection={ncTableSelection}
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
