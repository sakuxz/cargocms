module.exports = {
  download: async (req, res) => {
    try {
      let { query } = req;
      const fileName = query.fileName
      const result = await ExportService.downloadExport(fileName);
      res.attachment(fileName);
      res.end(result, 'UTF-8');
    } catch (e) {
      res.serverError(e);
    }
  }
}
