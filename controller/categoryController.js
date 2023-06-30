const categoryModel = require("../model/categoryModel");
const cartegoryModel = require("../model/categoryModel");
const slugify = require('slugify');
const addCategory=async(req,res)=>{
    const title = req.body.title;
    const slug = slugify(title, { lower: true });
    const errors = req.validationErrors();
    if (errors) {
      res.render('categories', {
        success: true,
        title: title,
        errors: errors
      });
    } else {
      const category = await cartegoryModel.findOne({ slug: slug}).exec();
      if (category) {
        req.flash('danger', 'Category title exists. Please choose another title.');
        res.render('categories',{
          success: true,
          title: title,
          errors:errors
         // msg:'ategory title exists. Please choose another title.'
        });
      } else {
        const categoryNew = new categoryModel({
          title: title,
          slug:slug,
        });
        await categoryNew.save();
       req.flash('success', 'Category title added successfully.');
        res.redirect('/addproduct');
      }
    }
  
    }
      
const getCategory=async(req,res)=>{

  try {
    const categories = await cartegoryModel.find().exec();
    res.render('admincategories',{ success: true, msg: "successfully", categories });
  } catch (error) {
    console.log(error);
  }   
}

const editCategory = async (req, res) => {
  try {
    const catId = req.params._id.replace(':', '');
    const cat = await categoryModel.findOne({ _id: catId });

    if (!cat) {
      // Handle the case where the category is not found
      return res.status(404).send('Category not found');
    }

    res.render('edit_category', {
      success: true,
      title: cat.title,
      _id: cat._id,
      cat
    });
  } catch (err) {
    console.log(err);
    // Handle any other errors that occur during the execution
    res.status(500).send('Internal Server Error');
  }
};
const updateCategory=async(req,res)=>{
  try {
    let id = req.params._id.replace(':', '');
    const cat = await categoryModel.findById(id);
  
    if (cat != null) {
      // Check if the title already exists
      const existingCat = await categoryModel.findOne({ title: req.body.title });
  
      if (existingCat && existingCat._id.toString() !== cat._id.toString()) {
        // Title already exists and it belongs to a different cat
        res.status(400).send({ success: false, msg: "Title already exists" });
      } else {
        // Update the cat
        cat.title = req.body.title;
        cat.slug = req.body.title;
  
        console.log("Updated cat:", cat);
  
        // Save the updated cat
        await cat.save();
        console.log(cat);
  
        res.render('addproduct',{ success: true, msg: "Cat updated successfully", cat });
      }
    } else {
      res.render('admincategories',{ success: false, msg: "Cat not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, msg: "Internal server error" });
  }
}
 //delete category
 const deleteCategory=async(req,res)=>{
  try {
    const id = req.params._id.replace(':', '');
    // Find the product by ID and remove it
    const categories = await categoryModel.findByIdAndRemove(id);
    
    if (categories) {
      res.redirect('/category');
    } else {
      res.redirect('/category');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, msg: "Internal server error" });
  }
}
 




 
module.exports= {getCategory,addCategory,editCategory,updateCategory,deleteCategory};