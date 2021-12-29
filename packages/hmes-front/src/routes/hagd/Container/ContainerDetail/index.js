/**
 * containerForm - 编辑容器类型
 * @date: 2019-12-4
 * @author: xubiting <biting.xu@hand-china.com>
 * @version: 0.0.1
 * @copyright: copyright (c) 2019, Hand
 */

import React, { Component, Fragment } from 'react';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { Button, Tabs, Spin } from 'hzero-ui';
import { connect } from 'dva';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import {
  getCurrentOrganizationId,
  addItemToPagination,
  getEditTableData,
  delItemToPagination,
} from 'utils/utils';
import ConForm from './ConForm';
import BasicForm from './BasicForm';
import ExtendedAttributes from './ExtendedAttributes';
import AttributeDrawer from '@/components/AttributeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.hagd.containerType.model';
const TABLENAME = 'mt_container_type_attr';

@connect(({ containerType, loading }) => ({
  containerType,
  tenantId: getCurrentOrganizationId(),
  saveLoading: loading.effects['containerType/saveContainerItem'],
  fetchLoading: loading.effects['containerType/fetchContainerItem'],
  saveAttributeLoading: loading.effects['containerType/saveAttribute'],
}))
export default class ContainerDetail extends Component {
  state = {
    canEdit: false,
    attributeDrawerVisible: false,
  };

  conForm = (ref = {}) => {
    this.conForm = (ref.props || {}).form;
  };

  basicForm = (ref = {}) => {
    this.basicForm = (ref.props || {}).form;
  };

  extendForm = (ref = {}) => {
    this.extendForm = (ref.props || {}).form;
  };

