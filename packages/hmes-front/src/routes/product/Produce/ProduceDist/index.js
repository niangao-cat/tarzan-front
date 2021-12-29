/**
 * PfepInventoryDist - 物料存储属性维护编辑
 * @date: 2019-8-19
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Card, Icon } from 'hzero-ui';
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
 * @reactProps {Object} produce - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */

// const modelPrompt = 'tarzan.product.produce.model.produce';
@connect(({ produce, loading }) => ({
  produce,
  fetchLoading: loading.effects['produce/fetchProduceList'],
  saveLoading: loading.effects['produce/saveProduce'],
}))
@formatterCollections({ code: 'tarzan.product.produce' })
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
    const { match } = this.props;
    const kid = match.params.id;
    const keyType = match.params.type;
    // 获取扩展属性
    if (kid === 'create') {
      //   dispatch({
      //     type: 'produce/fetchAttrCreate',
      //     payload: {
      //       kid: null,
      //       tableName: 'mt_pfep_manufacturing_attr',
      //     },
      //   });
      return;
    }
    // 获取扩展属性
    this.basicData(kid, keyType);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'produce/updateState',
      payload: {
        produceItem: {},
      },
    });
  }

  @Bind()
  basicData = (kid, keyType, reset = () => {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'produce/fetchAttrCreate',
      payload: {
        kid,
        tableName: keyType === 'material' ? 'mt_pfep_manufacturing_attr' : 'mt_pfep_mfg_catg_attr',
      },
    });
    dispatch({
      type: 'produce/fetchSingleProduce',
      payload: {
        kid,
        keyType,
      },
    }).then(res => {
      if (res && res.success) {
        reset();
      }
    });
  };

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
      produce: { produceItem = {}, attributeTabList = [] },
    } = this.props;
    const kid = match.params.id === 'create' ? undefined : match.params.id;
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        const {
          attritionControlQty,
          attritionControlType,
          completeControlQty,
          completeControlType,
          defaultBomId,
          defaultRoutingId,
          enableFlag,
          issueControlQty,
          issueControlType,
          materialCategoryId,
          materialId,
          operationAssembleFlag,
          siteId,
          areaId,
          prodLineId,
          workcellId,
        } = fieldsValue;

        let organizationType;
        if (!isUndefined(areaId) && !isNull(areaId)) {
          organizationType = 'AREA';
        }
        if (!isUndefined(prodLineId) && !isNull(prodLineId)) {
          organizationType = 'PRODUCTIONLINE';
        }
        if (!isUndefined(workcellId) && !isNull(workcellId)) {
          organizationType = 'WORKCELL';
        }
        const organizationId = produceItem.organizationId || workcellId || prodLineId || areaId;
        dispatch({
          type: 'produce/saveProduce',
          payload: {
            materialId,
            materialCategoryId,
            siteId,
            enableFlag: enableFlag ? 'Y' : 'N',
            kid,
            organizationId,
            organizationType,
            attritionControlQty,
            attritionControlType,
            completeControlQty,
            completeControlType,
            defaultBomId,
            defaultRoutingId,
            issueControlQty,
            issueControlType,
            keyType: materialId ? 'material' : 'category',
            operationAssembleFlag: operationAssembleFlag ? 'Y' : 'N',
            mtPfepManufacturingAttrs: attributeTabList,
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            this.setState({
              editFlag: true,
            });
            history.push(
              `/product/produce/dist/${materialId ? 'material' : 'category'}/${res.rows.kid}`
            );
            this.basicData(res.rows.kid, materialId ? 'material' : 'category');
            // dispatch({
            //   type: 'produce/fetchPfepInventoryLineList',
            //   payload: {
            //     kid: res.rows.kid,
            //     type: res.rows.type,
            //   },
            // });
          } else {
            notification.error({ message: res.message });
          }
        });
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
      type: 'produce/checkProduceItem',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.setState({ copyDrawerVisible: false });
        history.push(`/product/produce/dist/${res.rows.type}/${res.rows.kid}`);
        this.basicData(res.rows.kid, res.rows.type, this.reset());
        // dispatch({
        //   type: 'produce/fetchSingleProduce',
        //   payload: {
        //     kid: res.rows.kid,
        //     keyType: res.rows.type,
        //   },
        // });
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  reset = () => {
    this.form.resetFields();
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      produce: { produceItem = {} },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const kid = match.params.id;
    const keyType = match.params.type;
    const { buttonFlag, editFlag, expandForm, copyDrawerVisible } = this.state;
    const title = (
      <span>
        {intl.get('tarzan.product.produce.title.card').d('物料生产属性明细')}
        <a style={{ marginLeft: '16px', fontSize: '12px' }} onClick={this.toggleForm}>
          {expandForm
            ? intl.get(`tarzan.product.produce.button.up`).d('收起')
            : intl.get(`tarzan.product.produce.button.expand`).d('展开')}
          <Icon type={expandForm ? 'up' : 'down'} />
        </a>
      </span>
    );
    const copyDrawerProps = {
      visible: copyDrawerVisible,
      onCancel: this.handleCopyDrawerCancel,
      onOk: this.handleCopyDrawerOk,
      initData: produceItem,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.product.produce.title.list').d('物料生产属性维护')}
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
              {intl.get('tarzan.product.produce.button.copy').d('复制')}
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
            <DisplayForm onRef={this.onRef} kid={kid} editFlag={editFlag} />
          </div>
          <Card
            key="code-rule-header"
            title={intl.get('tarzan.product.produce.title.field').d('扩展字段')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <AttrTable kid={kid} keyType={keyType} />
          </Card>
        </Content>
        <CopyDrawer {...copyDrawerProps} />
      </React.Fragment>
    );
  }
}
