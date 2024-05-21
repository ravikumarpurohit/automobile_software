import React, { useState, useEffect, Fragment } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { getBillDataByIdForView } from "../api/billAPI";
import { useParams } from "react-router-dom";
import logoImage from "../assets/royal.png";
import { Link } from "react-router-dom";
import Moment from "moment";

const BillView = (props) => {
  const params = useParams();
  const [billData, setBillData] = useState();
  console.log("id =", params.id);

  const fnGetBillDataById = () => {
    getBillDataByIdForView(params.id).then((result) => {
      console.log("getBillDataById ", result);
      if (result.result === "success") {
        setBillData(result.data);
      } else {
      }
    });
  };

  const fnPrint = async () => {
    // window.html2canvas = html2canvas;
    const content = document.getElementById("invoiceDiv");

    html2canvas(content,{
      scale: 1,
    }).then((canvas) => {
      let fileName = `${billData.name}_${Moment(billData.billDate, "YYYY-MM-DD").format("DD-MM-YYYY")}.pdf`;
      const imgData = canvas.toDataURL("image/png", 0.3);
      const imgWidth = 210;
      const pageHeight = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      const doc = new jsPDF("pt", "mm", "a4", true);
      let position = 0;
      doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight - 5);
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 285, 210, 15, "F");
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight + 15);
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 15, "F");
        heightLeft -= pageHeight;
      }
      doc.save(fileName);
    });
  };

  useEffect(() => {
    fnGetBillDataById();
  }, []);

  return (
    <div className="container" style={{ overflow: "auto" }}>
      <div className="row">
        <div className="col-3">
          <div className="row mb-3">
            <div className="col">
              <Link to={`/bill`} className="btn btn-success btn-nav">
                Back
              </Link>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col">
              <button className="btn btn-success btn-nav" onClick={fnPrint}>
                Download
              </button>
            </div>
          </div>
        </div>
        <div className="col-9">
          <div className="">
            <div className="border border-dark rounded" style={{ width: "595px" }}>
              <div className="" style={{ width: "595px", padding: "30px" }} id="invoiceDiv">
                {billData && (
                  <Fragment>
                    <div className="row">
                      <div className="col-12">
                        <div className="row">
                          <div className="col-3 curve-box-black no-npmp">
                            <img src={logoImage} alt="logoImage" className="m-1" style={{ height: "60px", width: "70px" }} />
                          </div>
                          <div className="col-9 text-center no-npmp font-white" style={{ background: "black" }}>
                            <div className="curve-box-red">
                              <div className="row pt-2">
                                <div className="col-1"></div>
                                <div className="col-2">
                                  <span className="float-end"> M : 982540740 </span>
                                </div>
                                <div className="col-3">
                                  <span className="text-break"> Email : gadanighanshyam5@gmail.com</span>
                                </div>
                                <div className="col-5 no-npmp">
                                  <span className="text-break">
                                    Address : <br /> Plot 170, Subh complex, Behind au small banck, Sector 21, Gandhinagar
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-8 pt-2 pb-2 curve-box-black-c">
                            <h3 className="font-white">Shivam Automobile</h3>
                          </div>
                          <div className="col-4 pt-2 pb-2">
                            <h3 className="text-center">Invoice</h3>
                          </div>
                        </div>
                        <div className="row mt-3 mb-4">
                          <div className="col-7">
                            <h5 className="text-danger">Bill To : </h5>
                            <h5>{billData.name}</h5>
                            <h6>{billData.address}</h6>
                            <h6>Mobile : {billData.mobile}</h6>
                          </div>
                          <div className="col-5">
                            <div className="row justify-content-end">
                              <div className="col-5">
                                <label>Bill No :</label>
                              </div>
                              <div className="col-6">{billData.id}</div>
                            </div>
                            <div className="row justify-content-end">
                              <div className="col-5 ">
                                <label>Bill Date :</label>
                              </div>
                              <div className="col-6">{Moment(billData.billDate, "YYYY-MM-DD").format("DD-MM-YYYY")}</div>
                            </div>
                            <div className="row justify-content-end">
                              <div className="col-5 ">
                                <label>Vehicle No : </label>
                              </div>
                              <div className="col-6">{billData.vehicleNo}</div>
                            </div>
                            <div className="row justify-content-end">
                              <div className="col-5 ">
                                <label>kilometer : </label>
                              </div>
                              <div className="col-6">{billData.kilometer}</div>
                            </div>
                            <div className="row justify-content-end">
                              <div className="col-5 ">
                                <label>Next Date : </label>
                              </div>
                              <div className="col-6">{Moment(billData.nextDate, "YYYY-MM-DD").format("DD-MM-YYYY")}</div>
                            </div>
                          </div>
                        </div>
                        <div className="table-responsive" style={{ minHeight: "250px" }}>
                          <table className="table table-bordered border rounded-3">
                            <thead>
                              <tr style={{background : "red"}}>
                                <th className="text-white">#</th>
                                <th className="text-white">Item Name</th>
                                <th className="text-end text-white">Quantity</th>
                                <th className="text-end text-white">Price</th>
                                <th className="text-end text-white">Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              {billData.items?.length > 0 ? (
                                billData.items?.map((x, i) => (
                                  <tr key={`x${i}`}>
                                    <td>{i + 1}</td>
                                    <td className="col-5">{x.item}</td>
                                    <td className="text-end">{x.qty}</td>
                                    <td className="text-end">{x.price}</td>
                                    <td className="text-end">{x.amount}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5}>No Records</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                        <div className="row">
                          <div className="col-7">
                            <ul>
                              <li>Goods once sold will not be taken back</li>
                              <li>એન્જીનની કોઈ ગેરંટી આપવામાં નહિ આવે.</li>
                              <li>એન્જીન બનાવ્યા પછી 700 કી.મી એ ઓઈલ અમારે ત્યા આવીને બદલાવવુ.</li>
                            </ul>
                          </div>
                          <div className="col-5">
                            <div className="row justify-content-end">
                              <div className="col-6">
                                <label>Total Amount :</label>
                              </div>
                              <div className="col-4">{billData.totalAmount}</div>
                            </div>
                            <div className="row justify-content-end">
                              <div className="col-6">
                                <label>Discount :</label>
                              </div>
                              <div className="col-4"> {billData.discount}</div>
                            </div>
                            <div className="row justify-content-end">
                              <div className="col-6">
                                <label>Net Amount : </label>
                              </div>
                              <div className="col-4">{billData.netAmount}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillView;

// // var content = document.getElementById("invoiceDiv");
// var doc = new jsPDF("p", "px");
// // var content = ReactDOMServer.renderToString(document.querySelector("#invoiceDiv"));
// console.log("content", content);
// //console.log("document.body", document.body);
// doc.html(content, {
//   callback: (doc) => {
//     // var pageCount = doc.internal.getNumberOfPages();
//     // console.log(pageCount);
//     doc.save("test1.pdf");
//   },
//   html2canvas: { scale: 0.6 },
// });
