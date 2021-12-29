/**
 * collection - 号码字段分配维护
 * @date: 2019-8-1
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
// import { tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
// import NumberRangeDistributionDrawer from './NumberRangeDistributionDrawer';
import moment from 'moment';
import HistoryDrawer from './HistoryDrawer';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.acquisition.collection.model.collection';

/**
 * 号码字段分配维护
 * @extends {Component} - React.Component
 * @reactProps {Object} collection - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ collection, loading }) => ({
  collection,
  fetchLoading: loading.effects['collection/fetchTagList'],
  deleteLoading: loading.effects['collection/deleteNumberRangeDistribution'],
}))
@formatterCollections({ code: 'tarzan.acquisition.collection' })
export default class NumberRangeDistribution extends React.Component {
  state = {
    initData: {},
    selectedRows: [],
    visible: false,
    expandForm: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.refresh();
    dispatch({
      type: 'collection/fetchStatueSelectList',
      payload: {
        module: 'GENERAL',
        statusGroup: 'TAG_GROUP_STATUS',
        type: 'statusList',
      },
    });
    dispatch({
      type: 'collection/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_GROUP_TYPE',
        type: 'typeList',
      },
    });
    dispatch({
      type: 'collection/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_GROUP_BUSINESS_TYPE',
        type: 'businessList',
      },
    });
    dispatch({
      type: 'collection/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_GROUP_COLLECTION_TIME',
        type: 'collectionTimeControlList',
      },
    });
  }

  refForm = (ref = {}) => {
    this.filterForm = (ref.props || {}).form;
  };

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
      type: 'collection/fetchTagList',
      payload: {
        ...params,
        page: pagination,
      },
    });
  };

  @Bind
  handleFormReset = () => {
    // reset
  };

  @Bind
  onChange = (selectedRows, selectedRowKeys) => {
    this.setState({
      selectedRows,
      initData: selectedRowKeys,
    });
  };

  @Bind()
  toDistPageCreate = record => {
    const { history } = this.props;
    const id = record ? record.tagGroupId : 'create';
    history.push(`/hmes/acquisition/data-collection/dist/${id}`);
  };

  @Bind
  changeHistory = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    this.setState({
      visible: true,
    });
    dispatch({
      type: 'collection/fetchTagListHistory',
      payload: {
        tagGroupId: selectedRows[0],
        startTime: moment()
          .subtract(6, 'months')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    });
  };

  @Bind
  onCancel = () => {
    this.setState({
      visible: false,
    });
  };

  @Bind()
  changeExpandForm= () =>
  {
    this.setState({expandForm: !this.state.expandForm});
  }

  /**
   * 关联对象导入
   */
  @Bind()
  exObjectImportExcel() {
    openTab({
      key: `/hmes/acquisition/data-collection/data-import/HME.TAG_GROUP_OBJECT`,
      title: intl.get('hwms.machineBasic.view.message.import').d('关联对象导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('关联对象导入'),
      }),
    });
  }

  /**
   * 数据项关系导入
   */
  @Bind()
  exDataImportExcel() {
    openTab({
      key: `/hmes/acquisition/data-collection/data-import/HME.TAG_GROUP_DATA`,
      title: intl.get('hwms.machineBasic.view.message.import').d('数据项关系导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('数据项关系导入'),
      }),
    });
  }

  /**
   * 导出
   */
  @Bind()
  handleGetFormValue() {
    const filterValue = this.filterForm === undefined ? {} : this.filterForm.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
  }

  render() {
    const {
      collection: {
        tagList = [],
        tagPagination = {},
        statusList = [],
        typeList = [],
        businessList = [],
        collectionTimeControlList = [],
      },
      fetchLoading,
    } = this.props;
    const { selectedRows, initData, visible, expandForm } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.tagGroupCode`).d('数据收集组编码'),
        width: 150,
        dataIndex: 'tagGroupCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.toDistPageCreate(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.tagGroupDescription`).d('数据收集组描述'),
        dataIndex: 'tagGroupDescription',
        // width: 200,
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('状态'),
        dataIndex: 'status',
        width: 90,
        align: 'center',
        render: val => (statusList.filter(ele => ele.statusCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.tagGroupType`).d('数据收集组类型'),
        dataIndex: 'tagGroupType',
        width: 150,
        render: val => (typeList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.businessType`).d('业务类型'),
        dataIndex: 'businessType',
        width: 100,
        render: val => (businessList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.collectionTimeControl`).d('数据收集时点'),
        dataIndex: 'collectionTimeControl',
        width: 110,
        align: 'center',
        render: val =>
          (collectionTimeControlList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.userVerification`).d('需要用户验证'),
        dataIndex: 'userVerification',
        width: 150,
        render: (val, record) => (
          <Badge
            status={record.userVerification === 'Y' ? 'success' : 'error'}
            text={
              record.userVerification === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: this.onChange,
      type: 'radio',
    };

    const queryFormProps = {
      onSearch: this.refresh,
      handleFormReset: this.handleFormReset,
      expandForm,
      changeExpandForm: this.changeExpandForm,
    };

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.acquisition.collection.title.list').d('数据收集组维护')}>
          <Button icon="plus" type="primary" onClick={() => this.toDistPageCreate()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('新建')}
          </Button>
          <Button icon="edit" disabled={selectedRows.length === 0} onClick={this.changeHistory}>
            {intl.get(`${modelPrompt}.history`).d('修改历史')}
          </Button>
          <Button type="primary" onClick={() => this.exObjectImportExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('关联对象导入')}
          </Button>
          <Button type="primary" onClick={() => this.exDataImportExcel()}>
            {intl.get(`tarzan.acquisition.collection.button.create`).d('数据项关系导入')}
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-common-export/tag-group-object-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            buttonText='关联对象导出'
          />
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-common-export/tag-group-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
            buttonText='数据项关系导出'
          />
        </Header>
        <Content>
          <FilterForm {...queryFormProps} onRef={this.refForm} />
          <Table
            loading={fetchLoading}
            rowKey="tagGroupId"
            rowSelection={rowSelection}
            dataSource={tagList}
            columns={columns}
            pagination={tagPagination}
            onChange={this.refresh}
            bordered
            // scroll={{ x: tableScrollWidth(columns) }}
          />
          <HistoryDrawer visible={visible} onCancel={this.onCancel} queryFromRecord={initData} />
        </Content>
      </React.Fragment>
    );
  }
}
