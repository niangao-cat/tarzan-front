/**
 * AssemblyDist - 装配清单明细编辑
 * @date: 2019-7-23
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Card, Icon, Spin, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';

import { Header, Content } from 'components/Page';
import moment from 'moment';
import intl from 'utils/intl';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import { filterNullValueObject } from 'utils/utils';
import { isUndefined } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import DisplayForm from './DisplayForm';
import CopyDrawer from './CopyDrawer';
import SiteDrawer from './SiteDrawer';
import ExpandFieldDrawer from './ExpandFieldDrawer';
import ComponentLineTable from './ComponentLineTable';
import accessOrgBtn from '@/assets/accessOrgBtn.png';

const modelPrompt = 'tarzan.product.bom.model.bom';

/**
 * 装配清单明细编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} assemblyList - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  fetchLoading: loading.effects['assemblyList/fetchComponentLineList'],
}))
@formatterCollections({
  code: 'tarzan.product.bom',
})
@Form.create({
  fieldNameProp: null,
})
export default class AssemblyDist extends React.Component {
  form;

  state = {
    copyDrawerVisible: false,
    siteDrawerVisible: false,
    materialName: '',
    expandForm: true,
    initCopyData: {},
    isCreateBomId: true, // 控制是否对复制等操作可点击
    currentBomId: '', // 保存当前页的bomId
    canEdit: false,
  };

  componentWillMount() {
    const { dispatch, match } = this.props;
    const bomId = match.params.id;
    if (bomId !== 'create') {
      this.setState({
        isCreateBomId: false,
        currentBomId: bomId,
      });
      dispatch({
        type: 'assemblyList/fetchComponentLineList',
        payload: {
          bomId,
        },
      });
    } else {
      this.setState({
        canEdit: true,
      });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        displayListDetail: {},
        componentLineList: [],
      },
    });
  }

  /**
   *@functionName:   changeStatus
   *@description 修改编辑状态
   *@author: 唐加旭
   *@date: 2019-08-24 11:09:45
   *@version: V0.8.6
   * */
  @Bind
  changeStatus = () => {
    this.setState({
      canEdit: true,
    });
  };

  // 保存装配清单明细
  @Bind
  handleSaveBomList() {
    const { dispatch, history } = this.props;
    const value = isUndefined(this.form) ? {} : filterNullValueObject(this.form.getFieldsValue());
    const bomId = this.state.currentBomId;
    const self = this;
    this.form.validateFields(err => {
      if (!err) {
        value.bomId = bomId !== '' ? bomId : '';
        value.dateFrom = value.dateFrom ? moment(value.dateFrom).format('YYYY-MM-DD HH:mm:ss') : '';
        value.dateTo = value.dateTo ? moment(value.dateTo).format('YYYY-MM-DD HH:mm:ss') : '';
        value.currentFlag = value.currentFlag ? 'Y' : 'N';
        value.releasedFlag = value.releasedFlag ? 'Y' : 'N';
        value.assembleAsMaterialFlag = value.assembleAsMaterialFlag ? 'Y' : 'N';
        value.autoRevisionFlag = value.autoRevisionFlag ? 'Y' : 'N';
        dispatch({
          type: 'assemblyList/saveAssemblyDetail',
          payload: {
            ...value,
          },
        }).then(res => {
          if (res && res.success && res.rows && res.rows !== 'MT_BOM_0072') {
            notification.success();
            // 返回一个id然后保存下来
            self.setState({
              isCreateBomId: false,
              currentBomId: res.rows,
              canEdit: false,
            });
            history.push(`/hhme/ticket-management/assembly-dist/detail/${res.rows}`);
          } else if (res && !res.success && res.rows && res.rows === 'MT_BOM_0072') {
            Modal.confirm({
              title: '提示',
              content: '该BOM已有当前版本，是否确认更换当前版本？',
              onOk() {
                dispatch({
                  type: 'assemblyList/confirmAssembly',
                  payload: {
                    ...value,
                  },
                }).then(ress => {
                  if (ress && ress.success) {
                    notification.success();
                    // 返回一个id然后保存下来
                    self.setState({
                      isCreateBomId: false,
                      currentBomId: ress.rows,
                      canEdit: false,
                    });
                    history.push(`/hhme/ticket-management/assembly-dist/detail/${res.rows}`);
                  } else {
                    notification.error({
                      message: ress.message,
                    });
                  }
                });
              },
              onCancel() {},
            });
          } else if (res && !res.success) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  }

  // 表单展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  }

  // 打开复制抽屉
  @Bind
  handleCopyDrawerShow() {
    this.setState({
      copyDrawerVisible: true,
    });
  }

  // 关闭复制抽屉
  @Bind
  handleCopyDrawerCancel() {
    this.setState({
      copyDrawerVisible: false,
    });
  }

  // 打开站点分配抽屉
  @Bind
  handleSiteDrawerShow() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/fetchSiteList',
      payload: {
        bomId: this.state.currentBomId,
      },
    });
    this.setState({
      siteDrawerVisible: true,
    });
  }

  // 关闭站点分配抽屉
  @Bind
  handleSiteDrawerCancel() {
    this.setState({
      siteDrawerVisible: false,
    });
  }

  // 打开扩展字段抽屉
  @Bind
  handleExpandFieldDrawerShow() {
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/fetchExtendedAttributeList',
      payload: {
        kid: this.state.currentBomId,
        tableName: 'mt_bom_attr',
      },
    });
    this.setState({
      expandFieldDrawerVisible: true,
    });
  }

  // 关闭扩展字段抽屉
  @Bind
  handleExpandFieldDrawerCancel() {
    this.setState({
      expandFieldDrawerVisible: false,
    });
  }

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
    this.form.resetFields();
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        displayList: [],
        componentLineList: [],
      },
    });
  }

  // 选择组件编码LOV的时候带出描述
  @Bind
  setMaterialName(_, record) {
    this.setState({
      materialName: record.materialName,
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  // 复制抽屉确认
  @Bind
  handleCopyDrawerOk(fieldsValue) {
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/copyBom',
      payload: {
        ...fieldsValue,
        bomId: this.state.currentBomId,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.handleCopyDrawerCancel();
        this.setState({
          currentBomId: res.rows,
        });
        dispatch({
          type: 'assemblyList/fetchComponentLineList',
          payload: {
            bomId: res.rows,
          },
        });
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { fetchLoading } = this.props;
    const {
      initCopyData = {},
      copyDrawerVisible,
      siteDrawerVisible,
      expandFieldDrawerVisible,
      expandForm,
      isCreateBomId,
      currentBomId,
      canEdit,
    } = this.state;
    const lineProps = {
      currentBomId,
      canEdit,
    };
    // 复制参数
    const copyDrawerProps = {
      visible: copyDrawerVisible,
      onCancel: this.handleCopyDrawerCancel,
      onOk: this.handleCopyDrawerOk,
      initData: initCopyData,
    };
    // 站点分配参数
    const siteDrawerProps = {
      visible: siteDrawerVisible,
      onCancel: this.handleSiteDrawerCancel,
      bomId: currentBomId,
      canEdit,
    };
    // 扩展字段参数
    const expandFieldDrawerProps = {
      visible: expandFieldDrawerVisible,
      onCancel: this.handleExpandFieldDrawerCancel,
      onOk: this.handleExpandFieldDrawerCancel,
      bomId: currentBomId,
      canEdit,
    };
    const title = (
      <span>
        {' '}
        {intl.get('tarzan.product.bom.title.detail').d('装配清单明细')}
        <a
          style={{
            marginLeft: '16px',
            fontSize: '12px',
          }}
          onClick={this.toggleForm}
        >
          {' '}
          {expandForm
            ? intl.get(`${modelPrompt}.up`).d('收起')
            : intl.get(`${modelPrompt}.expand`).d('展开')}
          <Icon type={expandForm ? 'up' : 'down'} />
        </a>
      </span>
    );
    return (
      <React.Fragment>
        <Spin spinning={!!fetchLoading}>
          <Header
            title={intl.get('tarzan.product.bom.title.detail').d('装配清单明细')}
            backPath="/hhme/ticket-management"
          >
            <React.Fragment>
              {' '}
              {canEdit ? (
                <Button type="primary" icon="save" onClick={this.handleSaveBomList}>
                  {' '}
                  {intl.get(`${modelPrompt}.save`).d('保存')}
                </Button>
              ) : (
                <Button type="primary" icon="edit" onClick={this.changeStatus}>
                  {' '}
                  {intl.get(`${modelPrompt}.edit`).d('编辑')}
                </Button>
              )}
              <Button
                disabled={isCreateBomId}
                style={{
                  marginLeft: '10px',
                }}
                onClick={this.handleExpandFieldDrawerShow}
                icon="arrows-alt"
              >
                {' '}
                {intl.get(`${modelPrompt}.field`).d('扩展字段')}
              </Button>
              <Button
                disabled={isCreateBomId}
                style={{
                  marginLeft: '10px',
                  paddingLeft: '14px',
                }}
                onClick={this.handleSiteDrawerShow}
              >
                <img
                  src={accessOrgBtn}
                  alt=""
                  style={{
                    height: '14px',
                    margin: '-2px 6px 0 0',
                    opacity: isCreateBomId ? 0.4 : 1,
                  }}
                />
                {intl.get(`${modelPrompt}.site`).d('分配站点')}
              </Button>
              <Button
                icon="copy"
                disabled={isCreateBomId || !canEdit}
                style={{
                  marginLeft: '10px',
                }}
                onClick={this.handleCopyDrawerShow}
              >
                {' '}
                {intl.get(`${modelPrompt}.copy`).d('复制')}
              </Button>
            </React.Fragment>
          </Header>
          <Content>
            <Card
              key="code-rule-header"
              title={title}
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              size="small"
            />
            <div style={expandForm ? null : { display: 'none' }}>
              <DisplayForm onRef={this.onRef} bomId={currentBomId} canEdit={canEdit} />
            </div>
            <Card
              key="code-rule-header"
              title={intl.get('tarzan.product.bom.title.componentLine').d('组件行')}
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
            >
              <ComponentLineTable {...lineProps} />
            </Card>
            <CopyDrawer {...copyDrawerProps} />
            <SiteDrawer {...siteDrawerProps} />
            <ExpandFieldDrawer {...expandFieldDrawerProps} />
          </Content>
        </Spin>
      </React.Fragment>
    );
  }
}
