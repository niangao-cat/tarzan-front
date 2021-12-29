/**
 * PfepInventoryDist - 物料存储属性维护编辑
 * @date: 2019-8-19
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Card, Icon, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';

import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
import { isUndefined, isNull } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import DisplayForm from './DisplayForm';
import CopyDrawer from './CopyDrawer';
import AttrTable from './AttributeTable';
/**
 * 物料存储属性维护编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} pfepInventory - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
@connect(({ pfepInventory, loading }) => ({
  pfepInventory,
  fetchLoading: loading.effects['pfepInventory/fetchPfepInventoryLineList'],
}))
@formatterCollections({ code: 'tarzan.product.inv' })
@Form.create({ fieldNameProp: null })
export default class PfepInventoryDist extends React.Component {
  form;

  state = {
    buttonFlag: true,
    editFlag: true,
    expandForm: true,
    copyDrawerVisible: false,
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const kid = match.params.id;
    const keyType = match.params.type;
    dispatch({
      type: 'pfepInventory/fetchIdentifyTypeListList',
      payload: {
        module: 'MATERIAL',
        typeGroup: 'IDENTITY_TYPE',
      },
    });
    if (kid === 'create') {
      dispatch({
        type: 'pfepInventory/updateState',
        payload: {
          displayList: {},
          attrList: [],
        },
      });
      return;
    }
    dispatch({
      type: 'pfepInventory/fetchPfepInventoryLineList',
      payload: {
        kid,
        type: keyType,
      },
    });
  }

  // 保存/编辑
  @Bind()
  toggleEdit() {
    const { match } = this.props;
    const kid = match.params.id;
    const { buttonFlag } = this.state;
    if (kid === 'create') {
      this.handleSaveAll();
    } else {
      this.setState({ buttonFlag: !buttonFlag });
      if (buttonFlag) {
        this.handleEdit();
      } else {
        this.handleSaveAll();
      }
    }
  }

  // 点击编辑
  @Bind
  handleEdit() {
    this.setState({
      editFlag: false,
    });
  }

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind
  handleSaveAll() {
    const {
      dispatch,
      match,
      history,
      pfepInventory: { displayList = {}, attrList = [] },
    } = this.props;
    const kid = match.params.id === 'create' ? undefined : match.params.id;
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const {
          packageWidth,
          identifyType,
          maxStockQty,
          minStockQty,
          packageHeight,
          packageLength,
          packageWeight,
          materialCategoryId,
          materialId,
          siteId,
          completionLocatorId,
          identifyId,
          issuedLocatorId,
          packageSizeUomId,
          stockLocatorId,
          weightUomId,
          areaId,
          prodLineId,
          workcellId,
          locatorId,
        } = fieldsValue;

        let count = 0;
        let organizationType;
        if (!isUndefined(areaId) && !isNull(areaId)) {
          count++;
          organizationType = 'AREA';
        }
        if (!isUndefined(prodLineId) && !isNull(prodLineId)) {
          count++;
          // organizationType = 'PROD_LINE';
          organizationType = 'PRODUCTIONLINE';
        }
        if (!isUndefined(workcellId) && !isNull(workcellId)) {
          count++;
          organizationType = 'WORKCELL';
        }
        if (!isUndefined(locatorId) && !isNull(locatorId)) {
          count++;
          organizationType = 'LOCATOR';
        }
        if (isUndefined(materialId) && isUndefined(materialCategoryId)) {
          Modal.warning({
            title: intl
              .get('tarzan.product.inv.message.mustOne')
              .d('物料和物料类别必须维护其中一条信息'),
          });
          return null;
        } else if (count > 1) {
          Modal.warning({
            title: intl
              .get('tarzan.product.inv.message.onlyOne')
              .d('区域,生产线,工作单元,库位只能维护一项'),
          });
          return null;
        } else {
          const organizationId =
            displayList.organizationId || locatorId || workcellId || prodLineId || areaId;
          dispatch({
            type: 'pfepInventory/savePfepInventory',
            payload: {
              materialId,
              materialCategoryId,
              siteId,
              enableFlag: fieldsValue.enableFlag ? 'Y' : 'N',
              kid,
              organizationId,
              organizationType,
              completionLocatorId,
              identifyId,
              issuedLocatorId,
              packageSizeUomId,
              stockLocatorId,
              weightUomId,
              packageWidth,
              identifyType,
              maxStockQty,
              minStockQty,
              packageHeight,
              packageLength,
              packageWeight,
              mtPfepInventoryAttrs: attrList || [],
            },
          }).then(res => {
            if (res && res.success) {
              notification.success();
              this.setState({
                editFlag: true,
              });
              history.push(`/product/pfep-inventory/dist/${res.rows.type}/${res.rows.kid}`);
              dispatch({
                type: 'pfepInventory/fetchPfepInventoryLineList',
                payload: {
                  kid: res.rows.kid,
                  type: res.rows.type,
                },
              });
            } else {
              notification.error({ message: res.message });
            }
          });
        }
      }
    });
  }

  // 表单展开/收起
  @Bind()
  toggleForm() {
    const { expandForm } = this.state;
    this.setState({ expandForm: !expandForm });
  }

  // 打开复制抽屉
  @Bind
  handleCopyDrawerShow() {
    this.setState({ copyDrawerVisible: true });
  }

  // 关闭复制抽屉
  @Bind
  handleCopyDrawerCancel() {
    this.setState({ copyDrawerVisible: false });
  }

  // 复制抽屉确认
  @Bind
  handleCopyDrawerOk(fieldsValue) {
    const { dispatch, history } = this.props;
    dispatch({
      type: 'pfepInventory/copyPfepInventory',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.setState({ copyDrawerVisible: false });
        history.push(`/product/pfep-inventory/dist/${res.rows.type}/${res.rows.kid}`);
        dispatch({
          type: 'pfepInventory/fetchPfepInventoryLineList',
          payload: {
            kid: res.rows.kid,
            type: res.rows.type,
          },
        });
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      pfepInventory: { displayList = {} },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const kid = match.params.id;
    const keyType = match.params.type;
    const { buttonFlag, editFlag, expandForm, copyDrawerVisible } = this.state;
    const title = (
      <span>
        {intl.get('tarzan.product.inv.title.detail').d('物料存储属性明细')}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={this.toggleForm}>
          {expandForm
            ? intl.get(`tarzan.product.inv.button.up`).d('收起')
            : intl.get(`tarzan.product.inv.button.expand`).d('展开')}
          <Icon type={expandForm ? 'up' : 'down'} />
        </a>
      </span>
    );
    const copyDrawerProps = {
      visible: copyDrawerVisible,
      onCancel: this.handleCopyDrawerCancel,
      onOk: this.handleCopyDrawerOk,
      initData: displayList,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.product.inv.title.list').d('物料存储属性维护')}
          backPath={`${basePath}/list`}
        >
          <React.Fragment>
            {buttonFlag && kid !== 'create' ? (
              <Button type="primary" icon="edit" onClick={this.toggleEdit}>
                {intl.get('tarzan.product.inv.button.edit').d('编辑')}
              </Button>
            ) : (
              <Button type="primary" icon="save" onClick={this.toggleEdit}>
                {intl.get('tarzan.product.inv.button.save').d('保存')}
              </Button>
            )}
            <Button
              icon="copy"
              disabled={isUndefined(editFlag) ? true : editFlag}
              style={{ marginLeft: '10px' }}
              onClick={this.handleCopyDrawerShow}
            >
              {intl.get('tarzan.product.inv.button.copy').d('复制')}
            </Button>
            {/* <Button type="primary" onClick={this.toggleEdit}>
              {kid === 'create'
                ? intl.get('tarzan.product.inv.button.save').d('保存')
                : buttonFlag
                ? intl.get('tarzan.product.inv.button.edit').d('编辑')
                : intl.get('tarzan.product.inv.button.save').d('保存')}
            </Button> */}
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
          {expandForm && <DisplayForm onRef={this.onRef} kid={kid} editFlag={editFlag} />}
          <Card
            key="code-rule-header"
            title={intl.get('tarzan.product.inv.title.field').d('扩展字段')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <AttrTable editFlag={isUndefined(editFlag) ? true : editFlag} keyType={keyType} />
          </Card>
        </Content>
        <CopyDrawer {...copyDrawerProps} />
      </React.Fragment>
    );
  }
}
