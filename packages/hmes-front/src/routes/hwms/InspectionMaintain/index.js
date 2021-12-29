/**
 * 货柜检查表维护
 *@date：2019/11/29
 *@author：jxy <xiaoyan.jin@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Button, Modal } from 'hzero-ui';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import uuidv4 from 'uuid/v4';
import { isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
import notification from 'utils/notification';
import { getCurrentOrganizationId, getEditTableData, filterNullValueObject } from 'utils/utils';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';

import ListTable from './ListTable';
import FilterForm from './FilterForm';

@connect(({ inspectionMaintain, loading }) => ({
  inspectionMaintain,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading: loading.effects['inspectionMaintain/queryList'],
    saveLoading: loading.effects['inspectionMaintain/saveData'],
    deleteLoading: loading.effects['inspectionMaintain/deleteData'],
  },
}))
@formatterCollections({
  code: ['hwms.inspectionMaintain'],
})
class InspectionMaintain extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRows: [], // 保存当前选中的行
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  /**
   *  查询列表
   * @param {object} page 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch, tenantId } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'inspectionMaintain/queryList',
      payload: {
        tenantId,
        ...filterValues,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 删除
   */
  @Bind()
  handleDelete(selectItem = {}) {
    const { tenantId, dispatch, inspectionMaintain } = this.props;
    const { pagination } = inspectionMaintain;
    const { selectedRows } = this.state;
    Modal.confirm({
      iconType: '',
      content: intl
        .get('hwms.inspectionMaintain.view.message.deleteLines')
        .d('是否删除选中的数据？'),
      onOk: () => {
        dispatch({
          type: 'inspectionMaintain/deleteData',
          payload: {
            tenantId,
            dtoList: isEmpty(selectItem) ? selectedRows : [selectItem],
          },
        }).then(res => {
          if (res.success) {
            notification.success();
            this.handleSearch(pagination);
            this.setState({
              selectedRowKeys: [],
              selectedRows: [],
            });
          }
        });
      },
    });
  }

  /**
   * 新增行
   */
  @Bind()
  handleAdd() {
    const {
      dispatch,
      tenantId,
      inspectionMaintain: { dataList = [] },
    } = this.props;
    const newItem = {
      tenantId,
      inspectionId: uuidv4(), // 行主键
      inspectionItem: '',
      inspectionStandard: '',
      inspectionMethod: '',
      _status: 'create',
    };
    dispatch({
      type: 'inspectionMaintain/updateState',
      payload: {
        dataList: [newItem, ...dataList],
      },
    });
  }

  /**
   * 保存
   */
  @Bind()
  handleSave() {
    const {
      dispatch,
      tenantId,
      inspectionMaintain: { dataList = [] },
    } = this.props;
    // 处理表单效验，获取处理后的表单数据
    const params = getEditTableData(dataList, ['inspectionId']);
    if (Array.isArray(params) && params.length > 0) {
      dispatch({
        type: 'inspectionMaintain/saveData',
        payload: {
          tenantId,
          dtoList: params,
        },
      }).then(res => {
        if (res.success) {
          notification.success();
          this.handleSearch();
        }
      });
    }
  }

  /**
   * 行 - 编辑/取消
   * @param {Object} current - 当前行对象
   * @param {Boolean} flag - 操作标记
   */
  @Bind()
  handleEditLine(current = {}, flag = false) {
    const {
      dispatch,
      inspectionMaintain: { dataList = [] },
    } = this.props;
    const newList = dataList.map(item =>
      item.inspectionId === current.inspectionId ? { ...item, _status: flag ? 'update' : '' } : item
    );
    dispatch({
      type: 'inspectionMaintain/updateState',
      payload: {
        dataList: newList,
      },
    });
  }

  /**
   *  清除 - 新增行
   * @param {Object} current - 当前行对象
   */
  @Bind()
  handleCancelLine(current = {}) {
    const {
      dispatch,
      inspectionMaintain: { dataList = [] },
    } = this.props;
    const newList = dataList.filter(item => item.inspectionId !== current.inspectionId);
    dispatch({
      type: 'inspectionMaintain/updateState',
      payload: {
        dataList: newList,
      },
    });
  }

  /**
   * 数据行选择操作
   */
  @Bind()
  handleSelectRow(selectedRowKeys, selectedRows) {
    this.setState({ selectedRowKeys, selectedRows });
  }

  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const { selectedRowKeys } = this.state;
    const {
      loading: { fetchLoading, saveLoading, deleteLoading },
      inspectionMaintain: { dataList = [], pagination },
    } = this.props;
    const filterProps = {
      onSearch: this.handleSearch,
      onRef: this.handleBindRef,
    };
    const listProps = {
      selectedRowKeys,
      pagination,
      loading: fetchLoading,
      dataSource: dataList,
      onEditLine: this.handleEditLine,
      onCancelLine: this.handleCancelLine,
      onDeleteLine: this.handleDelete,
      onSelectRow: this.handleSelectRow,
      onSearch: this.handleSearch,
    };
    return (
      <React.Fragment>
        <Header title={intl.get(`hwms.inspectionMaintain.view.message.title`).d('货柜检查表维护')}>
          <Button type="primary" icon="plus" onClick={this.handleAdd}>
            {intl.get('hzero.common.button.create').d('新建')}
          </Button>
          <Button
            icon="delete"
            loading={deleteLoading}
            disabled={isEmpty(selectedRowKeys)}
            onClick={() => this.handleDelete()}
          >
            {intl.get('hzero.common.button.delete').d('删除')}
          </Button>
          <Button icon="save" loading={saveLoading} onClick={this.handleSave}>
            {intl.get('hzero.common.button.save').d('保存')}
          </Button>
        </Header>
        <Content>
          <FilterForm {...filterProps} />
          <ListTable {...listProps} />
        </Content>
      </React.Fragment>
    );
  }
}

export default InspectionMaintain;
