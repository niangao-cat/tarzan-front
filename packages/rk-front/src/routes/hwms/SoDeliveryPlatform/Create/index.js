
import React from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { isEmpty, isUndefined } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { Card, Form, InputNumber, Input, Button, Spin, Popconfirm } from 'hzero-ui';
import Lov from 'components/Lov';
import { addItemToPagination, getCurrentOrganizationId, getEditTableData, getCurrentUserId } from 'utils/utils';
import notification from 'utils/notification';
import moment from 'moment';
import EditTable from 'components/EditTable';
import Filter from './FilterForm';
import styles from '../index.less';

@connect(({ soDeliveryPlatform, loading }) => ({
  soDeliveryPlatform,
  tenantId: getCurrentOrganizationId(),
  userId: getCurrentUserId(),
  fetchHeadDataLoading: loading.effects['soDeliveryPlatform/fetchHeadData'],
  fetchLineDataLoading: loading.effects['soDeliveryPlatform/fetchLineData'],
  saveDataLoading: loading.effects['soDeliveryPlatform/saveData'],
  handleLineCancleLoading: loading.effects['soDeliveryPlatform/handleLineCancle'],
}))
export default class SoDeliveryPlatformCreate extends React.Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      // search: {},
      // createHead: {},
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    const { id } = this.props.match.params;
    if (id !== 'create') {
      this.fetchHeadData();
      this.fetchLineData();
    }
    dispatch({
      type: 'soDeliveryPlatform/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    // 因为编辑跳转的界面与首页共用modal的headList、headPagination、lineList、linePagination，防止有脏数据
    dispatch({
      type: 'soDeliveryPlatform/updateState',
      payload: {
        headList: [],
        headPagination: {},
        lineList: [],
        linePagination: {},
      },
    });
  }

  /**
   * @description: 查询头明细
   * @param {*}
   * @return {*}
   */
  @Bind
  fetchHeadData() {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'soDeliveryPlatform/fetchHeadData',
      payload: {
        instructionDocId: id,
      },
    });
  }

  // 行查询
  @Bind
  fetchLineData(fields = {}) {
    const { dispatch } = this.props;
    const { id } = this.props.match.params;
    dispatch({
      type: 'soDeliveryPlatform/fetchLineData',
      payload: {
        instructionDocId: id,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 新建
  @Bind()
  handleCreate() {
    const {
      dispatch,
      soDeliveryPlatform: { lineList = [], linePagination = {} },
    } = this.props;
    this.detailFormDom.validateFields((err, val) => {
      if (!err) {
        dispatch({
          type: 'soDeliveryPlatform/updateState',
          payload: {
            lineList: [
              ...lineList,
              {
                fromSiteCode: val.siteCode,
                fromSiteId: val.siteId,
                instructionId: new Date().getTime(),
                instructionLineNum: lineList.length > 0 ? Number(lineList[lineList.length - 1].instructionLineNum) + 10 : 10,
                _status: 'create',
                flag: true,
              },
            ],
            lineDataPagination: addItemToPagination(lineList.length, linePagination),
          },
        });
      }
    });
  }

  // 删除
  @Bind
  deleteData(index) {
    const {
      soDeliveryPlatform: { lineList = [] },
      dispatch,
    } = this.props;
    lineList.splice(index, 1);
    dispatch({
      type: 'soDeliveryPlatform/updateState',
      payload: {
        lineList: [...lineList],
      },
    });
  }

  // 编辑消息
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      soDeliveryPlatform: { lineList },
    } = this.props;
    const newList = lineList.map(item => {
      if (record.instructionId === item.instructionId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'soDeliveryPlatform/updateState',
      payload: { lineList: newList },
    });
  }

  @Bind
  handleSave() {
    const {
      dispatch,
      soDeliveryPlatform: { lineList = [], headList },
      history,
    } = this.props;
    const params = getEditTableData(lineList, ['instructionId']);
    const middle = lineList.filter(
      ele => ele._status === 'update' || ele._status === 'create'
    );
    let saveFlag = true;
    for (const value of middle) {
      // eslint-disable-next-line no-loop-func
      value.$form.validateFields(err => {
        if (err) {
          saveFlag = false;
        }
      });
    }
    if (lineList.length === 0) {
      return notification.error({ message: '请新增单据行信息！' });
    }
    this.detailFormDom.validateFields((err, val) => {
      if (!err && saveFlag) {
        dispatch({
          type: 'soDeliveryPlatform/saveData',
          payload: {
            ...headList.length > 0 ? headList[0] : {},
            ...val,
            demandTime: isUndefined(val.demandTime)
              ? null
              : moment(val.demandTime).format(DEFAULT_DATETIME_FORMAT),
            expectedArrivalTime: isUndefined(val.expectedArrivalTime)
              ? null
              : moment(val.expectedArrivalTime).format(DEFAULT_DATETIME_FORMAT),
            lineList: params,
          },
        }).then(res => {
          if (res) {
            notification.success();
            history.push(`/hwms/so-delivery-platform/create/${res.instructionDocId}`);
            this.fetchHeadData();
            this.fetchLineData();
          }
        });
      }
    });
  }


  limitDecimals(value, accuracy) {
    // eslint-disable-next-line no-useless-escape
    const str = `/^(-)*(\\d+)\\.(\\d{1,${accuracy}}).*$/`;
    // eslint-disable-next-line no-eval
    const reg = eval(str);
    if (typeof value === 'string') {
      return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : '';
    } else if (typeof value === 'number') {
      return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : '';
    } else {
      return '';
    }
  }

  @Bind()
  handleLineCancle(val) {
    const {
      dispatch,
      soDeliveryPlatform: {
        lineList = [],
      },
    } = this.props;
    const newStatusList = lineList.filter(ele => ele.instructionStatus === 'NEW');
    if (newStatusList.length === 1) {
      return notification.error({ message: '当前新建状态数量低于标准值不可取消!' });
    }
    dispatch({
      type: 'soDeliveryPlatform/handleLineCancle',
      payload: {
        instructionId: val.instructionId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.fetchHeadData();
        this.fetchLineData();
      }
    });
  }

  render() {
    const {
      soDeliveryPlatform: {
        lineList = [],
        headList = [],
        linePagination = {},
        defaultSite = {},
      },
      userId,
      tenantId,
      saveDataLoading,
      fetchLineDataLoading,
      fetchHeadDataLoading,
      handleLineCancleLoading,
    } = this.props;
    const headFromProps = {
      defaultSite,
      headDetail: headList.length > 0 ? headList[0] : {},
      onRef: node => {
        this.detailFormDom = node.props.form;
      },
    };
    const columns = [
      {
        title: '行号',
        width: 70,
        dataIndex: 'instructionLineNum',
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`instructionLineNum`, {
                initialValue: record.instructionLineNum,
              })(
                <Input disabled />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '状态',
        dataIndex: 'instructionStatusMeaning',
        width: 80,
        align: 'center',
      },
      {
        title: '物料',
        width: 150,
        dataIndex: 'materialCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '物料编码',
                    }),
                  },
                ],
                initialValue: record.materialId,
              })(
                <Lov
                  code="MT.MATERIAL"
                  textValue={val}
                  queryParams={{ tenantId }}
                  onChange={(value, records) => {
                    record.$form.setFieldsValue({
                      materialName: records.materialName,
                      uomCode: records.uomCode,
                      uomId: records.uomId,
                    });
                  }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '物料描述',
        dataIndex: 'materialName',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialName`, {
                initialValue: record.materialName,
              })(<Input disabled />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 150,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialVersion`, {
                initialValue: record.materialVersion,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '需求数',
        dataIndex: 'demandQty',
        width: 100,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`quantity`, {
                initialValue: record.demandQty,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '需求数',
                    }),
                  },
                ],
              })(
                <InputNumber
                  min={0}
                  formatter={value => `${value}`}
                  parser={value => this.limitDecimals(value, 6)}
                  style={{ width: '100%' }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '单位',
        width: 70,
        dataIndex: 'uomCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`uomCode`, { initialValue: record.uomCode })(<Input disabled />)}
              </Form.Item>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`uomId`, { initialValue: record.uomId })(<Input disabled />)}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },
      {
        title: '发货工厂',
        width: 120,
        align: 'center',
        dataIndex: 'fromSiteCode',
        render: (value, record) => ['create', 'update'].includes(record._status) ? (
          <Form.Item>
            {record.$form.getFieldDecorator(`fromSiteId`, {
              rules: [
                {
                  required: true,
                  message: intl.get('hzero.common.validation.notNull', {
                    name: '发货工厂',
                  }),
                },
              ],
              initialValue: record.fromSiteId,
            })(
              <Lov
                code="MT.SITE"
                queryParams={{ tenantId }}
                textValue={record.fromSiteCode}
                onChange={() => {
                  record.$form.setFieldsValue({
                    fromLocatorId: null,
                  });
                }}
              />
            )}
          </Form.Item>
        ) : (
            value
          ),
      },
      {
        title: '发货仓库',
        dataIndex: 'fromWarehouseCode',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('fromLocatorId', {
                initialValue: record.fromLocatorId ? record.fromLocatorId : null,
              })(
                <Lov
                  code="WMS.WAREHOUSE_PERMISSION"
                  disabled={!record.$form.getFieldValue('fromSiteId')}
                  textValue={record.fromWarehouseCode ? record.fromWarehouseCode : null}
                  queryParams={{ tenantId, siteId: record.$form.getFieldValue('fromSiteId'), userId }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '销售订单号',
        dataIndex: 'sourceOrderId',
        width: 150,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator('sourceOrderId', {
                initialValue: record.sourceOrderId,
                rules: [
                  {
                    required: record.$form.getFieldValue('sourceOrderLineId')||record.sourceOrderId,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '销售订单号',
                    }),
                  },
                ],
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '销售订单行号',
        width: 150,
        dataIndex: 'sourceOrderLineId',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`sourceOrderLineId`, {
                initialValue: record.sourceOrderLineId,
                rules: [
                  {
                    required: record.$form.getFieldValue('sourceOrderId')||record.sourceOrderLineId,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: '销售订单行号',
                    }),
                  },
                ],
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '允差下限',
        width: 100,
        dataIndex: 'toleranceLowerLimit',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`toleranceLowerLimit`, {
                initialValue: record.toleranceLowerLimit,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '允差上限',
        width: 100,
        dataIndex: 'toleranceUpperLimit',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`toleranceUpperLimit`, {
                initialValue: record.toleranceUpperLimit,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: '备注',
        width: 100,
        dataIndex: 'remark',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`remark`, {
                initialValue: record.remark,
              })(
                <Input />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        align: 'center',
        fixed: 'right',
        render: (val, record, index) =>
          record._status === 'create' ? (
            <span>
              <a onClick={() => this.deleteData(index)}>清除</a>&nbsp;&nbsp;
            </span>
          ) : record._status === 'update' ? (
            <span>
              <a onClick={() => this.handleEdit(record, false)}>取消</a>&nbsp;&nbsp;
            </span>
          ) : (
            <span>
              {record.instructionStatus === 'NEW' && <a onClick={() => this.handleEdit(record, true)} style={{ marginRight: '8px' }}>编辑</a>}
              {record.instructionStatus === 'NEW' && (
                <Popconfirm
                  title='是否取消当前行？'
                  onConfirm={() => this.handleLineCancle(record)}
                >
                  <a>取消</a>
                </Popconfirm>
              )}
            </span>
              ),
      },
    ];
    return (
      <React.Fragment>
        <Header
          backPath='/hwms/so-delivery-platform'
          title='出货单创建'
        >
          <Button
            type="search"
            style={{ backcolor: 'green' }}
            icon="save"
            onClick={this.handleSave}
            loading={saveDataLoading}
          >
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
          <Button icon="plus" type="primary" onClick={this.handleCreate}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <Spin spinning={fetchHeadDataLoading || false}>
            <Filter {...headFromProps} />
          </Spin>
          <Card
            key="code-rule-header"
            title='单据行信息'
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <div className={styles['so-delivery-platform-create']}>
              <EditTable
                bordered
                rowKey="instructionId"
                loading={fetchLineDataLoading || handleLineCancleLoading}
                dataSource={lineList}
                pagination={linePagination}
                columns={columns}
              />
            </div>
          </Card>
        </Content>
      </React.Fragment>
    );
  }
}
