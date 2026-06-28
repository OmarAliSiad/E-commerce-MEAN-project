const mongoose = require('mongoose');
const uri = 'mongodb://mohamed:dlGxV2xl6NlqzIwy@ac-nuavow7-shard-00-00.k0oixos.mongodb.net:27017,ac-nuavow7-shard-00-01.k0oixos.mongodb.net:27017,ac-nuavow7-shard-00-02.k0oixos.mongodb.net:27017/ECommerce-Project-ITI?ssl=true&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(uri).then(async () => {
  const Product = require('./server/models/Product.js');
  const res = await Product.updateMany(
    { name: { $in: ['new product', 'product2', 'prod1'] }, images: { $size: 0 } },
    { $set: { images: ['https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg'] } }
  );
  console.log('Fixed', res.modifiedCount, 'products');
  process.exit(0);
});