/**
 * @description: 库位组维护入口页面
 * @author: 唐加旭
 * @date: 2019-08-15 14:03:18
 * @version: V0.0.1
 * */
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Select } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { addItemToPagination, delItemToPagination, getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import TLEditor from '@/components/TLEditor';
import EditTable from 'components/EditTable';
import Lov from 'components/Lov';
import FilterForm from './filterForm';
import AttrDrawer from './attrDrawer';

const modelPrompt = 'tarzan.process.childSteps.model.childSteps';
const { Option } = Select;

@connect(({ childSteps, loading }) => ({
  childSteps,
  tabLoading: loading.effects['childSteps/fetchChilStepsList'],
  saveLoading: loading.effects['childSteps/savLocatorGroupList'],
}))
@formatterCollections({
  code: 'tarzan.process.childSteps',
})
export default class LocatorGroup extends React.Component {
  state = {
    search: {},
    visible: false,
    currentData: {},
    typeOptions: [],
  };

  componentDidMount() {
    this.refresh();
    // this.fetchSiteOption();
    this.getSelectOption('SUBSTEP_TYPE', 'typeOptions');
  }
  /*

  @Bind()
  fetchSiteOption = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'childSteps/fetchSiteOption',
      payload: {
        siteType: 'MANUFACTURING',
      },
    }).then(res => {
      if (res && res.rows) {
        this.setState({
          siteOptions: res.rows,
        });
      }
    });
  };
*/

  /**
   *@functionName:   getSelectOption
   *@params1 {String} type 下拉分类
   *@params2 {String} option 保存请求值得state
   *@description 请求下拉数据
   *@author: 唐加旭
   *@date: 2019-09-06 10:18:15
   *@version: V0.8.6
   * */
  @Bind()
  getSelectOption = (type, option) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'childSteps/fetchSelectOption',
      payload: {
        module: 'ROUTER',
        typeGroup: type,
      },
    }).then(res => {
      if (res && res.rows) {
        this.setState({
          [option]: res.rows,
        });
      }
    });
  };

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'childSteps/fetchChilStepsList',
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

  /**
   *@functionName:   onSearch
   * @params {Object} fieldsValue 搜索条件
   *@description: 缓存搜索条件并进行查询
   *@author: 唐加旭
   *@date: 2019-08-15 14:37:31
   *@version: V0.0.1
   * */
  @Bind()
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

  /**
   *@functionName:   onResetSearch
   *@description: 清除搜索条件缓存
   *@author: 唐加旭
   *@date: 2019-08-15 14:39:09
   *@version: V0.8.6
   * */
  @Bind()
  onResetSearch = () => {
    this.setState({
      search: {},
    });
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
      childSteps: { childStepsList = [], childStepsPagination = {} },
    } = this.props;
    if (
      childStepsList.length === 0 ||
      (childStepsList.length > 0 && childStepsList[0]._status !== 'create')
    ) {
      dispatch({
        type: 'childSteps/updateState',
        payload: {
          childStepsList: [
            {
              substepId: null,
              _status: 'create',
            },
            ...childStepsList,
          ],
          childStepsPagination: addItemToPagination(childStepsList.length, childStepsPagination),
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
      childSteps: { childStepsList = [] },
      dispatch,
    } = this.props;
    const newList = childStepsList.map(item => {
      if (record.substepId === item.substepId) {
        return { ...item, _status: bool ? 'update' : '', changeSiteName: undefined };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'childSteps/updateState',
      payload: {
        childStepsList: newList,
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
      childSteps: { childStepsList = [], childStepsPagination = {} },
    } = this.props;
    const newList = childStepsList.filter(item => item.substepId !== record.substepId);
    dispatch({
      type: 'childSteps/updateState',
      payload: {
        childStepsList: newList,
        childStepsPagination: delItemToPagination(
          childStepsPagination.pageSize,
          childStepsPagination
        ),
      },
    });
  };

  // lov回填
  @Bind
  updateState = (value, record, index) => {
    const {
      dispatch,
      childSteps: { childStepsList = [] },
    } = this.props;
    childStepsList[index].siteCode = record.siteCode;
    dispatch({
      type: 'childSteps/updateState',
      payload: {
        childStepsList,
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
      childSteps: { childStepsList = [] },
    } = this.props;
    record.$form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'childSteps/saveChildStepsList',
          payload: {
            ...values,
            substepId: record.substepId,
          },
        }).then(res => {
          if (res && res.success) {
            childStepsList[index].siteName =
              childStepsList[index].changeSiteName || childStepsList[index].siteName;
            childStepsList[index].substepId = res.rows;
            childStepsList[index]._status = '';
            childStepsList[index].substepName = values.substepName;
            childStepsList[index].description = values.description;
            childStepsList[index].substepType = values.substepType;
            childStepsList[index].longDescription = values.longDescription;

            /* childStepsList[index] = {
              _status: '',
              substepId: res.rows,
              ...values,
              // TODO
            }; */

            dispatch({
              type: 'childSteps/updateState',
              payload: {
                childStepsList,
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
   *@params {Object} record 当前修改扩展字段的子步骤
   *@description 开启扩展字段编辑模态框，并记录下当前子步骤
   *@author: 唐加旭
   *@date: 2019-08-16 09:16:39
   *@version: V0.0.1
   * */
  handleStatusDrawerShow = record => {
    const { dispatch } = this.props;
    if (record.substepId) {
      this.setState(
        {
          visible: true,
          currentData: record,
        },
        () => {
          dispatch({
            type: 'childSteps/featchAttrList',
            payload: {
              kid: record.substepId,
              tableName: 'mt_substep_attr',
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
      childSteps: { attrList = [] },
    } = this.props;
    const { currentData } = this.state;
    dispatch({
      type: 'childSteps/saveAttrList',
      payload: {
        kid: currentData.substepId,
        attrs: attrList,
        tableName: 'mt_substep_attr',
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

  /**
   *@functionName:   deleteData
   *@params1 {Object} record 当前删除行数据详情
   *@params2 {Number} index 当前删除行数据下标
   *@description 删除数据
   *@author: 唐加旭
   *@date: 2019-09-06 10:06:43
   *@version: V0.0.1
   * */
  // @Bind()
  // deleteData = (record, index) => {
  //   const {
  //     dispatch,
  //     childSteps: { childStepsList = [], childStepsPagination = {} },
  //   } = this.props;
  //   if (record.substepId) {
  //     dispatch({
  //       type: 'childSteps/deleteChildStepsList',
  //       payload: record.substepId,
  //     }).then(res => {
  //       if (res && res.success) {
  //         notification.success({
  //           message: '删除成功',
  //         });
  //         this.refresh();
  //       } else if (res) {
  //         notification.error({
  //           message: res.message,
  //         });
  //       }
  //     });
  //   } else {
  //     childStepsList.splice(index, 1);
  //     dispatch({
  //       type: 'childSteps/updateState',
  //       payload: {
  //         childStepsList,
  //         childStepsPagination: delItemToPagination(1, childStepsPagination),
  //       },
  //     });
  //   }
  // };

  render() {
    const {
      tabLoading,
      childSteps: { childStepsList = [], childStepsPagination = {} },
    } = this.props;
    const { visible, currentData, typeOptions } = this.state;
    const attrProps = {
      visible,
      onCancel: this.onCancel,
      handleOK: this.handOk,
      currentData,
    };
    const tenantId = getCurrentOrganizationId();
    const columns = [
      // {
      //   title: (
      //     <Button
      //       style={{ backgroundColor: '#548FFC', color: '#fff' }}
      //       icon="plus"
      //       shape="circle"
      //       size="small"
      //       onClick={this.handleCreateEventRequestType}
      //     />
      //   ),
      //   align: 'center',
      //   width: 60,
      //   render: (val, record, index) => (
      //     <Popconfirm
      //       title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
      //       onConfirm={this.deleteData.bind(this, record, index)}
      //     >
      //       <Button icon="minus" shape="circle" size="small" />
      //     </Popconfirm>
      //   ),
      // },
      {
        title: intl.get(`${modelPrompt}.substepName`).d('子步骤编码'),
        width: 150,
        dataIndex: 'substepName',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`substepName`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.substepName`).d('子步骤编码'),
                    }),
                  },
                ],
                initialValue: val,
              })(<Input inputChinese={false} typeCase="upper" trim />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('子步骤描述'),
        dataIndex: 'description',
        width: 200,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`description`, {
                initialValue: val,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.description`).d('子步骤描述')}
                  field="description"
                  dto="tarzan.method.domain.entity.MtSubstep"
                  pkValue={{ substepId: record.substepId || null }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('所属站点'),
        dataIndex: 'siteCode',
        width: 120,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`siteId`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteCode`).d('所属站点'),
                    }),
                  },
                ],
                initialValue: record.siteId,
              })(
                <Lov
                  code="MT.SITE"
                  textValue={val}
                  queryParams={{ tenantId, siteType: 'MANUFACTURING' }}
                  onChange={(vals, records) => this.updateState(vals, records, index)}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.substepType`).d('子步骤类型'),
        dataIndex: 'substepType',
        width: 120,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`substepType`, {
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.siteName`).d('子步骤类型'),
                    }),
                  },
                ],
                initialValue: val,
              })(
                <Select style={{ width: '100%' }}>
                  {typeOptions.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            (typeOptions.filter(ele => ele.typeCode === val)[0] || {}).description
          ),
      },

      {
        title: intl.get(`${modelPrompt}.longDescription`).d('备注'),
        dataIndex: 'longDescription',
        width: 250,
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`longDescription`, {
                initialValue: val,
              })(
                <TLEditor
                  label={intl.get(`${modelPrompt}.longDescription`).d('备注')}
                  field="longDescription"
                  dto="tarzan.method.domain.entity.MtSubstep"
                  pkValue={{ substepId: record.substepId || null }}
                />
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.field`).d('扩展字段'),
        dataIndex: 'field',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleStatusDrawerShow(record);
              }}
              disabled={!record.substepId}
            >
              {intl.get(`${modelPrompt}.field`).d('扩展字段')}
            </a>
          </span>
        ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 120,
        // fixed: 'right',
        align: 'center',
        render: (val, record, index) => (
          <span className="action-link">
            {record._status === 'update' && (
              <Fragment>
                <a onClick={() => this.handleEditMessage(record, false)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
            {!(record._status === 'create') && !(record._status === 'update') && (
              <a onClick={() => this.handleEditMessage(record, true)}>
                {intl.get('hzero.common.button.edit').d('编辑')}
              </a>
            )}

            {record._status === 'create' && (
              <Fragment>
                <a onClick={() => this.handleCleanLine(record)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
                <a onClick={() => this.handleSave(record, index)}>
                  {intl.get('hzero.common.button.save').d('保存')}
                </a>
              </Fragment>
            )}
          </span>
        ),
      },
    ];
    return (
      <>
        <Header title={intl.get('tarzan.process.childSteps.title.list').d('子步骤维护')}>
          <Button icon="plus" type="primary" onClick={this.handleCreateEventRequestType}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm
            onSearch={this.onSearch}
            // siteOptions={siteOptions}
            onResetSearch={this.onResetSearch}
          />
          <EditTable
            loading={tabLoading}
            rowKey="substepId"
            dataSource={childStepsList}
            columns={columns}
            // scroll={{ x: tableScrollWidth(columns) }}
            pagination={childStepsPagination || {}}
            onChange={this.refresh}
            bordered
          />
          <AttrDrawer {...attrProps} />
        </Content>
      </>
    );
  }
}
