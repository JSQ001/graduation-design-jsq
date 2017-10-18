#! /bin/sh -e

echo "setting environment config"
echo "$ARTEMIS_WS_URL"
echo "$ARTEMIS_URL"
echo "$BRMS_URL"

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
        proxy_set_header Host \$host;
    }
    location /api/ {
        proxy_pass $ARTEMIS_URL/api/;
        proxy_set_header Host \$host;
        client_max_body_size 10m;
    }

#    location /brms/ {
#        proxy_pass $BRMS_URL/brms;
#        proxy_set_header Host \$host;
#        client_max_body_size 10m;
#    }
}
EOF

echo "starting web server"

nginx -g 'daemon off;'
