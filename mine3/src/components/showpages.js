import React, { Component } from "react";
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
      loading: true,
      validUser: false
    };

    this.authorization();
    this.onListenForPages();
  }

  onDeleteHandler = async (e, title) => {
    e.preventDefault();
    this.setState({
      loading: true
    });

    let isDeleted = await this.deletePage(title);

    if (isDeleted) {
      this.onListenForPages();
    }

    this.setState({
      loading: false
    });
  };

  deletePage = (title) => {
    return new Promise((resolve, reject) => {
      fire
        .database()
        .ref(`/pages/${title}`)
        .remove();
      resolve(true);
    });
  }

  onListenForPages = () => {
    fire
      .database()
      .ref()
      .child("pages")
      .orderByKey()
      .once("value", snapshot => {
        let allPages = snapshot.val();
        this.setState({ pages: allPages });
        this.props.onSetPages(allPages);

        let pages = Object.keys(allPages || {}).map(key => ({
          ...allPages[key]
        }));
        let paginatedData = this.getPaginatedItems(pages, 1);
        this.setState({ paginationObj: paginatedData, loading: false });
      });
  };

  sortby(sortKey) {
    this.setState({
      loading: true
    });

    let sortedObject = _.orderBy(
      this.state.pages,
      sortKey,
      this.state.sortOrder
    );

    let paginatedData = this.getPaginatedItems(sortedObject, 1);
    this.setState({ paginationObj: paginatedData });

    if (this.state.sortOrder === "asc") {
      this.setState({ sortOrder: "desc" });
    } else {
      this.setState({ sortOrder: "asc" });
    }
    this.setState({
      loading: false
    });
  }

  getPaginatedItems(items, page, pageSize = 2) {
    let pg = page || 1,
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

    let sortedObject;
    let sortedPages = [];
    sortedObject = this.props.pages;

    for (let key in this.props.pages) {
      let abc = _.some(
        [this.props.pages[key].title.toLowerCase()],
        _.method("includes", this.state.filterText.toLowerCase())
      );
      if (abc === true) {
        sortedPages.push(this.props.pages[key]);
      }
    }

    if (this.state.filterText.length > 0) {
      sortedObject = [...sortedPages];
    }

    let paginatedData = this.getPaginatedItems(sortedObject, 1);
    this.setState({ paginationObj: paginatedData, loading: false, pages: sortedObject });
  };

  onNextPage(page) {
    this.setState({
      loading: true
    });
    let paginatedData = this.getPaginatedItems(this.state.pages.length ? this.state.pages : this.props.pages, page);
    this.setState({ paginationObj: paginatedData, loading: false });
  }

  onChangeFilter = event => {
    this.setState({ filterText: event.target.value });
  };

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
    const paginationObj = this.state.paginationObj;
    if (!paginationObj) {
      return null;
    }
    if (!this.state.validUser) {
      return (<h6><h1 className="error">Access Denied</h1>Error: 401 Unauthorized user trying to access <code>{this.props.location.pathname}</code></h6>);
    }
    const pages = this.state.paginationObj.data;
    const filterText = this.state.filterText;
    const loading = this.state.loading;

    const items = [];
    let selected = "";

    for (let i = 1; i <= paginationObj.total_pages; i++) {
      selected = "page-item";
      if (paginationObj.page === i) {
        selected = "page-item active";
      }
      let pageNumbers = i;

      items.push(
        <li className={selected} key={i}>
          <Link className="page-link" onClick={i => this.onNextPage(pageNumbers)}>
            {i}
          </Link>
        </li>
      );
    }

    let showpages = (
      <div className="container" style={{ backgroundColor: "white", borderRadius: "5px" }} >
        <div className="row">
          <div style={{ width: "100%", padding: "10px" }}>
            <div className="sp-rightpanel">
              <Link
                to={"/page"}
                className="btn btn-primary"
                title="Add Page"
              >
                <i className="fa fa-plus-circle" aria-hidden="true" /> Add Page
              </Link>
              <Link
                to={"/charts"}
                className="btn btn-primary margin-left-5"
                title="Charts"
              >
                <i className="fa fa-pie-chart" aria-hidden="true" /> Charts
              </Link>
            </div>
            <input
              type="text"
              className="search-box"
              placeholder="Filter by title"
              onChange={this.onChangeFilter}
              value={filterText}
            />
            <button
              className="search-button"
              onClick={this.onSearch}
            >
              Search
              </button>
          </div>

          <div className="col-md-12">
            <table className="table sp-table">
              <thead className="thead-dark border-black">
                <tr>
                  <th><Link className="sp-th" onClick={e => { this.sortby("title"); }} > Page </Link></th>
                  <th><Link className="sp-th" onClick={e => { this.sortby("content") }} >Content</Link></th>
                  <th><Link className="sp-th" onClick={e => { this.sortby("author") }}>Author</Link></th>
                  <th><Link className="sp-th" onClick={e => { this.sortby("status") }}>Status</Link></th>
                  <th><Link className="sp-th" onClick={e => { this.sortby("updated_on") }}>Updated On</Link></th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pages.map(page => {
                  return (
                    <tr key={page.title}>
                      <td>{page.title}</td>
                      <td>
                        <Truncate lines={1} ellipsis={<span>...</span>}>{parse(page.content)}</Truncate>
                      </td>
                      <td>{page.author}</td>
                      <td>{page.status === "on_Hold" ? "On Hold" : "Published"}</td>
                      <td>{moment(page.updated_on).format("MM/DD/YYYY")}</td>
                      <td>
                        <Link to={"page/" + page.title} className="nav-link-icon" title="Edit">
                          <i className="fa fa-edit" aria-hidden="true" /></Link>
                        <Link className="nav-link-icon" title="Delete" onClick={e => {
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
                        <Link to={"/preview/" + page.title} className="nav-link-icon" title="Preview">
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
                className="sp-navleft"
                aria-label="Page navigation example"
              >
                <ul className="pagination justify-content-center">{items}</ul>
              </nav>
              <nav
                className="sp-navright"
                aria-label="Page navigation example"
              >
                <ul className="">Total Count: {pages.length}</ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );

    if (loading) {
      showpages = <Spinner />;
    }
    return showpages;
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
