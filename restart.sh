npm i
pm2 delete "ai-report-next-server"
npm run build
pm2 start npm --name "ai-report-next-server" -- run start