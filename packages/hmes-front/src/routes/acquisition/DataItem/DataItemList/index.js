/**
 * dataItem - 号码字段分配维护
 * @date: 2019-8-1
 * @author: hdy <deying.huang@hand-china.com>
 * @version: 0.0.4
 * @copyright Copyright (c) 2019, Hand
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Table, Badge, Form } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isUndefined } from 'lodash';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
// import NumberRangeDistributionDrawer from './NumberRangeDistributionDrawer';
import moment from 'moment';
import { tableScrollWidth, getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import Cookies from 'universal-cookie';
import { openTab } from 'utils/menuTab';
import queryString from 'querystring';
import HistoryDrawer from './HistoryDrawer';
import FilterForm from './FilterForm';

const cookies = new Cookies();

const modelPrompt = 'tarzan.acquisition.dataItem.model.dataItem';

/**
 * 号码字段分配维护
 * @extends {Component} - React.Component
 * @reactProps {Object} dataItem - 数据源
 * @reactProps {Object} form - 表单对象
 * @return React.element
 */
@connect(({ dataItem, loading }) => ({
  dataItem,
  fetchLoading: loading.effects['dataItem/fetchTagList'],
  deleteLoading: loading.effects['dataItem/deleteNumberRangeDistribution'],
}))
@formatterCollections({ code: 'tarzan.acquisition.dataItem' })
@Form.create({ fieldNameProp: null })
export default class NumberRangeDistribution extends React.Component {
  state = {
    search: {},
    initData: {},
    selectedRows: [],
    visible: false,
  };

