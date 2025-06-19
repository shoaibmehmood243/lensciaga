const app = require('./app');
const appRoutes = require('./routes');
const PORT = process.env.PORT || 5001;

(async () => {
	try {
		app.use('/api', appRoutes);

		app.use((req, res) =>
			res.status(404).json({
				message: `${req.protocol}://${req.get('host')}${req.originalUrl}: not a Valid Path!`,
				code: 11000,
			})
		);

		// @Note: All the Errors caught in base middleware will be of critical type;
		app.use((err, req, res, next) => {
			if (res.headersSent) return next(err);
			return res.status(500).json({
				message: err.message || err || 'Something went wrong!',
				code: 13000,
			});
		});

		await app.listen(PORT);
		console.log(`Server started on port ${PORT}`);
	} catch (error) {
		// report error
		throw new Error(error);
	}
})();