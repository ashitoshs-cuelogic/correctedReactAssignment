import React, { Fragment } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { COLORS, renderCustomizedLabel } from "./chartConstant";

const charts = props => {
  return (
    <Fragment >
      {
        props.pages
          ? props.pages.map((entry, index) => (
            <div className="graph-label" style={{ color: COLORS[index] }} key={{ index }} >
              <span >{index + 1}) {entry.name}: {entry.value ? entry.value : 0}</span>
            </div>
          ))
          : null
      }

      < PieChart width={500} height={390} >
        <Pie
          data={props.pages}
          cx={300}
          cy={200}
          labelLine={false}
          label={renderCustomizedLabel}
          fill="#8884d8"
          dataKey="value"
          outerRadius={150}
          {...props.elementConfig}
        >
          {props.pages
            ? props.pages.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))
            : null}
        </Pie>
      </PieChart >
    </Fragment>
  );
};

export default charts;
