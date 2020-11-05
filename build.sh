#!/bin/sh
export PYTHON=/usr/bin/python
cd /app/project
npm i
ionic build --engine=browser --prod
cp -r www ../www
cd /app
rm -rf /app/project/*

