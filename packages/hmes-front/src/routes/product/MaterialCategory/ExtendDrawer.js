/**
 * @date 2019-8-23
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

const modelPrompt = 'tarzan.product.materialCategory.model.materialCategory';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ materialCategory }) => ({
  materialCategory,
  loading: {},
}))
export default class ExtendDrawer extends PureComponent {
  // 抽屉确认关闭并保存
  @Bind
  handleOk() {
    const { dispatch, onOk, initData } = this.props;
    const { dataSource } = this.state;
    dispatch({
      type: 'materialCategory/saveAttribute',
      payload: {
        kid: initData.materialCategorySiteId,
        attrs: dataSource,
        tableName: 'mt_material_category_site_attr',
      },
    }).then(res => {
      if (res && res.success) {
        notification.success();
        this.setState({ dataSource: undefined });
      } else {
        notification.error({ message: res.message });
      }
    });
    onOk();
  }

  // 抽屉取消
  @Bind
  handleCancel() {
    const { onCancel } = this.props;
    this.setState({ dataSource: undefined });
    onCancel();
  }

  constructor(props) {
    super(props);
    this.columns = [
      {
        title: intl.get(`${modelPrompt}.attrMeaning`).d('扩展字段属性'),
        dataIndex: 'attrMeaning',
        width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.attrValue`).d('扩展字段属性值'),
        dataIndex: 'attrValue',
        editable: true,
        width: 200,
        render: val => (
          <div>
            {val}
            <span style={{ color: '#548FFC', marginLeft: '10px' }}>
              <Icon type="edit" theme="twoTone" />
            </span>
          </div>
        ),
      },
    ];

    this.state = {
      dataSource: [],
    };
  }

  handleSave = row => {
    const {
      materialCategory: { attributeList = [] },
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

  render() {
    const {
      visible,
      materialCategory: { attributeList = [] },
    } = this.props;
    const { dataSource } = this.state;
    const data = isEmpty(dataSource) ? attributeList : dataSource;
    const components = {
      body: {
        row: EditableCell.EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          tableName: 'mt_material_category_site_attr',
        }),
      };
    });
    return (
      <Modal
        destroyOnClose
        width={1080}
        title={intl.get(`${modelPrompt}.extendField`).d('扩展字段')}
        visible={visible}
        onCancel={this.handleCancel}
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
