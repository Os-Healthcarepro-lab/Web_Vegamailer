module.exports = {
  apps: [
    {
      name: 'vegamailer-api',
      cwd: './apps/api',
      script: 'src/main.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
      time: true
    },
    {
      name: 'vegamailer-pocketbase',
      cwd: './apps/pocketbase',
      script: './pocketbase',
      args: 'serve --http=127.0.0.1:8090',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      error_file: './logs/pocketbase-error.log',
      out_file: './logs/pocketbase-out.log',
      time: true
    }
  ]
};
