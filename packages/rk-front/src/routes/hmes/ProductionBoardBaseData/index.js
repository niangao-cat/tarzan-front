import React, { Component } from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import formatterCollections from 'utils/intl/formatterCollections';
import { addItemToPagination, getEditTableData, getCurrentOrganizationId, delItemToPagination } from 'utils/utils';
import notification from 'utils/notification';
import EditTable from 'components/EditTable';
import { Row, Col } from 'hzero-ui';
import ListTable from './ListTable';

@connect(({ productionBoardBaseData, loading }) => ({
  productionBoardBaseData,
  tenantId: getCurrentOrganizationId(),
  getTypeLovLoading: loading.effects['productionBoardBaseData/getTypeLov'],
  saveLoading: loading.effects['sampleCode/saveSampleCode'],
  deleteDataLoading: loading.effects['productionBoardBaseData/deleteData'],
  handleSearchLoading: loading.effects['productionBoardBaseData/handleSearch'],
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class IQCInspectionFree extends Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      selectedRow: [],
    };
  }

  componentDidMount() {
    const { dispatch, tenantId } = this.props;
    dispatch({
      type: 'productionBoardBaseData/getTypeLov',
      payload: {
        reportType: 'HME.REPORT_TYPE', // 看板类型
      },
    });
    dispatch({
      type: `productionBoardBaseData/getSiteList`,
      payload: {
        tenantId,
      },
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionBoardBaseData/updateState',
      payload: {
        list: [],
        pagination: {},
      },
    });
  }

  /**
   *  查询列表
   * @param {object} 查询参数
   */
  @Bind()
  handleSearch(fields = {}) {
    const { dispatch } = this.props;
    // const fieldsValue = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    const { selectedRow } = this.state;
    dispatch({
      type: 'productionBoardBaseData/handleSearch',
      payload: {
        // ...fieldsValue,
        reportType: selectedRow[0].value,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  // 新增数据
  @Bind()
  handleCreate() {
    const {
      dispatch,
      productionBoardBaseData: { list = [], pagination = {}, defaultSite = {} },
    } = this.props;
    dispatch({
      type: 'productionBoardBaseData/updateState',
      payload: {
        list: [
          {
            id: new Date().getTime(),
            siteId: defaultSite.siteId,
            siteName: defaultSite.siteName,
            _status: 'create', // 新建标记位
          },
          ...list,
        ],
        pagination: addItemToPagination(list.length, pagination),
      },
    });
  }

  /**
   *  保存数据
   */
  @Bind()
  handleSave() {
    const {
      productionBoardBaseData: { list = [] },
      dispatch,
    } = this.props;
    const params = getEditTableData(list);
    const { selectedRow } = this.state;
    dispatch({
      type: 'productionBoardBaseData/handleSave',
      payload: {
        ...params[0],
        reportType: selectedRow[0].value,
      },
    }).then(res => {
      if (res) {
        notification.success();
        this.handleSearch();
      }
    });
  }


  // 选中表格行
  @Bind()
  onSelectTableRow(selectedRowKeys, selectedRow) {
    this.setState({ selectedRowKeys, selectedRow }, () => {
      this.handleSearch();
    });
  }

  // 行数据删除
  @Bind()
  deleteData(record, index) {
    const {
      dispatch,
      equipmentInspectionMaintenance: { list = [], pagination = {} },
    } = this.props;
    const { selectedRow } = this.state;
    if (!record.flag) {
      dispatch({
        type: 'productionBoardBaseData/deleteData',
        payload: {
          ...selectedRow[0],
          ...record,
        },
      }).then(res => {
        if (res) {
          notification.success();
          this.fetchLineData();
        }
      });
    } else {
      list.splice(index, 1);
      dispatch({
        type: 'productionBoardBaseData/updateState',
        payload: {
          list,
          pagination: delItemToPagination(1, pagination),
        },
      });
    }
  }

  /**
   * 编辑关联表
   */
  @Bind()
  handleEdit(record, flag) {
    const {
      dispatch,
      productionBoardBaseData: { list },
    } = this.props;
    const newList = list.map(item => {
      if (record.reportSetupId === item.reportSetupId) {
        return { ...item, _status: flag ? 'update' : '' };
      } else {
        return item;
      }
    });
    dispatch({
      type: 'productionBoardBaseData/updateState',
      payload: { list: newList },
    });
  }

  // 取消编辑关联表
  @Bind()
  handleCleanLine(record) {
    const {
      dispatch,
      productionBoardBaseData: { list },
    } = this.props;
    const newList = list.filter(item => item.id !== record.id);
    dispatch({
      type: 'productionBoardBaseData/updateState',
      payload: { list: newList },
    });
  }

  /**
   *  渲染页面
   * @returns {*}
   */
  render() {
    const {
      productionBoardBaseData: {
        lovData = {},
        pagination = {},
        list = [],
        defaultSite = {},
      },
      tenantId,
      getTypeLovLoading,
      deleteDataLoading,
      handleSearchLoading,
    } = this.props;
    const { reportType = [] } = lovData;
    const { siteId } = defaultSite;
    const { selectedRowKeys, selectedRow } = this.state;
    const columns = [
      {
        title: '看板类型',
        dataIndex: 'value',
        width: 200,
        align: 'center',
      },
      {
        title: '看板名称',
        dataIndex: 'meaning',
        width: 150,
        align: 'center',
      },
    ];
    return (
      <React.Fragment>
        <Header title="基础数据维护" />
        <Content>
          <Row>
            <Col style={{ width: '480px', marginBottom: '10px' }}>
              <EditTable
                bordered
                rowKey="value"
                columns={columns}
                loading={getTypeLovLoading}
                dataSource={reportType}
                pagination={false}
                rowSelection={{
                  selectedRowKeys,
                  type: 'radio', // 单选
                  onChange: this.onSelectTableRow,
                }}
              />
            </Col>
          </Row>
          <ListTable
            dataSource={list}
            fetchLoading={deleteDataLoading||handleSearchLoading}
            tenantId={tenantId}
            pagination={pagination}
            siteId={siteId}
            selectedRow={selectedRow}
            onSearch={this.handleSearch}
            handleEdit={this.handleEdit}
            handleSave={this.handleSave}
            handleCleanLine={this.handleCleanLine}
            handleEditLine={this.handleEditLine}
            handleCreate={this.handleCreate}
          />
        </Content>
      </React.Fragment>
    );
  }
}
