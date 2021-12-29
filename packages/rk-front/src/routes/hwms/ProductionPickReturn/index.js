/**
 * @Description: 生产领退料平台
 * @author: lly
 * @date 2021/07/05 10:53
 * @version 1.0
 */

// 引入依赖
import React from 'react';
import { Header, Content } from 'components/Page';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { filterNullValueObject } from 'utils/utils';
import { isEmpty, isUndefined, isArray } from 'lodash';
import { DETAIL_CARD_TABLE_CLASSNAME, DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import { Card, Modal, Table } from 'hzero-ui';
import Filter from './FilterForm';
import HeadTable from './HeadListTable';
import LineTable from './LineListTable';

// import { getSiteId } from '@/utils/utils';

// 暂定模板
const modelPormt = 'hwms.tarzan.production-pick-return';

// 连接model
@connect(({ productionPickReturn, loading }) => ({
  productionPickReturn,
  fetchHeadLoading: loading.effects['productionPickReturn/fetchHeaderList'],
  fetchLineLoading: loading.effects['productionPickReturn/fetchLineList'],
  fetchDetailLoading: loading.effects['productionPickReturn/fetchDetailList'],
}))
@formatterCollections({
  code: 'hwms.tarzan.production-pick-return',
})
export default class productionPickReturn extends React.Component {
  form;

  constructor(props) {
    super(props);
    this.state = {
      showDetailModal: false, // 是否显示明细modal
      selectedRowKeys: [], // 选中的头
      selectedRows: [], // 选中的头数据
      lineRecord: {},
    };
  }

  // 加载时调用的方法
  async componentDidMount() {
    const { dispatch } = this.props;
    // 加载下拉框
    await dispatch({
      type: 'productionPickReturn/init',
    });
    await dispatch({
      type: 'productionPickReturn/querySiteList',
      payload: {},
    });
    await dispatch({
      type: 'productionPickReturn/getSiteList',
      payload: {},
    });
    // 进入页面加载头表
    await this.handleHeadSearch();
  }

  /**
   *  查询头列表
   * @param {object} 查询参数
   */
  @Bind()
  handleHeadSearch(fields = {}) {
    const { dispatch } = this.props;
    const filterValues = (this.form && filterNullValueObject(this.form.getFieldsValue())) || {};
    dispatch({
      type: 'productionPickReturn/fetchHeaderList',
      payload: {
        ...filterValues,
        creationDate: isUndefined(filterValues.creationDate)
          ? null
          : moment(filterValues.creationDate).format(DEFAULT_DATETIME_FORMAT),
        lastUpdateDate: isUndefined(filterValues.lastUpdateDate)
          ? null
          : moment(filterValues.lastUpdateDate).format(DEFAULT_DATETIME_FORMAT),
        instructionDocStatus: isArray(filterValues.instructionDocStatus) ? filterValues.instructionDocStatus.join(',') : null,
        department: isArray(filterValues.department) ? filterValues.department.join(',') : null,
        page: isEmpty(fields) ? {} : fields,
      },
    }).then(res => {
      if (res) {
        this.setState(
          {
            selectedRowKeys: [],
            selectedRows: [],
          },
          () => {
            dispatch({
              type: 'productionPickReturn/updateState',
              payload: {
                lineList: [],
                lineListPagination: {},
              },
            });
          }
        );
      }
    });
  }

  /**
   *  查询行列表
   * @param {object} 查询参数
   */
  @Bind()
  handleLineSearch(fields = {}) {
    const { selectedRows } = this.state;
    // console.log('selectedRows==', selectedRows);
    const { instructionDocId } = selectedRows[0];
    const { dispatch } = this.props;
    dispatch({
      type: 'productionPickReturn/fetchLineList',
      payload: {
        instructionDocIds: instructionDocId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   * 头数据选择操作
   */
  @Bind()
  handleSelectHeadRow(selectedRowKeys, selectedRows) {
    this.setState(
      { selectedRowKeys, selectedRows },
      () => {
        this.handleLineSearch();
      }
    );
  }

  /**
   * 明细数据查询
   */
  @Bind()
  handleDetailSearch(record) {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionPickReturn/fetchDetailList',
      payload: {
        instructionId: record.instructionId,
        page: {},
      },
    }).then(res => {
      if (res) {
        this.handleModalVisible();
        this.setState(
          { lineRecord: record }
        );
      }
    });
  }

  // 明细分页查询；
  @Bind()
  handleDetailPage(fields = {}) {
    const { dispatch } = this.props;
    dispatch({
      type: 'productionPickReturn/fetchDetailList',
      payload: {
        instructionId: this.state.lineRecord.instructionId,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }


  /**
   *  是否显示单据行明细modal
   */
  @Bind()
  handleModalVisible() {
    const { showDetailModal } = this.state;
    this.setState({ showDetailModal: !showDetailModal });
  }

  /**
   * 传递表单对象
   * @param {object} ref - FilterForm对象
   */
  @Bind()
  handleBindRef(ref = {}) {
    this.form = (ref.props || {}).form;
  }

  render() {
    const {
      showDetailModal,
      selectedRowKeys,
    } = this.state;

    // 获取加载的状态
    const {
      productionPickReturn: {
        headList = [], // 头信息
        headListPagination = {}, // 头分页
        lineList = [], // 行信息
        lineListPagination = {}, // 行分页
        detailList = [],
        detailListPagination = {},
        siteMap = [], // 站点
        getSite = {}, // 用户默认站点
        statusMap = [], // 单据状态
        typeMap = [], // 单据类型
        departmentMap = [],
      },
      fetchHeadLoading,
      fetchLineLoading,
      fetchDetailLoading,
    } = this.props;

    const searchFromProps = {
      siteInfo: getSite,
      siteMap,
      statusMap,
      typeMap,
      departmentMap,
      onSearch: this.handleHeadSearch,
      onRef: this.handleBindRef,
    };

    const headListProps = {
      siteMap,
      selectedRowKeys,
      loading: fetchHeadLoading,
      dataSource: headList,
      pagination: headListPagination,
      onSelectHead: this.handleSelectHeadRow,
      onSearch: this.handleHeadSearch,
    };

    const lineListProps = {
      statusMap,
      pagination: lineListPagination,
      loading: fetchLineLoading,
      dataSource: lineList,
      onSearch: this.handleLineSearch,
      onRow: this.handleDetailSearch,
    };

    const columnsDetail = [
      {
        title: '序号',
        width: 80,
        dataIndex: 'orderSeq',
        render: (text, data, index) => {
          return index + 1;
        },
      },
      {
        title: intl.get(`materialLotCode`).d('条码'),
        dataIndex: 'materialLotCode',
        width: 120,
      },
      {
        title: intl.get(`status`).d('状态'),
        dataIndex: 'statusMeaning',
        width: 100,
      },
      {
        title: intl.get(`materialCode`).d('物料'),
        width: 120,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`materialName`).d('物料描述'),
        width: 150,
        align: 'center',
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`parentLocatorIdCode`).d('仓库'),
        width: 120,
        dataIndex: 'parentLocatorIdCode',
      },
      {
        title: intl.get(`locatorIdCode`).d('货位'),
        width: 120,
        dataIndex: 'locatorIdCode',
      },
      {
        title: intl.get(`primaryUomQty`).d('数量'),
        width: 100,
        dataIndex: 'primaryUomQty',
      },
      {
        title: intl.get(`lot`).d('批次'),
        width: 100,
        align: 'center',
        dataIndex: 'lot',
      },
      {
        title: intl.get(`enableFlag`).d('有效性'),
        width: 100,
        dataIndex: 'enableFlagMeaning',
      },
      {
        title: intl.get(`containerCode`).d('上层容器'),
        width: 120,
        dataIndex: 'containerCode',
      },
    ];
    return (
      <div>
        <Header title={intl.get(`${modelPormt}.view.title`).d('生产领退料平台')} />
        <Content>
          <Filter {...searchFromProps} />
          <HeadTable {...headListProps} />
          <Card
            key="code-rule-header"
            title={intl.get(`${modelPormt}.view.line`).d('单据行信息')}
            bordered={false}
            className={DETAIL_CARD_TABLE_CLASSNAME}
          >
            <LineTable {...lineListProps} />
            {showDetailModal && (
              <Modal
                destroyOnClose
                width={800}
                title={intl.get('tarzan.acquisition.collection.title.detail').d('明细')}
                visible={showDetailModal}
                onCancel={this.handleModalVisible}
                wrapClassName="ant-modal-sidebar-right"
                transitionName="move-right"
                footer={null}
              >
                <Table
                  bordered
                  loading={fetchDetailLoading}
                  dataSource={detailList}
                  columns={columnsDetail}
                  pagination={detailListPagination}
                  onChange={page => this.handleDetailPage(page)}
                />
              </Modal>
            )}
          </Card>
        </Content>
      </div>
    );
  }
}
