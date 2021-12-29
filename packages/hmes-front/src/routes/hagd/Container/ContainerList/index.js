/**
 * containerType - 容器类型维护
 * @date 2019-12-4
 * @author xubiting <biting.xu@hand-china.com>
 * @version 0.0.1
 * @copyright Copyright (c) 2019, Hand
 */
import React, { Component, Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Button, Table, Badge } from 'hzero-ui';
import { connect } from 'dva';
import formatterCollections from 'utils/intl/formatterCollections';
import intl from 'utils/intl';
import FilterForm from './FilterForm';

const modelPrompt = 'tarzan.hagd.containerType.model';

@connect(({ containerType, loading }) => ({
  containerType,
  fetchLoading: loading.effects['containerType/fetchContainerList'],
}))
@formatterCollections({ code: 'tarzan.hagd.containerType.model' })
export default class ContainerList extends Component {
  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'containerType/fetchSelectList',
      payload: {
        module: 'MATERIAL_LOT',
        typeGroup: 'PACKING_LEVEL',
        type: 'packingLevel',
      },
    });

    this.fetchList();
  };

  filterForm = (ref = {}) => {
    this.filterForm = (ref.props || {}).form;
  };

  fetchList = (pagination = {}) => {
    const { dispatch } = this.props;

    // 获取设置
    if (this.filterForm) {
      this.filterForm.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'containerType/fetchContainerList',
            payload: {
              ...values,
              page: pagination,
            },
          });
        }
      });
    }
  };

  handleFormReset = () => {
    // 重置查询
  };

  createPage = record => {
    // 打开新得页面
    const { history } = this.props;
    const id = record ? record.containerTypeId : 'create';
    history.push(`/hmes/hagd/container-type/type/${id}`);
  };

  render() {
    const {
      containerType: { packingLevel = [], containerList = [], containerPage = [] },
      fetchLoading,
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.containerTypeCode`).d('容器类型的编码'),
        width: 100,
        dataIndex: 'containerTypeCode',
        render: (val, record) => (
          <span className="action-link">
            <a
              onClick={() => {
                // 打开新页面
                this.createPage(record);
              }}
            >
              {val}
            </a>
          </span>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.containerTypeDescription`).d('容器类型的描述'),
        width: 200,
        dataIndex: 'containerTypeDescription',
      },
      {
        title: intl.get(`${modelPrompt}.enableFlag`).d('启用状态'),
        width: 90,
        dataIndex: 'enableFlag',
        align: 'center',
        render: val => (
          <Badge status={val === 'Y' ? 'success' : 'error'} text={val === 'Y' ? '启用' : '禁用'} />
        ),
      },
      {
        title: intl.get(`${modelPrompt}.packingLevel`).d('包装等级'),
        width: 100,
        dataIndex: 'packingLevel',
        render: val => (packingLevel.filter(pack => pack.typeCode === val)[0] || {}).description,
      },
      {
        title: intl.get(`${modelPrompt}.capacityQty`).d('最大数量'),
        width: 100,
        dataIndex: 'capacityQty',
      },
      {
        title: intl.get(`${modelPrompt}.maxLoadWeight`).d('最大承重'),
        width: 110,
        dataIndex: 'maxLoadWeight',
      },
      {
        title: intl.get(`${modelPrompt}.weightUomName`).d('重量单位'),
        width: 100,
        dataIndex: 'weightUomName',
      },
    ];

    const queryFormProps = {
      onSearch: this.fetchList,
      handleFormReset: this.handleFormReset,
    };

    return (
      <Fragment>
        <Header title={intl.get(`${modelPrompt}.containerTypeMaintain`).d('容器类型维护')}>
          <Button icon="plus" type="primary" onClick={() => this.createPage()}>
            {intl.get(`${modelPrompt}.create`).d('新建')}
          </Button>
        </Header>
        <Content>
          <FilterForm onRef={this.filterForm} {...queryFormProps} />
          <Table
            loading={fetchLoading}
            rowKey="containerTypeId"
            dataSource={containerList}
            pagination={containerPage}
            columns={columns}
            onChange={this.fetchList}
            bordered
          />
        </Content>
      </Fragment>
    );
  }
}
