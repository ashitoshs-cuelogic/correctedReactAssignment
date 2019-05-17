import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "../../components/home";
import Login from "../../components/login";
import Register from "../../components/register";
import CreatePage from "../../components/createpage";
import EditPage from "../../components/editpage";
import ShowPages from "../../components/showpages";
import Preview from "../../components/preview";
import CustomPieChart from "../../charts/piechart";
import Page404 from "../PageNotFound/Page404";

const RouterComponent = props => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/createpage" component={CreatePage} />
      <Route path="/editpage/:id" component={EditPage} />
      <Route path="/showpages" component={ShowPages} />
      <Route path="/preview/:id" component={Preview} />
      <Route path="/charts" component={CustomPieChart} />
      <Route path="**" component={Page404} />
    </Switch>
  );
};

export default RouterComponent;
