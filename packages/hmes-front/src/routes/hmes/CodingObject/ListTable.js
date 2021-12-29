/**
 * ListTable - 表格
 * @date: 2019-8-6
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import CodingObjectDrawer from './CodingObjectDrawer';
import AttributeDrawer from './AttributeDrawer';

const modelPrompt = 'tarzan.hmes.codingObject.model.codingObject';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} codingObject - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ codingObject, loading }) => ({
  codingObject,
  fetchLoading: loading.effects['codingObject/fetchCodingObjectList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.codingObject',
})
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    initCodingObjectData: {},
    codingObjectDrawerVisible: false,
    initAttributeData: {},
    attributeDrawerVisible: false,
  };

  // 打开编辑抽屉
  @Bind
  handleCodingObjectDrawerShow(record = {}) {
    this.setState({ codingObjectDrawerVisible: true, initCodingObjectData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleCodingObjectDrawerCancel() {
    this.setState({ codingObjectDrawerVisible: false, initCodingObjectData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleCodingObjectDrawerOk(fieldsValue) {
    const { dispatch, refresh } = this.props;
    const { initCodingObjectData } = this.state;
    dispatch({
      type: 'codingObject/saveCodingObject',
      payload: {
        ...fieldsValue,
        enableFlag: fieldsValue.enableFlag ? 'Y' : 'N',
        objectId: initCodingObjectData.objectId,
        // module: initCodingObjectData.module || fieldsValue.module,
      },
    }).then(res => {
      if (res && res.success) {
        refresh();
        this.setState({
          codingObjectDrawerVisible: false,
        });
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 打开对象属性抽屉
  @Bind
  handleAttributeDrawerShow(record = {}) {
    const {
      dispatch,
      // codingObject: { codingObjectList = [] },
    } = this.props;
    dispatch({
      type: 'codingObject/fetchAttributeList',
      payload: {
        // objectId: record.objectId,
        ...record,
      },
    });
    dispatch({
      type: 'codingObject/fetchNumrangeObjectColumn',
      payload: parseFloat(record.objectId),
    });
    this.setState({ attributeDrawerVisible: true, initAttributeData: record });
  }

  // 关闭对象属性抽屉
  @Bind
  handleAttributeDrawerCancel() {
    this.setState({ attributeDrawerVisible: false, initAttributeData: {} });
  }

  @Bind
  changeModule = e => {
    const { initCodingObjectData } = this.state;
    initCodingObjectData.module = e;
    this.setState({
      initCodingObjectData,
    });
  };

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      codingObject: { codingObjectList = [], codingObjectPagination = {} },
      fetchLoading,
      handleTableChange,
    } = this.props;
    const {
      codingObjectDrawerVisible,
      attributeDrawerVisible,
      initCodingObjectData,
      initAttributeData,
    } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('编码对象编码'),
        width: 200,
        dataIndex: 'objectCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleCodingObjectDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.objectName`).d('编码对象短描述'),
        dataIndex: 'objectName',
        width: 120,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('编码对象长描述'),
        dataIndex: 'description',
        width: 200,
      },
      // {
      //   title: intl.get(`${modelPrompt}.typeGroup`).d('类型组'),
      //   dataIndex: 'typeGroup',
      //   width: 200,
      // },
      // {
      //   title: intl.get(`${modelPrompt}.module`).d('所属服务包'),
      //   dataIndex: 'moduleDesc',
      //   width: 100,
      // },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.operator`).d('对象属性'),
        dataIndex: 'operator',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleAttributeDrawerShow(record);
              }}
            >
              {intl.get(`${modelPrompt}.operator`).d('对象属性')}
            </a>
          </span>
        ),
      },
    ];
    // 抽屉参数
    const codingObjectDrawerProps = {
      visible: codingObjectDrawerVisible,
      onCancel: this.handleCodingObjectDrawerCancel,
      onOk: this.handleCodingObjectDrawerOk,
      initData: initCodingObjectData,
      changeModule: this.changeModule,
    };
    // 抽屉参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      initData: initAttributeData,
    };
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="objectId"
          dataSource={codingObjectList}
          columns={columns}
          pagination={codingObjectPagination || {}}
          onChange={handleTableChange}
          bordered
        />
        {codingObjectDrawerVisible && <CodingObjectDrawer {...codingObjectDrawerProps} />}
        {attributeDrawerVisible && <AttributeDrawer {...attributeDrawerProps} />}
      </React.Fragment>
    );
  }
}
