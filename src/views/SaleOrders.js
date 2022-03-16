import React from "react";
import SalesOrdersImportForm from "./SaleOrdersImportForm";
import "../styles/saleOrders.scss";
import axios from "axios";
import Time from "react-time-format";

class SaleOrders extends React.Component {
  state = {
    saleOrders: [],
  };

  renderSwitch(status) {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Processing";
      case 2:
        return "Success";
      case 3:
        return "Failed";
    }
  }

  componentDidMount() {
    this.getSaleOrdersImportFiles();
    console.log("process.env.APP_ENV: ", process.env.APP_ENV);
  }

  getSaleOrdersImportFiles = () => {
    axios({
      method: "GET",
      url: "http://omuse.local/api/zoho/import/sale-orders",
    })
      .then((response) => {
        console.log(response.data.response.files);
        this.setState({
          saleOrders:
            response &&
            response.data &&
            response.data.response &&
            response.data.response.files
              ? response.data.response.files
              : [],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  onFormHandleSubmit = () => {
    this.getSaleOrdersImportFiles();
  };

  render() {
    let { saleOrders } = this.state;

    return (
      <>
        <SalesOrdersImportForm onFormHandleSubmit={this.onFormHandleSubmit} />
        <br />
        <hr />
        <h2>Import Histories</h2>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>ID</th>
              <th>Source</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Note</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {saleOrders.map((saleOrder, index) => {
              let hrefEach =
                "http://omuse.local/api/zoho/import/sale-orders/" +
                saleOrder._id +
                "/download";

              return (
                <tr key={++index}>
                  <td style={{ width: "5%" }}>{++index}</td>
                  <td>{saleOrder._id}</td>
                  <td>{saleOrder.source}</td>
                  <td>{this.renderSwitch(saleOrder.status)}</td>
                  <td>
                    <Time
                      value={new Date(saleOrder.created_at)}
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </td>
                  <td>
                    <Time
                      value={new Date(saleOrder.updated_at)}
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </td>
                  {saleOrder.result != null &&
                  !Array.isArray(saleOrder.result) ? (
                    <td>{saleOrder.result.message}</td>
                  ) : (
                    <td></td>
                  )}
                  <td>
                    {saleOrder.status === 2 ? (
                      <a href={hrefEach}>Download</a>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </>
    );
  }
}

export default SaleOrders;
