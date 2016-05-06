const DOCKER_REMOVE = 'docker rm -f $(docker ps -aq)'
const DOCKER_PULL = 'docker pull bablot/travis-test';
const DOCKER_RUN = 'docker run -d --name bablotcontainer -p 8888:8888 bablot/travis-test npm start';

module.exports = function(shipit) {
  shipit.initConfig({
    staging: {
      servers: 'deploy@162.243.218.96',
      key: 'deploy_key'
    }
  });

  shipit.task('deploy', ()=> {
    return shipit.remote('pwd && ls')
  });
};
