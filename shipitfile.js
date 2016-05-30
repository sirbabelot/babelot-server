const APP_PATH = '/home/deploy/app'
module.exports = function(shipit) {
  shipit.initConfig({
    staging: {
      servers: 'deploy@162.243.218.96',
      // key: 'deploy_key'
    }
  });

  shipit.task('deploy', ()=> {
   return shipit
        .remoteCopy('docker-compose.yml', APP_PATH)
        .then(()=> shipit.remoteCopy('docker-compose.prod.yml', APP_PATH))
        .then(()=> shipit.remoteCopy('./bash/deploy.sh', APP_PATH))
        .then(()=> shipit.remote(`sh ${APP_PATH}/deploy.sh ${APP_PATH}`));
  });
};
