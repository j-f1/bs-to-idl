#!/bin/sh
curl $(node $(dirname $0)/convert-github $1) | node $(dirname $0) > $2
