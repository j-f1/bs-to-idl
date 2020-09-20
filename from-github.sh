#!/bin/sh
curl $(node convert-github $1) | node . > $2
