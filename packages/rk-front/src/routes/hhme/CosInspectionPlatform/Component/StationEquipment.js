/*
 * @Description: 工位设备
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-05 19:10:37
 * @LastEditTime: 2020-08-05 19:18:06
 */

import React, { Component } from 'react';
import { Button, Tooltip, Modal, Spin, Form, Row, Col, Table, Input } from 'hzero-ui';
import classNames from 'classnames';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { decrypt } from '@/utils/utils';
import notification from 'utils/notification';
import styles from '../index.less';

const prefixModel = `hmes.operationPlatform.model.operationPlatform`;


export default class StationEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      selectedRows: [],
      record: {
        dataSource: [],
      },
    };
  }

  @Bind()
  handleOpenModal(e) {
    const { workcellId } = this.props;
    if(e.equipmentId) {
      const record = {
        ...e,
        dataSource: [
          {
            ...e,
            workcellId,
          },
        ],
      };

      this.setState({
        visible: true,
        record,
        selectedRows: [{ ...e, workcellId }],
      });
    }
  }

  @Bind()
  handleCloseModal() {
    const record = {
      dataSource: [],
    };
    this.setState({ visible: false, record });
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
    const { onCheck } = this.props;
    const { selectedRows } = this.state;
    if(onCheck) {
      onCheck(selectedRows);
    }
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ selectedRows });
  }

  @Bind()
  handleChangeColor(color) {
    const newColor = color === 'GREY' ? '#999' : color === 'BLUE' ? '#3C80F7' : color === 'GREEN' ? '#1AC0A6' : '';
    return newColor;
  }

  @Bind()
  handleEnterClick(e, data) {
    const { onChange, workcellId, onFetchEqInfo, workcellCode, onChangeEqConfirm, onFetchEquipment } = this.props;
    const { record } = this.state;
    const { equipmentCategoryDesc, equipmentCategory } = data;
    const assetEncoding = decrypt(e.target.value);
    if(onFetchEqInfo && assetEncoding) {
      onFetchEqInfo(assetEncoding).then(res => {
        if(res) {
          if(onChange) {
            onChange({
              assetEncodingFirst: record.assetEncoding,
              assetEncodingLast: assetEncoding,
              descriptionsFirst: record.descriptions,
              descriptionsLast: res,
              equipmentCategory,
              equipmentCategoryDesc,
              workcellId,
            }).then(result => {
              if(result && result.success) {
                notification.success();
                this.setState({ visible: false });
                onFetchEquipment(workcellCode);
              } else if(result && !result.success) {
                Modal.confirm({
                  title: `当前设备处于${result.oldWorkcellName}工位，是否更换至当前工位`,
                  okText: '确定',
                  cancelText: '取消',
                  onOk: () => {
                    if(onChangeEqConfirm) { // 打开更换设备的模态框极为更新确认
                      onChangeEqConfirm(result).then(() => {
                        notification.success();
                        this.setState({ visible: false });
                        onFetchEquipment(workcellCode);
                      });
                    }
                  },
                  onCancel: () => {
                    this.setState(
                      {
                        record,
                      },
                      () => {
                        const assetEncodingDom = document.getElementsByClassName('asset-encoding');
                        assetEncodingDom[0].value = '';
                      },
                    );
                  },
                });
              }
            });
          }
          this.setState({
            record: {
              equipmentCategory,
              equipmentCategoryDesc,
              dataSource: [
                {
                  equipmentCategoryDesc,
                  equipmentCategory,
                  assetEncoding,
                  descriptions: res,
                },
              ],
            },
            selectedRows: [],
          });
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
    const { workcellId } = this.props;
    const { selectedRows, record } = this.state;
    if(selectedRows.length > 0) {
      const { equipmentCategoryDesc, equipmentCategory } = selectedRows[0];
      const dataInfo = {
        ...record,
        dataSource: [
          {
            equipmentCategoryDesc,
            equipmentCategory,
            workcellId,
          },
        ],
      };
      this.setState(
        {
          record: dataInfo,
        },
        () => {
          const assetEncodingDom = document.getElementsByClassName('asset-encoding');
          assetEncodingDom[0].focus();
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
  handleBindingEq(e, record) {
    const { onBinding, workcellId, siteId, onBindingEqConfirm, workcellCode, onFetchEquipment } = this.props;
    const { equipmentCategoryDesc, equipmentCategory } = record;
    const scanAssetEncoding = decrypt(e.target.value);
    if(onBinding) {
      onBinding({
        equipmentCategoryDesc,
        equipmentCategory,
        workcellId,
        siteId,
        scanAssetEncoding,
      }).then(res => {
        if(res && res.success) {
          notification.success();
          this.setState({ visible: false });
          onFetchEquipment(workcellCode);
        } else if(res && !res.success) {
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
                    onFetchEquipment(workcellCode);
                  }
                });
              }
            },
          });
        }
      });
    }
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
        title: intl.get(`${prefixModel}.supplierName`).d('设备编码'),
        width: 80,
        dataIndex: 'assetEncoding',
        render: (val, data) => !data.equipmentId ? (
          <Input onPressEnter={e => this.handleEnterClick(e, data)} className='asset-encoding' />
        ) : val,
      },
      {
        title: intl.get(`${prefixModel}.creationDate`).d('设备描述'),
        width: 120,
        dataIndex: 'descriptions',
      },
    ];
    return (
      <div className={styles['station-item']}>
        <Spin spinning={loading || deleteEqLoading || bindingEqLoading || bindingEqConfirmLoading || changeEqConfirmLoading || false}>
          <div className={styles['station-item-content']}>
            {itemList.map((e, index) => {
              return (
                <div
                  className={!e.materialLotCode ? classNames(styles['martial-content'], styles['material-content-grey']) : styles['martial-content']}
                  style={{
                    cursor: e.equipmentId ? 'pointer' : 'auto',
                    borderColor: this.handleChangeColor(e.color),
                  }}
                  onClick={() => this.handleOpenModal(e)}
                >
                  <span
                    className={styles['martial-orderSeq']}
                    style={{
                      backgroundColor: this.handleChangeColor(e.color),
                    }}
                  >
                    {index + 1}
                  </span>
                  <div
                    className={styles['martial-center']}
                    style={{ width: '90%', borderRight: 0 }}
                  >
                    <Tooltip title={e.equipmentCategoryDesc}>
                      <div
                        className={styles['martial-name']}
                        style={{
                          borderColor: this.handleChangeColor(e.color),
                        }}
                      >
                        {e.equipmentCategoryDesc}
                      </div>
                    </Tooltip>
                    <Tooltip title={e.assetEncoding}>
                      <div
                        className={styles['martial-code']}
                        style={{
                          borderColor: this.handleChangeColor(e.color),
                        }}
                      >
                        {e.equipmentId ? e.assetEncoding : (
                          <Input onPressEnter={event => this.handleBindingEq(event, e)} />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              );
            })}
            {itemList.length < 6 && <Button type="dashed" icon="plus" />}
          </div>
        </Spin>
        <Modal
          destroyOnClose
          width={600}
          title={intl.get('hmes.operationPlatform.view.message.title').d('工位')}
          visible={visible}
          footer={(
            <div>
              <Button type="default" onClick={this.handleDelete}>
                删除
              </Button>
              <Button type="default" onClick={this.handleChangeEq}>
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
                  label={intl.get(`${prefixModel}.stationCode`).d('设备类编码')}
                >
                  {record.equipmentCategory}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  {...DRAWER_FORM_ITEM_LAYOUT_MAX}
                  label={intl.get(`${prefixModel}.stationCode`).d('设备类描述')}
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
    );
  }
}
