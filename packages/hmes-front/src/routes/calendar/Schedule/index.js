/**
 * schedule - 班次模板
 * @date: 2019-7-30
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Table, Badge } from 'hzero-ui';
// import {isUndefined} from 'lodash';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { tableScrollWidth } from 'utils/utils';
import notification from 'utils/notification';
import TypeDrawer from './TypeDrawer';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.calendar.schedule.model.schedule';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

/**
 * 类型维护
 * @extends {Component} - React.Component
 * @reactProps {Object} schedule - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ schedule, loading }) => ({
  schedule,
  fetchLoading: loading.effects['schedule/fetchTypeList'],
}))
@formatterCollections({
  code: 'tarzan.calendar.schedule',
})
export default class GeneralType extends React.Component {
  state = {
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
      type: 'schedule/fetchTypeList',
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
    //   schedule: { typePagination = {} },
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
      type: 'schedule/saveType',
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
        //   type: 'schedule/fetchTypeList',
        // });
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      schedule: { typeList = [], typePagination = {} },
      fetchLoading,
    } = this.props;
    const { typeDrawerVisible, initTypeData } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.shiftCode`).d('班次编码'),
        dataIndex: 'shiftCode',
        width: 90,
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
        title: intl.get(`${modelPrompt}.shiftType`).d('排班策略'),
        dataIndex: 'shiftType',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.shiftStartTime`).d('开始时间'),
        dataIndex: 'shiftStartTime',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.shiftEndTime`).d('结束时间'),
        dataIndex: 'shiftEndTime',
        width: 150,
        align: 'center',
        // render:(val)=>{
        //   // return <Badge count={1}>{val}</Badge>
        //   return <div><span>{val}</span><span>+1</span></div>
        // }
      },
      {
        title: intl.get(`${modelPrompt}.restTime`).d('休息时间'),
        dataIndex: 'restTime',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.borrowingAbility`).d('借用能力'),
        dataIndex: 'borrowingAbility',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.sequence`).d('顺序'),
        dataIndex: 'sequence',
        width: 100,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag !== 'N' ? 'success' : 'error'}
            text={
              record.enableFlag !== 'N'
                ? intl.get(`${modelPrompt}.enable`).d('启用')
                : intl.get(`${modelPrompt}.unable`).d('禁用')
            }
          />
        ),
      },
    ];
    // 抽屉参数
    const typeDrawerProps = {
      visible: typeDrawerVisible,
      onCancel: this.handleTypeDrawerCancel,
      onOk: this.handleTypeDrawerOk,
      initData: initTypeData,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.calendar.schedule.title.list').d('班次模板')}>
          <Button icon="plus" type="primary" onClick={this.handleTypeDrawerShow}>
            {intl.get('tarzan.calendar.schedule.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <Table
            loading={fetchLoading}
            rowKey="shiftId"
            dataSource={typeList}
            scroll={{ x: tableScrollWidth(columns) }}
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