  handleSaveList = () => {
    // 点击保存
    const {
      dispatch,
      // attributeList = [] 在点保存按钮时会把扩展字段抽屉里的数据刷新掉
      containerType: { extendedAttributesList = [] },
      match,
      history,
    } = this.props;

    let conFormParam = {};
    if (this.conForm) {
      this.conForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          conFormParam = values;
        } else {
          conFormParam = false;
        }
      });

      if (!conFormParam) {
        return;
      }
    }

    let basicFormParam = {};
    if (this.basicForm) {
      this.basicForm.validateFieldsAndScroll({ force: true }, (err, values) => {
        if (!err) {
          basicFormParam = values;
        } else {
          basicFormParam = false;
        }
      });

      if (!basicFormParam) {
        return;
      }
    }

    if (!conFormParam.flagValues) {
      conFormParam.flagValues = [];
    }

    const params = {
      ...conFormParam,
      ...basicFormParam,
      // containerTypeAttrs: attributeList,
    };

    const containerTypeId = match.params.id;
    if (containerTypeId !== 'create') {
      params.containerTypeId = containerTypeId;
    }
    const paramArr = [];
    getEditTableData(extendedAttributesList, ['containerTypeId']).forEach(item => {
      paramArr.push({
        ...item,
        containerTypeId,
      });
    });
    Promise.all([
      this.validateEditTable(extendedAttributesList, ['containerTypeId']),
    ]).then(resNew => {
      if (resNew) {
        // this.saveExtendedAttributes();
        dispatch({
          type: 'containerType/saveContainerItem',
          payload: {
            ...params,
            containerCapacityList: paramArr,
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            this.setState({
              canEdit: false,
            });

            history.push(`/hmes/hagd/container-type/type/${res.rows}`);
            // 获取行信息
            dispatch({
              type: 'containerType/fetchContainerItem',
              payload: { containerTypeId: res.rows },
            });
            this.fetchExtendedAttributes();
          } else {
            notification.error({
              message: res && res.message ? res.message : '操作失败',
            });
          }
        });
      }
    });
  };

  /**
   * 校验行编辑
   *
   * @param {array} [dataSource=[]] 数组
   * @param {array} [excludeKeys=[]]
   * @param {object} [property={}]
   * @returns
   * @memberof ContractBaseInfo
   */
  @Bind()
  validateEditTable(dataSource = [], excludeKeys = [], property = {}) {
    const editTableData = dataSource.filter(e => e._status);
    if (editTableData.length === 0) {
      return Promise.resolve([]);
    }
    return new Promise((resolve, reject) => {
      const validateDataSource = getEditTableData(dataSource, excludeKeys, property);
      if (validateDataSource.length === 0) {
        reject(
          notification.error({
            description: intl
              .get('ssrm.leaseContractCreate.view.message.error')
              .d('请完整页面上的必填信息'),
          })
        );
      } else {
        resolve(validateDataSource);
      }
    });
  }

  onSave = () => {
    //
  };

  handleStatus = () => {
    this.setState({
      canEdit: true,
    });
  };

  componentDidMount = () => {
    const { dispatch, match, tenantId } = this.props;
    const containerTypeId = match.params.id;
    if (containerTypeId === 'create') {
      this.setState({
        canEdit: true,
      });
    } else {
      this.setState({
        canEdit: false,
      });
      // 获取行信息
      this.conForm.resetFields();
      dispatch({
        type: 'containerType/fetchContainerItem',
        payload: { containerTypeId },
      });
      this.fetchExtendedAttributes();
    }

    dispatch({
      type: 'containerType/batchLovData',
      payload: {
        tenantId,
      },
    });

    dispatch({
      type: 'containerType/fetchSelectList',
      payload: {
        module: 'MATERIAL_LOT',
        typeGroup: 'PACKING_LEVEL',
        type: 'packingLevel',
      },
    });
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'containerType/clear',
    });
  };

  /**
   * @functionName: openAttrDrawer
   * @description: 设置抽屉打开
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  openAttrDrawer = () => {
    const { dispatch, match } = this.props;
    const ncCodeId = match.params.id;

    dispatch({
      type: 'containerType/fetchAttributeList',
      payload: {
        kid: ncCodeId,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          attributeDrawerVisible: true,
        });
      }
    });
  };

  /**
   * @functionName: closeAttrDrawer
   * @description: 设置抽屉关闭
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  closeAttrDrawer = () => {
    this.setState({
      attributeDrawerVisible: false,
    });
  };

  /**
   * @functionName: handleSave
   * @description 保存扩展字段
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  handleSave = dataSource => {
    const { dispatch, match } = this.props;
    const ncCodeId = match.params.id;

    if (dataSource.length > 0) {
      dispatch({
        type: 'containerType/saveAttribute',
        payload: {
          kid: ncCodeId,
          attrs: dataSource,
          tableName: TABLENAME,
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
        } else {
          notification.error({ message: res.message });
        }
      });
    }
    this.closeAttrDrawer();
  };

  /**
   * @description: 获取扩展属性
   * @param {type} params
   */
  @Bind()
  fetchExtendedAttributes(fields = {}) {
    const { dispatch, match } = this.props;
    const containerTypeId = match.params.id;
    dispatch({
      type: 'containerType/fetchExtendedAttributes',
      payload: {
        containerTypeId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  @Bind()
  handleCreate() {
    const {
      dispatch,
      containerType: {
        extendedAttributesList = [],
        pagination = {},
        containerItem = {},
      },
    } = this.props;
    dispatch({
      type: 'containerType/updateState',
      payload: {
        extendedAttributesList: [
          ...extendedAttributesList,
          {
            containerTypeId: new Date().getTime(),
            containerTypeName: containerItem.containerTypeCode,
            width: containerItem.width,
            length: containerItem.length,
            _status: 'create',
            flag: true,
          },
        ],
        pagination: addItemToPagination(extendedAttributesList.length, pagination),
      },
    });
  }

  /**
   * 编辑
   * 行数据切换编辑状态
   * @param {Object} record 操作对象
   * @param {Boolean} flag  编辑/取消标记
   */
  @Bind()
  handleEditLine(record = {}, flag) {
    const {
      dispatch,
      containerType: { extendedAttributesList = [] },
    } = this.props;
    const newList = extendedAttributesList.map(item =>
      item.containerCapacityId === record.containerCapacityId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'containerType/updateState',
      payload: {
        extendedAttributesList: [...newList],
      },
    });
  }

  // 行数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      containerType: { extendedAttributesList = [], pagination = {} },
    } = this.props;
    if (record._status) {
      extendedAttributesList.splice(index, 1);
      dispatch({
        type: 'containerType/updateState',
        payload: {
          extendedAttributesList,
          pagination: delItemToPagination(1, pagination),
        },
      });
    } else {
      dispatch({
        type: 'containerType/deleteData',
        payload: {
          ...record,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchExtendedAttributes();
        }
      });
    }
  }

  render() {
    const {
      match,
      saveLoading,
      fetchLoading,
      tenantId,
      saveAttributeLoading,
      containerType: { attributeList = [], extendedAttributesList = [], pagination = {}, cosTagType = [], loadingRules = [] },
    } = this.props;
    const containerTypeId = match.params.id;
    const { canEdit, attributeDrawerVisible } = this.state;
    const basePath = match.path.substring(0, match.path.indexOf('/type'));

    const conFormProps = {
      onSave: this.onSave,
    };

    const save = saveLoading || false;
    const fetch = fetchLoading || false;
    const ncCodeId = match.params.id;

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      tableName: TABLENAME,
      codeId: ncCodeId,
      canEdit,
      attrList: attributeList,
      onCancel: this.closeAttrDrawer,
      onSave: this.handleSave,
    };

    const extendedAttributesProps = {
      tenantId,
      cosTagType,
      loadingRules,
      containerTypeId,
      handleEditLine: this.handleEditLine,
      onSearch: this.fetchExtendedAttributes,
      deleteData: this.deleteData,
      handleCreate: this.handleCreate, // 新增数据
    };

    return (
      <Fragment>
        <Spin spinning={save || fetch}>
          <Header
            title={intl.get(`${modelPrompt}.containerTypeMaintain`).d('容器类型维护')}
            backPath={`${basePath}/list`}
          >
            {canEdit ? (
              <Button type="primary" icon="save" onClick={this.handleSaveList}>
                {intl.get(`${modelPrompt}.save`).d('保存')}
              </Button>
            ) : (
              <Button type="primary" icon="edit" onClick={this.handleStatus}>
                {intl.get(`${modelPrompt}.edit`).d('编辑')}
              </Button>
              )}
            <Button
              icon="arrows-alt"
              onClick={this.openAttrDrawer}
              disabled={ncCodeId === 'create'}
              loading={saveAttributeLoading}
            >
              {intl.get(`${modelPrompt}.field`).d('扩展字段')}
            </Button>
          </Header>
          <Content>
            <ConForm {...conFormProps} onRef={this.conForm} canEdit={canEdit} />
            <Tabs defaultActiveKey="basic">
              <TabPane tab={intl.get(`${modelPrompt}.basicAttr`).d('基础属性')} key="basic">
                <BasicForm onRef={this.basicForm} canEdit={canEdit} conFormRef={this.conForm} />
              </TabPane>
              <TabPane tab={intl.get(`${modelPrompt}.extendedAttributes`).d('拓展属性')} key="extendedAttributes">
                <ExtendedAttributes
                  canEdit={canEdit}
                  dataSource={extendedAttributesList}
                  pagination={pagination}
                  {...extendedAttributesProps}
                />
              </TabPane>
            </Tabs>
          </Content>
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
        </Spin>
      </Fragment>
    );
  }
}
