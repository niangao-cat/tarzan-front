/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Spin, Tooltip, Button, Checkbox, Form, Input, Modal, Table } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isArray, isEmpty, isNull } from 'lodash';
import classNames from 'classnames';

import Title from './Title';
import styles from './index.less';
import ReturnMaterialModal from './ReturnMaterialModal';

@Form.create({ fieldNameProp: null })
export default class Batch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      visible: false,
      virtualVisible: false,
      virtualNumSelectedRows: [],
    };
  }

  @Bind()
  handleEnterClick(code) {
    const { onEnterClick } = this.props;
    if (onEnterClick) {
      onEnterClick(code);
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.isUpdateLotItem) {
      this.handleInitSelectedRows(this.props);
      this.props.onChangeIsUpdateLotItem();
    }
    if(!isEmpty(this.props.virtualNumList) && isEmpty(prevProps.virtualNumList)) {
      this.handleUpdateSelectedRows([this.props.virtualNumList[0]]);
    }
  }

  @Bind()
  handleUpdateSelectedRows(arr) {
    this.setState({
      virtualNumSelectedRows: arr,
    });
  }

  @Bind()
  handleInitSelectedRows(props) {
    const { itemList = [], outOfPlanMaterialList = []} = props;
    const bydList = isArray(outOfPlanMaterialList) ? outOfPlanMaterialList.filter(e => e.materialType === 'LOT') : [];
    const dataSource = isArray(itemList) ? itemList.concat(bydList) : bydList;
    this.setState({
      selectedRows: dataSource.filter(e => e.isReleased === 1 && e.componentQty !== e.releaseQty),
    });
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
    if(onCheckItem && record.componentQty !== record.releaseQty) {
      onCheckItem([{...record, isReleased: event.target.checked ? 1 : 0}]);
    }
  }

  @Bind()
  handleFeedMaterialItem() {
    const { onFeedMaterialItem, modelName, onFetchVirtualList } = this.props;
    const { selectedRows } = this.state;
    const virtualNumList = selectedRows.filter(e => e.cosMaterialLotFlag === 'Y');
    if(onFeedMaterialItem && !['firstProcessPlatform'].includes(modelName) || (virtualNumList.length === 0 && ['firstProcessPlatform'].includes(modelName)) ) {
      onFeedMaterialItem({materialType: 'LOT'}).then(res => {
        if(res) {
          this.setState({
            selectedRows: [],
          });
        }
      });
    } else {
      const materialLotCodeList = virtualNumList.map(e => e.materialLotCode);
      onFetchVirtualList(materialLotCodeList).then(res => {
        if(res) {
          this.setState({ virtualVisible: true });
          // Modal.confirm({
          //   title: '确认COS芯片虚拟号',
          //   content: this.renderVirtualModal(),
          //   width: 800,
          //   onOk: this.handleConfirmVirtualFeedMaterial,
          // });
        }
      });
    }
  }

  @Bind()
  handleOpenModal(record) {
    if(record.materialLotCode && record.releaseQtyChangeFlag === 'Y') {
      this.setState({ visible: true, selectedRecord: record });
    }
  }

  @Bind()
  handleCloseModal() {
    this.setState({ visible: false, selectedRecord: {} });
  }

  @Bind()
  handleUpdateReleaseQty(e) {
    const { onUpdateReleaseQty } = this.props;
    const { selectedRecord } = this.state;
    if(onUpdateReleaseQty) {
      onUpdateReleaseQty({...selectedRecord, releaseQty: e.target.value}).then(res => {
        if(res) {
          this.handleCloseModal();
        }
      });
    }
  }

  @Bind()
  handleFetchFeedingRecord() {
    const { onFetchFeedingRecord } = this.props;
    if(onFetchFeedingRecord) {
      onFetchFeedingRecord('LOT');
    }
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
  handleChangeSelectRows(selectedRowKeys, selectedRows) {
    this.setState({ virtualNumSelectedRows: selectedRows });
  }

  @Bind()
  handleConfirmVirtualFeedMaterial() {
    const { onFeedMaterialItem } = this.props;
    const { virtualNumSelectedRows, selectedRows } = this.state;
    const virtualNumList = selectedRows.filter(e => e.cosMaterialLotFlag === 'Y');
    const virtualIdList = virtualNumSelectedRows.map(e => e.virtualId);
    if(onFeedMaterialItem && virtualIdList.length !== 0) {
      // 选择虚拟号以后进行投料，蛟哥说cosMaterialLotFlag === 'Y‘ 只会有一条物料
      onFeedMaterialItem({materialType: 'LOT', virtualIdList, materialId: virtualNumList[0].materialId }).then(res => {
        if(res) {
          this.setState({
            selectedRows: [],
            virtualNumSelectedRows: [],
          });
          this.handleCloseVirtualModal();
        }
      });
    }
  }

  @Bind()
  handleCloseVirtualModal() {
    this.setState({ virtualVisible: false });
  }

  @Bind()
  renderVirtualModal() {
    const {
      virtualNumList,
      fetchVirtualNumListLoading,
    } = this.props;
    const { virtualNumSelectedRows } = this.state;
    const rowSelection = {
      selectedRowKeys: virtualNumSelectedRows.map(e => e.virtualId),
      type: 'radio', // 单选
      onChange: this.handleChangeSelectRows,
      getCheckboxProps: record => ({
        disabled: record.enableFlag !== 'Y',
      }),
    };
    const columns = [
      {
        title: '虚拟号',
        width: 150,
        dataIndex: 'virtualNum',
      },
      {
        title: '芯片位置',
        width: 100,
        dataIndex: 'chipLocation',
      },
      {
        title: '数量',
        width: 100,
        dataIndex: 'quantity',
      },
      {
        title: '产品类型',
        width: 100,
        dataIndex: 'productCodeMeaning',
      },
      {
        title: '绑定工单',
        width: 100,
        dataIndex: 'workOrderNum',
      },
      {
        title: '已投料SN',
        width: 100,
        dataIndex: 'eoIdentification',
      },
      {
        title: '有效性',
        width: 100,
        dataIndex: 'enableFlagMeaning',
      },
    ];
    return (
      <Table
        bordered
        loading={fetchVirtualNumListLoading}
        rowKey="virtualId"
        dataSource={virtualNumList}
        columns={columns}
        pagination={false}
        rowSelection={rowSelection}
      />
    );
  }

  render() {
    const {
      workOrderInfo = {},
      baseInfo = {},
      itemList = [],
      loading,
      outOfPlanMaterialList,
      form: { getFieldDecorator },
      onReturnMaterial,
      feedingRecordList,
      returnLoading,
      onClearFeedingRecordList,
      returnMaterialLoading,
      feedMaterialItemLoading,
      modelName,
    } = this.props;
    const { selectedRows, visible, virtualVisible } = this.state;
    const bydList = isArray(outOfPlanMaterialList) ? outOfPlanMaterialList.filter(e => e.materialType === 'LOT') : [];
    const dataSource = isArray(itemList) ? itemList.concat(bydList) : bydList;
    const used = isEmpty(itemList) ? 0 : itemList.filter(e => !isNull(e.materialLotCode)).length;
    const titleProps = {
      titleValue: '批次物料',
      used,
      isInput: true,
      sum: isArray(itemList) ? itemList.length : 0,
      itemCode: 'materialLotCode',
    };
    const DRAWER_FORM_ITEM_LAYOUT_MAX = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const returnMaterialModalProps = {
      modelName,
      returnMaterialLoading,
      returnLoading,
      onClearFeedingRecordList,
      prepareQty: workOrderInfo.prepareQty,
      operationId: baseInfo.operationId,
      onReturnMaterial,
      disabled: !baseInfo.snNum,
      materialType: 'LOT',
      dataSource: feedingRecordList,
      onSearch: this.handleFetchFeedingRecord,
    };
    return (
      <div className={styles['batch-item']}>
        <Spin spinning={loading || false}>
          <Title
            {...titleProps}
            isInput
            disabled={modelName==="singleOperationPlatform"?false:!baseInfo.snNum} // updateBy:ywj custom:bl
            itemCode="materialLotCode"
            onEnterClick={this.handleEnterClick}
          />
          <div className={styles['batch-item-content']}>
            {!isEmpty(dataSource) && dataSource.map((e) => {
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
                >
                  <span className={styles['martial-orderSeq']}>
                    <Checkbox
                      disabled={!e.materialLotCode || e.releaseQty === e.componentQty}
                      value={selectedRows.map(i => i.jobMaterialId).includes(e.jobMaterialId)}
                      onChange={(event) => this.handleChecked(event, e)}
                    />
                  </span>
                  <div
                    className={styles['martial-center']}
                    style={{width: '70%'}}
                    onClick={() => this.handleOpenModal(e)}
                  >
                    <Tooltip placement="right" title={`${this.handleRenderMaterialName(e)} - ${e.primaryUomCode}`}>
                      <div className={styles['martial-name']}>
                        {this.handleRenderMaterialName(e)} - {e.primaryUomCode}
                      </div>
                    </Tooltip>
                    <Tooltip placement="right" title={`${e.materialLotCode} - ${e.remainQty}`}>
                      <div className={styles['martial-code']}>
                        {e.materialLotCode ? `${e.materialLotCode}-${e.remainQty || 0}` : null}
                      </div>
                    </Tooltip>
                  </div>
                  <div className={styles['martial-right']}>
                    <div className={styles['martial-quantity']}>{e.releaseQty || 0}/{e.componentQty}</div>
                    <div className={styles['martial-uom']}>{e.uomCode}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={styles['operationPlatform_out-plan-button']}>
            <Button
              disabled={!(selectedRows.length > 0 && baseInfo.snNum) || baseInfo.siteOutDate|| feedMaterialItemLoading}
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
        </Spin>
        <Modal
          destroyOnClose
          width={400}
          title='条码投料量'
          visible={visible}
          footer={null}
          onCancel={this.handleCloseModal}
          onOk={this.handleSave}
        >
          <Form>
            <Form.Item
              label="条码投料量"
              {...DRAWER_FORM_ITEM_LAYOUT_MAX}
            >
              {getFieldDecorator('workcellCode', {
                })(<Input onPressEnter={this.handleUpdateReleaseQty} className="work-cell-code-input" />)}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          destroyOnClose
          width={600}
          title='确认COS芯片虚拟号'
          visible={virtualVisible}
          onCancel={this.handleCloseVirtualModal}
          onOk={this.handleConfirmVirtualFeedMaterial}
        >
          {this.renderVirtualModal()}
        </Modal>

      </div>
    );
  }
}
