#! /bin/sh -e

echo "setting environment config"
echo "$ARTEMIS_WS_URL"
echo "$ARTEMIS_URL"

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

    location /api/budget/ {
        proxy_pass $BUDGET_URL/api/budget/;
    }

    location /api/cash/ {
        proxy_pass $PAY_URL/api/cash/;
    }

}
EOF

echo "starting web server"

nginx -g 'daemon off;'
