#!/bin/bash
set -ev
npm test
cd todoapi
npm install
serverless deploy --stage dev
cd ..
npm run integrationtest