/**
 * 计划外投料
 * @date: 2020/07/15 19:25:36
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Modal, Button, Row, Form, Col, Input, InputNumber, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import notification from 'utils/notification';
import { tableScrollWidth, getEditTableData } from 'utils/utils';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ITEM_LAYOUT,
} from 'utils/constants';
import EditTable from 'components/EditTable';

import styles from './index.less';

@Form.create({ fieldNameProp: null })
export default class ReturnMaterialModal extends Component {

  @Bind()
  handleFeedMaterial() {
    const { onFeedOrReturnMaterial, selectedRows, onChangeSelectRows } = this.props;
    const newList = getEditTableData(selectedRows);
    if(onFeedOrReturnMaterial && newList.length > 0) {
      onFeedOrReturnMaterial(newList, true).then(res => {
        if(res) {
          onChangeSelectRows([]);
        }
      });
    } else {
      notification.warning({
        description: '请至少勾选一条投料信息进行投料',
      });
    }
  }

  @Bind()
  handleReturnMaterial() {
    const { onFeedOrReturnMaterial, form, selectedRows } = this.props;
    if(onFeedOrReturnMaterial) {
      form.validateFields(['outQty'], (err, value) => {
        if(!err) {
          onFeedOrReturnMaterial([{...selectedRows[0], ...value}], false);
        }
      });
    }
  }

  @Bind()
  handleFetchScanBarcode(materialLotCode) {
    const { dataSource, onFetchScanBarcode } = this.props;
    const currentMaterialLotCodes = dataSource.filter(e => e._status === 'create').map(e => e.materialLotCode);
    if(currentMaterialLotCodes.includes(materialLotCode)) {
      return notification.warning({ description: '当前条码已扫描，请重新选择条码' });
    } else {
      onFetchScanBarcode(materialLotCode);
    }
  }

  /**
   * 勾选单个物料
   *
   * @param {*} record
   * @param {*} selected
   * @memberof OperationPlatform
   */
  @Bind()
  handleSelected(record, selected) {
    const { selectedRows = [], onChangeSelectRows } = this.props;
    if(selectedRows.length === 0 && selected) {
      onChangeSelectRows([record]);
    } else if(selectedRows.length > 0 && selectedRows[0]._status === 'create' && record._status === 'create' && selected) {
      onChangeSelectRows([...selectedRows, record]);
    } else if(selectedRows.length > 0 && selectedRows[0]._status === 'create' && record._status !== 'create' && selected) {
      notification.warning({ description: '勾选条码为投料操作，请重新选择需要投料的条码'});
    } else if(selectedRows.length > 0 && selectedRows[0]._status !== 'create' && selected){
      notification.warning({ description: '勾选条码为退料操作，仅允许勾选一条条码'});
    } else if(!selected) {
      onChangeSelectRows(selectedRows.filter(e => e.id !== record.id));
    }
  }

  @Bind()
  handleAllSelected(selected) {
    const { dataSource, onChangeSelectRows } = this.props;
    if(selected) {
      onChangeSelectRows(dataSource.filter(e => e._status === 'create' ));
    } else {
      onChangeSelectRows([]);

    }
  }

  render() {
    const { dataSource = [], pagination = {}, onSearch, record, returnLoading, form: { getFieldDecorator }, returnMaterialLoading, visible, onCloseModal, loading, saveLoading, baseInfo, selectedRows } = this.props;
    const rowSelection = {
      width: 40,
      selectedRowKeys: selectedRows.map(e => e.id),
      onSelect: this.handleSelected,
      onSelectAll: this.handleAllSelected,
    };
    const columns = [
      {
        title: '序号',
        width: 40,
        dataIndex: 'orderSeq',
        render: (text, data, index) => {
          return index + 1;
        },
      },
      {
        title: '投料物料编码',
        dataIndex: 'materialCode',
        width: 80,
      },
      {
        title: '投料物料描述',
        width: 80,
        dataIndex: 'materialName',
      },
      {
        title: '物料版本',
        width: 40,
        dataIndex: 'materialVersion',
      },
      {
        title: '条码',
        width: 80,
        dataIndex: 'materialLotCode',
      },
      {
        title: '投料数量',
        width: 80,
        dataIndex: 'qty',
        render: (val, data) => ['create', 'update'].includes(data._status) ? (
          <Form.Item>
            {data.$form.getFieldDecorator('qty', {
              initialValue: data.result,
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '投料数量',
                  }),
                },
              ],
            })(
              <InputNumber style={{ width: '100%'}} min={0} max={data.qty} />
            )}
          </Form.Item>
        ) : val,
      },
      {
        title: '批次',
        width: 40,
        dataIndex: 'lot',
        align: 'center',
      },
      {
        title: '投料时间',
        width: 80,
        dataIndex: 'feedDate',
        align: 'center',
      },
      {
        title: '投料人',
        dataIndex: 'feederName',
        width: 40,
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={1200}
        title='投料/退料'
        visible={visible}
        onCancel={onCloseModal}
        footer={(
          <Fragment>
            <Button
              type="danger"
              loading={returnMaterialLoading}
              onClick={() => this.handleReturnMaterial()}
            >
                退料
            </Button>
            <Button
              type="primary"
              loading={saveLoading}
              disabled={selectedRows.length === 0}
              onClick={() => this.handleFeedMaterial()}
            >
                投料
            </Button>
            <Button
              type="default"
              style={{ marginRight: '12px'}}
              onClick={() => onCloseModal()}
            >
              取消
            </Button>
          </Fragment>
          )}
      >
        <Spin spinning={loading || false}>
          <Row>
            <Col span={8}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="投料条码">
                {getFieldDecorator('backMaterialLotCode', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '投料条码',
                      }),
                    },
                  ],
                })(
                  <Input onPressEnter={e => this.handleFetchScanBarcode(e.target.value)} />
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item {...SEARCH_FORM_ITEM_LAYOUT} label="退料数量">
                {getFieldDecorator('outQty', {
                  rules: [
                    {
                      required: true,
                      message: intl.get('hzero.common.validation.notNull', {
                        name: '退料数量',
                      }),
                    },
                  ],
                })(
                  <InputNumber disabled={!((baseInfo.reworkFlag && selectedRows.length === 1) || (!baseInfo.reworkFlag && selectedRows.length === 1 && selectedRows[0]._status !== 'create'))} style={{ width: '100%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <div className={styles['head-table']}>
            <EditTable
              scroll={{
                x: tableScrollWidth(columns),
              }}
              bordered
              loading={returnLoading}
              columns={columns}
              rowKey='id'
              rowSelection={rowSelection}
              dataSource={dataSource}
              pagination={pagination}
              onChange={page => onSearch(record, page)}
            />
          </div>
        </Spin>
      </Modal>
    );
  }
}
