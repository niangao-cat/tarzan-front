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
// import notification from 'utils/notification';
import ExtendFieldDrawer from './ExtendFieldDrawer';

const modelPrompt = 'tarzan.hmes.extendField.model.extendField';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} extendField - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ extendField, loading }) => ({
  extendField,
  fetchLoading: loading.effects['extendField/fetchExtendFieldList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.extendField',
})
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  state = {
    initExtendFieldData: {},
    extendFieldDrawerVisible: false,
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    // const {
    //   extendField: { extendFieldPagination = {} },
    // } = this.props;
    // this.fetchQueryList(extendFieldPagination);
    const { onSearch } = this.props;
    onSearch(pagination);
  }

  // 打开编辑抽屉
  @Bind
  handleExtendFieldDrawerShow(record = {}) {
    this.setState({ extendFieldDrawerVisible: true, initExtendFieldData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleExtendFieldDrawerCancel() {
    this.setState({ extendFieldDrawerVisible: false, initExtendFieldData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleExtendFieldDrawerOk(fieldsValue) {
    const {
      dispatch,
      onSearch,
      extendField: { extendFieldPagination = {} },
    } = this.props;
    dispatch({
      type: 'extendField/saveExtendField',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        onSearch(extendFieldPagination);
        this.setState({ extendFieldDrawerVisible: false, initExtendFieldData: {} });
      }
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      extendField: { extendFieldList = [], extendFieldPagination = {} },
      fetchLoading,
    } = this.props;
    const { extendFieldDrawerVisible, initExtendFieldData } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.attrTable`).d('表名'),
        width: 200,
        dataIndex: 'attrTable',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleExtendFieldDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.attrTableDesc`).d('表描述'),
        dataIndex: 'attrTableDesc',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.servicePackageDesc`).d('服务包'),
        dataIndex: 'servicePackageDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.attrName`).d('属性名'),
        dataIndex: 'attrName',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.attrMeaning`).d('属性描述'),
        dataIndex: 'attrMeaning',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('顺序'),
        dataIndex: 'sequence',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.tlFlag`).d('多语言标识'),
        dataIndex: 'tlFlag',
        width: 100,
        align: 'center',
        render: (_, record) => (
          <Badge
            status={record.tlFlag === 'Y' ? 'success' : 'error'}
            text={
              record.tlFlag === 'Y'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (_, record) => (
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
    ];
    // 抽屉参数
    const extendFieldDrawerProps = {
      visible: extendFieldDrawerVisible,
      onCancel: this.handleExtendFieldDrawerCancel,
      onOk: this.handleExtendFieldDrawerOk,
      initData: initExtendFieldData,
    };
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="extendId"
          dataSource={extendFieldList}
          columns={columns}
          pagination={extendFieldPagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
        {extendFieldDrawerVisible && <ExtendFieldDrawer {...extendFieldDrawerProps} />}
      </React.Fragment>
    );
  }
}
