
import React, { Component, Fragment } from 'react';
import { Form, Button, Row, Col, Select, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import { connect } from 'dva';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import { pullAllBy } from 'lodash';
import { tableScrollWidth, getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import EnterSite from '@/components/EnterSite';

@connect(({ cosOverdueInventoryRetest, loading }) => ({
  cosOverdueInventoryRetest,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['cosOverdueInventoryRetest/getSiteList'],
  handleCheckBarCodeLoading: loading.effects['cosOverdueInventoryRetest/handleCheckBarCode'],
  handleConfirmPutLoading: loading.effects['cosOverdueInventoryRetest/handleConfirmPut'],
}))
@Form.create({ fieldNameProp: null })
export default class CosOverdueInventoryRetest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enterSiteVisible: true,
      enterSiteLoading: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
    } = this.props;
    dispatch({
      type: 'cosOverdueInventoryRetest/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'cosOverdueInventoryRetest/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  /**
   * @description: 输入工位
   * @param {Object} values 工位编码
   */
  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      cosOverdueInventoryRetest: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosOverdueInventoryRetest/enterSite',
      payload: {
        ...val,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      this.setState({ enterSiteLoading: false });
      if (res) {
        if (res.operationIdList.length > 1) {
          notification.error({ message: `当前${res.workcellName}存在多个工艺，请重新扫描！` });
        } else {
          this.setState({ enterSiteVisible: false });
        }
      }
    });
  }

  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow });
  }

  @Bind()
  onEnterDownCode(e) {
    const { form } = this.props;
    if (e.keyCode === 13) {
      form.validateFields((err, values) => {
        if (!err) {
          this.handleCheckBarCode(values.sourceMaterialLotCode);
        }
      });
    }
  }

  // 校验来源条码
  @Bind()
  handleCheckBarCode(val) {
    const {
      dispatch,
      cosOverdueInventoryRetest: {
        barCodeList = [],
        workcellInfo = {},
      },
      form,
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'cosOverdueInventoryRetest/handleCheckBarCode',
          payload: {
            materialLotCode: val,
            workOrderId: values.workOrderId,
            materialId: values.materialId,
            workcellId: workcellInfo.workcellId,
          },
        }).then(res => {
          if (res) {
            form.setFieldsValue({ sourceMaterialLotCode: null });
            dispatch({
              type: 'cosOverdueInventoryRetest/updateState',
              payload: {
                barCodeList: [
                  {
                    ...res,
                    materialLotCode: val,
                    _status: 'update',
                  },
                  ...barCodeList,
                ],
              },
            });
          }
        });
      }
    });

  }

  // 删除数据
  @Bind()
  handleDelete() {
    const {
      dispatch,
      cosOverdueInventoryRetest: {
        barCodeList = [],
      },
    } = this.props;
    const { selectedRow } = this.state;
    dispatch({
      type: 'cosOverdueInventoryRetest/updateState',
      payload: {
        barCodeList: pullAllBy(barCodeList, selectedRow, 'materialLotCode'),
      },
    });
    this.setState({ selectedRow: [], selectedRowKeys: [] });
  }

  // 确认投料
  @Bind()
  handleConfirmPut() {
    const {
      dispatch,
      cosOverdueInventoryRetest: {
        barCodeList = [],
        workcellInfo = {},
      },
      form,
    } = this.props;
    const params = getEditTableData(barCodeList);
    form.validateFields((err, values) => {
      if (!err && params.length > 0) {
        dispatch({
          type: 'cosOverdueInventoryRetest/handleConfirmPut',
          payload: {
            operationId: workcellInfo.operationId,
            workcellId: workcellInfo.workcellId,
            workOrderId: values.workOrderId,
            scanBarcodeList: params,
            wkcShiftId: workcellInfo.wkcShiftId,
          },
        }).then(res => {
          if (res) {
            notification.success();
            form.setFieldsValue({
              workOrderId: null,
              materialId: null,
              cosType: null,
            });
            dispatch({
              type: 'cosOverdueInventoryRetest/updateState',
              payload: {
                barCodeList: [],
              },
            });
          }
        });
      }
    });
  }

  render() {
    const {
      cosOverdueInventoryRetest: {
        workcellInfo = {},
        lovData = {},
        barCodeList = [],
      },
      form: { getFieldDecorator, getFieldValue, setFieldsValue },
      tenantId,
      getSiteListLoading,
      handleCheckBarCodeLoading,
      handleConfirmPutLoading,
    } = this.props;
    const { cosType = [] } = lovData;
    const {
      enterSiteLoading,
      enterSiteVisible,
      selectedRowKeys,
    } = this.state;
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hhme/cos-overdue-inventory-retest',
      enterSite: this.enterSite,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 70,
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 150,
        align: 'center',
      },
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 120,
        align: 'center',
      },
      // {
      //   title: 'WAFER',
      //   dataIndex: 'waferNum',
      //   width: 120,
      //   align: 'center',
      //   render: (val, record) =>
      //     ['update', 'create'].includes(record._status) ? (
      //       <Form.Item>
      //         {record.$form.getFieldDecorator(`waferNum`, {
      //           rules: [
      //             {
      //               required: true,
      //               message: 'WAFER不能为空',
      //             },
      //             {
      //               validator: (rule, value, callback) => {
      //                 if (getFieldValue('waferNum') && `${getFieldValue('waferNum')}`.length > 15) {
      //                   callback(
      //                     'wafer长度不能大于15！'
      //                   );
      //                 } else {
      //                   callback();
      //                 }
      //               },
      //             },
      //           ],
      //           initialValue: record.waferNum,
      //         })(
      //           <Input />
      //         )}
      //       </Form.Item>
      //     ) : (
      //         val
      //       ),
      // },
      {
        title: 'COS类型',
        dataIndex: 'cosType',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosType`, {
                initialValue: record.cosType,
              })(
                <Select
                  style={{ width: '100%' }}
                  allowClear
                  disabled
                >
                  {cosType.map(item => {
                    return (
                      <Select.Option value={item.value} key={item.value}>
                        {item.meaning}
                      </Select.Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '数量',
        dataIndex: 'primaryUomQty',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <Fragment>
        <Header title="COS过期库存复测投料">
          <Button
            icon='delete'
            onClick={() => this.handleDelete()}
          >
            删除
          </Button>
          <Button
            icon='tool'
            type="primary"
            onClick={() => this.handleConfirmPut()}
            loading={handleConfirmPutLoading}
          >
            确认投料
          </Button>
        </Header>
        <Content>
          <Form>
            <Row {...SEARCH_FORM_ROW_LAYOUT}>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="工单号" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('workOrderId', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: '工单号',
                        }),
                      },
                    ],
                  })(
                    <Lov
                      code="HME.RETURN_WORK_ORDER"
                      queryParams={{
                        tenantId,
                        proLineId: workcellInfo.prodLineId,
                      }}
                      onChange={(_value, record) => {
                        setFieldsValue({
                          materialId: record.materialId,
                        });
                      }
                      }
                    />
                  )}
                </Form.Item>
                <Form.Item label="物料ID" style={{ display: 'none' }}>
                  {getFieldDecorator('materialId', {
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              {/* <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="COS类型" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('cosType', {
                    rules: [
                      {
                        required: true,
                        message: intl.get('hzero.common.validation.notNull', {
                          name: 'COS类型',
                        }),
                      },
                    ],
                  })(
                    <Select
                      style={{ width: '100%' }}
                      allowClear
                      disabled={barCodeList.length > 0}
                    >
                      {cosType.map(item => {
                        return (
                          <Select.Option value={item.value} key={item.value}>
                            {item.meaning}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col> */}
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="来料条码" {...SEARCH_FORM_ITEM_LAYOUT}>
                  {getFieldDecorator('sourceMaterialLotCode', {
                  })(
                    <Input
                      disabled={!getFieldValue('workOrderId')}
                      onKeyDown={this.onEnterDownCode}
                    />
                  )}
                </Form.Item>
              </Col>
              <Col {...FORM_COL_4_LAYOUT}>
                <Form.Item label="当前工位" {...SEARCH_FORM_ITEM_LAYOUT}>
                  <span>{workcellInfo.workcellName}</span>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={18}>
              <EditTable
                bordered
                rowKey='materialLotCode'
                columns={columns}
                loading={handleCheckBarCodeLoading}
                dataSource={barCodeList}
                scroll={{ x: tableScrollWidth(columns), y: 270 }}
                pagination={false}
                rowSelection={{
                  selectedRowKeys,
                  onChange: this.handleSelectRow,
                }}
              />
            </Col>
          </Row>
          {enterSiteVisible && <EnterSite {...enterSiteProps} />}
        </Content>
      </Fragment>
    );
  }
}
