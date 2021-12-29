/*
 * @Description: 来料录入增强版
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-22 09:58:55
 * @LastEditTime: 2020-11-12 10:59:58
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Button, Icon, Popconfirm } from 'hzero-ui';
import queryString from 'querystring';
// import ExcelExport from 'components/ExcelExport';
import {
  getCurrentOrganizationId,
  filterNullValueObject,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import { isEmpty, isUndefined } from 'lodash';
import notification from 'utils/notification';
import EnterSite from '@/components/EnterSite';
import { openTab } from 'utils/menuTab';
import gwPath from '@/assets/gw.png';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import LeftTable from './Component/LeftTable';
import FilterForm from './FilterForm';
import styles from './index.less';
import MainMaterialModal from './Component/MainMaterialModal';
import MaterialBarCodeModal from './Component/MaterialBarCodeModal';


@connect(({ incomingMaterialEntryPlus, loading }) => ({
  incomingMaterialEntryPlus,
  tenantId: getCurrentOrganizationId(),
  getSiteListLoading: loading.effects['incomingMaterialEntryPlus/getSiteList'],
  fetchWoIncomingRecordLoading: loading.effects['incomingMaterialEntryPlus/fetchWoIncomingRecord'],
  fetchMainMaterialLoading: loading.effects['incomingMaterialEntryPlus/fetchMainMaterial'],
  exportLoading: loading.effects['incomingMaterialEntryPlus/exportExcel'],
}))
export default class IncomingMaterialEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spinning: false,
      enterSiteLoading: false,
      mainVisible: false,
      materialVisible: false,
    };
  }

  HandoverMatterForm;

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
    if (!enterSiteVisible) {
      this.fetchWoIncomingRecord();
    }
  }

  componentWillUnmount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'incomingMaterialEntryPlus/updateState',
    //   payload: {
    //   },
    // });
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
          notification.error({ message: `当前${res.workcellName}存在多个工艺，请重新扫描！` });
        } else {
          dispatch({
            type: 'incomingMaterialEntryPlus/updateState',
            payload: {
              enterSiteVisible: false,
            },
          });
          this.fetchWoIncomingRecord();
        }
      }
    });
  }

  /**
   * @description: 查询工单来料信息记录
   * @param {type} params
   * @return {Object} 工单来料记录
   */
  @Bind()
  fetchWoIncomingRecord(fields = {}) {
    const {
      dispatch,
      tenantId,
      incomingMaterialEntryPlus: { workcellInfo = {} },
    } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'incomingMaterialEntryPlus/fetchWoIncomingRecord',
      payload: {
        tenantId,
        operationId: workcellInfo.operationId,
        prodLineId: workcellInfo.prodLineId,
        workcellId: workcellInfo.workcellId,
        ...fieldsValue,
        creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
          ? null
          : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isUndefined(fieldsValue.creationDateTo)
          ? null
          : moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 跳转创建页面
  @Bind()
  handleCreateWOVisible(val) {
    const { history } = this.props;
    history.push(`/hhme/incoming-material-entry-plus/${val}`);
  }

  // 跳转创建页面
  @Bind()
  handleCreateWaferWOVisible(val) {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/updateState',
      payload: {
        primaryUomQty: 0,
        splitQty: 0,
      },
    });
    history.push(`/hhme/incoming-material-entry-plus/wafer/${val}`);
  }

  // 跳转创建页面
  @Bind()
  handleSixImportVisible() {
    const { history} = this.props;
    history.push(`/hhme/incoming-material-entry-plus/six/import`);
  }

  // 打开组键物料
  @Bind()
  openMainMaterial(record, flag) {
    this.setState({ mainVisible: flag });
    if (flag) {
      this.fetchMainMaterial(record);
    }
  }

  // 查询组件物料
  @Bind()
  fetchMainMaterial(record) {
    const { dispatch } = this.props;
    return dispatch({
      type: `incomingMaterialEntryPlus/fetchMainMaterial`,
      payload: {
        ...record,
      },
    });
  }

  // 查询物料条码
  @Bind()
  fetchMaterialBarCode(flag, record) {
    if (flag) {
      this.setState({ materialVisible: flag });
      this.fetchWorkDetails(record);
    } else {
      this.setState({ materialVisible: flag });
    }
  }

  @Bind()
  fetchWorkDetails(record) {
    const {
      dispatch,
      incomingMaterialEntryPlus: { workcellInfo = {}, defaultSite = {} },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/fetchWorkDetails',
      payload: {
        operationRecordId: record.operationRecordId,
        operationId: workcellInfo.operationId,
        workcellId: workcellInfo.workcellId,
        siteId: defaultSite.siteId,
      },
    });
  }

  /**
   * 批量导入
   */
  @Bind()
  handleBatchImport() {
    const { incomingMaterialEntryPlus: { workcellInfo = {} } } = this.props;
    const param = {
      workcellId: workcellInfo.workcellId,
      operationId: workcellInfo.operationIdList[0],
      wkcShiftId: workcellInfo.wkcShiftId,
    };
    openTab({
      key: '/hhme/incoming-import/HME.COS_CHIP_NUM_IMP',
      search: queryString.stringify({
        // prefixPath: '/mes-8736',
        key: '/hhme/incoming-import/HME.COS_CHIP_NUM_IMP',
        title: '来料录入导入',
        action: '来料录入导入',
        // eslint-disable-next-line no-useless-concat
        args: JSON.stringify(param),
        // args: "{\"args\":\"cos-ll\"}",
        auto: true,
      }),
    });
  }

  // 登出操作
  @Bind()
  loginOut(workcellName) {
    const { dispatch } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/updateState',
      payload: {
        enterSiteVisible: true,
        woIncomingRecordListPagination: {},
        woIncomingRecordList: [],
        workcellInfo: {},
      },
    });
    notification.success({message: `当前工位 ${workcellName} 成功登出，请登陆新工位！`});
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    const {
      dispatch,
      incomingMaterialEntryPlus: { workcellInfo = {} },
    } = this.props;
    dispatch({
      type: 'incomingMaterialEntryPlus/exportExcel',
      payload: {
        operationId: workcellInfo.operationId,
        prodLineId: workcellInfo.prodLineId,
        workcellId: workcellInfo.workcellId,
        ...fieldsValue,
        creationDateFrom: isUndefined(fieldsValue.creationDateFrom)
          ? null
          : moment(fieldsValue.creationDateFrom).format(DEFAULT_DATETIME_FORMAT),
        creationDateTo: isUndefined(fieldsValue.creationDateTo)
          ? null
          : moment(fieldsValue.creationDateTo).format(DEFAULT_DATETIME_FORMAT),
      },
    }).then(res => {
      if(res){
        const file = new Blob(
          [res],
          { type: 'application/vnd.ms-excel' }
        );
        const fileURL = URL.createObjectURL(file);
        const fileName = '来料录入报表.xlsx';
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = fileURL;
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      }
    });
  }

  render() {
    const {
      incomingMaterialEntryPlus: {
        lovData = {},
        workcellInfo = {},
        enterSiteVisible,
        woIncomingRecordList = [],
        woIncomingRecordListPagination = {},
        mainMaterialList = [],
        materialList = [],
      },
      fetchWoIncomingRecordLoading,
      fetchMainMaterialLoading,
      exportLoading,
    } = this.props;
    const { enterSiteLoading, mainVisible, materialVisible } = this.state;
    const filterFormProps = {
      lovData,
      onSearch: this.fetchWoIncomingRecord,
      onRef: node => {
        this.filterForm = node.props.form;
      },
    };
    const leftTableProps = {
      dataSource: woIncomingRecordList,
      pagination: woIncomingRecordListPagination,
      loading: fetchWoIncomingRecordLoading,
      onSearch: this.fetchWoIncomingRecord,
      openMainMaterial: this.openMainMaterial,
      fetchMaterialBarCode: this.fetchMaterialBarCode,
      handleCreateWOVisible: this.handleCreateWOVisible,
    };
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: false || enterSiteLoading,
      closePath: '/hhme/incoming-material-entry-plus',
      enterSite: this.enterSite,
    };
    const mainMaterialProps = {
      dataSource: mainMaterialList,
      visible: mainVisible,
      loading: fetchMainMaterialLoading,
      onCancel: this.openMainMaterial,
    };
    const materialBarCodeModalProps = {
      visible: materialVisible,
      dataSource: materialList,
      onSelectRow: this.handleSelectRow,
      fetchMaterialBarCode: this.fetchMaterialBarCode,
    };
    return (
      <Fragment>
        <Header title="来料录入">
          {/* <Button
            icon="to-top"
            onClick={this.handleBatchImport}
          >
            批量导入
          </Button> */}
          <Button type="primary" icon="plus" onClick={() => this.handleCreateWOVisible('create')}>
            新建
          </Button>
          <Button type="primary" icon="plus" onClick={() => this.handleCreateWaferWOVisible('create')}>
            来料WAFER创建
          </Button>
          <Button type="primary" icon="plus" onClick={() => this.handleSixImportVisible()}>
            六型芯片导入
          </Button>
          <Button type="primary" icon="download" htmlType="submit" onClick={() => this.handleGetFormValue()} loading={exportLoading}>
            导出
          </Button>
        </Header>
        <Content style={{ padding: '8px' }}>
          <Spin spinning={this.state.spinning}>
            <Row gutter={16}>
              <Col span={18} className={styles['incoming-material-entry-table']}>
                <FilterForm {...filterFormProps} />
              </Col>
              <Col span={6}>
                <Card className={styles['incoming-material-entry-site-card-plus']}>
                  <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                  <div style={{
                    float: 'left', padding: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '255px',
                  }}
                  >当前工位：{workcellInfo.workcellName}
                  </div>
                  <div style={{ float: 'right', padding: '2px' }}>
                    <Popconfirm
                      title={`当前工位：${workcellInfo.workcellName} 是否登出！`}
                      onConfirm={() => this.loginOut(workcellInfo.workcellName)}
                    >
                      <a>
                        <Icon type="poweroff" style={{ marginRight: '4px' }} />
                        登出
                      </a>
                    </Popconfirm>
                  </div>
                </Card>
              </Col>
            </Row>
            <LeftTable {...leftTableProps} />
          </Spin>
          {enterSiteVisible && <EnterSite {...enterSiteProps} />}
          {mainVisible && <MainMaterialModal {...mainMaterialProps} />}
          {materialVisible && <MaterialBarCodeModal {...materialBarCodeModalProps} />}
        </Content>
      </Fragment>
    );
  }
}
