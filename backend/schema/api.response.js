const zlib = require("zlib");
const jsonSize = require("json-size");

module.exports.success = function (res, req, data) {
  const formattedResponse = {
    success: true,
    data: data,
  };
  if (req.query && req.query.ct && req.query.ct == 1) {
    // const data_size_mega_bytes = jsonSize(data) / 1000000
    if (jsonSize(data) > 2000) {
      // Greater than 1 MB then apply GZIP
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Content-Encoding": "gzip",
      });
      // const buf = new Buffer(JSON.stringify(formattedResponse), 'utf-8');
      const buf = Buffer.from(JSON.stringify(formattedResponse), "utf-8");
      zlib.gzip(buf, function (_, result) {
        res.end(result);
      });
    } else {
      return res.status(200).send(formattedResponse);
    }
  } else {
    return res.status(200).send(formattedResponse);
  }
};

module.exports.pagination = function (res, req, data, total_records) {
  res.setHeader("total-records", total_records);
  return this.success(res, req, data);
};

module.exports.success_with_headers = function (res, req, data, headers) {
  if (headers.length > 0) {
    for (let i = 0; i < headers.length; i++) {
      res.setHeader(headers[i].key, headers[i].value);
    }
  }
  return this.success(res, req, data);
};

module.exports.fail = function (res, data, status = 400) {
  if (status === 403 && (data == "" || !data)) data = "You are not allowed";
  if (status === 401 && (data == "" || !data)) data = "Unauthorized";
  const formattedResponse = {
    success: false,
    data: data,
  };

  return res.status(status).send(formattedResponse);
};