  componentDidMount() {
    const { dispatch, location: { state: { _back } = {} }, dataItem: { tagPagination } } = this.props;
    const page = isUndefined(_back) ? {} : tagPagination;
    if (cookies.get('search') !== undefined && cookies.get('search') !== null && cookies.get('search') !== "") {

      this.setState({search: cookies.get('search')});
      dispatch({
        type: 'dataItem/fetchTagList',
        payload: {
          ...cookies.get('search'),
          page,
        },
      });
    }else{
      this.refresh(page);
    }
    dispatch({
      type: 'dataItem/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_VALUE_TYPE',
        type: 'valueTypeList',
      },
    });
    dispatch({
      type: 'dataItem/fetchSelectOption',
      payload: {
        module: 'GENERAL',
        typeGroup: 'TAG_COLLECTION_METHOD',
        type: 'collectionMthodList',
      },
    });
    cookies.set('search', {});
    this.queryLovs();
  }

  @Bind()
  exImportExcel() {
    openTab({
      key: `/hmes/acquisition/data-item/data-import/HME.TAG_IMPORT`,
      title: intl.get('hwms.machineBasic.view.message.import').d('数据项维护批量导入'),
      search: queryString.stringify({
        action: intl.get('hwms.machineBasic.view.message.import').d('数据项维护批量导入'),
      }),
    });
  }

  // 导出
  @Bind()
  handleGetFormValue() {
    const { form } = this.props;
    const filterValue = form.getFieldsValue();
    return filterNullValueObject({ ...filterValue });
  }

  // 获取值集
  queryLovs = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'dataItem/querySelect',
      payload: {
        qmsDefectLevel: "QMS.DEFECT_LEVEL",
        qmsInspectionLineType: "QMS.INSPECTION_LINE_TYPE",
        qmsInspectionTool: "QMS.INSPECTION_TOOL",
      },
    });
  };

  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'dataItem/fetchTagList',
      payload: {
        ...search,
        page: pagination,
      },
    });
  };

  onSearch = values => {
    this.setState(
      {
        search: values,
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind
  handleFormReset = () => {
    cookies.set('search', {});
    this.setState({
      search: {},
    });
  };

  @Bind
  onChange = (selectedRows, selectedRowKeys) => {
    this.setState({
      selectedRows,
      initData: selectedRowKeys[0],
    });
  };

  @Bind()
  toDistPageCreate = record => {
    cookies.set('search', this.state.search);
    const { history } = this.props;
    const id = record ? record.tagId : 'create';
    history.push(`/hmes/acquisition/data-item/dist/${id}`);
  };

  @Bind
  changeHistory = () => {
    cookies.set('search', this.state.search);
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    this.setState({
      visible: true,
    });
    dispatch({
      type: 'dataItem/fetchTagHistory',
      payload: {
        tagId: selectedRows[0],
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

  render() {
    const {
      dataItem: { tagList = [], tagPagination = {}, collectionMthodList = [], valueTypeList = [] },
      fetchLoading,
      form,
    } = this.props;
    const { selectedRows, initData, visible, search } = this.state;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.tagCode`).d('数据项编码'),
        width: 160,
        dataIndex: 'tagCode',
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
        title: intl.get(`${modelPrompt}.tagDescription`).d('数据项描述'),
        dataIndex: 'tagDescription',
        width: 200,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.remark`).d('备注'),
        dataIndex: 'remark',
        width: 220,
      },
      {
        title: intl.get(`${modelPrompt}.collectionMethod`).d('数据收集方式'),
        dataIndex: 'collectionMethod',
        width: 150,
        render: val =>
          (collectionMthodList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.valueAllowMissing`).d('允许缺失值'),
        dataIndex: 'valueAllowMissing',
        width: 120,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.valueAllowMissing === 'Y' ? 'success' : 'error'}
            text={
              record.valueAllowMissing === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        dataIndex: 'enableFlag',
        width: 90,
        align: 'center',
        render: (val, record) => (
          <Badge
            status={record.enableFlag === 'Y' ? 'success' : 'error'}
            text={
              record.enableFlag === 'Y'
                ? intl.get(`${modelPrompt}.open`).d('启用')
                : intl.get(`${modelPrompt}.forbidden`).d('禁用')
            }
          />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('数据类型'),
        dataIndex: 'valueType',
        width: 90,
        render: val => (valueTypeList.filter(ele => ele.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.objectDesc`).d('符合值'),
        dataIndex: 'trueValue',
        width: 90,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('不符合值'),
        dataIndex: 'falseValue',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('最小值'),
        dataIndex: 'minimumValue',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('最大值'),
        dataIndex: 'maximalValue',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('计量单位'),
        dataIndex: 'uomCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('必须的数据条数'),
        dataIndex: 'mandatoryNum',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.description`).d('可选的数据条数'),
        dataIndex: 'optionalNum',
        width: 150,
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedRows,
      onChange: this.onChange,
      type: 'radio',
    };
    const queryFormProps = {
      form,
      search,
      onSearch: this.onSearch,
      handleFormReset: this.handleFormReset,
    };

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.acquisition.dataItem.title.list').d('数据项维护')}>
          <Button icon="plus" type="primary" onClick={() => this.toDistPageCreate()}>
            {intl.get(`tarzan.acquisition.dataItem.button.create`).d('新建')}
          </Button>
          <Button icon="edit" onClick={this.changeHistory} disabled={selectedRows.length === 0}>
            {intl.get(`${modelPrompt}.history`).d('修改历史')}
          </Button>
          <Button icon="edit" onClick={this.exImportExcel}>
            {intl.get(`${modelPrompt}.history`).d('批量导入')}
          </Button>
          <ExcelExport
            exportAsync
            requestUrl={`/mes/v1/${getCurrentOrganizationId()}/hme-common-export/tag-export`}
            otherButtonProps={{ type: 'primary' }}
            queryParams={this.handleGetFormValue}
          />
          {/* {selectedRows.length === 0 ? (
            <Button icon="delete" loading={deleteLoading} disabled={selectedRows.length === 0}>
              {intl.get(`${modelPrompt}.delete`).d('删除')}
            </Button>
          ) : (
            <Popconfirm
              title={intl
                .get(`${modelPrompt}.confirm.delete`, {
                  count: selectedRows.length,
                })
                .d(`总计${selectedRows.length}条数据，是否确认删除?`)}
              onConfirm={this.deleteNumberRangeDistribution}
            >
              <Button icon="delete" loading={deleteLoading} disabled={selectedRows.length === 0}>
                {intl.get(`${modelPrompt}.delete`).d('删除')}
              </Button>
            </Popconfirm>
          )} */}
        </Header>
        <Content>
          <FilterForm {...queryFormProps} />
          <Table
            loading={fetchLoading}
            rowKey="tagId"
            rowSelection={rowSelection}
            dataSource={tagList}
            columns={columns}
            pagination={tagPagination}
            onChange={this.refresh}
            bordered
            scroll={{ x: tableScrollWidth(columns) }}
          />
          <HistoryDrawer
            queryFromRecord={initData}
            visible={visible}
            onCancel={this.onCancel}
            // {...numberRangeDistributionDrawerProps}
            // onRef={this.onRefNumber}
          />
          {/* <HistoryDrawer {...tableDrawerProps} onRef={this.onRefHistory} /> */}
        </Content>
      </React.Fragment>
    );
  }
}
