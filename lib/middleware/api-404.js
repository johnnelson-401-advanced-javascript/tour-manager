module.exports = (req, res) => {
  console.log(req.url);
  res.status(404).json({
    error: `API path ${req.url} not found`
  });
};