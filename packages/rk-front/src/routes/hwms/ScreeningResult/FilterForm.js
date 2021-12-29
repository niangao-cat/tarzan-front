/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 导出结果
 */

import React, { Component } from 'react';
import { Bind } from 'lodash-decorators';
import { Form, Button, Col, Row, Input, Select, DatePicker } from 'hzero-ui';
import { isFunction, uniq } from 'lodash';
import moment from 'moment';
import {
	FORM_COL_4_LAYOUT,
	SEARCH_FORM_CLASSNAME,
	SEARCH_FORM_ITEM_LAYOUT,
	SEARCH_FORM_ROW_LAYOUT,
	SEARCH_COL_CLASSNAME,
} from 'utils/constants';
import intl from 'utils/intl';
import { getDateTimeFormat } from 'utils/utils';


const commonModelPrompt = 'tarzan.hwms.screeningResult';

@Form.create({ fieldNameProp: null })
export default class screeningResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loadSequenceList: [],
		};
		if (isFunction(props.onRef)) {
			props.onRef(this);
		}
	}

	@Bind()
	handleOnSearch(value, dataListName) {
		const { [dataListName]: dataSource } = this.state;
		const { form } = this.props;
		const flag = value ? value.every(e => dataSource.includes(e)) : false;
		if (value && value.length > 0 && !flag) {
			const newList = [].concat(...value.map(e => e.split(/[ ]+/)));
			const uniqueList = uniq(dataSource.concat(newList));
			this.setState({ [dataListName]: uniqueList });
			form.setFieldsValue({ [dataListName]: uniqueList });
		}
	}

	// 重置查询
	@Bind()
	resetSearch = () => {
		const { form } = this.props;
		form.resetFields();
	};

	render() {
		const { loadSequenceList } = this.state;
		const { form, onSearch } = this.props;
		const { getFieldDecorator, getFieldValue } = form;
		return (
			<Form className={SEARCH_FORM_CLASSNAME}>
				<Row {...SEARCH_FORM_ROW_LAYOUT}>
					<Col {...FORM_COL_4_LAYOUT}>
						<Form.Item
							{...SEARCH_FORM_ITEM_LAYOUT}
							label={intl.get(`${commonModelPrompt}.loadSequenceList`).d('序列号')}
						>
							{getFieldDecorator('loadSequenceList', {
								rules: [
									{
										required: !(getFieldValue('workOrderNum')
											|| getFieldValue('assemblyStartTime')
											|| getFieldValue('assemblyEndTime')),
										message: intl.get('hzero.common.validation.notNull', {
											name: intl.get(`${commonModelPrompt}.loadSequenceList`).d('序列号'),
										}),
									},
								],
							})(
								<Select
									mode='tags'
									style={{ width: '100%' }}
									onBlur={val => this.handleOnSearch(val, 'loadSequenceList')}
									onChange={
										val => {
											if (val.length === 0) {
												this.setState({ loadSequenceList: [] });
											}
										}
									}
									allowClear
									dropdownMatchSelectWidth={false}
									maxTagCount={2}
								>
									{loadSequenceList.map(e => (
										<Select.Option key={e} value={e}>
											{e}
										</Select.Option>
									))}
								</Select>,
							)}
						</Form.Item>
					</Col>
					<Col {...FORM_COL_4_LAYOUT}>
						<Form.Item
							{...SEARCH_FORM_ITEM_LAYOUT}
							label={intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号')}
						>
							{getFieldDecorator('workOrderNum', {
								rules: [
									{
										required: !(getFieldValue('loadSequenceList') && getFieldValue('loadSequenceList').length > 0
											|| getFieldValue('assemblyStartTime')
											|| getFieldValue('assemblyEndTime')),
										message: intl.get('hzero.common.validation.notNull', {
											name: intl.get(`${commonModelPrompt}.loadSequenceList`).d('序列号'),
										}),
									},
								],
							})(
								<Input />,
							)}
						</Form.Item>
					</Col>
					<Col {...FORM_COL_4_LAYOUT} className={SEARCH_COL_CLASSNAME}>
						<Form.Item>
							<Button onClick={this.resetSearch}>
								{intl.get(`hzero.common.button.reset`).d('重置')}
							</Button>
							<Button type='primary' htmlType='submit' onClick={onSearch}>
								{intl.get(`hzero.common.button.search`).d('查询')}
							</Button>
						</Form.Item>
					</Col>
				</Row>
				<Row {...SEARCH_FORM_ROW_LAYOUT}>
					<Col {...FORM_COL_4_LAYOUT}>
						<Form.Item
							{...SEARCH_FORM_ITEM_LAYOUT}
							label={intl.get(`${commonModelPrompt}.assemblyStartTime`).d('装配开始时间')}
						>
							{getFieldDecorator('assemblyStartTime', {
								rules: [
									{
										required: !(getFieldValue('loadSequenceList') && getFieldValue('loadSequenceList').length > 0
											|| getFieldValue('workOrderNum')
											|| getFieldValue('assemblyEndTime')),
										message: intl.get('hzero.common.validation.notNull', {
											name: intl.get(`${commonModelPrompt}.loadSequenceList`).d('序列号'),
										}),
									},
								],
							})(
								<DatePicker
									showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
									placeholder=''
									style={{ width: '100%' }}
									format={getDateTimeFormat()}
									disabledDate={currentDate =>
										getFieldValue('assemblyEndTime') &&
										moment(getFieldValue('assemblyEndTime')).isBefore(currentDate, 'second')
									}
								/>,
							)}
						</Form.Item>
					</Col>
					<Col {...FORM_COL_4_LAYOUT}>
						<Form.Item
							{...SEARCH_FORM_ITEM_LAYOUT}
							label={intl.get(`${commonModelPrompt}.assemblyEndTime`).d('装配结束时间')}
						>
							{getFieldDecorator('assemblyEndTime', {
								rules: [
									{
										required: !(getFieldValue('loadSequenceList') && getFieldValue('loadSequenceList').length > 0
											|| getFieldValue('workOrderNum')
											|| getFieldValue('assemblyStartTime')),
										message: intl.get('hzero.common.validation.notNull', {
											name: intl.get(`${commonModelPrompt}.loadSequenceList`).d('序列号'),
										}),
									},
								],
							})(
								<DatePicker
									showTime={{ defaultValue: moment('23:59:59', 'HH:mm:ss') }}
									placeholder=''
									style={{ width: '100%' }}
									format={getDateTimeFormat()}
									disabledDate={currentDate =>
										getFieldValue('assemblyStartTime') &&
										moment(getFieldValue('assemblyStartTime')).isAfter(currentDate, 'second')
									}
								/>
							)}
						</Form.Item>
					</Col>
				</Row>
			</Form>
		);
	}
}
