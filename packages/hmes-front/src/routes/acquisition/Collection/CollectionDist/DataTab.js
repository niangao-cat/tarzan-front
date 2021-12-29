/**
 *@description 调度工艺模态框
 *@author: 唐加旭
 *@date: 2019-08-19 09:53:03
 *@version: V0.0.1
 *@reactProps {Boolean} visible - 模态框是否可见
 *@reactProps {Function} onCancel - 关闭模态框
 *@return <DispatchDrawer />
 * */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Button,
  InputNumber,
  Popconfirm,
  Badge,
  Switch,
  Select,
  Icon,
  Input,
} from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import EditTable from 'components/EditTable';
import {
  addItemToPagination,
  delItemToPagination,
  tableScrollWidth,
  getCurrentOrganizationId,
} from 'utils/utils';
import Lov from 'components/Lov';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import notification from 'utils/notification';
import styles from './index.less';
// import ExtendModal from './ExtendModal';

const modelPrompt = 'tarzan.process.collection.model.collection';
const { Option } = Select;

@connect(({ collection, loading }) => ({
  collection,
  loading: loading.effects['collection/fetchTagGroupList'],
}))
@Form.create()
@formatterCollections({ code: 'tarzan.process.collection' })
export default class DataTab extends PureComponent {
  /**
   *@functionName:   refresh
   *@params {object} pagination 分页查询
   *@description:
   *@author: 唐加旭
   *@date: 2019-08-20 14:32:40
   *@version: V0.0.1
   * */
  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch, tagGroupId, onSaveTabPage } = this.props;

    // 暂存分页参数
    onSaveTabPage(pagination);

    dispatch({
      type: 'collection/fetchTagGroupList',
      payload: {
        page: pagination,
        tagGroupId,
      },
    });
  };

  /**
   * 新建行
   */
  @Bind()
  handleCreate() {
    const {
      dispatch,
      collection: { tagGroupList = [], tagGroupPagination = {} },
    } = this.props;
    dispatch({
      type: 'collection/updateState',
      payload: {
        tagGroupList: [
          {
            tagGroupAssignId: '',
            _status: 'create',
          },
          ...tagGroupList,
        ],
        tagGroupPagination: addItemToPagination(tagGroupList.length, tagGroupPagination),
      },
    });
  }

  /**
   *@functionName:   deleteData
   *@params1 {Object} record 当前数据
   *@params2 {Number} index 当前数据下标
   *@description 删除数据并本地做好缓存
   *@author: 唐加旭
   *@date: 2019-08-20 19:56:57
   *@version: V0.0.1
   * */
  @Bind()
  deleteData = (record, index) => {
    const {
      dispatch,
      collection: { tagGroupList = [], tagGroupPagination = {} },
    } = this.props;
    if (record.tagGroupAssignId !== '') {
      dispatch({
        // type: 'collection/deleteChildStepsList',
        type: 'collection/removeTagGroupList',
        payload: parseFloat(record.tagGroupAssignId),
      }).then(res => {
        if (res && res.success) {
          this.refresh();
        } else if (res) {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      tagGroupList.splice(index, 1);
      dispatch({
        type: 'collection/updateState',
        payload: {
          tagGroupList,
          tagGroupPagination: delItemToPagination(1, tagGroupPagination),
        },
      });
    }
  };

  @Bind()
  changeCode = (val, record, index) => {
    const {
      collection: { tagGroupList = [] },
      dispatch,
    } = this.props;
    tagGroupList[index].$form.setFieldsValue({
      enableFlag: record.enableFlag,
      valueType: record.valueType,
      collectionMethod: record.collectionMethod,
      valueAllowMissing: record.valueAllowMissing,
      trueValue: !['ATTACHMENTS', 'TEXT', 'VALUE'].includes(record.valueType)
        ? record.trueValue
        : '',
      falseValue: !['ATTACHMENTS', 'TEXT', 'VALUE'].includes(record.valueType)
        ? record.falseValue
        : '',
      minimumValue: !['ATTACHMENTS', 'TEXT', 'DECISION_VALUE'].includes(record.valueType)
        ? record.minimumValue
        : '',
      maximalValue: !['ATTACHMENTS', 'TEXT', 'DECISION_VALUE'].includes(record.valueType)
        ? record.maximalValue
        : '',
      unit: !['ATTACHMENTS', 'TEXT', 'DECISION_VALUE'].includes(record.valueType)
        ? record.unit
        : '',
      uomCode: !['ATTACHMENTS', 'TEXT', 'DECISION_VALUE'].includes(record.valueType)
        ? record.uomCode
        : '',
      mandatoryNum: record.mandatoryNum,
      optionalNum: record.optionalNum,
      tagDescription: record.tagDescription,
    });
    dispatch({
      type: 'collection/updateState',
      payload: {
        tagGroupList,
      },
    });
  };

  @Bind
  editData = index => {
    const {
      collection: { tagGroupList = [] },
      dispatch,
    } = this.props;
    tagGroupList[index]._status = 'update';
    dispatch({
      type: 'collection/updateState',
      payload: {
        tagGroupList,
      },
    });
  };

  @Bind()
  cleanData = () => {
    const {
      collection: { tagGroupList = [] },
      dispatch,
    } = this.props;
    tagGroupList.shift();
    dispatch({
      type: 'collection/updateState',
      payload: {
        tagGroupList,
      },
    });
  };

  @Bind()
  cancelData = index => {
    const {
      collection: { tagGroupList = [] },
      dispatch,
    } = this.props;
    tagGroupList[index]._status = '';
    dispatch({
      type: 'collection/updateState',
      payload: {
        tagGroupList,
      },
    });
  };

  /**
   *@functionName:   synchronous
   *@params {Object} record 需要同步的数据
   *@params {Number} index 同步的数据的下标
   *@description 同步数据
   *@author: 唐加旭
   *@date: 2019-09-27 17:31:40
   *@version: V0.8.6
   * */
  @Bind
  synchronous = (record, index) => {
    const {
      dispatch,
      collection: { tagGroupList = [] },
    } = this.props;
    const ind = tagGroupList[index];
    dispatch({
      type: 'collection/synchronous',
      payload: {
        tagId: record.tagId,
      },
    }).then(res => {
      if (res && res.success) {
        tagGroupList[index] = {
          ...ind,
          ...res.rows,
        };
        tagGroupList[index]._status = 'sync';
        // tagGroupList[index].serialNumber = ind;
        dispatch({
          type: 'collection/updateState',
          payload: {
            tagGroupList,
          },
        });
      } else if (res) {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  handleFilterSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleFilterReset = clearFilters => {
    clearFilters();
  };

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

  render() {
    const {
      loading,
      canEdit,
      collection: {
        tagGroupList = [],
        tagGroupPagination = {},
        valueTypeList = [],
        collectionMthodList = [],
      },
    } = this.props;
    const tenantId = getCurrentOrganizationId();
    const columns = [
      {
        title: (
          <Button
            style={{ backgroundColor: '#548FFC', color: '#fff' }}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit}
            onClick={this.handleCreate}
          />
        ),
        align: 'center',
        width: 60,
        render: (val, record, index) =>
          !canEdit ? (
            <Button icon="minus" shape="circle" size="small" />
          ) : (
            <Popconfirm
              title={intl.get(`hzero.common.message.confirm.delete`).d('是否确认删除?')}
              onConfirm={this.deleteData.bind(this, record, index)}
            >
              <Button icon="minus" shape="circle" size="small" />
            </Popconfirm>
            ),
      },
      {
        title: intl.get(`${modelPrompt}.serialNumber`).d('序号'),
        dataIndex: 'serialNumber',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`serialNumber`, {
                initialValue: val,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.tagCode`).d('序号'),
                    }),
                  },
                ],
              })(<InputNumber min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.tagCode`).d('数据项编码'),
        dataIndex: 'tagCode',
        width: 150,
        align: 'left',
        ...this.getColumnSearchProps('tagCode'),
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`tagId`, {
                initialValue: record.tagId,
                rules: [
                  {
                    required: true,
                    message: intl.get('hzero.common.validation.notNull', {
                      name: intl.get(`${modelPrompt}.tagCode`).d('数据项编码'),
                    }),
                  },
                ],
              })(
                <Lov
                  code="MT.TAG"
                  disabled={!canEdit}
                  textValue={val}
                  onChange={(value, records) => this.changeCode(value, records, index)}
                  queryParams={{ tenantId }}
                />
              )}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.tagDescription`).d('数据项描述'),
        dataIndex: 'tagDescription',
        width: 300,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`tagDescription`, {
                  initialValue: val,
                })(<Input />)}
              </Form.Item>
              <>{record.$form.getFieldValue('tagDescription')}</>
            </>
          ) : (
              val
            ),
        ...this.getColumnSearchProps('tagDescription'),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`enableFlag`, {
                  initialValue: val,
                })(<Input />)}
              </Form.Item>
              {record.$form.getFieldValue('enableFlag') && (
                <Badge
                  status={record.$form.getFieldValue('enableFlag') === 'Y' ? 'success' : 'error'}
                  text={
                    record.$form.getFieldValue('enableFlag') === 'Y'
                      ? intl.get(`${modelPrompt}.enable`).d('启用')
                      : intl.get(`${modelPrompt}.unable`).d('禁用')
                  }
                />
              )}
            </>
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
        title: intl.get(`${modelPrompt}.valueType`).d('数据类型'),
        dataIndex: 'valueType',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <>
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`valueType`, {
                  initialValue: val,
                })(<Input />)}
              </Form.Item>
              {record.$form.getFieldValue('valueType') &&
                (
                  valueTypeList.filter(
                    ele => ele.typeCode === record.$form.getFieldValue('valueType')
                  )[0] || {}
                ).description}
            </>
          ) : (
              (valueTypeList.filter(ele => ele.typeCode === val)[0] || {}).description
            ),
      },
      {
        title: intl.get(`${modelPrompt}.collectionMethod`).d('数据收集方式'),
        dataIndex: 'collectionMethod',
        width: 150,
        align: 'left',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`collectionMethod`, {
                initialValue: val,
              })(
                <Select allowClear style={{ width: '100%' }}>
                  {collectionMthodList.map(ele => (
                    <Option value={ele.typeCode}>{ele.description}</Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
              (collectionMthodList.filter(ele => ele.typeCode === record.collectionMethod)[0] || {})
                .description
            ),
      },
      {
        title: intl.get(`${modelPrompt}.valueAllowMissing`).d('允许缺失值'),
        dataIndex: 'valueAllowMissing',
        width: 100,
        align: 'center',
        render: (val, record) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`valueAllowMissing`, {
                initialValue: record.valueAllowMissing === 'Y',
              })(<Switch />)}
            </Form.Item>
          ) : (
            <Badge
              status={record.valueAllowMissing === 'Y' ? 'success' : 'error'}
              text={
                record.valueAllowMissing === 'Y'
                  ? intl.get(`${modelPrompt}.enable`).d('启用')
                  : intl.get(`${modelPrompt}.unable`).d('禁用')
              }
            />
            ),
      },
      {
        title: intl.get(`${modelPrompt}.trueValue`).d('符合值'),
        dataIndex: 'trueValue',
        width: 80,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            ['ATTACHMENTS', 'TEXT', 'VALUE'].includes(record.$form.getFieldValue('valueType')) ? (
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`trueValue`, {
                  initialValue: val,
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator(`trueValue`, {
                  initialValue: val,
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
              )
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.falseValue`).d('不符合值'),
        dataIndex: 'falseValue',
        width: 90,
        align: 'center',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            ['ATTACHMENTS', 'TEXT', 'VALUE'].includes(record.$form.getFieldValue('valueType')) ? (
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`falseValue`, {
                  initialValue: val,
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
            ) : (
              <Form.Item>
                {record.$form.getFieldDecorator(`falseValue`, {
                  initialValue: val,
                })(<Input style={{ width: '100%' }} />)}
              </Form.Item>
              )
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.minimumValue`).d('最小值'),
        dataIndex: 'minimumValue',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            ['ATTACHMENTS', 'TEXT', 'DECISION_VALUE'].includes(
              record.$form.getFieldValue('valueType')
            ) ? (
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`minimumValue`, {
                  initialValue: val,
                })(<InputNumber style={{ width: '100%' }} />)}
              </Form.Item>
              ) : (
                <Form.Item>
                  {record.$form.getFieldDecorator(`minimumValue`, {
                    initialValue: val,
                  })(<InputNumber style={{ width: '100%' }} />)}
                </Form.Item>
              )
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.maximalValue`).d('最大值'),
        dataIndex: 'maximalValue',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            ['ATTACHMENTS', 'TEXT', 'DECISION_VALUE'].includes(
              record.$form.getFieldValue('valueType')
            ) ? (
              <Form.Item style={{ display: 'none' }}>
                {record.$form.getFieldDecorator(`maximalValue`, {
                  initialValue: val,
                })(<Input />)}
              </Form.Item>
              ) : (
                <Form.Item>
                  {record.$form.getFieldDecorator(`maximalValue`, {
                    initialValue: val,
                    rules: [
                      {
                        validator: (rule, value, callback) => {
                          if (record.$form.getFieldValue('minimumValue') > value) {
                            callback(
                              intl.get(`${modelPrompt}.maxShouldBigerThanMin`).d('最大值应大于最小值')
                            );
                          } else {
                            callback();
                          }
                        },
                      },
                    ],
                  })(<InputNumber style={{ width: '100%' }} />)}
                </Form.Item>
              )
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.uomCode`).d('计量单位'),
        dataIndex: 'unit',
        width: 100,
        align: 'left',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            ['ATTACHMENTS', 'TEXT', 'DECISION_VALUE'].includes(
              record.$form.getFieldValue('valueType')
            ) ? (
              <>
                <Form.Item style={{ display: 'none' }}>
                  {record.$form.getFieldDecorator(`uomCode`, {
                    initialValue: val,
                  })(<Input />)}
                </Form.Item>
                <Form.Item style={{ display: 'none' }}>
                  {record.$form.getFieldDecorator(`unit`, {
                    initialValue: val,
                  })(<Input />)}
                </Form.Item>
              </>
              ) : (
                <>
                  <Form.Item style={{ display: 'none' }}>
                    {record.$form.getFieldDecorator(`uomCode`, {
                      initialValue: record.uomCode,
                    })(<Input />)}
                  </Form.Item>
                  <Form.Item>
                    {record.$form.getFieldDecorator(`unit`, {
                      initialValue: record.unit,
                    })(
                      <Lov
                        code="MT.UOM"
                        textValue={record.$form.getFieldValue('uomCode')}
                        queryParams={{ tenantId }}
                      />
                    )}
                  </Form.Item>
                </>
              )
          ) : (
              record.uomCode
            ),
      },
      {
        title: intl.get(`${modelPrompt}.mandatoryNum`).d('必须的数据条数'),
        dataIndex: 'mandatoryNum',
        width: 120,
        align: 'left',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`mandatoryNum`, {
                initialValue: val,
              })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get(`${modelPrompt}.optionalNum`).d('可选的数据条数'),
        dataIndex: 'optionalNum',
        width: 120,
        align: 'left',
        render: (val, record) =>
          ['update', 'create'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`optionalNum`, {
                initialValue: val,
              })(<InputNumber precision={0} min={0} style={{ width: '100%' }} />)}
            </Form.Item>
          ) : (
              val
            ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        align: 'center',
        fixed: 'right',
        width: 130,
        render: (val, record, index) => {
          return (
            <span className="action-link">
              <a
                onClick={this.synchronous.bind(this, record, index)}
                disabled={!canEdit || record._status === 'create'}
              >
                同步数据
              </a>
              {['create'].includes(record._status) ? (
                <a onClick={this.cleanData}>{intl.get('hzero.common.button.cancel').d('取消')}</a>
              ) : ['update'].includes(record._status) ? (
                <a onClick={this.cancelData.bind(this, index)}>
                  {intl.get('hzero.common.button.cancel').d('取消')}
                </a>
              ) : (
                <a
                  disabled={!canEdit || record._status === 'create'}
                  onClick={this.editData.bind(this, index)}
                >
                      编辑
                </a>
                  )}
            </span>
          );
        },
      },
    ];
    return (
      <div style={{ width: '100%' }}>
        <EditTable
          bordered
          loading={loading}
          rowKey="tagGroupAssignId"
          columns={columns}
          scroll={{ x: tableScrollWidth(columns) }}
          dataSource={tagGroupList}
          pagination={tagGroupPagination}
          onChange={this.refresh}
        />
      </div>
    );
  }
}
