import React, { PureComponent, Fragment } from "react";
import { PieChart, Pie, Cell } from "recharts";
import fire from "../config/firebase";
import { Link } from "react-router-dom";
import _ from "lodash";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

class CustomPieChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      auther: []
    };
  }

  UNSAFE_componentWillMount() {
    var a = [];
    var b = [];
    var abc = {};

    fire
      .database()
      .ref()
      .child("pages")
      .orderByKey()
      .once("value", snapshot => {
        let message = snapshot.val();
        let msg = Object.keys(message || {}).map(key => ({
          name: message[key].author,
          value: 1
        }));

        let msg1 = Object.keys(message || {}).map(key => ({
          status: message[key].status
        }));

        for (var index = 0; index < msg.length; index++) {
          if (a[msg[index].name]) {
            msg[index].value++;
          }
          a[msg[index].name] = msg[index];
        }

        var count = 0;
        for (abc in a) {
          b[count] = a[abc];
          count++;
        }
        var category = _.countBy(msg1, function(rec) {
          return rec.status === "published";
        });

        var catgoriesCount = [
          { name: "Published", value: category.true },
          { name: "On Hold", value: category.false }
        ];

        this.setState({ pages: b, category: catgoriesCount });
      });
  }

  render() {
    return (
      <Fragment>
        <Link style={{ float: "right", marginRight: "10px" }} to={"/showpages"}>
          Back
        </Link>
        <br />
        <div
          style={{
            width: "100%"
          }}
        >
          <div
            style={{
              width: "50%",
              display: "inline",
              float: "left"
            }}
          >
            <label htmlFor="pieChart">
              <strong>Pie Chart (Author): </strong>
            </label>
            <br />
            {this.state.pages
              ? this.state.pages.map((entry, index) => (
                  <div
                    style={{
                      textAlign: "left",
                      width: "40%",
                      display: "inline",
                      float: "left",
                      marginLeft: "60px",
                      color: COLORS[index]
                    }}
                    key={{ index }}
                  >
                    <span>
                      {index + 1}) {entry.name}: {entry.value}
                    </span>
                  </div>
                ))
              : null}
            <br />
            <br />
            <hr />
            <PieChart width={800} height={400}>
              <Pie
                data={this.state.pages}
                cx={300}
                cy={200}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {this.state.pages
                  ? this.state.pages.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        // label={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))
                  : null}
              </Pie>
            </PieChart>
          </div>
          <div
            style={{
              width: "49%",
              display: "inline",
              float: "left",
              borderLeft: "1px solid gray"
            }}
          >
            <label htmlFor="pieChart">
              <strong>Donut Chart (Categories): </strong>
            </label>
            <br />
            {this.state.category
              ? this.state.category.map((entry, index) => (
                  <div
                    style={{
                      textAlign: "left",
                      width: "40%",
                      display: "inline",
                      float: "left",
                      marginLeft: "60px",
                      color: COLORS[index]
                    }}
                    key={{ index }}
                  >
                    <span>
                      {index + 1}) {entry.name}: {entry.value}
                    </span>
                    <br />
                  </div>
                ))
              : null}
            <br />
            <br />
            <hr />
            <PieChart width={800} height={400}>
              <Pie
                data={this.state.category}
                cx={300}
                cy={200}
                innerRadius={60}
                outerRadius={100}
                labelLine={false}
                label={renderCustomizedLabel}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {this.state.category
                  ? this.state.category.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))
                  : null}
              </Pie>
            </PieChart>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default CustomPieChart;
