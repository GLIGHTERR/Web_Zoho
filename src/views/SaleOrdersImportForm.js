import React from "react";
import axios from "axios";

class SalesOrdersImportForm extends React.Component {
  state = {
    uploadFile: null,
  };

  handleImportSaleOrders = (event) => {
    event.preventDefault();

    const dataArray = new FormData();
    dataArray.append("file", this.state.uploadFile);

    axios
      .post("http://omuse.local/api/zoho/import/sale-orders", dataArray, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("response: ", response);
        if (response.data.success) {
          this.props.onFormHandleSubmit();

          this.setState({
            uploadFile: null,
          });

          document.getElementById("file").value = "";
        } else {
          alert("Upload file failed");
          document.getElementById("file").value = "";
        }
      })
      .catch((error) => {
        // error response
        alert("error: " + error);
        document.getElementById("file").value = "";
      });
  };

  handleOnChangeImportFile = (file) => {
    console.log("file: ", file);
    this.setState({
      uploadFile: file,
    });
  };

  render() {
    return (
      <>
        <h1>Import Sale Orders</h1>
        <form onSubmit={this.handleImportSaleOrders}>
          <fieldset>
            <legend>CSV file (nên xử lý tối đa 500 dòng 1 lần post)</legend>
            <p>
              <i>
                File gồm các cột:{" "}
                <strong>
                  SO Zoho ID, SalesOrder Number, CF.Nhà Vận Chuyển, CF.Tracking
                  Order ID, CF.Delivery Status
                </strong>
              </i>
            </p>
            <input
              type="file"
              id="file"
              name="file"
              onChange={(e) =>
                this.handleOnChangeImportFile(e.target.files[0] ?? null)
              }
              required
            />
            <br />
            <br />
            <input type="submit" value="Submit" />
          </fieldset>
        </form>
      </>
    );
  }
}

export default SalesOrdersImportForm;
