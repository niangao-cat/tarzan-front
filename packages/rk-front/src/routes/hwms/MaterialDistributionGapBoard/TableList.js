import React from 'react';

const TableList = React.memo(props => {
  return (
    <React.Fragment>
      <table className="table">
        <thead>
          <tr className="table-tr">
            <th className="table-th">序号</th>
            <th className="table-th">生产线</th>
            <th className="table-th">工段</th>
            <th className="table-th">班次</th>
            <th className="table-th">物料编码</th>
            <th className="table-th">物料描述</th>
            <th className="table-th">物料版本</th>
            <th className="table-th" style={{ backgroundColor: '#548235' }}>
              当日生产需求
            </th>
            <th className="table-th" style={{ backgroundColor: '#548235' }}>
              当日生产已配送
            </th>
            <th className="table-th" style={{ backgroundColor: '#548235', color: 'red' }}>
              当日生产缺口
            </th>
            <th className="table-th" style={{ backgroundColor: '#BF9000' }}>
              次日生产需求
            </th>
            <th className="table-th" style={{ backgroundColor: '#BF9000' }}>
              次日生产已配送
            </th>
            <th className="table-th" style={{ backgroundColor: '#BF9000', color: 'red' }}>
              次日生产缺口
            </th>
            <th className="table-th">当前线边非限制库存</th>
            <th className="table-th">质检库存</th>
            <th className="table-th">仓库非限制库存</th>
            <th className="table-th">当日配送预警倒计时</th>
          </tr>
        </thead>
        <tbody>
          {props.dataSource.map((item, index) => (
            <tr>
              <td className="table-td">{index + 1}</td>
              <td className="table-td">{item.prodLineName}</td>
              <td className="table-td">{item.workcellName}</td>
              <td className="table-td">{item.shiftCode}</td>
              <td className="table-td">{item.materialCode}</td>
              <td className="table-td">{item.materialName}</td>
              <td className="table-td">{item.materialVersion}</td>
              <td className="table-td" style={{ backgroundColor: '#548235' }}>
                {item.demandQty1}
              </td>
              <td className="table-td" style={{ backgroundColor: '#548235' }}>
                {item.deliveryQty1}
              </td>
              <td className="table-td" style={{ backgroundColor: '#548235', color: 'red' }}>
                {item.diffQty1}
              </td>
              <td className="table-td" style={{ backgroundColor: '#BF9000' }}>
                {item.demandQty2}
              </td>
              <td className="table-td" style={{ backgroundColor: '#BF9000' }}>
                {item.deliveryQty2}
              </td>
              <td className="table-td" style={{ backgroundColor: '#BF9000', color: 'red' }}>
                {item.diffQty2}
              </td>
              <td className="table-td">{item.lineQty}</td>
              <td className="table-td">{item.receiveQty}</td>
              <td className="table-td">{item.stockQty}</td>
              <td className="table-td">{item.deliveryHours}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </React.Fragment>
  );
});

export default TableList;
