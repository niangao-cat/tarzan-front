/**
 *@description: 物料维护详情入口页面
 *@author: 唐加旭
 *@date: 2019-08-19 15:57:26
 *@version: V0.0.1
 *@return:<MaterialDist />
 * */
import React from 'react';
import { Button, Form, Tabs, Menu, Dropdown, Modal } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import moment from 'moment';
import DisplayForm from './DisplayForm';
import DataTab from './DataTab';
import ConnectTab from './ConnectTab';
import CopyDrawer from './copyDrawer';
import HistoryAssign from './HistoryDrawerAssign';
import HistoryObject from './HistoryDrawerObject';
import AttributeDrawer from '@/components/AttributeDrawer';

const { TabPane } = Tabs;
const modelPrompt = 'tarzan.process.collection.model.collection';
const TABLENAME = 'mt_tag_group_attr';

@connect(({ collection, loading }) => ({
  collection,
  fetchLoading: loading.effects['collection/fetchSingleTag'],
}))
@formatterCollections({ code: 'tarzan.process.collection' })
@Form.create({ fieldNameProp: null })
export default class MaterialDist extends React.Component {
  state = {
    canEdit: false,
    copyDrawerVisible: false,
    visibleAssign: false,
    visibleObject: false,
    attributeDrawerVisible: false,
    tabPage: {}, // 分页信息
  };

