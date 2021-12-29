/**
 * @description: 库位组维护入口页面
 * @author: 唐加旭
 * @date: 2019-08-15 14:03:18
 * @version: V0.0.1
 * */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Switch, Badge, Form, Input } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { addItemToPagination, delItemToPagination } from 'utils/utils';
import notification from 'utils/notification';
import TLEditor from '@/components/TLEditor';
import EditTable from 'components/EditTable';
import FilterForm from './filterForm';
import AttrDrawer from './attrDrawer';

const modelPrompt = 'tarzan.org.locatorGroup.model.locatorGroup';

@connect(({ locatorGroup, loading }) => ({
  locatorGroup,
  tabLoading: loading.effects['locatorGroup/fetchLocatorGroupList'],
  saveLoading: loading.effects['locatorGroup/savLocatorGroupList'],
}))
@formatterCollections({
  code: 'tarzan.org.locatorGroup',
})
export default class LocatorGroup extends React.Component {
  state = {
    visible: false,
    currentData: {},
  };

  componentDidMount() {
    this.refresh();
  }

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;

    let params = {};
    if (this.filterForm) {
      this.filterForm.validateFields((err, values) => {
        if (!err) {
          params = values;
        }
      });
    }

    dispatch({
      type: 'locatorGroup/fetchLocatorGroupList',
      payload: {
        ...params,
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

  refForm = (refs = {}) => {
    this.filterForm = (refs.props || {}).form;
  };

  /**
   *@functionName:   onSearch
   * @params {Object} fieldsValue 搜索条件
   *@description: 缓存搜索条件并进行查询
   *@author: 唐加旭
   *@date: 2019-08-15 14:37:31
   *@version: V0.0.1
   * */
  @Bind()
  onSearch = () => {
    this.refresh();
  };

  /**
   *@functionName:   onResetSearch
   *@description: 清除搜索条件缓存
   *@author: 唐加旭
   *@date: 2019-08-15 14:39:09
   *@version: V0.8.6
   * */
  @Bind()
  onResetSearch = () => {
    // onreset
  };

  /**
   *@functionName:   handleCreateEventRequestType
   *@description:  列表新增一行数据
   *@author: 唐加旭
   *@date: 2019-08-15 14:15:51
   *@version: V0.0.1
   * */
  @Bind()
  handleCreateEventRequestType = () => {
    const {
      dispatch,
      locatorGroup: { locatorGroupList = [], locatorGroupPagination = {} },
    } = this.props;
    if (
      locatorGroupList.length === 0 ||
      (locatorGroupList.length > 0 && locatorGroupList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'locatorGroup/updateState',
        payload: {
          locatorGroupList: [
            {
              messageId: '',
              enableFlag: 'Y',
              locatorGroupId: null,
              _status: 'create',
            },
            ...locatorGroupList,
          ],
          locatorGroupPagination: addItemToPagination(
            locatorGroupList.length,
            locatorGroupPagination
          ),
        },
      });
    }
  };

  /**
   *@functionName:   handleEditMessage
   *@params:  {object} record 当前行数据
   *@params {Boolean} bool 是否编辑
   *@description 取消/使能当前行编辑
   *@author: 唐加旭
   *@date: 2019-08-15 17:05:57
   *@version: V0.0.1
   * */
  handleEditMessage = (record, bool) => {
    const {
      locatorGroup: { locatorGroupList = [] },
      dispatch,
    } = this.props;
    const newList = locatorGroupList.map(item => {
      if (record.locatorGroupId === item.locatorGroupId) {
        return { ...item, _status: bool ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'locatorGroup/updateState',
      payload: {
        locatorGroupList: newList,
      },
    });
  };

  /**
   *@functionName:  handleCleanLine
   *@description:
   *@author: 唐加旭
   *@date: 2019-08-15 17:16:51
   *@version: V0.8.6
   * */
  handleCleanLine = record => {
    const {
      dispatch,
      locatorGroup: { locatorGroupList = [], locatorGroupPagination = {} },
    } = this.props;
    const newList = locatorGroupList.filter(item => item.locatorGroupId !== record.locatorGroupId);
    dispatch({
      type: 'locatorGroup/updateState',
      payload: {
        locatorGroupList: newList,
        locatorGroupPagination: delItemToPagination(
          locatorGroupPagination.pageSize,
          locatorGroupPagination
        ),
      },
    });
  };

  /**
   *@functionName:  handleSave
   *@description: 对列表数据进行保存
   *@author: 唐加旭
   *@date: 2019-08-15 14:18:52
   *@version: V0.0.1
   * */
  handleSave = (record, index) => {
    const {
      dispatch,
      locatorGroup: { locatorGroupList = [] },
    } = this.props;
    record.$form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'locatorGroup/savLocatorGroupList',
          payload: {
            ...values,
            locatorGroupId: record.locatorGroupId,
            enableFlag: values.enableFlag ? 'Y' : 'N',
          },
        }).then(res => {
          if (res && res.success) {
            locatorGroupList[index] = {
              _status: '',
              locatorGroupId: res.rows,
              locatorGroupCode: values.locatorGroupCode,
              locatorGroupName: values.locatorGroupName,
              enableFlag: values.enableFlag ? 'Y' : 'N',
            };
            dispatch({
              type: 'locatorGroup/updateState',
              payload: {
                locatorGroupList,
              },
            });
          } else if (res) {
            notification.error({
              message: res.message,
            });
          }
        });
      }
    });
  };

  /**
   *@functionName:   handleStatusDrawerShow
   *@params {Object} record 当前修改扩展字段的库位组
   *@description 开启扩展字段编辑模态框，并记录下当前库位组
   *@author: 唐加旭
   *@date: 2019-08-16 09:16:39
   *@version: V0.0.1
   * */
  handleStatusDrawerShow = record => {
    const { dispatch } = this.props;
    if (record.locatorGroupId) {
      this.setState(
        {
          visible: true,
          currentData: record,
        },
        () => {
          dispatch({
            type: 'locatorGroup/featchAttrList',
            payload: {
              kid: record.locatorGroupId,
              tableName: 'mt_mod_locator_group_attr',
            },
          });
        }
      );
    }
  };

  /**
   *@functionName:  onCancel
   *@description: 关闭扩展字段模态框
   *@author: 唐加旭
   *@date: 2019-08-16 11:23:49
   *@version: V0.8.6
   * */
  @Bind()
  onCancel = () => {
    this.setState({
      visible: false,
      currentData: {},
    });
  };

  /**
   *@functionName: handOk
   *@description: 确认编辑属性并且关闭模态框
   *@author: 唐加旭
   *@date: 2019-08-16 18:00:40
   *@version: V0.0.1
   * */
  @Bind()
  handOk = () => {
    const {
      dispatch,
      locatorGroup: { attrList = [] },
    } = this.props;
    const { currentData } = this.state;
    dispatch({
      type: 'locatorGroup/saveAttrList',
      payload: {
        kid: currentData.locatorGroupId,
        attrs: attrList,
        tableName: 'mt_mod_locator_group_attr',
      },
    }).then(res => {
      if (res && res.success) {
        this.setState({
          visible: false,
          currentData: {},
        });
        notification.success();
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  render() {
    const {
      tabLoading,
      locatorGroup: { locatorGroupList = [], locatorGroupPagination = {} },
    } = this.props;
    const { visible, currentData } = this.state;
    const attrProps = {
      visible,
      onCancel: this.onCancel,
      handleOK: this.handOk,
      currentData,
    };
    const columns = [
      {
        title: intl.get(`${modelPrompt}.locatorGroupCode`).d('库位组编码'),
        width: 100,
        dataIndex: 'locatorGroupCode',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`locatorGroupCode`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locatorGroupCode`).d('库位组编码'),
                    }),
                  },
                ],
                initialValue: record.locatorGroupCode,
              })(<Input />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.locatorGroupName`).d('库位组描述'),
        dataIndex: 'locatorGroupName',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`locatorGroupName`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.locatorGroupName`).d('库位组描述'),
                    }),
                  },
                ],
                initialValue: record.locatorGroupName,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.locatorGroupName`).d('库位组描述')}
                  field="locatorGroupName"
                  dto="tarzan.modeling.domain.entity.MtModLocatorGroup"
                  pkValue={{ locatorGroupId: record.locatorGroupId || null }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 200,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag !== 'N',
              })(<Switch />)}
            </Form.Item>
          ) : (
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
        title: intl.get(`${modelPrompt}.field`).d('扩展字段'),
        dataIndex: 'field',
        width: 200,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleStatusDrawerShow(record);
              }}
              disabled={!record.locatorGroupId}
            >
              {intl.get(`${modelPrompt}.field`).d('扩展字段')}
            </a>
          </span>
        ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditMessage(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.org.locatorGroup.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditMessage(record, true)}>
                {intl.get('tarzan.org.locatorGroup.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('tarzan.org.locatorGroup.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <>
        <Header title={intl.get('tarzan.org.locatorGroup.title.manager').d('库位组维护')}>
          <Button icon="plus" type="primary" onClick={this.handleCreateEventRequestType}>
            {intl.get('tarzan.org.locatorGroup.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm
            onSearch={this.onSearch}
            onResetSearch={this.onResetSearch}
            onRef={this.refForm}
          />
          <EditTable
            loading={tabLoading}
            rowKey="locatorGroupId"
            dataSource={locatorGroupList}
            columns={columns}
            pagination={locatorGroupPagination || {}}
            onChange={this.refresh}
            bordered
          />
          <AttrDrawer {...attrProps} />
        </Content>
      </>
    );
  }
}
