/**
 * generalType - 类型维护
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Table, Badge, Popconfirm } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import TypeDrawer from './TypeDrawer';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.hmes.generalType.model.generalType';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 类型维护
 * @extends {Component} - React.Component
 * @reactProps {Object} generalType - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ generalType, loading }) => ({
  generalType,
  fetchLoading: loading.effects['generalType/fetchTypeList'],
  deleteLoading: loading.effects['generalType/deleteType'],
}))
@formatterCollections({
  code: 'tarzan.hmes.generalType',
})
export default class GeneralType extends React.Component {
  state = {
    selectedRows: [],
    initTypeData: {},
    typeDrawerVisible: false,
    search: {},
    pagination: {},
  };

  componentDidMount() {
    this.refresh();
  }

  @Bind()
  refresh = () => {
    const { dispatch } = this.props;
    const { search, pagination } = this.state;
    dispatch({
      type: 'generalType/fetchTypeList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
        pagination: {},
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  onResetSearch = () => {
    this.setState({
      selectedRows: [],
      pagination: {},
      search: {},
    });
  };

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination = {}) {
    // const {
    //   generalType: { typePagination = {} },
    // } = this.props;
    this.setState(
      {
        pagination,
      },
      () => {
        this.refresh();
      }
    );
  }

  // 打开编辑抽屉
  @Bind
  handleTypeDrawerShow(record = {}) {
    this.setState({ typeDrawerVisible: true, initTypeData: record });
  }

  // 关闭编辑抽屉
  @Bind
  handleTypeDrawerCancel() {
    this.setState({ typeDrawerVisible: false, initTypeData: {} });
  }

  // 编辑抽屉确认
  @Bind
  handleTypeDrawerOk(fieldsValue) {
    const { dispatch } = this.props;
    dispatch({
      type: 'generalType/saveType',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          typeDrawerVisible: false,
        });
        this.refresh();
        // dispatch({
        //   type: 'generalType/fetchTypeList',
        // });
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 删除
  @Bind
  deleteType() {
    const {
      generalType: { typeList = [] },
      dispatch,
    } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'generalType/deleteType',
      payload: typeList
        .filter(ele => selectedRows.some(eles => eles === ele.genTypeId))
        .map(ele => ({
          ...ele,
          tenantId: getCurrentOrganizationId(),
        })),
    }).then(res => {
      if (res && res.success) {
        this.setState(
          {
            selectedRows: [],
            pagination: {},
          },
          () => {
            this.refresh();
          }
        );
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 选中行事件
  @Bind
  onChange(selectedRows) {
    this.setState({
      selectedRows,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      generalType: { typeList = [], typePagination = {} },
      fetchLoading,
      deleteLoading,
    } = this.props;
    const { selectedRows, typeDrawerVisible, initTypeData } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.typeGroup`).d('类型组'),
        dataIndex: 'typeGroup',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.typeCode`).d('类型编码'),
        dataIndex: 'typeCode',
        width: 200,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleTypeDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('类型描述'),
        dataIndex: 'description',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.moduleDesc`).d('所属服务包'),
        dataIndex: 'moduleDesc',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('默认状态'),
        dataIndex: 'defaultFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.defaultFlag !== 'N' ? 'success' : 'error'}
            text={
              record.defaultFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.initialFlag`).d('系统初始标识'),
        dataIndex: 'initialFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.initialFlag !== 'N' ? 'success' : 'error'}
            text={
              record.initialFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('展示顺序'),
        dataIndex: 'sequence',
        width: 100,
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: this.onChange,
    };
    // 抽屉参数
    const typeDrawerProps = {
      visible: typeDrawerVisible,
      onCancel: this.handleTypeDrawerCancel,
      onOk: this.handleTypeDrawerOk,
      initData: initTypeData,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.generalType.title.list').d('类型维护')}>
          <Button icon="plus" type="primary" onClick={this.handleTypeDrawerShow}>
            {intl.get('tarzan.hmes.generalType.button.create').d('新建')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button
              icon="delete"
              loading={deleteLoading}
              disabled={selectedRows.length === 0}
              // onClick={this.deleteType}
            >
              {intl.get('hzero.common.button.delete').d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRows.length,
                })
                .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
              onConfirm={this.deleteType}
            >
              <Button
                icon="delete"
                loading={deleteLoading}
                disabled={selectedRows.length === 0}
                // onClick={this.deleteType}
              >
                {intl.get('hzero.common.button.delete').d('删除')}
              </Button>
            </Popconfirm>
          )}
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <Table
            loading={fetchLoading}
            rowKey="genTypeId"
            rowSelection={rowSelection}
            dataSource={typeList}
            columns={columns}
            pagination={typePagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
          {typeDrawerVisible && <TypeDrawer {...typeDrawerProps} />}
        </Content>
      </React.Fragment>
    );
  }
}
