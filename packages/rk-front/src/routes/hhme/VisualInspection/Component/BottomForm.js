import React, { Component } from 'react';
import { Form, Button, Input, Row, Col, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import classNames from 'classnames';
import { tableScrollWidth } from 'utils/utils';

import styles from '../index.less';

const formLayout = {
  labelCol: {
    span: 10,
  },
  wrapperCol: {
    span: 14,
  },
};
@Form.create({ fieldNameProp: null })
class BottomForm extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);;
  }

  // @Bind()
  // debounce(func, wait) {
  //   let timeout;
  //   return () => {
  //     if (timeout) clearTimeout(timeout);
  //     timeout = setTimeout(() => {
  //       // eslint-disable-next-line prefer-rest-params
  //       func.apply(this, arguments);
  //     }, wait);
  //   };
  // }

  @Bind()
  handleScanBarcode() {
    const { onScanBarcode } = this.props;
    const inputBarcode = document.getElementById('visualInspection_barcode');
    if (onScanBarcode) {
      onScanBarcode(inputBarcode.value);
    }
  }

  @Bind()
  handleScanContainerBarcode(e) {
    const { onScanContainerCode } = this.props;
    if (onScanContainerCode) {
      onScanContainerCode(e.target.value);
    }
  }

  @Bind()
  handleFetchMaterialInfo(record) {
    const { onFetchQueryProcessing, onGetEquipmentList, onSetRecord } = this.props;
    onFetchQueryProcessing(record.jobId);
    onGetEquipmentList(record);
    onSetRecord(record);
  }

  @Bind()
  handleCancelInSite() {
    const { onCancelInSite, selectedRows } = this.props;
    if(onCancelInSite) {
      onCancelInSite(selectedRows);
    }
  }

  @Bind()
  handleFinish() {
    const { onFinish, selectedRows } = this.props;
    if(onFinish) {
      onFinish(selectedRows);
    }
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      scanBarcodeLoading,
      fetchMaterialInfoLoading,
      form,
      loading,
      dataSource,
      containerBarCodeInfo = {},
      onChangeSelectedRows,
      selectedRows,
    } = this.props;
    const { getFieldDecorator } = form;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.materialLotId),
      onChange: onChangeSelectedRows,
    };
    const columns = [
      {
        title: '条码',
        width: 80,
        dataIndex: 'materialLotCode',
        align: 'center',
        render: (val, record) => <a onClick={() => this.handleFetchMaterialInfo(record)}>{val}</a>,
      },
      {
        title: '数量',
        width: 30,
        dataIndex: 'snQty',
        align: 'center',
      },
      {
        title: '工单',
        width: 60,
        dataIndex: 'workOrderNum',
        align: 'center',
      },
      {
        title: 'WAFER',
        width: 60,
        dataIndex: 'waferNum',
        align: 'center',
      },
      {
        title: '芯片类型',
        width: 30,
        dataIndex: 'cosType',
        align: 'center',
      },
    ];
    return (
      <Form>
        <div className={styles['base-info-content']}>
          <div className={classNames(styles['base-up'])}>
            <div className={styles['pre-form']}>
              <Row>
                <Col span={12}>
                  <Form.Item label="完工条码" {...formLayout}>
                    {
                      getFieldDecorator('materialLotCode')(
                        <Input
                          id="visualInspection_barcode"
                          disabled={scanBarcodeLoading || fetchMaterialInfoLoading}
                          onPressEnter={(!scanBarcodeLoading && !fetchMaterialInfoLoading) && this.handleScanBarcode}
                          // onPressEnter={(!scanBarcodeLoading && !fetchMaterialInfoLoading) && this.debounce(this.handleScanBarcode, 500)}
                        />)
                    }
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <div className={styles['base-button']}>
                    <Button type="default" style={{ marginLeft: '12px'}} onClick={() => this.handleFinish()}>
                      完工
                    </Button>
                    <Button
                      type="primary"
                      style={{ marginLeft: '12px'}}
                      onClick={() => this.handleCancelInSite()}
                    >
                      进站取消
                    </Button>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <Form.Item label="装载容器" {...formLayout}>
                    {getFieldDecorator('containerCode')(<Input onPressEnter={this.handleScanContainerBarcode} />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="已装载数量" {...formLayout}>
                    {getFieldDecorator('qty', {
                      initialValue: containerBarCodeInfo.count,
                    })(<Input />)}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </div>
          <div className={styles['head-table']}>
            <Table
              bordered
              loading={loading}
              rowKey="materialLotId"
              dataSource={dataSource}
              rowSelection={rowSelection}
              columns={columns}
              pagination={false}
              scroll={{ x: tableScrollWidth(columns, 300), y: 200 }}
            />
          </div>
        </div>
      </Form>
    );
  }
}

export default BottomForm;
