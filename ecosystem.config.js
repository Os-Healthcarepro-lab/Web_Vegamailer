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
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      time: true,
      min_uptime: '10s',
      max_restarts: 10
    },
    {
      name: 'vegamailer-pocketbase',
      cwd: './apps/pocketbase',
      script: './pocketbase',
      args: 'serve --http=127.0.0.1:8090 --encryptionEnv=PB_ENCRYPTION_KEY --migrationsDir=./pb_migrations --hooksDir=./pb_hooks',
      interpreter: 'none',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      error_file: './logs/pocketbase-error.log',
      out_file: './logs/pocketbase-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      time: true,
      min_uptime: '10s',
      max_restarts: 10,
      env: {
        PB_ENCRYPTION_KEY: process.env.PB_ENCRYPTION_KEY,
        PB_SUPERUSER_EMAIL: process.env.PB_SUPERUSER_EMAIL,
        PB_SUPERUSER_PASSWORD: process.env.PB_SUPERUSER_PASSWORD
      }
    }
  ]
};
