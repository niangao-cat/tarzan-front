import React, { Component, Fragment } from 'react';
import { Form, Button, Row, Col, Divider, Card } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import { tableScrollWidth, filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import HeadForm from './HeadForm';
import styles from './index.less';
import gwPath from '@/assets/gw.png';
import EnterSite from '@/components/EnterSite';
import DataList from './DataList';

@connect(({ cosReturnFactoryRetest, loading }) => ({
  cosReturnFactoryRetest,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['cosScrapRetest/getSiteList'],
  fetchRemainingQtyLoading: loading.effects['cosReturnFactoryRetest/fetchRemainingQty'],
  handleSourceLotCodeLoading: loading.effects['cosReturnFactoryRetest/handleSourceLotCode'],
  cosBackFactorySplitLoading: loading.effects['cosReturnFactoryRetest/cosBackFactorySplit'],
}))
@Form.create({ fieldNameProp: null })
export default class CosReturnFactoryRetest extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {
      enterSiteVisible: true,
      enterSiteLoading: false,
      // selectedRowKeys: [],
      // selectedRow: [],
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'cosReturnFactoryRetest/batchLovData',
      payload: {
        tenantId,
      },
    });
    dispatch({
      type: 'cosReturnFactoryRetest/getSiteList',
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
      cosReturnFactoryRetest: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'cosReturnFactoryRetest/enterSite',
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
    // eslint-disable-next-line react/no-unused-state
    this.setState({ selectedRowKeys, selectedRow });
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
  handleSourceLotCode(val) {
    const {
      dispatch,
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    dispatch({
      type: 'cosReturnFactoryRetest/handleSourceLotCode',
      payload: {
        materialLotCode: val,
        workOrderId: fieldsValue.workOrderId,
        materialId: fieldsValue.materialId,
      },
    });
  }


  // 拆分
  @Bind()
  cosScrapSplit() {
    const {
      cosReturnFactoryRetest: {
        workcellInfo = {},
        feelMaterialLotList = [],
        returnMaterialLotList = [],
      },
      dispatch,
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    this.headForm.validateFields((err) => {
      if (!err) {
        dispatch({
          type: 'cosReturnFactoryRetest/cosBackFactorySplit',
          payload: {
            ...fieldsValue,
            jobBatch: fieldsValue.jobBatch && fieldsValue.jobBatch.format('YYYY-MM-DD'),
            operationId: workcellInfo.operationId,
            workcellId: workcellInfo.workcellId,
            wkcShiftId: workcellInfo.wkcShiftId,
            feelMaterialLotList,
            returnMaterialLotList,
          },
        }).then(
          res => {
            if (res) {
              notification.success();
              this.headForm.resetFields();
              dispatch({
                type: 'cosReturnFactoryRetest/updateState',
                payload: {
                  remainingQty: '',
                  woWithCosType: [],
                  cosTypeList: [],
                  primaryUomQty: '',
                  splitQty: '',
                  feelMaterialLotList: [], // 批次物料
                  returnMaterialLotList: [], // 退料条码
                },
              });
            }
          }
        );
      }
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
      payload: targetList.map(e => e.materialLotId),
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

  // 查询剩余芯片数
  @Bind()
  handleFetchRemainingQty(val) {
    const {
      dispatch,
      cosReturnFactoryRetest: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    dispatch({
      type: 'cosReturnFactoryRetest/fetchRemainingQty',
      payload: {
        operationId: workcellInfo.operationId,
        workOrderId: val.workOrderId,
        containerTypeCode: fieldsValue.containerTypeCode,
        cosType: fieldsValue.cosType,
        siteId: defaultSite.siteId,
      },
    });
  }

  // 更改costype
  @Bind()
  handleChangeCosType(val) {
    const {
      dispatch,
      cosReturnFactoryRetest: { workcellInfo = {} },
    } = this.props;
    const fieldsValue = (this.headForm && filterNullValueObject(this.headForm.getFieldsValue())) || {};
    dispatch({
      type: 'cosReturnFactoryRetest/changeCosType',
      payload: {
        operationId: workcellInfo.operationId,
        workOrderId: fieldsValue.workOrderId,
        containerTypeCode: fieldsValue.containerTypeCode,
        barNum: fieldsValue.barNum,
        cosType: val,
      },
    }).then(res => {
      if (!res) {
        this.headForm.setFieldsValue({ cosType: '' });
      }
    });
  }

  // 清除数据
  @Bind()
  handleClear() {
    const { dispatch } = this.props;
    this.headForm.resetFields();
    dispatch({
      type: 'cosReturnFactoryRetest/updateState',
      payload: {
        remainingQty: '',
        woWithCosType: [],
        cosTypeList: [],
        primaryUomQty: '',
        splitQty: '',
        feelMaterialLotList: [], // 批次物料
        returnMaterialLotList: [], // 退料条码
      },
    });
  }

  render() {
    const {
      cosReturnFactoryRetest: {
        workcellInfo = {},
        containerType = [],
        cosTypeList = [],
        feelMaterialLotList = [],
        returnMaterialLotList = [],
        woWithCosType = '',
        remainingQty = '',
        primaryUomQty = '',
        splitQty = '',
      },
      tenantId,
      getSiteListLoading,
      fetchRemainingQtyLoading,
      handleSourceLotCodeLoading,
      cosBackFactorySplitLoading,
    } = this.props;
    const { enterSiteVisible, enterSiteLoading } = this.state;
    const headFormProps = {
      onRef: node => {
        this.headForm = node.props.form;
      },
      workcellInfo,
      tenantId,
      containerType,
      cosTypeList,
      woWithCosType,
      remainingQty,
      primaryUomQty,
      splitQty,
      fetchRemainingQtyLoading,
      handleSourceLotCodeLoading,
      handleFetchRemainingQty: this.handleFetchRemainingQty,
      handleChangeCosType: this.handleChangeCosType,
      handleSourceLotCode: this.handleSourceLotCode,
    };
    const enterSiteProps = {
      visible: true,
      loading: getSiteListLoading || enterSiteLoading,
      closePath: '/hhme/cos-return-factory-retest',
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
        title: '芯片数量',
        dataIndex: 'primaryUomQty',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <Fragment>
        <Header title="COS返厂复测投料">
          <Button
            icon='delete'
            type="primary"
            onClick={() => this.handleClear()}
          >
            清空
          </Button>
          <Button
            icon='tool'
            type="primary"
            onClick={() => this.cosScrapSplit()}
            loading={cosBackFactorySplitLoading}
          >
            拆分
          </Button>
        </Header>
        <Content style={{ height: '100%' }}>
          <Row style={{ height: '100%' }}>
            <Col span={19} style={{ height: '100%', paddingRight: '5px' }}>
              <Card className={styles['cos-return-factory-retest-card']} style={{ height: '100%' }}>
                <HeadForm {...headFormProps} />
                <Divider />
                <Row>
                  <Col span={10}>
                    <EditTable
                      bordered
                      loading={handleSourceLotCodeLoading}
                      rowKey='materialLotId'
                      columns={columns}
                      dataSource={returnMaterialLotList}
                      scroll={{ x: tableScrollWidth(columns), y: 270 }}
                      pagination={false}
                    // rowSelection={{
                    //   selectedRowKeys,
                    //   onChange: this.handleSelectRow,
                    // }}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={5} style={{ paddingLeft: '5px' }}>
              <Card className={styles['cos-return-factory-retest-card']}>
                <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                <div style={{ float: 'left', padding: '2px' }}>当前工位：{workcellInfo.workcellName}</div>
              </Card>
              <Card className={styles['cos-return-factory-retest-card']} style={{ marginTop: '10px', height: '650px' }}>
                <DataList
                  itemList={feelMaterialLotList}
                  loading={handleSourceLotCodeLoading}
                />
              </Card>
            </Col>
          </Row>
          {enterSiteVisible && <EnterSite {...enterSiteProps} />}
        </Content>
      </Fragment>
    );
  }
}

