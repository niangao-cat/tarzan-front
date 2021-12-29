/**
 * 员工出勤报表
 * @date: 2021/03/08 10:53:47
 * @author: junfeng.chen@hand-china.com
 *
 */


 import React, { Component } from 'react';
 import { connect } from 'dva';
 import { Bind } from 'lodash-decorators';
 import { isUndefined, isEmpty } from 'lodash';

 import intl from 'utils/intl';
 import formatterCollections from 'utils/intl/formatterCollections';
 import { Header, Content } from 'components/Page';
 import {
   filterNullValueObject,
   getCurrentOrganizationId,
   getDateTimeFormat,
 } from 'utils/utils';

 import FilterForm from './FilterForm';
 import ListTable from './ListTable';

 const modelPrompt = 'tarzan.hmes.signInOut';
 const dateTimeFormat = getDateTimeFormat();

 @connect(({ signInOut, loading }) => ({
   signInOut,
   fetchListLoading: loading.effects['signInOut/fetchList'],
   tenantId: getCurrentOrganizationId(),
 }))
 @formatterCollections({
   code: 'tarzan.hmes.signInOut',
 })
 export default class AbnormalReport extends Component {

   componentDidMount() {
     const { dispatch } = this.props;
     dispatch({
       type: 'signInOut/init',
     });
     dispatch({
       type: 'signInOut/updateState',
       payload: {
         list: [],
         pagination: {},
         colData: [],
       },
     });
   }

   @Bind()
   handleFetchList(page = {}) {
     const { dispatch } = this.props;
     let value = this.formDom ? this.formDom.getFieldsValue() : {};
     const { dateFrom, dateTo } = value;
     value = {
       ...value,
       dateFrom: isEmpty(dateFrom)
         ? null
         : dateFrom.startOf('day').format(dateTimeFormat),
         dateTo: isEmpty(dateTo) ? null : dateTo.endOf('day').format(dateTimeFormat),
     };
     const filterValue = isUndefined(this.formDom) ? {} : filterNullValueObject(value);
     dispatch({
       type: 'signInOut/fetchList',
       payload: {
         page: isEmpty(page) ? {} : page,
         ...filterValue,
       },
     });
   }


   // 渲染 界面布局
   render() {
     const {
       fetchListLoading,
       tenantId,
       signInOut: {
         list = [],
         colData = [],
         pagination = {},
         abnormalStatusList = [],
         abnormalTypeList = [],
         areaList = [],
       },
     } = this.props;
     const filterProps = {
       tenantId,
       abnormalStatusList,
       abnormalTypeList,
       areaList,
       onRef: node => {
         this.formDom = node.props.form;
       },
       onSearch: this.handleFetchList,
     };
     const listProps = {
       loading: fetchListLoading,
       pagination,
       colData,
       dataSource: list,
       onSearch: this.handleFetchList,
       downloadLogFile: this.downloadLogFile,
     };
     return (
       <div>
         <Header title={intl.get(`${modelPrompt}.view.title`).d('员工出勤报表')} />
         <Content>
           <FilterForm {...filterProps} />
           <ListTable {...listProps} />
         </Content>
       </div>
     );
   }
 }
