import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, InputNumber, Popconfirm, Select, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';

import {
  addItemToPagination,
  getCurrentOrganizationId,
  delItemToPagination,
} from 'utils/utils';
import FilterForm from './FilterForm';

const { Option } = Select;
const modelPrompt = 'tarzan.iqc.tightenAndRelax.model.transformation';
const tenantId = getCurrentOrganizationId();

@connect(({ tightenAndRelax, loading }) => ({
  tightenAndRelax,
  tenantId: getCurrentOrganizationId(),
  fetchMessageLoading: loading.effects['tightenAndRelax/fetchList'],
  deleteLoading: loading.effects['tightenAndRelax/deleteData'],
}))
@Form.create({ fieldNameProp: null })
@formatterCollections({
  code: 'tarzan.iqc.tightenAndRelax',
})
class TightenAndRelax extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      pagination: {},
      search: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.refresh();

    dispatch({
      type: 'tightenAndRelax/getSiteList',
      payload: {},
    });
  }

  @Bind()
  refresh = () => {
    const { dispatch } = this.props;
    const { search, pagination } = this.state;
    dispatch({
      type: 'tightenAndRelax/fetchList',
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
   * ???????????????????????????
   * @param {object} pagination ????????????
   */
  @Bind()
  handleTableChange(pagination = {}) {
    this.setState(
      {
        pagination,
      },
      () => {
        this.refresh();
      }
    );
  }

  /**
   * ????????????
   */
  @Bind()
  handleCreateData() {
    const {
      dispatch,
      tightenAndRelax: { dataList = [], pagination = {}, defaultSite = {} },
    } = this.props;
    if (dataList.length === 0 || (dataList.length > 0 && dataList[0]._status !== 'create')) {
      dispatch({
        type: 'tightenAndRelax/updateState',
        payload: {
          dataList: [
            {
              siteId: defaultSite.siteId,
              siteCode: defaultSite.siteCode,
              siteName: defaultSite.siteName,
              materialCode: '',
              materialName: '',
              materialId: '',
              tightenedBatches: '',
              relaxationBatches: '',
              ngBatches: '',
              enableFlag: 'Y',
              _status: 'create',
            },
            ...dataList,
          ],
          pagination: addItemToPagination(dataList.length, pagination),
        },
      });
    }
  }

  /**
   * ????????????
   */
  @Bind()
  handleEditData(record, flag) {
    const {
      dispatch,
      tightenAndRelax: { dataList },
    } = this.props;
    const newList = dataList.map(item => {
      if (record.transitionRuleId === item.transitionRuleId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'tightenAndRelax/updateState',
      payload: { dataList: newList },
    });
  }

  // ?????????????????????
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      tightenAndRelax: { dataList, pagination = {} },
    } = this.props;
    const newList = dataList.filter(item => item.transitionRuleId !== record.transitionRuleId);
    dispatch({
      type: 'tightenAndRelax/updateState',
      payload: {
        dataList: newList,
        pagination: delItemToPagination(10, pagination),
      },
    });
  }

  /**
   * ?????????
   */
  @Bind()
  handleCancel(record) {
    const {
      dispatch,
      tightenAndRelax: { dataList },
    } = this.props;
    const newList = dataList.filter(item => item.transitionRuleId !== record.transitionRuleId);
    dispatch({
      type: 'tightenAndRelax/updateState',
      payload: {
        dataList: newList,
      },
    });
  }

  // ????????????
  @Bind
  handleSaveData(record) {
    const {
      dispatch,
    } = this.props;
    record.$form.validateFields((err, fieldsValue) => {
      if (!err) {
        dispatch({
          type: 'tightenAndRelax/saveData',
          payload: {
            ...fieldsValue,
            transitionRuleId: record.transitionRuleId,
            siteId: record.siteId,
            materialId: record.materialId,
            materialName: record.materialName,
          },
        }).then(res => {
          if (res && res) {
            notification.success({ message: '???????????????' });
            this.refresh();
          }
        });
      }
    });
  }

  // ??????
  @Bind
  deleteData() {
    const {
      tightenAndRelax: { dataList = [] },
      dispatch,
    } = this.props;
    const { selectedRows } = this.state;
    // apiId
    dispatch({
      type: 'tightenAndRelax/deleteData',
      // payload: selectedRows,
      payload: dataList
        .filter(ele => selectedRows.some(eles => eles === ele.transitionRuleId))
        .map(ele => ele.transitionRuleId),
    }).then(res => {
      if (res) {
        notification.success();
        this.setState(
          {
            selectedRows: [],
            pagination: {},
          },
          () => {
            this.refresh();
          }
        );
      }
    });
  }

  // ???????????????
  @Bind
  onChange(selectedRows) {
    this.setState({
      selectedRows,
    });
  }

  // lov ????????????????????????
  @Bind
  updateState = (value, record, index) => {
    const {
      dispatch,
      tightenAndRelax: { dataList = [] },
    } = this.props;
    dataList[index].materialName = record.materialName;
    dataList[index].materialCode = record.materialCode;
    dataList[index].materialId = record.materialId;
    dispatch({
      type: 'tightenAndRelax/updateState',
      payload: {
        dataList,
      },
    });
  };

  /**
   * ????????????
   * @returns
   */
  render() {
    const enableFlagArr = [
      {
        value: 'Y',
        description: '???',
      },
      {
        value: 'N',
        description: '???',
      },
    ];

    const {
      tightenAndRelax: { dataList = [], pagination = {} },
      fetchMessageLoading,
      deleteLoading,
    } = this.props;
    const { selectedRows } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('??????'),
        width: 120,
        dataIndex: 'siteName',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <span>
              <Form.Item>
                {record.$form.getFieldDecorator(`siteName`, {
                  initialValue: record.siteName,
                })(
                  <Input disabled />
                )}
              </Form.Item>
            </span>
          ) : (
              val
            ),
      },

      {
        title: intl.get(`${modelPrompt}.materialCode`).d('????????????'),
        width: 120,
        dataIndex: 'materialCode',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`materialId`, {
                initialValue: val,
              })(
                <Lov
                  textValue={record.materialCode}
                  code="QMS.MATERIAL"
                  onChange={(_, records) => this.updateState(_, records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },

      {
        title: intl.get(`${modelPrompt}.materialName`).d('????????????'),
        width: 120,
        dataIndex: 'materialName',
      },

      {
        title: intl.get(`${modelPrompt}.tightenedBatches`).d('???????????????'),
        width: 120,
        dataIndex: 'tightenedBatches',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tightenedBatches`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.tightenedBatches`).d('???????????????'),
                    }),
                  },
                ],
                initialValue: val,
              })(<InputNumber min={1} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.ngBatches`).d('??????????????????'),
        dataIndex: 'ngBatches',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`ngBatches`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.ngBatches`).d('??????????????????'),
                    }),
                  },
                ],
                initialValue: record.ngBatches,
              })(<InputNumber min={1} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.relaxationBatches`).d('???????????????'),
        dataIndex: 'relaxationBatches',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`relaxationBatches`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.relaxationBatches`).d('???????????????'),
                    }),
                  },
                ],
                initialValue: record.relaxationBatches,
              })(<InputNumber min={1} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('????????????'),
        dataIndex: 'enableFlag',
        width: 120,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag,
              })(
                <Select defaultValue={enableFlagArr[0].value} style={{ width: '100%' }}>
                  {enableFlagArr.map(ele => (
                    <Option value={ele.value}>{ele.description}</Option>
                  ))}
                  {/* <Option value="Y">???</Option>
                   <Option value="N">???</Option> */}
                </Select>
              )}
            </Form.Item>
          ) : (
              (enableFlagArr.filter(ele => ele.value === val)[0] || {}).description
              // record.enableFlagMeaning
            ),
      },
      {
        title: intl.get('hzero.common.button.action').d('??????'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditData(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('??????')}
                </a>
                <a onClick={() => this.handleSaveData(record)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('??????')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditData(record, true)}>
                {intl.get('tarzan.acquisition.transformation.button.edit').d('??????')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('??????')}
                </a>
                <a onClick={() => this.handleSaveData(record)}>
                  {intl.get('tarzan.acquisition.transformation.button.save').d('??????')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: this.onChange,
      getCheckboxProps: record => ({
        // ??????????????????
        disabled: !record.transitionRuleId,
      }),
    };
    return (
      <React.Fragment>
        <Header
          title={intl.get('tarzan.acquisition.transformation.title.list').d('????????????????????????')}
        >
          <Button icon="plus" type="primary" onClick={this.handleCreateData}>
            {intl.get('tarzan.acquisition.transformation.button.create').d('??????')}
          </Button>
          {selectedRows.length === 0 ? (
            <Button icon="delete" loading={deleteLoading} disabled={selectedRows.length === 0}>
              {intl.get('tarzan.acquisition.transformation.button.delete').d('??????')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                  .get(`${modelPrompt}.confirm.delete`, {
                    count: selectedRows.length,
                  })
                  .d(`??????${selectedRows.length}???????????????????????????????`)}
              onConfirm={this.deleteData}
            >
              <Button
                icon="delete"
                disabled={selectedRows.length === 0}
                loading={deleteLoading}
              >
                {intl.get('hzero.common.button.delete').d('??????')}
              </Button>
            </Popconfirm>
            )}
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} onResetSearch={this.onResetSearch} />
          <EditTable
            loading={fetchMessageLoading}
            rowKey="transitionRuleId"
            rowSelection={rowSelection}
            dataSource={dataList}
            columns={columns}
            pagination={pagination || {}}
            onChange={this.handleTableChange}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}

export default TightenAndRelax;
