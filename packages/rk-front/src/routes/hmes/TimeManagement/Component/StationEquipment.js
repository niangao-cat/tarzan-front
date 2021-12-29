/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Button, Tooltip, Modal, Spin, Form, Row, Col, Table, Input } from 'hzero-ui';
import classNames from 'classnames';
import { Bind } from 'lodash-decorators';
import queryString from 'querystring';

import { decrypt } from '@/utils/utils';
import notification from 'utils/notification';
import { openTab } from 'utils/menuTab';

import styles from './index.less';

export default class SerialItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRows: [],
      record: {
        dataSource: [],
      },
      currentEquipmentIndex: null,
    };
  }

  @Bind()
  handleOpenModal(e, currentEquipmentIndex) {
    const { workCellInfo } = this.props;
    if(e.equipmentId) {
      const record = {
        ...e,
        dataSource: [
          {
            ...e,
            workcellId: workCellInfo.workcellId,
          },
        ],
      };

      this.setState({
        visible: true,
        record,
        currentEquipmentIndex,
        selectedRows: [{ ...e, workcellId: workCellInfo.workcellId }],
      });
    }
  }

  @Bind()
  handleCloseModal() {
    const record = {
      dataSource: [],
    };
    this.setState({ visible: false, record, currentEquipmentIndex: null });
  }

  @Bind()
  handleDelete() {
    const { onDelete } = this.props;
    const { selectedRows } = this.state;
    if(onDelete) {
      onDelete(selectedRows[0]);
      this.handleCloseModal();
    }
  }

  @Bind()
  handleCheck() {
    const { workCellInfo } = this.props;
    const { selectedRows } = this.state;
    openTab({
      key: `/hhme/equipment-check`, // 打开 tab 的 key
      path: `/hhme/equipment-check`, // 打开页面的path
      title: '设备点检&保养平台',
      search: queryString.stringify({
        pathType: true,
        assetEncoding: selectedRows[0].assetEncoding,
        typeCode: 'CHECK',
        workcellCode: workCellInfo.workcellCode,
      }),
      closable: true,
    });
    this.setState({visible: false});
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
  }

  @Bind()
  handleChangeColor(color) {
    const newColor = color === 'GREY' ? '#999' : color === 'BLUE' ? '#3C80F7' : color === 'GREEN' ? '#1AC0A6' : color === 'LIGHTGREEN' ? '#99CC66' : color === 'RED' ? '#ff6666' : '';
    return newColor;
  }

  @Bind()
  handleEnterClick(e, data, index) {
    const { onChange, workCellInfo, onFetchEqInfo, onChangeEqConfirm, onFetchEquipment } = this.props;
    const { record, currentEquipmentIndex } = this.state;
    const { equipmentCategoryDesc, equipmentCategory } = data;
    const assetEncoding = decrypt(e.target.value);
    const assetEncodingDom = document.getElementsByClassName(`asset-encoding-${index}`);
    assetEncodingDom[0].value = assetEncoding;
    if(onFetchEqInfo && assetEncoding) {
      onFetchEqInfo(assetEncoding).then(res => {
        if(res) {
          if(onChange && data._status === 'update') {
            onChange({
              assetEncodingFirst: record.assetEncoding,
              assetEncodingLast: assetEncoding,
              descriptionsFirst: record.descriptions,
              descriptionsLast: res,
              equipmentCategory,
              equipmentCategoryDesc,
              workcellId: workCellInfo.workcellId,
            }).then(result => {
              if(result && result.success) {
                notification.success();
                this.setState({ visible: false });
                onFetchEquipment(workCellInfo.workcellCode);
              } else if(result && result.success === false) {
                Modal.confirm({
                  title: `当前设备处于${result.oldWorkcellName}工位，是否更换至当前工位`,
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => {
                    if(onChangeEqConfirm) { // 打开更换设备的模态框极为更新确认
                      onChangeEqConfirm(result).then(() => {
                        notification.success();
                        this.setState({ visible: false });
                        onFetchEquipment(workCellInfo.workcellCode);
                      });
                    }
                  },
                  onCancel: () => {
                    this.setState(
                      {
                        record,
                      },
                      () => {
                        assetEncodingDom[0].value = '';
                      },
                    );
                  },
                });
              } else if(result && result.failed === true) {
                notification.warning({
                  message: '操作失败',
                  description: result.message,
                });
                if(assetEncodingDom.length > 0) {
                  assetEncodingDom[0].focus();
                  assetEncodingDom[0].select();
                }
              }
            });
          } else if(data._status === 'create') {
            this.handleBindingEq(assetEncoding, { equipmentCategoryDesc, equipmentCategory }, true, currentEquipmentIndex);
          }
        }
      });
    }
  }


  /**
   * 选中设备，点击更换，清空设备信息
   *
   * @memberof SerialItem
   */
  @Bind()
  handleChangeEq() {
    const { workCellInfo } = this.props;
    const { selectedRows, record } = this.state;
    if(selectedRows.length > 0) {
      const { equipmentCategoryDesc, equipmentCategory } = selectedRows[0];
      const dataInfo = {
        ...record,
        dataSource: [
          {
            equipmentCategoryDesc,
            equipmentCategory,
            workcellId: workCellInfo.workcellId,
            _status: 'update',
          },
        ],
      };
      this.setState(
        {
          record: dataInfo,
        },
        () => {
          const assetEncodingDom = document.getElementsByClassName(`asset-encoding-0`);
          if(assetEncodingDom.length > 0) {
            assetEncodingDom[0].focus();
          }
        },
      );

    }
  }

  /**
   * 设备类绑定设备
   *
   * @param {*} e
   * @param {*} record
   * @memberof SerialItem
   */
  @Bind()
  handleBindingEq(value, record, isCreate = false, index) {
    const { onBinding, workCellInfo, siteId, onBindingEqConfirm, onFetchEquipment } = this.props;
    const { equipmentCategoryDesc, equipmentCategory } = record;
    const scanAssetEncoding = decrypt(value);
    const equipmentCodeDom = document.getElementsByClassName(`equipment-code-${index}`);
    if(equipmentCodeDom.length > 0) {
      equipmentCodeDom[0].value = scanAssetEncoding;
    }
    if(onBinding) {
      onBinding({
        equipmentCategoryDesc,
        equipmentCategory,
        workcellId: workCellInfo.workcellId,
        siteId,
        scanAssetEncoding,
      }).then(res => {
        if(res && res.success === true) {
          notification.success();
          this.setState({ visible: false });
          onFetchEquipment(workCellInfo.workcellCode);
        } else if(res && res.success === false) {
          Modal.confirm({
            title: `当前设备处于${res.oldWorkcellName}工位，是否更换至当前工位`,
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
              if(onBindingEqConfirm) {
                onBindingEqConfirm(res).then(result => {
                  if(result) {
                    notification.success();
                    this.setState({ visible: false });
                    onFetchEquipment(workCellInfo.workcellCode);
                  }
                });
              }
            },
          });
        } else if(res && res.failed === true && !isCreate) {
          notification.warning({
            message: '操作失败',
            description: res.message,
          });
          const equipmentCodeDomIndex = document.getElementsByClassName(`equipment-code-${index + 1}`);
          if(equipmentCodeDomIndex.length > 0) {
            equipmentCodeDomIndex[index].focus();
            equipmentCodeDomIndex[index].select();
          }
        } else if(res && res.failed === true && isCreate) {
          notification.warning({
            message: '操作失败',
            description: res.message,
          });
          const assetEncodingDom = document.getElementsByClassName(`asset-encoding-${index}`);
          if(assetEncodingDom.length > 0) {
            assetEncodingDom[0].focus();
            assetEncodingDom[0].select();
          }
        }
      });
    }
  }

  @Bind()
  handleCreate() {
    const { record } = this.state;
    const { dataSource, ...newRecord } = record;
    const { equipmentCategoryDesc, equipmentCategory } = newRecord;
    const newDataSource = [
      ...dataSource,
      {
        equipmentCategoryDesc,
        equipmentCategory,
        _status: 'create',
      },
    ];
    this.setState({
      record: {
        ...newRecord,
        dataSource: newDataSource,
      },
    },
      () => {
        const assetEncodingDom = document.getElementsByClassName(`asset-encoding-${newDataSource.length - 1}`);
        assetEncodingDom[0].focus();
      }
    );
  }

  render() {
    const { itemList = [], loading, deleteEqLoading, changeEqLoading, bindingEqLoading, bindingEqConfirmLoading, changeEqConfirmLoading } = this.props;
    const { visible, selectedRows, record } = this.state;
    const DRAWER_FORM_ITEM_LAYOUT_MAX = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const rowSelection = {
      selectedRowKeys: selectedRows.map(e => e.equipmentId),
      type: 'radio', // 单选
      onChange: this.handleChangeSelectRows,
    };
    const columns = [
      {
        title: '设备编码',
        width: 80,
        dataIndex: 'assetEncoding',
        render: (val, data, index) => !data.equipmentId ? (
          <Input
            onPressEnter={e => {
              this.handleEnterClick(e, data, index);
            }}
            className={`asset-encoding-${index}`}
          />
        ) : val,
      },
      {
        title: '设备描述',
        width: 120,
        dataIndex: 'descriptions',
      },
    ];
    return (
      <div className={styles['time-management-station']}>
        <div className={styles['timeManagement_station-item']}>
          <div className={styles['timeManagement_item-title']}>
            <span className={styles['timeManagement_item-title-box']} />
            <span className={styles['timeManagement_item-title-text']}>
            工位设备
            </span>
          </div>
          <Spin spinning={loading || deleteEqLoading || bindingEqLoading || bindingEqConfirmLoading || changeEqConfirmLoading || false}>
            <div className={styles['timeManagement_station-item-content-new']}>
              <Form>
                {itemList.map((e, index) => {
                return (
                  <div
                    className={!e.materialLotCode ? classNames(styles['timeManagement_martial-content'], styles['timeManagement_material-content-grey']) : styles['timeManagement_martial-content']}
                    style={{
                      cursor: e.equipmentId ? 'pointer' : 'auto',
                      borderColor: this.handleChangeColor(e.color),
                    }}
                    onClick={() => this.handleOpenModal(e, index)}
                  >
                    <span
                      className={styles['timeManagement_martial-orderSeq']}
                      style={{
                        backgroundColor: this.handleChangeColor(e.color),
                      }}
                    >
                      {index + 1}
                    </span>
                    <div
                      className={styles['timeManagement_martial-center']}
                      style={{ width: '90%', borderRight: 0 }}
                    >
                      <Tooltip title={e.equipmentCategoryDesc}>
                        <div
                          className={styles['timeManagement_martial-name']}
                          style={{
                            borderColor: this.handleChangeColor(e.color),
                          }}
                        >
                          {e.equipmentCategoryDesc}
                        </div>
                      </Tooltip>
                      <Tooltip title={e.assetEncoding}>
                        <div
                          className={styles['timeManagement_martial-code']}
                          style={{
                            borderColor: this.handleChangeColor(e.color),
                          }}
                        >
                          {e.assetEncoding ? e.assetEncoding : (
                            <Input onPressEnter={event => this.handleBindingEq(event.target.value, e, false, index)} className={`equipment-code-${index}`} />
                          )}
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
              </Form>
              {/* {itemList.length < 6 && <Button type="dashed" icon="plus" />} */}
            </div>
          </Spin>
          <Modal
            destroyOnClose
            width={600}
            title='工位'
            visible={visible}
            footer={(
              <div>
                <Button type="default" disabled={record.dataSource.length > 1 || record.dataSource.filter(e => e._status === 'update').length > 0} onClick={this.handleCreate}>
                添加
                </Button>
                <Button type="default" disabled={record.dataSource.filter(e => ['create', 'update'].includes(e._status)).length > 0} onClick={this.handleDelete}>
                删除
                </Button>
                <Button type="default" disabled={record.dataSource.filter(e => e._status === 'create').length > 0} onClick={this.handleChangeEq}>
                更换
                </Button>
                <Button type="default" onClick={this.handleCheck}>
                点检
                </Button>
              </div>
          )}
            onCancel={this.handleCloseModal}
            onOk={this.handleSave}
            wrapClassName={styles['enter-modal']}
          >
            <Spin spinning={loading || changeEqLoading || false}>
              <Row>
                <Col span={12}>
                  <Form.Item
                    {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                    label='设备类编码'
                  >
                    {record.equipmentCategory}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                    label='设备类描述'
                  >
                    {record.equipmentCategoryDesc}
                  </Form.Item>
                </Col>
              </Row>
              <Table
                bordered
                dataSource={record.dataSource}
                columns={columns}
                scroll={{ y: 180 }}
                rowSelection={rowSelection}
                loading={loading}
                rowKey="equipmentId"
                pagination={false}
                bodyStyle={{ fontSize: '10px', lineHeight: '30px' }}
              />
            </Spin>
          </Modal>
        </div>
      </div>
    );
  }
}
