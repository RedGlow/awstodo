#!/bin/bash
set -ev
npm test
npm run integrationtest
cp package.json todoapi
cd todoapi
npm install
serverless deploy