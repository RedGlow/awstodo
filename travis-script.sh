#!/bin/bash
set -ev
npm test
npm run integrationtest
cd todoapi
serverless deploy --region eu-central-1