import xss from "xss";

const sanitize = (req, res, next) => {
  if (req.body) {
    req.body = JSON.parse(xss(JSON.stringify(req.body)));
  }

  next();
};

export default sanitize;
