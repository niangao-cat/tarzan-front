/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Button, Table, Row, Form, Col, Input, InputNumber, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import notification from 'utils/notification';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';

import styles from './index.less';

@Form.create({ fieldNameProp: null })
export default class ReturnMaterialModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      visible: false,
      selectedVisible: false,
      materialType: '', // 批量工序作业平台需选择投 时效 / 批次 / 序列号 物料
    };
  }

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        const { selectedRows } = this.state;
        const selectedId = selectedRows.map(e => e.jobMaterialId);
        if (!selectedId.includes(record.jobMaterialId)) {
          this.setState({ selectedRows: [record] });
        }
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRows } = this.state;
    const selectedId = selectedRows.map(e => e.jobMaterialId);
    if (selectedId.includes(record.jobMaterialId)) {
      return styles['data-click'];
    } else {
      return '';
    }
  }

  @Bind()
  handleOpenModal() {
    const { onSearch, modelName, selectedRows } = this.props;
    if (['singleOperationPlatform', 'lotOperationPlatform', 'firstProcessPlatform', 'repairPlatform', 'pumpPlatform'].includes(modelName)) {
      if (selectedRows.length !== 1 && ['lotOperationPlatform'].includes(modelName)) {
        return notification.warning({ description: '请勾选一条条码' });
      } else {
        return this.setState({ selectedVisible: true });
      }
    }
    if (onSearch) {
      onSearch();
    }
    this.setState({ visible: true });
  }

  @Bind()
  handleCloseModal() {
    const { onClearFeedingRecordList } = this.props;
    if (onClearFeedingRecordList) {
      onClearFeedingRecordList();
    }
    this.setState({ visible: false, selectedRows: [] });
  }

  @Bind()
  handleCloseSelectedModal() {
    this.setState({ selectedVisible: false });
  }

  @Bind()
  handleReturnMaterial(flag) {
    const { onReturnMaterial, form, materialType, operationId, prepareQty, modelName, baseInfo = {} } = this.props;
    const newMaterialType = ['singleOperationPlatform', 'lotOperationPlatform', 'firstProcessPlatform', 'repairPlatform', 'pumpPlatform'].includes(modelName) ? this.state.materialType : materialType;
    const { selectedRows } = this.state;
    let payload = ['singleOperationPlatform'].includes(modelName) ? {
      operationId,
      prepareQty,
      materialType: newMaterialType,
      designedReworkFlag: baseInfo.designedReworkFlag,
    } : {
      operationId,
      prepareQty,
      materialType: newMaterialType,
      currentJobId: baseInfo.jobId,
    };
    payload = ['repairPlatform'].includes(modelName) ? {
      ...payload,
      currentWorkOrderNum: baseInfo.workOrderNum,
      backOperationId: selectedRows[0].operationId,
      siteInEoStepId: baseInfo.eoStepId,
      siteInEoId: baseInfo.eoId,
    } : payload;
    if (['LOT', 'TIME'].includes(newMaterialType)) {
      form.validateFields((err, val) => {
        if (!err) {
          onReturnMaterial({
            ...selectedRows[0],
            ...val,
            ...payload,
          }, flag).then(res => {
            if (res) {
              this.setState({ selectedRows: [] });
            }
          });
        }
      });
    } else if (['SN'].includes(newMaterialType)) {
      onReturnMaterial({
        ...selectedRows[0],
        backMaterialLotCode: selectedRows[0].materialLotCode,
        backQty: selectedRows[0].releaseQty,
        ...payload,
      }, flag).then(res => {
        if (res) {
          this.setState({ selectedRows: [] });
        }
      });;
    }
  }


  @Bind()
  handleSetMaterialType(type) {
    const { onSearch } = this.props;
    this.setState({ materialType: type, selectedVisible: false, visible: true });
    if (onSearch) {
      onSearch(type);
    }
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
  }

  render() {
    const { disabled = false, dataSource = [], returnLoading, form: { getFieldDecorator }, materialType, returnMaterialLoading, modelName } = this.props;
    const { visible, selectedRows, selectedVisible } = this.state;
    const newMaterialType = ['singleOperationPlatform', 'lotOperationPlatform', 'firstProcessPlatform', 'repairPlatform', 'pumpPlatform'].includes(modelName) ? this.state.materialType : materialType;
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.jobMaterialId),
      type: 'radio', // 单选
      onChange: this.handleChangeSelectRows,
    };
    let columns = [
      {
        title: '序号',
        width: 30,
        dataIndex: 'orderSeq',
        render: (text, record, index) => {
          return index + 1;
        },
      },
      {
        title: '生产指令',
        width: 80,
        dataIndex: 'workOrderNum',
      },
      {
        title: '执行指令',
        width: 80,
        dataIndex: 'eoNum',
        onCell: this.cellRender,
      },
      {
        title: '投料物料编码',
        dataIndex: 'materialCode',
        width: 80,
      },
      {
        title: '投料物料描述',
        width: 60,
        dataIndex: 'materialName',
      },
      {
        title: '物料版本',
        width: 40,
        dataIndex: 'productionVersion',
      },
      {
        title: '条码',
        width: 80,
        dataIndex: 'materialLotCode',
      },
      {
        title: '投料数量',
        width: 40,
        dataIndex: 'releaseQty',
      },
      {
        title: '批次',
        width: 40,
        dataIndex: 'lotCode',
        align: 'center',
      },
      {
        title: '投料时间',
        width: 80,
        dataIndex: 'creationDate',
        align: 'center',
      },
      {
        title: '投料人',
        dataIndex: 'loginName',
        width: 30,
      },
    ];
    if (modelName === 'repairPlatform') {
      columns = columns.concat([{
        title: '报废标识',
        dataIndex: 'isScraped',
        width: 30,
        render: val => val === '1' ? '是' : '否',
      }]);
    }
    return (
      <Fragment>
        <Button disabled={disabled} type="default" onClick={() => this.handleOpenModal()}>退料</Button>
        <Modal
          destroyOnClose
          width={1300}
          title='投料退回'
          visible={visible}
          onCancel={this.handleCloseModal}
          footer={(
            <Fragment>
              {modelName === 'repairPlatform' && (
                <Button
                  type="danger"
                  loading={returnMaterialLoading}
                  onClick={() => this.handleReturnMaterial(false)}
                >
                  报废
                </Button>
              )}
              <Button
                type="primary"
                loading={returnMaterialLoading}
                disabled={selectedRows.length === 0}
                onClick={() => this.handleReturnMaterial(true)}
              >
                退料
              </Button>
              <Button
                type="default"
                style={{ marginRight: '12px' }}
                onClick={() => this.handleCloseModal()}
              >
                取消
              </Button>
            </Fragment>
          )}
        >
          <Spin spinning={returnMaterialLoading || false}>
            {['LOT', 'TIME'].includes(newMaterialType) && (
              <Row>
                <Col span={8}>
                  <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="退料条码">
                    {getFieldDecorator('backMaterialLotCode', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '退料条码',
                          }),
                        },
                      ],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="退料数量">
                    {getFieldDecorator('backQty', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '退料数量',
                          }),
                        },
                      ],
                    })(
                      <InputNumber style={{ width: '100%' }} />
                    )}
                  </Form.Item>
                </Col>
              </Row>
            )}
            <div className={styles['head-table']}>
              <Table
                scroll={{
                  x: tableScrollWidth(columns),
                }}
                bordered
                loading={returnLoading || returnMaterialLoading}
                columns={columns}
                rowKey='jobMaterialId'
                rowSelection={rowSelection}
                dataSource={dataSource}
                pagination={false}
                onRow={this.handleClickSelectedRows}
                rowClassName={this.handleClickRow}
              />
            </div>
          </Spin>
        </Modal>
        <Modal
          destroyOnClose
          width={300}
          visible={selectedVisible}
          title='请确认'
          onCancel={this.handleCloseSelectedModal}
          footer={(
            <Fragment>
              <Button
                type="primary"
                loading={returnMaterialLoading}
                onClick={() => this.handleSetMaterialType('SN')}
              >
                序列号
              </Button>
              <Button
                type="primary"
                style={{ marginRight: '12px' }}
                onClick={() => this.handleSetMaterialType('TIME')}
              >
                时效
              </Button>
              <Button
                type="primary"
                style={{ marginRight: '12px' }}
                onClick={() => this.handleSetMaterialType('LOT')}
              >
                批次
              </Button>
            </Fragment>
          )}
          wrapClassName={styles['operationPlatform_confirm-modal']}
        >
          请先选择投料种类，序列号/时效/批次物料
        </Modal>
      </Fragment>
    );
  }
}
