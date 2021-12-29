/*
 * @Description: 炉内信息-table形式
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-11-13 09:52:56
 * @LastEditTime: 2021-02-23 17:28:25
 */

import React, { Component } from 'react';
import { Form, Table, Icon, Input, Button } from 'hzero-ui';
import { Bind } from 'lodash-decorators';
import intl from 'utils/intl';
import styles from '../index.less';

@Form.create({ fieldNameProp: null })
export default class FurnaceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: {},
      // eslint-disable-next-line react/no-unused-state
      key: props.key, // 用来控制子组件刷新的
    };
  }

  // 卸载组件取消倒计时
  componentWillUnmount() {
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      key: '', // 用来控制子组件刷新的
    });
  }

  /**
   * @description: 计算时间差
   * @param {String} stime 开始时间-对应入炉时间
   * @param {String} etime 结束时间-对应当前时间
   * @return: minutes
   */
  @Bind()
  getMinutesDiff(stime, etime) {
    const st = new Date(stime).getTime();
    const et = new Date(etime).getTime();
    const minutes = (et - st) / (60 * 1000); // 两个时间戳相差的分钟数
    return minutes;
  }

  // 倒计时
  @Bind
  countFun(end, record) {
    const nowTime = Date.parse(new Date());
    let remaining = end - nowTime;
    if (remaining > 1000) {
      remaining -= 1000;
      const hour = Math.floor((remaining / 1000 / 3600) % 24);
      const minute = Math.floor((remaining / 1000 / 60) % 60);
      const second = Math.floor(remaining / 1000 % 60);
      // 判断剩余时间是否低于20分钟
      if (hour === 0 && minute <= 20) {
        return (
          <span style={{
            fontSize: '16px',
            fontWeight: 800,
            color: 'rgba(255, 189, 46, 1)',
            lineHeight: '25px',
          }}
          >
            {hour < 10 ? `0${hour}` : hour}:{minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}
          </span>
        );
      } else {
        return (
          <span style={{
            fontSize: '16px',
            fontWeight: 800,
            color: '#31B2FD',
            lineHeight: '25px',
          }}
          >
            {hour < 10 ? `0${hour}` : hour}:{minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}
          </span>
        );
      }
    } else {
      return this.getTime(record.siteInDate, record.standardReqdTimeInProcess);
    }
  }

  /**
   * @description: 正计时
   * @param {String} inFurnaceTime 入炉时间
   * @param {String} standardTime 标准时长
   * @return: null
   */
  @Bind
  getTime(inFurnaceTime, standardReqdTimeInProcess) {
    const nowTime = Date.parse(new Date());
    const inTime = new Date(inFurnaceTime).getTime();
    let remaining = nowTime - (inTime + (standardReqdTimeInProcess * 60 * 1000));
    remaining += 1000;
    const hour = Math.floor((remaining / 1000 / 3600));
    const minute = Math.floor(((remaining - (hour * 60 * 60 * 1000)) / 1000 / 60) % 60);
    const second = Math.floor((remaining - (minute * 60 * 1000)) / 1000 % 60);
    return (
      <span style={{
        fontSize: '16px',
        fontWeight: 800,
        color: '#fe5b5b',
        lineHeight: '25px',
      }}
      >
        + {hour < 10 ? `0${hour}` : hour}:{minute < 10 ? `0${minute}` : minute}:{second < 10 ? `0${second}` : second}
      </span>
    );
  }

  @Bind()
  handleClickSelectedRows(record) {
    const { scanningOutFurnaceCode } = this.props;
    return {
      onClick: () => {
        this.setState({ selectedRows: record });
        scanningOutFurnaceCode({ snNum: record.materialLotCode }, record);
      },
    };
  }

  @Bind()
  handleClickRow(record) {
    const { selectedRows } = this.state;
    if (selectedRows.materialLotCode === record.materialLotCode) {
      return styles['time-management-data-click'];
    } else {
      return '';
    }
  }

  @Bind
  renderTime(record) {
    const res = this.getMinutesDiff(record.siteInDate, Date.parse(new Date()));
    if (res > record.standardReqdTimeInProcess) {
      // 当前时间超过标准时常
      return this.getTime(record.siteInDate, record.standardReqdTimeInProcess);
    } else {
      const inTime = new Date(record.siteInDate).getTime();
      const end = inTime + (record.standardReqdTimeInProcess * 60000);
      return this.countFun(end, record);
    }
  }

  handleReset = clearFilters => () => {
    clearFilters();
    // const { onSearch } = this.props;
    // onSearch();
  }

  getColumnSearchProps = type => {
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
          <Button onClick={this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        </div>
      ),
      filterIcon: filtered => {
        return <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined, fontWeight: filtered ? 'bold' : 'unset' }} />;
      },
      filteredValue: filteredInfo[type] || [],
    };
  }

  onSearch = (pagination, filtersArg) => {
    this.setState({
      filteredInfo: filtersArg,
    });
    const { onSearch } = this.props;
    onSearch(pagination, filtersArg);
  }

  render() {
    const columns = [
      {
        title: '序号',
        dataIndex: 'number',
        width: 30,
        render: (val, record, index) => index + 1,
        align: 'center',
      },
      {
        title: '时长',
        dataIndex: 'time',
        width: 80,
        render: (val, record) => (
          this.renderTime(record)
        ),
      },
      {
        title: '条码',
        dataIndex: 'materialLotCode',
        width: 90,
        render: (val, record) => {
          if (record.reworkFlag === 'Y') {
            return <span style={{ color: 'rgb(254, 91, 91)' }}>{val}</span>;
          } else {
            return <span>{val}</span>;
          }
        },
        ...this.getColumnSearchProps('materialLotCode'),
      },
      {
        title: '物料',
        dataIndex: 'materialName',
        width: 100,
        ...this.getColumnSearchProps('materialName'),
      },
      {
        title: '数量',
        dataIndex: 'sumEoQty',
        width: 40,
        align: 'center',
      },
      {
        title: '进炉时间',
        dataIndex: 'siteInDate',
        width: 90,
      },
      {
        title: '进炉操作',
        dataIndex: 'siteInByName',
        width: 50,
      },
    ];
    const {
      loading,
      dataSource,
      pagination,
    } = this.props;
    return (
      <Table
        loading={loading}
        rowKey="materialLotCode"
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        bordered
        onRow={this.handleClickSelectedRows}
        rowClassName={this.handleClickRow}
        onChange={this.onSearch}
      // scroll={{ y: '60vh' }}
      />
    );
  }
}
