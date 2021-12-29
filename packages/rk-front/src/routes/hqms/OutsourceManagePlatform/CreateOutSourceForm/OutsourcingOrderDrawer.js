/*
 * @Description: 外协采购订单创建
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 */

import React, { Component } from 'react';
import { Modal, Form, Spin } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { getCurrentOrganizationId } from 'utils/utils';
import EditTable from 'components/EditTable';
import notification from 'utils/notification';
import intl from 'utils/intl';
import Lov from 'components/Lov';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import OutsourcingForm from './OutsourcingForm';

@connect(({ outsourceManagePlatform }) => ({
  tenantId: getCurrentOrganizationId(),
  outsourceManagePlatform,
}))
@Form.create({ fieldNameProp: null })
export default class DetailDrawer extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
    };
  }

  componentDidMount() {}

  // 查询方法
  @Bind
  handleCompleteData = values => {
    const {
      dispatch,
      closeAndReturnFlag,
      outsourceManagePlatform: { createReturnHead = {}, createReturnList = [] },
    } = this.props;
    this.setState({ expandForm: !this.state.expandForm });
    // 创建
    createReturnHead.remark = values.remark;
    createReturnHead.earilyDemandTime =
      values.earilyDemandTime == null
        ? null
        : moment(values.earilyDemandTime).format(DEFAULT_DATETIME_FORMAT);
    dispatch({
      type: 'outsourceManagePlatform/createOutReturnSourceData',
      payload: {
        qmsInvoiceHeadReturnDTO: createReturnHead,
        lineVOList: createReturnList,
      },
    }).then(res => {
      if (res) {
        notification.success({ message: '创建成功！' });
        // 关闭接口
        closeAndReturnFlag();
      } else {
        notification.error({ message: res.message });
      }
      this.setState({ expandForm: !this.state.expandForm });
    });
  };

  // 更改 行信息
  @Bind()
  changeDeliveryWarehouseCode(record, index){
    const {
      dispatch,
      outsourceManagePlatform: {
        createReturnList = [],
      },
    } = this.props;

    createReturnList[index].deliveryWarehouseId = record.locatorId;
    createReturnList[index].deliveryWarehouseCode = record.warehouse;
    // 根据更改的货位查询现有量
    dispatch({
      type: 'outsourceManagePlatform/queryHavingQty',
      payload: {
        ...createReturnList[index],
      }
      ,
    }).then(res=>{
      if(res){
        createReturnList[index].inventoryQuantity = res.inventoryQuantity;
        // 默认查询头信息
        dispatch({
          type: 'outsourceManagePlatform/updateState',
          payload: {
            createReturnList,
          }
          ,
        });
      }else{
        // 默认查询头信息
        dispatch({
          type: 'outsourceManagePlatform/updateState',
          payload: {
            createReturnList,
          }
          ,
        });
      }
    });
  }

  /**
   *  页面渲染
   * @returns {*}
   */
  render() {
    const {
      visible,
      closeReturnFlag,
      queryCreateReturnLoading,
      createReturnLoading,
      createReturnHead,
      createReturnList,
    } = this.props;

    const searchProps = {
      handleCompleteData: this.handleCompleteData,
      outSourceHeadData: createReturnHead,
      createReturnList,
      completeLoading: queryCreateReturnLoading||createReturnLoading,
    };
    const columns = [
      {
        title: '行号',
        dataIndex: 'lineNum',
        width: 100,
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 150,
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 150,
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 150,
      },
      {
        title: '制单数量',
        dataIndex: `quantity`,
        width: 80,
      },
      {
        title: '实际制单数量',
        dataIndex: `quantity`,
        width: 100,
      },
      {
        title: '单位',
        width: 150,
        dataIndex: 'uomCode',
      },
      {
        title: '发出仓库',
        width: 150,
        dataIndex: 'deliveryWarehouseCode',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`deliveryWarehouseId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`siteCode`).d('发出仓库'),
                    }),
                  },
                ],
                initialValue: record.deliveryWarehouseId,
              })(
                <Lov
                  code="MT.WARE.HOUSE"
                  textValue={record.deliveryWarehouseCode}
                  onChange={(_, records) => this.changeDeliveryWarehouseCode(records, index)}
                  queryParams={{ tenantId: getCurrentOrganizationId() }}
                  textField="warehouse"
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '库存数量',
        width: 100,
        dataIndex: 'inventoryQuantity',
      },
    ];

    return (
      <Spin spinning={this.state.expandForm}>
        <Modal
          destroyOnClose
          width={1200}
          visible={visible}
          onCancel={closeReturnFlag}
          footer={null}
        >
          <OutsourcingForm {...searchProps} />
          <EditTable dataSource={createReturnList} columns={columns} pagination={false} bordered />
        </Modal>
      </Spin>
    );
  }
}
