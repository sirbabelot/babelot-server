module.exports = function(shipit) {
  shipit.initConfig({
    staging: {
      servers: 'deploy@162.243.218.96',
      key: 'deploy_key'
    }
  });

  shipit.task('deploy', ()=> {
   return shipit
        .remote('mkdir -p app')
        .then(()=> shipit.remoteCopy('docker-compose.yml', './app/docker-compose.yml'))
        .then(()=> shipit.remoteCopy('docker-compose.prod.yml', './app/docker-compose.prod.yml'))
        .then(()=> shipit.remote(`
          cd app &&
          docker-compose -f docker-compose.yml -f docker-compose.prod.yml stop &&
          docker-compose -f docker-compose.yml -f docker-compose.prod.yml rm &&
          docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull &&
          docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`));
  });
};
