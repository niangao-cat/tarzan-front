/**
 * ComponentLineTable - 组件行表格
 * @date: 2019-8-5
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.2
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { Button, Form, Table, Input, Icon } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { connect } from 'dva';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'hzero-front/lib/utils/notification';
import { tableScrollWidth } from 'utils/utils';
import styles from './index.less';
import SubstituteDrawer from './SubstituteDrawer';
import ReferencePointDrawer from './ReferencePointDrawer';
import AttributeDrawer from './AttributeDrawer';
import ComponentLineDrawer from './ComponentLineDrawer';

const modelPrompt = 'tarzan.product.bom.model.bom';

/**
 * 组件行表格
 * @extends {Component} - React.Component
 * @reactProps {Object} assemblyList - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ assemblyList, loading }) => ({
  assemblyList,
  fetchLoading: loading.effects['assemblyList/fetchComponentLineList'],
}))
@formatterCollections({ code: 'tarzan.product.bom' })
@Form.create({ fieldNameProp: null })
export default class ComponentLineTable extends React.Component {
  form;

  componentWillReceiveProps() {
    const {
      assemblyList: { componentLineList = [] },
    } = this.props;
    this.setState({ componentLineList });
  }

  state = {
    substituteDrawerVisible: false,
    referencePointDrawerVisible: false,
    attributeDrawerVisible: false,
    componentLineDrawerVisible: false,
    componentLineList: [],
    attributeDrawerKid: '', // 扩展属性对应的行ID
    referencePointKid: '',
    substituteKid: '',
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

  handleFilterSearch = (selectedKeys, confirm) => {
    confirm();
  };

  handleFilterReset = clearFilters => {
    clearFilters();
  };

  /**
   * 重置
   */
  @Bind()
  handleFormReset() {
    this.props.form.resetFields();
    this.form.resetFields();
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        displayList: [],
        componentLineList: [],
      },
    });
  }

  // 关闭替代组位抽屉
  @Bind
  handleSubstituteDrawerCancel() {
    this.setState({ substituteDrawerVisible: false });
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/updateState',
      payload: {
        substituteItemList: [],
      },
    });
  }

  // 关闭参考点抽屉
  @Bind
  handleReferencePointDrawerCancel() {
    this.setState({ referencePointDrawerVisible: false });
  }

  // 关闭扩展属性抽屉
  @Bind
  handleAttributeDrawerCancel() {
    this.setState({ attributeDrawerVisible: false });
  }

  // 关闭组件行编辑抽屉
  @Bind
  handleComponentLineDrawerCancel() {
    this.setState({ componentLineDrawerVisible: false });
  }

  // 组件行编辑抽屉点击确定并保存
  @Bind
  handleComponentLineDrawerOk(fieldsValue) {
    const { dispatch, currentBomId } = this.props;
    dispatch({
      type: 'assemblyList/saveComponentLineRow',
      payload: {
        ...fieldsValue,
      },
    }).then(res => {
      if (res && res.success) {
        // 请求成功 1.给出成功提示关闭抽屉 2.查询列表
        this.comLineRef.closeDrawer();
        notification.success();
        dispatch({
          type: 'assemblyList/fetchComponentLineList',
          payload: {
            bomId: currentBomId,
          },
        });
      } else {
        notification.error(res.message);
      }
    });
  }

  // 打开替代组抽屉
  @Bind
  handleSubstituteDrawerShow(record) {
    const { dispatch } = this.props;
    // 查询替代组的列表
    dispatch({
      type: 'assemblyList/fetchSubstituteGroupList',
      payload: {
        bomComponentId: record.bomComponentId,
      },
    });
    // 查询替代策略
    dispatch({
      type: 'assemblyList/fetchAssemblySubstitutePolicy',
      payload: {
        module: 'BOM',
        typeGroup: 'SUBSTITUTE_POLICY',
      },
    });
    this.setState({ substituteDrawerVisible: true, substituteKid: record.bomComponentId });
  }

  // 打开组件行编辑抽屉
  @Bind
  handleComponentLineDrawerShow(record = {}) {
    this.comLineRef.showDrawer(record);
  }

  // 打开参考点抽屉
  @Bind
  handleReferencePointDrawerShow(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/fetchReferencePointList',
      payload: {
        bomComponentId: record.bomComponentId,
      },
    });
    this.setState({ referencePointDrawerVisible: true, referencePointKid: record.bomComponentId });
  }

  // 打开扩展属性抽屉
  @Bind
  handleAttributeDrawerShow(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'assemblyList/fetchExtendedAttributeList',
      payload: {
        kid: record.bomComponentId,
        tableName: 'mt_bom_component_attr',
      },
    });
    this.setState({ attributeDrawerVisible: true, attributeDrawerKid: record.bomComponentId });
  }

  @Bind()
  comLineRefBind(ref = {}) {
    this.comLineRef = ref;
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const { currentBomId, canEdit } = this.props;
    const { componentLineList } = this.state;
    const columns = [
      {
        title: (
          <Button
            className={currentBomId === '' ? '' : styles.activeCreate}
            icon="plus"
            disabled={currentBomId === '' || !canEdit}
            shape="circle"
            size="small"
            onClick={this.handleComponentLineDrawerShow}
          />
        ),
        align: 'center',
        width: 60,
        render: () => <Button disabled icon="minus" shape="circle" size="small" />,
      },
      {
        title: intl.get(`${modelPrompt}.lineNumber`).d('排序号'),
        width: 100,
        dataIndex: 'lineNumber',
        sorter: (a, b) => a.lineNumber - b.lineNumber,
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('组件编码'),
        dataIndex: 'materialCode',
        width: 200,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.handleComponentLineDrawerShow(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
        ...this.getColumnSearchProps('materialCode'),
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('组件描述'),
        dataIndex: 'materialName',
        width: 200,
        ...this.getColumnSearchProps('materialName'),
      },
      {
        title: intl.get(`${modelPrompt}.bomVersion`).d('组件版本'),
        dataIndex: 'bomVersion',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.bomComponentTypeDesc`).d('组件类型'),
        dataIndex: 'bomComponentTypeDesc',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.primaryQty`).d('数量'),
        dataIndex: 'qty',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.uomName`).d('组件单位'),
        dataIndex: 'uomName',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.dateFrom`).d('生效时间'),
        dataIndex: 'dateFrom',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.dateTo`).d('失效时间'),
        dataIndex: 'dateTo',
        width: 200,
        align: 'center',
      },
      {
        title: intl.get('hzero.common.button.action').d('操作'),
        align: 'center',
        width: 300,
        fixed: 'right',
        render: (val, record) => (
          <span className="action-link">
            <a onClick={() => this.handleSubstituteDrawerShow(record)}>
              {intl.get(`${modelPrompt}.substituteGroup`).d('替代组')}
            </a>
            <a onClick={() => this.handleReferencePointDrawerShow(record)}>
              {intl.get(`${modelPrompt}.referencePoint`).d('参考点')}
            </a>
            <a onClick={() => this.handleAttributeDrawerShow(record)}>
              {intl.get(`${modelPrompt}.attribute`).d('扩展属性')}
            </a>
          </span>
        ),
      },
    ];
    const {
      substituteDrawerVisible,
      referencePointDrawerVisible,
      attributeDrawerVisible,
      componentLineDrawerVisible,
      attributeDrawerKid,
      referencePointKid,
      substituteKid,
    } = this.state;
    // 替代组参数
    const substituteDrawerProps = {
      visible: substituteDrawerVisible,
      onCancel: this.handleSubstituteDrawerCancel,
      onOk: this.handleSubstituteDrawerCancel,
      bomId: substituteKid,
      currentBomId,
      canEdit,
    };
    // 参考点参数
    const referencePointDrawerProps = {
      visible: referencePointDrawerVisible,
      onCancel: this.handleReferencePointDrawerCancel,
      onOk: this.handleReferencePointDrawerCancel,
      bomId: referencePointKid,
      canEdit,
    };
    // 扩展属性参数
    const attributeDrawerProps = {
      visible: attributeDrawerVisible,
      onCancel: this.handleAttributeDrawerCancel,
      onOk: this.handleAttributeDrawerCancel,
      bomId: attributeDrawerKid, // 应该为行的主键
      canEdit,
    };
    // 组件行参数
    const componentLineDrawerProps = {
      visible: componentLineDrawerVisible,
      onOk: this.handleComponentLineDrawerOk,
      currentBomId,
      canEdit,
    };
    return (
      <React.Fragment>
        <Table
          bordered
          rowKey="bomComponentId"
          columns={columns}
          dataSource={componentLineList}
          scroll={{ x: tableScrollWidth(columns) }}
        />
        <SubstituteDrawer {...substituteDrawerProps} />
        <ReferencePointDrawer {...referencePointDrawerProps} />
        <AttributeDrawer {...attributeDrawerProps} />
        <ComponentLineDrawer {...componentLineDrawerProps} onRef={this.comLineRefBind} />
      </React.Fragment>
    );
  }
}
