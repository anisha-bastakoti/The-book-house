var express=require('express');
var router=express.Router();
//get page model

var page = require('../model/pageModel');

// Get pages index
router.get('/pages', function(req, res) {
    page.find({}).sort({ sorting: 1 }).exec(function(err, pages) {
           if (err) {
          console.log(err);
         // res.send({sucess:true,msg:"msg is sent",pages:pages});
          res.render('pages', { pages,title,slug,content}); // Pass an empty array to handle the error case
        } else {
         //res.render('pages', { pages ,title,slug,content});
         res.send({sucess:true,msg:"msg is sent",pages});
          console.log(pages);
        }
      });
  });


//get addpage
router.get('/addpage',function(req,res){
let title=" ";
let slug=" ";
let content=" ";
res.render('addpage',
{title:title,
 slug:slug,
content:content,
})
})
//postpages
router.post('/addpage',async(req,res)=>{
        try {
            req.checkBody('title', 'Title must be filled').notEmpty();
            req.checkBody('content', 'Content must be filled').notEmpty();
            var title = req.body.title;
            var slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
            if (slug === '') slug = title.replace(/\s+/g, '-').toLowerCase();
            var content = req.body.content;
            var errors = req.validationErrors();
            if (errors) {
              res.render('addpage', {
                errors: errors,
                title: title,
                slug: slug,
                content: content
              });
            } else {
              const existingPage = await page.findOne({ slug: slug });
              if (existingPage) {
                req.flash('danger', 'Page slug already exists. Please choose a different slug.');
                res.render('addpage', {
                  title: title,
                  slug: slug,
                  content: content,
                  sorting: 100
                });
              } else {
                const newPage = new page({
                  title: title,
                  slug: slug,
                  content: content,
                  sorting: 0
                });
                newPage.save();
                req.flash('success', 'Page added.');
                res.redirect('/pages');
                //res.send({sucess:true,msg:'msg is sent'})
              }
            }
          } catch (error) {
            console.log(error.msg);
          }
        })
          



module.exports=router;