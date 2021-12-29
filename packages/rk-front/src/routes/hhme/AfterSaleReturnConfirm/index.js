/*
 * @Description: 退库检测
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-10-12 23:46:46
 * @LastEditTime: 2021-03-04 17:53:38
 */

import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Row, Col, Spin, Card, Button, Form, Tooltip } from 'hzero-ui';
import {
  getCurrentOrganizationId,
  getEditTableData,
  filterNullValueObject,
} from 'utils/utils';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import EnterSite from '@/components/EnterSite';
import gwPath from '@/assets/gw.png';
import TopFormInfo from './TopFormInfo';
import ListTable from './ListTable';
import styles from './index.less';

@connect(({ afterSaleReturnConfirm, loading }) => ({
  afterSaleReturnConfirm,
  saveDataLoading: loading.effects['afterSaleReturnConfirm/saveData'],
  finishDataLoading: loading.effects['afterSaleReturnConfirm/finishData'],
  tenantId: getCurrentOrganizationId(),
}))
@Form.create({ fieldNameProp: null })
export default class AfterSaleReturnConfirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enterSiteLoading: false,
      enterSiteVisible: true,
      spinning: false,
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'afterSaleReturnConfirm/getSiteList',
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'afterSaleReturnConfirm/updateState',
      payload: {
        workcellInfo: {}, // 工位信息
        defaultSite: {},
        info: {}, // 扫描返回的信息
        recordList: [],
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
      afterSaleReturnConfirm: {
        defaultSite = {},
      },
    } = this.props;
    dispatch({
      type: 'afterSaleReturnConfirm/enterSite',
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

  /**
   * 编辑消息
   */
  @Bind()
  handleEditData(record, flag) {
    const {
      dispatch,
      afterSaleReturnConfirm: {
        recordList = [],
      },
    } = this.props;
    const newList = recordList.map(item => {
      if (record.serviceDataRecordId === item.serviceDataRecordId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'afterSaleReturnConfirm/updateState',
      payload: { recordList: newList },
    });
  }

  /**
   * @description: 扫描条码
   * @param {type} params
   */
  @Bind()
  scaneMaterialCode(vals) {
    const {
      dispatch,
      tenantId,
      afterSaleReturnConfirm: { workcellInfo = {} },
    } = this.props;
    this.setState({ spinning: true });
    dispatch({
      type: 'afterSaleReturnConfirm/scaneMaterialCode',
      payload: {
        tenantId,
        snNum: vals,
        operationId: workcellInfo.operationId,
        wkcShiftId: workcellInfo.wkcShiftId,
        workcellId: workcellInfo.workcellId,
      },
    }).then(() => {
      this.setState({ spinning: false });
    });
  }

  // 保存数据
  @Bind()
  saveData() {
    const {
      dispatch,
      afterSaleReturnConfirm: {
        recordList = [],
      },
      tenantId,
    } = this.props;
    const params = getEditTableData(recordList);
    const recordListArr = [];
    params.forEach(item => {
      recordListArr.push({
        ...item,
        tagIdList: typeof (item.tagIdList) === 'string' ? [] : item.tagIdList,
        result: typeof (item.tagIdList) === 'string' && item.tagIdList,
      });
    });
    dispatch({
      type: 'afterSaleReturnConfirm/saveData',
      payload: {
        tenantId,
        recordList: recordListArr,
      },
    }).then(res => {
      if (res) {
        notification.success();
        const fieldsValue = (this.topform && filterNullValueObject(this.topform.getFieldsValue())) || {};
        this.scaneMaterialCode(fieldsValue.snNum);
      }
    });
  }

  // 完成
  @Bind()
  finishData() {
    const {
      dispatch,
      afterSaleReturnConfirm: {
        info = {},
      },
      tenantId,
    } = this.props;
    dispatch({
      type: 'afterSaleReturnConfirm/finishData',
      payload: {
        tenantId,
        serviceReceiveId: info.serviceReceiveId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        dispatch({
          type: 'afterSaleReturnConfirm/updateState',
          payload: {
            info: {},
            recordList: [],
          },
        });
        this.topform.resetFields();
      }
    });
  }

  // 判断完成按钮是否可点击
  @Bind()
  renderFinishBut() {
    const {
      afterSaleReturnConfirm: {
        recordList = [],
      },
    } = this.props;
    const arr = recordList.filter(
      ele => ele._status === 'update' || ele._status === 'create'
    );
    if (arr.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { enterSiteLoading, spinning, enterSiteVisible } = this.state;
    const {
      afterSaleReturnConfirm: {
        workcellInfo = {},
        info = {},
        recordList = [],
      },
      saveDataLoading,
      finishDataLoading,
    } = this.props;
    const enterSiteProps = {
      visible: enterSiteVisible,
      loading: false || enterSiteLoading,
      closePath: '/hhme/after-sale-return-confirm',
      enterSite: this.enterSite,
    };
    const topFormInfoProps = {
      info,
      onRef: node => {
        this.topform = node.props.form;
      },
      scaneMaterialCode: this.scaneMaterialCode,
    };
    const tableListProps = {
      info,
      dataSource: recordList,
      handleEditData: this.handleEditData,
    };
    return (
      <Fragment>
        <Header title="售后退库检测平台">
          <Button
            icon="save"
            type="primary"
            onClick={() => this.saveData()}
            loading={saveDataLoading}
          >
            保存
          </Button>
          <Button
            onClick={() => this.finishData()}
            loading={finishDataLoading}
            disabled={this.renderFinishBut()}
          >
            完成
          </Button>
        </Header>
        <Content style={{ padding: '8px' }}>
          <Spin spinning={spinning}>
            <Row gutter={8}>
              <Col span={20}>
                <Card className={styles['top-info']}>
                  <TopFormInfo {...topFormInfoProps} />
                </Card>
              </Col>
              <Col span={4}>
                <Card className={styles['after-sale-return-confirm-site']}>
                  <div style={{ float: 'left' }}><img src={gwPath} alt="" /></div>
                  <Tooltip title={workcellInfo.workcellName}>
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      当前工位：{workcellInfo.workcellName}
                    </div>
                  </Tooltip>
                </Card>
                <Card className={styles['after-sale-return-confirm-site-link-card']}>
                  <div className={styles['incoming-material-entry-link-button']}>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>制造履历</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                    <div>
                      <span className={styles['incoming-material-entry-link-span']} />
                      <span>E-SOP</span>
                      <span className={styles['incoming-material-entry-link-quantity']}>查看</span>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <Row style={{ marginTop: '8px' }} className={styles['after-sale-return-table-result']}>
              <ListTable {...tableListProps} />
            </Row>
          </Spin>
          {enterSiteVisible && <EnterSite {...enterSiteProps} />}
        </Content>
      </Fragment>
    );
  }
}
