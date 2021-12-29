/*
 * @Description: 员工出勤报表-行表
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-04-01 09:34:27
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-04-01 15:16:46
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Table, Input, Icon, Button, Form } from 'hzero-ui';
import { tableScrollWidth } from 'utils/utils';
import intl from 'utils/intl';
import { Bind } from 'lodash-decorators';
import styles from './index.less';
@Form.create({ fieldNameProp: null })
export default class LineTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {},
    };
  }

  @Bind()
  handleSearch(fields = {}) {
    const { pagination, onSearch } = this.props;
    if(onSearch) {
      onSearch(pagination, fields);
    }
  }

  @Bind()
  handleReset() {
    this.state.fields.workcellName = "";
    const { onSearch, form } = this.props;
    if(onSearch) {
      onSearch({}, this.state.fields);
    }
    form.resetFields();
  }

  getColumnSearchProps(dataIndex) {
    const { form: { getFieldDecorator, getFieldValue } } = this.props;
    return {
      filterDropdown: ({ selectedKeys }) => (
        <div
          style={{ padding: 8 }}
          className={styles.dropDown}
        >
          {(
            <Form.Item>
              {getFieldDecorator(dataIndex)(
                <Input
                  ref={node => {
                    this.searchInput = node;
                  }}
                  value={selectedKeys[0]}
                  onPressEnter={e => {
                    this.setState({
                      fields: {
                        ...this.state.fields,
                        [dataIndex]: e.target.value,
                      },
                    });
                    this.handleSearch({ [dataIndex]: e.target.value, ...this.state.fields });
                  }}
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
              )}
            </Form.Item>
          )}
          <Button
            type="primary"
            onClick={() => {
              const fieldValue = getFieldValue(dataIndex);
                this.setState({
                  fields: {
                    ...this.state.fields,
                    [dataIndex]: fieldValue,
                  },
                });
                setTimeout(() => {
                  this.handleSearch({ [dataIndex]: fieldValue, ...this.state.fields });
                }, 10);
            }}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
          <Button
            onClick={() => this.handleReset()}
            size="small"
            style={{ width: 90 }}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => this.searchInput.focus());
        }
      },
    };
  }

  render() {
    const { dataSource, onSearch, pagination, loading } = this.props;
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        width: 60,
        align: 'center',
        render: (val, record, index) => index + 1,
      },
      {
        title: '工序',
        dataIndex: 'workName',
        width: 100,
        align: 'center',
      },
      {
        title: '工位',
        dataIndex: 'workcell',
        width: 100,
        align: 'center',
        ...this.getColumnSearchProps('workcellName'),
      },
      {
        title: '员工',
        dataIndex: 'employName',
        width: 100,
        align: 'center',
      },
      {
        title: '工号',
        dataIndex: 'employeeNum',
        width: 70,
        align: 'center',
      },
      {
        title: '产量',
        dataIndex: 'makeNum',
        width: 80,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onMakeNumDetail(record, "makeNum")}>{val}</a>);
        },
      },
      {
        title: '在制',
        dataIndex: 'inMakeNum',
        width: 80,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onMakeNumDetail(record, "inMakeNum")}>{val}</a>);
        },
      },
      {
        title: '不良数',
        dataIndex: 'defectsNumb',
        width: 80,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onDefectsNumbDetail(record)}>{val}</a>);
        },
      },
      {
        title: '返修数量',
        dataIndex: 'repairNum',
        width: 100,
        align: 'center',
        render: (val, record) => {
          return (<a onClick={() => this.props.onRepairNumDetail(record)}>{val}</a>);
        },
      },
      {
        title: '一次合格率',
        dataIndex: 'firstPassRate',
        width: 100,
        align: 'center',
      },
      {
        title: '生产效率',
        dataIndex: 'productionEfficiency',
        width: 100,
        align: 'center',
      },
      {
        title: '上岗时间',
        dataIndex: 'startOperationDate',
        width: 100,
        align: 'center',
      },
      {
        title: '偏差',
        dataIndex: 'shiftStartTime',
        width: 100,
        align: 'center',
        render: text => {
          return <span style={{ color: '#40BAB5' }}>-{text}</span>;
        },
      },
      {
        title: '下岗时间',
        dataIndex: 'endOperationDate',
        width: 100,
        align: 'center',
      },
      {
        title: '偏差',
        dataIndex: 'shiftEndTime',
        width: 100,
        align: 'center',
        render: text => {
          return <span style={{ color: '#E86A6A' }}>+{text}</span>;
        },
      },
      {
        title: '总时长',
        dataIndex: 'countDate',
        width: 80,
        align: 'center',
        render: text => {
          return <span>{text}h</span>;
        },
      },
      {
        title: '能力等级',
        dataIndex: 'powerNum',
        width: 90,
        align: 'center',
        render: text => {
          if (text === '新手') {
            return <span style={{ color: '#EF9E1D' }}>{text}</span>;
          } else {
            return <span>{text}</span>;
          }
        },
      },
      {
        title: '技能要求',
        dataIndex: 'skillDescription',
        width: 90,
        align: 'center',
      },
      {
        title: '工位类型',
        dataIndex: 'workStationType',
        width: 90,
        align: 'center',
      },
    ];
    return (
      <Table
        // loading={loading}
        dataSource={dataSource}
        style={{ marginTop: '20px' }}
        columns={columns}
        scroll={{ x: tableScrollWidth(columns) }}
        bordered
        pagination={pagination}
        onChange={page => onSearch(page, this.state.fields)}
        loading={loading}
      />
    );
  }
}
