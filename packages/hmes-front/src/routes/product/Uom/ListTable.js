/**
 * ListTable - 表格
 * @date: 2019-8-6
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import notification from 'utils/notification';
import UomDrawer from './UomDrawer';
import AttributeDrawer from './AttributeDrawer';

const modelPrompt = 'tarzan.product.uom.model.uom';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} uom - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ uom, loading }) => ({
  uom,
  fetchLoading: loading.effects['uom/fetchUomList'],
}))
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    initUomData: {},
    attributeData: {},
    uomDrawerVisible: false,
    attributeDrawerVisible: false,
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  // 打开编辑抽屉
  @Bind
  handleUomDrawerShow(record = {}) {
    this.setState({ uomDrawerVisible: true, initUomData: record });
  }

  // 打开扩展字段抽屉
  @Bind
  handleAttributeDrawerShow(record = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'uom/fetchAttributeList',
      payload: {
        kid: record.uomId,
        tableName: 'mt_uom_attr',
      },
    });
    this.setState({ attributeDrawerVisible: true, attributeData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleUomDrawerCancel() {
    this.setState({ uomDrawerVisible: false, initUomData: {} });
  }

  // 关闭扩展字段抽屉
  @Bind
  handleAttributeDrawerCancel() {
    this.setState({ attributeDrawerVisible: false, attributeData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleUomDrawerOk(fieldsValue) {
    const {
      dispatch,
      onSearch,
      uom: { uomPagination = {} },
    } = this.props;
    dispatch({
      type: 'uom/saveUom',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({ uomDrawerVisible: false, initUomData: {} });
        notification.success();
        onSearch(uomPagination);
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
      uom: { uomList = [], uomPagination = {}, uomTypeList = [], processModeList = [] },
      fetchLoading,
    } = this.props;
    const { uomDrawerVisible, initUomData, attributeDrawerVisible, attributeData } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.uomType`).d('单位类别'),
        dataIndex: 'uomType',
        width: 100,
        render: val => (
          <Fragment>
            {uomTypeList instanceof Array && uomTypeList.length !== 0
              ? (uomTypeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.uomCode`).d('单位编码'),
        dataIndex: 'uomCode',
        width: 100,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleUomDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.uomName`).d('单位描述'),
        dataIndex: 'uomName',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.primaryFlag`).d('是否主单位'),
        dataIndex: 'primaryFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.primaryFlag === 'Y' ? 'success' : 'error'}
            text={
              record.primaryFlag === 'Y'
                ? intl.get(`${modelPrompt}.yes`).d('是')
                : intl.get(`${modelPrompt}.no`).d('否')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.conversionValue`).d('主单位换算'),
        dataIndex: 'conversionValue',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.decimalNumber`).d('小数位数'),
        dataIndex: 'decimalNumber',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.processMode`).d('尾数处理模式'),
        dataIndex: 'processMode',
        width: 100,
        render: val => (
          <Fragment>
            {processModeList instanceof Array && processModeList.length !== 0
              ? (processModeList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
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
        title: intl.get(`${modelPrompt}.operator`).d('扩展字段'),
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
              {intl.get(`${modelPrompt}.operator`).d('扩展字段')}
            </a>
          </span>
        ),
      },
    ];
    // 抽屉参数
    const uomDrawerProps = {
      visible: uomDrawerVisible,
      onCancel: this.handleUomDrawerCancel,
      onOk: this.handleUomDrawerOk,
      initData: initUomData,
      uomTypeList,
      processModeList,
    };
    // 扩展字段参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      initData: attributeData,
    };
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="uomId"
          dataSource={uomList}
          columns={columns}
          pagination={uomPagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
        <UomDrawer {...uomDrawerProps} />
        <AttributeDrawer {...attributeDrawerProps} />
      </React.Fragment>
    );
  }
}
