/**
 * @date 2019-8-27
 * @author dong.li <dong.li04@hand-china.com>
 */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Table, Icon } from 'hzero-ui';
import { isEmpty } from 'lodash';
import { Bind } from 'lodash-decorators';
import notification from 'utils/notification';
import intl from 'utils/intl';
import EditableCell from '@/components/EditCellTable';

const modelPrompt = 'tarzan.product.bom.model.bom';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ assemblyList }) => ({
  assemblyList,
  loading: {},
}))
export default class ExtendDrawer extends PureComponent {
  // 抽屉确认关闭并保存
  @Bind
  handleOk() {
    // eslint-disable-next-line no-unused-vars
    const { dispatch, onOk, initData, bomId } = this.props;
    const { dataSource } = this.state;
    dispatch({
      type: 'assemblyList/saveExtendedField',
      payload: {
        kid: bomId,
        attrs: dataSource,
        tableName: 'mt_bom_attr',
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.setState({ dataSource: [] });
      } else {
        notification.error({ message: res.message });
      }
    });
    onOk();
  }

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: intl.get(`${modelPrompt}.expandFieldAttrMeaning`).d('扩展字段属性描述'),
        dataIndex: 'attrMeaning',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.expandFieldAttrValue`).d('扩展字段属性值'),
        dataIndex: 'attrValue',
        width: 200,
        render: val =>
          this.props.canEdit ? (
            <div>
              {val}
              <span style={{ color: '#548FFC', marginLeft: '10px' }}>
                <Icon type="edit" theme="twoTone" />
              </span>
            </div>
          ) : (
            ''
          ),
      },
    ];

    this.state = {
      dataSource: [],
    };
  }

  handleSave = row => {
    const {
      assemblyList: { attributeList = [] },
    } = this.props;
    const { dataSource } = this.state;
    const data = isEmpty(dataSource) ? attributeList : dataSource;
    const newData = [...data];
    const index = newData.findIndex(item => row.attrName === item.attrName);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  @Bind
  onCancel() {
    const { onCancel, dispatch } = this.props;
    onCancel();
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        attributeList: [],
      },
    });
  }

  render() {
    const {
      visible,
      assemblyList: { attributeList = [] },
    } = this.props;
    const { dataSource } = this.state;
    const data = isEmpty(dataSource) ? attributeList : dataSource;
    const components = {
      body: {
        row: EditableCell.EditableFormRow,
        cell: EditableCell,
      },
    };
    const { canEdit } = this.props;
    const columns = this.columns.map(col => {
      if (!canEdit) {
        return col;
      } else if (col.dataIndex === 'attrValue') {
        return {
          ...col,
          editable: canEdit,
          onCell: record => ({
            record,
            editable: canEdit,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave: this.handleSave,
            tableName: 'mt_bom_component_attr',
          }),
        };
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          tableName: 'mt_bom_attr',
        }),
      };
    });
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.product.bom.title.componentAttribute').d('组件行扩展属性')}
        visible={visible}
        onCancel={this.onCancel}
        onOk={this.handleOk}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
      >
        <Table
          components={components}
          pagination={false}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={data}
          columns={columns}
        />
      </Modal>
    );
  }
}
