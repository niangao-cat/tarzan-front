/**
 * FilterForm - 搜索栏
 * @date: 2019-8-6
 * @author: jrq <ruiqi.jiang01@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Input, Row, Col, Select, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';

import intl from 'utils/intl';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import CurrencyDrawer from './CurrencyDrawer';
import styles from './index.less';
import accessOrgBtn from '@/assets/accessOrgBtn.svg';
import SearchForm from './SearchForm';

const tenantId = getCurrentOrganizationId();
const modelPrompt = 'tarzan.org.RelationMaintain.model.RelationMaintain';

/**
 * 搜索栏
 * @extends {Component} - React.Component
 * @return React.element
 */
@connect(({ relationMaintain, loading }) => ({
  relationMaintain,
  fetchMessageLoading: loading.effects['relationMaintain/fetchExtendFieldList'],
}))
@formatterCollections({
  code: ['tarzan.org.RelationMaintain'], // code 为 [服务].[功能]的字符串数组
})
export default class FilterForm extends React.Component {
  handleDistribOrg = flag => {
    this.props.dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        DistribOrgDisableFlag: flag,
        orgItemDrawerVisible: false,
      },
    });
  };

  // 分配组织类型
  handleChangeOrgType = value => {
    this.props.dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        orgType: value,
        ToBeDistribOrg: {},
        orgItemType: value,
      },
    });
  };

  // 待分配组织Lov框选择，保存选中组织信息
  handleChangeToBeDistribOrg = (_, value) => {
    this.props.dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        ToBeDistribOrg: value,
      },
    });
  };

  // 分配组织保存
  handleSaveOrg = flag => {
    const {
      dispatch,
      relationMaintain: { treeSelectedNodes = {}, orgType = '', ToBeDistribOrg = {}, orgTree = [], expandedKeys },
    } = this.props;
    if (!orgType) {
      Modal.warning({
        title: intl.get('tarzan.org.relationMaintain.message.needOrgType').d('请选择组织类型'),
      });
      return null;
    } else if (!ToBeDistribOrg.organizationId) {
      Modal.warning({
        title: intl.get('tarzan.org.relationMaintain.message.needDistribOrg').d('请选择待分配组织'),
      });
      return null;
    }
    dispatch({
      type: 'relationMaintain/assignOrg',
      payload: {
        organizationId: ToBeDistribOrg.organizationId,
        organizationType: orgType,
        parentOrganizationId: treeSelectedNodes.id,
        parentOrganizationType: treeSelectedNodes.type,
        topSiteId: treeSelectedNodes.topSiteId,
      },
    }).then(res => {
      if (res && res.success) {
        this.handleDistribOrg(flag);
        dispatch({
          type: 'relationMaintain/updateState',
          payload: {
            ToBeDistribOrg: {},
          },
        });
        dispatch({
          type: 'relationMaintain/queryTreeChildred',
          payload: {
            parentOrganizationId: treeSelectedNodes.id,
            parentOrganizationType: treeSelectedNodes.type,
            topSiteId: treeSelectedNodes.topSiteId,
            expandedKeys,
          },
        }).then(res1 => {
          if (res1 && res1.success) {
            this.refreshTreeNode(orgTree, res1.rows, {
              id: treeSelectedNodes.id,
              type: treeSelectedNodes.type,
            });
            setTimeout(() => {
              dispatch({
                type: 'relationMaintain/updateState',
                payload: {
                  orgTree: JSON.parse(JSON.stringify(orgTree)),
                },
              });
            }, 500);
          }
        });
      }
    });
  };

  /* eslint-disable */
  refreshTreeNode(orgTree, data, item) {
    orgTree.forEach(it => {
      if (it.id === item.id && it.type === item.type) {
        it.children = true;
        it.childrens = data;
      } else if (it.childrens) {
        this.refreshTreeNode(it.childrens, data, item);
      }
    });
  }
  /* eslint-enable */

  showDrawer = () => {
    this.props.dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        orgItemDrawerVisible: true,
      },
    });
  };

  areaDrawerCancel = () => {
    this.props.dispatch({
      type: 'relationMaintain/updateState',
      payload: {
        orgItemId: 'create',
        orgItemDrawerVisible: false,
      },
    });
  };

  @Bind()
  handleSearchTreeData() {
    const { dispatch } = this.props;
    if(this.searchForm) {
      this.searchForm.validateFields((err, val) => {
        if(!err) {
          const filterValue = filterNullValueObject(val);
          dispatch({
            type: 'relationMaintain/querySearchTreeData',
            payload: {
              ...filterValue,
            },
          });
        }
      });
    }
  }

  @Bind()
  handleResetTreeData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'relationMaintain/queryTreeData',
      payload: {
        expandedKeys: [],
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      relationMaintain: {
        DistribOrgDisableFlag,
        relationPlace = '',
        orgTypeList = [],
        orgType = '',
        treeSelectedNodes = {},
        ToBeDistribOrg = {},
        orgItemDrawerVisible,
        organizationTypeList = [],
        siteInfo = [],
      },
    } = this.props;

    const AreaDrawerDrawerProps = {
      onCancel: this.areaDrawerCancel,
      container: this.drawerRelyDiv,
    };

    const searchFormProps = {
      organizationTypeList,
      siteInfo,
      tenantId,
      onRef: node => {
        this.searchForm = node.props.form;
      },
      onSearch: this.handleSearchTreeData,
      onResetTreeData: this.handleResetTreeData,
    };

    return (
      <div className={styles.basicArea}>
        <div className={styles.relationArea}>
          <div className={styles.title}>
            <span>{intl.get(`${modelPrompt}.orgRelationMainTain`).d('组织关系维护查询')}</span>
          </div>
          <SearchForm {...searchFormProps} />
        </div>
        <div className={styles.relationArea}>
          <div className={styles.title}>
            <span>{intl.get(`${modelPrompt}.orgRelationMainTain`).d('组织关系维护')}</span>
            <div className={styles.operator}>
              {DistribOrgDisableFlag ? (
                <Button
                  type="primary"
                  className={styles.btn}
                  style={{ paddingLeft: '6px' }}
                  onClick={this.handleDistribOrg.bind(this, false)}
                >
                  <img src={accessOrgBtn} alt="" />
                  {intl.get(`${modelPrompt}.assignmentOrg`).d('分配组织')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  className={styles.btn}
                  onClick={this.handleSaveOrg.bind(this, true)}
                >
                  {intl.get('tarzan.org.RelationMaintain.button.save').d('保存')}
                </Button>
              )}
            </div>
          </div>
          <div className={styles.content}>
            <Row className={styles.nomalRow}>
              <Col span={8} className={styles.titleCol}>
                {intl.get(`${modelPrompt}.selectPlace`).d('选择分配位置')}
              </Col>
              <Col span={16} className={styles.componmentCol}>
                <Input value={relationPlace} disabled />
              </Col>
            </Row>
            <Row className={styles.nomalRow}>
              <Col span={8} className={styles.titleCol}>
                {intl.get(`${modelPrompt}.selectType`).d('分配组织类型')}
              </Col>
              <Col span={16} className={styles.componmentCol}>
                <Select
                  disabled={DistribOrgDisableFlag}
                  value={orgType || undefined}
                  onChange={this.handleChangeOrgType}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {orgTypeList.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.distributionArea}>
          <div className={styles.title}>
            {intl.get(`${modelPrompt}.assignmentOrg`).d('分配组织')}
          </div>
          <div
            className={styles.content}
            ref={ref => {
              this.drawerRelyDiv = ref;
            }}
          >
            <Row className={styles.nomalRow}>
              <Col span={8} className={styles.titleCol}>
                {intl.get(`${modelPrompt}.toBeDistribOrg`).d('待分配组织')}
              </Col>
              <Col span={16} className={styles.componmentCol}>
                <Lov
                  queryParams={{
                    tenantId,
                    organizationType: orgType,
                    topSiteId: treeSelectedNodes.topSiteId,
                    parentOrganizationType: treeSelectedNodes.type,
                    parentOrganizationId: treeSelectedNodes.id,
                  }}
                  onChange={this.handleChangeToBeDistribOrg}
                  value={ToBeDistribOrg.organizationCode}
                  code="MT.NOT_EXIST_ORGANIZATION"
                  disabled={DistribOrgDisableFlag || !orgType}
                />
              </Col>
            </Row>
            {(() => {
              switch (orgType) {
                case 'WORKCELL':
                  return (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showDrawer.bind(this)}
                    >
                      {intl.get(`${modelPrompt}.createWorkcell`).d('新建工作单元')}
                    </Button>
                  );
                case 'ORGANIZATION_TYPE':
                  return (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showDrawer.bind(this)}
                    >
                      {intl.get(`${modelPrompt}.createOrganization`).d('新建企业')}
                    </Button>
                  );
                case 'PROD_LINE':
                  return (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showDrawer.bind(this)}
                    >
                      {intl.get(`${modelPrompt}.createProdLine`).d('新建生产线')}
                    </Button>
                  );
                case 'LOCATOR':
                  return (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showDrawer.bind(this)}
                    >
                      {intl.get(`${modelPrompt}.createLocator`).d('新建库位')}
                    </Button>
                  );
                case 'SITE':
                  return (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showDrawer.bind(this)}
                    >
                      {intl.get(`${modelPrompt}.createSite`).d('新建站点')}
                    </Button>
                  );
                case 'AREA':
                  return (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showDrawer.bind(this)}
                    >
                      {intl.get(`${modelPrompt}.createArea`).d('新建区域')}
                    </Button>
                  );
                case 'LOCATOR_GROUP':
                  return (
                    <Button
                      type="primary"
                      className={styles.btn}
                      onClick={this.showDrawer.bind(this)}
                    >
                      {intl.get(`${modelPrompt}.createLocatorGroup`).d('新建库位组')}
                    </Button>
                  );
                default:
                  return null;
              }
            })()}
          </div>
          {orgItemDrawerVisible ? <CurrencyDrawer {...AreaDrawerDrawerProps} /> : null}
        </div>
      </div>
    );
  }
}
