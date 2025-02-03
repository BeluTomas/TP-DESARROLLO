import routerx from 'express-promise-router';
import auth from '../middlewares/auth';

import User from './User';
import Categorie from './Categorie';
import Product from './Product';
import Slider from './Slider';
import Cupone from './Cupone';
import Discount from './Discount';
import Home from './Home';
import Cart from './Cart';
import AddressClient from './AddressClient';
import Sale from './Sale';
import Review from './Review';

const router = routerx();

router.use('/users', User);
router.use('/categories', auth.verifyEcommerce, Categorie);
router.use('/products', auth.verifyEcommerce, Product);
router.use('/sliders', auth.verifyEcommerce, Slider);
router.use('/cupones', auth.verifyEcommerce, Cupone);
router.use('/discount', auth.verifyEcommerce, Discount);
router.use('/home', Home); 
router.use('/cart', auth.verifyEcommerce, Cart);
router.use('/address_client', auth.verifyEcommerce, AddressClient);
router.use('/sale', auth.verifyEcommerce, Sale);
router.use('/review', auth.verifyEcommerce, Review);

export default router;
