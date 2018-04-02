#!/bin/sh

# set app dir
APP_DIR="little_mobile"
# build dir
BUILD_DIR="dist"
# tar.gz dir
TGZ_DIR="out"


# DON'T EDIT

if [[ ! -d ${BUILD_DIR} ]]; then
  mkdir ${BUILD_DIR}
else
  rm -rf ${BUILD_DIR}/*
fi

if [[ ! -d ${TGZ_DIR} ]]; then
  mkdir ${TGZ_DIR}
else
  rm -rf ${TGZ_DIR}/*
fi

# build
npm run build

# name
DATE=`date +%Y%m%d%H%M`
VERSION=`grep "version" package.json | sed 's/[\",]//g' | awk '{print $2}'`
BUILD=${VERSION}-${DATE}
echo ${BUILD}

# deploy
cd ${BUILD_DIR}
tar cvf ../${TGZ_DIR}/${BUILD}.tgz .
scp ../${TGZ_DIR}/${BUILD}.tgz root@192.168.2.111:~/deploy/pages/${APP_DIR}/
ssh root@192.168.2.111 "cd deploy/pages; ./deploy.sh ${APP_DIR}"
cd -
