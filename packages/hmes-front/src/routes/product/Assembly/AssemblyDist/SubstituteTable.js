import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Select, Button, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import Switch from 'components/Switch';
import EditTable from 'components/EditTable';
import intl from 'utils/intl';
import { getCurrentOrganizationId } from 'utils/utils';
import notification from 'utils/notification';
import uuid from 'uuid/v4';
import styles from './index.less';

const modelPrompt = 'tarzan.product.bom.model.bom';
/**
 * 替代组表格
 * @extends {PureComponent} - React.PureComponent
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  tenantId: getCurrentOrganizationId(),
  featchLoading: loading.effects['assemblyList/saveSubstituteGroup'],
}))
@Form.create({ fieldNameProp: null })
export default class SubstituteTable extends PureComponent {
  state = {
    enable: 'Y',
  };

  changeEnable = () => {
    const {
      assemblyList: { substituteGroupList = [] },
    } = this.props;
    // 状态为启用的数量
    const enableFlagNum = substituteGroupList.filter(item => item.enableFlag === 'Y').length;
    if (enableFlagNum) {
      this.setState({ enable: 'N' });
    } else {
      this.setState({ enable: 'Y' });
    }
  };

  /**
   * 新建替代组行
   */
  @Bind()
  async handleCreateGroup() {
    const {
      dispatch,
      assemblyList: { substituteGroupList = [] },
      bomId,
    } = this.props;
    await this.changeEnable();
    const { enable } = this.state;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        substituteGroupList: [
          {
            uuid: uuid(),
            bomSubstituteGroupId: '',
            bomComponentId: bomId,
            substitutePolicy: '',
            substituteGroup: '',
            enableFlag: enable,
            _status: 'create',
          },
          ...substituteGroupList,
        ],
      },
    });
  }

  /**
   * 编辑参考点
   */
  @Bind()
  handleEdit(record, flag, index) {
    const {
      dispatch,
      assemblyList: { substituteGroupList },
    } = this.props;
    if (flag) {
      // 开启编辑操作
      substituteGroupList[index]._status = 'update';
      substituteGroupList[index].sourceData = { ...substituteGroupList[index] };
    } else if (substituteGroupList[index]._status === 'update') {
      // 编辑状态时取消
      substituteGroupList[index] = { ...substituteGroupList[index].sourceData };
      substituteGroupList[index]._status = undefined;
    } else {
      // 新增时取消
      substituteGroupList.splice(index, 1);
    }
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        substituteGroupList,
      },
    });
  }

  onSelectRow = record => {
    const { dispatch, pipeline } = this.props;
    if (record.bomSubstituteGroupId) {
      dispatch({
        type: 'assemblyList/fetchSubstituteItemList',
        payload: {
          bomSubstituteGroupId: record.bomSubstituteGroupId,
        },
      });
      // 主键传到父方法中去
      pipeline(record.bomSubstituteGroupId);
    } else {
      // 清空替代项
      dispatch({
        type: 'assemblyList/updateState',
        payload: {
          substituteItemList: [],
        },
      });
      pipeline('');
    }
  };

  // 保存替代组
  @Bind
  handleSaveGroup(record, index) {
    const {
      dispatch,
      // bomId,
      assemblyList: { substituteGroupList },
    } = this.props;
    // debugger
    record.$form.validateFields(err => {
      if (!err) {
        // 已保存的状态为启用的数量
        const savedEnableFlagNum = substituteGroupList.filter(
          item => item.enableFlag === 'Y' && item._status !== 'create' && item._status !== 'update'
        ).length;
        if (savedEnableFlagNum && substituteGroupList[index].enableFlag === 'Y') {
          notification.error({ message: '替代组内只能有一条数据状态为启用！' });
          return;
        }
        dispatch({
          type: 'assemblyList/saveSubstituteGroup',
          payload: { ...record },
        }).then(res => {
          if (res && res.success) {
            notification.success();
            // 保存成功然后去更新页面
            substituteGroupList[index]._status = '';
            substituteGroupList[index].bomSubstituteGroupId = res.rows;
            // 状态为启用的数量
            const enableFlagNum = substituteGroupList.filter(item => item.enableFlag === 'Y')
              .length;
            if (enableFlagNum === 1) {
              this.setState({ enable: 'N' });
            }
            // else if (enableFlagNum > 1) {
            // substituteGroupList.map(item =>
            //   item.enableFlag === 'Y' &&
            //   item.bomSubstituteGroupId !== substituteGroupList[index].bomSubstituteGroupId
            //     ? { ...item, enableFlag: 'N' }
            //     : { ...item }
            // );
            // }
            else {
              this.setState({ enable: 'Y' });
            }
            dispatch({
              type: 'assemblyList/updateState',
              payload: {
                substituteGroupList,
              },
            });
          } else {
            notification.error({ message: res.message });
          }
        });
      }
    });
  }

  @Bind()
  onChangeSubstituteGroup(value, record, index) {
    const {
      assemblyList: { substituteGroupList = [] },
      dispatch,
    } = this.props;
    substituteGroupList[index].substituteGroup = value.target.value;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        substituteGroupList,
      },
    });
  }

  @Bind()
  onAssembleAsReqFlagChange(_, record, index) {
    // 改变开关的状态
    const {
      assemblyList: { substituteGroupList = [] },
      dispatch,
    } = this.props;
    if (substituteGroupList[index].enableFlag === 'Y') {
      substituteGroupList[index].enableFlag = 'N';
    } else {
      substituteGroupList[index].enableFlag = 'Y';
    }
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        substituteGroupList,
      },
    });
  }

  @Bind()
  onChangePolicy(value, record, index) {
    const {
      assemblyList: { substituteGroupList = [], bomSubstitutePolicy = [] },
      dispatch,
    } = this.props;
    substituteGroupList[index].substitutePolicy = value;
    bomSubstitutePolicy.forEach(item => {
      if (item.typeCode === value) {
        substituteGroupList[index].substitutePolicyDesc = item.description;
      }
    });
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        substituteGroupList,
      },
    });
  }

  render() {
    const {
      canEdit,
      assemblyList: { substituteGroupList = [], bomSubstitutePolicy = [] },
      featchLoading,
    } = this.props;
    // console.info('substituteGroupList------------', substituteGroupList);
    const substituteGroupColumns = [
      {
        title: (
          <Button
            className={canEdit ? styles.activeCreate : ''}
            icon="plus"
            shape="circle"
            size="small"
            disabled={!canEdit}
            onClick={this.handleCreateGroup}
          />
        ),
        align: 'center',
        width: 60,
        render: () => <Button disabled icon="minus" shape="circle" size="small" />,
      },
      {
        title: intl.get(`${modelPrompt}.substituteGroup`).d('替代组编码'),
        dataIndex: 'substituteGroup',
        width: 200,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`substituteGroup`, {
                rules: [
                  {
                    required: true,
                    message: intl.get(`${modelPrompt}.substituteGroup`).d('替代组编码'),
                  },
                ],
                initialValue: record.substituteGroup,
              })(<Input onChange={value => this.onChangeSubstituteGroup(value, record, index)} />)}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.substitutePolicy`).d('替代策略'),
        dataIndex: 'substitutePolicyDesc',
        width: 150,
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`substitutePolicy`, {
                rules: [
                  {
                    required: true,
                    message: intl.get(`${modelPrompt}.substitutePolicy`).d('替代策略'),
                  },
                ],
                initialValue: record.substitutePolicy,
              })(
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  onChange={value => this.onChangePolicy(value, record, index)}
                >
                  {bomSubstitutePolicy.map(item => (
                    <Select.Option key={item.typeCode} value={item.typeCode}>
                      {item.description}
                    </Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          ) : (
            val
          ),
      },
      {
        title: intl.get(`${modelPrompt}.openStatus`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record, index) =>
          ['create', 'update'].includes(record._status) ? (
            <Form.Item>
              {record.$form.getFieldDecorator(`enableFlag`, {
                initialValue: record.enableFlag === 'Y',
              })(
                <Switch
                  checked={record.enableFlag === 'Y'}
                  disabled={this.state.enable === 'N' && record.enableFlag !== 'Y'}
                  onChange={value => this.onAssembleAsReqFlagChange(value, record, index)}
                />
              )}
            </Form.Item>
          ) : (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                record.enableFlag === 'Y'
                  ? intl.get(`${modelPrompt}.yes`).d('启用')
                  : intl.get(`${modelPrompt}.no`).d('禁用')
              }
            />
          ),
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        dataIndex: 'operator',
        width: 150,
        align: 'center',
        render: (val, record, index) =>
          canEdit ? (
            <span className="action-link">
              {record._status === 'update' && (
                <Fragment>
                  <a onClick={() => this.handleEdit(record, false, index)}>
                    {intl.get('hzero.common.button.cancel').d('取消')}
                  </a>
                  <a onClick={() => this.handleSaveGroup(record, index)}>
                    {intl.get('hzero.common.button.save').d('保存')}
                  </a>
                </Fragment>
              )}
              {!(record._status === 'create') && !(record._status === 'update') && (
                <a onClick={() => this.handleEdit(record, true, index)}>
                  {intl.get('hzero.common.button.edit').d('编辑')}
                </a>
              )}

              {record._status === 'create' && (
                <Fragment>
                  <a onClick={() => this.handleEdit(record, false, index)}>
                    {intl.get('hzero.common.button.cancel').d('取消')}
                  </a>
                  <a onClick={() => this.handleSaveGroup(record, index)}>
                    {intl.get('hzero.common.button.save').d('保存')}
                  </a>
                </Fragment>
              )}
            </span>
          ) : (
            ''
          ),
      },
    ];
    const substituteGroupRowSelection = {
      type: 'radio',
      columnTitle: 'test',
      columnWidth: 0,
      onSelect: this.onSelectRow,
    };
    return (
      <EditTable
        loading={featchLoading}
        bordered
        rowSelection={substituteGroupRowSelection}
        rowKey="uuid"
        columns={substituteGroupColumns}
        dataSource={substituteGroupList}
      />
    );
  }
}
