import React, { Component } from "react";
import fire from "../config/firebase";
import { Link } from "react-router-dom";
import ChartComponent from "./ChartComponent";
import _ from "lodash";
import Spinner from "./../UI/Spinner";

class CustomPieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorwiseCounts: 0,
      categorywiseCounts: 0,
      charts: {
        donutChart: {
          paddingAngle: 5,
          innerRadius: 60
        }
      },
      loading: true,
      validUser: false
    };
    this.authorization();
  }

  componentDidMount = async () => {
    // Variable declaration
    let authorData = {};
    let authorsData = [];
    let authorwiseCounts = [];
    let counter = 0;

    // Fetching data from the Database
    let pagesData = await this.getPagesData();

    pagesData.forEach((d) => {
      if (!authorData[d.name]) {
        authorData[d.name] = 1;
      } else {
        authorData[d.name] = authorData[d.name] + 1;
      }
      authorsData[d.name] = { name: d.name, value: authorData[d.name] }
    });

    for (let key in authorsData) {
      authorwiseCounts[counter] = authorsData[key];
      counter++;
    }

    // For category Map
    let categoryData = _.countBy(pagesData, function (rec) {
      return rec.status === "published";
    });

    let donutChartCounts = [
      { name: "Published", value: categoryData.true },
      { name: "On Hold", value: categoryData.false }
    ];
    // Check whether data is exist if not then keep the object null
    if (!donutChartCounts[0].value && !donutChartCounts[1].value) {
      donutChartCounts = null;
    }
    this.setState({ authorwiseCounts: (counter > 0) ? authorwiseCounts : null, categorywiseCounts: donutChartCounts, loading: false });
    //   });
  }

  getPagesData = async () => {
    return new Promise((resolve, reject) => {
      fire
        .database()
        .ref()
        .child("pages")
        .orderByKey()
        .once("value", snapshot => {
          let message = snapshot.val();
          let pagesData = Object.keys(message || {}).map(key => ({
            name: message[key].author,
            value: 1,
            status: message[key].status
          }));
          resolve(pagesData);
        });
    });
  }

  authorization = async () => {
    let userData = sessionStorage.getItem("authUser");
    if (userData) {
      let usersData = await this.validateUser();
      if (usersData) {
        let boolStatus = false;
        usersData.forEach(function (user) {
          let userEmail = user.val().email;
          if (userEmail === userData) {
            boolStatus = true;
          }
        });
        this.setState({ validUser: boolStatus })
      }
    }
    return false;
  }

  validateUser() {
    return new Promise((resolve, reject) => {
      let playersRef = fire.database().ref("users/");
      playersRef.orderByValue().on("value", function (users) {
        resolve(users);
      });
    });
  }

  render() {
    if (!this.state.validUser) {
      return (<h6><h1 className="error">Access Denied</h1>Error: 401 Unauthorized user trying to access <code>{this.props.location.pathname}</code></h6>);
    }

    return (
      (this.state.loading) ?
        <Spinner /> :
        <div className="width-100">
          <Link className="back-link" to={"/showpages"}>
            Back
          </Link>

          <div className="clearfix"></div>

          {/* For Pie Chart */}
          <div className="container-left" >
            <label className="width-100" htmlFor="pieChart">
              <strong>Pie Chart (Author): </strong>
            </label>
            <div className="clearfix"></div>
            {this.state.authorwiseCounts ? (
              <ChartComponent pages={this.state.authorwiseCounts} />
            ) : <h6>No Data Found</h6>}
          </div>

          {/* For Donut Chart */}
          <div className="container-right" >
            <label className="width-100" htmlFor="pieChart">
              <strong>Donut Chart (Categories): </strong>
            </label>
            <div className="clearfix"></div>
            {this.state.categorywiseCounts ? (
              <ChartComponent pages={this.state.categorywiseCounts} elementConfig={this.state.charts.donutChart} />
            ) : <h6>No Data Found</h6>}
          </div>
        </div>
    );
  }
}

export default CustomPieChart;