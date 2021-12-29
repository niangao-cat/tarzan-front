/**
 * PfepInventoryDist - 物料存储属性维护编辑
 * @date: 2019-8-19
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Card, Tabs, Spin } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';

import { Header, Content } from 'components/Page';

import intl from 'utils/intl';
// import { isUndefined } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import AttributeDrawer from '../../../../components/AttributeDrawer';
import DisplayForm from './DisplayForm';
import CopyDrawer from './copyDrawer';
import DefaultValue from './defaultValue';
import ExtendedAttributes from './extendedAttributes';
import DataCollectionDrawer from './DataCollectionDrawer';
/**
 * 物料存储属性维护编辑
 * @extends {Component} - React.Component
 * @reactProps {Object} [match={}] - react-router match路由信息
 * @reactProps {Object} [history={}]
 * @reactProps {Object} dataItem - 数据源
 * @reactProps {Object} form - 表单对象
 * @reactProps {Function} [dispatch=function(e) {return e;}] - redux dispatch方法
 * @return React.element
 */
const { TabPane } = Tabs;
const TABLENAME = 'mt_tag_attr';

// const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';
@connect(({ dataItem, loading }) => ({
  dataItem,
  fetchLoading: loading.effects['dataItem/fetchProduceList'],
  saveLoading: loading.effects['dataItem/saveTag'],
  fetchDataCollectionLoading: loading.effects['dataItem/fetchDataCollection'],
  saveDataCollectionLoading: loading.effects['dataItem/saveDataCollection'],
  fetchSingleDetailLoading: loading.effects['dataItem/fetchSingleDetail'],
  fetchSelectOptionLoading: loading.effects['dataItem/fetchSelectOption'],
  fetchAttributeListLoading: loading.effects['dataItem/fetchAttributeList'],
}))
@formatterCollections({ code: 'tarzan.acquisition.dataItem' })
@Form.create({ fieldNameProp: null })
export default class PfepInventoryDist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editFlag: true,
      copyDrawerVisible: false,
      attributeDrawerVisible: false,
      dataCollectionDrawerVisible: false,
    };
    this.initData();
  }

  form;

  componentDidMount() {
    const { match, dispatch } = this.props;
    const kid = match.params.id;
    this.basicData(kid);
    if (kid === 'create') {
      this.setState({
        editFlag: false,
      });
    } else {
      dispatch({
        type: 'dataItem/initData',
      }).then(res => {
        if(res) {
          this.queryExtendedAttributesDatas();
        }
      });
      // 获取扩展属性
    }
    dispatch({
      type: 'dataItem/initData',
    });
    this.queryLovs();
  }

  // 获取值集
  queryLovs = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'dataItem/querySelect',
      payload: {
        qmsDefectLevel: "QMS.DEFECT_LEVEL",
        qmsInspectionLineType: "QMS.INSPECTION_LINE_TYPE",
        qmsInspectionTool: "QMS.INSPECTION_TOOL",
      },
    });
  };

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataItem/updateState',
      payload: {
        tagItem: {},
        dataCollection: {},
        attributeList: [],
      },
    });
  }

  @Bind()
  initData() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataItem/updateState',
      payload: {
        attributeInfo: {},
      },
    });
  }

  //  切换数据类型，需要把最大值、最小值、计量单位、符合值、不符合值清空
  resetFields = val => {
    this.defaultFormFunction.resetFields(val);
  };

  @Bind()
  basicData = tagId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'dataItem/fetchSingleDetail',
      payload: {
        tagId,
      },
    });
    dispatch({
      type: 'dataItem/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_COLLECTION_METHOD',
        type: 'collectionMthodList',
      },
    });
    dispatch({
      type: 'dataItem/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_VALUE_TYPE',
        type: 'valueTypeList',
      },
    });
  };

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
  defaultRef = (ref = {}) => {
    this.defaultForm = (ref.props || {}).form;
    this.defaultFormFunction = ref;
  };

  @Bind
  extendedAttributesRef = (ref = {}) => {
    this.extendedAttributesForm = (ref.props || {}).form;
    this.extendedAttributesFormFunction = ref;
  };

  @Bind()
  handleSaveExtendedValue(tagId) {
    const { dataItem: { attributeList = [] } } = this.props;
    const fieldsValue = {
      ...this.extendedAttributesForm.getFieldsValue(),
      TAG_TYPE: this.form.getFieldValue('TAG_TYPE'),
      PROCESS_FLAG: this.form.getFieldValue('PROCESS_FLAG'),
      STANDARD: this.defaultForm.getFieldValue('standard'),
    };
    const newAttributeList = attributeList.map(e => {
      const obj = attributeList.find(i => i.attrName === e.attrName) || {};
      return {
        ...e,
        attrValue: fieldsValue[obj.attrName],
      };
    });
    this.handleExtendedAttributesSave(newAttributeList, tagId);
  }

  @Bind
  handleSaveList() {
    const { dispatch, match, history } = this.props;
    if (match.params.id !== 'create') {
      this.handleSaveExtendedValue(match.params.id);
    }

    const kid = match.params.id === 'create' ? undefined : match.params.id;
    this.form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'dataItem/saveTag',
          payload: {
            ...fieldsValue,
            enableFlag: fieldsValue.enableFlag ? 'Y' : 'N',
            valueAllowMissing: fieldsValue.valueAllowMissing ? 'Y' : 'N',
            tagId: kid,
            ...this.defaultForm.getFieldsValue(),
          },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            this.setState({
              editFlag: true,
            });
            history.push(`/hmes/acquisition/data-item/dist/${res.rows}`);
            this.handleSaveExtendedValue(res.rows);
            this.basicData(kid);
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  @Bind
  changeStatus = () => {
    this.setState({
      editFlag: false,
    });
  };

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
  copySuccess(fieldsValue) {
    const { dispatch, history, match } = this.props;
    const tagId = match.params.id;
    dispatch({
      type: 'dataItem/copyTag',
      payload: {
        ...fieldsValue,
        sourceTagId: tagId,
      },
    }).then(res => {
      if (res && res.success) {
        this.form.resetFields();
        this.handleCopyDrawerCancel();
        notification.success();
        history.push(`/hmes/acquisition/data-item/dist/${res.rows}`);
        this.basicData(res.rows);
      } else if (res) {
        notification.error({ message: res.message });
      }
    });
  }

  @Bind()
  closeAttrDrawer() {
    this.setState({ attributeDrawerVisible: false });
  }

  @Bind()
  closeDataCollectionDrawer() {
    this.setState({ dataCollectionDrawerVisible: false });
  }

  @Bind()
  handleSave(dataSource) {
    const { dispatch, match } = this.props;
    const tagId = match.params.id;
    if (dataSource.length > 0) {
      dispatch({
        type: 'dataItem/saveAttribute',
        payload: {
          kid: tagId,
          attrs: dataSource,
          tableName: TABLENAME,
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
          this.queryExtendedAttributesDatas();
          this.basicData(tagId);
        } else {
          notification.error({ message: res.message });
        }
      });
    }
    this.closeAttrDrawer();
  }

  @Bind()
  handleExtendedAttributesSave(dataSource, tagId) {
    const { dispatch } = this.props;
    if (dataSource.length > 0) {
      dispatch({
        type: 'dataItem/saveAttribute',
        payload: {
          kid: tagId,
          attrs: dataSource,
          tableName: TABLENAME,
        },
      }).then(res => {
        if (res && res.success) {
          setTimeout(() => {
            this.queryExtendedAttributesDatas();
          }, 10);
        } else {
          notification.error({ message: res.message });
        }
      });
    }
    this.closeAttrDrawer();
    this.forceUpdate();
  }

  @Bind()
  queryExtendedAttributesDatas() {
    const { dispatch, match } = this.props;
    const tagId = match.params.id;
    dispatch({
      type: 'dataItem/fetchAttributeList',
      payload: {
        kid: tagId,
        tableName: TABLENAME,
      },
    }).then(res => {
      if (res && res.success) {
        // this.setState({
        //   attributeDrawerVisible: true,
        // });
      }
    });
  }

  @Bind()
  openAttrDrawer() {
    const { dispatch, match, dataItem: { flagList, tagTypeList } } = this.props;
    const tagId = match.params.id;
    dispatch({
      type: 'dataItem/fetchAttributeList',
      payload: {
        kid: tagId,
        tableName: TABLENAME,
        flagList,
        tagTypeList,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          attributeDrawerVisible: true,
        });
      }
    });
  }

  // 数据采集
  @Bind()
  dataCollection() {
    const { dispatch, match } = this.props;
    const tagId = match.params.id;
    dispatch({
      type: 'dataItem/fetchDataCollection',
      payload: {
        tagId,
      },
    }).then(res => {
      if (res) {
        this.setState({
          dataCollectionDrawerVisible: true,
        });
      }
    });
  }

  // 数据采集项保存
  @Bind()
  saveDataCollection(fieldsValue) {
    const { dispatch, match, dataItem: {
      dataCollection = {},
    } } = this.props;
    const tagId = match.params.id;
    dispatch({
      type: 'dataItem/saveDataCollection',
      payload: {
        ...dataCollection,
        ...fieldsValue,
        tagId,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.setState({
          editFlag: true,
          dataCollectionDrawerVisible: false,
        });
        this.basicData(tagId);
      }
    });
  }


  @Bind
  dataCollectionRef(ref = {}) {
    this.dataCollectionForm = (ref.props || {}).form;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      match,
      dataItem: { tagItem = {}, attributeList = [], dataCollection = {}, qmsDefectLevelList = [], qmsInspectionLineTypeList = [], qmsInspectionToolList = [], flagList = [], tagTypeList = [], attributeInfo = {} },
      fetchDataCollectionLoading,
      saveDataCollectionLoading,
      fetchSingleDetailLoading,
      fetchSelectOptionLoading,
      fetchAttributeListLoading,
    } = this.props;
    const basePath = match.path.substring(0, match.path.indexOf('/dist'));
    const kid = match.params.id;
    const { editFlag, copyDrawerVisible, attributeDrawerVisible, dataCollectionDrawerVisible } = this.state;
    const title = <span>{intl.get('tarzan.acquisition.dataItem.title.card').d('基础信息')}</span>;
    const copyDrawerProps = {
      visible: copyDrawerVisible,
      onCancel: this.handleCopyDrawerCancel,
      copySuccess: this.copySuccess,
      tagId: kid,
    };
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      tableName: TABLENAME,
      codeId: kid,
      canEdit: !editFlag,
      attrList: attributeList,
      onCancel: this.closeAttrDrawer,
      onSave: this.handleSave,
    };

    const extendedAttributesProps = {
      kid,
      tagItem,
      editFlag,
      qmsDefectLevelList,
      qmsInspectionLineTypeList,
      qmsInspectionToolList,
      attributeInfo,
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.acquisition.dataItem.title.list').d('数据项维护')}
          backPath={`${basePath}/list`}
        >
          <React.Fragment>
            {!editFlag ? (
              <Button type="primary" icon="save" onClick={this.handleSaveList}>
                {intl.get('hzero.common.button.save').d('保存')}
              </Button>
            ) : (
              <Button type="primary" icon="edit" onClick={this.changeStatus}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </Button>
              )}
            {kid === 'create' ? null : (
              <Button
                icon="copy"
                disabled={!editFlag}
                // disabled={isUndefined(editFlag) ? true : editFlag}
                style={{ marginLeft: '10px' }}
                onClick={this.handleCopyDrawerShow}
              >
                {intl.get('tarzan.acquisition.dataItem.button.copy').d('复制')}
              </Button>
            )}
            <Button icon="arrows-alt" onClick={this.openAttrDrawer} disabled={kid === 'create'}>
              {intl.get(`tarzan.acquisition.dataItem.field`).d('扩展属性')}
            </Button>
            <Button loading={fetchDataCollectionLoading} icon="database" onClick={this.dataCollection} disabled={kid === 'create'}>
              数据采集
            </Button>
          </React.Fragment>
        </Header>
        <Content>
          <Spin spinning={fetchSingleDetailLoading || fetchSelectOptionLoading || fetchAttributeListLoading || false}>
            <Card
              key="code-rule-header"
              title={title}
              bordered={false}
              className={DETAIL_CARD_TABLE_CLASSNAME}
              size="small"
            />
            <DisplayForm
              onRef={this.onRef}
              tagId={kid}
              editFlag={editFlag}
              resetFields={this.resetFields}
              tagItem={tagItem}
              flagList={flagList}
              tagTypeList={tagTypeList}
              attributeInfo={attributeInfo}
            />
            {/* <Card
            key="code-rule-header"
            title={intl.get('tarzan.acquisition.dataItem.title.field').d('默认值')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          />
          <DefaultValue tagId={kid} editFlag={editFlag} onRef={this.defaultRef} /> */}
            <Tabs defaultActiveKey="defaultValue">
              <TabPane forceRender tab={intl.get(`defaultValue`).d('默认值')} key="defaultValue">
                <DefaultValue attributeInfo={attributeInfo} tagId={kid} editFlag={editFlag} onRef={this.defaultRef} />
              </TabPane>
              <TabPane
                forceRender
                tab={intl.get(`extendedAttributes`).d('检验属性')}
                key="extendedAttributes"
              >
                <ExtendedAttributes {...extendedAttributesProps} onRef={this.extendedAttributesRef} />
              </TabPane>
            </Tabs>
            {AttributeDrawer && <AttributeDrawer {...attributeDrawerProps} />}
            {dataCollectionDrawerVisible && (
            <DataCollectionDrawer
              visible={dataCollectionDrawerVisible}
              onCancel={this.closeDataCollectionDrawer}
              dataCollection={dataCollection}
              editFlag={editFlag}
              onOk={this.saveDataCollection}
              saveDataCollectionLoading={saveDataCollectionLoading}
            />
          )}
          </Spin>
        </Content>
        <CopyDrawer {...copyDrawerProps} />
      </React.Fragment>
    );
  }
}
