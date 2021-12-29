/*
 * @Description: 扫描条码模态框
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-01 13:58:51
 */

import React, { PureComponent } from 'react';
import { Form, Tooltip, Modal, Row, Col, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isFunction } from 'lodash';
import styles from './index.less';
import ChipContainerMap from '@/components/ChipContainerMapBad';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create({ fieldNameProp: null })
export default class CosLocationModal extends PureComponent {
  constructor(props) {
    super(props);
    if (isFunction(props.onRef)) {
      props.onRef(this);
    }
  }

  /**
   * 查询
   */
  @Bind()
  handleSearch(fields = {}) {
    const { onSearch, form } = this.props;
    const fieldValues = form.getFieldsValue();
    if (onSearch) {
      form.validateFields(err => {
        if (!err) {
          // 如果验证成功,则执行onSearch
          onSearch({ ...fieldValues, page: fields });
        }
      });
    }
  }

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
  }

  @Bind()
  onCancel() {
    const { onCancel } = this.props;
    onCancel(false, { materialLotCode: false });
  }

  // 扫描条码
  @Bind()
  enterBarCode(e, scanMaterialLotCode) {
    const { enterBarCode } = this.props;
    if (e.keyCode === 13) {
      enterBarCode(scanMaterialLotCode);
    }
  }

  @Bind()
  onOk() {
    const { handleCosLoacationSave } = this.props;
    handleCosLoacationSave();
  }

  @Bind()
  clickPosition(dataSource) {
    const { clickPositions } = this.props;
    const customizelocation = this.chipContainerMapchild && this.chipContainerMapchild.state.customizelocation;
    clickPositions(dataSource, customizelocation);
  }

  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      visible,
      form,
      // handleEdit,
      // handleCleanLine,
      scanningType,
      saveHeadBarCodeLoading,
      saveLineBarCodeLoading,
      customizelocation,
      handleFetchCosInfoLoading,
      cosInfo,
      dataSource,
      customizelocationModal,
    } = this.props;
    const chipContainerMapProps = {
      customizelocation,
      dataSource,
      onRef: node => {
        this.chipContainerMapchild = node;
      },
    };
    const { getFieldDecorator } = form;
    const {
      loadLocationList = [],
      locationRow,
      locationColumn,
    } = cosInfo;
    return (
      <Modal
        destroyOnClose
        title='芯片装载记录'
        visible={visible}
        onOk={() => this.onOk()}
        onCancel={() => this.onCancel(false)}
        okText={intl.get('hzero.common.button.save').d('保存')}
        cancelText='关闭'
        width={900}
        confirmLoading={scanningType === 'HEAD' ? saveHeadBarCodeLoading : saveLineBarCodeLoading}
      >
        <Spin spinning={handleFetchCosInfoLoading}>
          <Row className={styles['cos-location-modal']}>
            <Col span={7}>
              <Form style={{ marginBottom: 16 }}>
                <Form.Item {...formLayout} label='来料条码'>
                  {getFieldDecorator('materialLotCode', {
                  })(
                    <Tooltip title={cosInfo.materialLotCode}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cosInfo.materialLotCode}
                      </div>
                    </Tooltip>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='物料编码'>
                  {getFieldDecorator('materialCode', {
                  })(
                    <Tooltip title={cosInfo.materialCode}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cosInfo.materialCode}
                      </div>
                    </Tooltip>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='物料描述'>
                  {getFieldDecorator('materialName', {
                  })(
                    <Tooltip title={cosInfo.materialName}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cosInfo.materialName}
                      </div>
                    </Tooltip>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='盒内总数'>
                  {getFieldDecorator('materialLotCode', {
                  })(
                    <span>{cosInfo.totalQty}</span>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='芯片类型'>
                  {getFieldDecorator('cosType', {
                  })(
                    <span>{cosInfo.cosType}</span>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='备注'>
                  {getFieldDecorator('materialLotCode', {
                  })(
                    <Tooltip title={cosInfo.remark}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cosInfo.remark}
                      </div>
                    </Tooltip>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='良品数'>
                  {getFieldDecorator('primaryUomQty', {
                  })(
                    <span>{cosInfo.primaryUomQty}</span>
                  )}
                </Form.Item>
              </Form>
            </Col>
            <Col span={10}>
              <ChipContainerMap
                formFlag={false}
                clickPosition={this.clickPosition}
                popconfirm={false}
                dataSources={loadLocationList}
                locationRow={locationRow}
                locationColumn={locationColumn}
                scrollbarsHeight="330px"
                multiple
                {...chipContainerMapProps}
              />
            </Col>
            <Col span={6} style={{ marginLeft: '10px' }}>
              <Form>
                <Form.Item {...formLayout} label='位置'>
                  {getFieldDecorator('location', {
                  })(
                    <span>{customizelocationModal}</span>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='芯片容量'>
                  {getFieldDecorator('cosRL', {
                  })(
                    <span>1</span>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='芯片序列'>
                  {getFieldDecorator('chipSequence', {
                  })(
                    <Tooltip title={dataSource.length > 0 && `${dataSource.map(ele => ele.chipSequence)}`}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {dataSource.length > 0 && `${dataSource.map(ele => ele.chipSequence)}`}
                      </div>
                    </Tooltip>
                  )}
                </Form.Item>
                <Form.Item {...formLayout} label='热沉ID'>
                  {getFieldDecorator('hotSinkCode', {
                  })(
                    <Tooltip title={dataSource.length > 0 && `${dataSource.map(ele => ele.hotSinkCode)}`}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {dataSource.length > 0 && `${dataSource.map(ele => ele.hotSinkCode)}`}
                      </div>
                    </Tooltip>
                  )}
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Spin>
      </Modal>
    );
  }
}
