const DOCKER_REMOVE = 'docker rm -f $(docker ps -aq)'
const DOCKER_PULL = 'docker pull bablot/travis-test';
const DOCKER_RUN = 'docker run -d --name bablotcontainer -p 8888:8888 bablot/travis-test npm start';

module.exports = function(shipit) {
  shipit.initConfig({
    staging: {
      servers: 'deploy@107.170.2.166',
      key: 'key.pem'
    }
  });

  shipit.task('deploy', ()=> {
    return shipit.remote('pwd && ls')
  });
};
