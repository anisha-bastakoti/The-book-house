const { json } = require("express");

class ApiFeature {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
//  For Search Product
search() {
  const keyword= this.queryStr.keyword
    ? {
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
        author : {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      }
    : {};
  this.query = this.query.find({ ...keyword });
  return this;
}



  


  // For Filter Product by Category and Price Range 
   
  filter() {
    const queryCopy = { ...this.queryStr };
    // Applying Filter of Product
    const removedFields = ["keyword", "page", "limit"];
    removedFields.forEach(key=>delete queryCopy[key])

    
    // For Price Filter
    let  queryStr = JSON.stringify(queryCopy)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`)
    this.query = this.query.find(JSON.parse(queryStr))
  
     
    //for category
    if (queryCopy.category) {
    this.query = this.query.find({ category: queryCopy.category });
  }

  this.query = this.query.find(JSON.parse(queryStr));
  console.log(queryStr);
  return this;
    

  }

  // For pagination 
  pagination(resultPerPage){
    const currentPage = Number(this.queryStr.page)
    const skip = resultPerPage * (currentPage - 1)
    this.query = this.query.limit(resultPerPage).skip(skip)
    return this
  }
}

module.exports = ApiFeature;