
/**
 * @description  处置组功能维护
 * @param null
 * @author ywj
 * @email wenjie.yang01@hand-china.com
 * @date 2020/11/25
 * @time 13:52
 * @version 0.0.1
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Popconfirm } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId, tableScrollWidth, filterNullValueObject } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'DisposalGroupMaintenance';
/**
 * 使用 Select 的 Option 组件
 */
// const {Option} = Select;

@connect(({ disposalGroupMaintenance, loading }) => ({
  disposalGroupMaintenance,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['disposalGroupMaintenance/fetchList'],
  deleteloading: loading.effects['disposalGroupMaintenance/deleteRecord'],
}))
@formatterCollections({ code: 'tarzan.hhme.disposalGroupMaintenance' })
@Form.create({ fieldNameProp: null })
export default class DisposalGroupMaintenance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    const fieldsValue = (this.filterForm && filterNullValueObject(this.filterForm.getFieldsValue())) || {};
    dispatch({
      type: 'disposalGroupMaintenance/fetchList',
      payload: {
        ...fieldsValue,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 页面跳转到工作单元明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showWorkcellDist(record = {}) {
    const { history } = this.props;
    history.push(`/hhme/disposal-group-maintenance/detail/${record.dispositionGroupId}`);
  }

  // 创建数据
  @Bind()
  createGroupAndMethod() {
    const { history } = this.props;
    history.push(`/hhme/disposal-group-maintenance/detail/create`);
  }

  // 选中行
  @Bind()
  onSelectRow(selectedRowKeys) {
    this.setState({ selectedRowKeys });
  }

  // 删除
  @Bind()
  deleteData() {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      notification.error({ message: '请勾选数据！' });
    } else {
      const { dispatch } = this.props;
      dispatch({
        type: 'disposalGroupMaintenance/deleteRecord',
        payload: {
          dispositionGroupIdList: selectedRowKeys,
        },
      }).then(res=>{
        if (res.success) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      disposalGroupMaintenance: {
        list = [],
        pagination = {},
      },
      loading,
      deleteLoading,
    } = this.props;
    const { selectedRowKeys } = this.state;
    const filterFormProps = {
      onRef: node => {
        this.filterForm = node.props.form;
      },
    };
    const columns = [
      {
        title: intl.get(`${modelPrompt}.dispositionGroup`).d('处置组编码'),
        dataIndex: 'dispositionGroup',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showWorkcellDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('处置组描述'),
        dataIndex: 'description',
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('站点描述'),
        dataIndex: 'siteName',
      },
    ];
    return (
      <React.Fragment>
        <Header title='处置组功能维护'>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createGroupAndMethod();
            }}
          >
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          {selectedRowKeys.length === 0 ? (
            <Button icon="delete" loading={deleteLoading} disabled={selectedRowKeys.length === 0}>
              {intl.get(`${modelPrompt}.delete`).d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRowKeys.length,
                })
                .d(`总计${selectedRowKeys.length}条数据，是否确认删除?`)}
              onConfirm={this.deleteData}
            >
              <Button icon="delete" loading={deleteLoading} disabled={selectedRowKeys.length === 0}>
                {intl.get(`${modelPrompt}.delete`).d('删除')}
              </Button>
            </Popconfirm>
            )}
        </Header>
        <Content>
          <FilterForm
            onSearch={this.handleSearch}
            {...filterFormProps}
          />
          <Table
            loading={loading}
            rowKey="dispositionGroupId"
            dataSource={list}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={pagination}
            onChange={this.handleSearch}
            bordered
            rowSelection={{
              fixed: true,
              columnWidth: 50,
              selectedRowKeys,
              onChange: this.onSelectRow,
            }}
          />
        </Content>
      </React.Fragment>
    );
  }
}
