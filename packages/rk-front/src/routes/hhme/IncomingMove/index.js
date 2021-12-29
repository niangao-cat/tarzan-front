
import React, { Component, Fragment } from 'react';
import { Form, Button, Row, Col, Divider, InputNumber, Spin, Input, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { pullAll } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import {
  SEARCH_FORM_ROW_LAYOUT,
  SEARCH_FORM_ITEM_LAYOUT,
  SEARCH_COL_CLASSNAME,
  FORM_COL_4_LAYOUT,
} from 'utils/constants';
import { connect } from 'dva';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import uuid from 'uuid/v4';
import { tableScrollWidth, filterNullValueObject, getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import HeadForm from './HeadForm';
import EnterSite from '@/components/EnterSite';

@connect(({ incomingMove, loading }) => ({
  incomingMove,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['incomingMove/getSiteList'],
  handleSaveLoading: loading.effects['incomingMaterialEntryPlus/handleSave'],
}))
@Form.create({ fieldNameProp: null })
export default class IncomingMove extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      enterSiteVisible: true,
      enterSiteLoading: false,
      spinning: false,
      selectedRowKeys: [],
      selectedRow: [],
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'incomingMove/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'incomingMove/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'incomingMove/updateState',
      payload: {
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
      incomingMove: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'incomingMove/enterSite',
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

  // 新增行数据
  @Bind()
  handleAddLine() {
    const {
      form,
      dispatch,
      incomingMove: {
        targetList = [],
      },
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    if (!fieldsValue.unitQty) {
      return notification.error({ message: '单元芯片数不能为空！' });
    }
    form.validateFields((err, values) => {
      if (!err) {
        const materialLotCodeListNew = Array.from({ length: values.codeNumAdd }, () => ({
          targetBarNum: values.barNumAdd,
          transferQuantity: fieldsValue.unitQty * values.barNumAdd,
          materialLotId: uuid(),
          _status: 'create',
        }));
        const newTargetList = targetList.concat(materialLotCodeListNew);
        dispatch({
          type: 'incomingMove/updateState',
          payload: {
            targetList: newTargetList,
          },
        });
      }
    });
  }

  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow });
  }

  // 删除行
  @Bind()
  handleDeleteLine() {
    const { selectedRow } = this.state;
    const {
      incomingMove: {
        targetList = [],
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'incomingMove/updateState',
      payload: {
        targetList: pullAll(targetList, selectedRow),
      },
    });
    this.setState({ selectedRow: [], selectedRowKeys: [] });
  }

  // 更改bar数
  @Bind()
  changetargetBarNumNumMax(val, index) {
    const {
      incomingMove: {
        targetList = [],
      },
      dispatch,
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    targetList.splice(index, 1, {
      ...targetList[index],
      targetBarNum: val,
      transferQuantity: fieldsValue.unitQty * val,
    });
    dispatch({
      type: 'incomingMove/updateState',
      payload: {
        targetList,
      },
    });
  }

  @Bind()
  onEnterDown(e, record, index) {
    if (e.keyCode === 13) {
      const className = document.getElementsByClassName('target-incoming-move');
      if (index + 1 < className.length) {
        className[index + 1].focus();
      }
    }
  }

  @Bind()
  handleCheckMaterialCode(vals) {
    const {
      dispatch,
      tenantId,
      incomingMove: { workcellInfo = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'incomingMove/handleCheckMaterialCode',
      payload: {
        tenantId,
        materialLotCode: vals,
        prodLineId: workcellInfo.prodLineId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(res => {
      if (res && res.verifyFlag === 0) {
        Modal.confirm({
          title: res.warnMessage,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.scanSourceLotCode(vals);
          },
          onCancel: () => {
            this.setState({ spinning: false });
          },
        });
      } else if (res) {
        this.setState({ spinning: false });
        this.scanSourceLotCode(vals);
      } else {
        this.setState({ spinning: false });
      }
    });
  }

  // 扫描来源条码
  @Bind()
  scanSourceLotCode(val) {
    const {
      dispatch,
      incomingMove: {
        workcellInfo = {},
      },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'incomingMove/scanSourceLotCode',
      payload: {
        barcode: val,
        operationId: workcellInfo.operationId,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  // 更改costype
  @Bind()
  changeContainerTypeCode(val) {
    const {
      dispatch,
      incomingMove: { workcellInfo = {}, sourceInfo = {} },
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    this.setState({ spinning: true });
    dispatch({
      type: 'incomingMove/changeContainerTypeCode',
      payload: {
        operationId: workcellInfo.operationId,
        workOrderId: sourceInfo.workOrderId,
        containerTypeCode: val,
        cosType: fieldsValue.cosType,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        notification.success();
        dispatch({
          type: 'incomingMove/updateState',
          payload: {
            // targetList: [],
            // sourceInfo: {},
            unitQty: res.incomingQty,
          },
        });
      }
    });
  }

  // 拆分
  @Bind()
  materiallotSplit() {
    const {
      incomingMove: {
        targetList = [],
        workcellInfo = {},
        defaultSite = {},
        sourceInfo = {},
      },
      dispatch,
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    const params = getEditTableData(targetList, ['materialLotId']);
    if (params.length === 0) {
      return notification.error({ message: `请生成要拆分的条码！` });
    }
    this.setState({ spinning: true });
    dispatch({
      type: 'incomingMove/materiallotSplit',
      payload: {
        ...fieldsValue,
        jobBatch: fieldsValue.jobBatch && fieldsValue.jobBatch.format('YYYY-MM-DD'),
        targetList: params,
        materialLotId: sourceInfo.materialLotId,
        workOrderId: sourceInfo.workOrderId,
        operationId: workcellInfo.operationId,
        wkcLineId: workcellInfo.wkcLineId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellId: workcellInfo.workcellId,
        siteId: defaultSite.siteId,
      },
    }).then(
      res => {
        this.setState({ spinning: false });
        if (res) {
          notification.success();
          dispatch({
            type: 'incomingMove/updateState',
            payload: {
              targetList: [],
              sourceInfo: {},
              unitQty: "",
            },
          });
        }
      }
    );
  }

  render() {
    const {
      incomingMove: {
        targetList = [],
        containerType = [],
        cosType = [],
        sourceInfo = {},
        unitQty = null,
      },
      materiallotSplitLoading,
      getSiteListLoading,
      form: { getFieldDecorator },
    } = this.props;
    const { enterSiteVisible, enterSiteLoading, selectedRowKeys, spinning, selectedRow } = this.state;
    const headFormProps = {
      scanSourceLotCode: this.handleCheckMaterialCode,
      changeContainerTypeCode: this.changeContainerTypeCode,
      onRef: node => {
        this.headForm = node.props.form;
      },
      sourceInfo,
      containerType,
      cosType,
      unitQty,
    };
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hhme/incoming-move',
      enterSite: this.enterSite,
    };
    const columns = [
      {
        title: '序号',
        dataIndex: 'num',
        width: 80,
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 150,
        align: 'center',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialLotCode`, {
                rules: [
                  {
                    required: true,
                    message: 'materialLotCode不能为空',
                  },
                ],
              })(
                <Input
                  className="target-incoming-move"
                  onKeyDown={e => this.onEnterDown(e, record, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: 'Bar数',
        dataIndex: 'targetBarNum',
        width: 90,
        align: 'center',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`targetBarNum`, {
                rules: [
                  {
                    required: true,
                    message: 'barNum不能为空',
                  },
                ],
                initialValue: record.targetBarNum,
              })(
                <InputNumber
                  min={0}
                  formatter={value => `${value}`}
                  parser={value => value.replace(/\D|^-/g, '')}
                  style={{ width: '100%' }}
                  onChange={value => this.changetargetBarNumNumMax(value, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: '芯片数',
        dataIndex: 'transferQuantity',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <Fragment>
        <Header title="来料转移">
          <Button
            icon='tool'
            type="primary"
            onClick={() => this.materiallotSplit()}
            loading={materiallotSplitLoading}
          >
            拆分
          </Button>
        </Header>
        <Content>
          <Spin spinning={spinning}>
            <HeadForm {...headFormProps} />
            <Divider />
            <Form>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_4_LAYOUT}>
                  <Form.Item label="条码数量" {...SEARCH_FORM_ITEM_LAYOUT}>
                    {getFieldDecorator('codeNumAdd', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '条码数量',
                          }),
                        },
                      ],
                    })(
                      <InputNumber
                        min={0}
                        formatter={value => `${value}`}
                        parser={value => value.replace(/\D|^-/g, '')}
                        style={{ width: '100%' }}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_4_LAYOUT}>
                  <Form.Item label="BAR条数" {...SEARCH_FORM_ITEM_LAYOUT}>
                    {getFieldDecorator('barNumAdd', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: 'BAR条数',
                          }),
                        },
                      ],
                    })(
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        formatter={value => `${value}`}
                        parser={value => value.replace(/\D|^-/g, '')}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                  <Form.Item>
                    <Button
                      onClick={() => this.handleAddLine()}
                      icon='plus'
                    >
                      新增行
                    </Button>
                    <Button
                      onClick={() => this.handleDeleteLine()}
                      icon='delete'
                      disabled={selectedRow.length === 0}
                    >
                      删除行
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <Row>
              <Col span={10}>
                <EditTable
                  bordered
                  rowKey='materialLotId'
                  columns={columns}
                  dataSource={targetList}
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
          </Spin>
        </Content>
      </Fragment>
    );
  }
}
