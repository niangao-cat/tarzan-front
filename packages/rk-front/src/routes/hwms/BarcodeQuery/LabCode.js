/**
 * 实验代码
 *@date：2021/01/25 13:40
 *@author：li.zhang13@hand-china.com
 *@version：0.0.1
 */
import React, { Component, Fragment } from 'react';
import { Table} from 'hzero-ui';
import { Header, Content } from 'components/Page';
import { isEmpty } from 'lodash';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { connect } from 'dva';
import { Bind } from 'lodash-decorators';


@connect(({ barcodeQuery, loading }) => ({
    barcodeQuery,
    tenantId: getCurrentOrganizationId(),
    loading: {
    fetchLoading: loading.effects['barcodeQuery/queryLabCodeList'],
    },
}))
@formatterCollections({ code: 'hwms.barcodeQuery' })
export default class LabCode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            parentItem: JSON.parse(window.localStorage.getItem('selectedBarRows')),
        };
    }

    componentDidMount() {
    this.handleSearch();
    }

    /**
   *  查询列表
   * @param fields
   */
    @Bind()
    handleSearch(fields = {}) {
        const { dispatch, tenantId } = this.props;
        const { parentItem } = this.state;
        const materialLotId = parentItem.map(item => {
            return item.materialLotId;
        });
        dispatch({
            type: 'barcodeQuery/queryLabCodeList',
            payload: {
                tenantId,
                materialLotId,
                page: isEmpty(fields) ? {} : fields,
            },
        });
    }

    render() {
        const {
        loading: { fetchLoading },
        barcodeQuery: { labCodeList = [], labCodePagination = {} },
        } = this.props;
        const columns = [
        {
            title: '步骤顺序',
            dataIndex: 'sequence',
            width: 200,
        },
        {
            title: '步骤描述',
            dataIndex: 'description',
            width: 150,
        },
        {
            title: '实验代码',
            dataIndex: 'labCode',
            width: 150,
        },
        ];
        return (
          <Fragment>
            <Header
              title='实验代码'
              backPath="/hwms/barcode/list"
            />
            <Content>
              <div className="barcode-query-labCode-tableClass">
                <Table
                  bordered
                  rowKey="materialLotId"
                  columns={columns}
                  loading={fetchLoading}
                  dataSource={labCodeList}
                  pagination={labCodePagination}
                  onChange={page => this.handleSearch(page)}
                />
              </div>
            </Content>
          </Fragment>
        );
    }
}
