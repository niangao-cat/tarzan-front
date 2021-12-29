/**
 * @description: 工艺与工作单元维护
 * @author: lidong
 * @date: 2019-12-12
 * @version: V0.0.1
 * */
/* eslint-disable */
import React from 'react';
import { connect } from 'dva';
import { Button, Popconfirm } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { addItemToPagination, delItemToPagination } from 'utils/utils';
import notification from 'utils/notification';
import FilterForm from './FilterForm';
import Designer from './FlowCanvas/index';
import SelectSaveTypeModal from './FlowCanvas/components/SelectSaveTypeModal';

const modelPrompt = 'tarzan.process.flow.model.flow';

const data = {
  nodes: [
    // {
    //   id: 'node1',
    //   label: 'node1-group1',
    //   clazz: 'userTask',
    //   groupId: 'group1',
    //   x: 350,
    //   y: 100,
    // },
    // {
    //   id: 'node2',
    //   label: 'node2-group2',
    //   clazz: 'userTask',
    //   groupId: 'group1',
    //   x: 400,
    //   y: 200,
    // },
  ],
  edges: [],
  groups: [
    // {
    //   id: 'group1',
    //   // title: {
    //   //   text: '我的群组331',
    //   //   stroke: '#444',
    //   //   offsetX: -20,
    //   //   offsetY: 30,
    //   // },
    // },
  ],
};

@connect(({ flow, loading }) => ({
  flow,
  tabLoading: loading.effects['flow/fetchTableList'],
  saveLoading: loading.effects['flow/savLocatorGroupList'],
  deleteLoading: loading.effects['flow/deleteItem'],
}))
@formatterCollections({
  code: 'tarzan.process.flow',
})
export default class LocatorGroup extends React.Component {
  constructor(props) {
    super(props);
    this.wfdRef = React.createRef();
  }

  state = {
    search: {},
    selectedRows: [],
    selectedLang: 'zh',
    selectSaveModalVisible: false,
  };

  componentDidMount() {
    this.refresh();
    // 获取工艺路线状态
    this.fetchStatusOption();
  }

  fetchStatusOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'flow/fetchStatusOption',
      payload: {
        statusGroup: 'ROUTER_STATUS',
        module: 'ROUTER',
      },
    });
  };

  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    this.setState({
      selectedRows: [],
    });
    dispatch({
      type: 'flow/fetchTableList',
      payload: {
        ...search,
        page: pagination,
      },
    }).then(res => {
      if (res && !res.success) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  onSearch = (fieldsValue = {}) => {
    this.setState(
      {
        search: fieldsValue,
      },
      () => {
        this.refresh();
      }
    );
  };

  delete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (selectedRows.indexOf(null) !== -1) {
      selectedRows.splice(selectedRows.indexOf(null), 1);
    }
    if (selectedRows.length >= 1) {
      dispatch({
        type: 'flow/deleteItem',
        payload: {
          selectedRows,
        },
      }).then(res => {
        if (res && res.success) {
          notification.success();
          this.refresh();
        }
      });
    } else {
      this.refresh();
    }
  };

  onResetSearch = () => {
    this.setState({
      search: {},
    });
  };

  handleCreateEventRequestType = () => {
    const {
      dispatch,
      flow: { tableList = [], tablePagination = {} },
    } = this.props;
    if (tableList.length === 0 || (tableList.length > 0 && tableList[0]._status !== 'create')) {
      dispatch({
        type: 'flow/updateState',
        payload: {
          tableList: [
            {
              operationWkcDispatchRelId: null,
              _status: 'create',
            },
            ...tableList,
          ],
          tablePagination: addItemToPagination(tableList.length, tablePagination),
        },
      });
    }
  };

  handleCleanLine = () => {
    const {
      dispatch,
      flow: { tableList = [], tablePagination = {} },
    } = this.props;
    tableList.splice(0, 1);
    dispatch({
      type: 'flow/updateState',
      payload: {
        tableList,
        tablePagination: delItemToPagination(tablePagination.pageSize, tablePagination),
      },
    });
  };

  handleSave = record => {
    const { dispatch } = this.props;
    record.$form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'flow/saveList',
          payload: {
            ...values,
            operationWkcDispatchRelId: record.operationWkcDispatchRelId,
          },
        }).then(res => {
          if (res && res.success) {
            this.refresh();
          } else if (res) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  };

  onChange = selectedRows => {
    this.setState({
      selectedRows,
    });
  };

  clinkSaveButton = () => {
    this.setState({
      selectSaveModalVisible: true,
    });
  };

  onCancelSelected = () => {
    this.setState({
      selectSaveModalVisible: false,
    });
  };

  render() {
    const { deleteLoading } = this.props;
    const { selectedRows, selectSaveModalVisible, selectedLang } = this.state;
    const selectSaveModalProps = {
      visible: selectSaveModalVisible,
      onCancel: this.onCancelSelected,
    };

    return (
      <>
        <Header title={intl.get(`${modelPrompt}.flow`).d('工艺路线图形化')}>
          <Button icon="plus" type="primary" onClick={this.handleCreateEventRequestType}>
            {intl.get(`${modelPrompt}.create`).d('新建')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button icon="delete" onClick={this.clinkSaveButton}>
              {intl.get(`${modelPrompt}.delete`).d('保存')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRows.length,
                })
                .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
              onConfirm={this.delete}
            >
              <Button icon="delete" loading={deleteLoading} disabled={selectedRows.length === 0}>
                {intl.get(`${modelPrompt}.delete`).d('删除')}
              </Button>
            </Popconfirm>
          )}
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <Designer ref={this.wfdRef} data={data} height={600} mode="edit" lang={selectedLang} />
        </Content>
        {selectSaveModalVisible && <SelectSaveTypeModal {...selectSaveModalProps} />}
      </>
    );
  }
}
/* eslint-disable */
