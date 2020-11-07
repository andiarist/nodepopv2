module.exports = {
  apps : [{
    name: 'thumbnailService',
    script: './microservices/thumbnailService.js',
    watch: './microservices/thumbnailService.js'
  },
  {
    name: 'nodepopv2',
    script: './bin/www',
    watch: './bin/www'
  }],

  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
