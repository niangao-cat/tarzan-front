/**
 *@description: 物料维护详情入口页面
 *@author: 唐加旭
 *@date: 2019-08-19 15:57:26
 *@version: V0.0.1
 *@return:<MaterialDist />
 * */
import React from 'react';
import { Button, Form, Tabs } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';

import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { Button as ButtonPermission } from 'components/Permission';
import intl from 'utils/intl';
// import { isUndefined } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import DisplayForm from './DisplayForm';
import SitesTab from './SitesTab';
import ClassifyTab from './ClassifyTab';
// import ProduceTab from './ProduceTab';
// import ExtendedTab from './ExtendedTab';
import AttributeDrawer from './AttributeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.product.materialManager.model.materialManager';

@connect(({ materialManager, loading }) => ({
  materialManager,
  fetchLoading: loading.effects['materialManager/fetchWorkCellLineList'],
}))
@formatterCollections({ code: 'tarzan.product.materialManager' })
@Form.create({ fieldNameProp: null })
export default class MaterialDist extends React.Component {
  state = {
    canEdit: false,
    attributeDrawerVisible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match,
      materialManager: { isCreate },
    } = this.props;
    const materialId = match.params.id;
    if (materialId === 'create' || isCreate) {
      this.setState({
        canEdit: true,
      });
      dispatch({
        type: 'materialManager/fetchAttrCreate',
        payload: {
          kid: null,
          tableName: 'mt_material_attr',
        },
      });
      return;
    }

    this.basicData(materialId);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialManager/clear',
    });
  }

  @Bind
  basicData = materialId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'materialManager/fetchSingleMaterial',
      payload: {
        materialId,
      },
    });
    // dispatch({
    //  type: 'materialManager/fetchAttrCreate',
    // payload: {
    //    kid: materialId,
    //    tableName: 'mt_material_attr',
    //  },
    // });
    dispatch({
      type: 'materialManager/materialSitesList',
      payload: {
        materialId,
      },
    });
    dispatch({
      type: 'materialManager/fetchSitesDispatch',
      payload: {
        materialId,
      },
    });
  };

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  showAttrDrawer = () => {
    this.setState({
      attributeDrawerVisible: true,
    });
  };

  // 关闭扩展字段抽屉
  @Bind
  handleAttributeDrawerCancel() {
    this.setState({ attributeDrawerVisible: false });
  }

  @Bind
  saveData = () => {
    const {
      dispatch,
      history,
      materialManager: {
        materialSitesList = [],
        isCreate,
        attributeTabList = [],
        materialManagerItem = {},
        materialSitesDispatchList = [],
      },
    } = this.props;
    dispatch({
      type: 'materialManager/saveMaterial',
      payload: {
        ...this.form.getFieldsValue(),
        enableFlag: this.form.getFieldValue('enableFlag') ? 'Y' : 'N',
        materialId: isCreate || materialManagerItem.materialId,
        mtMaterialAttrs: attributeTabList,
        mtMaterialCategoryAssigns: materialSitesDispatchList
          .filter(ele => ele._status === 'create')
          .map(ele => ({
            materialCategoryAssignId: ele.materialCategoryAssignId,
            materialCategoryId: ele.materialCategoryId,
            materialCategorySetId: ele.materialCategorySetId,
            materialSiteId: ele.materialSiteId,
            siteId: ele.siteId,
          })),
        mtMaterialSites: materialSitesList
          .filter(ele => ele._status === 'create')
          .map(ele => ({
            siteId: ele.$form.getFieldValue('siteCode'),
            enableFlag: ele.$form.getFieldValue('enableFlag') ? 'Y' : 'N',
          }))
          .concat(
            materialSitesList
              .filter(ele => ele._edited && ele._status !== 'create')
              .map(ele => ({
                materialSiteId: ele.materialSiteId,
                siteId: ele.siteId,
                enableFlag: ele.enableFlag,
              }))
          ),
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.setState({
          canEdit: false,
        });
        history.push(`/product/material-manager/dist/${res.rows}`);
        this.basicData(res.rows);
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  @Bind
  handleSaveList = () => {
    const {
      materialManager: { materialSitesDispatchList = [] },
    } = this.props;
    this.form.validateFieldsAndScroll(err => {
      if (!err) {
        const middle = materialSitesDispatchList.filter(ele => ele._status === 'create');
        if (middle[0]) {
          middle[0].$form.validateFieldsAndScroll(errs => {
            if (!errs) {
              this.saveData();
            }
          });
        } else {
          this.saveData();
        }
      }
    });
  };

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

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      // materialManager: { proLineItem = {} },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const materialId = match.params.id;
    const { canEdit, attributeDrawerVisible } = this.state;

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      materialId,
      canEdit,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.product.materialManager.title.detail').d('物料维护')}
          backPath={`${basePath}/list`}
        >
          {canEdit ? (
            <ButtonPermission
              onClick={this.handleSaveList}
              permissionList={[
                {
                  code: 'base.button.material.manager.save',
                  type: 'button',
                  meaning: '物料维护-保存',
                },
              ]}
            >
              {intl.get('tarzan.product.materialManager.button.save').d('保存')}
            </ButtonPermission>
          ) : (
            <ButtonPermission
              onClick={this.changeStatus}
              permissionList={[
                  {
                    code: `base.button.material.manager.edit`,
                    type: 'button',
                    meaning: '物料维护-编辑',
                  },
                ]}
            >
              {intl.get('tarzan.product.materialManager.button.edit').d('编辑')}
            </ButtonPermission>
          )}
          <Button
            icon="arrows-alt"
            onClick={this.showAttrDrawer}
            disabled={materialId === 'create'}
          >
            {intl.get(`${modelPrompt}.field`).d('扩展字段')}
          </Button>
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} materialId={materialId} canEdit={canEdit} />
          <Tabs defaultActiveKey="sites">
            <TabPane tab={intl.get(`${modelPrompt}.setSites`).d('站点分配')} key="sites">
              <SitesTab materialId={materialId} canEdit={canEdit} />
            </TabPane>
            <TabPane
              tab={intl.get(`${modelPrompt}.setMaterialCategoryAssign`).d('类别分配')}
              key="plan"
            >
              <ClassifyTab materialId={materialId} canEdit={canEdit} />
            </TabPane>
          </Tabs>
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
