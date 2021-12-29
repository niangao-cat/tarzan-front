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
import { tableScrollWidth, filterNullValueObject, getCurrentOrganizationId, getEditTableData } from 'utils/utils';
import HeadForm from './HeadForm';
import EnterSite from '@/components/EnterSite';

@connect(({ cosScrapRetest, loading }) => ({
  cosScrapRetest,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['cosScrapRetest/getSiteList'],
  handleSearchCosTypeListLoading: loading.effects['cosScrapRetest/handleSearchCosTypeList'],
  cosScrapScanMaterialLotLoading: loading.effects['cosScrapRetest/cosScrapScanMaterialLot'],
  handleSearchSurplusCosNumLoading: loading.effects['cosScrapRetest/handleSearchSurplusCosNum'],
  materiallotSplitLoading: loading.effects['cosScrapRetest/cosScrapSplit'],
}))
@Form.create({ fieldNameProp: null })
export default class CosScrapRetest extends Component {
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
      type: 'cosScrapRetest/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'cosScrapRetest/getSiteList',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'cosScrapRetest/init',
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
      cosScrapRetest: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosScrapRetest/enterSite',
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
      cosScrapRetest: {
        targetList = [],
      },
    } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const materialLotCodeListNew = Array.from({ length: values.codeNumAdd }, () => ({
          materialLotId: uuid(),
          cosNum: 0,
          _status: 'create',
        }));
        const newTargetList = targetList.concat(materialLotCodeListNew);
        dispatch({
          type: 'cosScrapRetest/updateState',
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
      cosScrapRetest: {
        targetList = [],
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'cosScrapRetest/updateState',
      payload: {
        targetList: pullAll(targetList, selectedRow),
      },
    });
    this.setState({ selectedRow: [], selectedRowKeys: [] });
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

  // 扫描来源条码
  @Bind()
  cosScrapScanMaterialLot(val) {
    const {
      dispatch,
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    this.setState({ spinning: true });
    dispatch({
      type: 'cosScrapRetest/cosScrapScanMaterialLot',
      payload: {
        materialLotCode: val,
        workOrderId: fieldsValue.workOrderId,
        materialId: fieldsValue.materialId,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  // 更改costype
  @Bind()
  handleSearchCosTypeList(val) {
    const {
      dispatch,
      cosScrapRetest: {
        workcellInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'cosScrapRetest/handleSearchCosTypeList',
      payload: {
        operationId: workcellInfo.operationId,
        containerTypeCode: val,
      },
    });
  }

  // 拆分
  @Bind()
  cosScrapSplit() {
    const {
      cosScrapRetest: {
        targetList = [],
        workcellInfo = {},
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
      type: 'cosScrapRetest/cosScrapSplit',
      payload: {
        ...fieldsValue,
        jobBatch: fieldsValue.jobBatch && fieldsValue.jobBatch.format('YYYY-MM-DD'),
        targetList: params,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        wkcShiftId: workcellInfo.wkcShiftId,
      },
    }).then(
      res => {
        this.setState({ spinning: false });
        if (res) {
          notification.success();
        }
      }
    );
  }

  // 更改cos数量
  @Bind()
  changeTargetNum(val, index) {
    const {
      cosScrapRetest: {
        targetList = [],
      },
      dispatch,
    } = this.props;
    targetList.splice(index, 1, {
      ...targetList[index],
      cosNum: val,
    });
    let splitQty = 0;
    targetList.forEach(ele => {
      splitQty = ele.cosNum + splitQty;
    });
    dispatch({
      type: 'cosScrapRetest/updateState',
      payload: {
        splitQty,
        targetList,
      },
    });
  }

  // 查询剩余cos数量
  @Bind()
  handleSearchSurplusCosNum(val) {
    const {
      dispatch,
      cosScrapRetest: {
        workcellInfo = {},
      },
    } = this.props;
    dispatch({
      type: 'cosScrapRetest/handleSearchSurplusCosNum',
      payload: {
        workOrderId: val.workOrderId,
        materialId: val.materialId,
        workcellId: workcellInfo.workcellId,
        operationId: workcellInfo.operationId,
      },
    });
  }

  // 条码打印
  @Bind()
  handlePrinting() {
    const {
      dispatch,
      cosScrapRetest: {
        targetList = [],
      },
    } = this.props;
    dispatch({
      type: 'cosScrapRetest/printingBarcode',
      payload: {
        materialLotIdList: targetList.map(e => e.materialLotId),
      },
      // payload: targetList.map(e => e.materialLotId),
    }).then(res => {
      if (res.failed) {
        notification.error({ message: res.exception });
      } else {
        const file = new Blob(
          [res],
          { type: 'application/pdf' }
        );
        const fileURL = URL.createObjectURL(file);
        const newwindow = window.open(fileURL, 'newwindow');
        if (newwindow) {
          newwindow.print();
          dispatch({
            type: 'cosScrapRetest/updateState',
            payload: {
              targetList: [],
            },
          });
        } else {
          notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
        }
      }
    });
  }

  // 重置
  @Bind()
  handleReset() {
    const { dispatch } = this.props;
    this.headForm.resetFields();
    dispatch({
      type: 'cosScrapRetest/updateState',
      payload: {
        targetList: [],
        splitQty: null, // 拆分数量
        surplusCosNum: null, // 剩余cos数量
        primaryUomQty: null, // 条码数量
        cosTypeList: [], // cos类型
        editFlag: true, // 是否可编辑
      },
    });
  }

  render() {
    const {
      cosScrapRetest: {
        workcellInfo = {},
        targetList = [],
        containerType = [],
        primaryUomQty = null,
        splitQty = null,
        surplusCosNum = null,
        cosTypeList = [],
        editFlag,
        lotList = [],
      },
      tenantId,
      materiallotSplitLoading,
      getSiteListLoading,
      handleSearchCosTypeListLoading,
      cosScrapScanMaterialLotLoading,
      handleSearchSurplusCosNumLoading,
      form: { getFieldDecorator },
    } = this.props;
    const { enterSiteVisible, enterSiteLoading, selectedRowKeys, spinning, selectedRow } = this.state;
    const headFormProps = {
      cosScrapScanMaterialLot: this.cosScrapScanMaterialLot,
      handleSearchCosTypeList: this.handleSearchCosTypeList,
      handleSearchSurplusCosNum: this.handleSearchSurplusCosNum,
      onRef: node => {
        this.headForm = node.props.form;
      },
      lotList,
      primaryUomQty, // 条码数量
      containerType,
      cosTypeList,
      splitQty, // 拆分数量
      surplusCosNum, // 剩余cos数量
      workcellInfo,
      tenantId,
      editFlag,
      handleSearchCosTypeListLoading,
      cosScrapScanMaterialLotLoading,
      handleSearchSurplusCosNumLoading,
    };
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hhme/cos-scrap-retest',
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
      },
      {
        title: 'COS数量',
        dataIndex: 'cosNum',
        width: 90,
        align: 'center',
        render: (val, record, index) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`cosNum`, {
                rules: [
                  {
                    required: true,
                    message: 'COS数量不能为空',
                  },
                ],
                initialValue: record.cosNum ? record.cosNum : 0,
              })(
                <InputNumber
                  min={0}
                  formatter={value => `${value}`}
                  parser={value => value.replace(/\D|^-/g, '')}
                  style={{ width: '100%' }}
                  onChange={value => this.changeTargetNum(value, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
    ];
    return (
      <Fragment>
        <Header title="COS报废复测投料">
          <Button
            icon='delete'
            type="primary"
            onClick={() => this.handleReset()}
          >
            重置
          </Button>
          <Button
            icon='printer'
            type="primary"
            disabled={targetList.length === 0}
            onClick={() => this.handlePrinting()}
          >
            打印
          </Button>
          <Button
            icon='tool'
            type="primary"
            onClick={() => this.cosScrapSplit()}
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
                        disabled={!editFlag}
                      />
                    )}
                  </Form.Item>
                </Col>
                <Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
                  <Form.Item>
                    <Button
                      onClick={() => this.handleAddLine()}
                      icon='plus'
                      disabled={!editFlag}
                    >
                      新增行
                    </Button>
                    <Button
                      onClick={() => this.handleDeleteLine()}
                      icon='delete'
                      disabled={selectedRow.length === 0 || !editFlag}
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

