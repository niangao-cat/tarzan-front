/**
 * 物流器具历史
 *@date：2019/9/21
 *@author：junhui.liu <junhui.liu@hand-china.com>
 *@version：0.0.1
 *@copyright Copyright (c) 2019,Hand
 */
import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';
import { dateRender } from 'utils/renderer';

const modelPrompt = 'hwms.applianceCreation.model.applianceCreation';

@connect(({ applianceCreation, loading }) => ({
  applianceCreation,
  tenantId: getCurrentOrganizationId(),
  loading: {
    fetchLoading:
      loading.effects['applianceCreation/queryHeaderHisList'] ||
      loading.effects['applianceCreation/queryLineHisList'],
  },
}))
@formatterCollections({ code: 'hwms.applianceCreation' })
class BarcodeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: window.localStorage.getItem('choseFlag') === 'head',
      selectRows: JSON.parse(window.localStorage.getItem('selectedApplianceRows')),
    };
  }

  componentDidMount() {
    this.handleSearch();
  }

  // 判断头查询 or 行查询
  @Bind()
  handleSearch(page = {}) {
    const { flag } = this.state;
    if (flag) {
      this.handleHeadHisSearch(page);
    } else {
      this.handleLineHisSearch(page);
    }
  }

  /**
   *  查询物流器具头历史列表
   * @param fields
   */
  @Bind()
  handleHeadHisSearch(fields = {}) {
    const { selectRows } = this.state;
    const { dispatch, tenantId } = this.props;
    const containHeaders = selectRows.map(item => {
      return item.containerId;
    });
    dispatch({
      type: 'applianceCreation/queryHeaderHisList',
      payload: {
        tenantId,
        containHeaders,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  /**
   *  查询物流器具行历史列表
   * @param fields
   */
  @Bind()
  handleLineHisSearch(fields = {}) {
    const { selectRows } = this.state;
    const { dispatch, tenantId } = this.props;
    const containLines = selectRows.map(item => {
      return item.containerLoadDetailId;
    });
    dispatch({
      type: 'applianceCreation/queryLineHisList',
      payload: {
        tenantId,
        containLines,
        page: isEmpty(fields) ? {} : fields,
      },
    });
  }

  render() {
    const { flag } = this.state;
    const {
      loading: { fetchLoading },
      applianceCreation: {
        lineHisList = [],
        lineHisPagination = {},
        headHisList = [],
        headHisPagination = {},
      },
    } = this.props;
    const dataSource = flag ? headHisList : lineHisList;
    const pagination = flag ? headHisPagination : lineHisPagination;
    const headHisColumns = [
      {
        title: intl.get(`${modelPrompt}.containerCode`).d('物流器具编码'),
        width: 150,
        dataIndex: 'containerCode',
      },
      {
        title: intl.get(`${modelPrompt}.eventType`).d('事件类型'),
        width: 120,
        dataIndex: 'eventTypeCode',
      },
      {
        title: intl.get(`${modelPrompt}.eventBy`).d('事件人'),
        width: 120,
        dataIndex: 'eventBy',
      },
      {
        title: intl.get(`${modelPrompt}.eventTime`).d('事件时间'),
        width: 120,
        dataIndex: 'eventTime',
        align: 'center',
        render: dateRender,
      },
      {
        title: intl.get(`${modelPrompt}.containerType`).d('物流器具类型'),
        width: 150,
        dataIndex: 'containerTypeDescription',
      },
      {
        title: intl.get(`${modelPrompt}.containerName`).d('物流器具名称'),
        width: 150,
        dataIndex: 'containerName',
      },
      {
        title: intl.get(`${modelPrompt}.containerDesc`).d('详细描述'),
        width: 120,
        dataIndex: 'description',
      },
      {
        title: intl.get(`${modelPrompt}.status`).d('状态'),
        dataIndex: 'containerStatusMeaning',
      },
      {
        title: intl.get(`${modelPrompt}.plant`).d('工厂'),
        width: 120,
        dataIndex: 'siteCode',
      },
      {
        title: intl.get(`${modelPrompt}.locator`).d('货位'),
        width: 120,
        dataIndex: 'locatorCode',
      },
      {
        title: intl.get(`${modelPrompt}.ownerType`).d('所有者类型'),
        width: 120,
        dataIndex: 'ownerType',
      },
      {
        title: intl.get(`${modelPrompt}.ownerCode`).d('所有者编码'),
        dataIndex: 'ownerCode',
      },
      {
        title: intl.get(`${modelPrompt}.lastLoadTime`).d('最后一次装载时间'),
        width: 200,
        dataIndex: 'lastLoadTime',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.lastUnLoadTime`).d('最后一次卸载时间'),
        width: 200,
        dataIndex: 'lastUnloadTime',
        align: 'center',
      },
      {
        title: intl.get(`${modelPrompt}.creater`).d('创建人'),
        width: 120,
        dataIndex: 'createdBy',
      },
      {
        title: intl.get(`${modelPrompt}.createDate`).d('创建时间'),
        width: 150,
        align: 'center',
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${modelPrompt}.createReason`).d('创建原因'),
        width: 120,
        dataIndex: 'creationReason',
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateBy`).d('最后更新人'),
        width: 150,
        dataIndex: 'lastUpdatedBy',
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateDate`).d('最后更新时间'),
        width: 200,
        align: 'center',
        dataIndex: 'lastUpdateDate',
      },
    ];
    const lineHisColumns = [
      {
        title: intl.get(`${modelPrompt}.objectType`).d('对象类型'),
        width: 120,
        dataIndex: 'loadObjectType',
      },
      {
        title: intl.get(`${modelPrompt}.objectCode`).d('对象编码'),
        width: 120,
        dataIndex: 'loadObjectCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料编码'),
        width: 150,
        dataIndex: 'materialCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialName`).d('物料描述'),
        width: 150,
        dataIndex: 'materialName',
      },
      {
        title: intl.get(`${modelPrompt}.eventType`).d('事件类型'),
        width: 120,
        dataIndex: 'eventTypeCode',
      },
      {
        title: intl.get(`${modelPrompt}.eventBy`).d('事件人'),
        width: 120,
        dataIndex: 'eventBy',
      },
      {
        title: intl.get(`${modelPrompt}.eventTime`).d('事件时间'),
        width: 120,
        dataIndex: 'eventTime',
        render: dateRender,
      },
      {
        title: intl.get(`${modelPrompt}.loadQty`).d('装载数量'),
        dataIndex: 'loadQty',
      },
      {
        title: intl.get(`${modelPrompt}.trxLoadQty`).d('本次变更数量'),
        width: 120,
        dataIndex: 'trxLoadQty',
      },
      {
        title: intl.get(`${modelPrompt}.creater`).d('创建人'),
        width: 120,
        dataIndex: 'createdBy',
      },
      {
        title: intl.get(`${modelPrompt}.createDate`).d('创建时间'),
        width: 150,
        align: 'center',
        dataIndex: 'creationDate',
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateBy`).d('最后更新人'),
        width: 150,
        dataIndex: 'lastUpdateBy',
      },
      {
        title: intl.get(`${modelPrompt}.lastUpdateDate`).d('最后更新时间'),
        width: 150,
        align: 'center',
        dataIndex: 'lastUpdateDate',
      },
    ];
    const columns = flag ? headHisColumns : lineHisColumns;
    const rowKey = flag ? 'containerId' : 'containerLoadDetailId';
    return (
      <React.Fragment>
        <Header
          title={
            flag
              ? intl.get('hwms.applianceCreation.view.message.headHistory').d('物流器具头历史')
              : intl.get('hwms.applianceCreation.view.message.lineHistory').d('物流器具行历史')
          }
          backPath="/hwms/appliance/list"
        />
        <Content>
          <Table
            bordered
            rowKey={rowKey}
            columns={columns}
            loading={fetchLoading}
            dataSource={dataSource}
            pagination={pagination}
            scroll={{ x: tableScrollWidth(columns) }}
            onChange={page => this.handleSearch(page)}
          />
        </Content>
      </React.Fragment>
    );
  }
}

export default BarcodeHistory;
