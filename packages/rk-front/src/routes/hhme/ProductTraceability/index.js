/*
 * @Description: 产品生产履历查询
 * @Version: 0.0.1
 * @author: LZH <zhaohui.liu@hand-china.com>
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-06-07 18:10:19
 * @LastEditTime: 2020-08-14 16:02:43
 */

import React, { Component } from 'react';
import { Row, Col, Spin, Button } from 'hzero-ui';
import { connect } from 'dva';
import { isUndefined, isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import { Scrollbars } from 'react-custom-scrollbars';
import qs from 'querystring';

import { Header, Content } from 'components/Page';
import formatterCollections from 'utils/intl/formatterCollections';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
  // delItemsToPagination,
} from 'utils/utils';
import notification from 'utils/notification';
import ExcelExport from '@/components/ExcelExport';

import FilterForm from './FilterForm';
import ReverseForm from './ReverseForm';
import ProcessTransfer from './components/ProcessTransfer';
import ProcessQuality from './components/ProcessQuality';
import ErrorInfo from './components/ErrorInfo';
import EquipmentList from './components/EquipmentList';
import ItemList from './components/ItemList';
import SelectTree from './SelectTree';
import styles from './index.less';
import BadInfoDrawer from './components/BadInfoDrawer';
import ReverseDrawer from './components/ReverseDrawer';
import DetailDrawer from './components/DetailDrawer';
import PumpListModal from './components/PumpListModal';

// const modelPrompt = 'tarzan.hmes.message.model.message';

@connect(({ productTraceability, loading }) => ({
  productTraceability,
  fetchWorkcellListLoading: loading.effects['productTraceability/fetchWorkcellList'],
  fetchWorkcellDetailLoading: loading.effects['productTraceability/fetchWorkcellDetail'],
  fetchEquipmentLoading: loading.effects['productTraceability/fetchEquipment'],
  fetchExceptionLoading: loading.effects['productTraceability/fetchException'],
  fetchNcListLoading: loading.effects['productTraceability/fetchNcList'],
  fetchReverseLoading: loading.effects['productTraceability/fetchReverse'],
  printSnReportLoading: loading.effects['productTraceability/printSnReport'] || loading.effects['productTraceability/printSnReportCheck'],
  fetchDetailLoading: loading.effects['productTraceability/printSnReport'] || loading.effects['productTraceability/fetchDetail'],
  fetchPumpListLoading: loading.effects['productTraceability/fetchPumpList'],
  tenantId: getCurrentOrganizationId(),
}))
@formatterCollections({
  code: 'tarzan.hmes.message',
})
export default class ProductTraceability extends Component {
  constructor(props) {
    super(props);
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    this.state = {
      visible: false,
      spinning: false,
      reverseVisible: false,
      loadedKeys: [],
      expandedKeys: [],
      record: {}, // 工序流转行数据
      routerParamState: routerParam,
      reverseFormVal: {}, // 反向查询form暂存数据
      showDetail: false, // 展开数据
    };
  }

  componentDidMount() {
    const routerParam = qs.parse(this.props.history.location.search.substr(1));
    if (routerParam.snNum) {
      this.handleSearch(this.state.routerParamState);
    }
  }

