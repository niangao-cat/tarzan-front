/*
 * @Description: 生产数据采集
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-07-14 16:55:40
 * @LastEditTime: 2020-11-02 15:01:15
 */

import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import queryString from 'querystring';
import formatterCollections from 'utils/intl/formatterCollections';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import { Spin, Button} from 'hzero-ui';
import FilterForm from './FilterForm';
import ListTable from './ListTable';
import styles from './index.less';
import EnterModal from './EnterModal';

@connect(({ productionDataCollection, loading }) => ({
  productionDataCollection,
  tenantId: getCurrentOrganizationId(),
  fetchLoading: loading.effects['sampleCode/handleSearch'],
  saveLoading: loading.effects['sampleCode/saveSampleCode'],
  enterSiteLoading: loading.effects[''],
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class ProductionDataCollection extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      enterSiteLoading: false,
      spinLoading: false,
      jumpData: {}, // 跳转各个平台暂存数据
    };
  }


  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionDataCollection/updateState',
      payload: {
        workcellInfo: {}, // 输入工位返回的初始化数据
        defaultSite: {},
        tableData: [],
        pagination: {}, // 分页数据
        headInfo: {}, // 头信息
      },
    });
    this.form.resetFields();
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
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
    } = this.props;
    dispatch({
      type: 'productionDataCollection/enterSite',
      payload: {
        ...val,
      },
    }).then(res => {
      this.setState({ enterSiteLoading: false });
      if (res) {
        this.setState({ visible: false });
      }
      this.setState({jumpData:res});
    });
  }

  /**
   * @description: 扫描序列号
   * @param {String} value 序列号
   * @param {String} operationId 工艺
   */
  @Bind()
  scanningMaterialLotCode(value, operationId) {
    const {
      dispatch,
      productionDataCollection: {
        workcellInfo = {},
      },
    } = this.props;
    // 清空下table的数据
    dispatch({
      type: 'productionDataCollection/updateState',
      payload: {
        tableData: [],
        pagination: {},
      },
    });
    this.form.resetFields(['qty', 'materialId', 'remark']);
    if (operationId) {
      this.setState({ spinLoading: true });
      dispatch({
        type: 'productionDataCollection/scanningMaterialLotCode',
        payload: {
          workcellId: workcellInfo.workcellId,
          operationId,
          dataRecordCode: value,
        },
      }).then(res => {
        this.setState({ spinLoading: false });
        if (res) {
          if (res.collectFlag === "0") {
            notification.warning({ message: '请选择物料编码！' });
          }
        }
      });
    } else {
      notification.error({ message: '请选择工艺！' });
    }
  }


  /**
   * @description: 校验所选物料是否为sn物料 1-是 0-否
   * @param {type} params
   */
  @Bind()
  querySnMaterialQty(value) {
    const {
      dispatch,
      productionDataCollection: { headInfo = {} },
    } = this.props;
    this.setState({ spinLoading: true });
    dispatch({
      type: 'productionDataCollection/querySnMaterialQty',
      payload: {
        materialId: value,
      },
    }).then(res => {
      this.setState({ spinLoading: false });
      if (res) {
        if (res.snFlag === "0") {
          notification.warning({ message: '当前物料非SN物料，请填写数量！' });
        } else {
          dispatch({
            type: 'productionDataCollection/updateState',
            payload: {
              headInfo: {
                ...headInfo,
                qty: 1,
              },
            },
          });
        }
      }
    });
  }

  // 更新头数据-数量回车
  @Bind()
  updateHeadInfo() {
    const {
      dispatch,
      productionDataCollection: {
        workcellInfo = {},
      },
    } = this.props;
    this.setState({ spinLoading: true });
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'productionDataCollection/updateHeadInfo',
      payload: {
        workcellId: workcellInfo.workcellId,
        operationId: fieldsValue.operationId,
        primaryUomQty: fieldsValue.qty,
        materialId: fieldsValue.materialId,
        dataRecordCode: fieldsValue.dataRecordCode,
        remark: fieldsValue.remark,
      },
    }).then(res => {
      this.setState({ spinLoading: false });
      if (res) {
        notification.success();
      }
    });
  }

  /**
   * @description: 行数据更新
   * @param {String} value 物料ID/结果
   * @param {Object} records 行记录
   * @param {String} type 类型，用来判断是物料还是结果的修改
   */
  @Bind()
  updateLineData(value, record, typeParams) {
    const {
      dispatch,
      productionDataCollection: { workcellInfo = {} },
    } = this.props;
    this.setState({ spinLoading: true });
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    let payload = {};
    switch (typeParams) {
      case 'MATERIAL':
        payload = {
          collectLineId: record.collectLineId,
          materialId: value,
        };
        break;
      case 'RESULT':
        payload = {
          collectLineId: record.collectLineId,
          result: value,
        };
        break;
      default:
        break;
    }
    dispatch({
      type: 'productionDataCollection/updateDataCollectLineInfo',
      payload,
    }).then(res => {
      this.setState({ spinLoading: false });
      if (res) {
        this.setState({ spinLoading: true });
        notification.success();
        dispatch({
          type: 'productionDataCollection/scanningMaterialLotCode',
          payload: {
            workcellId: workcellInfo.workcellId,
            operationId: fieldsValue.operationId,
            dataRecordCode: fieldsValue.dataRecordCode,
          },
        }).then(() => { this.setState({ spinLoading: false }); });
      }
    });
  }

  // 完成
  @Bind()
  handleFinish() {
    const {
      dispatch,
      productionDataCollection: { tableData = [], workcellInfo = {}, headInfo = {} },
    } = this.props;
    const arr = tableData.filter(ele => ele.result === null || ele.result === '');
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    if (arr.length > 0) {
      notification.error({ message: '当前结果存在空值，不可完成' });
    } else {
      dispatch({
        type: 'productionDataCollection/handleFinish',
        payload: {
          ...headInfo,
          operationId: fieldsValue.operationId,
        },
      }).then(res => {
        this.setState({ spinLoading: false });
        notification.success();
        if (res) {
          this.setState({ spinLoading: true });
          dispatch({
            type: 'productionDataCollection/scanningMaterialLotCode',
            payload: {
              workcellId: workcellInfo.workcellId,
              operationId: fieldsValue.operationId,
              dataRecordCode: fieldsValue.dataRecordCode,
            },
          }).then(() => { this.setState({ spinLoading: false }); });
        }
      });
    }
  }

  /**
   * @description: 跳转到不良处理平台
   * @param {type} params
   */
  @Bind()
  openBadHandTab() {
    const { jumpData} = this.state;
    const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    if (!fieldsValue.dataRecordCode) {
      return notification.warning({ description: '请扫描条码！' });
    }
    openTab({
      key: `/hmes/bad-handling`, // 打开 tab 的 key
      path: `/hmes/bad-handling`, // 打开页面的path
      title: '不良处理平台',
      search: queryString.stringify({
        pathType: true,
        processId: jumpData.operationList[0].operationId,
        processName: jumpData.operationList[0].description,
        prodLineId: jumpData.prodLineId,
        prodLineName: jumpData.prodLineName,
        workcellId: jumpData.workcellId,
        workcellName: jumpData.workcellName,
        snNum: fieldsValue.dataRecordCode,
      }),
      closable: true,
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      tenantId,
      productionDataCollection: {
        tableData = [],
        pagination = {},
        headInfo = {},
        workcellInfo = {},
      },
    } = this.props;
    const { visible, enterSiteLoading, spinLoading } = this.state;
    const filterProps = {
      tenantId,
      headInfo,
      workcellInfo,
      onRef: this.handleBindRef,
      querySnMaterialQty: this.querySnMaterialQty,
      scanningMaterialLotCode: this.scanningMaterialLotCode,
      updateHeadInfo: this.updateHeadInfo,
      handleFinish: this.handleFinish,
    };
    const enterModalProps = {
      visible,
      loading: enterSiteLoading,
      enterSite: this.enterSite,
    };
    return (
      <React.Fragment>
        <Header title="生产数据采集">
          <Button type="primary" onClick={() => this.openBadHandTab()}>
          不良统计
          </Button>
        </Header>
        <Content style={{ backgroundColor: 'transparent', margin: '0px' }}>
          <Spin spinning={spinLoading}>
            <div className={styles['prod-data-coll-top']}>
              <FilterForm {...filterProps} />
            </div>
            <div className={styles['prod-data-coll-bootom']}>
              <div className={styles['prod-data-coll-title']}>
                数据采集
              </div>
              <ListTable
                onSearch={this.handleSearch}
                updateLineMaterial={this.updateLineData}
                updateLineResult={this.updateLineData}
                dataSource={tableData}
                pagination={pagination}
                tenantId={tenantId}
                headInfo={headInfo}
              />
              {/* <div className={styles['prod-data-coll-button']}>
              <Button className={styles['prod-data-coll-button-get']}>
                获取
              </Button>
              <Button className={styles['prod-data-coll-button-detail']}>
                详情
              </Button>
              <Button className={styles['prod-data-coll-button-ok']}>
                OK
              </Button>
              <Button className={styles['prod-data-coll-button-ng']}>
                NG
              </Button>
            </div> */}
            </div>
          </Spin>
          {visible && <EnterModal {...enterModalProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
