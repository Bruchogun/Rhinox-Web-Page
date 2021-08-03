import sirv from 'sirv';
import polka from 'polka';
import * as sapper from '@sapper/server';
import responseHelpers from './middlewares/responseHelpers';
import sessions from './middlewares/sessions';
import morgan from 'morgan';
import { json } from 'body-parser';
import requireLogin from './middlewares/requireLogin';


const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

// @ts-ignore
export default polka() // You can also use Express
	.use(
		morgan(dev ? 'dev' : 'combined'),
		sirv('static', { dev }),
		sessions(dev),
	)
	.use('/api',
		responseHelpers,
		requireLogin,
		json(),
	)
	.use(
		sapper.middleware({
			session: (req) => ({user: req.session.user})
		})
	)
	.listen(PORT, err => {
		if (err) console.log('error', err);
	});
