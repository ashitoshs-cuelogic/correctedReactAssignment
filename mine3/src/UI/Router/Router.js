import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../../components/home";
import Login from "../../components/login";
import Register from "../../components/register";
import ShowPages from "../../components/showpages";
import Preview from "../../components/preview";
import CustomPieChart from "../../charts/piechart";
import Page404 from "../PageNotFound/Page404";
import PageAction from "./../../components/createoreditpage"

const RouterComponent = props => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/preview/:id" component={Preview} />
      <Route path="/showpages" component={ShowPages} />
      <Route path="/charts" component={CustomPieChart} />
      <Route exact path="/logout" component={Home} />
      <Route exact path="/page" component={PageAction} />
      <Route exact path="/page/:id" component={PageAction} />
      <Route path="**" component={Page404} />
    </Switch >
  );
};

export default RouterComponent;
