import express from 'express';

import users from './users/users.route';
import roles from './roles/roles.route';
import menus from './menus/menus.route';
import countries from './countries/countries.route';
import states from './states/states.route';
import cities from './cities/cities.route';

const router = express();

router.use('/users', users);
router.use('/roles', roles);
router.use('/menus', menus);
router.use('/countries', countries);
router.use('/states', states);
router.use('/cities', cities);

export default router