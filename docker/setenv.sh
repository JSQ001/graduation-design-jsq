#! /bin/sh -e

echo "setting environment config"
echo "$ARTEMIS_WS_URL"
echo "$ARTEMIS_URL"

#cat >> /app/www/scripts/app.constants.js <<EOF
#angular.module('HLYAdminWebApp').constant('ServiceBaseURL', '').constant('SocketBaseURL', '$ARTEMIS_WS_URL');
#EOF

cat >> /etc/nginx/conf.d/hly-admin.conf <<EOF
server {
    listen      80;
    server_name   $SERVER_NAME;
    location / {
        try_files \$uri /index.html;
        root /app/www/;
    }

    location /oauth/ {
        proxy_pass $ARTEMIS_URL/oauth/;
    }

    location /api/ {
        proxy_pass $ARTEMIS_URL/api/;
    }

    location /api/budget/  {
        proxy_pass $BUDGET_URL/api/budget/;
        proxy_set_header Host \$host;
        client_max_body_size 10m;
    }

    location /api/cash/ {
        proxy_pass $PAY_URL/api/cash;
        proxy_set_header Host \$host;
        client_max_body_size 10m;
    }
}
EOF

echo "starting web server"

nginx -g 'daemon off;'
