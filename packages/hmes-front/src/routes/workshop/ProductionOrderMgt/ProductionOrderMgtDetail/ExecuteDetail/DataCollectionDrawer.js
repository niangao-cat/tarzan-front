import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button } from 'hzero-ui';
import intl from 'utils/intl';
import { createPagination } from 'utils/utils';
import ExpandCard from '@/components/ExpandCard';

const modelPrompt = 'tarzan.workshop.execute.model.execute';

/**
 * 扩展属性表格抽屉展示
 * @extends {PureComponent} - React.PureComponent
 * @reactProps {String} anchor - 模态框弹出方向
 * @return React.element
 */
@connect(({ execute, loading }) => ({
  execute,
  loading: loading.effects['execute/fetchDataCollectionList'],
}))
export default class DataCollectionDrawer extends PureComponent {
  componentDidMount() {
    this.onSearch();
  }

  onSearch = () => {
    const { dispatch, initData = {} } = this.props;
    const { eoStepActualId } = initData;
    dispatch({
      type: 'execute/fetchTagGroupList',
      payload: {
        eoStepActualId,
      },
    });
  };

  // 点展开查询
  onExpand = (tagGroupId, index) => {
    const {
      dispatch,
      initData = {},
      execute: { tagGroupList = [] },
    } = this.props;
    const { eoStepActualId } = initData;
    dispatch({
      type: 'execute/fetchDataCollectionList',
      payload: {
        eoStepActualId,
        tagGroupId,
      },
    }).then(res => {
      if (res && res.success) {
        tagGroupList[index].dataCollectionList = res.rows.content;
        tagGroupList[index].dataCollectionPagination = createPagination(res.rows);
        dispatch({
          type: 'execute/updateState',
          payload: {
            tagGroupList,
          },
        });
      }
    });
  };

  // 分页查询
  fetchDataCollectionList = (index, tagGroupId, pagination = {}) => {
    const {
      dispatch,
      initData = {},
      execute: { tagGroupList = [] },
    } = this.props;
    const { eoStepActualId } = initData;
    dispatch({
      type: 'execute/fetchDataCollectionList',
      payload: {
        eoStepActualId,
        tagGroupId,
        page: {
          ...pagination,
        },
      },
    }).then(res => {
      if (res && res.success) {
        tagGroupList[index].dataCollectionList = res.rows.content;
        tagGroupList[index].dataCollectionPagination = createPagination(res.rows);
        dispatch({
          type: 'execute/updateState',
          payload: {
            tagGroupList,
          },
        });
      }
    });
  };

  render() {
    const {
      visible,
      onCancel,
      loading,
      execute: { tagGroupList = [] },
    } = this.props;
    const columns = [
      {
        title: intl.get(`${modelPrompt}.tagCode`).d('数据项编码'),
        dataIndex: 'tagCode',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.tagDescription`).d('数据项描述'),
        dataIndex: 'tagDescription',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.collectionMethod`).d('数据收集方式'),
        dataIndex: 'collectionMethod',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.tagValue`).d('收集值'),
        dataIndex: 'tagValue',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.tagCalculateResult`).d('判定结果'),
        dataIndex: 'tagCalculateResult',
        width: 100,
      },
      {
        title: intl.get(`${modelPrompt}.userName`).d('记录人'),
        dataIndex: 'userName',
        width: 100,
      },
    ];
    return (
      <Modal
        destroyOnClose
        width={720}
        title={intl.get('tarzan.workshop.execute.title.dataCollection').d('数据收集组')}
        visible={visible}
        onCancel={onCancel}
        onOk={onCancel}
        wrapClassName="ant-modal-sidebar-right"
        transitionName="move-right"
        footer={[
          <Button onClick={onCancel}>
            {intl.get('tarzan.workshop.execute.button.return').d('返回')}
          </Button>,
        ]}
      >
        {tagGroupList.length > 0 &&
          tagGroupList.map((item, index) => {
            return (
              <ExpandCard
                title={item.tagGroupDescription}
                expandForm={false}
                onExpand={
                  item.dataCollectionList ? undefined : () => this.onExpand(item.tagGroupId, index)
                }
              >
                <Table
                  bordered
                  dataSource={item.dataCollectionList}
                  columns={columns}
                  pagination={item.dataCollectionPagination}
                  onChange={this.fetchDataCollectionList.bind(this, index, item.tagGroupId)}
                  rowKey="tagId"
                  loading={loading}
                />
              </ExpandCard>
            );
          })}
      </Modal>
    );
  }
}
