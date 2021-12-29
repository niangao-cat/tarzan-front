/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component, Fragment } from 'react';
import { Bind } from 'lodash-decorators';
import { Spin, Button, Tooltip, Input, Form, Modal, Table, Col, Row, Checkbox } from 'hzero-ui';
import { isArray, isEmpty, isNull } from 'lodash';
import classNames from 'classnames';

import intl from 'utils/intl';
import { filterNullValueObject } from 'utils/utils';

import ReturnMaterialModal from './ReturnMaterialModal';
import Title from './Title';
import styles from './index.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 8 },
  },
  wrapperCol: {
    sm: { span: 14 },
  },
};


@Form.create({ fieldNameProp: null })
export default class SerialItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      barode: null,
      record: {},
      index: null,
      selectedRows: [],
      materialLotSelectedRows: [],
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.isUpdateSerialItem) {
      this.handleInitSelectedRows(this.props);
      this.props.onChangeIsUpdateSerialItem();
    }
    if(!isEmpty(this.props.materialLotList) && isEmpty(prevProps.materialLotList)) {
      this.handleUpdateSelectedRows([this.props.materialLotList[0]]);
    }
  }

  @Bind()
  handleUpdateSelectedRows(arr) {
    this.setState({
      materialLotSelectedRows: arr,
    });
  }

  @Bind()
  handleInitSelectedRows(props) {
    const { itemList = [], outOfPlanMaterialList = []} = props;
    const bydList = isArray(outOfPlanMaterialList) ? outOfPlanMaterialList.filter(e => e.materialType === 'SN') : [];
    const dataSource = isArray(itemList) ? itemList.concat(bydList) : bydList;
    this.setState({
      selectedRows: dataSource.filter(e => e.isReleased === 1 && e.componentQty !== e.releaseQty),
    });
  }

  @Bind()
  handleEnterClick(itemCode, record, index) {
    const { tenantId, onFetchMaterialLotList, onEnterClick, modelName, onFetchIsContainer, firstProcessSerialItem } = this.props;
    if(modelName === 'firstProcessPlatform') {
      onFetchIsContainer(itemCode).then(res => {
        if(res && !isNull(res.containerId)) {
          onFetchMaterialLotList({}, { tenantId, itemCode }).then(materialLotList => {
            if(materialLotList) {
              this.setState({ visible: true });
              // Modal.confirm({
              //   title: '请选择物料批编码',
              //   content: this.renderMaterialLotListModal(),
              //   width: 800,
              //   onOk: this.handleConfirm,
              // });
            }
          });
          this.setState({ itemCode, record, index });
        } else {
          firstProcessSerialItem(itemCode, record, this.state.index );
          this.setState({ barode: null, record: {}, index });
        }
      });
    } else {
      onEnterClick(itemCode, record, index);
    }
  }

  @Bind()
  handleConfirm() {
    const { firstProcessSerialItem, form } = this.props;
    const { record, index, selectedRows} = this.state;
    form.resetFields();
    if(firstProcessSerialItem) {
      firstProcessSerialItem(selectedRows[0].materialLotCode, record, index);
      this.setState({ barode: null, record: {}, visible: false });
    }
  }

  @Bind()
  handleOpenModal() {
    const { onOpenModal } = this.props;
    if(onOpenModal) {
      onOpenModal();
    }
  }

  @Bind()
  handleCloseModal() {
    this.setState({ visible: false });
  }

  @Bind()
  queryData(page = {}) {
    const { form: { getFieldsValue }, onFetchMaterialLotList, tenantId } = this.props;
    const { barode } = this.state;
    const fields = getFieldsValue(['materialLotCode', 'materialCode', 'materialName']);
    if(onFetchMaterialLotList) {
      onFetchMaterialLotList(page, {
        tenantId,
        barode,
        ...filterNullValueObject(fields),
      });
    }
  }

  @Bind()
  formReset() {
    const { form: { resetFields }} = this.props;
    resetFields(['materialLotCode', 'materialCode', 'materialName']);
  }

  @Bind()
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ materialLotSelectedRows: selectedRows });
  }

  @Bind()
  handleAllChecked(event) {
    const { itemList, onCheckItem } = this.props;
    const newItemList = itemList.filter(e => e.materialLotCode && e.componentQty !== e.releaseQty).map(e => event.target.checked ? {...e, isReleased: 1 } : {...e, isReleased: 0 });
    this.setState(
      () => {
        if(onCheckItem) {
          onCheckItem(newItemList);
        }
      }
    );
  }

  @Bind()
  handleChecked(event, record) {
    const { onCheckItem } = this.props;
    if(onCheckItem) {
      onCheckItem([{...record, isReleased: event.target.checked ? 1 : 0}]);
    }
  }

  @Bind()
  handleClickSelectedRows(record) {
    return {
      onClick: () => {
        this.setState({ selectedRows: [record] });
      },
      onDoubleClick: () => {
        this.handleConfirm();
      },
    };
  }

  @Bind()
  handleFetchFeedingRecord() {
    const { onFetchFeedingRecord } = this.props;
    if(onFetchFeedingRecord) {
      onFetchFeedingRecord('SN');
    }
  }

  @Bind()
  handleFeedMaterialItem() {
    const { onFeedMaterialItem } = this.props;
    if(onFeedMaterialItem) {
      onFeedMaterialItem({materialType: 'SN'}).then(res => {
        if(res) {
          this.setState({
            selectedRows: [],
          });
        }
      });
    }
  }

  @Bind()
  handleEnterTitleClick(e) {
    this.handleEnterClick(e, {substituteFlag: 'Y'});
  }

  @Bind()
  handleRenderMaterialName(e) {
    if(e.bomComponentVersion) {
      return `${e.materialCode} - ${e.bomComponentVersion} - ${e.materialName}`;
    } else {
      return `${e.materialCode} - ${e.materialName}`;
    }
  }

  @Bind()
  renderMaterialLotListModal() {
    const {
      form: { getFieldDecorator },
      materialLotList,
      materialLotPagination,
      fetchMaterialLotListLoading,
    } = this.props;
    const { materialLotSelectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys: materialLotSelectedRows.map(e => e.materialLotId),
      type: 'radio', // 单选
      onChange: this.handleChangeSelectRows,
    };
    const columns = [
      {
        title: '物料批编码',
        width: 100,
        dataIndex: 'materialLotCode',
      },
      {
        title: '物料编码',
        width: 100,
        dataIndex: 'materialCode',
      },
      {
        title: '物料名称',
        width: 100,
        dataIndex: 'materialName',
      },
      {
        title: '数量',
        width: 100,
        dataIndex: 'primaryUomQty',
      },
    ];
    return (
      <Fragment>
        <Form>
          <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }} className={styles['operationPlatform_search-form']}>
            <Row style={{ flex: 'auto' }}>
              <Col span={12}>
                <Form.Item
                  label='物料编码'
                  {...formItemLayout}
                >
                  {getFieldDecorator('materialCode')(<Input onPressEnter={this.queryData} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='物料批编码'
                  {...formItemLayout}
                >
                  {getFieldDecorator('materialLotCode')(<Input onPressEnter={this.queryData} />)}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='物料名称'
                  {...formItemLayout}
                >
                  {getFieldDecorator('materialName')(<Input onPressEnter={this.queryData} />)}
                </Form.Item>
              </Col>

            </Row>
            <div className="lov-modal-btn-container">
              <Button onClick={this.formReset} style={{ marginRight: 8 }}>
                {intl.get('hzero.common.button.reset').d('重置')}
              </Button>
              <Button type="primary" onClick={this.queryData}>
                {intl.get('hzero.common.button.search').d('查询')}
              </Button>
            </div>
          </div>
        </Form>
        <Table
          bordered
          loading={fetchMaterialLotListLoading}
          rowKey="materialLotId"
          dataSource={materialLotList}
          columns={columns}
          pagination={materialLotPagination}
          rowSelection={rowSelection}
          onChange={page => this.queryData(page)}
          onRow={this.handleClickSelectedRows}
        />
      </Fragment>
    );
  }

  render() {
    const {
      baseInfo,
      loading,
      itemList = [],
      outOfPlanMaterialList,
      modelName,
      feedingRecordList,
      form: { getFieldDecorator },
      onReturnMaterial,
      returnLoading,
      onClearFeedingRecordList,
      returnMaterialLoading,
      feedMaterialItemLoading,
    } = this.props;
    const { selectedRows, visible } = this.state;
    const bydList = isArray(outOfPlanMaterialList) ? outOfPlanMaterialList.filter(e => e.materialType === 'SN') : [];
    const dataSource = isArray(itemList) ? itemList.concat(bydList) : bydList;
    // const dataSource = [{}, {}, {}];
    const used = isEmpty(itemList) ? 0 : itemList.filter(e => !isNull(e.materialLotCode)).length;
    const titleProps = {
      titleValue: '序列物料',
      used,
      isInput: true,
      itemCode: 'materialLotCode',
      sum: isArray(itemList) ? itemList.length : 0,
      onEnterClick: this.handleEnterTitleClick,
    };
    const returnMaterialModalProps = {
      modelName,
      returnMaterialLoading,
      returnLoading,
      onClearFeedingRecordList,
      disabled: !baseInfo.snNum,
      operationId: baseInfo.operationId,
      onReturnMaterial,
      materialType: 'SN',
      dataSource: feedingRecordList,
      onSearch: this.handleFetchFeedingRecord,
    };
    return (
      <div className={styles['serial-item']}>
        <Spin spinning={loading || false}>
          {['preInstalledPlatform', 'singleOperationPlatform', 'lotOperationPlatform', 'operationPlatform'].includes(modelName) ? (
            <Title {...titleProps} />
          ) : (
            <div className={styles['item-title']}>
              <span style={{ color: '#fff', marginRight: '5px' }}>序列号</span>
              <span style={{ float: 'right' }}>{`${used} / ${isArray(itemList) ? itemList.length : 0}`}</span>
            </div>
          )}
          <div className={styles['serial-item-content']}>
            {!isEmpty(dataSource) && dataSource.map((e = {}, index) => {
              return (
                <div
                  className={
                    // 工位已绑定的批次/时效物料记录和eo工序组件物料匹配，但记录未绑定条码
                    !e.materialLotCode && e.jobMaterialId && e.wkcMatchedFlag === 'Y' ? classNames(styles['martial-content'], styles['material-content-grey'])
                    // 工位已绑定的批次/时效物料记录和eo工序组件物料匹配，但记录已绑定条码
                    : e.materialLotCode && e.jobMaterialId && e.wkcMatchedFlag === 'Y' ? styles['martial-content']
                    // 工位已绑定的批次/时效物料记录和eo工序组件物料不匹配，但记录未绑定条码的
                    : !e.materialLotCode && e.jobMaterialId && (!e.wkcMatchedFlag || e.wkcMatchedFlag === 'N') ? classNames(styles['martial-content'], styles['material-content-red'])
                    // 工位已绑定的批次/时效物料记录和eo工序组件物料不匹配，但记录已绑定
                    : e.materialLotCode && e.jobMaterialId && (!e.wkcMatchedFlag || e.wkcMatchedFlag === 'N') ? classNames(styles['martial-content'], styles['material-content-yellow'])
                    // 绑定 eo 计划外投料 （投料）显示 绿色
                    : e.materialLotCode && e.bydMaterialId ? classNames(styles['martial-content'], styles['material-content-green'])
                    // 没绑定eo 计划外投料 （无投料）显示紫色
                    : !e.materialLotCode && e.bydMaterialId ? classNames(styles['martial-content'], styles['material-content-purple'])
                    : styles['martial-content']
                  }
                  key={e.jobMaterialId}
                >
                  <span className={styles['martial-orderSeq']}>
                    <Checkbox
                      disabled={!e.materialLotCode || e.isIssued === 1}
                      value={selectedRows.map(i => i.jobMaterialId).includes(e.jobMaterialId)}
                      onChange={(event) => this.handleChecked(event, e)}
                    />
                  </span>
                  <div
                    className={styles['martial-center']}
                    // style={{ width: item[quantity] || item[uom] ? '70%' : '90%' }}
                    style={{ width: '70%' }}
                  >
                    <Tooltip placement="right" title={`${this.handleRenderMaterialName(e)} - ${e.primaryUomCode}`}>
                      <div className={styles['martial-name']}>
                        {this.handleRenderMaterialName(e)} - {e.primaryUomCode}
                      </div>
                    </Tooltip>
                    <div className={styles['martial-code']}>
                      {getFieldDecorator(`${e.materialCode}-materialCode-${index}`, {
                        initialValue: e.materialLotCode,
                      })(<Input key={e.jobMaterialId} disabled={e.isIssued === 1} onPressEnter={event => this.handleEnterClick(event.target.value, e, index)} className="serial-material-input" />)}
                    </div>
                  </div>
                  {/* {(item[quantity] || item[uom]) && ( */}
                  <div className={styles['martial-right']}>
                    <div className={styles['martial-quantity']}>{e.releaseQty}</div>
                    <div className={styles['martial-uom']}>{e.primaryUomCode}</div>
                  </div>
                  {/* )} */}
                </div>
              );
            })}
          </div>
          <div className={styles['operationPlatform_out-plan-button']}>
            <Button
              disabled={!(selectedRows.length > 0 && baseInfo.snNum) || baseInfo.siteOutDate || feedMaterialItemLoading}
              type="primary"
              style={{ marginLeft: '10px', marginRight: '8px'}}
              onClick={() => this.handleFeedMaterialItem()}
            >
              投料
            </Button>
            <Checkbox
              disabled={!baseInfo.snNum}
              indeterminate={selectedRows.length > 0 && itemList.filter(e => e.materialLotCode && e.releaseQty !== e.componentQty).length !== selectedRows.length}
              onChange={(e) => this.handleAllChecked(e)}
              checked={selectedRows.length === itemList.filter(e => e.materialLotCode && e.releaseQty !== e.componentQty).length && itemList.filter(e => e.materialLotCode).length !== 0}
            >
              全选
            </Checkbox>
            <ReturnMaterialModal {...returnMaterialModalProps} />
          </div>
          {/* {modelName === 'singleOperationPlatform' && <Button type="dashed" icon="plus" className={styles['operationPlatform_out-plan-button']} onClick={() => this.handleOpenModal()} />} */}
          {modelName === 'firstProcessPlatform' && (
            <Modal
              destroyOnClose
              width={800}
              title='请选择物料批编码'
              visible={visible}
              onCancel={this.handleCloseModal}
              onOk={this.handleConfirm}
            >
              {this.renderMaterialLotListModal()}
            </Modal>
          )}
        </Spin>
      </div>
    );
  }
}
