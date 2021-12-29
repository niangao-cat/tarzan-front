/**
 * WorkCellDist - 工作单元明细编辑
 * @date: 2019-12-16
 * @author: xubitig <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */

import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { Modal, Form, Input, Select, Button, Spin, Table, Tooltip } from 'hzero-ui';
import intl from 'utils/intl';

import Lov from 'components/Lov';
import { MODAL_FORM_ITEM_LAYOUT } from 'utils/constants';
import { Header } from 'components/Page';


@Form.create({ fieldNameProp: null })
export default class AttributeDrawer extends PureComponent {
  constructor(props) {
    super(props);
    if (props.onRef) {
      props.onRef(this);
    }
    this.state = {
      materialTextValue: '',
    };
  }

  @Bind()
  handleSearch(event) {
    const { onFetchMaterialInfo, form } = this.props;
    if (onFetchMaterialInfo) {
      onFetchMaterialInfo(event.target.value).then(res => {
        if (res) {
          form.setFieldsValue({
            materialId: res.materialId,
            materialName: res.materialName,
            materialCode: res.materialCode,
            itemType: res.itemType,
          });
          this.setState({materialTextValue: res.materialCode});
        }
      });
    }
  }

  render() {
    const { visible = false, tenantId, onCancel, form: { getFieldDecorator, setFieldsValue }, flagList, statusList, onSave, siteInfo, fetchMaterialInfoLoading, loading, fetchBomLoading, bomDatas } = this.props;
    const columns = [
      {
        title: '物料编码',
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: '物料描述',
        width: 140,
        dataIndex: 'materialName',
        render: (val, record) => (
          <Tooltip title={record.materialName}>
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {record.materialName}
            </div>
          </Tooltip>
        ),
      },
      {
        title: '数量',
        width: 70,
        dataIndex: 'usageQty',
      },
      {
        title: '单位',
        width: 70,
        dataIndex: 'uomName',
      },
      {
        title: '物料组',
        width: 100,
        dataIndex: 'itemGroup',
      },
      {
        title: '物料组描述',
        width: 120,
        dataIndex: 'itemGroupDescription',
      },
    ];

    return (
      <Modal
        destroyOnClose
        width={700}
        title='明细'
        visible={visible}
        onCancel={onCancel}
        footer={(
          <Fragment>
            <Button
              style={{ marginRight: '12px' }}
              onClick={() => onCancel()}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => onSave()}
            >
              确定
            </Button>
          </Fragment>
        )}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        placement="right"
        maskClosable
      >
        <Spin spinning={fetchMaterialInfoLoading || loading || fetchBomLoading || false}>
          <Form>
            <Form.Item
              {...MODAL_FORM_ITEM_LAYOUT}
              label='组件SN'
            >
              {getFieldDecorator('materialLotCode', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '组件SN',
                    }),
                  },
                ],
              })(
                <Input onPressEnter={e => this.handleSearch(e)} />
              )}
            </Form.Item>
            <Form.Item
              {...MODAL_FORM_ITEM_LAYOUT}
              label='组件物料'
            >
              {getFieldDecorator('materialId', {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '组件物料',
                    }),
                  },
                ],
              })(
                <Lov
                  code="HME.SITE_MATERIAL"
                  textValue={this.state.materialTextValue}
                  queryParams={{ tenantId, siteId: siteInfo.siteId }}
                  onChange={(val, data) => {
                    setFieldsValue({
                      materialName: data.materialName,
                      materialCode: data.materialCode,
                      itemType: data.itemType,
                    });
                  }}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'none' }}>
              {getFieldDecorator('materialCode', {
              })(<span />)}
            </Form.Item>
            <Form.Item
              {...MODAL_FORM_ITEM_LAYOUT}
              label='组件描述'
            >
              {getFieldDecorator('materialName')(
                <Input disabled />
              )}
            </Form.Item>
            {/* <Form.Item */}
            {/*   {...MODAL_FORM_ITEM_LAYOUT} */}
            {/*   label='维修产线' */}
            {/* > */}
            {/*   {getFieldDecorator('productionLineId', { */}
            {/*     rules: [ */}
            {/*       { */}
            {/*         required: true, */}
            {/*         message: intl.get('hzero.common.validation.notNull', { */}
            {/*           name: '维修产线', */}
            {/*         }), */}
            {/*       }, */}
            {/*     ], */}
            {/*   })( */}
            {/*     <Lov */}
            {/*       code="HME.ACCESS_PROD_LINE" */}
            {/*       queryParams={{ tenantId, siteId: siteInfo.siteId }} */}
            {/*     /> */}
            {/*   )} */}
            {/* </Form.Item> */}
            <Form.Item
              {...MODAL_FORM_ITEM_LAYOUT}
              label='组件类型'
            >
              {getFieldDecorator('itemType')(
                <Input disabled />
              )}
            </Form.Item>
            <Form.Item
              {...MODAL_FORM_ITEM_LAYOUT}
              label='是否维修'
            >
              {getFieldDecorator('isRepair', {
                initialValue: 'Y',
              })(
                <Select>
                  {flagList.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              {...MODAL_FORM_ITEM_LAYOUT}
              label='是否库存管理'
            >
              {getFieldDecorator('isOnhand', {
                initialValue: 'Y',
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '组件编码',
                    }),
                  },
                ],
              })(
                <Select allowClear>
                  {flagList.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            <Form.Item
              {...MODAL_FORM_ITEM_LAYOUT}
              label='状态'
            >
              {getFieldDecorator('splitStatus', {
                initialValue: 'WAIT_SPLIT',
              })(
                <Select allowClear disabled>
                  {statusList.map(e => (
                    <Select.Option key={e.value} value={e.value}>
                      {e.meaning}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Form>
          <Header
            title="组件半成品信息"
          >
            {bomDatas.bomName}-{bomDatas.revision}-{bomDatas.description}
          </Header>
          <Table
            bordered
            dataSource={bomDatas.lineList}
            columns={columns}
            // pagination={pagination}
            // scroll={{ x: tableScrollWidth(columns, 50) }}
            // onChange={page => onSearch(page)}
            loading={loading}
            rowKey="materialId2"
          />
        </Spin>
      </Modal>
    );
  }
}
