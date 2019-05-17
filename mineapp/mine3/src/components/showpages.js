import React, { Component, Fragment } from "react";
import fire from "./../config/firebase";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import Truncate from "react-truncate";
import moment from "moment";
import { connect } from "react-redux";
import Spinner from "../UI/Spinner";
import _ from "lodash";

class ShowPages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: null,
      sortOrder: "asc",
      filterText: null,
      paginationObj: null,
      loading: false
    };
  }

  onDeleteHandler = (e, title) => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    fire
      .database()
      .ref(`/pages/${title}`)
      .remove();
    this.onListenForPages();
    this.props.history.push("/showpages");
    this.setState({
      loading: false
    });
  };

  onListenForPages = () => {
    fire
      .database()
      .ref()
      .child("pages")
      .orderByKey()
      .once("value", snapshot => {
        let message = snapshot.val();
        this.setState({ pages: message });
        this.props.onSetPages(message);

        let msg = Object.keys(message || {}).map(key => ({
          ...message[key]
        }));
        let msg1 = this.getPaginatedItems(msg, 1, 10);
        this.setState({ paginationObj: msg1 });
      });
  };

  sortby(sortKey) {
    this.setState({
      loading: true
    });

    let sortedObject = _.orderBy(
      this.props.pages,
      sortKey,
      this.state.sortOrder
    );

    let msg1 = this.getPaginatedItems(sortedObject, 1, 10);
    this.setState({ paginationObj: msg1 });

    if (this.state.sortOrder === "asc") {
      this.setState({ sortOrder: "desc" });
    } else {
      this.setState({ sortOrder: "asc" });
    }
    this.setState({
      loading: false
    });
  }

  getPaginatedItems(items, page, pageSize) {
    var pg = page || 1,
      pgSize = pageSize || 100,
      offset = (pg - 1) * pgSize,
      pagedItems = _.drop(items, offset).slice(0, pgSize);
    return {
      page: pg,
      pageSize: pgSize,
      total: items.length,
      total_pages: Math.ceil(items.length / pgSize),
      data: pagedItems
    };
  }

  onSearch = () => {
    this.setState({
      loading: true
    });

    var sortedObject;
    var finalArray = [];
    sortedObject = this.props.pages;

    for (var key in this.props.pages) {
      var abc = _.some(
        [this.props.pages[key].title.toLowerCase()],
        _.method("includes", this.state.filterText.toLowerCase())
      );
      if (abc === true) {
        finalArray.push(this.props.pages[key]);
      }
    }

    if (this.state.filterText.length > 0) {
      sortedObject = [...finalArray];
    }

    let msg1 = this.getPaginatedItems(sortedObject, 1, 10);
    this.setState({ paginationObj: msg1, loading: false });
  };

  onNextPage(page) {
    this.setState({
      loading: true
    });

    let msg1 = this.getPaginatedItems(this.props.pages, page, 10);
    this.setState({ paginationObj: msg1, loading: false });
  }

  onChangeFilter = event => {
    this.setState({ filterText: event.target.value });
  };

  componentWillMount() {
    this.setState({
      loading: true
    });
    this.onListenForPages();
    this.setState({
      loading: false
    });
  }

  render() {
    const paginationObj = this.state.paginationObj;
    if (!paginationObj) {
      return null;
    }

    const pages = this.state.paginationObj.data;
    const filterText = this.state.filterText;
    const loading = this.state.loading;

    const items = [];
    let selected = "";

    for (var i = 1; i <= paginationObj.total_pages; i++) {
      selected = "page-item";
      if (paginationObj.page === i) {
        selected = "page-item active";
      }
      const s = i;

      items.push(
        <li className={selected} key={i}>
          <Link className="page-link" onClick={i => this.onNextPage(s)}>
            {i}
          </Link>
        </li>
      );
    }

    var showpages = (
      <div
        className="container"
        style={{ backgroundColor: "white", borderRadius: "5px" }}
      >
        <div className="row">
          <div
            style={{
              width: "100%",
              padding: "10px"
            }}
          >
            <div
              style={{
                width: "21%",
                padding: "10px",
                float: "right"
              }}
            >
              <Link
                to={"/createpage"}
                className="btn btn-primary"
                title="Add Page"
              >
                <i className="fa fa-plus-circle" aria-hidden="true" /> Add Page
              </Link>
              <Link
                style={{ marginLeft: "5px" }}
                to={"/charts"}
                className="btn btn-primary"
                title="Charts"
              >
                <i className="fa fa-pie-chart" aria-hidden="true" /> Charts
              </Link>
            </div>
            <div>
              <input
                type="text"
                style={{
                  padding: "10px",
                  marginLeft: "10px",
                  marginRight: "10px",
                  borderRadius: "5px",
                  borderStyle: "none",
                  border: "1px solid gainsboro"
                }}
                placeholder="Filter by title"
                onChange={this.onChangeFilter}
                value={filterText}
              />
              <button
                style={{
                  padding: "5px",
                  borderRadius: "5px",
                  width: "80px",
                  borderStyle: "none",
                  backgroundColor: "grey",
                  color: "white"
                }}
                onClick={this.onSearch}
              >
                Search
              </button>
            </div>
          </div>

          <div className="col-md-12">
            <table
              className="table"
              style={{ border: "1px solid gainsboro", borderRadius: "10px" }}
            >
              <thead
                className="thead-dark"
                style={{ border: "1px solid black" }}
              >
                <tr>
                  <th>
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      onClick={e => {
                        this.sortby("title");
                      }}
                    >
                      Page
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      onClick={e => {
                        this.sortby("content");
                      }}
                    >
                      Content
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      onClick={e => {
                        this.sortby("author");
                      }}
                    >
                      Author
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      onClick={e => {
                        this.sortby("status");
                      }}
                    >
                      Status
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      onClick={e => {
                        this.sortby("updated_on");
                      }}
                    >
                      Updated On
                    </Link>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => {
                  return (
                    <tr key={page.title}>
                      <td>{page.title}</td>
                      <td>
                        <Truncate lines={1} ellipsis={<span>...</span>}>
                          {parse(page.content)}
                        </Truncate>
                      </td>
                      <td>{page.author}</td>
                      <td>
                        {page.status === "on_Hold" ? "On Hold" : "Published"}
                      </td>
                      <td>{moment(page.updated_on).format("MM/DD/YYYY")}</td>
                      <td>
                        <Link
                          to={"editpage/" + page.title}
                          className="nav-link-icon"
                          title="Edit"
                        >
                          <i className="fa fa-edit" aria-hidden="true" />
                        </Link>
                        <Link
                          className="nav-link-icon"
                          title="Delete"
                          onClick={e => {
                            if (
                              window.confirm(
                                "Are you sure you wish to delete this item?"
                              )
                            )
                              this.onDeleteHandler(e, page.title);
                          }}
                        >
                          <i className="fa fa-trash" aria-hidden="true" />
                        </Link>
                        <Link
                          to={"/preview/" + page.title}
                          className="nav-link-icon"
                          title="Preview"
                        >
                          <i className="fa fa-eye" aria-hidden="true" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {pages.length === 0 ? (
              <div>
                No pages found. <hr />
              </div>
            ) : null}

            <div style={{ backgroundColor: "red" }}>
              <nav
                style={{ width: "80%", float: "left" }}
                aria-label="Page navigation example"
              >
                <ul className="pagination justify-content-center">{items}</ul>
              </nav>
              <nav
                style={{ width: "15%", float: "right" }}
                aria-label="Page navigation example"
              >
                <ul className="">Total Pages: {pages.length}</ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );

    if (loading) {
      showpages = <Spinner />;
    }
    return <Fragment>{showpages}</Fragment>;
  }
}

const mapStateToProps = state => ({
  pages: Object.keys(state.pageState.pages || {}).map(key => ({
    ...state.pageState.pages[key],
    uid: key
  }))
});

const mapDispatchToProps = dispatch => ({
  onSetPages: pages => dispatch({ type: "PAGES_SET", pages })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShowPages);
