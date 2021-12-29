/*
 * @Description: 查询
 * @Version: 0.0.1
 * @Autor: quanhe.zhao@hand-china.com
 * @Date: 2020-08-03 17:14:53
 * @LastEditTime: 2020-08-04 10:27:34
 */
import React from 'react';
import { Form, TextField, Lov } from 'choerodon-ui/pro';

export default class QueryModal extends React.Component {
  render() {
    const { dataSet } = this.props;
    return (
      <div className="vim-query-modal">
        <Form columns={3} style={{ paddingTop: 10, paddingRight: 30 }} dataSet={dataSet}>
          <Lov colSpan={1} name="site" />
          <Lov colSpan={1} name="productLine" label="产线" />
          <Lov colSpan={1} name="material" label="组件物料" />
          <TextField colSpan={1} name="b" label="主键物料" />
          <Lov colSpan={1} name="locator" label="仓库" />
          <TextField colSpan={1} name="psbc" label="配送班次" />
          <Lov colSpan={1} name="lineId" label="工段" />
          <TextField colSpan={1} name="pscl" label="配送策略" />
          <TextField colSpan={1} name="xpssj" label="需配送数据" />
        </Form>
      </div>
    );
  }
}
