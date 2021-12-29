/**
 * OperationPlatform - 工序作业平台
 * @date: 2020/02/24 17:15:27
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2018, Hand
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Spin, Button, Checkbox, Modal, Form, Input, Tooltip } from 'hzero-ui';
import moment from 'moment';
import { isArray, isEmpty } from 'lodash';
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
    };
  }

  @Bind()
  handleEnterClick(code) {
    const { onEnterClick } = this.props;
    if (onEnterClick) {
      onEnterClick(code);
    }
  }

  componentDidUpdate() {
    if(this.props.isUpdateTimeItem) {
      this.handleInitSelectedRows(this.props);
      this.props.onChangeIsUpdateTimeItem();
    }
  }

  @Bind()
  handleInitSelectedRows(props) {
    const { itemList = [], outOfPlanMaterialList = []} = props;
    const bydList = isArray(outOfPlanMaterialList) ? outOfPlanMaterialList.filter(e => e.materialType === 'LOT') : [];
    const dataSource = isArray(itemList) ? itemList.concat(bydList) : bydList;
    const selectedRows = dataSource.filter(e => e.isReleased === 1 && e.componentQty !== e.releaseQty);
    this.setState({
      selectedRows,
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
    if(onCheckItem) {
      onCheckItem([{...record, isReleased: event.target.checked ? 1 : 0}]);
    }
  }

  @Bind()
  handleFeedMaterialItem() {
    const { onFeedMaterialItem } = this.props;
    if(onFeedMaterialItem) {
      onFeedMaterialItem({materialType: 'TIME'}).then(res => {
        if(res) {
          this.setState({
            selectedRows: [],
          });
        }
      });;
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
      onFetchFeedingRecord('TIME');
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

  render() {
    const {
      workOrderInfo = {},
      baseInfo = {},
      itemList = [],
      loading,
      outOfPlanMaterialList = [],
      form: { getFieldDecorator },
      onReturnMaterial,
      feedingRecordList,
      returnLoading,
      onClearFeedingRecordList,
      returnMaterialLoading,
      feedMaterialItemLoading,
      modelName,
    } = this.props;
    const { visible } = this.state;
    const bydList = isArray(outOfPlanMaterialList) ? outOfPlanMaterialList.filter(e => e.materialType === 'TIME') : [];
    const dataSource = isArray(itemList) ? itemList.concat(bydList) : bydList;
    const newItemList = dataSource.map(e => {
      const timePeriod = moment.duration(moment(e.changeDate) - moment(e.enableDate)).minutes();
      return {
        ...e,
        timePeriod,
      };
    });
    const { selectedRows } = this.state;
    const used = isEmpty(itemList) ? 0 : itemList.filter(e => e.materialLotCode).length;
    const titleProps = {
      titleValue: '时效物料',
      used,
      isInput: true,
      itemCode: 'materialLotCode',
      sum: isArray(itemList) ? itemList.length : 0,
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
      returnLoading,
      modelName,
      returnMaterialLoading,
      onClearFeedingRecordList,
      prepareQty: workOrderInfo.prepareQty,
      operationId: baseInfo.operationId,
      disabled: !baseInfo.snNum,
      onReturnMaterial,
      materialType: 'TIME',
      dataSource: feedingRecordList,
      onSearch: this.handleFetchFeedingRecord,
    };
    return (
      <div className={styles['aging-item']}>
        <Spin spinning={loading || false}>
          <Title
            {...titleProps}
            onEnterClick={this.handleEnterClick}
          />
          <div className={styles['aging-item-content']}>
            {newItemList.map((e) => (
              <div
                key={e.jobMaterialId}
                className={
                  // 工位已绑定的批次/时效物料记录和eo工序组件物料匹配，但记录未绑定条码 灰色
                  !e.materialLotCode && e.jobMaterialId && e.wkcMatchedFlag === 'Y' ? classNames(styles['martial-content'], styles['material-content-grey'], styles['operationPlatform_time-material-content'])
                  // 工位已绑定的批次/时效物料记录和eo工序组件物料匹配，但记录已绑定条码 蓝色
                  : e.materialLotCode && e.jobMaterialId && e.wkcMatchedFlag === 'Y' ? classNames(styles['martial-content'], styles['operationPlatform_time-material-content'])
                  // 工位已绑定的批次/时效物料记录和eo工序组件物料不匹配，但记录未绑定条码的 红色
                  : !e.materialLotCode && e.jobMaterialId && (!e.wkcMatchedFlag || e.wkcMatchedFlag === 'N') ? classNames(styles['martial-content'], styles['material-content-red'], styles['operationPlatform_time-material-content'])
                  // 工位已绑定的批次/时效物料记录和eo工序组件物料不匹配，但记录已绑定 黄色
                  : e.materialLotCode && e.jobMaterialId && (!e.wkcMatchedFlag || e.wkcMatchedFlag === 'N') ? classNames(styles['martial-content'], styles['material-content-yellow'], styles['operationPlatform_time-material-content'])
                  // 绑定 eo 计划外投料 （投料）显示 绿色
                  : e.materialLotCode && e.bydMaterialId ? classNames(styles['martial-content'], styles['material-content-green'], styles['operationPlatform_time-material-content'])
                  // 没绑定eo 计划外投料 （无投料）显示紫色
                  : !e.materialLotCode && e.bydMaterialId ? classNames(styles['martial-content'], styles['material-content-purple'], styles['operationPlatform_time-material-content'])
                  : classNames(styles['martial-content'], styles['operationPlatform_time-material-content'])
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
                  style={{width: '60%'}}
                  onClick={() => this.handleOpenModal(e)}
                >
                  <Tooltip placement="right" title={`${this.handleRenderMaterialName(e)} - ${e.primaryUomCode}`}>
                    <div className={styles['martial-name']}>
                      {this.handleRenderMaterialName(e)} - {e.primaryUomCode}
                    </div>
                  </Tooltip>
                  <Tooltip placement="right" title={e.materialLotCode}>
                    <div className={styles['martial-code']}>
                      {e.materialLotCode ? `${e.materialLotCode}-${e.remainQty || 0}` : null}
                    </div>
                  </Tooltip>
                </div>
                <div className={styles['martial-right']}>
                  <div className={styles['martial-quantity']}>{e.releaseQty || 0}/{e.componentQty}</div>
                  <div className={styles['martial-uom']}>
                    <Tooltip placement="right" title={e.timing}>
                      <div className={styles['martial-code']}>
                        {e.timing}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
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
      </div>
    );
  }
}
