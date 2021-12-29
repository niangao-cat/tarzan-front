/**
 *@description 生产线维护
 *@author: 唐加旭
 *@date: 2019-09-02 10:27:54
 *@version: V0.0.1
 *@reactProps {}  -
 *@return:</>
 * */
import React from 'react';
import { connect } from 'dva';
import { Form, Button, Table, Badge } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { Header, Content } from 'components/Page';

// import { verifyObjectHasValue } from '@/utils/utils';
import intl from 'utils/intl';
import { getCurrentOrganizationId, tableScrollWidth } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import FilterForm from './FilterForm';

/**
 * 使用 Form.Item 组件
 */
const modelPrompt = 'tarzan.badCode.defectGroup.model.defectGroup';

@connect(({ defectGroup, loading }) => ({
  defectGroup,
  currentTenantId: getCurrentOrganizationId(),
  loading: loading.effects['defectGroup/fetchDefectCodeList'],
}))
@formatterCollections({ code: ['tarzan.badCode.defectGroup', 'tarzan.common'] })
@Form.create({ fieldNameProp: null })
export default class DefectCodeList extends React.Component {
  state = {
    search: {},
  };

  componentDidMount() {
    // const { location, history } = this.props;
    // const { state: locationState = {} } = location;
    // if (verifyObjectHasValue(locationState)) {
    //   this.queryForm.props.form.setFieldsValue(locationState);
    //   this.queryForm.setState({ typeDesc: locationState.typeDesc });
    //   this.queryForm.fetchQueryList();
    //   history.location.state = {};
    // } else {
    //   this.refresh();
    // }
    this.refresh();
  }

  @Bind()
  refresh = (pagination = {}) => {
    const { dispatch } = this.props;
    const { search } = this.state;
    dispatch({
      type: 'defectGroup/fetchDefectCodeList',
      payload: {
        ...search,
        ...this.queryForm.props.form.getFieldsValue(),
        page: pagination,
      },
    });
  };

  @Bind()
  onSearch = fielsValue => {
    this.setState(
      {
        search: fielsValue,
      },
      () => {
        this.refresh();
      }
    );
  };

  @Bind()
  resetSearch = () => {
    this.setState({
      search: {},
    });
  };

  @Bind()
  handleBindQueryRef(ref = {}) {
    this.queryForm = ref;
  }

  /**
   * 页面跳转到工作单元明细维护页面
   * @param {object} record 行数据
   */
  @Bind()
  showWorkcellDist(record = {}) {
    const { history, dispatch } = this.props;
    dispatch({
      type: 'defectGroup/updateState',
      payload: {
        defectCodeItem: record,
      },
    });
    history.push({
      pathname: `/hmes/badcode/defect-group/dist/${record.ncGroupId}`,
      state: {
        ...this.queryForm.props.form.getFieldsValue(),
        typeDesc: this.queryForm.state.typeDesc,
      },
    });
  }

  /**
   *新建工作单元页面
   * @param {object} record 行数据
   */
  @Bind()
  createWorkcell() {
    const { history, dispatch } = this.props;
    history.push(`/hmes/badcode/defect-group/dist/create`);
    dispatch({
      type: 'defectGroup/updateState',
      payload: {
        defectCodeItem: {},
      },
    });
  }

  /**
   * 渲染方法
   * @returns
   */
  render() {
    const {
      defectGroup: { defectCodeList = [], defectCodePagination = {} },
      loading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.ncGroupCode`).d('不良代码组编码'),
        dataIndex: 'ncGroupCode',
        width: 200,
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                this.showWorkcellDist(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.ncGroupDesc`).d('不良代码组描述'),
        width: 300,
        dataIndex: 'description',
      },
      {
        title: intl.get(`${modelPrompt}.siteCode`).d('站点编码'),
        dataIndex: 'siteCode',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.siteName`).d('站点描述'),
        dataIndex: 'siteName',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.priority`).d('优先级'),
        dataIndex: 'priority',
        width: 150,
      },
      {
        title: intl.get(`${modelPrompt}.maxNcLimit`).d('最大限制值'),
        dataIndex: 'maxNcLimit',
        width: 100,
      },
      {
        title: intl.get('tarzan.common.label.enableFlag').d('启用状态'),
        dataIndex: 'enableFlag',
        width: 100,
        align: 'center',
        render: (val, record) =>
          (record.enableFlag === 'Y' || record.enableFlag === 'N') && (
            <Badge
              status={record.enableFlag === 'Y' ? 'success' : 'error'}
              text={
                record.enableFlag === 'Y'
                  ? intl.get('tarzan.common.label.enable').d('启用')
                  : intl.get('tarzan.common.label.disable').d('禁用')
              }
            />
          ),
      },
    ];

    return (
      <React.Fragment>
        <Header title={intl.get('tarzan.badCode.defectGroup.title.defectGroup').d('不良代码组维护')}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => {
              this.createWorkcell();
            }}
          >
            {intl.get('tarzan.common.button.create').d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onSearch={this.onSearch} resetSearch={this.resetSearch} onRefs={this.handleBindQueryRef} />
          <Table
            loading={loading}
            rowKey="ncGroupId"
            dataSource={defectCodeList}
            columns={columns}
            scroll={{ x: tableScrollWidth(columns) }}
            pagination={defectCodePagination || {}}
            onChange={this.refresh}
            bordered
          />
        </Content>
      </React.Fragment>
    );
  }
}
