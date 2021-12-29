/**
 * @Author:ywj
 * @email: wenjie.yang01@hand-china.com
 * @description： 导出结果
 */

import React, { Component } from 'react';
import { Table } from 'hzero-ui';
import intl from 'utils/intl';


const commonModelPrompt = 'tarzan.hwms.screeningResult';

export default class screeningResult extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columns: [
				{
					title: intl.get(`${commonModelPrompt}.newMaterialLotCode`).d('器件序列号'),
					dataIndex: 'newMaterialLotCode',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.virtualNum`).d('虚拟器件号'),
					dataIndex: 'virtualNum',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.oldMaterialLotCode`).d('来源条码号'),
					dataIndex: 'oldMaterialLotCode',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.load`).d('位置编码'),
					dataIndex: 'load',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.hotSinkCode`).d('热沉'),
					dataIndex: 'hotSinkCode',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.ways`).d('芯片序列'),
					dataIndex: 'ways',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.a04`).d('5A波长'),
					dataIndex: 'a04',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.a02`).d('15A功率'),
					dataIndex: 'a02',
					align: 'left',
				},
				{
					title: intl.get(`${commonModelPrompt}.avga04`).d('中心波长平均值'),
					dataIndex: 'avga04',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.suna02`).d('功率和'),
					dataIndex: 'suna02',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.a06`).d('挑选电压值'),
					dataIndex: 'a06',
					align: 'center',
				},

				{
					title: intl.get(`${commonModelPrompt}.cosMaterialCode`).d('芯片物料'),
					dataIndex: 'cosMaterialCode',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.wafer`).d('WAFER'),
					dataIndex: 'wafer',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.userName`).d('操作者'),
					dataIndex: 'userName',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.creationDate`).d('操作时间'),
					dataIndex: 'creationDate',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.ncType`).d('不良类型'),
					dataIndex: 'ncType',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.remark`).d('备注'),
					dataIndex: 'remark',
					align: 'left',
				},
				{
					title: intl.get(`${commonModelPrompt}.status`).d('工序状态'),
					dataIndex: 'status',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.equipment`).d('工位机台号'),
					dataIndex: 'equipment',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.materialCode`).d('产品编码'),
					dataIndex: 'materialCode',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.materialName`).d('产品描述'),
					dataIndex: 'materialName',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.workOrderNum`).d('工单号'),
					dataIndex: 'workOrderNum',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.qty`).d('产品总数'),
					dataIndex: 'qty',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.cosType`).d('芯片类型'),
					dataIndex: 'cosType',
					align: 'center',
				},
				{
					title: intl.get(`${commonModelPrompt}.assemblyTime`).d('装配日期'),
					dataIndex: 'assemblyTime',
					align: 'center',
				},
			],
		};
	}

	render() {
		const { dataSource, pagination, loading, onSearch } = this.props;
		const { columns } = this.state;
		return (
			<Table
				bordered
				dataSource={dataSource}
				columns={columns}
				pagination={pagination}
				onChange={onSearch}
				loading={loading}
			/>
		);
	}
}
