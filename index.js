const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')
const sql = require("mssql");
const cors = require("cors");


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

const config = {
  user: "bangkokdaytours",
  password: "ht8427d",
  server: "203.150.20.10",
  database: "bangkokdaytours",
  options: {
    encrypt: false,
  },
};
//Login
app.post("/api/Login", (req, res) => {
  const user = req.body.user;
  const pwd = req.body.pwd;
  const action = req.body.action;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("user", user);
      request.query(
        "exec bangkokdaytours.BDTspGetAdminPasswordByLogonName @user",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            if (recordset.recordset[0]["sword"] == pwd) {
              res.send(recordset.recordset);
            } else {
              res.send();
            }
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Systemconfig
app.post("/api/GetConfig", (req, res) => {
  const action = req.body.action;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.query(
        "exec bangkokdaytours.BDTspGetSystemConfiguration",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get GetManagetitle
app.post("/api/GetManagetitle", (req, res) => {
  const action = req.body.action;
  const strID = req.body.strID;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("strID", strID);
      request.query(
        "select * from dbo.bdt_title_kw_desc where id =@strID",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Update Managetitle
app.post("/api/UpdateManagetitle", (req, res) => {
  const action = req.body.action;
  const strID = req.body.strID;
  const strTitle = req.body.strTitle;
  const strKeyword = req.body.strKeyword;
  const strDescription = req.body.strDescription;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("strID", strID);
      request.input("strTitle", strTitle);
      request.input("strKeyword", strKeyword);
      request.input("strDescription", strDescription);
      request.query(
        "update dbo.bdt_title_kw_desc set title=@strTitle,keyword=@strKeyword,desctiption=@strDescription where id=@strID",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Updated");
        }
      );
    });
    sql.connection = null;
  }
});

//Get Provinces
app.post("/api/GetProvinces", (req, res) => {
  const action = req.body.action;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.query(
        "exec bangkokdaytours.BDTspGetAllProvinces",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get GetSingleProvince
app.post("/api/GetSingleProvince", (req, res) => {
  const action = req.body.action;
  const lngProvinceId = req.body.lngProvinceId;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngProvinceId", lngProvinceId);
      request.query(
        "exec bangkokdaytours.BDTspGetSingleProvince @lngProvinceId",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get ProvinceNameCount
app.post("/api/GetProvinceNameCount", (req, res) => {
  const action = req.body.action;
  const strProvinceName = req.body.strProvinceName;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("strProvinceName", strProvinceName);
      request.query(
        "exec bangkokdaytours.BDTspProvinceNameCount @strProvinceName",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Check CheckProvinceChildExists
app.post("/api/CheckProvinceChildExists", (req, res) => {
  const action = req.body.action;
  const lngProvinceId = req.body.lngProvinceId;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngProvinceId", lngProvinceId);
      request.query(
        "exec bangkokdaytours.BDTspCheckProvinceChildExists @lngProvinceId",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            request.query(
              "exec bangkokdaytours.BDTspGetSingleProvince @lngProvinceId",
              function (err, recordset) {
                console.log(recordset);
                if (err) console.log(err);
                if (recordset.rowsAffected > 0) {
                  res.send(recordset.recordset);
                }
              }
            );
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get BDTspProvinceNameCountById
app.post("/api/GetProvinceNameCountById", (req, res) => {
  const action = req.body.action;
  const lngProvinceId = req.body.lngProvinceId;
  const strProvinceName = req.body.strProvinceName;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngProvinceId", lngProvinceId);
      request.input("strProvinceName", strProvinceName);
      request.query(
        "exec bangkokdaytours.BDTspProvinceNameCountById @lngProvinceId, @strProvinceName",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Insert BDTspInsertProvince
app.post("/api/AddInsertProvince", (req, res) => {
  const action = req.body.action;
  const strProvinceName = req.body.strProvinceName;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("strProvinceName", strProvinceName);
      request.query(
        "exec bangkokdaytours.BDTspInsertProvince @strProvinceName",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Inserted");
        }
      );
    });
    sql.connection = null;
  }
});

//Update BDTspInsertProvince
app.post("/api/EditUpdateProvince", (req, res) => {
  const action = req.body.action;
  const lngProvinceId = req.body.lngProvinceId;
  const strProvinceName = req.body.strProvinceName;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngProvinceId", lngProvinceId);
      request.input("strProvinceName", strProvinceName);
      request.query(
        "exec bangkokdaytours.BDTspUpdateProvince @lngProvinceId, @strProvinceName",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Updated");
        }
      );
    });
    sql.connection = null;
  }
});

//Get GetTourHotelList
app.post("/api/GetTourHotelList", (req, res) => {
  const action = req.body.action;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.query(
        "exec bangkokdaytours.BDTspGetTourHotelList",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get BDTspGetSingleTourHotel
app.post("/api/GetSingleTourHotel", (req, res) => {
  const action = req.body.action;
  const lngHotelId = req.body.lngHotelId;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngHotelId", lngHotelId);
      request.query(
        "exec bangkokdaytours.BDTspGetSingleTourHotel @lngHotelId",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get BangkokHotels
app.post("/api/GetBangkokHotels", (req, res) => {
  const action = req.body.action;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.query(
        "exec bangkokdaytours.BDTspGetAllBangkokHotels",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get for Edit BangkokHotels
app.post("/api/GetSingleBangkokHotel", (req, res) => {
  const action = req.body.action;
  const lngHotelId = req.body.lngHotelId;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngHotelId", lngHotelId);
      request.query(
        "exec bangkokdaytours.BDTspGetSingleBangkokHotel @lngHotelId",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get Provinc
app.post("/api/GetProvin", (req, res) => {
  const action = req.body.action;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.query(
        "exec bangkokdaytours.BDTspGetAllProvinces",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get City
app.post("/api/GetCity", (req, res) => {
  const action = req.body.action;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.query(
        "exec bangkokdaytours.BDTspGetAllCityAreas",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Get CitiesByProvince
app.post("/api/GetCitiesByProvince", (req, res) => {
  const action = req.body.action;
  const lngProvinceId = req.body.lngProvinceId;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngProvinceId", lngProvinceId);
      request.query(
        "exec bangkokdaytours.BDTspGetCitiesByProvince @lngProvinceId",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Check BangkokHotel befor Insert
app.post("/api/CheckBangkokHotelNameCount", (req, res) => {
  const action = req.body.action;
  const strHotelName = req.body.strHotelName;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("strHotelName", strHotelName);
      request.query(
        "exec bangkokdaytours.BDTspBangkokHotelNameCount @strHotelName",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Check TourHotelNameCount
app.post("/api/CheckTourHotelNameCount", (req, res) => {
  const action = req.body.action;
  const strHotelName = req.body.strHotelName;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("strHotelName", strHotelName);
      request.query(
        "exec bangkokdaytours.BDTspTourHotelNameCount @strHotelName",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Check TourHotelNameCountById
app.post("/api/CheckTourHotelNameCountById", (req, res) => {
  const action = req.body.action;
  const lngHotelId = req.body.lngHotelId;
  const strHotelName = req.body.strHotelName;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngHotelId", lngHotelId);
      request.input("strHotelName", strHotelName);
      request.query(
        "exec bangkokdaytours.BDTspTourHotelNameCountById @lngHotelId, @strHotelName",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Check ContactList
app.post("/api/CheckTourHotelContactList", (req, res) => {
  const action = req.body.action;
  const lngHotelId = req.body.lngHotelId;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngHotelId", lngHotelId);
      request.query(
        "exec bangkokdaytours.BDTspGetTourHotelContactList @lngHotelId",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Edit Tour hotel
app.post("/api/EditTourHotel", (req, res) => {
  const action = req.body.action;
  const lngHotelId = req.body.lngHotelId;
  const strHotelName = req.body.strHotelName;
  const lngAreaId = req.body.lngAreaId;
  const strAddress = req.body.strAddress;
  const strPhone = req.body.strPhone;
  const strFax = req.body.strFax;
  const strEmail = req.body.strEmail;
  const strUrl = req.body.strUrl;
  const bBoutique = req.body.bBoutique;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngHotelId", lngHotelId);
      request.input("strHotelName", strHotelName);
      request.input("lngAreaId", lngAreaId);
      request.input("strAddress", strAddress);
      request.input("strPhone", strPhone);
      request.input("strFax", strFax);
      request.input("strEmail", strEmail);
      request.input("strUrl", strUrl);
      request.input("bBoutique", bBoutique);

      request.query(
        "exec bangkokdaytours.BDTspUpdateTourHotel @lngHotelId, @lngAreaId, @strHotelName, @strAddress, @strPhone,@strFax, @strEmail, @strUrl, @bBoutique",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Updated");
        }
      );
    });
    sql.connection = null;
  }
});

//Add BDTspInsertTourHotel
app.post("/api/AddTourHotel", (req, res) => {
  const action = req.body.action;
  const strHotelName = req.body.strHotelName;
  const lngAreaId = req.body.lngAreaId;
  const strAddress = req.body.strAddress;
  const strPhone = req.body.strPhone;
  const strFax = req.body.strFax;
  const strEmail = req.body.strEmail;
  const strUrl = req.body.strUrl;
  const bBoutique = req.body.bBoutique;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("strHotelName", strHotelName);
      request.input("lngAreaId", lngAreaId);
      request.input("strAddress", strAddress);
      request.input("strPhone", strPhone);
      request.input("strFax", strFax);
      request.input("strEmail", strEmail);
      request.input("strUrl", strUrl);
      request.input("bBoutique", bBoutique);

      request.query(
        "exec bangkokdaytours.BDTspInsertTourHotel @lngAreaId, @strHotelName, @strAddress, @strPhone,@strFax, @strEmail, @strUrl, @bBoutique",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Inserted");
        }
      );
    });
    sql.connection = null;
  }
});

//add a new bangkok hotel
app.post("/api/AddBangkokHotel", (req, res) => {
  const action = req.body.action;
  const strHotelName = req.body.strHotelName;
  const lngAreaId = req.body.lngAreaId;
  const strAddress = req.body.strAddress;
  const strPhone = req.body.strPhone;
  const strFax = req.body.strFax;
  const strEmail = req.body.strEmail;
  const strUrl = req.body.strUrl;
  const bBoutique = req.body.bBoutique;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("strHotelName", strHotelName);
      request.input("lngAreaId", lngAreaId);
      request.input("strAddress", strAddress);
      request.input("strPhone", strPhone);
      request.input("strFax", strFax);
      request.input("strEmail", strEmail);
      request.input("strUrl", strUrl);
      request.input("bBoutique", bBoutique);

      request.query(
        "exec bangkokdaytours.BDTspInsertBangkokHotel @lngAreaId, @strHotelName, @strAddress, @strPhone,@strFax, @strEmail, @strUrl, @bBoutique",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Inserted");
        }
      );
    });
    sql.connection = null;
  }
});

//Edit bangkok hotel
app.post("/api/EditBangkokHotel", (req, res) => {
  const action = req.body.action;
  const lngHotelId = req.body.lngHotelId;
  const strHotelName = req.body.strHotelName;
  const lngAreaId = req.body.lngAreaId;
  const strAddress = req.body.strAddress;
  const strPhone = req.body.strPhone;
  const strFax = req.body.strFax;
  const strEmail = req.body.strEmail;
  const strUrl = req.body.strUrl;
  const bBoutique = req.body.bBoutique;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngHotelId", lngHotelId);
      request.input("strHotelName", strHotelName);
      request.input("lngAreaId", lngAreaId);
      request.input("strAddress", strAddress);
      request.input("strPhone", strPhone);
      request.input("strFax", strFax);
      request.input("strEmail", strEmail);
      request.input("strUrl", strUrl);
      request.input("bBoutique", bBoutique);

      request.query(
        "exec bangkokdaytours.BDTspUpdateBangkokHotel @lngHotelId, @lngAreaId, @strHotelName, @strAddress, @strPhone,@strFax, @strEmail, @strUrl, @bBoutique",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Updated");
        }
      );
    });
    sql.connection = null;
  }
});

//Delete BDTspRemoveCitiesByProvince
app.post("/api/RemoveCitiesByProvince", (req, res) => {
  const action = req.body.action;
  const lngProvinceId = req.body.lngProvinceId;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngProvinceId", lngProvinceId);

      request.query(
        "exec bangkokdaytours.BDTspRemoveBangkokHotel @lngProvinceId",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Deleted");
        }
      );
      request.query(
        "exec bangkokdaytours.BDTspRemoveProvince @lngProvinceId",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Deleted");
        }
      );
    });
    sql.connection = null;
  }
});

//DeleteBangkokHotel
app.post("/api/DeleteBangkokHotel", (req, res) => {
  const action = req.body.action;
  const lngHotelId = req.body.lngHotelId;

  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("lngHotelId", lngHotelId);

      request.query(
        "exec bangkokdaytours.BDTspRemoveBangkokHotel @lngHotelId",
        function (err, recordset) {
          if (err) console.log(err);
          res.send("Deleted");
        }
      );
    });
    sql.connection = null;
  }
});

//Check BangkokHotel befor Update
app.post("/api/CheckBangkokHotelNameCountById", (req, res) => {
  const action = req.body.action;
  const hotel_id = req.body.hotel_id;
  const strHotelName = req.body.strHotelName;
  if (action) {
    sql.connect(config, function (err) {
      if (err) console.log(err);
      const request = new sql.Request();
      request.input("hotel_id", hotel_id);
      request.input("strHotelName", strHotelName);
      request.query(
        "exec bangkokdaytours.BDTspBangkokHotelNameCountById @hotel_id, @strHotelName",
        function (err, recordset) {
          if (err) console.log(err);
          if (recordset.rowsAffected > 0) {
            res.send(recordset.recordset);
          } else {
            res.send();
          }
        }
      );
    });
    sql.connection = null;
  }
});

//Test API
app.get("/api/GetCityAreas", (req, res) => {
  // if (action) {
  sql.connect(config, function (err) {
    if (err) console.log(err);
    const request = new sql.Request();
    request.query(
      "exec bangkokdaytours.BDTspGetTourHotelContactList '10'",
      function (err, recordset) {
        if (err) console.log(err);
        if (recordset.rowsAffected > 0) {
          res.send(recordset.recordset);
        } else {
          res.send();
        }
      }
    );
  });
  sql.connection = null;
  // }
});


// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
