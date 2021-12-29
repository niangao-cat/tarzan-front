/*
 * @Description: 两周内物料需求
 * @version: 0.1.0
 * @Author: quanhe.zhao@hand-china.com
 * @Date: 2020-03-25 14:28:00
 * @LastEditorts: quanhe.zhao@hand-china.com
 * @LastEditTime: 2020-10-22 10:34:00
 * @Copyright: Copyright (c) 2019 Hand
 */

import React, { Component } from 'react';
import { Table, Row, Col, Form, DatePicker } from 'hzero-ui';
import secondTitleImg from '@/assets/JXblue.png';
import { tableScrollWidth } from 'utils/utils';
import moment from 'moment';
import styles from '../index.less';

const infoLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create({ fieldNameProp: null })
export default class MaterialRequirements extends Component {
  constructor(props) {
    super(props);
    const { onRef } = props;
    if (onRef) onRef(this);
    this.state = {};
  }

  render() {
    const columns = [
      {
        title: '物料编码',
        dataIndex: 'materialCode',
        width: 80,
        align: 'center',
      },
      {
        title: '物料版本',
        dataIndex: 'materialVersion',
        width: 80,
        align: 'center',
      },
      {
        title: '工段编码',
        dataIndex: 'workcellCode',
        width: 80,
        align: 'center',
      },
      {
        title: '工段描述',
        dataIndex: 'workcellName',
        width: 80,
        align: 'center',
      },
      {
        title: '损耗率',
        dataIndex: 'attritionChance',
        width: 60,
        align: 'center',
      },
      {
        title: '物料名称',
        dataIndex: 'materialName',
        width: 80,
        align: 'center',
      },
      {
        title: '单位',
        dataIndex: 'uomCode',
        width: 60,
        align: 'center',
      },
    ];
    const Lastcolumns = [
      {
        title: '汇总需求',
        dataIndex: 'requirementQty',
        width: 80,
        align: 'center',
      },
      {
        title: '汇总损耗数量',
        dataIndex: 'attritionQty',
        width: 90,
        align: 'center',
      },
    ];
    const { fetchComponentMeaterial, form, dataSource, pagination, loading, dynamicColumns } = this.props;
    const { getFieldDecorator } = form;
    const newColumns = columns.concat(dynamicColumns).concat(Lastcolumns);
    return (
      <div className={styles['material-requirements-form']}>
        <Row>
          <Col style={{ fontSize: '14px' }}>
            <img src={secondTitleImg} alt="" style={{ marginRight: '5px' }} />
            已派工组件物料需求表
          </Col>
        </Row>
        <Form layout="inline">
          <Form.Item label="时间" {...infoLayout}>
            {getFieldDecorator('startDate', {
              initialValue: moment().format("YYYY-MM-DD HH:mm:ss") && moment(moment().format("YYYY-MM-DD HH:mm:ss")),
            })(
              <DatePicker
                placeholder=""
                style={{ width: '100%' }}
              />
            )}
          </Form.Item>
          {/* <Form.Item>
            <Button
              data-code="search"
              type="primary"
              icon="search"
              onClick={() => fetchComponentMeaterial()}
            >
              查询
            </Button>
          </Form.Item> */}
        </Form>
        <Table
          loading={loading}
          dataSource={dataSource}
          style={{ marginTop: '10px' }}
          columns={newColumns}
          scroll={{ x: tableScrollWidth(columns) }}
          pagination={pagination}
          rowKey="materialId"
          bordered
          onChange={page => fetchComponentMeaterial(page)}
        />
      </div>
    );
  }
}
