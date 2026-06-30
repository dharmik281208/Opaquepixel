module.exports = {
  apps: [
    {
      name: 'opaquepixel-keep-alive',
      script: 'ping.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '100M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
