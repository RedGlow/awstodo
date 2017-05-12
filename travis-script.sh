#!/bin/bash
set -ev
npm test
npm run integrationtest
cp package.json todoapi
cd todoapi
serverless deploy --region eu-central-1