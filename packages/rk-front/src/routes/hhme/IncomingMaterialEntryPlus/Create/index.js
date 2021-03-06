
import React, { Component, Fragment } from 'react';
import { Form, Button, Row, Col, Divider, InputNumber, Spin } from 'hzero-ui';
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
import { tableScrollWidth, filterNullValueObject, getEditTableData, getCurrentOrganizationId } from 'utils/utils';
import HeadForm from './HeadForm';
import EnterSite from '@/components/EnterSite';
import styles from '../index.less';

@connect(({ incomingMaterialEntryPlus, loading }) => ({
  incomingMaterialEntryPlus,
  tenantId: getCurrentOrganizationId(),
  materiallotSplitLoading: loading.effects['incomingMaterialEntryPlus/materiallotSplit'],
  handleSaveLoading: loading.effects['incomingMaterialEntryPlus/handleSave'],
}))
@Form.create({ fieldNameProp: null })
export default class CreateWOModal extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      enterSiteLoading: false,
      spinning: false,
      selectedRowKeys: [],
      selectedRow: [],
      canEdit: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      tenantId,
      incomingMaterialEntryPlus: {
        enterSiteVisible,
      },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'incomingMaterialEntryPlus/getSiteList',
      payload: {
        tenantId,
      },
    });
    const { operationRecordId } = this.props.match.params;
    if (operationRecordId !== 'create' && !enterSiteVisible) {
      this.fetchWorkDetailsCreate(operationRecordId);
    }
  }

  componentWillUnmount() {
    const {
      dispatch,
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/updateState',
      payload: {
        materiallotSplitData: {},
        targetList: [],
        barNumCount: '',
        cosNumCount: '',
        woWithCosType: '',
        unitQty: '',
        remainingQty: '',
      },
    });
  }

  /**
   * @description: ????????????
   * @param {Object} values ????????????
   */
  @Bind()
  enterSite(val) {
    this.setState({ enterSiteLoading: true });
    const {
      dispatch,
      incomingMaterialEntryPlus: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/enterSite',
      payload: {
        ...val,
        siteId: defaultSite.siteId,
      },
    }).then(res => {
      this.setState({ enterSiteLoading: false });
      if (res) {
        if (res.operationIdList.length > 1) {
          notification.error({ message: `??????${res.workcellName}???????????????????????????????????????` });
        } else {
          dispatch({
            type: 'incomingMaterialEntryPlus/updateState',
            payload: {
              enterSiteVisible: false,
            },
          });
          const { operationRecordId } = this.props.match.params;
          if (operationRecordId !== 'create') {
            this.fetchWorkDetailsCreate(operationRecordId);
          }
          // this.fetchWoIncomingRecord();
        }
      }
    });
  }


  // ????????????-?????????????????????
  @Bind()
  selectWo(val) {
    const {
      dispatch,
      incomingMaterialEntryPlus: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    dispatch({
      type: 'incomingMaterialEntryPlus/fetchrRemainingQty',
      payload: {
        operationId: workcellInfo.operationId,
        workOrderId: val.workOrderId,
        containerTypeCode: fieldsValue.containerTypeCode,
        barNum: fieldsValue.barNum,
        cosType: fieldsValue.cosType,
        siteId: defaultSite.siteId,
      },
    });
  }

  // ?????????
  @Bind()
  handleAddLine() {
    const {
      form,
      dispatch,
      incomingMaterialEntryPlus: {
        targetList = [],
      },
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    if (!fieldsValue.unitQty) {
      return notification.error({ message: '??????????????????????????????' });
    }
    form.validateFields((err, values) => {
      if (!err) {
        const materialLotCodeListNew = Array.from({ length: values.codeNumAdd }, () => ({
          targetBarNum: values.barNumAdd,
          transferQuantity: fieldsValue.unitQty * values.barNumAdd,
          materialLotId: uuid(),
          _status: 'create',
        }));
        let barNumCount = 0;
        let cosNumCount = 0;
        const newTargetList = targetList.concat(materialLotCodeListNew);
        newTargetList.forEach(ele => {
          barNumCount = ele.targetBarNum + barNumCount;
          cosNumCount = ele.transferQuantity + cosNumCount;
        });
        dispatch({
          type: 'incomingMaterialEntryPlus/updateState',
          payload: {
            barNumCount,
            cosNumCount,
            targetList: newTargetList,
          },
        });
      }
    });
  }

  // ?????????
  @Bind()
  handleDeleteLine() {
    const { selectedRow } = this.state;
    const {
      incomingMaterialEntryPlus: {
        targetList = [],
      },
      dispatch,
    } = this.props;
    let barNumCount = 0;
    let cosNumCount = 0;
    pullAll(targetList, selectedRow).forEach(ele => {
      barNumCount = ele.targetBarNum + barNumCount;
      cosNumCount = ele.transferQuantity + cosNumCount;
    });
    dispatch({
      type: 'incomingMaterialEntryPlus/updateState',
      payload: {
        barNumCount,
        cosNumCount,
        targetList: pullAll(targetList, selectedRow),
      },
    });
    this.setState({ selectedRow: [], selectedRowKeys: [] });
  }

  @Bind()
  handleSelectRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow });
  }

  // ?????????????????????
  @Bind()
  queryMateriallotQty(val) {
    const {
      incomingMaterialEntryPlus: {
        defaultSite = {},
        workcellInfo = {},
      },
      dispatch,
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'incomingMaterialEntryPlus/queryMateriallotQty',
      payload: {
        materialLotCode: val.sourceMaterialLotCode,
        workOrderId: val.workOrderId,
        wkcLinetId: workcellInfo.wkcLineId,
        siteId: defaultSite.siteId,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  // ??????
  @Bind()
  materiallotSplit() {
    const {
      incomingMaterialEntryPlus: {
        targetList = [],
        workcellInfo = {},
        defaultSite = {},
        materialLotId = '',
      },
      dispatch,
      history,
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    const params = getEditTableData(targetList, ['materialLotId']);
    if (params.length === 0) {
      return notification.error({ message: `??????????????????????????????` });
    }
    const minval = Math.min(fieldsValue.primaryUomQty, fieldsValue.remainingQty);
    if (fieldsValue.cosNum > minval) {
      return notification.error({ message: `???????????????????????????????????????????????? / ???????????????` });
    }
    this.setState({ spinning: true });
    dispatch({
      type: 'incomingMaterialEntryPlus/materiallotSplit',
      payload: {
        ...fieldsValue,
        jobBatch: fieldsValue.jobBatch && fieldsValue.jobBatch.format('YYYY-MM-DD'),
        targetList: params,
        materialLotId,
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
          history.push(`/hhme/incoming-material-entry-plus/${res.operationRecordId}`);
          this.fetchWorkDetailsCreate(res.operationRecordId);
          notification.success();
        }
      }
    );
  }

  @Bind()
  fetchWorkDetailsCreate(val) {
    const {
      dispatch,
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'incomingMaterialEntryPlus/fetchWorkDetailsCreate',
      payload: {
        operationRecordId: val,
      },
    }).then(res => {
      this.setState({ spinning: false });
      if (res) {
        let barNumCount = 0;
        let cosNumCount = 0;
        res.targetList.forEach(ele => {
          barNumCount = ele.targetBarNum + barNumCount;
          cosNumCount = ele.transferQuantity + cosNumCount;
        });
        dispatch({
          type: 'incomingMaterialEntryPlus/updateState',
          payload: {
            barNumCount,
            cosNumCount,
          },
        });
      }
    });
  }

  // ??????bar???
  @Bind()
  changetargetBarNumNumMax(val, index) {
    const {
      incomingMaterialEntryPlus: {
        targetList = [],
      },
      dispatch,
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    let barNumCount = 0;
    let cosNumCount = 0;
    targetList.splice(index, 1, {
      ...targetList[index],
      targetBarNum: val,
      transferQuantity: fieldsValue.unitQty * val,
    });
    targetList.forEach(ele => {
      barNumCount = ele.targetBarNum + barNumCount;
      cosNumCount = ele.transferQuantity + cosNumCount;
    });
    dispatch({
      type: 'incomingMaterialEntryPlus/updateState',
      payload: {
        barNumCount,
        cosNumCount,
        targetList,
      },
    });
  }

  // ??????????????????
  @Bind()
  handleCreateWOVisible(val) {
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    this.queryMateriallotQty(fieldsValue);
    const {
      dispatch,
      history,
      incomingMaterialEntryPlus: {
        materiallotSplitData = {},
      },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/updateState',
      payload: {
        barNumCount: '',
        cosNumCount: '',
        materiallotSplitData: {
          ...materiallotSplitData,
          jobBatch: '',
        },
        targetList: [],
      },
    });
    this.headFormProps.clearIncomingforminputNumber();
    history.push(`/hhme/incoming-material-entry-plus/${val}`);
  }

  @Bind
  changeStatus() {
    this.setState({
      canEdit: true,
    });
  };

  // ?????????????????????
  @Bind
  handleSave() {
    const {
      incomingMaterialEntryPlus: {
        materiallotSplitData = {},
      },
      dispatch,
      history,
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    dispatch({
      type: 'incomingMaterialEntryPlus/handleSave',
      payload: {
        ...materiallotSplitData,
        ...fieldsValue,
        jobBatch: fieldsValue.jobBatch && fieldsValue.jobBatch.format('YYYY-MM-DD'),
      },
    }).then(res => {
      if (res) {
        history.push(`/hhme/incoming-material-entry-plus/${materiallotSplitData.operationRecordId}`);
        this.setState({ canEdit: false });
        this.fetchWorkDetailsCreate(materiallotSplitData.operationRecordId);
        notification.success();
      }
    });
  }

  // ??????costype
  @Bind()
  changeCosType(val) {
    const {
      dispatch,
      incomingMaterialEntryPlus: { workcellInfo = {} },
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    dispatch({
      type: 'incomingMaterialEntryPlus/changeCosType',
      payload: {
        operationId: workcellInfo.operationId,
        workOrderId: fieldsValue.workOrderId,
        containerTypeCode: fieldsValue.containerTypeCode,
        barNum: fieldsValue.barNum,
        cosType: val,
      },
    });
  }

  materiallotSplitData

  render() {
    const {
      incomingMaterialEntryPlus: {
        lovData = {},
        workcellInfo = {},
        targetList = [],
        remainingQty = '',
        enterSiteVisible,
        woWithCosType,
        unitQty,
        primaryUomQty,
        materiallotSplitData = {},
        barNumCount,
        cosNumCount,
      },
      materiallotSplitLoading,
      handleSaveLoading,
      form: { getFieldDecorator },
      tenantId,
    } = this.props;
    const { operationRecordId } = this.props.match.params;
    const { enterSiteLoading, selectedRowKeys, spinning, selectedRow, canEdit } = this.state;
    const headFormProps = {
      lovData,
      workcellInfo,
      tenantId,
      remainingQty,
      woWithCosType,
      unitQty,
      primaryUomQty,
      materiallotSplitData,
      operationRecordId,
      targetList,
      barNumCount,
      cosNumCount,
      canEdit,
      onRef: node => {
        this.headForm = node.props.form;
        this.headFormProps = node;
      },
      selectWo: this.selectWo,
      queryMateriallotQty: this.queryMateriallotQty,
      changeCosType: this.changeCosType,
    };
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: false || enterSiteLoading,
      closePath: '/hhme/incoming-material-entry-plus',
      enterSite: this.enterSite,
    };
    const columns = [
      {
        title: '??????',
        dataIndex: 'num',
        width: 80,
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: '??????',
        dataIndex: 'materialLotCode',
        width: 150,
        align: 'center',
      },
      {
        title: 'Bar???',
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
                    message: 'barNum????????????',
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
        title: '?????????',
        dataIndex: 'transferQuantity',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <Fragment>
        <Header title="????????????" backPath="/hhme/incoming-material-entry-plus">
          <Button
            icon='printer'
            type="primary"
            // disabled={operationRecordId==='create'}
            disabled
          >
            ??????
          </Button>
          <Button
            icon='tool'
            type="primary"
            onClick={() => this.materiallotSplit()}
            loading={materiallotSplitLoading}
            disabled={operationRecordId !== 'create'}
          >
            ??????
          </Button>
          <Button
            type="primary"
            icon="plus"
            onClick={() => this.handleCreateWOVisible('create')}
            disabled={operationRecordId === 'create'}
          >
            ??????
          </Button>
          {canEdit ? (
            <Button
              onClick={() => this.handleSave()}
              type="primary"
              loading={handleSaveLoading}
            >
              {intl.get('tarzan.product.materialManager.button.save').d('??????')}
            </Button>
          ) : (
            <Button
              onClick={() => this.changeStatus()}
            >
              {intl.get('tarzan.product.materialManager.button.edit').d('??????')}
            </Button>
            )}
        </Header>
        <Content>
          <Spin spinning={spinning}>
            <div className={styles['incoming-material-entry-plus-headform']}>
              <HeadForm {...headFormProps} />
            </div>
            <Divider />
            <Form>
              <Row {...SEARCH_FORM_ROW_LAYOUT}>
                <Col {...FORM_COL_4_LAYOUT}>
                  <Form.Item label="????????????" {...SEARCH_FORM_ITEM_LAYOUT}>
                    {getFieldDecorator('codeNumAdd', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: '????????????',
                          }),
                        },
                      ],
                    })(
                      <InputNumber
                        min={0}
                        formatter={value => `${value}`}
                        parser={value => value.replace(/\D|^-/g, '')}
                        style={{ width: '100%' }}
                        disabled={operationRecordId !== 'create'}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_4_LAYOUT}>
                  <Form.Item label="BAR??????" {...SEARCH_FORM_ITEM_LAYOUT}>
                    {getFieldDecorator('barNumAdd', {
                      rules: [
                        {
                          required: true,
                          message: intl.get('hzero.common.validation.notNull', {
                            name: 'BAR??????',
                          }),
                        },
                      ],
                    })(
                      <InputNumber
                        min={0}
                        style={{ width: '100%' }}
                        formatter={value => `${value}`}
                        parser={value => value.replace(/\D|^-/g, '')}
                        disabled={operationRecordId !== 'create'}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                  <Form.Item>
                    <Button
                      onClick={() => this.handleAddLine()}
                      icon='plus'
                      disabled={operationRecordId !== 'create'}
                    >
                      ?????????
                    </Button>
                    <Button
                      onClick={() => this.handleDeleteLine()}
                      icon='delete'
                      disabled={selectedRow.length === 0 || operationRecordId !== 'create'}
                    >
                      ?????????
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
                  // loading={fetchLoading}
                  dataSource={targetList}
                  scroll={{ x: tableScrollWidth(columns), y: 270 }}
                  pagination={false}
                  // onChange={page => onSearch(page)}
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
