/**
 * numberRangeDistribution - 号码字段分配维护
 * @date: 2019-8-1
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Table, Badge, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import NumberRangeDistributionDrawer from './NumberRangeDistributionDrawer';
import HistoryDrawer from './HistoryDrawer';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.hmes.number.model.number';

/**
 * 号码字段分配维护
 * @extends {Component} - React.Component
 * @reactProps {Object} numberRangeDistribution - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ numberRangeDistribution, loading }) => ({
  numberRangeDistribution,
  fetchLoading: loading.effects['numberRangeDistribution/fetchNumberRangeDistributionList'],
  deleteLoading: loading.effects['numberRangeDistribution/deleteNumberRangeDistribution'],
}))
@formatterCollections({ code: 'tarzan.hmes.number' })
export default class NumberRangeDistribution extends React.Component {
  state = {
    selectedRows: [],
    historyDrawerVisible: false,
    // 用来保存查询条件中的value
    fromRecord: {},
    currentRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'numberRangeDistribution/fetchNumberRangeDistributionList',
    });
  }

  @Bind()
  onRef(ref) {
    this.child = ref;
  }

  @Bind()
  onRefNumber(ref) {
    this.numberRef = ref;
  }

  @Bind()
  onRefHistory(ref) {
    this.historyRef = ref;
  }

  /**
   * 分页变化后触发方法
   * @param {object} pagination 分页信息
   */
  @Bind()
  handleTableChange(pagination) {
    this.child.fetchQueryList(pagination);
    this.setState({
      selectedRows: [],
    });
  }

  // 打开号码段抽屉
  @Bind
  handleNumberRangeDistributionDrawerShow(record) {
    if (this.state.fromRecord.objectId) {
      this.numberRef.showDrawer(record);
    } else {
      notification.info({
        message: intl.get(`${modelPrompt}.objectIsNull`).d('编码对象编码为空'),
      });
    }
  }

  // 新增编辑号码段确认
  @Bind
  handleNumberRangeDistributionDrawerOk(fieldsValue) {
    const { dispatch } = this.props;
    dispatch({
      type: 'numberRangeDistribution/saveNumberRangeDistribution',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        // 清空号码新增编辑页详情
        this.numberRef.onCancel();
        this.numberRef.handleFormReset();
        notification.success();
        // 重新查询数据，更新列表
        this.child.fetchQueryList();
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 修改历史抽屉
  @Bind
  handleHistoryDrawerShow() {
    const { currentRows } = this.state;
    if (this.state.fromRecord.objectId) {
      // 查询
      // this.historyRef.queryValue(currentRows);
      this.historyRef.initData(currentRows);
      this.setState({ historyDrawerVisible: true });
    } else {
      notification.info({
        message: intl.get(`${modelPrompt}.objectIsNull`).d('编码对象编码为空'),
      });
    }
  }

  // 关闭修改历史抽屉
  @Bind
  handleHistoryDrawerCancel() {
    this.setState({ historyDrawerVisible: false });
  }

  // 删除
  @Bind
  deleteNumberRangeDistribution() {
    const { dispatch, numberRangeDistribution } = this.props;
    const { selectedRows } = this.state;
    const list = numberRangeDistribution.numberRangeDistributionList.filter(item =>
      selectedRows.includes(item.numrangeAssignId)
    );
    // if (selectedRows.length > 0) {
    //   selectedRows.map(item => {
    //     return list.push(numberRangeDistribution.numberRangeDistributionList[item]);
    //   });
    // }
    dispatch({
      type: 'numberRangeDistribution/deleteNumberRangeDistribution',
      payload: list,
    }).then(res => {
      if (res && res.success) {
        notification.success();
        // this.child.queryValue();
        this.child.fetchQueryList();
        this.setState({
          selectedRows: [],
        });
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 选中行事件
  @Bind
  onChange(selectedRows, selectedRowKeys) {
    this.setState({
      selectedRows,
      currentRows: selectedRowKeys.map(ele => ele.numrangeGroup),
    });
  }

  @Bind()
  queryFromRecord(record) {
    this.setState({
      fromRecord: record,
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      numberRangeDistribution: {
        numberRangeDistributionList = [],
        numberRangeDistributionPagination = {},
      },
      fetchLoading,
      deleteLoading,
    } = this.props;
    const { selectedRows, historyDrawerVisible, fromRecord } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.numrangeGroup`).d('号段组号'),
        width: 150,
        dataIndex: 'numrangeGroup',
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleNumberRangeDistributionDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.numDescription`).d('号段描述'),
        dataIndex: 'numDescription',
        width: 250,
      },
      {
        title: intl.get(`${modelPrompt}.numExample`).d('号段示例'),
        dataIndex: 'numExample',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.outsideNumFlag`).d('外部输入编码'),
        dataIndex: 'outsideNumFlag',
        width: 150,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.outsideNumFlag === 'Y' ? 'success' : 'error'}
            text={
              record.outsideNumFlag === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('编码对象编码'),
        dataIndex: 'objectCode',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.objectDesc`).d('编码对象描述'),
        dataIndex: 'objectName',
        width: 150,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.objectType`).d('对象类型编码'),
        dataIndex: 'objectTypeCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.objectTypeDesc`).d('对象类型描述'),
        dataIndex: 'objectTypeDesc',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        dataIndex: 'site',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.siteDesc`).d('站点描述'),
        dataIndex: 'siteDesc',
        width: 150,
      },
    ];
    const rowSelection = {
      selectedRows,
      onChange: this.onChange,
    };
    // 传入号码段新增和编辑的抽屉props
    const numberRangeDistributionDrawerProps = {
      queryFromRecord: fromRecord,
      onOk: this.handleNumberRangeDistributionDrawerOk,
    };
    // 抽屉参数
    const tableDrawerProps = {
      visible: historyDrawerVisible,
      onCancel: this.handleHistoryDrawerCancel,
      onOk: this.handleHistoryDrawerCancel,
      queryFromRecord: fromRecord,
    };
    const queryFormProps = {
      queryFromRecord: this.queryFromRecord,
    };
    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.hmes.number.title.list').d('号码段分配')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.handleNumberRangeDistributionDrawerShow();
            }}
          >
            {intl.get(`tarzan.hmes.number.button.create`).d('新建')}
          </Button>
          <Button
            icon="edit"
            onClick={() => {
              this.handleHistoryDrawerShow();
            }}
          >
            {intl.get(`${modelPrompt}.history`).d('修改历史')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button icon="delete" loading={deleteLoading} disabled={selectedRows.length === 0}>
              {intl.get(`${modelPrompt}.delete`).d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRows.length,
                })
                .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
              onConfirm={this.deleteNumberRangeDistribution}
            >
              <Button icon="delete" loading={deleteLoading} disabled={selectedRows.length === 0}>
                {intl.get(`${modelPrompt}.delete`).d('删除')}
              </Button>
            </Popconfirm>
          )}
        </Header>
        <Content>
          <FilterForm {...queryFormProps} onRef={this.onRef} />
          <Table
            loading={fetchLoading}
            rowKey="numrangeAssignId"
            rowSelection={rowSelection}
            dataSource={numberRangeDistributionList}
            columns={columns}
            pagination={numberRangeDistributionPagination || {}}
            onChange={this.handleTableChange}
            bordered
            scroll={{ x: 1770 }}
          />
          <NumberRangeDistributionDrawer
            {...numberRangeDistributionDrawerProps}
            onRef={this.onRefNumber}
          />
          <HistoryDrawer {...tableDrawerProps} onRef={this.onRefHistory} />
        </Content>
      </React.Fragment>
    );
  }
}
