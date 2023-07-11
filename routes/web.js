const cartController =require('../controller/customers/cartController');
const orderController=require('../controller/customers/orderController');
const adminOrderController=require('../controller/admin/adminController');
const statusController=require('../controller/admin/statusController');
function initRoutes(app){
app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)

    // Customer routes
    app.post('/orders',  orderController().store)
    app.get('/customer/orders',  orderController().index)
    app.get('/customer/orders/:id',  orderController().show)

    // Admin routes
    app.get('/admin/orders',  adminOrderController().index)
    app.post('/admin/order/status',  statusController().update)
}

module.exports = initRoutes