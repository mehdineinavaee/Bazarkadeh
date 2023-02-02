import React from "react";
export default class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pager: {} };
  }

  componentDidMount() {
    this.setPage(this.props.currentPage);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.currentPage !== this.props.currentPage) {
      this.setPage(this.props.currentPage);
    }
  }

  setPage(page) {
    if (page < 1 || page > this.state.pager.totalPages) {
      return;
    }
    // get new pager object for specified page
    if (this.props.showLessPages) {
      this.state.pager = this.getPagerSmall(this.props.totalItemsLength);
    } else {
      this.state.pager = this.getPager(this.props.totalItemsLength);
    }
    this.setState({ pager: this.state.pager });
    this.props.onChange(this.state.pager.currentPage);
  }

  getPager(totalItems) {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 600) {
        return (this.state.pager = this.getPagerSmall(
          this.props.totalItemsLength
        ));
      }
    }
    const totalPages = Math.ceil(totalItems / this.props.itemsPerPage);
    let startPage;
    let endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (this.props.currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (this.props.currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = this.props.currentPage - 5;
        endPage = this.props.currentPage + 4;
      }
    }
    // calculate start and end item indexes
    const startIndex = (this.props.currentPage - 1) * this.props.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.props.itemsPerPage - 1,
      totalItems - 1
    );
    // create an array of pages to ng-repeat in the pager control
    const pages = [...Array(endPage + 1 - startPage).keys()].map(
      (i) => startPage + i
    );
    return {
      totalItems: totalItems,
      currentPage: this.props.currentPage,
      pageSize: this.props.itemsPerPage,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }

  getPagerSmall(totalItems) {
    const totalPages = Math.ceil(totalItems / this.props.itemsPerPage);
    let startPage;
    let endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (this.props.currentPage < 5) {
        startPage = 1;
        endPage = 5;
      } else if (this.props.currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = this.props.currentPage - 2;
        endPage = this.props.currentPage + 2;
      }
    }
    // calculate start and end item indexes
    const startIndex = (this.props.currentPage - 1) * this.props.itemsPerPage;
    const endIndex = Math.min(
      startIndex + this.props.itemsPerPage - 1,
      totalItems - 1
    );
    // create an array of pages to ng-repeat in the pager control
    const pages = [...Array(endPage + 1 - startPage).keys()].map(
      (i) => startPage + i
    );
    return {
      totalItems: totalItems,
      currentPage: this.props.currentPage,
      pageSize: this.props.itemsPerPage,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }

  render() {
    var pager = this.state.pager;

    if (!pager.pages || pager.pages.length <= 1) {
      // don't display pager if there is only 1 page
      return null;
    }

    return (
      <div className="e-pagination-wrap mb-75">
        <ul className="e-pagination">
          <li
            className={`e-page-item`}
            onClick={() => {
              if (this.props.currentPage !== 1) {
                this.props.onChange(this.props.currentPage - 1);
              }
            }}
          >
            <div role="button" className="e-btn light">
              قبلی
            </div>
          </li>
          {pager.pages.map((page, index) => {
            return (
              <li
                className="e-page-item"
                key={index}
                onClick={() => this.props.onChange(page)}
              >
                <div
                  role="button"
                  className={`e-btn ${
                    this.props.currentPage !== page && "light"
                  }`}
                >
                  {this.props.lang === "english"
                    ? page
                    : page.toLocaleString("ar-EG")}
                </div>
              </li>
            );
          })}
          <li
            className="e-page-item"
            onClick={() => {
              if (this.props.currentPage !== pager.totalPages) {
                this.props.onChange(this.props.currentPage + 1);
              }
            }}
          >
            <div role="button" className="e-btn light">
              بعدی
            </div>
          </li>
        </ul>
      </div>
    );
  }
}
