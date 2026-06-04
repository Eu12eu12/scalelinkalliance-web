#!/bin/bash
cd Frontend
npm install --include=dev
npm run build
cd ..
npm install
node server.cjs