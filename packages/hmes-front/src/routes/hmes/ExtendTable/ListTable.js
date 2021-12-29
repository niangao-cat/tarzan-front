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
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import ExtendTableDrawer from './ExtendTableDrawer';
import ExtendFieldDrawer from './ExtendFieldDrawer';

const modelPrompt = 'tarzan.hmes.extendTable.model.extendTable';

/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 表格
 * @extends {Component} - React.Component
 * @reactProps {Object} extendTable - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ extendTable, loading }) => ({
  extendTable,
  fetchLoading: loading.effects['extendTable/fetchExtendTableList'],
}))
@formatterCollections({
  code: 'tarzan.hmes.extendTable',
})
export default class ListTable extends React.Component {
  constructor(props) {
    super(props);
    props.onRef(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'extendTable/fetchServicePackageList',
      payload: {
        module: 'GENERAL',
        typeGroup: 'SERVICE_PACKAGE',
      },
    });
  }

  state = {
    initExtendTableData: {},
    extendTableDrawerVisible: false,
    extendFieldDrawerVisible: false,
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pageination) {
    const { onSearch } = this.props;
    onSearch(pageination);
  }

  // 打开编辑抽屉
  @Bind
  handleExtendTableDrawerShow(record = {}) {
    this.setState({ extendTableDrawerVisible: true, initExtendTableData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleExtendTableDrawerCancel() {
    this.setState({ extendTableDrawerVisible: false, initExtendTableData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleExtendTableDrawerOk(fieldsValue) {
    const {
      dispatch,
      onSearch,
      extendTable: { extendTablePagination = {} },
    } = this.props;
    dispatch({
      type: 'extendTable/saveExtendTable',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        this.handleExtendTableDrawerCancel();
        onSearch(extendTablePagination);
        notification.success();
      } else {
        notification.error({ message: res.message });
      }
    });
  }

  extendedField(record) {
    this.setState({
      extendFieldDrawerVisible: true,
      tableId: record.extendTableDescId ? record.extendTableDescId : '',
    });
  }

  @Bind()
  handleExtendFieldDrawerCancel() {
    const { dispatch } = this.props;
    this.setState({
      extendFieldDrawerVisible: false,
    });
    dispatch({
      type: 'extendTable/updateState',
      payload: {
        fieldDrawerList: [],
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      extendTable: {
        extendTableList = [],
        extendTablePagination = {},
        servicePackageList = [],
        fieldDrawerList,
      },
      fetchLoading,
    } = this.props;
    const {
      extendTableDrawerVisible,
      extendFieldDrawerVisible,
      initExtendTableData,
      tableId,
    } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.attrTable`).d('表名'),
        width: 150,
        dataIndex: 'attrTable',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleExtendTableDrawerShow(record);
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
        title: intl.get(`${modelPrompt}.servicePackage`).d('服务包'),
        dataIndex: 'servicePackage',
        width: 100,
        render: val => (
          <Fragment>
            {servicePackageList instanceof Array && servicePackageList.length !== 0
              ? (servicePackageList.filter(item => item.typeCode === val)[0] || {}).description
              : ''}
          </Fragment>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.mainTable`).d('主表'),
        dataIndex: 'mainTable',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.mainTableKey`).d('主表主键'),
        dataIndex: 'mainTableKey',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.hisTable`).d('主表历史表'),
        dataIndex: 'hisTable',
        width: 200,
      },

      {
        title: intl.get(`${modelPrompt}.hisAttrTable`).d('历史表的扩展表'),
        dataIndex: 'hisAttrTable',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.hisTableKey`).d('历史表的主键'),
        dataIndex: 'hisTableKey',
        width: 200,
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
        title: intl.get(`${modelPrompt}.operation`).d('操作'),
        dataIndex: 'operation',
        width: 100,
        align: 'center',
        fixed: 'right',
        render: (_, record) => (
          <a onClick={() => this.extendedField(record)}>
            {intl.get('tarzan.hmes.extendTable.button.extendedField').d('扩展字段')}
          </a>
        ),
      },
    ];
    // 抽屉参数
    const extendTableDrawerProps = {
      visible: extendTableDrawerVisible,
      onCancel: this.handleExtendTableDrawerCancel,
      onOk: this.handleExtendTableDrawerOk,
      initData: initExtendTableData,
      servicePackageList,
    };

    const extendFieldDrawerProps = {
      visible: extendFieldDrawerVisible,
      onCancel: this.handleExtendFieldDrawerCancel,
      tableId,
      fieldDrawerList,
    };
    return (
      <React.Fragment>
        <Table
          loading={fetchLoading}
          rowKey="extendTableDescId"
          dataSource={extendTableList}
          columns={columns}
          pagination={extendTablePagination || {}}
          onChange={this.handleTableChange}
          bordered
        />
        <ExtendTableDrawer {...extendTableDrawerProps} />
        {extendFieldDrawerVisible && <ExtendFieldDrawer {...extendFieldDrawerProps} />}
      </React.Fragment>
    );
  }
}
