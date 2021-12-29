import React, { Component, Fragment } from 'react';
import { Table, Checkbox, Input, Icon, Button, Row, Col, Form, Tooltip } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import { isEmpty } from 'lodash';
import classNames from 'classnames';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';

import ReturnMaterialModal from '../../Component/ReturnMaterialModal';
import styles from '../../Component/index.less';

const modelPrompt = 'tarzan.workshop.execute.model.execute';


export default class MaterialInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredInfo: {},
    };
  }

  @Bind()
  handleScanBarcode(e) {
    const { onScanBarcode } = this.props;
    if(onScanBarcode) {
      onScanBarcode(e.target.value);
    }
  }

  @Bind()
  handleCheckMaterialBox(checked, materialTypes) {
    const { onCheckMaterialBox } = this.props;
    if(onCheckMaterialBox) {
      onCheckMaterialBox(checked, materialTypes);
    }
  }

  @Bind()
  handleFeedMaterialItem() {
    const { onFeedMaterialList } = this.props;
    if(onFeedMaterialList) {
      onFeedMaterialList();
    }
  }

  @Bind()
  handleRefreshMaterialItemList() {
    const { onRefreshMaterialItemList } = this.props;
    if(onRefreshMaterialItemList) {
      onRefreshMaterialItemList();
    }
  }

  @Bind()
  renderColor(record) {
    const { dataSource } = this.props;
    let materialCodeClassName = '';
    let selectedCountClassName = '';
    let timingClassName = '';
    const componentMaterial = dataSource.find(e => record.componentMaterialId === e.materialId);
    const componentMaterialList = dataSource.filter(e => record.componentMaterialId === e.componentMaterialId);
    if(record.isSubstitute === 'Y') {
      materialCodeClassName = styles['material-list-line-yellow'];
    }
    // 替代组中， 若存在一个物料的勾选总量大于主料的将投量 替代组所有物料显示白色， 若所有的物料的勾选总量大于主料的将投量，替代组主料显示共色
    if((componentMaterialList.every(e => (e.selectedSnQty || 0) < componentMaterial.willReleaseQty) && record.materialId === componentMaterial.materialId && record.lineNumber === componentMaterial.lineNumber)) {
      selectedCountClassName = styles['material-list-line-red'];
    }
    if(record.timing === '00:00:00') {
      timingClassName = styles['material-list-line-timing'];
    }
    return classNames(materialCodeClassName, selectedCountClassName, timingClassName);
  };

  @Bind()
  handleExpand(expand, record) {
    const { onUpdateExpandedRowKeys } = this.props;
    if(onUpdateExpandedRowKeys) {
      onUpdateExpandedRowKeys(expand, record);
    }
  }

  //  设置filters数据
  @Bind()
  filterTransForm(filters = [], type) {
    const transFilter = [];
    filters.forEach(filter => {
      transFilter.push({
        text: filter.description,
        value: filter[type],
      });
    });

    return transFilter;
  };

  @Bind()
  getColumnSearchProps(type) {
    const { filteredInfo = {} } = this.state;

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }} className={styles.dropDown}>
          <Input
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      filteredValue: filteredInfo[type] || null,
    };
  };


  @Bind()
  handleFetchFeedingRecord(type) {
    const { onFetchFeedingRecord } = this.props;
    if(onFetchFeedingRecord) {
      onFetchFeedingRecord(type);
    }
  }


  /**
   * render
   * @returns React.element
   */
  render() {
    const {
      dataSource,
      baseInfo = {},
      rowSelection = {},
      barCodeRowSelection = {},
      materialSelectedRows,
      loading,
      expandedRowKeys = [],
      selectedRows,
      onReturnMaterial,
      returnLoading,
      returnMaterialLoading,
      onClearFeedingRecordList,
      feedingRecordList,
      modelName,
      workCellInfo = {},
    } = this.props;
    const returnMaterialModalProps = {
      selectedRows,
      modelName,
      returnLoading,
      returnMaterialLoading,
      onClearFeedingRecordList,
      operationId: isEmpty(workCellInfo) ? null : workCellInfo.operationIdList[0],
      onReturnMaterial,
      dataSource: feedingRecordList,
      onSearch: this.handleFetchFeedingRecord,
    };
    const newDataSource = dataSource.filter(e => e.virtualComponentFlag !== 'X');

    const expandedRowRender = record => {
      const columns = [
        {
          title: intl.get(`${modelPrompt}.lineNumber`).d('序号'),
          dataIndex: 'lineNumber',
          width: 30,
          render: (val, data, index) => index + 1,
        },
        {
          title: intl.get(`${modelPrompt}.substituteGroup`).d('条码'),
          dataIndex: 'materialLotCode',
          width: 80,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substitutePolicyDesc`).d('数量'),
          dataIndex: 'primaryUomQty',
          width: 30,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substitutePolicyDesc`).d('供应商批次'),
          dataIndex: 'supplierLot',
          width: 70,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.substitutePolicyDesc`).d('批次'),
          dataIndex: 'lot',
          width: 70,
          align: 'left',
        },
        {
          title: intl.get(`${modelPrompt}.materialCode`).d('倒计时'),
          dataIndex: 'timing',
          width: 70,
          align: 'left',
        },
      ];
      return (
        <Table
          columns={columns}
          rowKey={data => `${data.jobMaterialId}#${data.productionType}`}
          dataSource={record.materialLotList}
          rowSelection={barCodeRowSelection}
          pagination={false}
        />
      );
    };

    const columns = [
      {
        title: intl.get(`${modelPrompt}.lineNumber`).d('行'),
        dataIndex: 'lineNumber',
        width: 30,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.bomComponentCode`).d('类型'),
        width: 40,
        align: 'left',
        dataIndex: 'productionType',
        // ...this.getColumnSearchProps('bomComponentCode'),
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料'),
        width: 70,
        dataIndex: 'materialCode',
        className: styles['material-list-line-material-code'],
      },
      {
        title: intl.get(`${modelPrompt}.materialCode`).d('物料描述'),
        width: 90,
        dataIndex: 'materialName',
        render: (val) => (
          <Tooltip title={val}>
            {val}
          </Tooltip>
        ),
      },
      {
        title: intl.get(`${modelPrompt}.uomCode`).d('单位'),
        width: 40,
        align: 'left',
        dataIndex: 'uomCode',
      },
      {
        title: intl.get(`${modelPrompt}.materialVersion`).d('版本'),
        dataIndex: 'materialVersion',
        width: 60,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.substituteGroup`).d('替代组'),
        dataIndex: 'substituteGroup',
        width: 50,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.qty`).d('单位量'),
        dataIndex: 'qty',
        width: 50,
      },
      {
        title: intl.get(`${modelPrompt}.requirementQty`).d('需求量'),
        dataIndex: 'requirementQty',
        width: 50,
        align: 'left',
      },
      {
        title: intl.get(`${modelPrompt}.willReleaseQty`).d('将投量'),
        dataIndex: 'willReleaseQty',
        width: 50,
      },
      {
        title: intl.get(`${modelPrompt}.releasedQty`).d('已投量'),
        dataIndex: 'releasedQty',
        width: 50,
      },
      {
        title: intl.get(`${modelPrompt}.selectedSnCount`).d('勾选总量/条数'),
        dataIndex: 'selectedSnCount',
        width: 80,
        render: (val, record) => `${record.selectedSnQty || 0}/${record.selectedSnCount || 0}`,
        className: styles['material-list-line-selected-count'],
      },
      {
        title: intl.get(`${modelPrompt}.stepDesc`).d('倒计时'),
        dataIndex: 'timing',
        width: 100,
        className: styles['material-list-line-timing-red'],
      },
    ];
    return (
      <Fragment>
        <Row style={{ width: '100%' }}>
          <Col span={8}>
            <div className={styles['operationPlatform_material-info-input']}>
              <Form.Item label="条码扫描" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                <Input
                  className="operation-platform-material-barcode"
                  onPressEnter={this.handleScanBarcode}
                  disabled={!baseInfo.siteOutDate && baseInfo.siteInDate && ['singleOperationPlatform'].includes(this.modelName)}
                />
              </Form.Item>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles['operationPlatform_material-info-checkbox']}>
              <Checkbox
                style={{ marginLeft: '12px'}}
                disabled={dataSource.filter(e => ['SN'].includes(e.productionType) && !isEmpty(e.materialLotList)).length === 0 || selectedRows.length > 1}
                indeterminate={materialSelectedRows.filter(e => ['SN'].includes(e.productionType)).length > 0 && dataSource.filter(e => ['SN'].includes(e.productionType)).length !== materialSelectedRows.filter(e => ['SN'].includes(e.productionType)).length}
                onChange={(e) => this.handleCheckMaterialBox(e.target.checked, ['SN'])}
                checked={materialSelectedRows.filter(e => ['SN'].includes(e.productionType)).length > 0 && dataSource.filter(e => ['SN'].includes(e.productionType)).length === materialSelectedRows.filter(e => ['SN'].includes(e.productionType)).length}
              >
                序列号全选
              </Checkbox>
            </div>
          </Col>
          <Col span={4}>
            <div className={styles['operationPlatform_material-info-checkbox']}>
              <Checkbox
                indeterminate={materialSelectedRows.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length > 0 && dataSource.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length !== materialSelectedRows.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length}
                onChange={(e) => this.handleCheckMaterialBox(e.target.checked, ['TIME', 'LOT'])}
                checked={materialSelectedRows.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length > 0 && dataSource.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length === materialSelectedRows.filter(e => ['TIME', 'LOT'].includes(e.productionType)).length}
              >
                批次/时效物料全选
              </Checkbox>
            </div>
          </Col>
          <Col span={8}>
            <Button
              // disabled={!(selectedRows.length > 0 && baseInfo.snNum) || baseInfo.siteOutDate}
              type="primary"
              loading={loading}
              style={{ marginLeft: '10px', marginRight: '8px'}}
              onClick={() => this.handleFeedMaterialItem()}
            >
              投料
            </Button>
            <ReturnMaterialModal {...returnMaterialModalProps} />
            <Button
              type="default"
              onClick={() => this.handleRefreshMaterialItemList()}
              disabled={!baseInfo.siteInDate}
              style={{ marginLeft: '8px' }}
            >
              刷新投料
            </Button>
          </Col>
        </Row>
        <div className={classNames(styles['head-table'], styles['material-list-line'])}>
          <Table
            columns={columns}
            expandedRowRender={expandedRowRender}
            dataSource={newDataSource}
            pagination={false}
            rowKey={record => `${record.materialId}#${record.lineNumber}`}
            bordered
            rowClassName={this.renderColor}
            rowSelection={rowSelection}
            loading={loading}
            scroll={{ x: tableScrollWidth(columns), y: 300 }}
            expandedRowKeys={expandedRowKeys}
            onExpand={this.handleExpand}
          />
        </div>

      </Fragment>

    );
  }
}