  componentWillReceiveProps(nextProps) {
    const routerParam = qs.parse(nextProps.history.location.search.substr(1));
    const { routerParamState } = this.state;
    if (routerParam.snNum && (routerParam.snNum !== routerParamState.snNum)) {
      this.setState(
        {
          routerParamState: routerParam,
          reverseFormVal: {},
        },
        () => this.handleSearch(routerParam)
      );
      this.fetchProductComponent(routerParam);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productTraceability/updateState',
      payload: {
        treeSelectedKeys: [], // 选中的节点
        productComponentList: [], // 树形数据
        ncList: [], // 不良信息
        processTransferList: [],
        equipmentList: [], // 设备列表
        itemList: [],
        processQualityList: [],
        errorList: [], // 异常信息
      },
    });
  }


  @Bind()
  handleSearch(routerParam = {}) {
    // 清空数据
    const { dispatch } = this.props;
    dispatch({
      type: 'productTraceability/updateState',
      payload: {
        equipmentList: [], // 设备列表
        itemList: [], // 物料
        processQualityList: [], // 工艺质量
        errorList: [], // 异常信息
      },
    });
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'productTraceability/fetchWorkcellList',
      payload: {
        ...filterValue,
        eoIdentification: routerParam.snNum ? routerParam.snNum : filterValue.eoNum,
      },
    });
    this.fetchProductComponent(routerParam);
  }

  /**
   * 打印报告
   */
  @Bind
  handlePrint() {
    const {
      dispatch,
    } = this.props;
    if (this.formDom) {
      this.formDom.validateFields((err, fieldsValue) => {
        if (!err) {
          dispatch({
            type: 'productTraceability/printSnReportCheck',
            payload: fieldsValue,
          }).then(resCheck => {
            if (resCheck) {
              dispatch({
                type: 'productTraceability/printSnReport',
                payload: fieldsValue,
              }).then(res => {
                if (res) {
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
                    } else {
                      notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
                    }
                  }
                } else {
                  notification.error({ message: '当前窗口已被浏览器拦截，请手动设置浏览器！' });
                }
              });
            }
          });
        } else {
          notification.error({ message: '请先扫描SN条码' });
          document.getElementById("snInput").focus();
          document.getElementById("snInput").select();
        }
      });
    }

  }

  /**
   * @description: 查询产品组件-异步加载树
   * @param {Object} params SN条码或当前层的序列号
   */
  @Bind()
  fetchProductComponent(params) {
    const { dispatch } = this.props;
    this.setState({ spinning: true });
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    dispatch({
      type: 'productTraceability/fetchProductComponent',
      payload: {
        materialLotCode: filterValue.eoNum || params.snNum,
        parentType: 'Y',
      },
    }).then(() => {
      this.setState({ loadedKeys: [], expandedKeys: [] });
      this.setState({ spinning: false });
    });
  }

  /**
   * @description: 点击工序流转某一行
   * @param {Object} record 工序流转行数据
   */
  @Bind()
  handleFetchWorkcellDetail(record = {}) {
    const { dispatch } = this.props;
    this.setState({ record });
    dispatch({
      type: 'productTraceability/fetchWorkcellDetail',
      payload: {
        ...record,
      },
    });
    // 设备
    dispatch({
      type: 'productTraceability/fetchEquipment',
      payload: {
        ...record,
      },
    });
    // 异常
    dispatch({
      type: 'productTraceability/fetchException',
      payload: {
        ...record,
      },
    });
  }

  @Bind()
  handleSave() { }

  /**
   * @description: 查找不良信息
   * @param {type} params
   */
  @Bind()
  fetchBadInfo() {
    this.setState({ visible: true });
    const { record } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'productTraceability/fetchNcList',
      payload: {
        ...record,
      },
    });
  }

  @Bind()
  drawerVisible(flag) {
    this.setState({ visible: flag });
  }

  /**
   * @description: 保存展开层级的key
   * @param {String} params 展开层级的key
   */
  @Bind()
  saveloadedKeys(params) {
    const { loadedKeys = [] } = this.state;
    loadedKeys.push(params);
  }

  /**
   * @description: 展开时调用的
   * @param {String} params 层级key
   */
  @Bind()
  saveExpandedKeys(params) {
    this.setState({ expandedKeys: params });
  }

  // 逆行查询
  @Bind()
  fetchReverse(fields = {}) {
    const fieldsValue = (this.reverseForm && filterNullValueObject(this.reverseForm.getFieldsValue())) || {};
    const { dispatch } = this.props;
    dispatch({
      type: 'productTraceability/fetchReverse',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState({ reverseVisible: true });
      }
    });
  }

  /**
   * @description: 逆向追溯查询
   * @param {type} params
   */
  @Bind()
  reverseHandleSearch(record) {
    const param = { snNum: record };
    this.formDom.resetFields();
    this.setState(
      { reverseFormVal: param, reverseVisible: false },
      () => {
        this.handleSearch({ snNum: record });
      }
    );
  }

  // 关闭追溯
  @Bind()
  onCancelReverse() {
    this.setState({ reverseVisible: false });
  }

  // 展开界面数据
  @Bind()
  showDetailData(materialLotCode) {
    this.setState({ showDetail: true }, () => {
      const { dispatch } = this.props;
      dispatch({
        type: 'productTraceability/fetchDetail',
        payload: {
          materialLotCode,
        },
      });
    });
  }

  // 关闭界面
  @Bind()
  closeDetailData() {
    this.setState({ showDetail: false });
  }

  @Bind()
  handleGetFormValue() {
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject({
      ...value,
      eoIdentification: value.eoNum,
    });
    return filterValue;
  }

  @Bind()
  handleFetchPumpList() {
    const { dispatch } = this.props;
    dispatch({
      type: `productTraceability/fetchPumpList`,
      payload: {
        identification: this.formDom.getFieldValue('eoNum'),
      },
    });
  }


  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { visible, spinning, loadedKeys, expandedKeys = [], routerParamState = {}, reverseVisible, reverseFormVal } = this.state;
    const {
      fetchWorkcellListLoading,
      fetchWorkcellDetailLoading,
      fetchEquipmentLoading,
      fetchExceptionLoading,
      fetchNcListLoading,
      fetchReverseLoading,
      printSnReportLoading,
      fetchDetailLoading,
      tenantId,
      fetchPumpListLoading,
      productTraceability: {
        processTransferList = [],
        equipmentList = [],
        itemList = [],
        processQualityList = [],
        errorList = [],
        ncList = [],
        reverseist = [],
        reverseistPagination = {},
        detailList = [],
        pumpInfo = {},
        pumpList = [],
      },
    } = this.props;
    const filterProps = {
      onRef: node => {
        this.formDom = node.props.form;
      },
      printSnReportLoading,
      routerParamState,
      reverseFormVal,
      onSearch: this.handleSearch,
      onPrint: this.handlePrint,
    };
    const processTransferProps = {
      loading: fetchWorkcellListLoading,
      dataSource: processTransferList,
      fetchBadInfo: this.fetchBadInfo,
      onFetchWorkcellDetail: this.handleFetchWorkcellDetail,
    };
    const equipmentProps = {
      dataSource: equipmentList,
      loading: fetchEquipmentLoading,
    };
    const itemListProps = {
      loading: fetchWorkcellDetailLoading,
      dataSource: itemList,
    };
    const processQualityProps = {
      loading: fetchWorkcellDetailLoading,
      dataSource: processQualityList,
    };
    const errorInfoProps = {
      dataSource: errorList,
      loading: fetchExceptionLoading,
    };
    const reverseProps = {
      fetchReverseLoading,
      onRef: node => {
        this.reverseForm = node.props.form;
      },
      fetchReverse: this.fetchReverse,
    };
    const pumpListModalProps = {
      pumpInfo,
      onFetchPumpList: this.handleFetchPumpList,
      dataSource: pumpList,
      loading: fetchPumpListLoading,
    };
    const value = this.formDom ? this.formDom.getFieldsValue() : {};
    const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
    return (
      <React.Fragment>
        <Header title='产品生产履历查询'>
          <Button
            data-code="search"
            type="primary"
            icon="printer"
            loading={printSnReportLoading}
            onClick={() => this.handlePrint()}
            style={{ marginLeft: '8px' }}
          >
            连续激光器检验报告打印
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${tenantId}/hme-eo-trace-back/eo-workcell-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            fillerTypeInitialValue="multi-sheet"
            fileName="产品生产履历查询.xlsx"
          />
          {!isEmpty(filterValue) && (
            <PumpListModal {...pumpListModalProps} />
          )}
        </Header>
        <Content style={{ backgroundColor: 'transparent', margin: '0px' }}>
          <Row style={{ marginBottom: '10px', backgroundColor: '#fff' }}>
            <Col span={12}>
              <FilterForm {...filterProps} />
            </Col>
            <Col span={12}>
              <ReverseForm
                {...reverseProps}
              />
            </Col>
          </Row>
          <Row>
            <Col span={8} style={{ paddingRight: '10px' }}>
              <Scrollbars style={{ height: '800px', backgroundColor: '#fff' }}>
                <div className={styles.tree}>
                  <Spin spinning={spinning}>
                    <SelectTree
                      filterValue={filterValue}
                      loadedKeys={loadedKeys}
                      showDetailData={this.showDetailData}
                      expandedKeysProps={expandedKeys}
                      saveloadedKeys={this.saveloadedKeys}
                      saveExpandedKeys={this.saveExpandedKeys}
                    />
                  </Spin>
                </div>
              </Scrollbars>
            </Col>
            <Col span={16} style={{ padding: '5px 5px' }}>
              <Row>
                <Col span={24}>
                  <ProcessTransfer {...processTransferProps} />
                </Col>
                <Col span={24}>
                  <EquipmentList {...equipmentProps} />
                </Col>
                <Col span={24}>
                  <ItemList {...itemListProps} />
                </Col>
                <Col span={24}>
                  <ProcessQuality {...processQualityProps} />
                </Col>
                <Col span={24}>
                  <ErrorInfo {...errorInfoProps} />
                </Col>
              </Row>
            </Col>
          </Row>
          {visible && (
            <BadInfoDrawer
              visible={visible}
              onCancel={this.drawerVisible}
              loading={fetchNcListLoading}
              dataSource={ncList}
            />
          )}
          {reverseVisible && (
            <ReverseDrawer
              visible={reverseVisible}
              onCancel={this.onCancelReverse}
              handleSearch={this.reverseHandleSearch}
              loading={fetchReverseLoading}
              dataSource={reverseist}
              pagination={reverseistPagination}
              onSearch={this.fetchReverse}
            />
          )}
          {this.state.showDetail && (
            <DetailDrawer
              visible={this.state.showDetail}
              onCancel={this.closeDetailData}
              loading={fetchDetailLoading}
              dataSource={detailList}
            />
          )}
        </Content>
      </React.Fragment>
    );
  }
}
