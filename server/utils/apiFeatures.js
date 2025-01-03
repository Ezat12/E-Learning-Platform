class ApiFeatures {
  constructor(moduleMongoose, queryString) {
    this.moduleMongoose = moduleMongoose;
    this.queryString = queryString;
  }
  filtering() {
    const inQuery = ["limit", "skip", "sort", "keyword", "fields"];
    let dataQuery = {};

    if (this.queryString) {
      let allQuery = { ...this.queryString };
      Object.keys(allQuery).map((q) => {
        if (inQuery.includes(q)) {
          delete allQuery[q];
        }
      });
      dataQuery = { ...allQuery };
    }

    if (Object.keys(dataQuery).length >= 1) {
      Object.keys(dataQuery)?.map((item) => {
        // console.log(dataQuery[item]);
        dataQuery[item] = dataQuery[item]?.split(",");
      });
    }

    this.moduleMongoose = this.moduleMongoose.find(dataQuery);
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.moduleMongoose.sort(this.queryString.sort);
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.moduleMongoose = this.moduleMongoose.limit(limit).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
