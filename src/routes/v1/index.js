const sessionsRouter = require('./sessions.rotues');

module.exports = function(app){
  app.get('/health', (_req, res) => res.status(200).send('<h2>HEALTHY V1.1.3</h2>'));
  app.use('/api/v1/sessions', sessionsRouter);
};