  componentDidMount() {
    const { dispatch, match } = this.props;
    const tagGroupId = match.params.id;
    if (tagGroupId === 'create') {
      this.setState({
        canEdit: true,
      });
      dispatch({
        type: 'collection/fetchSelectOption',
        payload: {
          module: 'GENERAL',
          typeGroup: 'TAG_VALUE_TYPE',
          type: 'valueTypeList',
        },
      });
      dispatch({
        type: 'collection/fetchStatueSelectList',
        payload: {
          module: 'GENERAL',
          statusGroup: 'TAG_GROUP_STATUS',
          type: 'statusList',
        },
      });
      dispatch({
        type: 'collection/fetchSelectOption',
        payload: {
          module: 'GENERAL',
          typeGroup: 'TAG_GROUP_TYPE',
          type: 'typeList',
        },
      });
      dispatch({
        type: 'collection/fetchSelectOption',
        payload: {
          module: 'GENERAL',
          typeGroup: 'TAG_GROUP_BUSINESS_TYPE',
          type: 'businessList',
        },
      });
      dispatch({
        type: 'collection/fetchSelectOption',
        payload: {
          module: 'GENERAL',
          typeGroup: 'TAG_GROUP_COLLECTION_TIME',
          type: 'collectionTimeControlList',
        },
      });
      dispatch({
        type: 'collection/fetchSelectOption',
        payload: {
          module: 'GENERAL',
          typeGroup: 'TAG_COLLECTION_METHOD',
          type: 'collectionMthodList',
        },
      });
      return;
    }

    this.basicFetch(tagGroupId);
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'collection/clear',
    });
  }

  basicFetch = tagGroupId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'collection/fetchSingleTag',
      payload: {
        tagGroupId,
      },
    });
    dispatch({
      type: 'collection/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_VALUE_TYPE',
        type: 'valueTypeList',
      },
    });
    dispatch({
      type: 'collection/fetchStatueSelectList',
      payload: {
        module: 'GENERAL',
        statusGroup: 'TAG_GROUP_STATUS',
        type: 'statusList',
      },
    });
    dispatch({
      type: 'collection/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_GROUP_TYPE',
        type: 'typeList',
      },
    });
    dispatch({
      type: 'collection/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_GROUP_BUSINESS_TYPE',
        type: 'businessList',
      },
    });
    dispatch({
      type: 'collection/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_GROUP_COLLECTION_TIME',
        type: 'collectionTimeControlList',
      },
    });
    dispatch({
      type: 'collection/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_COLLECTION_METHOD',
        type: 'collectionMthodList',
      },
    });

    dispatch({
      type: 'collection/fetchTagGroupList',
      payload: {
        tagGroupId,
        page: this.state.tabPage,
      },
    });
  };
  /**
   *@functionName handleCopyDrawerShow
   *@description 开启复制框
   *@author: 唐加旭
   *@date: 2019-09-26 17:48:37
   *@version: V0.8.6
   * */

  @Bind
  handleCopyDrawerShow = () => {
    this.setState({
      copyDrawerVisible: true,
    });
  };

  @Bind
  onCancel = () => {
    this.setState({
      copyDrawerVisible: false,
    });
  };

  /**
   * 暂存分页参数
   * @param {分页参数} page
   */
  @Bind
  saveTabPage(page={}){
    this.setState({tabPage: page});
  }

  @Bind
  copySuccess = values => {
    const { dispatch, history, match } = this.props;
    const tagGroupId = match.params.id;
    dispatch({
      type: 'collection/copyTag',
      payload: {
        ...values,
        sourceTagGroupId: tagGroupId,
      },
    }).then(res => {
      if (res && res.success) {
        history.push(`/hmes/acquisition/data-collection/dist/${res.rows}`);
        this.basicFetch(res.rows);
        this.setState({
          copyDrawerVisible: false,
        });
        this.form.resetFields();
        notification.success();
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  /**
   *@functionName fecthAssignHistory
   *@description: 获取数据项历史列表
   *@author: 唐加旭
   *@date: 2019-09-26 17:51:13
   *@version: V0.8.6
   * */
  @Bind
  fecthAssignHistory = () => {
    const { dispatch, match } = this.props;
    const tagGroupId = match.params.id;
    this.setState({
      visibleAssign: true,
    });
    dispatch({
      type: 'collection/fetchTagAssinHistory',
      payload: {
        tagGroupId,
        startTime: moment()
          .subtract(6, 'months')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  /**
   *@functionName: fetchObjectHistory
   *@description 获取关联对象历史记录
   *@author: 唐加旭
   *@date: 2019-09-26 17:52:40
   *@version: V0.8.6
   * */
  fetchObjectHistory = () => {
    const { dispatch, match } = this.props;
    const tagGroupId = match.params.id;
    this.setState({
      visibleObject: true,
    });
    dispatch({
      type: 'collection/fetchObjectHistory',
      payload: {
        tagGroupId,
        startTime: moment()
          .subtract(6, 'months')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  @Bind
  onRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  @Bind
  onConnectRef = (ref = {}) => {
    this.connectForm = (ref.props || {}).form;
  };

  @Bind
  onCancelAssgin = () => {
    this.setState({
      visibleAssign: false,
    });
  };

  @Bind
  onCancelObject = () => {
    this.setState({
      visibleObject: false,
    });
  };

  saveList = (values = {}, el = []) => {
    const {
      dispatch,
      history,
      match,
      collection: { mtTagGroupObjectDTO = {} },
    } = this.props;
    const tagGroupId = match.params.id;
    const typeCode = this.form.getFieldValue('businessType');
    if (this.connectForm) {
      //  flag用来判断是否选了关联对象 true标识选择了关联对象
      let flag = false;
      const connectFormValues = this.connectForm.getFieldsValue();
      for (const i in connectFormValues) {
        if (connectFormValues[i]) {
          flag = true;
        }
      }
      if (!flag && typeCode !== 'EQUIPMENT_MANAGEMENT') {
        Modal.warning({
          title: intl
            .get('tarzan.acquisition.collection.message.needOne')
            .d('请至少选择一项关联对象'),
        });
        return null;
      }
    } else if (!this.connectForm && tagGroupId === 'create' && typeCode !== 'EQUIPMENT_MANAGEMENT') {
      Modal.warning({
        title: intl
          .get('tarzan.acquisition.collection.message.needOne')
          .d('请至少选择一项关联对象'),
      });
      return null;
    }
    // Modal.warning({
    //   title: intl
    //     .get('tarzan.acquisition.collection.message.needCheck')
    //     .d('请检查是否已选择关联对象'),
    // });
    // return null;

    dispatch({
      type: 'collection/saveTag',
      payload: {
        mtTagGroupAssignDTO: el,
        mtTagGroupObjectDTO: this.connectForm
          ? {
              ...mtTagGroupObjectDTO,
              ...this.connectForm.getFieldsValue(),
            }
          : mtTagGroupObjectDTO,
        ...values,
        tagGroupId: tagGroupId === 'create' ? '' : tagGroupId,
        userVerification: values.userVerification ? 'Y' : 'N',
        // ...values,
        // tagGroupId: technologyItem.tagGroupId,
        // dateFrom: values.dateFrom ? moment(values.dateFrom).format('YYYY-MM-DD HH:mm:ss') : null,
        // dateTo: values.dateTo ? moment(values.dateTo).format('YYYY-MM-DD HH:mm:ss') : null,
        // currentFlag: values.currentFlag ? 'Y' : 'N',
        // mtOperationSubstepList: el,
        // operationAttrs: attrTabList,
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.setState({
          canEdit: false,
        });
        history.push(`/hmes/acquisition/data-collection/dist/${res.rows}`);
        dispatch({
          type: 'collection/updateState',
          payload: {
            currentChangeChildSteps: [],
          },
        });
        this.basicFetch(res.rows);
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
      collection: { tagGroupList = [] },
    } = this.props;
    // const tagGroupId = match.params.id;
    this.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const middle = tagGroupList.filter(
          ele => ele._status === 'create' || ele._status === 'update'
        );
        if (middle.length !== 0) {
          const el = [];
          // let flag=false
          for (let i = 0; i < middle.length; i++) {
            middle[i].$form.validateFieldsAndScroll((childError, childValue) => {
              if (!childError) {
                el.push({
                  ...middle[i],
                  // tagGroupAssignId: middle[i].tagGroupAssignId,
                  ...childValue,
                  enableFlag: childValue.enableFlag ? 'Y' : 'N',
                  valueAllowMissing: childValue.valueAllowMissing ? 'Y' : 'N',
                });
              }
            });
          }
          const middle1 = tagGroupList.filter(ele => ele._status === 'sync');
          if (el.length === middle.length || middle1.length !== 0) {
            this.saveList(values, [...el, ...middle1]);
          }
        } else {
          const middle1 = tagGroupList.filter(ele => ele._status === 'sync');
          this.saveList(values, [...middle1]);
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
   * @functionName: openAttrDrawer
   * @description: 设置抽屉打开
   * @author: 许碧婷
   * @date: 2019-12-16
   * @version: V0.0.1
   */
  openAttrDrawer = () => {
    const { dispatch, match } = this.props;
    const tagGroupId = match.params.id;

    dispatch({
      type: 'collection/fetchAttributeList',
      payload: {
        kid: tagGroupId,
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
    const tagGroupId = match.params.id;

    if (dataSource.length > 0) {
      dispatch({
        type: 'collection/saveAttribute',
        payload: {
          kid: tagGroupId,
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
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      collection: { attributeList = [] },
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const tagGroupId = match.params.id;
    const {
      canEdit,
      copyDrawerVisible,
      visibleAssign,
      visibleObject,
      attributeDrawerVisible,
    } = this.state;
    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={this.fecthAssignHistory}>数据项信息</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={this.fetchObjectHistory}>关联对象</a>
        </Menu.Item>
      </Menu>
    );

    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      tableName: TABLENAME,
      codeId: tagGroupId,
      canEdit,
      attrList: attributeList,
      onCancel: this.closeAttrDrawer,
      onSave: this.handleSave,
    };

    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.process.collection.title.detail').d('数据收集组维护')}
          backPath={`${basePath}/list`}
        >
          {canEdit ? (
            <Button type="primary" icon="save" onClick={this.handleSaveList}>
              {intl.get('hzero.common.button.save').d('保存')}
            </Button>
          ) : (
            <Button type="primary" icon="edit" onClick={this.changeStatus}>
              {intl.get('hzero.common.button.edit').d('编辑')}
            </Button>
          )}
          {/* {tagGroupId === 'create' ? null : canEdit ? (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirsm.delete`).d('数据未保存，是否复制?')}
              onConfirm={this.handleCopyDrawerShow}
            >
              <Button
                icon="copy"
                disabled={isUndefined(canEdit) ? true : canEdit}
                style={{ marginLeft: '10px' }}
              >
                {intl.get('tarzan.acquisition.dataItem.button.copy').d('复制')}
              </Button>
            </Popconfirm>
          ) : (
              <Button
                icon="copy"
                disabled={isUndefined(canEdit) ? true : canEdit}
                style={{ marginLeft: '10px' }}
                onClick={this.handleCopyDrawerShow}
              >
                {intl.get('tarzan.acquisition.dataItem.button.copy').d('复制')}
              </Button>
            )} */}
          {tagGroupId === 'create' ? null : (
            <Button
              onClick={this.handleCopyDrawerShow}
              icon="copy"
              disabled={canEdit}
              style={{ marginLeft: '10px' }}
            >
              {intl.get('tarzan.acquisition.dataItem.button.copy').d('复制')}
            </Button>
          )}

          {tagGroupId === 'create' ? null : (
            <Dropdown overlay={menu} placement="bottomCenter">
              <Button icon="edit">
                {intl.get('tarzan.acquisition.dataItem.button.copy').d('修改历史')}
              </Button>
            </Dropdown>
          )}

          {/* <Button
              // icon="copy"
              disabled={isUndefined(canEdit) ? true : canEdit}
              style={{ marginLeft: '10px' }}
              onClick={this.handleCopyDrawerShow}
            >
              {intl.get('tarzan.acquisition.dataItem.button.copy').d('修改历史')}
            </Button> */}
          <Button
            icon="arrows-alt"
            onClick={this.openAttrDrawer}
            disabled={tagGroupId === 'create'}
          >
            {intl.get(`${modelPrompt}.field`).d('扩展字段')}
          </Button>
        </Header>
        <Content>
          <DisplayForm onRef={this.onRef} tagGroupId={tagGroupId} canEdit={canEdit} />
          <Tabs defaultActiveKey="sites">
            <TabPane tab={intl.get(`${modelPrompt}.setSites`).d('数据项信息')} key="sites">
              <DataTab tagGroupId={tagGroupId} canEdit={canEdit} onSaveTabPage={this.saveTabPage} />
            </TabPane>
            <TabPane tab={intl.get(`${modelPrompt}.setSites`).d('关联对象')} key="obj">
              <ConnectTab tagGroupId={tagGroupId} canEdit={canEdit} onRef={this.onConnectRef} />
            </TabPane>
          </Tabs>
          {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
        </Content>
        {copyDrawerVisible && (
          <CopyDrawer
            tagGroupId={tagGroupId}
            visible={copyDrawerVisible}
            onCancel={this.onCancel}
            copySuccess={this.copySuccess}
          />
        )}

        <HistoryAssign
          visible={visibleAssign}
          onCancel={this.onCancelAssgin}
          queryFromRecord={tagGroupId}
        />
        <HistoryObject
          visible={visibleObject}
          onCancel={this.onCancelObject}
          queryFromRecord={tagGroupId}
        />
      </React.Fragment>
    );
  }
}
