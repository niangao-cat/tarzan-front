#!/usr/bin/env bash
#echo ">>> git pull"
#git pull

# Skip resolving dependency of PUPPETEER
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

# OP or SAAS
readonly BUILD_PLATFORM_VERSION="SAAS"
readonly BUILD_CLIENT_ID="hzero-front"
readonly BUILD_API_HOST="http://mespro.raycus.com"
readonly BUILD_BPM_HOST="http://mespro.raycus.com:8220"
readonly BUILD_WEBSOCKET_HOST="ws://mespro-1.raycus.com:8080/hpfm/websocket"
# websocket 直连正式环境 96节点 pro-1

# Fix error "computed integrity doesn't match our records ..."
#rm -f yarn.lock
#yarn --registry http://mobile-app.hand-china.com/nexus/content/groups/hippius-ui-group/
#yarn --registry http://nexus.saas.hand-china.com/content/groups/hzero-npm-group/
# lerna run transpile
# yarn build:dll
# yarn build

if [[ -d "dist" ]]; then
    echo "Substituting placeholders ..."
    case $(uname -s) in
    Linux | MINGW*)
        find dist -name '*.js' | xargs sed -i "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"
        find dist -name '*.js' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
        find dist -name '*.js' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
        find dist -name '*.js' | xargs sed -i "s BUILD_BPM_HOST $BUILD_BPM_HOST g"
        find dist -name '*.js' | xargs sed -i "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
        ;;
    Darwin)
        find dist -name '*.js' | xargs sed -i' ' "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"
        find dist -name '*.js' | xargs sed -i' ' "s BUILD_API_HOST $BUILD_API_HOST g"
        find dist -name '*.js' | xargs sed -i' ' "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
        find dist -name '*.js' | xargs sed -i' ' "s BUILD_BPM_HOST $BUILD_BPM_HOST g"
        find dist -name '*.js' | xargs sed -i' ' "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
        ;;
    *)
        echo "Unsupported platform!"
        exit 1
        ;;
    esac
fi

rm -rf html
mv dist html
echo ">>>>>>>>>>>>>>>>> bulid success <<<<<<<<<<<<<<<<<<<<"
