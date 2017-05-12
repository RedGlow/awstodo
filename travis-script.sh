#!/bin/bash
set -ev
npm test
cd todoapi
npm install
serverless deploy --stage dev
npm run integrationtest