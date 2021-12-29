import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Table, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'hzero-front/lib/utils/notification';
import styles from './index.less';
import SubstituteItemDrawer from './SubtituteItemDrawer';

const modelPrompt = 'tarzan.product.bom.model.bom';
/**
 * 替代项表格
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  tenantId: getCurrentOrganizationId(),
  loading: {
    query: loading.effects['assemblyList/fetchKafkaTableData'],
  },
}))
@Form.create({ fieldNameProp: null })
export default class SubstituteItemTable extends PureComponent {
  state = {
    substituteItemDrawerVisible: false,
    itemData: {},
    substituteItemList: [],
  };

  componentWillReceiveProps() {
    const {
      assemblyList: { substituteItemList = [] },
    } = this.props;
    this.setState({ substituteItemList });
  }

  /**
   * 新建替代项行
   */
  @Bind()
  handleCreateItem() {
    this.setState({
      substituteItemDrawerVisible: true,
    });
  }

  /**
   * 编辑替代项行
   */
  @Bind()
  handleEditItem(record) {
    this.setState({
      substituteItemDrawerVisible: true,
      itemData: record,
    });
  }

  // 替代项行抽屉确认
  @Bind
  handleSubstituteItemDrawerOk(fieldsValue) {
    const { dispatch, tableId } = this.props;
    dispatch({
      type: 'assemblyList/saveSubstituteItem',
      payload: {
        ...fieldsValue,
        bomSubstituteGroupId: tableId, // 替代组的主键
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        // 关闭弹窗，然后刷新数据
        this.handleSubstituteItemDrawerCancel();
        dispatch({
          type: 'assemblyList/fetchSubstituteItemList',
          payload: {
            bomSubstituteGroupId: tableId,
          },
        });
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  }

  // 替代项行抽屉取消
  @Bind
  handleSubstituteItemDrawerCancel() {
    this.setState({
      substituteItemDrawerVisible: false,
      itemData: {},
    });
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }} className={styles.dropDown}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleFilterSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleFilterSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          {intl.get('hzero.common.button.search').d('查询')}
        </Button>
        <Button
          onClick={() => this.handleFilterReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          {intl.get('hzero.common.button.reset').d('重置')}
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.focus());
      }
    },
  });

  handleFilterSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleFilterReset = clearFilters => {
    clearFilters();
  };

  render() {
    const { tableId, bomId, currentBomId, canEdit } = this.props;
    const { substituteItemDrawerVisible, itemData, substituteItemList } = this.state;
    const substituteItemColumns = [
      {
        title: (
          <Button
            className={tableId === '' ? '' : styles.activeCreate}
            icon="plus"
            shape="circle"
            size="small"
            onClick={this.handleCreateItem}
            disabled={tableId === '' || !canEdit}
          />
        ),
        align: 'center',
        width: 60,
        render: () => <Button disabled icon="minus" shape="circle" size="small" />,
      },
      {
        title: intl.get(`${modelPrompt}.materialId`).d('替代物料编码'),
        dataIndex: 'materialCode',
        width: 200,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleEditItem(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
        ...this.getColumnSearchProps('materialCode'),
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('替代物料描述'),
        dataIndex: 'materialName',
        width: 180,
        ...this.getColumnSearchProps('materialName'),
      },
      {
        title: intl.get(`${modelPrompt}.substituteValue`).d('替代值'),
        dataIndex: 'substituteValue',
        width: 130,
        sorter: (a, b) => a.substituteValue - b.substituteValue,
      },
      {
        title: intl.get(`${modelPrompt}.substituteUsage`).d('替代用量'),
        dataIndex: 'substituteUsage',
        width: 130,
        sorter: (a, b) => a.substituteUsage - b.substituteUsage,
      },
      {
        title: intl.get(`${modelPrompt}.dateFrom`).d('生效时间'),
        dataIndex: 'dateFrom',
        width: 180,
        align: 'center',
        sorter: (a, b) => (a.dateFrom < b.dateFrom ? 1 : -1),
      },
      {
        title: intl.get(`${modelPrompt}.dateTo`).d('失效时间'),
        dataIndex: 'dateTo',
        width: 180,
        align: 'center',
        sorter: (a, b) => (a.dateTo < b.dateTo ? 1 : -1),
      },
    ];
    const substituteItemDrawerProps = {
      visible: substituteItemDrawerVisible,
      initData: itemData,
      onCancel: this.handleSubstituteItemDrawerCancel,
      onOk: this.handleSubstituteItemDrawerOk,
      bomId,
      currentBomId,
    };
    return (
      <Fragment>
        <Table
          bordered
          rowKey="bomSubstituteId"
          columns={substituteItemColumns}
          dataSource={substituteItemList}
        />
        <SubstituteItemDrawer {...substituteItemDrawerProps} />
      </Fragment>
    );
  }
}
